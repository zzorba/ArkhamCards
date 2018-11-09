import React from 'react';
import PropTypes from 'prop-types';
import { head, keys, flatMap, map, range, sum } from 'lodash';
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  SectionList,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import AppIcon from '../../assets/AppIcon';
import L from '../../app/i18n';
import { DeckType } from '../parseDeck';
import InvestigatorImage from '../core/InvestigatorImage';
import DeckProgressModule from './DeckProgressModule';
import CardSearchResult from '../CardSearchResult';
import DeckValidation from '../../lib/DeckValidation';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';

function deckToSections(halfDeck) {
  const result = [];
  if (halfDeck.Assets) {
    const assetCount = sum(halfDeck.Assets.map(subAssets =>
      sum(subAssets.data.map(c => c.quantity))));
    result.push({
      title: L('Assets ({{count}})', { count: assetCount }),
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
  too_few_cards: L('Not enough cards.'),
  too_many_cards: L('Too many cards.'),
  too_many_copies: L('Too many copies of a card with the same name.'),
  invalid_cards: L('Contains forbidden cards (cards not permitted by Faction)'),
  deck_options_limit: L('Contains too many limited cards.'),
  investigator: L('Doesn\'t comply with the Investigator requirements.'),
};

export default class DeckViewTab extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    deck: PropTypes.object,
    parsedDeck: DeckType,
    cards: PropTypes.object.isRequired,
    isPrivate: PropTypes.bool,
    buttons: PropTypes.node,
    showEditNameDialog: PropTypes.func.isRequired,
    deckName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this._renderCard = this.renderCard.bind(this);
    this._renderCardHeader = this.renderCardHeader.bind(this);
    this._keyForCard = this.keyForCard.bind(this);
    this._showCard = this.showCard.bind(this);
    this._showInvestigator = this.showInvestigator.bind(this);
    this._viewDeck = this.viewDeck.bind(this);
    this._deleteDeck = this.deleteDeck.bind(this);
  }

  keyForCard(item) {
    return item.id;
  }

  deleteDeck() {
    const {
      deck,
    } = this.props;
    Alert.alert(
      L('Visit ArkhamDB to delete?'),
      L('Unfortunately to delete decks you have to visit ArkhamDB at this time.'),
      [
        {
          text: L('Visit ArkhamDB'),
          onPress: () => {
            Linking.openURL(`https://arkhamdb.com/deck/view/${deck.id}`);
          },
        },
        {
          text: L('Cancel'),
          style: 'cancel',
        },
      ],
    );
  }

  viewDeck() {
    Linking.openURL(`https://arkhamdb.com/deck/view/${this.props.deck.id}`);
  }

  showInvestigator() {
    const {
      parsedDeck: {
        investigator,
      },
    } = this.props;
    this.showCard(investigator);
  }

  showCard(card) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'Card',
        passProps: {
          id: card.code,
          pack_code: card.pack_code,
        },
        options: {
          topBar: {
            backButton: {
              title: L('Back'),
            },
          },
        },
      },
    });
  }

  renderCardHeader({ section }) {
    if (section.subTitle) {
      return (
        <View style={styles.subHeaderRow}>
          <Text style={typography.smallLabel}>
            { section.subTitle.toUpperCase() }
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.headerRow}>
        <Text style={typography.small}>
          { section.title.toUpperCase() }
        </Text>
      </View>
    );
  }

  renderCard({ item }) {
    const card = this.props.cards[item.id];
    if (!card) {
      return null;
    }
    return (
      <CardSearchResult
        key={item.id}
        card={card}
        onPress={this._showCard}
        count={item.quantity}
      />
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
      if (!card) {
        return [];
      }
      return map(range(0, slots[code]), () => card);
    }));

    if (!problem) {
      return null;
    }
    const isSurvivor = investigator.faction_code === 'survivor';
    return (
      <View style={[styles.problemBox,
        { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
      ]}>
        <View style={styles.problemRow}>
          <View style={styles.warningIcon}>
            <AppIcon name="warning" size={14} color={isSurvivor ? COLORS.black : COLORS.white} />
          </View>
          <Text
            numberOfLines={2}
            style={[styles.problemText, { color: isSurvivor ? COLORS.black : COLORS.white }]}
          >
            { head(problem.problems) || DECK_PROBLEM_MESSAGES[problem.reason] }
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const {
      componentId,
      deck,
      deckName,
      parsedDeck: {
        normalCards,
        specialCards,
        normalCardCount,
        totalCardCount,
        experience,
        investigator,
      },
      isPrivate,
      buttons,
      showEditNameDialog,
    } = this.props;

    const sections = deckToSections(normalCards)
      .concat(deckToSections(specialCards));

    return (
      <ScrollView>
        <View>
          { this.renderProblem() }
          <View style={[styles.container, styles.rowWrap]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={this._showInvestigator}>
                <View style={styles.image}>
                  <InvestigatorImage card={investigator} componentId={componentId} />
                </View>
              </TouchableOpacity>
              <View style={styles.metadata}>
                { (isPrivate && !deck.next_deck) ? (
                  <TouchableOpacity style={styles.row} onPress={showEditNameDialog}>
                    <Text style={styles.investigatorName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      { deckName }
                    </Text>
                    <View style={styles.editIcon}>
                      <MaterialIcons name="edit" color="#222222" size={16} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.investigatorName}>
                    { `${deckName}  ` }
                  </Text>
                ) }
                <Text style={styles.defaultText}>
                  { L(
                    '{{cardCount}} cards ({{totalCount}} total)',
                    { cardCount: normalCardCount, totalCount: totalCardCount }
                  ) }
                </Text>
                <Text style={styles.defaultText}>
                  { L('Version {{version}}', { version: deck.version }) }
                </Text>
                { experience > 0 && (
                  <Text style={styles.defaultText}>
                    { L('{{xp}} experience required.', { xp: experience }) }
                  </Text>
                ) }
              </View>
            </View>
          </View>
          <View style={styles.container}>
            { buttons }
          </View>
          <View style={styles.cards}>
            <SectionList
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
              initialNumToRender={20}
              renderItem={this._renderCard}
              keyExtractor={this._keyForCard}
              renderSectionHeader={this._renderCardHeader}
              sections={sections}
            />
          </View>
          <DeckProgressModule
            componentId={componentId}
            deck={deck}
            parsedDeck={this.props.parsedDeck}
            isPrivate={isPrivate}
          />
          <View style={styles.button}>
            <Button
              title={L('View on ArkhamDB')}
              onPress={this._viewDeck}
            />
          </View>
          { isPrivate && (
            <View style={styles.button}>
              <Button
                title={L('Delete Deck')}
                color={COLORS.red}
                onPress={this._deleteDeck}
              />
            </View>
          ) }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  button: {
    margin: 8,
  },
  metadata: {
    flexDirection: 'column',
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 8,
  },
  investigatorName: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    marginLeft: 8,
    marginRight: 8,
  },
  defaultText: {
    color: '#000000',
    fontSize: 14,
  },
  problemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  problemBox: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
  },
  problemText: {
    color: COLORS.white,
    fontSize: 14,
    flex: 1,
  },
  warningIcon: {
    marginRight: 4,
  },
  subHeaderRow: {
    backgroundColor: '#eee',
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  headerRow: {
    backgroundColor: '#ccc',
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  cards: {
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#bdbdbd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  editIcon: {
    width: 16,
    marginLeft: 16,
  },
});
