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

const ROW_HEIGHT = 44;
const ICON_SIZE = 28;
const FACTION_ICONS = createFactionIcons(ICON_SIZE);

export default class CardSearchResult extends React.PureComponent {
  static propTypes = {
    card: PropTypes.object.isRequired,
    count: PropTypes.number,
    onPress: PropTypes.func.isRequired,
    onDeckCountChange: PropTypes.func,
    limit: PropTypes.number,
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

  renderFactionIcon(card) {
    if (!card.encounter_code && card.linked_card) {
      return this.renderFactionIcon(card.linked_card);
    }
    if (card.subtype_code &&
      (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
    ) {
      return (
        <ArkhamIcon name="weakness" size={ICON_SIZE} color={FACTION_COLORS.neutral} />
      );
    }
    if (card.spoiler) {
      return (
        <EncounterIcon
          encounter_code={card.encounter_code}
          size={ICON_SIZE}
          color="#000000"
        />
      );
    }

    if (card.type_code === 'scenario' ||
      card.type_code === 'story') {
      return (
        <EncounterIcon
          encounter_code={card.pack_code}
          size={ICON_SIZE}
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
      limit,
    } = this.props;
    if (!card.name) {
      return <Text>No Text</Text>;
    }
    const xpStr = (card.xp && range(0, card.xp).map(() => '•').join('')) || '';
    return (
      <View style={styles.stack}>
        <TouchableOpacity onPress={this._onPress} style={[styles.row, styles.fullHeight]}>
          <View style={styles.cardTextRow}>
            { !!onDeckCountChange && (count > 0) && (
              <Text style={styles.cardCount}>
                { `${count}x` }
              </Text>
            ) }
            <View style={styles.cardIcon}>
              { this.renderFactionIcon(card) }
            </View>
            { card.subname ? (
              <View style={styles.cardNameBlock}>
                <View style={styles.row}>
                  <Text style={[
                    styles.cardName,
                    { color: FACTION_COLORS[card.faction_code] },
                  ]}>
                    { card.name }
                  </Text>
                  <Text style={[styles.cardName, styles.xp]}>
                    { xpStr }
                  </Text>
                </View>
                <Text style={[
                  styles.cardSubName,
                  { color: FACTION_COLORS[card.faction_code] },
                ]}>
                  { card.subname }
                </Text>
              </View>

            ) : (
              <View style={styles.row}>
                <Text style={[
                  styles.cardNameOnly,
                  { color: FACTION_COLORS[card.faction_code] },
                ]}>
                  { card.name }
                </Text>
                <Text style={[styles.cardName, styles.xp]}>
                  { xpStr }
                </Text>
              </View>
            ) }
          </View>
          { !!onDeckCountChange && (
            <PlusMinusButtons
              style={styles.buttonContainer}
              count={count || 0}
              limit={limit !== null ? limit : card.deck_limit}
              onChange={this._onDeckCountChange}
            />
          ) }
        </TouchableOpacity>
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
  },
  fullHeight: {
    height: ROW_HEIGHT,
    width: '100%',
  },
  skillIcons: {
    flex: 1,
    flexDirection: 'row',
  },
  cardIcon: {
    width: ROW_HEIGHT,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 8,
    alignItems: 'center',
  },
  cardCount: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: ROW_HEIGHT,
    fontWeight: '600',
    marginRight: 4,
  },
  cardNameOnly: {
    marginLeft: 4,
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: ROW_HEIGHT,
  },
  cardNameBlock: {
    marginLeft: 4,
  },
  cardName: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
  },
  xp: {
    marginLeft: 4,
  },
  cardSubName: {
    fontFamily: 'System',
    fontSize: 12,
    lineHeight: 18,
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
