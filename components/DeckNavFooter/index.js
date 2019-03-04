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
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import AppIcon from '../../assets/AppIcon';
import DeckProblemRow from '../DeckProblemRow';
import { DeckType } from '../parseDeck';
import typography from '../../styles/typography';
import { TINY_PHONE } from '../../styles/sizes';
import DeckValidation from '../../lib/DeckValidation';
import { FOOTER_HEIGHT } from './constants';
import { FACTION_DARK_GRADIENTS } from '../../constants';

const SHOW_CHARTS_BUTTON = false;


export default class DeckNavFooter extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    parsedDeck: DeckType,
    cards: PropTypes.object.isRequired,
    xpAdjustment: PropTypes.number,
    showXpEditDialog: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._showCardSimulator = this.showCardSimulator.bind(this);
    this._showCardCharts = this.showCardCharts.bind(this);
  }

  showCardCharts() {
    const {
      componentId,
      parsedDeck,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Deck.Charts',
        passProps: {
          parsedDeck,
        },
        options: {
          topBar: {
            backButton: {
              title: L('Deck'),
            },
          },
          bottomTabs: {
            visible: false,
            drawBehind: true,
            animate: true,
          },
        },
      },
    });
  }

  showCardSimulator() {
    const {
      componentId,
      parsedDeck: {
        slots,
      },
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Deck.DrawSimulator',
        passProps: {
          slots,
        },
        options: {
          topBar: {
            title: {
              text: L('Draw'),
            },
            backButton: {
              title: L('Deck'),
            },
          },
          bottomTabs: {
            visible: false,
            drawBehind: true,
            animate: true,
          },
        },
      },
    });
  }

  renderProblem() {
    const {
      cards,
      parsedDeck: {
        slots,
        ignoreDeckLimitSlots,
        investigator,
      },
    } = this.props;

    const validator = new DeckValidation(investigator);
    const problem = validator.getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      if (!card) {
        return [];
      }
      return map(
        range(0, Math.max(0, slots[code] - (ignoreDeckLimitSlots[code] || 0))),
        () => card
      );
    }));

    if (!problem) {
      return null;
    }

    return (
      <DeckProblemRow problem={problem} color="#FFFFFF" noFontScaling />
    );
  }

  xpString() {
    const {
      parsedDeck: {
        deck: {
          xp,
          previous_deck,
        },
        spentXp,
        experience,
      },
      xpAdjustment,
    } = this.props;
    if (!previous_deck) {
      return L('XP: {{totalXp}}', { totalXp: experience });
    }
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    if (xpAdjustment !== 0) {
      return L('XP: {{spentXp}} of {{availableExperience}} ({{adjustment}})', {
        spentXp,
        availableExperience: adjustedExperience,
        adjustment: xpAdjustment > 0 ? `+${xpAdjustment}` : xpAdjustment,
      });
    }
    return L('XP: {{spentXp}} of {{availableExperience}}', {
      spentXp,
      availableExperience: adjustedExperience,
    });
  }

  render() {
    const {
      parsedDeck: {
        investigator,
        normalCardCount,
        totalCardCount,
      },
      showXpEditDialog,
    } = this.props;
    const cardCountString =
      L('{{normalCardCount}} Cards ({{totalCardCount}} Total)',
        { normalCardCount, totalCardCount });
    const xpString = this.xpString();

    return (
      <LinearGradient
        style={styles.wrapper}
        colors={FACTION_DARK_GRADIENTS[investigator.faction_code]}
      >
        <View style={styles.left}>
          <View style={styles.row}>
            <Text style={[
              TINY_PHONE ? typography.small : typography.text,
              styles.whiteText,
            ]} allowFontScaling={false}>
              { `${cardCountString} - ${xpString}` }
            </Text>
            { !!showXpEditDialog && (
              <TouchableOpacity onPress={showXpEditDialog}>
                <View style={styles.button}>
                  <MaterialIcons name="edit" size={TINY_PHONE ? 12 : 18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ) }
          </View>
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
  whiteText: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
