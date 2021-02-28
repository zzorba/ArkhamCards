import React, { useContext, useMemo, useState } from 'react';
import { filter, find, flatMap, forEach, head, keys, map } from 'lodash';
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import BasicButton from '@components/core/BasicButton';
import InvestigatorOddsComponent from './InvestigatorOddsComponent';
import SkillOddsRow from './SkillOddsRow';
import VariableTokenInput from './VariableTokenInput';
import CardTextComponent from '@components/card/CardTextComponent';
import ChaosBagLine from '@components/core/ChaosBagLine';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { campaignColor, Scenario, completedScenario, scenarioFromCard } from '@components/campaign/constants';
import Difficulty from '@components/campaign/Difficulty';
import GameHeader from '@components/campaign/GameHeader';
import BackgroundIcon from '@components/campaign/BackgroundIcon';
import { Campaign, CampaignDifficulty, CUSTOM, getCampaignId } from '@actions/types';
import { ChaosBag, CHAOS_TOKEN_COLORS, SPECIAL_TOKENS, SpecialTokenValue, ChaosTokenType } from '@app_constants';
import Card from '@data/types/Card';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useChaosBagResults, useCounter, useCounters } from '@components/core/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { SCENARIO_CARDS_QUERY } from '@data/sqlite/query';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useSelector } from 'react-redux';
import { getAllStandalonePacks } from '@reducers';
import { Item, usePickerDialog } from '@components/deck/dialogs';
import EncounterIcon from '@icons/EncounterIcon';

interface Props {
  campaign: Campaign;
  chaosBag: ChaosBag;
  cycleScenarios?: Scenario[];
  allInvestigators: Card[];
  scenarioCards?: Card[];
}

const SCENARIO_CODE_FIXER: {
  [key: string]: string | undefined;
} = {
  the_untamed_wilds: 'wilds',
  the_doom_of_eztli: 'eztli',
};

function parseSpecialTokenValues(currentScenarioCard?: Card, difficulty?: string): SpecialTokenValue[] {
  const scenarioTokens: SpecialTokenValue[] = [];
  if (currentScenarioCard) {
    let scenarioText = currentScenarioCard.text;
    if (difficulty === CampaignDifficulty.HARD ||
      difficulty === CampaignDifficulty.EXPERT) {
      scenarioText = currentScenarioCard.back_text;
    }
    if (scenarioText) {
      const linesByToken: { [token: string]: string } = {};
      forEach(
        scenarioText.replace(/<br\/>/g, '\n').split('\n'),
        line => {
          const token = find(SPECIAL_TOKENS, token =>
            line.startsWith(`[${token}]`));
          if (token) {
            linesByToken[token] = line;
          }
        });
      SPECIAL_TOKENS.forEach(token => {
        switch (token) {
          case 'elder_sign':
            scenarioTokens.push({
              token,
              value: 0,
            });
            break;
          case 'auto_fail':
            scenarioTokens.push({
              token,
              value: 'auto_fail',
            });
            break;
          default: {
            const line = linesByToken[token];
            if (line) {
              const valueRegex = new RegExp(`\\[(${token})\\]\\s*:?\\s([-+][0-9X])(\\. )?(.*)`);
              if (valueRegex.test(line)) {
                const match = line.match(valueRegex);
                if (match) {
                  if (match[2] === '-X') {
                    scenarioTokens.push({
                      token,
                      value: 'X',
                      xText: match[4],
                    });
                  } else {
                    scenarioTokens.push({
                      token,
                      value: parseFloat(match[2]) || 0,
                      // revealAnother: match[4].toLowerCase().indexOf('reveal another') !== -1,
                    });
                  }
                }
              } else {
                const revealAnotherRegex = new RegExp(`\\[(${token})\\]\\s*:?\\sReveal another (chaos )?token.`);
                if (revealAnotherRegex.test(line)) {
                  scenarioTokens.push({
                    token,
                    value: 'reveal_another',
                    // revealAnother: true,
                  });
                }
              }
            }
          }
        }
      });
    }
  }
  return scenarioTokens;
}

