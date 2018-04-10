import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, keys, map, range } from 'lodash';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import AppIcon from '../../assets/AppIcon';
import { DeckType } from './parseDeck';
import { COLORS } from '../../styles/colors';
import DeckValidation from '../../lib/DeckValidation';

const DECK_PROBLEM_MESSAGES = {
  too_few_cards: 'Contains too few cards',
  too_many_cards: 'Contains too many cards',
  too_many_copies: 'Contains too many copies of a card (by title)',
  invalid_cards: 'Contains forbidden cards (cards no permitted by Faction)',
  deck_options_limit: 'Contains too many limited cards',
  investigator: 'Doesn\'t comply with the Investigator requirements',
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
      parsedDeck,
      cards,
    } = this.props;
    navigator.push({
      screen: 'Deck.DrawSimulator',
      backButtonTitle: 'Deck',
      passProps: {
        parsedDeck,
        cards,
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
      <View>
        <Text style={styles.problemText}>
          <AppIcon name="warning" size={14} color={COLORS.red} />
          { DECK_PROBLEM_MESSAGES[problem.reason] }
        </Text>
        { problem.problems.map(problem => (
          <Text key={problem} style={styles.problemText}>
            { `\u2022 ${problem}` }
          </Text>
        )) }
      </View>
    );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.left}>
          { this.renderProblem() }
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={this._showCardCharts}>
            <View style={styles.button}>
              <MaterialCommunityIcons name="chart-bar" size={28} color="#bbb" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._showCardSimulator}>
            <View style={styles.button}>
              <MaterialCommunityIcons name="cards-outline" size={28} color="#bbb" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 46,
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderColor: '#cdcdcd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingLeft: 5,
    paddingRight: 5,
  },
});
