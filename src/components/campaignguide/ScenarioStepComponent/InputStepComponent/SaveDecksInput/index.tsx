import React, { useCallback, useContext, useMemo } from 'react';
import { Alert } from 'react-native';
import { find, map } from 'lodash';
import { t } from 'ttag';

import SaveDeckRow from './SaveDeckRow';
import Card from '@data/types/Card';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { useToggles } from '@components/core/hooks';
import { useDeckActions } from '@data/remote/decks';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';

interface Props {
  componentId: string;
  id: string;
}

export default function SaveDecksInput({ componentId, id }: Props) {
  const { latestDecks, campaignState } = useContext(CampaignGuideContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const [unsavedEdits, , setUnsavedEdits] = useToggles({});
  const deckActions = useDeckActions();

  const proceedMessage = useCallback((): string | undefined => {
    const unsavedDeck = find(
      scenarioInvestigators,
      investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return false;
        }
        const storyAssetDeltas = campaignLog.storyAssetChanges(investigator.code);
        if (!find(storyAssetDeltas, (count: number) => count !== 0)) {
          // Doesn't have relevant changes
          return false;
        }
        const choiceId = SaveDeckRow.choiceId(id, investigator);
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
      return t`It looks like one or more deck changes are unsaved.`;
    }

    const unsavedNonDeck = find(
      scenarioInvestigators,
      investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return false;
        }
        const choiceId = SaveDeckRow.choiceId(id, investigator);
        if (scenarioState.numberChoices(choiceId) !== undefined) {
          // Already saved
          return false;
        }
        if (latestDecks[investigator.code]) {
          return false;
        }
        return !!unsavedEdits[investigator.code];
      });
    if (unsavedNonDeck) {
      return t`It looks like you edited the experience or trauma for an investigator, but have not saved it yet. Please go back and select ‘Save adjustments’ to ensure your changes are saved.`;
    }
    return undefined;
  }, [id, latestDecks, unsavedEdits, scenarioInvestigators, scenarioState, campaignLog]);

  const actuallySave = useCallback(() => {
    scenarioState.setDecision(id, true);
    setUnsavedEdits(id, true);
  }, [id, scenarioState, setUnsavedEdits]);

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
  const hasChanges = useMemo(() => !!find(scenarioInvestigators, (investigator: Card) => {
    const storyAssetDeltas = campaignLog.storyAssetChanges(investigator.code);
    return !!find(storyAssetDeltas, (count: number) => count !== 0);
  }), [campaignLog, scenarioInvestigators]);
  if (!hasChanges) {
    return null;
  }

  const hasDecision = scenarioState.decision(id) !== undefined;
  return (
    <InputWrapper
      onSubmit={save}
      title={t`Save deck changes`}
      titleStyle="header"
      editable={!hasDecision}
    >
      { map(scenarioInvestigators, investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return null;
        }
        return (
          <SaveDeckRow
            key={investigator.code}
            actions={deckActions}
            id={id}
            componentId={componentId}
            campaignLog={campaignLog}
            campaignState={campaignState}
            scenarioState={scenarioState}
            investigator={investigator}
            deck={latestDecks[investigator.code]}
            editable={!hasDecision}
          />
        );
      }) }
    </InputWrapper>
  );
}
