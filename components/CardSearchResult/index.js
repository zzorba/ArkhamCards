import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AppIcon from '../../assets/AppIcon';
import ArkhamIcon from '../../assets/ArkhamIcon';
import EncounterIcon from '../../assets/EncounterIcon';
import { createFactionIcons, FACTION_COLORS } from '../../constants';
import { COLORS } from '../../styles/colors';
import { ROW_HEIGHT, ICON_SIZE } from './constants';
import CardQuantityComponent from './CardQuantityComponent';
import typography from '../../styles/typography';

const SMALL_ICON_SIZE = 26;
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
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._onDeckCountChange = this.onDeckCountChange.bind(this);
    this._renderCountButton = this.renderCountButton.bind(this);
  }

  onPress() {
    const {
      onPress,
    } = this.props;
    onPress && onPress(this.props.card);
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
    if (card.subtype_code &&
      (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
    ) {
      return (
        <ArkhamIcon name="weakness" size={size} color={FACTION_COLORS.neutral} />
      );
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

    if (card.type_code === 'scenario' || card.type_code === 'story') {
      return (
        <EncounterIcon
          encounter_code={card.pack_code}
          size={ICON_SIZE}
          color="#000000"
        />
      );
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
    const showCost = card.type_code === 'asset' ||
      card.type_code === 'event' ||
      card.type_code === 'skill';

    if (showCost) {
      return (
        <View style={styles.level}>
          <View style={styles.levelIcon}>
            <AppIcon
              name={`level_${card.xp || 0}`}
              size={32}
              color={FACTION_COLORS[card.faction_code]}
            />
          </View>
          <View style={[styles.levelIcon, styles.cost]}>
            <Text style={[typography.text, styles.costText]}>
              { CardSearchResult.cardCost(card) }
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.factionIcon}>
        { this.renderFactionIcon(card, ICON_SIZE) }
      </View>
    );
  }

  static skillIcon(iconName, count) {
    if (count === 0) {
      return null;
    }
    return range(0, count).map(key => (
      <View key={`${iconName}-${key}`} style={styles.skillIcon}>
        <ArkhamIcon
          name={iconName}
          size={14}
          color="#222"
        />
      </View>
    ));
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
        { CardSearchResult.skillIcon('skill_willpower', card.skill_willpower) }
        { CardSearchResult.skillIcon('skill_intellect', card.skill_intellect) }
        { CardSearchResult.skillIcon('skill_combat', card.skill_combat) }
        { CardSearchResult.skillIcon('skill_agility', card.skill_agility) }
        { CardSearchResult.skillIcon('skill_wild', card.skill_wild) }
      </View>
    );
  }

  renderCardName(card) {
    return (
      <View style={styles.cardNameBlock}>
        <View style={styles.row}>
          <Text style={[
            typography.text,
            { color: FACTION_COLORS[card.faction_code] || '#000000' },
          ]} ellipsizeMode="tail">
            { card.renderName }
          </Text>
        </View>
        <View style={styles.row}>
          { this.renderSkillIcons() }
          { !!card.renderSubname && (
            <Text style={[
              typography.small,
              styles.subname,
              { color: FACTION_COLORS[card.faction_code] || '#000000' },
            ]}>
              { card.renderSubname }
            </Text>
          ) }
        </View>
      </View>
    );
  }

  render() {
    const {
      card,
      count = 0,
      onDeckCountChange,
      limit,
      onToggleChange,
      toggleValue,
      onPress,
    } = this.props;
    if (!card.name) {
      return <Text>No Text</Text>;
    }
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={this._onPress}
          disabled={!onPress}
          style={[styles.row, styles.fullHeight]}
        >
          <View style={styles.cardTextRow}>
            { this.renderIcon(card) }
            { this.renderCardName(card) }
          </View>
        </TouchableOpacity>
        { !!onDeckCountChange && (
          <CardQuantityComponent
            count={count || 0}
            limit={limit !== null ? limit : card.deck_limit}
            countChanged={this._onDeckCountChange}
          />
        ) }
        { !!onToggleChange && (
          <View style={styles.switchButton}>
            <Switch
              value={toggleValue}
              onValueChange={onToggleChange}
              onTintColor="#222222"
            />
          </View>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    position: 'relative',
    width: '100%',
    minHeight: ROW_HEIGHT,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  cardNameBlock: {
    marginLeft: 4,
    marginTop: 4,
    marginBottom: 4,
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
  skillIcon: {
    marginRight: 2,
  },
  level: {
    position: 'relative',
    width: ROW_HEIGHT,
    height: ROW_HEIGHT,
  },
  levelIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ROW_HEIGHT,
    height: ROW_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subname: {
    marginRight: 8,
  },
  cost: {
    paddingBottom: 6,
  },
  factionIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: ROW_HEIGHT,
    width: ROW_HEIGHT,
  },
  cardTextRow: {
    flex: 2,
    flexDirection: 'row',
    paddingLeft: 8,
    alignItems: 'center',
  },
  switchButton: {
    marginTop: 6,
    marginRight: 6,
  },
  costText: {
    color: '#FFF',
  },
});
