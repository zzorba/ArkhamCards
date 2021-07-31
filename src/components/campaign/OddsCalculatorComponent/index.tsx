import React, { useContext, useMemo, useState } from 'react';
import { filter, find, flatMap, forEach, groupBy, sortBy, keys, map, range } from 'lodash';
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { c, t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import InvestigatorOddsComponent from './InvestigatorOddsComponent';
import SkillOddsRow from './SkillOddsRow';
import VariableTokenInput from './VariableTokenInput';
import CardTextComponent from '@components/card/CardTextComponent';
import ChaosBagLine from '@components/core/ChaosBagLine';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { difficultyString, Scenario, scenarioFromCard } from '@components/campaign/constants';
import { CampaignDifficulty } from '@actions/types';
import { ChaosBag, SPECIAL_TOKENS, SpecialTokenValue, ChaosTokenType, CHAOS_TOKENS, ChaosTokenValue, isSpecialToken, getChaosTokenValue } from '@app_constants';
import Card from '@data/types/Card';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter, useCounters } from '@components/core/hooks';
import { useChaosBagResults } from '@data/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { SCENARIO_CARDS_QUERY } from '@data/sqlite/query';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useSelector } from 'react-redux';
import { getAllStandalonePacks } from '@reducers';
import { Item, useDialog } from '@components/deck/dialogs';
import EncounterIcon from '@icons/EncounterIcon';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import DeckButton from '@components/deck/controls/DeckButton';
import AppIcon from '@icons/AppIcon';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import NewDialog from '@components/core/NewDialog';
import ChaosToken from '../ChaosToken';

interface Props {
  campaign: SingleCampaignT;
  chaosBag: ChaosBag;
  cycleScenarios?: Scenario[];
  allInvestigators: Card[];
  scenarioName: string | undefined;
  scenarioCard: Card | undefined;
  scenarioCode: string | undefined;
  scenarioCardText: string | undefined;
  difficulty: CampaignDifficulty | undefined;
}

export const SCENARIO_CODE_FIXER: {
  [key: string]: string | undefined;
} = {
  the_gathering: 'torch',
  the_midnight_masks: 'arkham',
  the_devourer_below: 'tentacles',
  the_untamed_wilds: 'wilds',
  the_doom_of_eztli: 'eztli',
};

function parseSpecialTokenValuesText(scenarioText: string | undefined): SpecialTokenValue[] {
  const scenarioTokens: SpecialTokenValue[] = [];
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
            const valueRegex = new RegExp(`\\[(${token})\\][^:]*?:?\\s([-+][0-9X])(\\. )?(.*)`);
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
  return scenarioTokens;
}

function NumberInput({ title, value, color, inc, dec }: {
  title: string;
  value: number;
  color: 'red' | 'green';
  inc: () => void;
  dec: () => void;
}) {
  const { fontScale, colors, typography } = useContext(StyleContext);
  const size = 40 * fontScale;
  return (
    <View style={styles.numberInput}>
      <View style={space.paddingSideS}>
        <PlusMinusButtons
          dialogStyle
          count={value}
          size={36}
          onIncrement={inc}
          onDecrement={dec}
          countRender={
            <View style={[space.marginSideXs, styles.center, { borderRadius: size / 2, width: size, height: size, backgroundColor: color === 'red' ? colors.warn : colors.faction.rogue.lightBackground }]}>
              <Text style={[typography.counter, typography.center, typography.bold, { color: color === 'red' ? colors.L30 : colors.D30 }]}>
                { value }
              </Text>
            </View>
          }
          color="dark"
        />
      </View>
      <Text style={[space.marginTopS, typography.small, typography.italic]}>
        { title }
      </Text>
    </View>
  );
}

