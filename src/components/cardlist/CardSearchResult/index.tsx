import React, { useCallback, useContext, useMemo } from 'react';
import { map, range, repeat } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import EncounterIcon from '@icons/EncounterIcon';
import CardCostIcon, { costIconSize } from '@components/core/CardCostIcon';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import Card from '@data/Card';
import { SKILLS, SkillCodeType } from '@app_constants';
import { rowHeight, iconSize, toggleButtonMode, buttonWidth } from './constants';
import UpgradeCardButton from './UpgradeCardButton';
import CardQuantityComponent from './CardQuantityComponent';
import { isBig, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  card: Card;
  id?: string;
  count?: number;
  onPress?: (card: Card) => void;
  onPressId?: (code: string, card: Card) => void;
  onUpgrade?: (card: Card) => void;
  onDeckCountChange?: (code: string, count: number) => void;
  limit?: number;
  onToggleChange?: (card: Card, value: boolean) => void;
  toggleValue?: boolean;
  deltaCountMode?: boolean;
  hasSecondCore?: boolean;
  showZeroCount?: boolean;
  backgroundColor?: string;
  invalid?: boolean;
}

function cardCost(card: Card): string {
  if (card.type_code === 'skill') {
    return '';
  }
  if (card.permanent || card.double_sided) {
    return '-';
  }
  return `${card.cost !== null ? card.cost : 'X'}`;
}

function SkillIcons({ skill, count }: { skill: SkillCodeType; count: number }) {
  const { colors, fontScale } = useContext(StyleContext);
  if (count === 0) {
    return null;
  }
  const SKILL_ICON_SIZE = (isBig ? 26 : 16) * fontScale;
  return (
    <>
      { map(range(0, count), key => (
        <View key={`${skill}-${key}`} style={styles.skillIcon}>
          <ArkhamIcon
            name={skill}
            size={SKILL_ICON_SIZE}
            color={colors.lightText}
          />
        </View>
      )) }
    </>
  );
}

