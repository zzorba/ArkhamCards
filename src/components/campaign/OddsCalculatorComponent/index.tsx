import React, { useContext, useMemo, useState } from 'react';
import { filter, head, find, flatMap, forEach, groupBy, sortBy, keys, map, range, sumBy, values, reverse, tail, partition, maxBy } from 'lodash';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { c, msgid, ngettext, t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import VariableTokenInput from './VariableTokenInput';
import ChaosBagLine from '@components/core/ChaosBagLine';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { difficultyString, Scenario, scenarioFromCard } from '@components/campaign/constants';
import { CampaignDifficulty } from '@actions/types';
import { ChaosBag, SPECIAL_TOKENS, ChaosTokenType, CHAOS_TOKENS, getChaosTokenValue } from '@app_constants';
import Card from '@data/types/Card';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter, useCounters, useFlag, useToggles } from '@components/core/hooks';
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
import { loadChaosTokens } from '@data/scenario';
import LanguageContext from '@lib/i18n/LanguageContext';
import { SingleChaosTokenValue, ChaosTokenModifier, SimpleChaosTokenValue } from '@data/scenario/types';
import ToggleTokenInput from './ToggleTokenInput';
import { TINY_PHONE } from '@styles/sizes';
import TokenTextLine from './TokenTextLine';
import InvestigatorRadioChoice from '@components/campaignguide/prompts/ChooseInvestigatorPrompt/InvestigatorRadioChoice';
import { elderSign } from './constants';
import RoundButton from '@components/core/RoundButton';
import ArkhamIcon from '@icons/ArkhamIcon';


