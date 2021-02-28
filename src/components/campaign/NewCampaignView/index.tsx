import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { filter, forEach, map, throttle } from 'lodash';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

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
  DIFFICULTIES,
  DeckId,
  getDeckId,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import CampaignSelector from './CampaignSelector';
import CampaignNoteSectionRow from './CampaignNoteSectionRow';
import { getCampaignLog, getChaosBag, difficultyString } from '../constants';
import { maybeShowWeaknessPrompt } from '../campaignHelper';
import SettingsSwitch from '@components/core/SettingsSwitch';
import DeckSelector from './DeckSelector';
import WeaknessSetPackChooserComponent from '@components/weakness/WeaknessSetPackChooserComponent';
import { newCampaign, newLinkedCampaign, newStandalone } from '@components/campaign/actions';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/types/Card';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import COLORS from '@styles/colors';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationButtonPressed, usePlayerCards, useSlots } from '@components/core/hooks';
import { CampaignSelection } from '../SelectCampaignDialog';
import { useAlertDialog, usePickerDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import { MyDecksSelectorProps } from '../MyDecksSelectorDialog';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckButton from '@components/deck/controls/DeckButton';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import ChaosBagTextLine from './ChaosBagTextLine';
import useAddCampaignNoteSectionDialog from '@components/campaign/useAddCampaignNoteSectionDialog';

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
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const cards = usePlayerCards();
  const dispatch = useDispatch();
  const { user } = useContext(ArkhamCardsAuthContext);

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
  const [deckIds, setDeckIds] = useState<DeckId[]>([]);
  const [investigatorIds, setInvestigatorIds] = useState<string[]>([]);
  const [investigatorToDeck, setInvestigatorToDeck] = useState<{ [code: string]: DeckId }>({});
  const [weaknessPacks, setWeaknessPacks] = useState<string[]>([]);
  const [weaknessAssignedCards, updateWeaknessAssignedCards] = useSlots({});
  const [customChaosBag, setCustomChaosBag] = useState<ChaosBag>(getChaosBag(CORE, CampaignDifficulty.STANDARD));
  const [customCampaignLog, setCustomCampaignLog] = useState<CustomCampaignLog>({ sections: [t`Campaign Notes`] });
  const isGuided = hasGuide && (guided || (selection.type === 'campaign' && selection.code === 'tde'));

  const [addSectionDialog, showAddSectionDialog] = useAddCampaignNoteSectionDialog();
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
          color: COLORS.M,
          accessibilityLabel: t`Done`,
        }],
      },
    });
  }, [componentId, name, selection]);

  const addCampaignNoteSection = useCallback((name: string, isCount?: boolean, perInvestigator?: boolean) => {
    if (!name) {
      return;
    }
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
    showAddSectionDialog(addCampaignNoteSection);
  }, [showAddSectionDialog, addCampaignNoteSection]);

  const onNameChange = useCallback((name?: string) => {
    setName(name || '');
  }, [setName]);

  const updateWeaknessAssigned = useCallback((weaknessAssignedCards: Slots) => {
    updateWeaknessAssignedCards({ type: 'sync', slots: weaknessAssignedCards });
  }, [updateWeaknessAssignedCards]);
  const [alertDialog, showAlert] = useAlertDialog();
  const checkDeckForWeaknessPrompt = useCallback((deck: Deck) => {
    if (cards) {
      maybeShowWeaknessPrompt(deck, cards, weaknessAssignedCards, updateWeaknessAssigned, showAlert);
    }
  }, [cards, weaknessAssignedCards, updateWeaknessAssigned, showAlert]);

  const investigatorAdded = useCallback((card: Card) => {
    setInvestigatorIds([...investigatorIds, card.code]);
  }, [investigatorIds, setInvestigatorIds]);

  const investigatorRemoved = useCallback((card: Card) => {
    setInvestigatorIds(filter(investigatorIds, id => id !== card.code));
  }, [investigatorIds, setInvestigatorIds]);

  const deckAdded = useCallback((deck: Deck) => {
    setDeckIds([...deckIds, getDeckId(deck)]);
    setInvestigatorIds([...investigatorIds, deck.investigator_code]);
    setInvestigatorToDeck({
      ...investigatorToDeck,
      [deck.investigator_code]: getDeckId(deck),
    });
    checkDeckForWeaknessPrompt(deck);
  }, [setDeckIds, setInvestigatorIds, setInvestigatorToDeck, checkDeckForWeaknessPrompt, deckIds, investigatorIds, investigatorToDeck]);

  const deckRemoved = useCallback((id: DeckId, deck?: Deck) => {
    const updatedInvestigatorToDeck: { [code: string]: DeckId } = {};
    forEach(investigatorToDeck, (deckId, code) => {
      if (deckId.uuid !== id.uuid) {
        updatedInvestigatorToDeck[code] = deckId;
      }
    });
    setDeckIds(filter(deckIds, deckId => deckId.uuid !== id.uuid));
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
    if (selection.type === 'campaign' && selection.code === CUSTOM && !name) {
      showAlert(t`Name required`, t`You must specify a name for custom campaigns.`);
      return;
    }

    if (selection.type === 'campaign') {
      if (selection.code === TDE) {
        dispatch(newLinkedCampaign(
          user,
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
          user,
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
        user,
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
  }, [dispatch, showAlert, componentId, campaignLog, chaosBag, placeholderName, name, selection, user,
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
  const { dialog: difficultyDialog, showDialog: showDifficultyDialog } = usePickerDialog({
    title: t`Difficulty`,
    items: map(DIFFICULTIES, difficulty => {
      return {
        title: difficultyString(difficulty),
        value: difficulty,
      };
    }),
    selectedValue: difficulty,
    onValueChange: setDifficulty,
  });

  const campaignChanged = useCallback((selection: CampaignSelection, campaign: string, hasGuide: boolean) => {
    setCampaignChoice({
      selection,
      campaign,
      hasGuide,
    });
  }, [setCampaignChoice]);
  const weaknessSetSection = useMemo(() => {
    return (
      <View style={space.paddingS}>
        <RoundedFactionBlock
          faction="neutral"
          header={(
            <View style={[styles.block, { backgroundColor: colors.L20 }]}>
              <Text style={[typography.mediumGameFont, typography.center]}>
                { t`Weakness Set` }
              </Text>
              <Text style={typography.small}>
                { t`Include all basic weaknesses from these expansions` }
              </Text>
            </View>
          )}
          noSpace
        >
          <View style={[space.paddingXs, space.paddingRightS]}>
            <WeaknessSetPackChooserComponent
              componentId={componentId}
              compact
              onSelectedPacksChanged={setWeaknessPacks}
            />
          </View>
        </RoundedFactionBlock>
      </View>
    );
  }, [componentId, typography, colors, setWeaknessPacks]);

  const campaignLogSection = useMemo(() => {
    if (isGuided || selection.type === 'standalone') {
      return null;
    }
    const onPress = hasDefinedCampaignLog ?
      undefined :
      deleteCampaignNoteSection;
    return (
      <View style={space.paddingS}>
        <RoundedFactionBlock
          faction="neutral"
          header={(
            <View style={[styles.block, { backgroundColor: colors.L20 }]}>
              <Text style={[typography.mediumGameFont, typography.center]}>
                { t`Campaign Log` }
              </Text>
            </View>
          )}
          footer={!hasDefinedChaosBag ? <RoundedFooterButton icon="expand" title={t`Add Log Section`} onPress={showCampaignLogDialog} /> : undefined}
        >
          { map(campaignLog.sections || [], (section, idx) => (
            <CampaignNoteSectionRow
              key={idx}
              name={section}
              onPress={onPress}
            />
          )) }
          { map(campaignLog.counts || [], (section, idx) => (
            <CampaignNoteSectionRow
              key={idx}
              name={section}
              isCount
              onPress={onPress}
            />
          )) }
          { map(campaignLog.investigatorSections || [], (section, idx) => (
            <CampaignNoteSectionRow
              key={idx}
              name={section}
              perInvestigator
              onPress={onPress}
            />
          )) }
          { map(campaignLog.investigatorCounts || [], (section, idx) => (
            <CampaignNoteSectionRow
              key={idx}
              name={section}
              perInvestigator
              isCount
              onPress={onPress}
            />
          )) }
        </RoundedFactionBlock>
      </View>
    );
  }, [typography, colors, hasDefinedChaosBag, hasDefinedCampaignLog, isGuided, campaignLog, selection,
    showCampaignLogDialog, deleteCampaignNoteSection]);

  const showDeckSelector = useCallback(() => {
    if (deckAdded) {
      const passProps: MyDecksSelectorProps = {
        campaignId: { campaignId: 'new-deck' },
        onDeckSelect: deckAdded,
        onInvestigatorSelect: investigatorAdded,
        selectedDeckIds: deckIds,
        selectedInvestigatorIds: investigatorIds,
      };
      Navigation.showModal<MyDecksSelectorProps>({
        stack: {
          children: [{
            component: {
              name: 'Dialog.DeckSelector',
              passProps,
              options: {
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.fullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
              },
            },
          }],
        },
      });
    }
  }, [deckIds, investigatorIds, deckAdded, investigatorAdded]);
  const { dialog, showDialog } = useSimpleTextDialog({
    title: t`Name`,
    placeholder: placeholderName,
    value: name,
    onValueChange: onNameChange,
  });
  return (
    <View style={backgroundStyle}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <View style={space.paddingS}>
          <CampaignSelector
            componentId={componentId}
            campaignChanged={campaignChanged}
          />
          <DeckPickerStyleButton
            icon="name"
            title={t`Name`}
            valueLabel={name || placeholderName}
            onPress={showDialog}
            editable
            last
          />
        </View>
        { hasGuide && selection.type === 'campaign' && (
          <SettingsSwitch
            title={t`Guided Campaign`}
            description={(selection.code === 'tde' || guided) ? t`Use app for scenario setup & resolutions` : t`Track campaign log and resolutions manually`}
            onValueChange={toggleGuided}
            disabled={selection.code === 'tde'}
            noDisableText
            value={selection.code === 'tde' || guided}
            last
          />
        ) }
        { selection.type === 'campaign' && !isGuided && (
          <View style={space.paddingS}>
            <DeckPickerStyleButton
              icon="difficulty"
              title={t`Difficulty`}
              onPress={showDifficultyDialog}
              valueLabel={difficultyString(difficulty)}
              editable
              first
            />
            <DeckPickerStyleButton
              icon="chaos_bag"
              editable={!hasDefinedChaosBag}
              title={t`Chaos Bag`}
              valueLabel={<ChaosBagTextLine chaosBag={chaosBag} />}
              onPress={showChaosBagDialog}
              last
            />
          </View>
        ) }
        { hasGuide && guided && selection.type === 'campaign' && INCOMPLETE_GUIDED_CAMPAIGNS.has(selection.code) && (
          <View style={styles.block}>
            <Text style={typography.text}>
              { t`Note: this campaign is still being released and so the guide is incomplete (and may contain some mistakes).\nAs new scenarios are released, I will try to update the app promptly but there may be some slight delays.` }
            </Text>
          </View>
        ) }
        { campaignLogSection }
        { (selection.type !== 'campaign' || selection.code !== TDE) && (
          <View style={space.paddingS}>
            <RoundedFactionBlock
              faction="neutral"
              header={(
                <View style={[styles.block, { backgroundColor: colors.L20 }]}>
                  <Text style={[typography.mediumGameFont, typography.center]}>
                    { t`Investigators` }
                  </Text>
                </View>
              )}
              footer={(
                <RoundedFooterButton
                  icon="expand"
                  title={guided ? t`Add Investigator` : t`Add Investigator Deck`}
                  onPress={showDeckSelector}
                />
              )}
              noSpace
            >
              <DeckSelector
                componentId={componentId}
                deckIds={deckIds}
                investigatorIds={filter(investigatorIds, code => !investigatorToDeck[code])}
                deckRemoved={deckRemoved}
                investigatorRemoved={guided ? investigatorRemoved : undefined}
              />
            </RoundedFactionBlock>
          </View>
        ) }
        { weaknessSetSection }
        <View style={space.paddingS}>
          <DeckButton
            icon="check-thin"
            disabled={selection.type === 'campaign' && selection.code === CUSTOM && !name}
            title={selection.type === 'campaign' ? t`Create Campaign` : t`Create Standalone`}
            onPress={savePressed}
          />
        </View>
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
      { addSectionDialog }
      { difficultyDialog }
      { dialog }
      { alertDialog }
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
  footer: {
    minHeight: 100,
  },
  block: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});
