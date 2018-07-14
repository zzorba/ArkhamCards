import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import InvestigatorImage from './core/InvestigatorImage';
import DeckTitleBarComponent from './DeckTitleBarComponent';
import { toRelativeDateString } from '../lib/datetime';
import { parseDeck } from './parseDeck';
import { FACTION_LIGHT_GRADIENTS } from '../constants';

export default class DeckListRow extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    cards: PropTypes.object,
    investigator: PropTypes.object,
    onPress: PropTypes.func,
    details: PropTypes.node,
    titleButton: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      id,
      onPress,
    } = this.props;
    onPress && onPress(id);
  }

  renderDeckDetails() {
    const {
      deck,
      cards,
    } = this.props;

    if (!deck) {
      return null;
    }
    const parsedDeck = parseDeck(deck, deck.slots, cards);
    return (
      <View>
        <Text style={styles.text}>
          { `${deck.scenarioCount} ${deck.scenarioCount === 1 ? 'scenario' : 'scenarios'} completed.` }
        </Text>
        <Text style={styles.text}>
          { `${parsedDeck.experience} experience required.` }
        </Text>
        { !!deck.date_update && (
          <Text style={styles.text} >
            Updated { toRelativeDateString(Date.parse(deck.date_update)) }
          </Text>
        ) }
      </View>
    );
  }

  render() {
    const {
      deck,
      investigator,
      titleButton,
      details,
    } = this.props;
    if (!deck) {
      return (
        <View style={styles.row}>
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#000000"
          />
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={this._onPress} style={styles.container}>
        <View style={styles.column}>
          <DeckTitleBarComponent
            name={deck.name}
            investigator={investigator}
            button={titleButton}
            compact
          />
          <LinearGradient
            colors={FACTION_LIGHT_GRADIENTS[investigator.faction_code]}
            style={styles.row}
          >
            <View style={styles.image}>
              { !!investigator && <InvestigatorImage card={investigator} /> }
            </View>
            <View style={[styles.column, styles.titleColumn]}>
              <Text style={styles.text}>
                { investigator.name }
              </Text>
              { details || this.renderDeckDetails() }
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    fontFamily: 'System',
    fontSize: 14,
    lineHeight: 18,
  },
  loading: {
    marginLeft: 10,
  },
  image: {
    marginLeft: 10,
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
    height: '100%',
  },
});
