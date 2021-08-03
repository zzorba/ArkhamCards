import React, { useContext, useMemo, useState } from 'react';
import { filter, head, find, flatMap, forEach, groupBy, sortBy, keys, map, range, sumBy, values, reverse, tail, partition, maxBy, minBy, max } from 'lodash';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { c, t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import VariableTokenInput from './VariableTokenInput';
import CardTextComponent from '@components/card/CardTextComponent';
import ChaosBagLine from '@components/core/ChaosBagLine';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { difficultyString, Scenario, scenarioFromCard } from '@components/campaign/constants';
import { CampaignDifficulty } from '@actions/types';
import { ChaosBag, SPECIAL_TOKENS, SpecialTokenValue, ChaosTokenType, CHAOS_TOKENS, ChaosTokenValue, getChaosTokenValue, chaosTokenName } from '@app_constants';
import Card from '@data/types/Card';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter, useCounters, useFlag } from '@components/core/hooks';
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
import ChaosToken, { getChaosTokenSize } from '../ChaosToken';

interface Props {
  campaign: SingleCampaignT;
  chaosBag: ChaosBag;
  cycleScenarios?: Scenario[];
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
            <View style={[space.marginSideXs, styles.center, { borderRadius: size / 2, width: size, height: size, backgroundColor: color === 'red' ? colors.warn : colors.green }]}>
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

function isPassing(value: ChaosTokenValue, modifiedSkill: number, testDifficulty: number): boolean {
  switch(value) {
    case 'auto_succeed': return true;
    case 'auto_fail': return false;
    case 'reveal_another':
    case 'X':
      // Should not happen
      return false;
    default:
      return Math.max(0, value + modifiedSkill) >= testDifficulty;
  }
}

function calculatePassingOdds(
  chaosBag: ChaosBag,
  specialTokenValues: SpecialTokenValue[],
  modifiedSkill: number,
  testDifficulty: number
) {
  const flatTokens = flatMap(CHAOS_TOKENS, token => {
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
  });
  const [passing, failing] = partition(flatTokens, t => isPassing(t.value, modifiedSkill, testDifficulty));
  const total = passing.length + failing.length;
  if (total === 0) {
    return 0;
  }
  return Math.round(passing.length / total * 100);
}

interface ChaosBagProps {
  chaosBag: ChaosBag;
  specialTokenValues: SpecialTokenValue[];
  modifiedSkill: number;
  testDifficulty: number;
}

function ChaosTokenColumn({ value, tokens, height }: { value: ChaosTokenValue; tokens: ChaosTokenType[]; height: number }) {
  return (
    <View style={[
      styles.tokenPileColumn,
      {
        width: getChaosTokenSize('extraTiny'),
        height,
        marginRight: value === 'auto_fail' ? s : 1.5,
        marginLeft: value === 'auto_succeed' ? s : 1.5,
      },
    ]}>
      { map(tokens, (t, idx) => <ChaosToken key={idx} iconKey={t} size="extraTiny" />) }
    </View>
  );
}

interface ChaosTokenCollection {
  value: ChaosTokenValue;
  tokens: ChaosTokenType[];
  modifiedValue: number;
}
function ChaosTokenPile({ pile, height, mode, showBlurse, totalTokens }: { pile: ChaosTokenCollection[]; height: number; mode: 'fail' | 'pass'; totalTokens: number; showBlurse: boolean }) {
  const { colors, typography } = useContext(StyleContext);
  const [auto_fail, center, auto_succeed] = useMemo(() => {
    const [leading, remaining] = partition(pile, x => x.value === 'auto_fail');
    const [trailing, center] = partition(remaining, x => x.value === 'auto_succeed');
    if (!center.length) {
      return [leading, [], trailing];
    }
    const stop = mode === 'fail' ? center[0].modifiedValue : center[center.length - 1].modifiedValue;
    const direction = mode === 'fail' ? -1 : 1;
    const groupedCenters = flatMap(
      range(mode === 'fail' ? 1 : 0, stop + (stop % 2) + direction, mode === 'fail' ? -2 : 2),
      count => {
        const a = find(center, c => c.modifiedValue === count);
        const b = find(center, c => c.modifiedValue === count + direction);
        if (!a && !b) {
          return [];
        }
        const rangeTokens = (a?.tokens.length || 0) + (b?.tokens.length || 0);
        const delta = `${mode === 'fail' ? '+' : '-'}${Math.round(rangeTokens / totalTokens * 100)}%`
        return {
          pair: mode === 'fail' ? [
            ...(b ? [b] : []),
            ...(a ? [a] : []),
          ] : [
            ...(a ? [a] : []),
            ...(b ? [b] : []),
          ],
          delta,
        };
      });

    return [leading, mode === 'fail' ? reverse(groupedCenters) : groupedCenters, trailing];
  }, [pile, mode, totalTokens]);
  const borderColor = mode === 'fail' ? colors.faction.dual.text : colors.faction.mystic.text;
  const textColor = mode === 'fail' ? colors.skill.wild.icon : colors.faction.mystic.text;
  const noBorderIndex = mode === 'fail' ? 0 : center.length - 1;
  return (
    <View style={styles.tokenPileRow}>
      { map(auto_fail, x => (
        <View key={x.value}>
          <ChaosTokenColumn value={x.value} tokens={x.tokens} height={height} />
          { showBlurse && <Text style={[typography.small, space.marginTopS, space.marginBottomXs]}> </Text> }
        </View>
      )) }
      { map(center, ({ pair, delta }, idx) => (
        <View style={[
          idx !== noBorderIndex && mode === 'fail' && showBlurse ? styles.blessPile : undefined,
          idx !== noBorderIndex && mode === 'pass' && showBlurse ? styles.cursePile : undefined,
          { borderColor },
        ]} key={idx}>
          <View style={styles.tokenPileRow}>
            { map(pair, x => <ChaosTokenColumn key={x.value} value={x.value} tokens={x.tokens} height={height} />) }
          </View>
          { showBlurse && (
            <Text style={[typography.small, typography.center, { color: textColor }, space.marginTopS, space.marginBottomXs]}>
              { delta }
            </Text>
          ) }
        </View>
      )) }
      { map(auto_succeed, x => (
        <View key={x.value}>
          <ChaosTokenColumn value={x.value} tokens={x.tokens} height={height} />
          { showBlurse && <Text style={[typography.small, space.marginTopS, space.marginBottomXs]}> </Text> }
        </View>
      )) }
    </View>
  );
}

function ChaosBagOddsSection({
  chaosBag,
  specialTokenValues,
  modifiedSkill,
  testDifficulty,
}: ChaosBagProps) {
  const bless = chaosBag.bless || 0;
  const curse = chaosBag.curse || 0;
  const bagTotal = useMemo(() => sumBy(values(chaosBag), x => x), [chaosBag]);
  const [showBlurse, toggleShowBlurse] = useFlag(true);
  const { typography, colors, width } = useContext(StyleContext);
  const tokensByValue: ChaosTokenCollection[] = useMemo(() => {
    const result: { value: ChaosTokenValue; tokens: ChaosTokenType[] }[] = map(groupBy(flatMap(CHAOS_TOKENS, token => {
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
    }), x => x.value), (tokens) => {
      return {
        value: head(tokens)?.value || 0,
        tokens: map(tokens, t => t.token),
      };
    });
    return map(reverse(sortBy(result, x => {
      switch (x.value) {
        case 'auto_succeed':
          return -100;
        case 'auto_fail':
          return 100;
        case 'reveal_another':
        case 'X':
          return 0;
        default:
          return -x.value;
      }
    })), x => {
      switch (x.value) {
        case 'auto_succeed':
        case 'auto_fail':
        case 'reveal_another':
        case 'X':
          return {
            ...x,
            modifiedValue: 0,
          };
        default: {
          const modified = modifiedSkill - testDifficulty + x.value;
          return {
            ...x,
            modifiedValue: modified,
          };
        }
      }
    });
  }, [chaosBag, specialTokenValues, testDifficulty, modifiedSkill]);

  const { passing, failing, passingTokens, failingTokens } = useMemo(() => {
    const [passing, failing] = partition(tokensByValue, t => isPassing(t.value, modifiedSkill, testDifficulty));
    return {
      passing,
      failing,
      passingTokens: sumBy(passing, p => p.tokens.length),
      failingTokens: sumBy(failing, f => f.tokens.length),
    }
  }, [testDifficulty, modifiedSkill, tokensByValue]);
  const tokenSize = getChaosTokenSize('extraTiny')
  const total = passingTokens + failingTokens;
  if (total === 0) {
    return null;
  }
  const largestPile = maxBy(tokensByValue, t => t.tokens.length)?.tokens.length || 0;
  const passPercent = Math.round(passingTokens / total * 100);
  const failPercent = Math.round(failingTokens / total * 100);
  const height = largestPile * tokenSize;

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      overScrollMode="never"
      bounces={false}
      contentContainerStyle={styles.oddsSection}
    >
      <View style={[styles.tokenPileRow, { minWidth: width }, space.paddingSideS, space.marginBottomS]}>
        <View>
          <View style={[styles.tokenPileRow, space.marginBottomS]}>
            { failing.length > 0 && (
              <View style={[styles.failPile, passing.length ? { paddingRight: 2, borderRightWidth: 1, borderColor: colors.M } : undefined]}>
                <ChaosTokenPile mode="fail" showBlurse={showBlurse} pile={failing} height={height} totalTokens={total} />
                <View style={[space.paddingTopS, space.paddingRightXs]}>
                  <Text style={[typography.large, { color: colors.warn }, typography.right]}>{failPercent}%</Text>
                  <Text style={[typography.smallLabel, { color: colors.warn }, typography.right]} ellipsizeMode="clip" numberOfLines={1}>
                    {t`${failingTokens}/${total} tokens`}
                  </Text>
                </View>
              </View>
            ) }
            { passing.length > 0 && (
              <View style={[styles.passPile, failing.length ? { paddingLeft: 2 } : undefined]}>
                <ChaosTokenPile mode="pass" showBlurse={showBlurse} pile={passing} height={height} totalTokens={total} />
                <View style={[space.paddingTopS, space.paddingLeftXs]}>
                  <Text style={[typography.large, { color: colors.campaign.setup }]}>{passPercent}%</Text>
                  <Text style={[typography.smallLabel, { color: colors.campaign.setup }]} ellipsizeMode="clip" numberOfLines={1}>
                    {t`${passingTokens}/${total} tokens`}
                  </Text>
                </View>
              </View>
            ) }
          </View>
          <View style={[styles.bar, { backgroundColor: colors.L15 }]} removeClippedSubviews>
            { failingTokens > 0 && (
              <View style={[styles.innerBar, { borderTopLeftRadius: 1.5, borderBottomLeftRadius: 1.5, left: 0, backgroundColor: colors.warn, width: `${Math.round(failingTokens / bagTotal * 100)}%` }]} />
            ) }
            { passingTokens > 0 && (
              <View style={[styles.innerBar, { borderTopRightRadius: 1.5, borderBottomRightRadius: 1.5, right: 0, backgroundColor: colors.campaign.setup, width: `${Math.round(passingTokens / bagTotal * 100)}%` }]} />
            ) }
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function SpecialTokenOdds({ chaosBag, specialTokenValues, modifiedSkill, testDifficulty }: ChaosBagProps) {
  const { colors, typography } = useContext(StyleContext);
  const bless = chaosBag.bless || 0;
  const curse = chaosBag.curse || 0;
  const finalTokens = useMemo(() => {
    const drawAnotherTokens = flatMap(specialTokenValues, t => {
      if (!t.revealAnother && t.value !== 'reveal_another') {
        return [];
      }
      if ((chaosBag[t.token] || 0) <= 0) {
        return [];
      }
      return {
        textModifier: typeof t.value === 'number' ? `${t.value}` : '0',
        modifier: typeof t.value === 'number' ? t.value : 0,
        token: t.token,
        count: chaosBag[t.token] || 0,
        color: colors.D30,
      };
    });
    if (bless > 0) {
      drawAnotherTokens.push({
        token: 'bless',
        textModifier: '+2',
        modifier: 2,
        count: bless,
        color: colors.token.bless,
      });
    }
    if (curse > 0) {
      drawAnotherTokens.push({
        token: 'curse',
        textModifier: '-2',
        modifier: -2,
        count: curse,
        color: colors.token.curse,
      });
    }
    const basePass = calculatePassingOdds(chaosBag, specialTokenValues, modifiedSkill, testDifficulty)
    return map(drawAnotherTokens, t => {
      if (t.modifier === 0) {
        return { ...t, boost: undefined };
      }
      const minBoost = calculatePassingOdds(chaosBag, specialTokenValues, modifiedSkill + t.modifier, testDifficulty) - basePass;
      const maxBoost = t.count > 1 ? calculatePassingOdds(chaosBag, specialTokenValues, modifiedSkill + t.modifier * t.count, testDifficulty) - basePass : minBoost;
      return {
        ...t,
        boost: {
          min: minBoost > 0 ? `+${minBoost}%` : `${minBoost}%`,
          max: maxBoost > 0 ? `+${maxBoost}%` : `${maxBoost}%`,
        },
      };
    });
  }, [chaosBag, specialTokenValues, bless, curse, colors, testDifficulty, modifiedSkill]);
  const total = useMemo(() => sumBy(values(chaosBag), x => x), [chaosBag]);
  if (total === 0) {
    return null;
  }
  if (finalTokens.length === 0) {
    return null;
  }
  return (
    <View style={space.paddingTopS}>
      { map(finalTokens, ({ token, modifier, count, boost, color }) => (
        <View style={[styles.specialTokenRow, space.paddingVerticalXs]} key={token}>
          <View style={[styles.specialTokenValue, space.paddingSideS]}>
            <Text style={[typography.large, { color }]}>{Math.round(count / total * 100)}%</Text>
            <Text style={[typography.smallLabel, { color }]}>{count}/{total}</Text>
          </View>
          <ChaosToken iconKey={token} size="extraTiny" />
          <View style={[styles.specialTokenRow, space.paddingSideS]}>
            <Text style={[typography.subHeaderText, typography.dark, space.marginRightXs]}>{chaosTokenName(token)}</Text>
            <Text style={[typography.smallLabel, typography.italic, typography.dark]}>{t`${modifier}, draws another`}</Text>
          </View>
          { !!boost && (
            <View style={[styles.modifierBoost, space.paddingRightS]}>
              <Text style={[typography.small, { color }]}>{boost.min}{boost.min !== boost.max ? ` ~ ${boost.max}` : ''}</Text>
            </View>
          ) }
        </View>
      )) }
    </View>
  )
}

export default function OddsCalculatorComponent({
  campaign,
  chaosBag: originalChaosBag,
  cycleScenarios,
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
      sealed[token.icon] = (sealed[token.icon] || 0) + 1;
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
    newChaosBag.bless = (chaosBagResults.blessTokens || 0) - (sealed.bless || 0);
    newChaosBag.curse = (chaosBagResults.curseTokens || 0) - (sealed.curse || 0);
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
    const text = difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT ? scenarioCard?.back_text : scenarioCard?.text;
    return text ? tail(text.split('\n')).join('\n') : undefined;
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
      <ScrollView style={[styles.container, backgroundStyle]} overScrollMode="never" bounces={false}>
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
        <ChaosBagOddsSection
          chaosBag={chaosBag}
          specialTokenValues={allSpecialTokenValues}
          modifiedSkill={modifiedSkill}
          testDifficulty={testDifficulty}
        />
        <View style={[styles.difficultyRow, space.marginTopS, space.marginBottomS]}>
          <NumberInput
            title={t`Test difficulty`}
            inc={incTestDifficulty}
            dec={decTestDifficulty}
            value={testDifficulty}
            color="red"
          />
          <View>
            <Text style={[typography.subHeaderText, typography.dark]}>{c('versus abbreviation').t`VS`}</Text>
            <Text style={[space.marginTopS, typography.small, typography.italic]}> </Text>
          </View>
          <NumberInput
            title={t`Modified skill`}
            inc={incModifiedSkill}
            dec={decModifiedSkill}
            value={modifiedSkill}
            color="green"
          />
        </View>
        <SpecialTokenOdds
          chaosBag={chaosBag}
          specialTokenValues={allSpecialTokenValues}
          modifiedSkill={modifiedSkill}
          testDifficulty={testDifficulty}
        />
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
  oddsSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    paddingLeft: 1,
    paddingRight: 1,
  },
  specialTokenRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  specialTokenValue: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modifierBoost: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  failPile: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  passPile: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  blessPile: {
    borderLeftWidth: 1,
    marginLeft: 1,
    paddingLeft: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cursePile: {
    borderRightWidth: 1,
    marginRight: 1,
    paddingRight: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    borderTopLeftRadius: 1.5,
    borderBottomLeftRadius: 1.5,
    height: 3,
    borderTopRightRadius: 1.5,
    borderBottomRightRadius: 1.5,
    position: 'relative',
  },
  innerBar: {
    position: 'absolute',
    top: 0,
    height: 3,
  },
});
