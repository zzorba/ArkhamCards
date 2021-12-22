import React, { useCallback, useContext } from 'react';
import { Alert, Text, View } from 'react-native';
import { find, map } from 'lodash';
import { t } from 'ttag';

import UpgradeDeckRow from './UpgradeDeckRow';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { useToggles } from '@components/core/hooks';
import { useDeckActions } from '@data/remote/decks';
import { SpecialXp } from '@data/scenario/types';
import LanguageContext from '@lib/i18n/LanguageContext';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import CardTextComponent from '@components/card/CardTextComponent';
import ArkhamButton from '@components/core/ArkhamButton';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';

interface Props {
  componentId: string;
  id: string;
  skipDeckSave?: boolean;
  specialXp?: SpecialXp;
  storyCards?: string[]
  investigatorCounter?: string;
}

export default function UpgradeDecksInput({ componentId, id, skipDeckSave, specialXp, investigatorCounter, storyCards }: Props) {
  const { latestDecks, campaignState } = useContext(CampaignGuideContext);
  const { typography, width } = useContext(StyleContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { listSeperator } = useContext(LanguageContext);
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const [unsavedEdits, , setUnsavedEdits] = useToggles({});
  const deckActions = useDeckActions();
  const proceedMessage = useCallback((): string | undefined => {
    if (!skipDeckSave) {
      const unsavedDeck = find(
        scenarioInvestigators,
        investigator => {
          if (campaignLog.isEliminated(investigator)) {
            return false;
          }
          const choiceId = UpgradeDeckRow.choiceId(id, investigator);
          if (scenarioState.numberChoices(choiceId) !== undefined) {
            // Already saved
            return false;
          }
          if (latestDecks[investigator.code]) {
            return true;
          }
          return false;
        });
      if (unsavedDeck) {
        return t`It looks like one or more deck upgrades are unsaved. If you would like the app to track spent experience as you make deck changes, please go back and press 'Save deck upgrade' on each investigator before proceeding to the next scenario.\n\nOnce an upgrade has been saved, you can edit the deck as normal and the app will properly track the experience cost for any changes you make (the original versions of the deck can still be viewed from the deck's menu).`;
      }
    }

    const unsavedNonDeck = find(
      scenarioInvestigators,
      investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return false;
        }
        const choiceId = UpgradeDeckRow.choiceId(id, investigator);
        if (scenarioState.numberChoices(choiceId) !== undefined) {
          // Already saved
          return false;
        }
        if (!skipDeckSave && latestDecks[investigator.code]) {
          return false;
        }
        return !!unsavedEdits[investigator.code];
      });
    if (unsavedNonDeck) {
      return t`It looks like you edited the experience or trauma for an investigator, but have not saved it yet. Please go back and select ‘Save adjustments’ to ensure your changes are saved.`;
    }
    return undefined;
  }, [id, skipDeckSave, latestDecks, unsavedEdits, scenarioInvestigators, scenarioState, campaignLog]);

  const actuallySave = useCallback(() => {
    scenarioState.setDecision(id, true);
  }, [id, scenarioState]);

  const save = useCallback(() => {
    const warningMessage = proceedMessage();
    if (warningMessage) {
      Alert.alert(
        t`Proceed without saving`,
        warningMessage,
        [{
          text: t`Cancel`,
          style: 'cancel',
        }, {
          text: t`Proceed anyway`,
          style: 'destructive',
          onPress: actuallySave,
        }]
      );
    } else {
      actuallySave();
    }
  }, [proceedMessage, actuallySave]);
  const whatDoesAppHandle = useCallback(() => {
    Alert.alert(
      t`What exactly does the app handle?`,
      t`Generally speaking, the app handles anything that you see mentioned in the digital campaign log.\nIf you are building your deck with the app, it will also handle cards like Arcane Research and Shrewd Analysis (if you allow the app to randomize your upgrades).\nIf you find that you made a mistake after you upgraded your deck, you can 'adjust' the available experience when editing a deck.`
    );
  }, []);
  const hasDecision = scenarioState.decision(id) !== undefined;
  return (
    <InputWrapper
      title={skipDeckSave ? t`Adjust scenario XP and trauma` : t`Update decks with scenario results`}
      titleStyle="header"
      onSubmit={save}
      editable={!hasDecision}
    >
      { !hasDecision && (
        <>
          <CardTextComponent text={t`The numbers below already include all the trauma, victory points, and story assets you may have earned during the resolution.\n\nIf you have any other cards or effects that the app does not take care of, you can make adjustments below before saving each investigator.`} />
          <ArkhamButton noShadow title={t`Learn more`} icon="faq" onPress={whatDoesAppHandle} />
        </>
      )}
      { map(scenarioInvestigators, investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return (
            <View style={[space.paddingSideS, space.paddingVerticalXs]}>
              <CompactInvestigatorRow
                key={investigator.code}
                investigator={investigator}
                eliminated
                width={width - s * (hasDecision ? 4 : 2)}
              >
                <Text style={[typography.mediumGameFont, typography.white]}>
                  {investigator.traumaString(listSeperator, campaignLog.traumaAndCardData(investigator.code))}
                </Text>
              </CompactInvestigatorRow>
            </View>
          );
        }
        return (
          <UpgradeDeckRow
            key={investigator.code}
            id={id}
            componentId={componentId}
            campaignLog={campaignLog}
            campaignState={campaignState}
            scenarioState={scenarioState}
            investigator={investigator}
            deck={latestDecks[investigator.code]}
            setUnsavedEdits={setUnsavedEdits}
            editable={!hasDecision}
            actions={deckActions}
            skipDeckSave={skipDeckSave}
            specialXp={specialXp}
            storyCards={storyCards}
            investigatorCounter={investigatorCounter}
          />
        );
      }) }
    </InputWrapper>
  );
}
