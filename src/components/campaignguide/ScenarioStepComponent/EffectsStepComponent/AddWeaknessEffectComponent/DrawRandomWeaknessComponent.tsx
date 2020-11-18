import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { forEach, keys, map, values } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { StringChoices, WeaknessSet } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import { drawWeakness } from '@lib/weaknessHelper';
import InvestigatorButton from '@components/core/InvestigatorButton';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import StyleContext from '@styles/StyleContext';

interface OwnProps {
  id: string;
  investigators: Card[];
  cards: CardsMap;
  weaknessCards: Card[];
  traits: string[];
  realTraits: boolean;
  campaignLog: GuidedCampaignLog;
  scenarioState: ScenarioStateHelper;
}

type Props = OwnProps;

export default function DrawRandomWeaknessComponent({ id, investigators, cards, weaknessCards, traits, realTraits, campaignLog, scenarioState }: Props) {
  const { campaignInvestigators, latestDecks, weaknessSet } = useContext(CampaignGuideContext);
  const { borderStyle } = useContext(StyleContext);
  const [choices, setChoices] = useState<{ [code: string]: string }>({});
  const effectiveWeaknessSet: WeaknessSet = useMemo(() => {
    return campaignLog.effectiveWeaknessSet(
      campaignInvestigators,
      latestDecks,
      weaknessSet,
      cards,
      values(choices)
    );
  }, [cards, campaignLog, choices, campaignInvestigators, latestDecks, weaknessSet]);

  const drawRandomWeakness = useCallback((code: string) => {
    const card = drawWeakness(
      effectiveWeaknessSet,
      weaknessCards,
      {
        traits,
        multiplayer: campaignLog.playerCount() > 1,
        standalone: false,
      },
      realTraits
    );
    if (!card) {
      Alert.alert(t`All weaknesses have been assigned.`);
    } else {
      setChoices({
        ...choices,
        [code]: card.code,
      });
    }
  }, [weaknessCards, traits, campaignLog, realTraits, effectiveWeaknessSet, choices, setChoices]);

  const save = useCallback(() => {
    const stringChoices: StringChoices = {};
    forEach(choices, (card, code) => {
      stringChoices[code] = [card];
    });
    scenarioState.setStringChoices(`${id}_weakness`, stringChoices);
  }, [id, scenarioState, choices]);

  const scenarioChoices = scenarioState.stringChoices(`${id}_weakness`);
  const saveButton = useMemo(() => {
    if (scenarioChoices !== undefined) {
      return null;
    }
    return (
      <BasicButton
        disabled={keys(choices).length !== investigators.length}
        onPress={save}
        title={t`Proceed`}
      />
    );
  }, [investigators, save, choices, scenarioChoices]);
  return (
    <>
      <View style={[styles.wrapper, borderStyle]}>
        { map(investigators, investigator => {
          const choice = scenarioChoices !== undefined ? scenarioChoices[investigator.code][0] :
            choices[investigator.code];
          const choiceCard = choice ? cards[choice] : undefined;
          return (
            <InvestigatorButton
              key={investigator.code}
              investigator={investigator}
              value={choice === undefined ?
                t`Draw random weakness` :
                (choiceCard?.name || 'Missing Card')
              }
              onPress={drawRandomWeakness}
              disabled={choice !== undefined}
              widget="shuffle"
            />
          );
        }) }
      </View>
      { saveButton }
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
