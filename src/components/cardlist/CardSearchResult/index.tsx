import React, { ReactNode } from 'react';
import { flatMap, map, range, repeat } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { TINY_PHONE } from '@styles/sizes';


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

export default class CardSearchResult extends React.PureComponent<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _onPress = () => {
    const {
      id,
      onPress,
      onPressId,
      card,
    } = this.props;
    Keyboard.dismiss();
    if (id && onPressId) {
      onPressId(id, card);
    } else {
      onPress && onPress(card);
    }
  };

  _onUpgradePressed = () => {
    const {
      onUpgrade,
      card,
    } = this.props;
    onUpgrade && onUpgrade(card);
  };

  _onDeckCountChange = (count: number) => {
    const {
      onDeckCountChange,
      card,
    } = this.props;
    onDeckCountChange && onDeckCountChange(card.code, count);
  };

  _renderCountButton = (count: number) => {
    return count;
  };

  renderFactionIcon(card: Card, size: number): ReactNode {
    const { fontScale, colors } = this.context;
    const SMALL_ICON_SIZE = (isBig ? 38 : 26) * fontScale;

    if (!card.encounter_code && card.linked_card) {
      return this.renderFactionIcon(card.linked_card, size);
    }

    if (card.spoiler && card.encounter_code) {
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

  static cardCost(card: Card): string {
    if (card.type_code === 'skill') {
      return '';
    }
    if (card.permanent || card.double_sided) {
      return '-';
    }
    return `${card.cost !== null ? card.cost : 'X'}`;
  }

  renderIcon(card: Card): ReactNode {
    const { fontScale } = this.context;
    if (card.hidden && card.linked_card) {
      return this.renderIcon(card.linked_card);
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
        { this.renderFactionIcon(card, iconSize(fontScale)) }
      </View>
    );
  }

  skillIcon(skill: SkillCodeType, count: number): ReactNode[] {
    const { colors, fontScale } = this.context;
    if (count === 0) {
      return [];
    }
    const SKILL_ICON_SIZE = (isBig ? 26 : 16) * fontScale;
    return map(range(0, count), key => (
      <View key={`${skill}-${key}`} style={styles.skillIcon}>
        <ArkhamIcon
          name={skill}
          size={SKILL_ICON_SIZE}
          color={colors.lightText}
        />
      </View>
    ));
  }

  renderDualFactionIcons() {
    const { fontScale, colors } = this.context;
    const {
      card,
    } = this.props;
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
  }

  renderSkillIcons() {
    const {
      card,
    } = this.props;
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
        { flatMap(SKILLS, (skill: SkillCodeType) =>
          this.skillIcon(skill, card.skillCount(skill))) }
      </View>
    );
  }

  renderTabooBlock() {
    const { colors, fontScale, typography } = this.context;
    const {
      card,
    } = this.props;
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
  }

  renderCardName() {
    const { colors, fontScale, typography } = this.context;
    const {
      card,
      invalid,
    } = this.props;
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
          { this.renderTabooBlock() }
          { !!card.advanced && (
            <View style={styles.tabooBlock}>
              <ArkhamIcon name="parallel" size={18 * fontScale} color={colors.darkText} />
            </View>
          ) }
        </View>
        <View style={[styles.row, { backgroundColor: 'transparent' }]}>
          { this.renderSkillIcons() }
          { !!card.renderSubname && (
            <View style={styles.row}>
              <Text style={[typography.small, typography.italic, typography.light, styles.subname]} numberOfLines={1} ellipsizeMode="clip">
                { card.renderSubname }
              </Text>
            </View>
          ) }
          { this.renderDualFactionIcons() }
        </View>
      </View>
    );
  }

  countText(count: number) {
    const {
      deltaCountMode,
    } = this.props;
    if (deltaCountMode) {
      if (count > 0) {
        return `+${count}`;
      }
      return `${count}`;
    }
    return `×${count}`;
  }

  renderCount() {
    const {
      card,
      count = 0,
      onDeckCountChange,
      onUpgrade,
      limit,
      hasSecondCore,
      showZeroCount,
    } = this.props;
    const { typography } = this.context;
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
          limit={Math.max(count || 0, typeof limit === 'number' ? limit : deck_limit)}
          countChanged={this._onDeckCountChange}
          showZeroCount={showZeroCount}
        />
      );
    }
    if (count !== 0) {
      return (
        <View style={styles.countWrapper}>
          { !!onUpgrade && <UpgradeCardButton onPress={this._onUpgradePressed} /> }
          <View style={styles.count}>
            <Text style={typography.text}>
              { this.countText(count) }
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }

  _onToggleChange = (value: boolean) => {
    const {
      card,
      onToggleChange,
    } = this.props;
    if (onToggleChange) {
      onToggleChange(card, value);
    }
  };

  renderContent() {
    const {
      card,
      onToggleChange,
      toggleValue,
      onPress,
      onPressId,
      onDeckCountChange,
      backgroundColor,
    } = this.props;
    const { colors, borderStyle, fontScale } = this.context;
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
          onPress={this._onPress}
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
            { this.renderIcon(card) }
            { this.renderCardName() }
          </View>
        </TouchableOpacity>
        { this.renderCount() }
        { !!onToggleChange && (
          <View style={styles.switchButton}>
            <ArkhamSwitch
              value={!!toggleValue}
              onValueChange={this._onToggleChange}
            />
          </View>
        ) }
      </View>
    );
  }

  render() {
    const {
      card,
      backgroundColor,
      onDeckCountChange,
    } = this.props;
    const { fontScale, colors, borderStyle, typography } = this.context;
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

    return this.renderContent();
  }
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