export default function OddsCalculatorComponent({
  campaign,
  chaosBag: originalChaosBag,
  cycleScenarios,
  allInvestigators,
}: Props) {
  const [scenarioCards, loading] = useCardsFromQuery({ query: SCENARIO_CARDS_QUERY });
  const chaosBagResults = useChaosBagResults(getCampaignId(campaign));
  const [chaosBag, sealedChaosBag] = useMemo(() => {
    const sealed: ChaosBag = {};
    forEach(chaosBagResults.sealedTokens, token => {
      if (token.icon !== 'bless' && token.icon !== 'curse') {
        sealed[token.icon] = (sealed[token.icon] || 0) + 1;
      }
    });
    const newChaosBag: ChaosBag = {};
    forEach(originalChaosBag, (count, tokenStr) => {
      const token = tokenStr as ChaosTokenType;
      if (count) {
        if (count > (sealed[token] || 0)) {
          newChaosBag[token] = count - (sealed[token] || 0);
        }
      }
    });
    // newChaosBag.bless = (chaosBagResults.blessTokens || 0) - (sealed.bless || 0);
    // newChaosBag.curse = (chaosBagResults.curseTokens || 0) - (sealed.curse || 0);
    return [newChaosBag, sealed];
  }, [originalChaosBag, chaosBagResults]);
  const { backgroundStyle, borderStyle, colors, typography, width } = useContext(StyleContext);
  const [testDifficulty, incTestDifficulty, decTestDifficulty] = useCounter(3, { min: 0 });
  const standalonePacks = useSelector(getAllStandalonePacks);
  const [currentScenario, setCurrentScenario] = useState<Scenario | undefined>(() => {
    const hasCompletedScenario = completedScenario(campaign ? campaign.scenarioResults : []);
    return head(
      filter(cycleScenarios, scenario =>
        !scenario.interlude &&
        !hasCompletedScenario(scenario)
      )
    ) || undefined;
  });
  const encounterCode = useMemo(() => {
    const encounterCode = currentScenario && (
      currentScenario.code.startsWith('return_to_') ?
        currentScenario.code.substring('return_to_'.length) :
        currentScenario.code);
    if (encounterCode && SCENARIO_CODE_FIXER[encounterCode]) {
      return SCENARIO_CODE_FIXER[encounterCode];
    }
    return encounterCode;
  }, [currentScenario]);
  const standaloneScenarios = useMemo(() => {
    const standalonePackCodes = new Set(map(standalonePacks, pack => pack.code));
    return flatMap(scenarioCards, card => {
      if (standalonePackCodes.has(card.pack_code)) {
        const scenario = scenarioFromCard(card);
        if (scenario) {
          return[scenario];
        }
      }
      return [];
    });
  }, [standalonePacks, scenarioCards]);
  const { currentScenarioCard, specialTokenValues, difficulty } = useMemo(() => {
    const difficulty = campaign ? campaign.difficulty : undefined;
    const currentScenarioCard = (scenarioCards && encounterCode) ?
      find(scenarioCards, card => card.encounter_code === encounterCode) :
      undefined;
    const specialTokenValues = parseSpecialTokenValues(currentScenarioCard, difficulty);
    return {
      currentScenarioCard,
      specialTokenValues,
      difficulty,
    };
  }, [encounterCode, scenarioCards, campaign]);
  const [xValue, incXValue, decXValue] = useCounters({
    skull: 0,
    cultist: 0,
    tablet: 0,
    elder_thing: 0,
  });

  const items: Item<Scenario>[] = useMemo(() => {
    return [
      ...map(filter(cycleScenarios, scenario => !scenario.interlude), scenario => {
        return {
          title: scenario.name,
          value: scenario,
          iconNode: <EncounterIcon encounter_code={scenario.code} size={24} color={colors.M} />,
        };
      }),
      { type: 'header', title: t`Standalone` },
      ...map(standaloneScenarios, scenario => {
        return {
          title: scenario.name,
          value: scenario,
          iconNode: <EncounterIcon encounter_code={scenario.code} size={24} color={colors.M} />,
        };
      }),
    ];
  }, [colors, cycleScenarios, standaloneScenarios]);
  const { dialog, showDialog } = usePickerDialog<Scenario>({
    title: t`Scenario`,
    items,
    onValueChange: setCurrentScenario,
    selectedValue: currentScenario,
  });

  const allSpecialTokenValues = useMemo(() => {
    return map(specialTokenValues, tokenValue => {
      if (tokenValue.value === 'X') {
        return {
          token: tokenValue.token,
          value: -(xValue[tokenValue.token] || 0),
        };
      }
      return tokenValue;
    });
  }, [specialTokenValues, xValue]);

  const investigatorRows = useMemo(() => {
    if (!chaosBag || !currentScenarioCard) {
      return;
    }
    return (
      <>
        <SkillOddsRow
          chaosBag={chaosBag}
          stat={0}
          specialTokenValues={allSpecialTokenValues}
          type="wild"
          testDifficulty={testDifficulty}
        />
        { map(allInvestigators, investigator => (
          <InvestigatorOddsComponent
            key={investigator.real_name}
            investigator={investigator}
            testDifficulty={testDifficulty}
            chaosBag={chaosBag}
            specialTokenValues={allSpecialTokenValues}
          />))
        }
      </>
    );
  }, [allInvestigators, chaosBag, currentScenarioCard, testDifficulty, allSpecialTokenValues]);

  const specialTokenInputs = useMemo(() => {
    if (!find(specialTokenValues, value => value.value === 'X')) {
      return null;
    }
    return (
      <>
        { flatMap(specialTokenValues, token => {
          if (token.value !== 'X' || !token.xText) {
            return null;
          }
          return (
            <VariableTokenInput
              key={token.token}
              symbol={token.token}
              color={CHAOS_TOKEN_COLORS[token.token]}
              value={xValue[token.token] || 0}
              text={token.xText}
              increment={incXValue}
              decrement={decXValue}
            />
          );
        }) }
      </>
    );
  }, [specialTokenValues, xValue, incXValue, decXValue]);

  const scenarioText = currentScenarioCard && (
    (difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT) ?
      currentScenarioCard.back_text :
      currentScenarioCard.text
  );

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }
  return (
    <View style={[styles.container, backgroundStyle]}>
      <KeepAwake />
      <ScrollView style={[styles.container, backgroundStyle]}>
        <View style={[styles.sectionRow, borderStyle]}>
          { campaign.cycleCode !== CUSTOM && !!currentScenario && (
            <BackgroundIcon
              code={currentScenario.code}
              color={campaignColor(campaign.cycleCode, colors)}
            />
          ) }
          <View style={styles.button}>
            { !!campaign.difficulty && <Difficulty difficulty={campaign.difficulty} /> }
            { !!currentScenario && <View style={space.marginTopXs}><GameHeader text={currentScenario.name} /></View> }
            { !!scenarioText && (
              <CardTextComponent text={scenarioText} />
            ) }
          </View>
          <BasicButton
            title={t`Change Scenario`}
            onPress={showDialog}
          />
        </View>
        { specialTokenInputs }
        <View style={[styles.sectionRow, borderStyle]}>
          <Text style={typography.small}>{ t`Chaos Bag` }</Text>
          <ChaosBagLine
            chaosBag={chaosBag}
            width={width - m * 2}
          />
        </View>
        { keys(sealedChaosBag).length > 0 && (
          <View style={[styles.sectionRow, borderStyle]}>
            <Text style={typography.small}>{ t`Sealed tokens` }</Text>
            <ChaosBagLine
              chaosBag={sealedChaosBag}
              width={width - m * 2}
              sealed
            />
          </View>
        ) }
        { investigatorRows }
        <View style={styles.finePrint}>
          <Text style={typography.small}>
            { t`Note: chaos tokens that cause additional tokens to be revealed does not show correct odds for the "Draw Two Pick One" and similar multi-draw situations.` }
          </Text>
        </View>
      </ScrollView>
      <SafeAreaView>
        <View style={[styles.footer, borderStyle]}>
          <View style={[styles.countRow, styles.footerRow, { backgroundColor: colors.L20 }]}>
            <Text style={typography.text}>{ t`Difficulty` }</Text>
            <Text style={[{ color: colors.darkText, fontSize: 30, marginLeft: 10, marginRight: 10 }]}>
              { testDifficulty }
            </Text>
            <PlusMinusButtons
              count={testDifficulty}
              size={36}
              onIncrement={incTestDifficulty}
              onDecrement={decTestDifficulty}
              color="dark"
            />
          </View>
        </View>
      </SafeAreaView>
      { dialog }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionRow: {
    padding: s,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    borderTopWidth: 1,
  },
  footerRow: {
    padding: s,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finePrint: {
    padding: s,
  },
  button: {
    padding: s,
  },
});
