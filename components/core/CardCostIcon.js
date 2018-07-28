import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import AppIcon from '../../assets/AppIcon';
import { FACTION_COLORS } from '../../constants';
import typography from '../../styles/typography';

export default class CardCostIcon extends React.Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
    inverted: PropTypes.bool,
    linked: PropTypes.bool,
  };

  cardCost() {
    const {
      card,
      linked,
    } = this.props;
    if (card.type_code === 'skill') {
      return '';
    }
    if (card.permanent || card.double_sided || linked) {
      return '-';
    }
    return `${card.cost !== null ? card.cost : 'X'}`;
  }

  render() {
    const {
      card,
      inverted,
    } = this.props;
    const color = FACTION_COLORS[card.faction_code];
    return (
      <View style={styles.level}>
        <View style={styles.levelIcon}>
          <AppIcon
            name={`${inverted ? 'inverted_' : ''}level_${card.xp || 0}`}
            size={32}
            color={inverted ? '#FFF' : color}
          />
        </View>
        <View style={[styles.levelIcon, styles.cost]}>
          <Text style={[
            typography.text,
            { color: '#FFF' },
          ]}>
            { this.cardCost() }
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  level: {
    position: 'relative',
    width: 36,
    height: 36,
  },
  levelIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 36,
    height: 36,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cost: {
    paddingBottom: 6,
  },
});