function ChaosBagOddsPile({
  chaosBag,
  specialTokenValues,
}: {
  chaosBag: ChaosBag;
  specialTokenValues: SpecialTokenValue[];
}) {
  const { width } = useContext(StyleContext);
  const tokensByValue = useMemo(() => {
    return sortBy(map(groupBy(flatMap(CHAOS_TOKENS, token => {
      const count = chaosBag[token] || 0;
      if (!count) {
        return [];
      }
      const value: undefined | ChaosTokenValue = getChaosTokenValue(token, specialTokenValues);
      if (value === undefined) {
        return [];
      }
      return map(range(0, count), () => {
        return {
          value,
          token,
        };
      });
    }), x => x.value), (tokens, value) => {
      return {
        value,
        tokens: map(tokens, t => t.token),
      };
    }), x => -x.value);
  }, [chaosBag, specialTokenValues]);
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      overScrollMode="never"
      contentContainerStyle={[styles.tokenPileRow, space.paddingLeftXs, { minWidth: width }]}
    >
      { map(tokensByValue, x => (
        <View key={x.value} style={[styles.tokenPileColumn, space.paddingRightXs]}>
          {map(x.tokens, (t, idx) => (
            <ChaosToken
              key={idx}
              iconKey={t}
              size="extraTiny"
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

export default function OddsCalculatorComponent({
  campaign,
  chaosBag: originalChaosBag,
  cycleScenarios,
  allInvestigators,
  scenarioName,
  scenarioCard,
  scenarioCardText,
  scenarioCode,
  difficulty: defaultDifficulty,
}: Props) {
  const difficultyText = useMemo(() => {
    return {
      easy: t`Easy difficulty`,
      standard: t`Standard difficulty`,
      hard: t`Hard difficulty`,
      expert: t`Expert difficulty`,
    };
  }, []);
  const [difficulty, setDifficulty] = useState<CampaignDifficulty>(defaultDifficulty || CampaignDifficulty.STANDARD);
  const [scenarioCards, loading] = useCardsFromQuery({ query: SCENARIO_CARDS_QUERY });
  const [currentScenario, setCurrentScenario] = useState<Scenario | undefined>(undefined);
  const chaosBagResults = useChaosBagResults(campaign.id);
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
  const [modifiedSkill, incModifiedSkill, decModifiedSkill] = useCounter(3, { min: 0 });
  const [testDifficulty, incTestDifficulty, decTestDifficulty] = useCounter(3, { min: 0 });
  const standalonePacks = useSelector(getAllStandalonePacks);

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

  const [xValue, incXValue, decXValue] = useCounters({
    skull: 0,
    cultist: 0,
    tablet: 0,
    elder_thing: 0,
    elder_sign: 1,
  });

  const items: Item<Scenario | undefined>[] = useMemo(() => {
    return [
      ...(scenarioName && scenarioCard && scenarioCode ? [
        {
          title: scenarioName,
          value: undefined,
          iconNode: <EncounterIcon encounter_code={scenarioCode} size={24} color={colors.M} />,
        },
      ] : []),
      ...map(filter(cycleScenarios, scenario => !scenario.interlude && scenario.code !== scenarioCode), scenario => {
        return {
          title: scenario.name,
          value: scenario,
          iconNode: <EncounterIcon encounter_code={scenario.code} size={24} color={colors.M} />,
        };
      }),
      { type: 'header', title: t`Standalone` },
      ...map(filter(standaloneScenarios, scenario => scenario.code !== scenarioCode), scenario => {
        return {
          title: scenario.name,
          value: scenario,
          iconNode: <EncounterIcon encounter_code={scenario.code} size={24} color={colors.M} />,
        };
      }),
    ];
  }, [colors, cycleScenarios, standaloneScenarios, scenarioCode, scenarioCard, scenarioName]);
  const name = currentScenario?.name || scenarioName;
  const code = currentScenario?.code || scenarioCode;

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
  const scenarioText = useMemo(() => {
    if (!currentScenario) {
      return scenarioCardText;
    }
    const difficulty = campaign ? campaign.difficulty : undefined;
    const scenarioCard = (scenarioCards && currentScenario && encounterCode) ?
      find(scenarioCards, card => card.encounter_code === encounterCode) :
      undefined;
    return difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT ? scenarioCard?.back_text : scenarioCard?.text;
  }, [campaign, currentScenario, encounterCode, scenarioCardText, scenarioCards]);

  const dialogContent = useMemo(() => {
    return (
      <View>
        <View style={styles.row}>
          { !!code && <EncounterIcon encounter_code={code} size={32} color={colors.D30} /> }
          <View style={[styles.header, space.paddingLeftS]}>
            <Text style={typography.large}>
              { name || '' }
            </Text>
            { !!difficulty && <Text style={typography.smallButtonLabel}>{difficultyText[difficulty]}</Text> }
          </View>
        </View>
        <View style={[styles.line, borderStyle]} />
        { !!scenarioText && (
          <View>
            <CardTextComponent text={scenarioText} />
            <View style={[styles.line, borderStyle]} />
          </View>
        ) }
        <DeckBubbleHeader title={t`— Difficulty —`} />
        { map([CampaignDifficulty.EASY, CampaignDifficulty.STANDARD, CampaignDifficulty.HARD, CampaignDifficulty.EXPERT], d => (
          <NewDialog.PickerItem
            key={d}
            text={difficultyString(d)}
            value={d}
            onValueChange={setDifficulty}
            // tslint:disable-next-line
            selected={difficulty === d}
            last={d === CampaignDifficulty.EXPERT}
          />
        )) }
        <DeckBubbleHeader title={t`— Available Scenarios —`} />
        { map(items, (item, idx) => item.type === 'header' ? (
          <DeckBubbleHeader title={item.title} key={idx} />
        ) : (
          <NewDialog.PickerItem
            key={idx}
            iconName={item.icon}
            iconNode={item.iconNode}
            text={item.title}
            value={item.value}
            onValueChange={setCurrentScenario}
            // tslint:disable-next-line
            selected={currentScenario === item.value}
            last={idx === items.length - 1 || items[idx + 1].type === 'header'}
          />
        )) }
      </View>
    );
  }, [items, setCurrentScenario, currentScenario, name, difficulty, scenarioText, borderStyle, difficultyText, typography, code, colors]);
  const { dialog, showDialog } = useDialog({
    title: t`Scenario settings`,
    content: dialogContent,
    alignment: 'bottom',
    allowDismiss: true,
  });


  const specialTokenValues = useMemo(() => parseSpecialTokenValuesText(scenarioText), [scenarioText]);
  const allSpecialTokenValues: SpecialTokenValue[] = useMemo(() => {
    return [
      { token: 'elder_sign', value: xValue.elder_sign || 0 },
      ...map(specialTokenValues, tokenValue => {
        if (tokenValue.value === 'X') {
          return {
            token: tokenValue.token,
            value: -(xValue[tokenValue.token] || 0),
          };
        }
        return tokenValue;
      }),
    ];
  }, [specialTokenValues, xValue]);

  const investigatorRows = useMemo(() => {
    if (!chaosBag) {
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
  }, [allInvestigators, chaosBag, testDifficulty, allSpecialTokenValues]);

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

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }
  return (
    <View style={[styles.container, backgroundStyle]}>
      <KeepAwake />
      <ScrollView style={[styles.container, backgroundStyle]}>
        <View style={space.paddingS}>
          <DeckButton
            color="light_gray"
            title={name || ''}
            detail={difficulty ? difficultyText[difficulty] : undefined}
            encounterIcon={code}
            bigEncounterIcon
            rightNode={
              <View style={styles.row}>
                <Text style={[typography.smallButtonLabel, { color: colors.D10 }, typography.right, space.marginRightXs]}>
                  { t`Reference\ncard` }
                </Text>
                <AppIcon name="special_cards" size={26} color={colors.D10} />
              </View>
            }
            onPress={showDialog}
          />
        </View>
        <ChaosBagOddsPile
          chaosBag={chaosBag}
          specialTokenValues={allSpecialTokenValues}
        />
        <View style={[styles.difficultyRow, space.marginTopS]}>
          <NumberInput
            title={t`Modified skill`}
            inc={incModifiedSkill}
            dec={decModifiedSkill}
            value={modifiedSkill}
            color="green"
          />
          <Text style={[typography.subHeaderText, typography.dark]}>{c('versus abbreviation').t`VS`}</Text>
          <NumberInput
            title={t`Test difficulty`}
            inc={incTestDifficulty}
            dec={decTestDifficulty}
            value={testDifficulty}
            color="red"
          />
        </View>
        <View style={[styles.line, borderStyle, space.marginSideS]} />
        <VariableTokenInput
          symbol="elder_sign"
          value={xValue.elder_sign || 0}
          text={t`Your investigator's modifier`}
          increment={incXValue}
          decrement={decXValue}
        />
        { specialTokenInputs }
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
      </ScrollView>
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
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: s,
    marginBottom: s,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  numberInput: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenPileRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  tokenPileColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
