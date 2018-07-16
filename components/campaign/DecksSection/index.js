import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, forEach, partition } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import AddDeckRow from '../../AddDeckRow';
import DeckListRow from '../../DeckListRow';
import { getAllDecks } from '../../../reducers';
import typography from '../../../styles/typography';

class DecksSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object,
    updateLatestDeckIds: PropTypes.func.isRequired,
    decks: PropTypes.object,
    investigators: PropTypes.object,
    /* eslint-disable react/no-unused-prop-types */
    cards: PropTypes.object,
  };

  static traumaString(investigatorData) {
    const parts = [];
    if (investigatorData.killed) {
      return 'Killed';
    }
    if (investigatorData.insane) {
      return 'Insane';
    }
    if (investigatorData.physical > 0) {
      parts.push(`Physical(${investigatorData.physical})`);
    }
    if (investigatorData.mental > 0) {
      parts.push(`Mental(${investigatorData.mental})`);
    }
    if (!parts.length) {
      return 'None';
    }
    return parts.join(', ');
  }

  constructor(props) {
    super(props);

    this.state = {
      investigatorData: props.campaign.investigatorData,
      latestDeckIds: props.campaign.latestDeckIds,
    };

    this._deckNavClicked = this.deckNavClicked.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
  }

  deckNavClicked(id) {
    this.props.navigator.showModal({
      screen: 'Deck',
      passProps: {
        id: id,
        isPrivate: true,
        modal: true,
      },
    });
  }

  deckAdded(deckId) {
    const latestDeckIds = [...this.state.latestDeckIds || [], deckId];
    this.props.updateLatestDeckIds(latestDeckIds);

    this.setState({
      latestDeckIds,
    });
  }

  investigatorData(investigatorId) {
    const {
      investigatorData,
    } = this.state;
    const data = Object.assign({},
      investigatorData[investigatorId] || {
        physical: 0,
        mental: 0,
      });
    return data;
  }

  renderInvestigatorDetails(deck) {
    const data = this.investigatorData(deck.investigator_code);
    return (
      <View>
        <Text>XP: { deck.xp }</Text>
        <Text>Trauma: { DecksSection.traumaString(data) }</Text>
      </View>
    );
  }

  render() {
    const {
      navigator,
      decks,
      investigators,
      campaign: {
        investigatorData,
      },
    } = this.props;
    const {
      latestDeckIds,
    } = this.state;
    const [killedOrInsaneDeckIds, deckIds] = partition(latestDeckIds, deckId => {
      const deck = decks[deckId];
      if (!deck) {
        return false;
      }
      const data = investigatorData[deck.investigator_code];
      return data && (data.killed || data.insane);
    });
    return (
      <View style={styles.underline}>
        <Text style={[typography.bigLabel, styles.margin]}>
          Decks
        </Text>
        { flatMap(deckIds, deckId => {
          const deck = decks[deckId];
          if (!deck) {
            return null;
          }
          return (
            <View style={styles.card} key={deckId}>
              <DeckListRow
                id={deckId}
                deck={deck}
                investigator={deck && investigators[deck.investigator_code]}
                onPress={this._deckNavClicked}
                details={this.renderInvestigatorDetails(deck)}
              />
            </View>
          );
        }) }
        <AddDeckRow
          navigator={navigator}
          deckAdded={this._deckAdded}
          selectedDeckIds={latestDeckIds}
        />
        { (killedOrInsaneDeckIds.length > 0) &&
          <View>
            <Text style={[typography.bigLabel, styles.margin]}>
              Fallen Investigators
            </Text>
            { flatMap(deckIds, deckId => {
              const deck = decks[deckId];
              if (!deck) {
                return null;
              }
              const data = investigatorData[deck.investigator_code];
              const investigator = investigators[deck.investigator_code];
              return (
                <Text style={typography.text}>
                  { `${investigator.name}: ${data.killed ? 'Killed' : 'Insane'}` }
                </Text>
              );
            }) }
          </View>
        }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(DecksSection, {
    schemas: ['Card'],
    mapToProps(results) {
      const investigators = {};
      const cards = {};
      forEach(results.cards, card => {
        cards[card.code] = card;
        if (card.type_code === 'investigator') {
          investigators[card.code] = card;
        }
      });
      return {
        cards,
        investigators,
      };
    },
  })
);

const styles = StyleSheet.create({
  margin: {
    margin: 8,
  },
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  underline: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#000000',
    marginBottom: 8,
  },
});