function FactionIcon({ card }: { card: Card }) {
  const { fontScale, colors } = useContext(StyleContext);
  const size = iconSize(fontScale);
  const SMALL_ICON_SIZE = (isBig ? 38 : 26) * fontScale;

  if (!card.encounter_code && card.linked_card) {
    return <FactionIcon card={card.linked_card} />;
  }

  if (card.mythos_card && card.encounter_code) {
    return (
      <EncounterIcon
        encounter_code={card.encounter_code}
        size={size}
        color={colors.darkText}
      />
    );
  }
  if (card.subtype_code &&
    (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
  ) {
    return (
      <ArkhamIcon name="weakness" size={size} color={colors.faction.neutral.text} />
    );
  }
  const ICON_SIZE = iconSize(fontScale);
  if (card.type_code === 'scenario' || card.type_code === 'story') {
    return (
      <EncounterIcon
        encounter_code={card.pack_code}
        size={ICON_SIZE}
        color={colors.darkText}
      />
    );
  }
  const faction = card.factionCode();
  return (
    <View style={styles.investigatorFactionIcon}>
      <ArkhamIcon
        name={(card.faction2_code || faction === 'neutral') ? 'elder_sign' : faction}
        size={size === ICON_SIZE ? ICON_SIZE : SMALL_ICON_SIZE}
        color={colors.faction[faction].text}
      />
    </View>
  );
}

function CardIcon({ card }: { card: Card }) {
  const { fontScale } = useContext(StyleContext);
  if (card.hidden && card.linked_card) {
    return <CardIcon card={card.linked_card} />;
  }

  const showCost = card.type_code === 'asset' ||
    card.type_code === 'event' ||
    card.type_code === 'skill';

  if (showCost) {
    return (
      <View style={[styles.factionIcon, {
        width: costIconSize(fontScale),
        height: costIconSize(fontScale),
      }]}>
        <CardCostIcon card={card} />
      </View>
    );
  }
  return (
    <View style={[styles.factionIcon, {
      width: costIconSize(fontScale),
      height: costIconSize(fontScale),
    }]}>
      <FactionIcon card={card} />
    </View>
  );
}

export default function CardSearchResult({
  card,
  id,
  count = 0,
  onPress,
  onPressId,
  onUpgrade,
  onDeckCountChange,
  limit,
  onToggleChange,
  toggleValue,
  deltaCountMode,
  hasSecondCore,
  showZeroCount,
  backgroundColor,
  invalid,
}: Props) {
  const { borderStyle, colors, fontScale, typography } = useContext(StyleContext);
  const handleCardPress = useCallback(() => {
    Keyboard.dismiss();
    if (id && onPressId) {
      onPressId(id, card);
    } else {
      onPress && onPress(card);
    }
  }, [onPress, onPressId, id, card]);

  const handleUpgradePressed = useCallback(() => {
    onUpgrade && onUpgrade(card);
  }, [onUpgrade, card]);

  const handleDeckCountChange = useCallback((code: string, count: number) => {
    onDeckCountChange && onDeckCountChange(code, count);
  }, [onDeckCountChange]);

  const dualFactionIcons = useMemo(() => {
    if (!card.faction2_code) {
      return null;
    }
    const SKILL_ICON_SIZE = (isBig ? 26 : 16) * fontScale;
    return (
      <View style={styles.dualFactionIcons}>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name={card.factionCode()}
            size={SKILL_ICON_SIZE}
            color={colors.faction[card.factionCode()].text}
          />
        </View>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name={card.faction2_code}
            size={SKILL_ICON_SIZE}
            color={colors.faction[card.faction2_code].text}
          />
        </View>
      </View>
    );
  }, [fontScale, colors, card]);

  const skillIcons = useMemo(() => {
    if (card.type_code === 'investigator' || (
      card.skill_willpower === null &&
      card.skill_intellect === null &&
      card.skill_combat === null &&
      card.skill_agility === null &&
      card.skill_wild === null)) {
      return null;
    }
    return (
      <View style={styles.skillIcons}>
        { map(SKILLS, (skill: SkillCodeType) => <SkillIcons key={skill} skill={skill} count={card.skillCount(skill)} />) }
      </View>
    );
  }, [card]);

  const tabooBlock = useMemo(() => {
    if (!card.taboo_set_id || card.taboo_set_id === 0 || card.taboo_placeholder) {
      return null;
    }
    const TABOO_ICON_SIZE = (isBig ? 18 : 14) * fontScale;
    return (
      <View style={styles.tabooBlock}>
        { !!card.extra_xp && (
          <Text style={[typography.small, styles.extraXp, { color: colors.taboo }]} numberOfLines={1} ellipsizeMode="clip">
            { repeat(card.extra_xp > 0 ? '•' : '-', Math.abs(card.extra_xp)) }
          </Text>
        ) }
        { !!(card.taboo_set_id && card.taboo_set_id > 0) && (
          <ArkhamIcon name="tablet" size={TABOO_ICON_SIZE} color={colors.taboo} />
        ) }
      </View>
    );
  }, [colors, fontScale, typography, card]);

  const cardName = useMemo(() => {
    const color = (card.faction2_code ?
      colors.faction.dual :
      colors.faction[card.factionCode()]
    ).text;
    return (
      <View style={styles.cardNameBlock}>
        <View style={styles.row}>
          <Text style={[
            typography.large,
            { color },
            invalid ? { textDecorationLine: 'line-through' } : {},
          ]} numberOfLines={1} ellipsizeMode="clip">
            { card.renderName }
          </Text>
          { tabooBlock }
          { !!card.advanced && (
            <View style={styles.tabooBlock}>
              <ArkhamIcon name="parallel" size={18 * fontScale} color={colors.darkText} />
            </View>
          ) }
        </View>
        <View style={[styles.row, { backgroundColor: 'transparent' }]}>
          { skillIcons }
          { !!card.renderSubname && (
            <View style={styles.row}>
              <Text style={[typography.small, typography.italic, typography.light, styles.subname]} numberOfLines={1} ellipsizeMode="clip">
                { card.renderSubname }
              </Text>
            </View>
          ) }
          { dualFactionIcons }
        </View>
      </View>
    );
  }, [colors, fontScale, typography, card, invalid, tabooBlock, skillIcons, dualFactionIcons]);

  const countText = useMemo(() => {
    if (deltaCountMode) {
      if (count > 0) {
        return `+${count}`;
      }
      return `${count}`;
    }
    return `×${count}`;
  }, [count, deltaCountMode]);

  const countBlock = useMemo(() => {
    if (onDeckCountChange) {
      const deck_limit: number = Math.min(
        card.pack_code === 'core' ?
          ((card.quantity || 0) * (hasSecondCore ? 2 : 1)) :
          (card.deck_limit || 0),
        card.deck_limit || 0
      );
      return (
        <CardQuantityComponent
          count={count || 0}
          code={card.code}
          limit={Math.max(count || 0, typeof limit === 'number' ? limit : deck_limit)}
          countChanged={handleDeckCountChange}
          showZeroCount={showZeroCount}
        />
      );
    }
    if (count !== 0) {
      return (
        <View style={styles.countWrapper}>
          { !!onUpgrade && <UpgradeCardButton onPress={handleUpgradePressed} /> }
          <View style={styles.count}>
            <Text style={typography.text}>
              { countText }
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }, [card, count, countText, limit, hasSecondCore, showZeroCount, typography,
    onDeckCountChange, onUpgrade, handleDeckCountChange, handleUpgradePressed]);

  const handleToggleChange = useCallback((value: boolean) => {
    if (onToggleChange) {
      onToggleChange(card, value);
    }
  }, [card, onToggleChange]);

  if (!card) {
    return (
      <View style={[
        styles.rowContainer,
        styles.rowBorder,
        borderStyle,
        {
          height: rowHeight(fontScale),
          backgroundColor: backgroundColor || colors.background,
        },
        !onDeckCountChange ? styles.rowPadding : {},
      ]}>
        <View style={styles.cardNameBlock}>
          <View style={styles.row}>
            <Text style={typography.text}>
              Unknown Card
            </Text>
          </View>
        </View>
      </View>
    );
  }
  if (!card.name) {
    return (
      <View style={[
        styles.rowContainer,
        styles.rowBorder,
        borderStyle,
        {
          height: rowHeight(fontScale),
          backgroundColor: backgroundColor || colors.background,
        },
        !onDeckCountChange ? styles.rowPadding : {},
      ]}>
        <Text>No Text</Text>;
      </View>
    );
  }

  return (
    <View style={[
      styles.rowContainer,
      styles.rowBorder,
      borderStyle,
      {
        height: rowHeight(fontScale),
        backgroundColor: backgroundColor || colors.background,
      },
      !onDeckCountChange ? styles.rowPadding : {},
    ]}>
      <TouchableOpacity
        onPress={handleCardPress}
        disabled={!onPress && !onPressId}
        style={[styles.row, styles.fullHeight]}
        testID={`SearchCard-${card.code}`}
        delayPressIn={5}
        delayPressOut={5}
        delayLongPress={5}
      >
        <View style={[
          styles.cardTextRow,
          onDeckCountChange && toggleButtonMode(fontScale) ?
            { paddingRight: buttonWidth(fontScale) } :
            {},
        ]}>
          <CardIcon card={card} />
          { cardName }
        </View>
      </TouchableOpacity>
      { countBlock }
      { !!onToggleChange && (
        <View style={styles.switchButton}>
          <ArkhamSwitch
            value={!!toggleValue}
            onValueChange={handleToggleChange}
          />
        </View>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
  },
  rowPadding: {
    paddingLeft: s,
    paddingRight: s,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardNameBlock: {
    marginLeft: xs,
    marginTop: xs,
    marginBottom: xs,
    marginRight: xs / 2,
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fullHeight: {
  },
  skillIcons: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  dualFactionIcons: {
    marginLeft: s,
    flexDirection: 'row',
  },
  skillIcon: {
    marginRight: xs / 2,
  },
  subname: {
    marginTop: xs,
    marginRight: s,
  },
  factionIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: xs,
  },
  cardTextRow: {
    flex: 2,
    flexDirection: 'row',
    paddingLeft: s,
    alignItems: 'center',
  },
  switchButton: {
    marginTop: 6,
    marginRight: 6,
  },
  countWrapper: {
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    marginLeft: xs,
    minWidth: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tabooBlock: {
    marginLeft: s,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  extraXp: {
    marginRight: xs,
  },
  investigatorFactionIcon: {
    marginBottom: 4,
  },
});
