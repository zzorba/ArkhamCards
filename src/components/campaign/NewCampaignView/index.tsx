import React, { useCallback, useContext, useEffect, useMemo, useState, useReducer } from 'react';
import { filter, forEach, map, throttle, uniq } from 'lodash';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { LayoutComponent, Navigation, Options, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';
import { ThunkDispatch } from 'redux-thunk';

import { iconsMap } from '@app/NavIcons';
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
  NewLinkedCampaignAction,
  NewCampaignAction,
  NewStandaloneCampaignAction,
  NEW_GUIDED_CAMPAIGNS,
  BROWSE_CAMPAIGNS,
  OZ,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import CampaignSelector from './CampaignSelector';
import CampaignNoteSectionRow from './CampaignNoteSectionRow';
import { getCampaignLog, getChaosBag, difficultyString } from '../constants';
import { maybeShowWeaknessPrompt, useMaybeShowWeaknessPrompt } from '../campaignHelper';
import SettingsSwitch from '@components/core/SettingsSwitch';
import DeckSelector from './DeckSelector';
import WeaknessSetPackChooserComponent from '@components/weakness/WeaknessSetPackChooserComponent';
import { newCampaign, newLinkedCampaign, newStandalone } from '@components/campaign/actions';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/types/Card';
import { useEditChaosBagDialog } from '../../chaos/EditChaosBagDialog';
import COLORS from '@styles/colors';
import space, { m, s, l } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationButtonPressed, useSlots, useWeaknessCards } from '@components/core/hooks';
import { CampaignSelection } from '../SelectCampaignDialog';
import { useAlertDialog, usePickerDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import RoundedFactionBlock, { AnimatedRoundedFactionBlock } from '@components/core/RoundedFactionBlock';
import { MyDecksSelectorProps } from '../MyDecksSelectorDialog';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckButton from '@components/deck/controls/DeckButton';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import ChaosBagTextLine from './ChaosBagTextLine';
import useAddCampaignNoteSectionDialog from '@components/campaign/useAddCampaignNoteSectionDialog';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { LatestDeckRedux } from '@data/local/types';
import ActionButton from '@components/campaignguide/prompts/ActionButton';
import { AppState } from '@reducers';
import LoadingSpinner from '@components/core/LoadingSpinner';

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
  const weaknessCards = useWeaknessCards();
  const dispatch: ThunkDispatch<AppState, unknown, NewLinkedCampaignAction | NewCampaignAction | NewStandaloneCampaignAction> = useDispatch();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [saving, setSaving] = useState(false);
  const [uploadCampaign, toggleUploadCampaign] = useFlag(false);

  const [name, setName] = useState('');
  const [campaignChoice, setCampaignChoice] = useState<CampaignChoice | undefined>();
  const [guided, toggleGuided] = useFlag(true);
  const [difficulty, setDifficulty] = useState<CampaignDifficulty>(CampaignDifficulty.STANDARD);
  const [selectedDecks, setSelectedDecks] = useState<LatestDeckT[]>([]);
  const [investigatorIds, updateInvestigatorIds] = useReducer(
    (state: string[], { type, investigator }: { type: 'add' | 'remove'; investigator: string }) => {
      switch (type) {
        case 'add': return uniq([...state, investigator]);
        case 'remove': return filter(state, x => x !== investigator);
      }
    },
    []
  );
  const [investigatorToDeck, setInvestigatorToDeck] = useState<{ [code: string]: DeckId }>({});
  const [weaknessPacks, setWeaknessPacks] = useState<string[]>([]);
  const [weaknessAssignedCards, updateWeaknessAssignedCards] = useSlots({});
  const [customChaosBag, setCustomChaosBag] = useState<ChaosBag>(getChaosBag(CORE, CampaignDifficulty.STANDARD));
  const [customCampaignLog, setCustomCampaignLog] = useState<CustomCampaignLog>({ sections: [t`Campaign Notes`] });
  const isGuided = !!campaignChoice?.hasGuide && (guided || (campaignChoice?.selection.type === 'campaign' && campaignChoice?.selection.code === 'tde'));

  const [addSectionDialog, showAddSectionDialog] = useAddCampaignNoteSectionDialog();
  const hasDefinedChaosBag = useMemo(() => {
    return campaignChoice?.selection.type === 'campaign' && campaignChoice?.selection.code !== CUSTOM && !!getChaosBag(campaignChoice?.selection.code, difficulty);
  }, [campaignChoice, difficulty]);
  const chaosBag: ChaosBag = useMemo(() => {
    if (hasDefinedChaosBag && campaignChoice?.selection.type === 'campaign') {
      return getChaosBag(campaignChoice.selection.code, difficulty);
    }
    return customChaosBag;
  }, [campaignChoice, difficulty, customChaosBag, hasDefinedChaosBag]);

  const hasDefinedCampaignLog = useMemo(() => {
    return (campaignChoice?.selection.type === 'campaign' && campaignChoice?.selection.code !== CUSTOM && !!getCampaignLog(campaignChoice.selection.code));
  }, [campaignChoice]);

  const campaignLog = useMemo(() => {
    if (hasDefinedCampaignLog && campaignChoice?.selection.type === 'campaign') {
      return getCampaignLog(campaignChoice.selection.code);
    }
    return customCampaignLog;
  }, [campaignChoice, customCampaignLog, hasDefinedCampaignLog]);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: campaignChoice?.selection.type === 'campaign' ? t`New Campaign` : t`New Standalone`,
        },
        rightButtons: [{
          text: t`Done`,
          id: 'save',
          color: COLORS.M,
          accessibilityLabel: t`Done`,
        }],
      },
    });
  }, [componentId, name, campaignChoice]);

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
    if (weaknessCards) {
      maybeShowWeaknessPrompt(deck, weaknessCards, weaknessAssignedCards, updateWeaknessAssigned, showAlert);
    }
  }, [weaknessCards, weaknessAssignedCards, updateWeaknessAssigned, showAlert]);

  const checkNewDeckForWeakness = useMaybeShowWeaknessPrompt(componentId, checkDeckForWeaknessPrompt);
  const investigatorAdded = useCallback((card: Card) => {
    updateInvestigatorIds({ type: 'add', investigator: card.code });
  }, [updateInvestigatorIds]);

  const investigatorRemoved = useCallback((card: Card) => {
    updateInvestigatorIds({ type: 'remove', investigator: card.code });
  }, [updateInvestigatorIds]);

  const includeParallel = campaignChoice?.selection.type === 'campaign' && campaignChoice.selection.code === OZ;
  const deckAdded = useCallback(async(deck: Deck) => {
    setSelectedDecks([...selectedDecks, new LatestDeckRedux(deck, undefined, undefined)]);
    const investigatorId = includeParallel ? (
      deck.meta?.alternate_front ?? deck.investigator_code
    ) : deck.investigator_code;
    updateInvestigatorIds({ type: 'add', investigator: investigatorId });
    setInvestigatorToDeck({
      ...investigatorToDeck,
      [investigatorId]: getDeckId(deck),
    });
    checkNewDeckForWeakness(deck);
  }, [
    setSelectedDecks, updateInvestigatorIds, setInvestigatorToDeck, checkNewDeckForWeakness,
    selectedDecks, investigatorToDeck, includeParallel,
  ]);


  const deckRemoved = useCallback((id: DeckId, deck?: Deck) => {
    const updatedInvestigatorToDeck: { [code: string]: DeckId } = {};
    forEach(investigatorToDeck, (deckId, code) => {
      if (deckId.uuid !== id.uuid) {
        updatedInvestigatorToDeck[code] = deckId;
      }
    });
    setSelectedDecks(filter(selectedDecks, deck => deck.id.uuid !== id.uuid));
    if (deck) {
      updateInvestigatorIds({ type: 'remove', investigator: deck.investigator_code });
    }
    setInvestigatorToDeck(updatedInvestigatorToDeck);
  }, [investigatorToDeck, selectedDecks, setSelectedDecks, updateInvestigatorIds, setInvestigatorToDeck]);

  const placeholderName = useMemo(() => {
    if (!campaignChoice) {
      return '';
    }
    if (campaignChoice.selection.type === 'campaign' && campaignChoice.selection.code === CUSTOM) {
      return t`(required)`;
    }
    if (campaignChoice.selection.type === 'standalone') {
      return campaignChoice?.campaign;
    }
    const campaign = campaignChoice.campaign;
    return t`My ${campaign} Campaign`;
  }, [campaignChoice]);

  const showCampaign = useCallback((component: LayoutComponent) => {
    Navigation.pop(componentId);
    Navigation.push(BROWSE_CAMPAIGNS, {
      component,
    });
  }, [componentId]);
  const onSave = useCallback(() => {
    if (!campaignChoice) {
      showAlert(t`Campaign required`, t`You must select a campaign.`);
      return;
    }
    if (campaignChoice.selection.type === 'campaign' && campaignChoice.selection.code === CUSTOM && !name) {
      showAlert(t`Name required`, t`You must specify a name for custom campaigns.`);
      return;
    }
    setSaving(true);

    setTimeout(() => {
      const deckIds = map(selectedDecks, d => d.id);
      const options: Options = {
        topBar: {
          title: {
            text: name || placeholderName,
          },
          backButton: {
            title: t`Back`,
          },
          rightButtons: [
            {
              icon: iconsMap.edit,
              id: 'edit',
              color: COLORS.M,
              accessibilityLabel: t`Edit name`,
            },
          ],
        },
      };
      const selection = campaignChoice.selection;
      if (selection.type === 'campaign') {
        if (selection.code === TDE) {
          dispatch(newLinkedCampaign(
            userId,
            name || placeholderName,
            TDE,
            TDEA,
            TDEB,
            {
              packCodes: weaknessPacks,
              assignedCards: weaknessAssignedCards,
            },
          )).then(({ campaignId, campaignIdA, campaignIdB }) => {
            showCampaign({
              name: 'Guide.LinkedCampaign',
              passProps: {
                campaignId,
                campaignIdA,
                campaignIdB,
                upload: uploadCampaign,
              },
              options,
            });
          });
        } else {
          // Save to redux.
          dispatch(newCampaign(
            userId,
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
          )).then(campaignId => {
            showCampaign({
              name: isGuided ? 'Guide.Campaign' : 'Campaign',
              passProps: {
                campaignId,
                upload: uploadCampaign,
              },
              options,
            });
          });
        }
      } else {
        dispatch(newStandalone(
          userId,
          name || placeholderName,
          selection.id,
          deckIds,
          investigatorIds,
          {
            packCodes: weaknessPacks,
            assignedCards: weaknessAssignedCards,
          },
        )).then(campaignId => {
          showCampaign({
            name: 'Guide.Standalone',
            passProps: {
              campaignId,
              scenarioId: selection.id.scenarioId,
              standalone: true,
              upload: uploadCampaign,
            },
            options,
          });
        });
      }
    }, 0);
  }, [dispatch, showAlert, showCampaign, campaignLog, chaosBag, placeholderName, name, campaignChoice, userId,
    difficulty, selectedDecks, investigatorIds, weaknessPacks, weaknessAssignedCards, isGuided, uploadCampaign]);

  const savePressed = useMemo(() => throttle(onSave, 200), [onSave]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'save') {
      savePressed();
    }
  }, componentId, [savePressed]);

  const { dialog: chaosBagDialog, showDialog: showChaosBagDialog } = useEditChaosBagDialog({
    chaosBag: customChaosBag,
    updateChaosBag: setCustomChaosBag,
    cycleCode: campaignChoice?.selection.type === 'campaign' ? campaignChoice?.selection.code : 'custom',
    difficulty,
    setDifficulty,
  });
  const [difficultyDialog, showDifficultyDialog] = usePickerDialog({
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
  const [open, toggleOpen] = useFlag(false);
  const renderWeaknessHeader = useCallback((icon: React.ReactNode) => {
    return (
      <View style={[
        styles.block,
        { backgroundColor: colors.D10 },
        !open ? {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        } : undefined,
      ]}>
        <View style={styles.row}>
          <View style={styles.textColumn}>
            <Text style={[typography.mediumGameFont, { color: colors.L20 }, typography.center]}>
              { t`Weakness Set` }
            </Text>
            <Text style={[typography.small, typography.italic, { color: colors.L20 }, typography.center]}>
              { open ? t`Include all basic weaknesses from these expansions` : t`Choose expansions for basic weakness` }
            </Text>
          </View>
          { icon }
        </View>
      </View>
    );
  }, [colors, typography, open]);
  const weaknessSetSection = useMemo(() => {
    return (
      <View style={space.paddingS}>
        <AnimatedRoundedFactionBlock
          faction="neutral"
          renderHeader={renderWeaknessHeader}
          open={open}
          toggleOpen={toggleOpen}
          textColor={colors.L20}
          noSpace
        >
          <View style={[space.paddingXs, space.paddingRightS]}>
            <WeaknessSetPackChooserComponent
              componentId={componentId}
              compact
              onSelectedPacksChanged={setWeaknessPacks}
            />
          </View>
        </AnimatedRoundedFactionBlock>
      </View>
    );
  }, [componentId, setWeaknessPacks, renderWeaknessHeader, open, toggleOpen, colors]);

  const campaignLogSection = useMemo(() => {
    if (isGuided || !campaignChoice || campaignChoice.selection.type === 'standalone') {
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
  }, [typography, colors, hasDefinedChaosBag, hasDefinedCampaignLog, isGuided, campaignLog, campaignChoice,
    showCampaignLogDialog, deleteCampaignNoteSection,
  ]);

  const showDeckSelector = useCallback(() => {
    if (deckAdded) {
      const passProps: MyDecksSelectorProps = {
        campaignId: { campaignId: 'new-deck' },
        onDeckSelect: deckAdded,
        onInvestigatorSelect: investigatorAdded,
        selectedDecks,
        selectedInvestigatorIds: investigatorIds,
        includeParallel,
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
  }, [includeParallel, selectedDecks, investigatorIds, deckAdded, investigatorAdded]);
  const [dialog, showDialog] = useSimpleTextDialog({
    title: t`Name`,
    placeholder: placeholderName,
    value: name,
    onValueChange: onNameChange,
  });
  if (saving) {
    return <LoadingSpinner large message={campaignChoice?.selection.type === 'campaign' ? t`Creating campaign...` : t`Creating standalone...`} />;
  }
  return (
    <View style={styles.flex}>
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
        { campaignChoice?.hasGuide && campaignChoice?.selection.type === 'campaign' && (
          <SettingsSwitch
            title={t`Guided Campaign`}
            description={(campaignChoice.selection.code === 'tde' || guided) ? t`Use app for scenario setup & resolutions` : t`Track campaign log and resolutions manually`}
            onValueChange={toggleGuided}
            disabled={campaignChoice.selection.code === 'tde'}
            noDisableText
            value={campaignChoice.selection.code === 'tde' || guided}
            last
          />
        ) }
        { campaignChoice?.selection.type === 'campaign' && !isGuided && (
          <View style={space.paddingS}>
            <DeckPickerStyleButton
              icon="difficulty"
              title={t`Difficulty`}
              onPress={!hasDefinedChaosBag ? showChaosBagDialog : showDifficultyDialog}
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
        { campaignChoice?.hasGuide && guided && campaignChoice.selection.type === 'campaign' && INCOMPLETE_GUIDED_CAMPAIGNS.has(campaignChoice.selection.code) && (
          <View style={styles.block}>
            <Text style={typography.text}>
              { t`Note: this campaign is still being released and so the guide is incomplete (and may contain some mistakes).\nAs new scenarios are released, I will try to update the app promptly but there may be some slight delays.` }
            </Text>
          </View>
        ) }
        { campaignChoice?.hasGuide && guided && campaignChoice.selection.type === 'campaign' && NEW_GUIDED_CAMPAIGNS.has(campaignChoice.selection.code) && (
          <View style={styles.block}>
            <Text style={typography.text}>
              { t`Note: this campaign is a fairly new addition to the app and may contain some mistakes.` }
            </Text>
          </View>
        ) }
        { campaignLogSection }
        { (campaignChoice?.selection.type !== 'campaign' || campaignChoice.selection.code !== TDE) && (
          <View style={space.paddingS}>
            <RoundedFactionBlock
              faction="neutral"
              header={(
                <View style={[styles.block, { backgroundColor: colors.D10 }]}>
                  <Text style={[typography.mediumGameFont, { color: colors.L20 }, typography.center]}>
                    { t`Investigators` }
                  </Text>
                </View>
              )}
              noSpace
            >
              <DeckSelector
                investigatorToDeck={investigatorToDeck}
                investigatorIds={investigatorIds}
                deckRemoved={deckRemoved}
                investigatorRemoved={guided ? investigatorRemoved : undefined}
              />
              <View style={[styles.centerRow, space.paddingXs]}>
                <ActionButton
                  leftIcon="plus-button"
                  color="light"
                  title={guided ? t`Add Investigator` : t`Add Investigator Deck`}
                  onPress={showDeckSelector}
                />
              </View>
            </RoundedFactionBlock>
          </View>
        ) }
        { weaknessSetSection }
        { !!userId && (
          <SettingsSwitch
            title={t`Upload campaign`}
            description={uploadCampaign ? t`Campaign will be synced between devices and can be shared with friends` : t`Campaign will be local to this device, you can choose to upload it later`}
            onValueChange={toggleUploadCampaign}
            noDisableText
            value={uploadCampaign}
            last
          />
        )}
        <View style={space.paddingS}>
          <DeckButton
            icon="check-thin"
            thin
            disabled={!campaignChoice || campaignChoice.selection.type === 'campaign' && campaignChoice.selection.code === CUSTOM && !name}
            title={!campaignChoice || campaignChoice.selection.type === 'campaign' ? t`Create Campaign` : t`Create Standalone`}
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
      { chaosBagDialog }
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
    paddingBottom: l,
  },
  block: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
