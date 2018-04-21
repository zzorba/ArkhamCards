import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import ArkhamIcon from '../../../assets/ArkhamIcon';
import EncounterIcon from '../../../assets/EncounterIcon';
import { createFactionIcons, FACTION_COLORS } from '../../../constants';
import { COLORS } from '../../../styles/colors';

const FACTION_ICONS = createFactionIcons(18);

export default class CardSearchResult extends React.PureComponent {
  static propTypes = {
    card: PropTypes.object.isRequired,
    count: PropTypes.number,
    onPress: PropTypes.func.isRequired,
    onDeckCountChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._increment = this.increment.bind(this);
    this._decrement = this.decrement.bind(this);
    this._onDeckCountPress = this.onDeckCountPress.bind(this);
    this._renderCountButton = this.renderCountButton.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card);
  }

  increment() {
    const {
      card,
      count,
    } = this.props;
    if (count === undefined) {
      this.props.onDeckCountChange(card.code, 1);
    } else if (count < card.deck_limit) {
      this.props.onDeckCountChange(card.code, count + 1);
    }
  }

  decrement() {
    const {
      card,
      count,
    } = this.props;
    if (count > 0) {
      this.props.onDeckCountChange(card.code, count - 1);
    }
  }

  onDeckCountPress(idx) {
    this.props.onDeckCountChange(this.props.card.code, idx);
  }

  renderCountButton(count) {
    return count;
  }

  renderFactionIcon() {
    const {
      card,
    } = this.props;
    if (card.subtype_code &&
      (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
    ) {
      return (
        <ArkhamIcon name="weakness" size={18} color={FACTION_COLORS.neutral} />
      );
    }
    if (card.spoiler) {
      return (
        <EncounterIcon
          encounter_code={card.encounter_code}
          size={18}
          color="#000000"
        />
      );
    }

    if (card.type_code === 'scenario') {
      return (
        <EncounterIcon
          encounter_code={card.pack_code}
          size={18}
          color="#000000"
        />
      );
    }
    return FACTION_ICONS[card.faction_code];
  }

  static skillIcon(iconName, count) {
    if (count === 0) {
      return null;
    }
    return range(0, count).map(key => (
      <View style={styles.cardIcon} key={`${iconName}-${key}`}>
        <ArkhamIcon
          name={iconName}
          size={14}
          color="#000"
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
        { CardSearchResult.skillIcon('willpower', card.skill_willpower) }
        { CardSearchResult.skillIcon('intellect', card.skill_intellect) }
        { CardSearchResult.skillIcon('combat', card.skill_combat) }
        { CardSearchResult.skillIcon('agility', card.skill_agility) }
        { CardSearchResult.skillIcon('wild', card.skill_wild) }
      </View>
    );
  }

  renderPlusButton() {
    const {
      count,
      card,
    } = this.props;
    const atLimit = (count === card.deck_limit);
    if (count === null || atLimit) {
      return (
        <MaterialCommunityIcons name="plus-box-outline" size={36} color="#ddd" />
      );
    }
    return (
      <TouchableOpacity onPress={this._increment}>
        <MaterialCommunityIcons name="plus-box" size={36} color={COLORS.green} />
      </TouchableOpacity>
    );
  }

  renderMinusButton() {
    if (this.props.count > 0) {
      return (
        <TouchableOpacity onPress={this._decrement}>
          <MaterialCommunityIcons name="minus-box" size={36} color={COLORS.red} />
        </TouchableOpacity>
      );
    }
    return (
      <MaterialCommunityIcons
        name="minus-box-outline"
        size={36}
        color="#ddd"
      />
    );
  }

  render() {
    const {
      card,
      count,
      onDeckCountChange,
    } = this.props;
    if (!card.name) {
      return <Text>No Text</Text>;
    }
    const xpStr = (card.xp && range(0, card.xp).map(() => '•').join('')) || '';
    return (
      <View style={styles.stack}>
        <View style={styles.row}>
          <TouchableOpacity onPress={this._onPress}>
            <View style={styles.cardTextRow}>
              { !!onDeckCountChange && (count > 0) && (
                <Text style={styles.cardCount}>
                  { `${count}x` }
                </Text>
              ) }
              <View style={styles.cardIcon}>
                { this.renderFactionIcon() }
              </View>
              <Text style={[
                styles.cardName,
                { color: FACTION_COLORS[card.faction_code] },
              ]}>
                { card.name }
              </Text>
              <Text style={styles.cardName}>
                { xpStr }
              </Text>
            </View>
          </TouchableOpacity>
          { !!onDeckCountChange && (
            <View style={styles.buttonContainer}>
              { this.renderMinusButton() }
              { this.renderPlusButton() }
            </View>
          ) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  skillIcons: {
    flex: 1,
    flexDirection: 'row',
  },
  cardIcon: {
    width: 22,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 8,
  },
  cardCount: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 40,
    fontWeight: '600',
    marginRight: 4,
  },
  cardName: {
    marginLeft: 4,
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 40,
  },
  buttonContainer: {
    paddingTop: 2,
    paddingBottom: 2,
    marginRight: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
