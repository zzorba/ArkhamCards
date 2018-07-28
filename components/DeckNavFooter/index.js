import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, head, keys, map, range } from 'lodash';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import AppIcon from '../../assets/AppIcon';
import { DeckType } from '../parseDeck';
import { COLORS } from '../../styles/colors';
import typography from '../../styles/typography';
import DeckValidation from '../../lib/DeckValidation';
import { FOOTER_HEIGHT } from './constants';
import { FACTION_DARK_GRADIENTS } from '../../constants';

const SHOW_CHARTS_BUTTON = false;
const DECK_PROBLEM_MESSAGES = {
  too_few_cards: 'Not enough cards.',
  too_many_cards: 'Too many cards.',
  too_many_copies: 'Too many copies of a card with the same name.',
  invalid_cards: 'Contains forbidden cards (cards not permitted by Faction)',
  deck_options_limit: 'Contains too many limited cards.',
  investigator: 'Doesn\'t comply with the Investigator requirements.',
};

export default class DeckNavFooter extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    parsedDeck: DeckType,
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._showCardSimulator = this.showCardSimulator.bind(this);
    this._showCardCharts = this.showCardCharts.bind(this);
  }

  showCardCharts() {
    const {
      navigator,
      parsedDeck,
    } = this.props;
    navigator.push({
      screen: 'Deck.Charts',
      backButtonTitle: 'Deck',
      passProps: {
        parsedDeck,
      },
      navigatorStyle: {
        tabBarHidden: true,
      },
    });
  }

  showCardSimulator() {
    const {
      navigator,
      parsedDeck: {
        deck,
      },
    } = this.props;
    navigator.push({
      screen: 'Deck.DrawSimulator',
      title: 'Draw',
      backButtonTitle: 'Deck',
      passProps: {
        slots: deck.slots,
      },
      navigatorStyle: {
        tabBarHidden: true,
      },
    });
  }

  renderProblem() {
    const {
      cards,
      parsedDeck: {
        slots,
        investigator,
      },
    } = this.props;

    const validator = new DeckValidation(investigator);
    const problem = validator.getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      return map(range(0, slots[code]), () => card);
    }));

    if (!problem) {
      return null;
    }

    return (
      <View style={styles.problemRow}>
        <View style={styles.warningIcon}>
          <AppIcon name="warning" size={14} color={COLORS.white} />
        </View>
        <Text
          style={[typography.small, styles.whiteText, styles.problemText]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          { head(problem.problems) || DECK_PROBLEM_MESSAGES[problem.reason] }
        </Text>
      </View>
    );
  }

  render() {
    const {
      parsedDeck: {
        deck: {
          xp,
          previous_deck,
        },
        investigator,
        spentXp,
        totalXp,
        normalCardCount,
        totalCardCount,
      },
    } = this.props;
    return (
      <LinearGradient
        style={styles.wrapper}
        colors={FACTION_DARK_GRADIENTS[investigator.faction_code]}
      >
        <View style={styles.left}>
          <Text style={[typography.text, styles.whiteText]}>
            { `${normalCardCount} Cards (${totalCardCount} Total)` }
            { previous_deck ? ` - XP: ${spentXp} of ${xp}` : ` - XP: ${totalXp}` }
          </Text>
          { this.renderProblem() }
        </View>
        <View style={styles.right}>
          { SHOW_CHARTS_BUTTON && (
            <TouchableOpacity onPress={this._showCardCharts}>
              <View style={styles.button}>
                <MaterialCommunityIcons name="chart-bar" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ) }
          <TouchableOpacity onPress={this._showCardSimulator}>
            <View style={styles.button}>
              <AppIcon name="cards" size={28} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
}

const BUTTON_SIZE = 44;
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 4,
  },
  left: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  button: {
    padding: 4,
    width: BUTTON_SIZE,
  },
  problemText: {
    flex: 1,
  },
  problemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 2,
  },
  whiteText: {
    color: '#FFFFFF',
  },
});