interface Props {
  campaign: SingleCampaignT;
  chaosBag: ChaosBag;
  allInvestigators: Card[];
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

function parseSpecialTokenValuesText(
  lang: string,
  hardExpert: boolean,
  scenarioText: string | undefined,
  scenarioCard: Card | undefined,
  scenarioCode: string | undefined,
  investigator: Card | undefined,
): SingleChaosTokenValue[] {
  const tokenText: { [key: string]: string | undefined } = {};
  const scenarioTokens: SingleChaosTokenValue[] = [];
  if (scenarioText) {
    const linesByToken: { [token: string]: string } = {};
    forEach(
      scenarioText.replace(/<br\/>/g, '\n').split('\n'),
      line => {
        const token = find(SPECIAL_TOKENS, token =>
          line.indexOf(`[${token}]`) !== -1
        );
        if (token) {
          linesByToken[token] = line;
        }
      });
    SPECIAL_TOKENS.forEach(token => {
      switch (token) {
        case 'elder_sign':
          scenarioTokens.push({
            token: 'elder_sign',
            type: 'counter',
            counter: {
              prompt: t`Your investigator's modifier`,
            },
          });
          break;
        case 'auto_fail':
          scenarioTokens.push({
            token: 'auto_fail',
            value: {
              modifier: 'auto_fail',
            },
          });
          break;
        case 'bless':
        case 'curse':
          // nop
          break;
        default: {
          const line = linesByToken[token];
          if (line) {
            const effectText = line.indexOf(':') !== -1 ? tail(line.split(':')).join(':') : tail(line.split(']')).join(']');
            tokenText[token] = effectText;
            const valueRegex = new RegExp(`\\[(${token})\\][^:]*?:?\\s([-+][0-9X])(\\. )?(.*)`);
            if (valueRegex.test(line)) {
              const match = line.match(valueRegex);
              if (match) {
                if (match[2] === '-X') {
                  scenarioTokens.push({
                    token,
                    text: effectText,
                    type: 'counter',
                    counter: {
                      prompt: match[4],
                    },
                  });
                } else {
                  scenarioTokens.push({
                    token,
                    text: effectText,
                    value: {
                      modifier: parseFloat(match[2]) || 0,
                    },
                  });
                }
              }
            } else {
              const revealAnotherRegex = new RegExp(`\\[(${token})\\]\\s*:?\\sReveal another (chaos )?token.`);
              if (revealAnotherRegex.test(line)) {
                scenarioTokens.push({
                  token,
                  text: effectText,
                  value: {
                    reveal_another: true,
                    modifier: 0,
                  },
                });
              }
            }
          }
        }
      }
    });
  }
  const parsedTokens = loadChaosTokens(lang, scenarioCard?.code, scenarioCode);
  if (parsedTokens) {
    return map(
      hardExpert ? parsedTokens.hard : parsedTokens.standard,
      token => {
        if (token.token === 'skull' && investigator?.code === '02004') {
          const originalTokenText = tokenText.skull || '???';
          const jimText = t`0: (original effect below)\n${originalTokenText}`;
          if (token.type === 'condition') {
            return {
              token: 'skull',
              type: 'condition',
              condition: {
                default_value: {
                  ...token.condition.default_value,
                  modifier: typeof token.condition.default_value.modifier === 'number' ? 0 : token.condition.default_value.modifier,
                },
                prompt: token.condition.prompt,
                modified_value: {
                  ...token.condition.modified_value,
                  modifier: typeof token.condition.modified_value.modifier === 'number' ? 0 : token.condition.modified_value.modifier,
                },
              },
              text: jimText,
            };
          }
          if (token.type === 'counter') {
            return {
              token: 'skull',
              value: {
                modifier: 0,
              },
              text: jimText,
            };
          }
          return {
            token: 'skull',
            value: {
              modifier: 0,
              reveal_another: token.value.reveal_another,
              cancel_modifiers: token.value.cancel_modifiers,
            },
            text: jimText,
          };
        }
        return {
          ...token,
          text: tokenText[token.token] || '???',
        };
      }
    );
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
  const { fontScale, colors, typography, width } = useContext(StyleContext);
  const size = 40 * fontScale;
  return (
    <View style={[styles.numberInput, { maxWidth: Math.min(150, width * 0.4) }]}>
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
      <Text style={[space.marginTopS, typography.small, typography.center, typography.italic]} numberOfLines={2} ellipsizeMode="clip">
        { title }
      </Text>
    </View>
  );
}

function isPassing(value: ChaosTokenModifier, modifiedSkill: number, testDifficulty: number): boolean {
  if (value.modifier === 'auto_succeed') {
    return true;
  }
  if (value.modifier === 'auto_fail') {
    return false;
  }
  return Math.max(0, value.modifier + modifiedSkill) >= testDifficulty;
}

function calculatePassingOdds(
  chaosBag: ChaosBag,
  specialTokenValues: SimpleChaosTokenValue[],
  modifiedSkill: number,
  testDifficulty: number
) {
  const flatTokens = flatMap(CHAOS_TOKENS, token => {
    const count = chaosBag[token] || 0;
    if (!count) {
      return [];
    }
    const value: undefined | ChaosTokenModifier = getChaosTokenValue(token, specialTokenValues);
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
  specialTokenValues: SimpleChaosTokenValue[];
  modifiedSkill: number;
  testDifficulty: number;
}

function ChaosTokenColumn({ value, tokens, height }: { value: ChaosTokenModifier; tokens: ChaosTokenType[]; height: number }) {
  return (
    <View style={[
      styles.tokenPileColumn,
      {
        width: getChaosTokenSize('extraTiny'),
        height,
        marginRight: value.modifier === 'auto_fail' ? s : 1.5,
        marginLeft: value.modifier === 'auto_succeed' ? s : 1.5,
      },
    ]}>
      { map(tokens, (t, idx) => <ChaosToken key={idx} iconKey={t} size="extraTiny" />) }
    </View>
  );
}

interface ChaosTokenCollection {
  value: ChaosTokenModifier;
  tokens: ChaosTokenType[];
  modifiedValue: number;
}
function ChaosTokenPile({ pile, height, mode, showBlurse, totalTokens }: { pile: ChaosTokenCollection[]; height: number; mode: 'fail' | 'pass'; totalTokens: number; showBlurse: boolean }) {
  const { colors, typography } = useContext(StyleContext);
  const [auto_fail, center, auto_succeed] = useMemo(() => {
    const [leading, remaining] = partition(pile, x => x.value.modifier === 'auto_fail');
    const [trailing, center] = partition(remaining, x => x.value.modifier === 'auto_succeed');
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
        const delta = `${Math.round(rangeTokens / totalTokens * 100)}%`
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
      { map(auto_fail, (x, idx) => (
        <View key={idx}>
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
            { map(pair, (x, idx2) => <ChaosTokenColumn key={idx2} value={x.value} tokens={x.tokens} height={height} />) }
          </View>
          { showBlurse && (
            <Text style={[typography.small, typography.center, { color: textColor }, space.marginTopS, space.marginBottomXs]}>
              { delta }
            </Text>
          ) }
        </View>
      )) }
      { map(auto_succeed, (x, idx) => (
        <View key={idx}>
          <ChaosTokenColumn value={x.value} tokens={x.tokens} height={height} />
          { showBlurse && <Text style={[typography.small, space.marginTopS, space.marginBottomXs]}> </Text> }
        </View>
      )) }
    </View>
  );
}

function tokenRatioString(tokens: number, total: number): string {
  return ngettext(msgid`${tokens}/${total} token`,
    `${tokens}/${total} tokens`,
    total
  );
}

function ChaosBagOddsSection({
  chaosBag,
  specialTokenValues,
  modifiedSkill,
  testDifficulty,
  showBlurse,
}: ChaosBagProps & { showBlurse: boolean }) {
  const bagTotal = useMemo(() => sumBy(values(chaosBag), x => x || 0), [chaosBag]);
  const { typography, colors, width } = useContext(StyleContext);
  const tokensByValue: ChaosTokenCollection[] = useMemo(() => {
    const result: { value: ChaosTokenModifier; tokens: ChaosTokenType[] }[] = map(groupBy(flatMap(CHAOS_TOKENS, token => {
      const count = chaosBag[token] || 0;
      if (!count) {
        return [];
      }
      const value: undefined | ChaosTokenModifier = getChaosTokenValue(token, specialTokenValues);
      if (value === undefined || value.reveal_another) {
        return [];
      }
      return map(range(0, count), () => {
        return {
          value,
          token,
        };
      });
    }), x => x.value.modifier), (tokens) => {
      return {
        value: head(tokens)?.value || { modifier: 0 },
        tokens: map(tokens, t => t.token),
      };
    });
    return map(reverse(sortBy(result, x => {
      switch (x.value.modifier) {
        case 'auto_succeed':
          return -100;
        case 'auto_fail':
          return 100;
        default:
          return -x.value.modifier;
      }
    })), x => {
      switch (x.value.modifier) {
        case 'auto_succeed':
        case 'auto_fail':
          return {
            ...x,
            modifiedValue: 0,
          };
        default: {
          const modified = modifiedSkill - testDifficulty + x.value.modifier;
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
  const passPercent = Math.round(passingTokens / bagTotal * 100);
  const failPercent = Math.round(failingTokens / bagTotal * 100);
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
                    {tokenRatioString(failingTokens, bagTotal)}
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
                    {tokenRatioString(passingTokens, bagTotal)}
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

const SPECIAL_ODDS: { [key: string]: number } = {
  auto_fail: -100,
  auto_suceed: 100,
};

function SpecialTokenOdds({ chaosBag, specialTokenValues, modifiedSkill, testDifficulty }: ChaosBagProps) {
  const { colors, typography, width } = useContext(StyleContext);
  const bless = chaosBag.bless || 0;
  const curse = chaosBag.curse || 0;
  const finalTokens = useMemo(() => {
    const drawAnotherTokens = flatMap(specialTokenValues, t => {
      if (!t.value.reveal_another) {
        return [];
      }
      if ((chaosBag[t.token] || 0) <= 0) {
        return [];
      }
      return {
        textModifier: t.value.modifier > 0 ? `+${t.value.modifier}` : `${t.value.modifier}`,
        modifier: t.value.modifier === 'auto_fail' || t.value.modifier === 'auto_succeed' ? SPECIAL_ODDS[t.value.modifier] : t.value.modifier,
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
  const total = useMemo(() => sumBy(values(chaosBag), x => x || 0), [chaosBag]);
  if (total === 0) {
    return null;
  }
  if (finalTokens.length === 0) {
    return null;
  }
  return (
    <View style={space.paddingTopS}>
      { map(finalTokens, ({ token, modifier, count, boost, color }) => {
        return (
          <View style={[styles.specialTokenRow, space.paddingVerticalXs]} key={token}>
            <View style={[styles.specialTokenValue, space.paddingSideS, { minWidth: 64 }]}>
              <Text style={[typography.large, { color }]}>{Math.round(count / total * 100)}%</Text>
              <Text style={[typography.smallLabel, { color }]}>{count}/{total}</Text>
            </View>
            { map(range(0, count), idx => (
              <View key={idx} style={idx > 0 ? { marginLeft: count > 5 && TINY_PHONE ? -24 : -20 } : undefined}>
                <ChaosToken iconKey={token} size="extraTiny" />
              </View>
            )) }
            { false && count > 4 && (
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: getChaosTokenSize('extraTiny'),
                height: getChaosTokenSize('extraTiny'),
                borderRadius: getChaosTokenSize('extraTiny') / 2 ,
                backgroundColor: colors.L20,
              }}>
                <Text style={[typography.smallLabel, { color: colors.D20 }]}>+{count - 3}</Text>
              </View>
            )}
            <View style={[styles.specialTokenTextColumn, space.paddingSideS]}>
              <View style={{ minWidth: Math.min(width * 0.25, 120) }}>
                <Text style={[typography.smallLabel, typography.italic, typography.dark]}>{t`${modifier}, draws another`}</Text>
                <Text style={[typography.small, { color }]}>
                  { boost ? `${boost.min}${boost.min !== boost.max ? ` ~ ${boost.max}` : ''}` : ' ' }
                </Text>
              </View>
            </View>
          </View>
        );
      }) }
    </View>
  )
}

export default function OddsCalculatorComponent({
  campaign,
  allInvestigators,
  chaosBag: originalChaosBag,
  cycleScenarios,
  scenarioName,
  scenarioCard,
  scenarioCardText,
  scenarioCode,
  difficulty: defaultDifficulty,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const [showBlurse, toggleShowBlurse] = useFlag(true);
  const difficultyText = useMemo(() => {
    return {
      easy: t`Easy difficulty`,
      standard: t`Standard difficulty`,
      hard: t`Hard difficulty`,
      expert: t`Expert difficulty`,
    };
  }, []);
  const [selectedInvestigator, onSelectInvestigator] = useState(0);
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

  const [tokenFlags, toggleTokenFlag] = useToggles({});

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
  }, [items, setCurrentScenario, currentScenario, difficulty]);
  const { dialog, showDialog } = useDialog({
    title: t`Scenario settings`,
    content: dialogContent,
    alignment: 'bottom',
    allowDismiss: true,
  });

  const selectedInvestigatorCard = selectedInvestigator >= 0 && selectedInvestigator < allInvestigators.length ? allInvestigators[selectedInvestigator] : undefined;
  const specialTokenValues = useMemo(() => {
    const elderSignEffect = selectedInvestigatorCard ? elderSign(selectedInvestigatorCard) : undefined;
    return [
      ...parseSpecialTokenValuesText(
        lang,
        difficulty === 'hard' || difficulty === 'expert',
        scenarioText,
        scenarioCard,
        currentScenario?.code || scenarioCode,
        selectedInvestigatorCard
      ),
      elderSignEffect || { token: 'elder_sign', type: 'counter', counter: { prompt: t`Your investigator modfifier` } },
    ]
  }, [lang, scenarioText, difficulty, currentScenario, scenarioCard, scenarioCode, selectedInvestigatorCard]);
  const allSpecialTokenValues: SimpleChaosTokenValue[] = useMemo(() => {
    return [
      ...map(specialTokenValues, tokenValue => {
        if (tokenValue.type === 'counter') {
          return {
            token: tokenValue.token,
            value: {
              modifier: ((xValue[tokenValue.token] || (tokenValue.counter.min || 0)) + (tokenValue.counter.adjustment || 0)) * (tokenValue.counter.scale || 1) * (tokenValue.token === 'elder_sign' ? 1 : -1),
            },
          };
        }
        if (tokenValue.type === 'condition') {
          return {
            token: tokenValue.token,
            value: tokenFlags[tokenValue.token] ? tokenValue.condition.modified_value : tokenValue.condition.default_value,
          };
        }
        return tokenValue;
      }),
    ];
  }, [specialTokenValues, xValue, tokenFlags]);

  const specialTokenInputs = useMemo(() => {
    return (
      <>
        { flatMap(specialTokenValues, token => {
          if (token.type === 'counter') {
            return (
              <VariableTokenInput
                key={token.token}
                symbol={token.token}
                value={xValue[token.token] || token.counter.min || 0}
                text={token.text}
                prompt={token.counter.prompt}
                min={token.counter.min || 0}
                max={token.counter.max}
                increment={incXValue}
                decrement={decXValue}
              />
            );
          }
          if (token.type === 'condition') {
            return (
              <ToggleTokenInput
                key={token.token}
                symbol={token.token}
                text={token.text}
                prompt={token.condition.prompt}
                value={!!tokenFlags[token.token]}
                toggle={toggleTokenFlag}
              />
            );
          }
          if (!token.text) {
            return null;
          }
          return (
            <TokenTextLine key={token.token} symbol={token.token} text={token.text} />
          );
        }) }
      </>
    );
  }, [specialTokenValues, xValue, tokenFlags, toggleTokenFlag, incXValue, decXValue]);

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
            onPress={showDialog}
          />
        </View>
        <View style={[styles.blurseRow, space.paddingSideS]}>
          <RoundButton onPress={toggleShowBlurse} noShadow accessibilityLabel={showBlurse ? t`Hide Bless/Curse Odds` : t`Show Bless/Curse Odds`}>
            <AppIcon name={showBlurse ? 'show' : 'hide'} color={colors.M} size={28} />
          </RoundButton>
          <View style={space.paddingLeftXs}>
            <ArkhamIcon name="bless" color={colors.token.bless} size={24} />
          </View>
          <View style={space.paddingLeftXs}>
            <ArkhamIcon name="curse" color={colors.token.curse} size={24} />
          </View>
        </View>
        <ChaosBagOddsSection
          chaosBag={chaosBag}
          specialTokenValues={allSpecialTokenValues}
          modifiedSkill={modifiedSkill}
          testDifficulty={testDifficulty}
          showBlurse={showBlurse}
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
            <Text style={[typography.subHeaderText, typography.dark, space.marginTopS]}>{c('versus abbreviation').t`VS`}</Text>
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
        <View style={[space.paddingTopS, space.paddingSideS]}>
          { map(allInvestigators, (investigator, index) => (
            <InvestigatorRadioChoice
              key={investigator.code}
              type="investigator"
              investigator={investigator}
              description={investigator.subname}
              index={index}
              onSelect={onSelectInvestigator}
              editable
              transparent
              selected={selectedInvestigator === index}
              width={width - s}
            />
          )) }
        </View>
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
  blurseRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  numberInput: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  specialTokenTextColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  specialTokenValue: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
