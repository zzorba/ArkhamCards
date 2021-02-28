import React, { useCallback, useContext, useMemo } from 'react';
import { flatMap, flatten, map, range } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t, jt } from 'ttag';

import {
  RANDOM_BASIC_WEAKNESS, SkillCodeType,
} from '@app_constants';
import InvestigatorStatLine from '@components/core/InvestigatorStatLine';
import HealthSanityLine from '@components/core/HealthSanityLine';
import { isTablet, xs, s, m } from '@styles/space';
import ArkhamIcon from '@icons/ArkhamIcon';
import CardTabooTextBlock from '@components/card/CardTabooTextBlock';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import CardTextComponent from '@components/card/CardTextComponent';
import { CardFaqProps } from '@components/card/CardFaqView';
import { CardTabooProps } from '@components/card/CardTabooView';
import Card from '@data/types/Card';
import SkillIcon from '@components/core/SkillIcon';

import PlayerCardImage from '../PlayerCardImage';
import EnemyStatLine from './EnemyStatLine';
import SlotIcon from './SlotIcon';
import StyleContext from '@styles/StyleContext';
import CardDetailHeader from './CardDetailHeader';
import CardFooterInfo from './CardFooterInfo';
import CardFooterButton from './CardFooterButton';
import ArkhamButton from '@components/core/ArkhamButton';
import InvestigatorImage from '@components/core/InvestigatorImage';
import { useFlag } from '@components/core/hooks';

const SKILL_ICON_SIZE = 24;
const MAX_WIDTH = 768;

const SKILL_FIELDS = [
  'skill_willpower',
  'skill_intellect',
  'skill_combat',
  'skill_agility',
  'skill_wild',
];

function num(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '-';
  }
  if (value < 0) {
    return 'X';
  }
  return value;
}

interface Props {
  componentId?: string;
  card: Card;
  linked?: boolean;
  notFirst?: boolean;
  simple?: boolean;
  width: number;
}

