import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import ArkhamIcon from '../../assets/ArkhamIcon';
import EncounterIcon from '../../assets/EncounterIcon';
import CardCostIcon, { COST_ICON_SIZE } from '../core/CardCostIcon';
import Switch from '../core/Switch';
import { createFactionIcons, FACTION_COLORS } from '../../constants';
import { COLORS } from '../../styles/colors';
import { ROW_HEIGHT, ICON_SIZE, TOGGLE_BUTTON_MODE, BUTTON_WIDTH } from './constants';
import CardQuantityComponent from './CardQuantityComponent';
import typography from '../../styles/typography';
import { isBig, s } from '../../styles/space';

const SKILL_ICON_SIZE = (isBig ? 24 : 14) * DeviceInfo.getFontScale();
const SMALL_ICON_SIZE = (isBig ? 38 : 26) * DeviceInfo.getFontScale();
const SMALL_FACTION_ICONS = createFactionIcons(SMALL_ICON_SIZE);
const FACTION_ICONS = createFactionIcons(ICON_SIZE);

export default class CardSearchResult extends React.PureComponent {
  static propTypes = {
    card: PropTypes.object.isRequired,
    count: PropTypes.number,
    onPress: PropTypes.func,
    onDeckCountChange: PropTypes.func,
    limit: PropTypes.number,
    onToggleChange: PropTypes.func,
    toggleValue: PropTypes.bool,
    deltaCountMode: PropTypes.bool,
    hasSecondCore: PropTypes.bool,
    showZeroCount: PropTypes.bool,
    id: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._onDeckCountChange = this.onDeckCountChange.bind(this);
    this._renderCountButton = this.renderCountButton.bind(this);
  }

  onPress() {
    const {
      id,
      onPress,
    } = this.props;
    Keyboard.dismiss();
    onPress && onPress(id || this.props.card);
  }

  onDeckCountChange(count) {
    this.props.onDeckCountChange(this.props.card.code, count);
  }

  renderCountButton(count) {
    return count;
  }

  renderFactionIcon(card, size) {
    if (!card.encounter_code && card.linked_card) {
      return this.renderFactionIcon(card.linked_card, size);
    }

    if (card.spoiler) {
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
      return (size === ICON_SIZE ? FACTION_ICONS : SMALL_FACTION_ICONS).dual;
    }
    return (size === ICON_SIZE ? FACTION_ICONS : SMALL_FACTION_ICONS)[card.faction_code];
  }

  static cardCost(card) {
    if (card.type_code === 'skill') {
      return '';
    }
    if (card.permanent || card.double_sided) {
      return '-';
    }
    return `${card.cost !== null ? card.cost : 'X'}`;
  }

  renderIcon(card) {
    if (card.hidden && card.linked_card) {
      return this.renderIcon(card.linked_card);
    }

    const showCost = card.type_code === 'asset' ||
      card.type_code === 'event' ||
      card.type_code === 'skill';

    if (showCost) {
      return (
        <View style={styles.factionIcon}>
          <CardCostIcon card={card} />
        </View>
      );
    }
    return (
      <View style={styles.factionIcon}>
        { this.renderFactionIcon(card, ICON_SIZE) }
      </View>
    );
  }

  static skillIcon(skill, count) {
    if (count === 0) {
      return null;
    }
    return range(0, count).map(key => (
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
    } = this.props;
    if (!card.faction2_code) {
      return null;
    }
    return (
      <View style={styles.dualFactionIcons}>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name={card.faction_code}
            size={15}
            color={FACTION_COLORS[card.faction_code]}
          />
        </View>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name={card.faction2_code}
            size={15}
            color={FACTION_COLORS[card.faction2_code]}
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
        { CardSearchResult.skillIcon('willpower', card.skill_willpower) }
        { CardSearchResult.skillIcon('intellect', card.skill_intellect) }
        { CardSearchResult.skillIcon('combat', card.skill_combat) }
        { CardSearchResult.skillIcon('agility', card.skill_agility) }
        { CardSearchResult.skillIcon('wild', card.skill_wild) }
      </View>
    );
  }

  renderCardName() {
    const {
      card,
    } = this.props;
    const color = card.faction2_code ?
      FACTION_COLORS.dual :
      (FACTION_COLORS[card.faction_code] || '#000000');
    return (
      <View style={styles.cardNameBlock}>
        <View style={styles.row}>
          <Text style={[typography.text, { color }]} numberOfLines={1} ellipsizeMode="clip">
            { card.renderName }
          </Text>
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

  countText() {
    const {
      count,
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
      limit,
      hasSecondCore,
      showZeroCount,
    } = this.props;
    if (onDeckCountChange) {
      const deck_limit = Math.min(
        card.pack_code === 'core' ?
          (card.quantity * (hasSecondCore ? 2 : 1)) :
          card.deck_limit,
        card.deck_limit
      );
      return (
        <CardQuantityComponent
          count={count || 0}
          limit={Math.max(count || 0, limit !== null ? limit : deck_limit)}
          countChanged={this._onDeckCountChange}
          showZeroCount={showZeroCount}
        />
      );
    }
    if (count !== 0) {
      return (
        <View style={styles.countText}>
          <Text style={typography.text}>
            { this.countText() }
          </Text>
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
      onDeckCountChange,
    } = this.props;
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={this._onPress}
          disabled={!onPress}
          style={[styles.row, styles.fullHeight]}
        >
          <View style={[
            styles.cardTextRow,
            onDeckCountChange && TOGGLE_BUTTON_MODE ?
              { paddingRight: BUTTON_WIDTH } :
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
      </React.Fragment>
    );
  }

  render() {
    const {
      card,
    } = this.props;
    if (!card) {
      return (
        <View style={styles.rowContainer}>
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
        <View style={styles.rowContainer}>
          <Text>No Text</Text>;
        </View>
      );
    }

    return (
      <View style={styles.rowContainer}>
        { this.renderContent() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: 'transparent',
    position: 'relative',
    width: '100%',
    height: ROW_HEIGHT,
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
    height: COST_ICON_SIZE,
    width: COST_ICON_SIZE,
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
  countText: {
    marginRight: s,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
