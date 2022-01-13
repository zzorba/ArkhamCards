import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { forEach, flatMap, map, keys, range, values, sumBy } from 'lodash';
import { t } from 'ttag';

import { StringChoices, WeaknessSet } from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import { drawWeakness } from '@lib/weaknessHelper';
import InvestigatorButton from '@components/campaignguide/InvestigatorButton';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import StyleContext from '@styles/StyleContext';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';

interface OwnProps {
  id: string;
  investigators: Card[];
  weaknessCards: CardsMap;
  traits: string[];
  standalone: boolean;
  realTraits: boolean;
  campaignLog: GuidedCampaignLog;
  scenarioState: ScenarioStateHelper;
  count: number;
}

type Props = OwnProps;

function DrawRandomWeaknessButton({ investigator, choice, choiceCard, drawRandomWeakness, index, disabled }: {
  investigator: Card;
  choice?: string;
  choiceCard?: Card;
  index: number;
  disabled: boolean;
  drawRandomWeakness: (investigator: string, index: number) => void;
}) {
  const onPress = useCallback((code: string) => {
    drawRandomWeakness(code, index);
  }, [index, drawRandomWeakness]);
  return (
    <InvestigatorButton
      investigator={investigator}
      value={choice === undefined ?
        t`Draw random weakness` :
        (choiceCard?.name || 'Missing Card')
      }
      onPress={onPress}
      disabled={disabled}
      widget="shuffle"
    />
  );
}

export default function DrawRandomWeaknessComponent({ id, investigators, weaknessCards, standalone, traits, realTraits, campaignLog, scenarioState, count }: Props) {
  const { campaignInvestigators, latestDecks, weaknessSet } = useContext(CampaignGuideContext);
  const { borderStyle } = useContext(StyleContext);
  const [choices, setChoices] = useState<{ [code: string]: { [index: string]: string }}>({});
  const effectiveWeaknessSet: WeaknessSet = useMemo(() => {
    return campaignLog.effectiveWeaknessSet(
      campaignInvestigators,
      latestDecks,
      weaknessSet,
      weaknessCards,
      flatMap(values(choices), x => values(x))
    );
  }, [weaknessCards, campaignLog, choices, campaignInvestigators, latestDecks, weaknessSet]);

  const drawRandomWeakness = useCallback((code: string, index: number) => {
    const card = drawWeakness(
      effectiveWeaknessSet,
      weaknessCards,
      {
        traits,
        multiplayer: campaignLog.playerCount() > 1,
        standalone,
      },
      realTraits
    );
    if (!card) {
      Alert.alert(t`All weaknesses have been assigned.`);
    } else {
      setChoices({
        ...choices,
        [code]: {
          ...(choices[code] || {}),
          [index]: [card.code],
        },
      });
    }
  }, [weaknessCards, traits, campaignLog, realTraits, standalone, effectiveWeaknessSet, choices, setChoices]);

  const save = useCallback(() => {
    const stringChoices: StringChoices = {};
    forEach(choices, (drawnCards, code) => {
      stringChoices[code] = values(drawnCards);
    });
    scenarioState.setStringChoices(`${id}_weakness`, stringChoices);
    setChoices({});
  }, [id, scenarioState, choices, setChoices]);

  const scenarioChoices = scenarioState.stringChoices(`${id}_weakness`);
  const saveDisabled = useMemo(() => {
    if (scenarioChoices !== undefined) {
      return false;
    }
    return investigators.length !== sumBy(keys(choices), investigator => {
      const investigatorChoices = choices[investigator];
      return values(investigatorChoices).length === count ? 1 : 0;
    });
  }, [scenarioChoices, count, investigators, choices]);
  return (
    <InputWrapper
      title={scenarioChoices === undefined ? t`Tap to draw` : t`Random results`}
      onSubmit={save}
      disabledText={saveDisabled ? t`Continue` : undefined}
      editable={scenarioChoices === undefined}
    >
      <View style={[styles.wrapper, borderStyle]}>
        { map(investigators, investigator => (
          map(range(0, count), idx => {
            const choice = scenarioChoices !== undefined ? scenarioChoices[investigator.code][idx] :
              choices[investigator.code]?.[idx];
            const choiceCard = choice ? weaknessCards[choice] : undefined;
            return (
              <DrawRandomWeaknessButton
                key={`${investigator.code}_${idx}`}
                investigator={investigator}
                choice={choice}
                choiceCard={choiceCard}
                drawRandomWeakness={drawRandomWeakness}
                index={idx}
                disabled={scenarioChoices !== undefined}
              />
            );
          })
        )) }
      </View>
    </InputWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
