import React, { useCallback, useContext } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find, map } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import UpgradeDeckRow from './UpgradeDeckRow';
import InvestigatorRow from '@components/core/InvestigatorRow';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { m, s, xs } from '@styles/space';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { useToggles } from '@components/core/hooks';
import { useCreateDeckActions } from '@data/remote/decks';

interface Props {
  componentId: string;
  id: string;
}

export default function UpgradeDecksInput({ componentId, id }: Props) {
  const { latestDecks, campaignState } = useContext(CampaignGuideContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const [unsavedEdits, , setUnsavedEdits] = useToggles({});
  const actions = useCreateDeckActions();
  const proceedMessage = useCallback((): string | undefined => {
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
  const { borderStyle, typography } = useContext(StyleContext);
  const hasDecision = scenarioState.decision(id) !== undefined;
  return (
    <View>
      <View style={[styles.header, borderStyle]}>
        <Text style={[typography.bigGameFont, typography.right]}>
          { t`Update decks with scenario results` }
        </Text>
      </View>
      { map(scenarioInvestigators, investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return (
            <InvestigatorRow
              key={investigator.code}
              investigator={investigator}
              description={investigator.traumaString(campaignLog.traumaAndCardData(investigator.code))}
              eliminated
            />
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
            actions={actions}
          />
        );
      }) }
      { !hasDecision && (
        <BasicButton
          title={t`Proceed`}
          onPress={save}
        />
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingRight: m,
    paddingBottom: xs,
    paddingTop: s + m,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