export default function TwoSidedCardComponent({ componentId, card, linked, notFirst, simple, width }: Props) {
  const { backgroundStyle, shadow, colors, typography } = useContext(StyleContext);
  const [showBack, toggleShowBack] = useFlag(false);
  const isHorizontal = card.type_code === 'act' ||
    card.type_code === 'agenda' ||
    card.type_code === 'investigator';
  const flavorFirst = card.type_code === 'story' ||
    card.type_code === 'act' ||
    card.type_code === 'agenda';

  const showTaboo = useCallback(() => {
    if (componentId) {
      Navigation.push<CardTabooProps>(componentId, {
        component: {
          name: 'Card.Taboo',
          passProps: {
            id: card.code,
          },
          options: {
            topBar: {
              title: {
                text: card.name,
              },
              subtitle: {
                text: `Taboos`,
              },
            },
          },
        },
      });
    }
  }, [componentId, card]);

  const showFaq = useCallback(() => {
    if (componentId) {
      Navigation.push<CardFaqProps>(componentId, {
        component: {
          name: 'Card.Faq',
          passProps: {
            id: card.code,
          },
          options: {
            topBar: {
              title: {
                text: t`FAQ`,
              },
              subtitle: {
                text: card.name,
              },
            },
          },
        },
      });
    }
  }, [componentId, card]);

  const typeLine = useMemo(() => {
    if (card.type_code === 'investigator') {
      return null;
    }
    if (!card.subtype_name && !card.type_name) {
      return null;
    }
    return (
      <Text style={[typography.small, typography.bold]}>
        { flatten([
          [(card.type_code === 'agenda' || card.type_code === 'act') ? `${card.type_name} ${card.stage}` : card.type_name],
          card.subtype_name ? [card.subtype_name] : [],
          card.slot ? [card.slot] : [],
        ]).join(' · ') }
      </Text>
    );
  }, [card, typography]);


  const testIcons = useMemo(() => {
    if (card.type_code === 'investigator') {
      return null;
    }
    const skills = flatMap(SKILL_FIELDS, skill => {
      // @ts-ignore
      const count = card[skill] || 0;
      return range(0, count).map(() => skill);
    });

    if (skills.length === 0) {
      return null;
    }
    const accessibilityLabel = t`Test Icons: ` + map(SKILL_FIELDS, skill => {
      // @ts-ignore
      const count = card[skill] || 0;
      switch (skill) {
        case 'skill_willpower': return t`Willpower: ${count}`;
        case 'skill_intellect': return t`Intellect: ${count}`;
        case 'skill_combat': return t`Combat: ${count}`;
        case 'skill_agility': return t`Agility: ${count}`;
        case 'skill_wild': return t`Wild: ${count}`;
        default: return '';
      }
    }).join(',');

    return (
      <View style={styles.testIconRow} accessibilityLabel={accessibilityLabel}>
        { map(skills, (skill, idx) => (
          <View style={[styles.testIcon, { backgroundColor: colors.L20 }]} key={idx}>
            <SkillIcon
              skill={skill.substring(6) as SkillCodeType}
              size={SKILL_ICON_SIZE}
              weakness={card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness'}
            />
          </View>))
        }
      </View>
    );
  }, [colors, card]);

  const slotIcon = useMemo(() => {
    if (!card.real_slot) {
      return null;
    }
    return (
      <View style={styles.iconRow} accessibilityLabel={t`Slot: ${card.slot}`}>
        { map(card.real_slot.split('.'), slot => <SlotIcon key={slot} slot={slot.trim()} />) }
      </View>
    );
  }, [card]);

  const metadataBlock = useMemo(() => {
    return (
      <View style={styles.metadataBlock}>
        <View style={styles.column}>
          { typeLine }
          { !!card.traits && (
            <Text style={[typography.small, typography.boldItalic]}>
              { card.traits }
            </Text>
          ) }
        </View>
        <View style={styles.row}>
          { testIcons }
          { slotIcon }
        </View>
        { card.type_code === 'investigator' && (
          <View style={styles.statLineRow}>
            <InvestigatorStatLine
              investigator={card}
            />
          </View>
        ) }
        { (card.type_code === 'investigator' || (
          card.type_code === 'asset' && ((card.health || 0) !== 0 || (card.sanity || 0) !== 0)
        )) && (
          <View style={card.type_code === 'asset' ? styles.statLineRow : undefined}>
            <HealthSanityLine
              investigator={card}
            />
          </View>
        ) }
      </View>
    );
  }, [card, typography, typeLine, slotIcon, testIcons]);

  const playdataBlock = useMemo(() => {
    if (card.type_code === 'scenario') {
      return null;
    }
    const doom = num(card.doom);
    const shroud = num(card.shroud);
    const clues = num(card.clues);
    const perInvestigatorClues = (card.clues && card.clues > 0 && !card.clues_fixed) ?
      <ArkhamIcon key="per_investigator" name="per_investigator" size={12} color={colors.darkText} /> :
      '';
    return (
      <View>
        { card.type_code === 'agenda' && (
          <Text style={typography.small}>
            { t`Doom: ${doom}` }
          </Text>
        ) }
        { !!(card.type_code === 'act' && card.clues && card.clues > 0) && (
          <Text style={typography.small}>
            { jt`Clues: ${clues}${perInvestigatorClues}` }
          </Text>
        ) }
        { card.type_code === 'enemy' && <EnemyStatLine enemy={card} /> }
        { card.type_code === 'location' && (
          <Text style={typography.small}>
            { jt`Shroud: ${shroud}. Clues: ${clues}${perInvestigatorClues}.` }
          </Text>)
        }
      </View>
    );
  }, [colors, typography, card]);


  const cardFooter = useMemo(() => (
    <View style={[styles.column, styles.flex]}>
      <CardFooterInfo card={card} />
    </View>
  ), [card]);

  const renderCardBack = useCallback((
    backFirst: boolean,
    isFirst: boolean,
    key: string
  ) => {
    if (card.linked_card) {
      return (
        <View key={key}>
          <TwoSidedCardComponent
            componentId={componentId}
            card={card.linked_card}
            linked
            notFirst={!isFirst}
            width={width}
            simple={simple}
            key="linked"
          />
        </View>
      );
    }
    if (!card.double_sided || card.type_code === 'scenario') {
      return null;
    }

    if (!backFirst && card.mythos_card && !showBack) {
      return (
        <ArkhamButton
          title={t`Show back`}
          onPress={toggleShowBack}
          icon="expand"
        />
      );
    }
    const noHeader = (card.name === card.back_name || !card.back_name) && !backFirst;
    return (
      <View style={[styles.container, styles.containerPadding, { width }]} key={key}>
        <View style={[styles.card, shadow.large, backgroundStyle, {
          borderColor: colors.faction[
            card.faction2_code ? 'dual' : card.factionCode()
          ].background,
          borderTopWidth: noHeader ? 1 : 0,
        }]}>
          { !noHeader && <CardDetailHeader card={card} back width={Math.min(768, width - s * 2)} linked={!!linked} /> }
          <View removeClippedSubviews style={[
            styles.cardBody,
            {
              backgroundColor: noHeader ? 'transparent' : colors.background,
            },
            !isFirst ? {
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            } : undefined,
          ]}>
            <View style={styles.typeBlock}>
              { card.type_code !== 'investigator' && (
                <View style={styles.metadataBlock}>
                  { typeLine }
                  { !!card.traits && (
                    <Text style={[typography.small, typography.boldItalic]}>
                      { card.traits }
                    </Text>
                  ) }
                </View>
              ) }
              { !!card.back_flavor && flavorFirst &&
                <CardFlavorTextComponent text={card.back_flavor} />
              }
              { !!card.back_text && (
                <View style={[styles.gameTextBlock, {
                  borderColor: colors.M,
                }]}>
                  <CardTextComponent text={card.back_text} />
                </View>)
              }
              { !!card.back_flavor && !flavorFirst &&
                <CardFlavorTextComponent text={card.back_flavor} />
              }
            </View>
            { isFirst && cardFooter }
          </View>
          { isFirst && (
            <CardFooterButton
              onPressFaq={showFaq}
              onPressTaboo={
                (card.taboo_set_id === 0 || card.taboo_placeholder) ? showTaboo : undefined
              }
            />
          ) }
        </View>
      </View>
    );
  }, [card, componentId, simple, width, linked, shadow.large,
    colors, backgroundStyle, typography, showBack, typeLine, cardFooter, flavorFirst,
    toggleShowBack, showTaboo, showFaq]);

  const image = useMemo(() => {
    if (card.type_code === 'story' || card.type_code === 'scenario') {
      return null;
    }
    return (
      <View style={styles.column}>
        <View style={styles.playerImage}>
          { card.type_code === 'investigator' ? (
            <InvestigatorImage card={card} componentId={componentId} imageLink />
          ) : (
            <PlayerCardImage
              card={card}
              componentId={componentId}
            />
          ) }
        </View>
      </View>
    );
  }, [card, componentId]);

  const cardText = useMemo(() => {
    return (
      <>
        { !!card.text && (
          <View style={[styles.gameTextBlock, {
            borderColor: colors.M,
          }]}>
            <CardTextComponent text={card.text} />
          </View>)
        }
        { ('victory' in card && card.victory !== null) &&
          <Text style={[typography.small, typography.bold]}>
            { t`Victory: ${card.victory}.` }
          </Text>
        }
        { ('vengeance' in card && card.vengeance !== null) &&
          <Text style={[typography.small, typography.bold]}>
            { t`Vengeance: ${card.vengeance}.` }
          </Text>
        }
        { !simple && !!card.flavor && !flavorFirst &&
          <CardFlavorTextComponent text={card.flavor} />
        }
        <CardTabooTextBlock card={card} />
      </>
    );
  }, [card, simple, colors, typography, flavorFirst]);

  const renderCardFront = useCallback((
    backFirst: boolean,
    isFirst: boolean,
    key: string
  ) => {
    if ((card.hidden || backFirst) &&
      ((card.hidden && card.type_code !== 'investigator') || card.mythos_card) &&
      !showBack &&
      card.code !== RANDOM_BASIC_WEAKNESS
    ) {
      return (
        <ArkhamButton
          title={(card.hidden || backFirst) ? t`Show back` : t`Show front`}
          onPress={toggleShowBack}
          icon="expand"
        />
      );
    }

    const noHeader = (card.name === card.back_name || !card.back_name) && backFirst;
    return (
      <View style={[styles.container, styles.containerPadding]} key={key}>
        <View style={[
          styles.card,
          shadow.large,
          backgroundStyle,
          {
            borderColor: colors.faction[
              card.faction2_code ? 'dual' : card.factionCode()
            ].background,
            borderTopWidth: noHeader ? 1 : 0,
          },
        ]}>
          { !noHeader && <CardDetailHeader card={card} width={Math.min(768, width - s * 2)} linked={!!linked} /> }
          <View style={[
            styles.cardBody,
            {
              backgroundColor: noHeader ? 'transparent' : colors.background,
            },
            !isFirst || simple ? {
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            } : undefined,
          ]}>
            <View style={[styles.typeBlock, backgroundStyle]}>
              <View style={styles.row}>
                <View style={styles.mainColumn}>
                  { metadataBlock }
                  { playdataBlock }
                  { !!card.flavor && (simple || flavorFirst) &&
                    <CardFlavorTextComponent text={card.flavor} />
                  }
                  { isTablet && cardText }
                </View>
                { image }
              </View>
              { !isTablet && cardText }
              { card.type_code === 'scenario' && !!card.back_text && (
                <View style={[styles.gameTextBlock, {
                  marginTop: m,
                  borderColor: colors.M,
                }]}>
                  <CardTextComponent text={card.back_text} />
                </View>)
              }
              { isFirst && !simple && cardFooter }
            </View>
          </View>
          { isFirst && !simple && (
            <CardFooterButton
              onPressFaq={showFaq}
              onPressTaboo={
                (card.taboo_set_id === 0 || card.taboo_placeholder) ? showTaboo : undefined
              }
            />
          ) }
        </View>
      </View>
    );
  }, [card, simple, width, linked, cardText, shadow.large,
    cardFooter, colors, backgroundStyle, showBack, flavorFirst, image, metadataBlock, playdataBlock,
    toggleShowBack, showFaq, showTaboo]);

  const backFirst = !linked &&
    (!!card.double_sided || (card.linked_card && !card.linked_card.hidden)) &&
    !(isHorizontal || !card.mythos_card) &&
    card.type_code !== 'scenario';

  const sideA = backFirst && renderCardBack(backFirst, !notFirst, 'sideA');
  const sideB = renderCardFront(!!backFirst, !notFirst && !sideA, 'sideB');
  const sideC = !backFirst && renderCardBack(!!backFirst, !notFirst && !sideA && !sideB, 'sideC');
  return (
    <View>
      { sideA }
      { sideB }
      { sideC }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  playerImage: {
    marginTop: 2,
    marginBottom: s,
    marginLeft: s,
  },
  metadataBlock: {
    marginBottom: s,
  },
  containerPadding: {
    paddingTop: s,
    paddingLeft: s,
    paddingRight: s,
    paddingBottom: s,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: MAX_WIDTH,
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderTopWidth: 0,
  },
  cardBody: {
    paddingTop: xs,
    paddingLeft: s,
    paddingRight: s + 1,
    paddingBottom: xs,
  },
  gameTextBlock: {
    borderLeftWidth: 2,
    paddingLeft: s,
    marginBottom: s,
    marginRight: s,
  },
  typeBlock: {
    marginTop: xs,
  },
  testIconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
    marginBottom: 2,
  },
  statLineRow: {
    flexDirection: 'row',
    marginTop: s,
  },
  testIcon: {
    marginRight: xs,
    padding: 4,
    paddingTop: 2,
    borderRadius: 8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
