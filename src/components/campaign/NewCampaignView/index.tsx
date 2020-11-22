import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { filter, forEach, map, throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import PickerStyleButton from '@components/core/PickerStyleButton';
import EditText from '@components/core/EditText';
import {
  CORE,
  CUSTOM,
  TDE,
  TDEA,
  TDEB,
  CampaignDifficulty,
  CustomCampaignLog,
  Deck,
  Slots,
  INCOMPLETE_GUIDED_CAMPAIGNS,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import CampaignSelector from './CampaignSelector';
import CampaignNoteSectionRow from './CampaignNoteSectionRow';
import { getCampaignLog, getChaosBag, difficultyString } from '../constants';
import { maybeShowWeaknessPrompt } from '../campaignHelper';
import AddCampaignNoteSectionDialog from '../AddCampaignNoteSectionDialog';
import NavButton from '@components/core/NavButton';
import SettingsSwitch from '@components/core/SettingsSwitch';
import ChaosBagLine from '@components/core/ChaosBagLine';
import DeckSelector from './DeckSelector';
import WeaknessSetPackChooserComponent from '@components/weakness/WeaknessSetPackChooserComponent';
import { showCampaignDifficultyDialog } from '@components/campaign/CampaignDifficultyDialog';
import { getNextCampaignId } from '@reducers';
import { newCampaign, newLinkedCampaign, newStandalone } from '@components/campaign/actions';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/Card';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import COLORS from '@styles/colors';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationButtonPressed, usePlayerCards, useSlots } from '@components/core/hooks';
import { CampaignSelection } from '../SelectCampaignDialog';

interface CampaignChoice {
  selection: CampaignSelection;
  campaign: string;
  hasGuide: boolean;
}

function getKeyName(
  isCount?: boolean,
  perInvestigator?: boolean
): keyof CustomCampaignLog {
  if (perInvestigator) {
    if (isCount) {
      return 'investigatorCounts';
    }
    return 'investigatorSections';
  }
  if (isCount) {
    return 'counts';
  }
  return 'sections';
}

function NewCampaignView({ componentId }: NavigationProps) {
  const { backgroundStyle, borderStyle, colors, typography } = useContext(StyleContext);
  const nextId = useSelector(getNextCampaignId);
  const cards = usePlayerCards();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [{ selection, campaign, hasGuide }, setCampaignChoice] = useState<CampaignChoice>({
    selection: {
      type: 'campaign',
      code: CORE,
    },
    campaign: t`The Night of the Zealot`,
    hasGuide: true,
  });
  const [guided, toggleGuided] = useFlag(true);
  const [difficulty, setDifficulty] = useState<CampaignDifficulty>(CampaignDifficulty.STANDARD);
  const [deckIds, setDeckIds] = useState<number[]>([]);
  const [investigatorIds, setInvestigatorIds] = useState<string[]>([]);
  const [investigatorToDeck, setInvestigatorToDeck] = useState<{ [code: string]: number }>({});
  const [weaknessPacks, setWeaknessPacks] = useState<string[]>([]);
  const [weaknessAssignedCards, updateWeaknessAssignedCards] = useSlots({});
  const [customChaosBag, setCustomChaosBag] = useState<ChaosBag>(getChaosBag(CORE, CampaignDifficulty.STANDARD));
  const [customCampaignLog, setCustomCampaignLog] = useState<CustomCampaignLog>({ sections: [t`Campaign Notes`] });
  const [campaignLogDialogVisible, setCampaignLogDialogVisible] = useState(false);
  const isGuided = hasGuide && guided;

  const hasDefinedChaosBag = useMemo(() => {
    return selection.type === 'campaign' && selection.code !== CUSTOM && !!getChaosBag(selection.code, difficulty);
  }, [selection, difficulty]);
  const chaosBag: ChaosBag = useMemo(() => {
    if (hasDefinedChaosBag && selection.type === 'campaign') {
      return getChaosBag(selection.code, difficulty);
    }
    return customChaosBag;
  }, [selection, difficulty, customChaosBag, hasDefinedChaosBag]);

  const hasDefinedCampaignLog = useMemo(() => {
    return (selection.type === 'campaign' && selection.code !== CUSTOM && !!getCampaignLog(selection.code));
  }, [selection]);

  const campaignLog = useMemo(() => {
    if (hasDefinedCampaignLog && selection.type === 'campaign') {
      return getCampaignLog(selection.code);
    }
    return customCampaignLog;
  }, [selection, customCampaignLog, hasDefinedCampaignLog]);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: selection.type === 'campaign' ? t`New Campaign` : t`New Standalone`,
        },
        rightButtons: [{
          text: t`Done`,
          id: 'save',
          enabled: selection.type !== 'campaign' || selection.code !== CUSTOM || !!name,
          color: COLORS.M,
          accessibilityLabel: t`Done`,
        }],
      },
    });
  }, [componentId, name, selection]);

  const addCampaignNoteSection = useCallback((name: string, isCount?: boolean, perInvestigator?: boolean) => {
    const updatedCustomCampaignLog = { ...customCampaignLog };
    const keyName: keyof CustomCampaignLog = getKeyName(isCount, perInvestigator);
    updatedCustomCampaignLog[keyName] = [
      ...(updatedCustomCampaignLog[keyName] || []),
      name,
    ];
    setCustomCampaignLog(updatedCustomCampaignLog);
  }, [customCampaignLog, setCustomCampaignLog]);

  const deleteCampaignNoteSection = useCallback((name: string, isCount?: boolean, perInvestigator?: boolean) => {
    const updatedCustomCampaignLog = { ...customCampaignLog };
    const keyName = getKeyName(isCount, perInvestigator);
    updatedCustomCampaignLog[keyName] = filter(
      updatedCustomCampaignLog[keyName] || [],
      sectionName => name !== sectionName);
    setCustomCampaignLog(updatedCustomCampaignLog);
  }, [customCampaignLog, setCustomCampaignLog]);

  const showCampaignLogDialog = useCallback(() => {
    setCampaignLogDialogVisible(true);
  }, [setCampaignLogDialogVisible]);

  const hideCampaignLogDialog = useCallback(() => {
    setCampaignLogDialogVisible(false);
  }, [setCampaignLogDialogVisible]);

  const onNameChange = useCallback((name?: string) => {
    setName(name || '');
  }, [setName]);

  const updateWeaknessAssigned = useCallback((weaknessAssignedCards: Slots) => {
    updateWeaknessAssignedCards({ type: 'sync', slots: weaknessAssignedCards });
  }, [updateWeaknessAssignedCards]);

  const checkDeckForWeaknessPrompt = useCallback((deck: Deck) => {
    if (cards) {
      maybeShowWeaknessPrompt(deck, cards, weaknessAssignedCards, updateWeaknessAssigned);
    }
  }, [cards, weaknessAssignedCards, updateWeaknessAssigned]);

  const investigatorAdded = useCallback((card: Card) => {
    setInvestigatorIds([...investigatorIds, card.code]);
  }, [investigatorIds, setInvestigatorIds]);

  const investigatorRemoved = useCallback((card: Card) => {
    setInvestigatorIds(filter(investigatorIds, id => id !== card.code));
  }, [investigatorIds, setInvestigatorIds]);

  const deckAdded = useCallback((deck: Deck) => {
    setDeckIds([...deckIds, deck.id]);
    setInvestigatorIds([...investigatorIds, deck.investigator_code]);
    setInvestigatorToDeck({
      ...investigatorToDeck,
      [deck.investigator_code]: deck.id,
    });
    checkDeckForWeaknessPrompt(deck);
  }, [setDeckIds, setInvestigatorIds, setInvestigatorToDeck, checkDeckForWeaknessPrompt, deckIds, investigatorIds, investigatorToDeck]);

  const deckRemoved = useCallback((id: number, deck?: Deck) => {
    const updatedInvestigatorToDeck: { [code: string]: number } = {};
    forEach(investigatorToDeck, (deckId, code) => {
      if (deckId !== id) {
        updatedInvestigatorToDeck[code] = deckId;
      }
    });
    setDeckIds(filter(deckIds, deckId => deckId !== id));
    setInvestigatorIds(!deck ? investigatorIds : filter([...investigatorIds], code => deck.investigator_code !== code));
    setInvestigatorToDeck(updatedInvestigatorToDeck);
  }, [investigatorToDeck, deckIds, investigatorIds, setDeckIds, setInvestigatorIds, setInvestigatorToDeck]);

  const placeholderName = useMemo(() => {
    if (selection.type === 'campaign' && selection.code === CUSTOM) {
      return t`(required)`;
    }
    if (selection.type === 'standalone') {
      return campaign;
    }
    return t`My ${campaign} Campaign`;
  }, [campaign, selection]);

  const onSave = useCallback(() => {
    if (selection.type === 'campaign') {
      if (selection.code === TDE) {
        dispatch(newLinkedCampaign(
          nextId,
          name || placeholderName,
          TDE,
          TDEA,
          TDEB,
          {
            packCodes: weaknessPacks,
            assignedCards: weaknessAssignedCards,
          }
        ));
      } else {
        // Save to redux.
        dispatch(newCampaign(
          nextId,
          name || placeholderName,
          selection.code,
          isGuided ? undefined : difficulty,
          deckIds,
          investigatorIds,
          chaosBag,
          campaignLog,
          {
            packCodes: weaknessPacks,
            assignedCards: weaknessAssignedCards,
          },
          isGuided
        ));
      }
    } else {
      dispatch(newStandalone(
        nextId,
        name || placeholderName,
        selection.id,
        deckIds,
        investigatorIds,
        {
          packCodes: weaknessPacks,
          assignedCards: weaknessAssignedCards,
        },
      ));
    }
    Navigation.pop(componentId);
  }, [dispatch, componentId, campaignLog, chaosBag, placeholderName, nextId, name, selection,
    difficulty, deckIds, investigatorIds, weaknessPacks, weaknessAssignedCards, isGuided]);

  const savePressed = useMemo(() => throttle(onSave, 200), [onSave]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'save') {
      savePressed();
    }
  }, componentId, [savePressed]);

  const showChaosBagDialog = useCallback(() => {
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag: customChaosBag,
          updateChaosBag: setCustomChaosBag,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    });
  }, [componentId, customChaosBag, setCustomChaosBag]);

  const showDifficultyDialog = useCallback(() => {
    showCampaignDifficultyDialog(setDifficulty);
  }, [setDifficulty]);

  const campaignChanged = useCallback((selection: CampaignSelection, campaign: string, hasGuide: boolean) => {
    setCampaignChoice({
      selection,
      campaign,
      hasGuide,
    });
  }, [setCampaignChoice]);

  const chaosBagLine = useMemo(() => {
    return (
      <View style={styles.block}>
        <Text style={typography.mediumGameFont}>
          { t`Chaos Bag` }
        </Text>
        <View style={space.marginTopS}>
          <ChaosBagLine chaosBag={chaosBag} />
        </View>
      </View>
    );
  }, [typography, chaosBag]);

  const weaknessSetSection = useMemo(() => {
    return (
      <View style={[space.paddingBottomS, styles.underline, borderStyle]}>
        <View style={styles.block}>
          <Text style={typography.mediumGameFont}>
            { t`Weakness Set` }
          </Text>
          <Text style={typography.small}>
            { t`Include all basic weaknesses from these expansions` }
          </Text>
        </View>
        <View style={[space.paddingXs, space.paddingRightS]}>
          <WeaknessSetPackChooserComponent
            componentId={componentId}
            compact
            onSelectedPacksChanged={setWeaknessPacks}
          />
        </View>
      </View>
    );
  }, [componentId, borderStyle, typography, setWeaknessPacks]);

  const campaignSectionDialog = useMemo(() => {
    return (
      <AddCampaignNoteSectionDialog
        visible={campaignLogDialogVisible}
        addSection={addCampaignNoteSection}
        hide={hideCampaignLogDialog}
      />
    );
  }, [campaignLogDialogVisible, addCampaignNoteSection, hideCampaignLogDialog]);

  const chaosBagSection = useMemo(() => {
    if (guided || selection.type === 'standalone') {
      return null;
    }
    return hasDefinedChaosBag ? (
      <View style={[styles.underline, borderStyle]}>
        { chaosBagLine }
      </View>
    ) : (
      <NavButton onPress={showChaosBagDialog} color={colors.background}>
        { chaosBagLine }
      </NavButton>
    );
  }, [hasDefinedChaosBag, chaosBagLine, showChaosBagDialog, guided, borderStyle, colors, selection]);

  const campaignLogSection = useMemo(() => {
    if (isGuided || selection.type === 'standalone') {
      return null;
    }
    const onPress = hasDefinedCampaignLog ?
      undefined :
      deleteCampaignNoteSection;
    return (
      <View style={[styles.underline, borderStyle]}>
        <View style={styles.block}>
          <Text style={typography.mediumGameFont}>
            { t`Campaign Log` }
          </Text>
        </View>
        { map(campaignLog.sections || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            onPress={onPress}
          />
        )) }
        { map(campaignLog.counts || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            isCount
            onPress={onPress}
          />
        )) }
        { map(campaignLog.investigatorSections || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            perInvestigator
            onPress={onPress}
          />
        )) }
        { map(campaignLog.investigatorCounts || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            perInvestigator
            isCount
            onPress={onPress}
          />
        )) }
        { !hasDefinedChaosBag && (
          <View style={space.marginTopS}>
            <BasicButton title={t`Add Log Section`} onPress={showCampaignLogDialog} />
          </View>
        ) }
      </View>
    );
  }, [borderStyle, typography, hasDefinedChaosBag, hasDefinedCampaignLog, isGuided, campaignLog, selection,
    showCampaignLogDialog, deleteCampaignNoteSection]);

  return (
    <View style={backgroundStyle}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <CampaignSelector
          componentId={componentId}
          campaignChanged={campaignChanged}
        />
        <EditText
          title={t`Name`}
          placeholder={placeholderName}
          onValueChange={onNameChange}
          value={name}
        />
        { hasGuide && selection.type === 'campaign' && (
          <SettingsSwitch
            title={t`Guided Campaign`}
            description={guided ? t`Use app for scenario setup & resolutions` : t`Track campaign log and resolutions manually`}
            onValueChange={toggleGuided}
            value={guided}
          />
        ) }
        { hasGuide && guided && selection.type === 'campaign' && INCOMPLETE_GUIDED_CAMPAIGNS.has(selection.code) && (
          <View style={[styles.block, styles.underline, borderStyle]}>
            <Text style={typography.text}>
              { t`Note: this campaign is still being released and so the guide is incomplete (and may contain some mistakes).\nAs new scenarios are released, I will try to update the app promptly but there may be some slight delays.` }</Text>
          </View>
        ) }
        { !isGuided && selection.type === 'campaign' && (
          <PickerStyleButton
            title={t`Difficulty`}
            id="difficulty"
            onPress={showDifficultyDialog}
            value={difficultyString(difficulty)}
            widget="nav"
          />
        ) }
        { chaosBagSection }
        { campaignLogSection }
        { (selection.type !== 'campaign' || selection.code !== TDE) && (
          <View style={[styles.underline, borderStyle]}>
            <View style={styles.block}>
              <Text style={typography.mediumGameFont}>
                { t`Investigators` }
              </Text>
            </View>
            <DeckSelector
              componentId={componentId}
              campaignId={nextId}
              deckIds={deckIds}
              investigatorIds={filter(investigatorIds, code => !investigatorToDeck[code])}
              deckAdded={deckAdded}
              deckRemoved={deckRemoved}
              investigatorAdded={guided ? investigatorAdded : undefined}
              investigatorRemoved={guided ? investigatorRemoved : undefined}
            />
          </View>
        ) }
        { weaknessSetSection }
        <BasicButton
          disabled={selection.type === 'campaign' && selection.code === CUSTOM && !name}
          title={selection.type === 'campaign' ? t`Create Campaign` : t`Create Standalone`}
          onPress={savePressed}
        />
        <View style={styles.footer}>
          { isGuided && (
            <View style={styles.block}>
              <Text style={typography.small}>
                { t`If you encounter any problems with the campaign guide system, please let me know at arkhamcards@gmail.com.` }
              </Text>
            </View>
          ) }
        </View>
      </ScrollView>
      { campaignSectionDialog }
    </View>
  );
}

NewCampaignView.options = () => {
  return {
    topBar: {
      title: {
        text: t`New Campaign`,
      },
    },
  };
};

export default NewCampaignView;

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    minHeight: 100,
  },
  block: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
  },
});
