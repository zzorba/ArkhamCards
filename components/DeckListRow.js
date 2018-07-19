import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import InvestigatorImage from './core/InvestigatorImage';
import FactionGradient from './core/FactionGradient';
import DeckTitleBarComponent from './DeckTitleBarComponent';
import { toRelativeDateString } from '../lib/datetime';
import { parseDeck } from './parseDeck';
import typography from '../styles/typography';

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
      details,
    } = this.props;

    if (details) {
      return details;
    }
    if (!deck) {
      return null;
    }
    const parsedDeck = parseDeck(deck, deck.slots, cards);
    return (
      <View>
        <Text style={typography.small}>
          { `${deck.scenarioCount} ${deck.scenarioCount === 1 ? 'scenario' : 'scenarios'} completed.` }
        </Text>
        <Text style={typography.small}>
          { `${parsedDeck.experience} experience required.` }
        </Text>
        { !!deck.date_update && (
          <Text style={typography.small} >
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
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.column}>
          <DeckTitleBarComponent
            name={deck.name}
            investigator={investigator}
            button={titleButton}
            compact
          />
          <FactionGradient faction_code={investigator.faction_code} style={styles.row}>
            <View style={styles.image}>
              { !!investigator && <InvestigatorImage card={investigator} /> }
            </View>
            <View style={[styles.column, styles.titleColumn]}>
              <Text style={typography.bigLabel}>
                { investigator.name }
              </Text>
              { this.renderDeckDetails() }
            </View>
          </FactionGradient>
        </View>
        <FactionGradient
          faction_code={investigator.faction_code}
          style={styles.footer}
          dark
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    height: 16,
    borderBottomWidth: 1,
    borderColor: '#333',
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
