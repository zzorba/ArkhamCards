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
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import { DeckMeta, ParsedDeck } from '../../actions/types';
import AppIcon from '../../assets/AppIcon';
import DeckProblemRow from '../DeckProblemRow';
import { DrawSimulatorProps } from '../DrawSimulatorView';
import { CardsMap } from '../../data/Card';
import typography from '../../styles/typography';
import { TINY_PHONE } from '../../styles/sizes';
import DeckValidation from '../../lib/DeckValidation';
import { getDeckOptions } from '../navHelper';
import { FOOTER_HEIGHT } from './constants';
import { FACTION_DARK_GRADIENTS } from '../../constants';

const SHOW_CHARTS_BUTTON = true;

interface Props {
  componentId: string;
  parsedDeck: ParsedDeck;
  cards: CardsMap;
  meta: DeckMeta;
  xpAdjustment: number;
  controls?: React.ReactNode;
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
        options: getDeckOptions(parsedDeck.investigator, false, t`Charts`),
      },
    });
  };

  _showCardSimulator = () => {
    const {
      componentId,
      parsedDeck: {
        slots,
        investigator,
      },
    } = this.props;
    Navigation.push<DrawSimulatorProps>(componentId, {
      component: {
        name: 'Deck.DrawSimulator',
        passProps: {
          slots,
        },
        options: getDeckOptions(investigator, false, t`Draw`),
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
      meta,
    } = this.props;

    const validator = new DeckValidation(investigator, meta);
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
        },
        changes,
        experience,
      },
      xpAdjustment,
    } = this.props;
    if (!changes) {
      return t`XP: ${experience}`;
    }
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    return t`XP: ${changes.spentXp} of ${adjustedExperience}`;
  }

  renderControls() {
    const {
      controls,
    } = this.props;
    if (controls) {
      return controls;
    }
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  render() {
    const {
      parsedDeck: {
        investigator,
        normalCardCount,
        totalCardCount,
      },
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
          </View>
          { this.renderProblem() }
        </View>
        <View style={styles.right}>
          { this.renderControls() }
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
