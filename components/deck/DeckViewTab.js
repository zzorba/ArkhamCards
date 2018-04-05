import React from 'react';
import PropTypes from 'prop-types';
import { keys, flatMap, map, range, sum } from 'lodash';
import {
  StyleSheet,
  SectionList,
  View,
  Image,
  Text,
  ScrollView,
} from 'react-native';

import { DeckType } from './parseDeck';
import { COLORS } from '../../styles/colors';
import DeckViewCardItem from './DeckViewCardItem';
import DeckValidation from '../../lib/DeckValidation';

function deckToSections(halfDeck) {
  const result = [];
  if (halfDeck.Assets) {
    const assetCount = sum(halfDeck.Assets.map(subAssets =>
      sum(subAssets.data.map(c => c.quantity))));
    result.push({
      title: `Assets (${assetCount})`,
      data: [],
    });
    halfDeck.Assets.forEach(subAssets => {
      result.push({
        subTitle: subAssets.type,
        data: subAssets.data,
      });
    });
  }
  ['Event', 'Skill', 'Treachery', 'Enemy'].forEach(type => {
    if (halfDeck[type]) {
      const count = sum(halfDeck[type].map(c => c.quantity));
      result.push({
        title: `${type} (${count})`,
        data: halfDeck[type],
      });
    }
  });
  return result;
}

const DECK_PROBLEM_MESSAGES = {
  too_few_cards: 'Contains too few cards',
  too_many_cards: 'Contains too many cards',
  too_many_copies: 'Contains too many copies of a card (by title)',
  invalid_cards: 'Contains forbidden cards (cards no permitted by Faction)',
  deck_options_limit: 'Contains too many limited cards',
  investigator: 'Doesn\'t comply with the Investigator requirements',
};

export default class DeckViewTab extends React.Component {
  static propTypes = {
    parsedDeck: DeckType,
    cards: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._renderCard = this.renderCard.bind(this);
    this._renderCardHeader = this.renderCardHeader.bind(this);
    this._keyForCard = this.keyForCard.bind(this);
    this._showCard = this.showCard.bind(this);
  }

  keyForCard(item) {
    return item.id;
  }

  showCard(card) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
      },
    });
  }

  renderCardHeader({ section }) {
    if (section.subTitle) {
      return (
        <View>
          <Text style={styles.subTypeText}>{ section.subTitle }</Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.typeText}>{ section.title } </Text>
      </View>
    );
  }

  renderCard({ item }) {
    const card = this.props.cards[item.id];
    if (!card) {
      return null;
    }
    return (
      <DeckViewCardItem
        key={item.id}
        card={card}
        item={item}
        onPress={this._showCard} />
    );
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
    const {
      parsedDeck: {
        normalCards,
        specialCards,
        normalCardCount,
        totalCardCount,
        experience,
        packs,
        investigator,
        deck,
      },
    } = this.props;

    const sections = deckToSections(normalCards)
      .concat(deckToSections(specialCards));

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.deckTitle}>{ deck.name }</Text>
        <View style={styles.rowWrap}>
          <Image
            style={styles.investigatorCard}
            source={{
              uri: `https://arkhamdb.com${investigator.imagesrc}`,
            }}
          />
          <View>
            <Text style={styles.investigatorName}>
              { investigator.name }
            </Text>
            <Text style={styles.defaultText}>
              { `${normalCardCount} cards (${totalCardCount} total)` }
            </Text>
            <Text style={styles.defaultText}>
              { `${experience} experience required.` }
            </Text>
            <Text style={styles.defaultText}>
              { `${packs} packs required.` }
            </Text>
            { this.renderProblem() }
          </View>
        </View>
        <SectionList
          renderItem={this._renderCard}
          keyExtractor={this._keyForCard}
          renderSectionHeader={this._renderCardHeader}
          sections={sections}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  deckTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
  },
  investigatorCard: {
    height: 200,
    width: 280,
    resizeMode: 'contain',
    marginRight: 16,
  },
  investigatorName: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    margin: 16,
  },
  defaultText: {
    color: '#000000',
    fontSize: 14,
  },
  problemText: {
    color: COLORS.red,
    fontSize: 14,
  },
  typeText: {
    color: '#000000',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  subTypeText: {
    color: '#646464',
    fontSize: 11.9,
    fontWeight: '200',
    borderBottomColor: '#0A0A0A',
    borderBottomWidth: 1,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
