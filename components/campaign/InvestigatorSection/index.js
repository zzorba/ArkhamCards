import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, flatMap, forEach } from 'lodash';
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

class InvestigatorSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object,
    decks: PropTypes.object,
    investigators: PropTypes.object,
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
    this._syncInvestigatorData = this.syncInvestigatorData.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
  }

  syncInvestigatorData() {
    const {
      latestData,
      investigatorData,
    } = this.state;
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
    this.setState({
      latestDeckIds: [...this.state.latestDeckIds || [], deckId],
    });
  }

  investigatorData(investigatorId) {
    const {
      campaign: {
        campaignNotes: {
          investigatorSections,
          investigatorCounts,
        },
      },
    } = this.props;
    const {
      investigatorData,
    } = this.state;
    const data = Object.assign({},
      investigatorData[investigatorId] || {
        physical: 0,
        mental: 0,
        campaignNotes: {
          sections: [],
          counts: [],
        },
      });
    forEach(investigatorSections, section => {
      if (findIndex(data.campaignNotes.sections, existing => existing.title === section.title) === -1) {
        data.campaignNotes.sections.push({
          title: section.title,
          notes: [],
        });
      }
    });
    forEach(investigatorCounts, section => {
      if (findIndex(data.campaignNotes.counts, existing => existing.title === section.title) === -1) {
        data.campaignNotes.sections.push({
          title: section.title,
          count: 0,
        });
      }
    });
    return data;
  }

  renderInvestigatorDetails(deck) {
    const data = this.investigatorData(deck.investigator_code);
    return (
      <View>
        <Text>XP: { deck.xp }</Text>
        <Text>Trauma: { InvestigatorSection.traumaString(data) }</Text>
      </View>
    );
  }

  render() {
    const {
      navigator,
      decks,
      investigators,
      campaign: {
        campaignNotes: {
          investigatorSections,
          investigatorCounts,
        },
      },
    } = this.props;
    const {
      latestDeckIds,
    } = this.state;
    return (
      <View>
        <Text style={[typography.bigLabel, styles.margin]}>
          Investigators
        </Text>
        { flatMap(latestDeckIds, deckId => {
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
  connectRealm(InvestigatorSection, {
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
});
