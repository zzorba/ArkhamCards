import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AppIcon from '../assets/AppIcon';
import Button from './core/Button';
import InvestigatorImage from './core/InvestigatorImage';
import FactionGradient from './core/FactionGradient';
import DeckTitleBarComponent from './DeckTitleBarComponent';
import { toRelativeDateString } from '../lib/datetime';
import { parseDeck } from './parseDeck';
import typography from '../styles/typography';

export default class DeckListRow extends React.Component {
  static propTypes = {
    deck: PropTypes.object.isRequired,
    cards: PropTypes.object,
    investigator: PropTypes.object,
    onPress: PropTypes.func,
    details: PropTypes.node,
    titleButton: PropTypes.node,
    compact: PropTypes.bool,
    viewDeckButton: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      deck,
      investigator,
      onPress,
    } = this.props;
    onPress && onPress(deck, investigator);
  }

  renderDeckDetails() {
    const {
      deck,
      cards,
      details,
    } = this.props;

    if (details) {
      return (
        <View>
          { details }
        </View>
      );
    }
    if (!deck) {
      return null;
    }
    const parsedDeck = parseDeck(deck, deck.slots, cards);
    const completedScenarioString =
      `${deck.scenarioCount} ${deck.scenarioCount === 1 ? 'scenario' : 'scenarios'} completed.`;
    return (
      <View>
        <Text style={typography.small}>
          { completedScenarioString }
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
      compact,
      viewDeckButton,
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
      <TouchableOpacity onPress={this._onPress} disabled={viewDeckButton}>
        <View style={styles.column}>
          <DeckTitleBarComponent
            name={compact && investigator ? investigator.name : deck.name}
            investigator={investigator}
            button={titleButton}
            compact
          />
          <FactionGradient faction_code={investigator.faction_code} style={styles.investigatorBlock}>
            <View style={styles.image}>
              { !!investigator && <InvestigatorImage card={investigator} /> }
              { viewDeckButton && (
                <Button
                  style={styles.button}
                  size="small"
                  color="white"
                  onPress={this._onPress}
                  text="Deck"
                  icon={<AppIcon name="deck" size={18} color="#222222" />}
                />
              ) }
            </View>
            <View style={[styles.column, styles.titleColumn]}>
              { !compact && (
                <Text style={typography.bigLabel}>
                  { investigator.name }
                </Text>
              ) }
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
    justifyContent: 'flex-start',
  },
  investigatorBlock: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
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
  },
  button: {
    marginTop: 8,
  },
});
