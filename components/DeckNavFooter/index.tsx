import React from 'react';
import { flatMap, keys, map, range } from 'lodash';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import AppIcon from '../../assets/AppIcon';
import DeckProblemRow from '../DeckProblemRow';
import { DrawSimulatorProps } from '../DrawSimulatorView';
import { ParsedDeck } from '../parseDeck';
import { CardsMap } from '../../data/Card';
import typography from '../../styles/typography';
import { TINY_PHONE } from '../../styles/sizes';
import DeckValidation from '../../lib/DeckValidation';
import { FOOTER_HEIGHT } from './constants';
import { FACTION_DARK_GRADIENTS } from '../../constants';

const SHOW_CHARTS_BUTTON = false;

interface Props {
  componentId: string;
  parsedDeck: ParsedDeck;
  cards: CardsMap;
  xpAdjustment: number;
  showXpEditDialog?: () => void;
}

export default class DeckNavFooter extends React.Component<Props> {
  _showCardCharts = () => {
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
              title: t`Deck`,
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
  };

  _showCardSimulator = () => {
    const {
      componentId,
      parsedDeck: {
        slots,
      },
    } = this.props;
    Navigation.push<DrawSimulatorProps>(componentId, {
      component: {
        name: 'Deck.DrawSimulator',
        passProps: {
          slots,
        },
        options: {
          topBar: {
            title: {
              text: t`Draw`,
            },
            backButton: {
              title: t`Deck`,
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
  };

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
      return t`XP: ${experience}`;
    }
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    if (xpAdjustment !== 0) {
      const adjustment = xpAdjustment > 0 ? `+${xpAdjustment}` : xpAdjustment;
      return t`XP: ${spentXp} of ${adjustedExperience} (${adjustment})`;
    }
    return t`XP: ${spentXp} of ${adjustedExperience}`;
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
    const cardCountString = ngettext(
      msgid`${normalCardCount} Card (${totalCardCount} Total)`,
      `${normalCardCount} Cards (${totalCardCount} Total)`,
      normalCardCount
    );
    const xpString = this.xpString();
    return (
      <LinearGradient
        style={styles.wrapper}
        colors={FACTION_DARK_GRADIENTS[investigator.factionCode()]}
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
