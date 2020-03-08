import React, { ReactNode } from 'react';
import { flatMap, map, range, repeat } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import ArkhamIcon from 'icons/ArkhamIcon';
import EncounterIcon from 'icons/EncounterIcon';
import CardCostIcon, { costIconSize } from 'components/core/CardCostIcon';
import Button from 'components/core/Button';
import Switch from 'components/core/Switch';
import Card from 'data/Card';
import { createFactionIcons, FACTION_COLORS, SKILLS, SkillCodeType } from 'constants';
import { COLORS } from 'styles/colors';
import { rowHeight, iconSize, toggleButtonMode, buttonWidth } from './constants';
import CardQuantityComponent from './CardQuantityComponent';
import typography from 'styles/typography';
import { isBig, s, xs } from 'styles/space';

const FACTION_ICONS = createFactionIcons();

interface Props {
  card: Card;
  fontScale: number;
  id?: string;
  count?: number;
  onPress?: (card: Card) => void;
  onPressId?: (code: string, card: Card) => void;
  onUpgrade?: (card: Card) => void;
  onDeckCountChange?: (code: string, count: number) => void;
  limit?: number;
  onToggleChange?: () => void;
  toggleValue?: boolean;
  deltaCountMode?: boolean;
  hasSecondCore?: boolean;
  showZeroCount?: boolean;
  backgroundColor?: string;
}

export default class CardSearchResult extends React.PureComponent<Props> {
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
    const { fontScale } = this.props;
    const SMALL_ICON_SIZE = (isBig ? 38 : 26) * fontScale;

    if (!card.encounter_code && card.linked_card) {
      return this.renderFactionIcon(card.linked_card, size);
    }

    if (card.spoiler && card.encounter_code) {
      return (
        <EncounterIcon
          encounter_code={card.encounter_code}
          size={size}
          color="#000000"
        />
      );
    }
    if (card.subtype_code &&
      (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
    ) {
      return (
        <ArkhamIcon name="weakness" size={size} color={FACTION_COLORS.neutral} />
      );
    }
    const ICON_SIZE = iconSize(fontScale);
    if (card.type_code === 'scenario' || card.type_code === 'story') {
      return (
        <EncounterIcon
          encounter_code={card.pack_code}
          size={ICON_SIZE}
          color="#000000"
        />
      );
    }
    if (card.faction2_code) {
      const icon = FACTION_ICONS.dual;
      return !!icon && icon(size === ICON_SIZE ? ICON_SIZE : SMALL_ICON_SIZE);
    }
    const icon = FACTION_ICONS[card.factionCode()];
    return !!icon && icon(size === ICON_SIZE ? ICON_SIZE : SMALL_ICON_SIZE);
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
    const { fontScale } = this.props;
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
          <CardCostIcon
            card={card}
            fontScale={fontScale}
          />
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

  static skillIcon(fontScale: number, skill: SkillCodeType, count: number): ReactNode[] {
    if (count === 0) {
      return [];
    }
    const SKILL_ICON_SIZE = (isBig ? 26 : 16) * fontScale;
    return map(range(0, count), key => (
      <View key={`${skill}-${key}`} style={styles.skillIcon}>
        <ArkhamIcon
          name={skill}
          size={SKILL_ICON_SIZE}
          color="#444"
        />
      </View>
    ));
  }

  renderDualFactionIcons() {
    const {
      card,
      fontScale,
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
            color={FACTION_COLORS[card.factionCode()]}
          />
        </View>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name={card.faction2_code}
            size={SKILL_ICON_SIZE}
            color={FACTION_COLORS[card.faction2_code]}
          />
        </View>
      </View>
    );
  }

  renderSkillIcons() {
    const {
      card,
      fontScale,
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
          CardSearchResult.skillIcon(fontScale, skill, card.skillCount(skill))) }
      </View>
    );
  }

  renderTabooBlock() {
    const {
      card,
      fontScale,
    } = this.props;
    if (!card.taboo_set_id || card.taboo_set_id === 0 || card.taboo_placeholder) {
      return null;
    }
    const TABOO_ICON_SIZE = (isBig ? 18 : 14) * fontScale;
    return (
      <View style={styles.tabooBlock}>
        { !!card.extra_xp && (
          <Text style={[typography.small, styles.extraXp]} numberOfLines={1} ellipsizeMode="clip">
            { repeat(card.extra_xp > 0 ? '•' : '-', Math.abs(card.extra_xp)) }
          </Text>
        ) }
        { !!(card.taboo_set_id && card.taboo_set_id > 0) && (
          <ArkhamIcon name="tablet" size={TABOO_ICON_SIZE} color="purple" />
        ) }
      </View>
    );
  }

  renderCardName() {
    const {
      card,
    } = this.props;
    const color = card.faction2_code ?
      FACTION_COLORS.dual :
      (FACTION_COLORS[card.factionCode()] || '#000000');
    return (
      <View style={styles.cardNameBlock}>
        <View style={styles.row}>
          <Text style={[typography.text, { color }]} numberOfLines={1} ellipsizeMode="clip">
            { card.renderName }
          </Text>
          { this.renderTabooBlock() }
        </View>
        <View style={styles.row}>
          { this.renderSkillIcons() }
          { !!card.renderSubname && (
            <View style={styles.row}>
              <Text style={[typography.small, styles.subname, { color }]} numberOfLines={1} ellipsizeMode="clip">
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
      fontScale,
    } = this.props;
    if (onDeckCountChange) {
      const deck_limit: number = Math.min(
        card.pack_code === 'core' ?
          ((card.quantity || 0) * (hasSecondCore ? 2 : 1)) :
          (card.deck_limit || 0),
        card.deck_limit || 0
      );
      return (
        <CardQuantityComponent
          fontScale={fontScale}
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
          { !!onUpgrade && (
            <Button
              style={styles.upgradeButton}
              size="small"
              onPress={this._onUpgradePressed}
              icon={
                <MaterialCommunityIcons
                  size={18 * fontScale}
                  color="#FFF"
                  name="arrow-up-bold"
                />
              }
            />
          ) }
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

  renderContent() {
    const {
      card,
      onToggleChange,
      toggleValue,
      onPress,
      onPressId,
      onDeckCountChange,
      fontScale,
      backgroundColor,
    } = this.props;
    return (
      <View style={[
        styles.rowContainer,
        { minHeight: rowHeight(fontScale) },
        backgroundColor ? { backgroundColor } : {},
      ]}>
        <TouchableOpacity
          onPress={this._onPress}
          disabled={!onPress && !onPressId}
          style={[styles.row, styles.fullHeight]}
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
            <Switch
              value={toggleValue}
              onValueChange={onToggleChange}
            />
          </View>
        ) }
      </View>
    );
  }

  render() {
    const {
      card,
      fontScale,
      backgroundColor,
    } = this.props;
    if (!card) {
      return (
        <View style={[
          styles.rowContainer,
          { minHeight: rowHeight(fontScale) },
          backgroundColor ? { backgroundColor } : {},
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
          { minHeight: rowHeight(fontScale) },
          backgroundColor ? { backgroundColor } : {},
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
    backgroundColor: '#FFF',
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  cardNameBlock: {
    marginLeft: 4,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 2,
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
  },
  dualFactionIcons: {
    marginLeft: 8,
    flexDirection: 'row',
  },
  skillIcon: {
    marginRight: 2,
  },
  subname: {
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
    marginLeft: 4,
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
    color: 'purple',
    marginRight: xs,
  },
  upgradeButton: {
    marginRight: s,
  },
});
