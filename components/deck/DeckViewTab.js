import React from 'react';
import PropTypes from 'prop-types';
import { sum, uniqBy } from 'lodash';
const {
  StyleSheet,
  SectionList,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator
} = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import * as Actions from '../../actions';
import ArkhamIcon from '../../assets/ArkhamIcon';
import { DeckType } from './parseDeck.js';

const CLASS_ICONS = {
  mystic: <ArkhamIcon name="mystic" size={18} color="#4331b9" />,
  seeker: <ArkhamIcon name="seeker" size={18} color="#ec8426" />,
  guardian: <ArkhamIcon name="guardian" size={18} color="#2b80c5" />,
  rogue: <ArkhamIcon name="rogue" size={18} color="#107116" />,
  survivor: <ArkhamIcon name="survivor" size={18} color="#cc3038" />,
};

function deckToSections(halfDeck) {
  const result = [];
  if (halfDeck.Assets) {
    const assetCount = sum(halfDeck.Assets.map(subAssets =>
       sum(subAssets.data.map(c => c.quantity))))
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

class DeckViewTab extends React.Component {
  static propTypes = {
    parsedDeck: DeckType,
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._renderCard = this.renderCard.bind(this);
    this._renderCardHeader = this.renderCardHeader.bind(this);
    this._keyForCard = this.keyForCard.bind(this);
  }

  keyForCard(item) {
    return item.id;
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
      <View key={item.id}>
        <Text style={styles.defaultText}>
          {`${item.quantity}x `}
          { card.faction_code !== 'neutral' && CLASS_ICONS[card.faction_code] }
          <Text style={styles[card.faction_code]}>
            {card.name}
          </Text>
        </Text>
      </View>
    )
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
    } = this.props

    const sections = deckToSections(normalCards)
      .concat(deckToSections(specialCards));

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.deckTitle}>{ deck.name }</Text>
        <Image
          style={styles.investigatorCard}
          source={{
            uri: `https://arkhamdb.com${investigator.imagesrc}`,
          }}
        />
        <Text style={styles.investigatorName}>
          { investigator.name }
        </Text>
        <Text style={styles.defaultText}>
          { `${normalCardCount} cards (${totalCardCount} total)`}
        </Text>
        <Text style={styles.defaultText}>
          { `${experience} experience required.` }
        </Text>
        <Text style={styles.defaultText}>
          { `${packs} packs required.` }
        </Text>
        <SectionList
          renderItem={this._renderCard}
          keyExtractor={this._keyForCard}
          renderSectionHeader={this._renderCardHeader}
          sections={sections}
        />
      </ScrollView>
    );
  }
};

function mapStateToProps(state, props) {
  return {
    cards: state.cards.all,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

// Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(DeckViewTab);

const styles = StyleSheet.create({
  deckTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '500',
  },
  investigatorCard: {
    height: 200,
    resizeMode: 'contain',
  },
  investigatorName: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    margin: 15,
  },
  defaultText: {
    color: '#000000',
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
  seeker: {
    color: '#ec8426',
    fontSize: 14,
    lineHeight: 20,
  },
  guardian: {
    color: '#2b80c5',
    fontSize: 14,
    lineHeight: 20,
  },
  mystic: {
    color: '#4331b9',
    fontSize: 14,
    lineHeight: 20,
  },
  rogue: {
    color: '#107116',
    fontSize: 14,
    lineHeight: 20,
  },
  survivor: {
    color: '#cc3038',
    fontSize: 14,
    lineHeight: 20,
  },
  neutral: {
    color: '#606060',
    fontSize: 14,
    lineHeight: 20,
  },
});
