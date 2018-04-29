import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ArkhamIcon from '../../assets/ArkhamIcon';
import EncounterIcon from '../../assets/EncounterIcon';
import { createFactionIcons, FACTION_COLORS } from '../../constants';
import { COLORS } from '../../styles/colors';
import PlusMinusButtons from '../core/PlusMinusButtons';

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
    this._onDeckCountChange = this.onDeckCountChange.bind(this);
    this._renderCountButton = this.renderCountButton.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card);
  }

  onDeckCountChange(count) {
    this.props.onDeckCountChange(this.props.card.code, count);
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

  render() {
    const {
      card,
      count = 0,
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
            <PlusMinusButtons
              style={styles.buttonContainer}
              count={count || 0}
              limit={card.deck_limit}
              onChange={this._onDeckCountChange}
            />
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
