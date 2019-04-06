import React, { ReactNode } from 'react';
import { head, forEach, map, sum, sumBy } from 'lodash';
import {
  Alert,
  AlertButton,
  Button,
  Linking,
  StyleSheet,
  SectionList,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import DeviceInfo from 'react-native-device-info';

import AppIcon from '../../assets/AppIcon';
import { Campaign, Deck, DeckProblem, InvestigatorData, Trauma } from '../../actions/types';
import L from '../../app/i18n';
import { CardId, CardSplitType, ParsedDeck, SplitCards } from '../parseDeck';
import { showCard } from '../navHelper';
import InvestigatorImage from '../core/InvestigatorImage';
import DeckProgressModule from './DeckProgressModule';
import CardSearchResult from '../CardSearchResult';
import Card, { CardsMap } from '../../data/Card';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';
import { FACTION_DARK_GRADIENTS } from '../../constants';

const SMALL_EDIT_ICON_SIZE = 18 * DeviceInfo.getFontScale();

interface SectionCardId extends CardId {
  special: boolean;
}

interface CardSection {
  superTitle?: string;
  title?: string;
  subTitle?: string;
  data: SectionCardId[];
  onPress?: () => void;
}

function deckToSections(halfDeck: SplitCards, special: boolean): CardSection[] {
  const result: CardSection[] = [];
  if (halfDeck.Assets) {
    const assetCount = sum(halfDeck.Assets.map(subAssets =>
      sum(subAssets.data.map(c => c.quantity))));
    result.push({
      title: L('Assets ({{count}})', { count: assetCount }),
      data: [],
    });
    forEach(halfDeck.Assets, subAssets => {
      result.push({
        subTitle: subAssets.type,
        data: map(subAssets.data, c => {
          return { ...c, special };
        }),
      });
    });
  }
  forEach({
    [L('Event')]: halfDeck.Event,
    [L('Skill')]: halfDeck.Skill,
    [L('Enemy')]: halfDeck.Enemy,
    [L('Treachery')]: halfDeck.Treachery,
  }, (cardSplitGroup, localizedName) => {
    if (cardSplitGroup) {
      const count = sumBy(cardSplitGroup, c => c.quantity);
      result.push({
        title: `${localizedName} (${count})`,
        data: map(cardSplitGroup, c => {
          return { ...c, special };
        }),
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

interface Props {
  componentId: string;
  deck: Deck;
  campaign?: Campaign;
  parsedDeck: ParsedDeck;
  hasPendingEdits?: boolean;
  cards: CardsMap;
  isPrivate: boolean;
  buttons?: ReactNode;
  showEditSpecial?: () => void;
  showEditNameDialog: () => void;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  investigatorDataUpdates?: InvestigatorData;
  deckName: string;
  signedIn: boolean;
  login: () => void;
  deleteDeck: (allVersions: boolean) => void;
  uploadLocalDeck: () => void;
  problem?: DeckProblem;
}

export default class DeckViewTab extends React.Component<Props> {
  _keyForCard = (item: SectionCardId) => {
    return item.id;
  };

  _deleteDeckPrompt = () => {
    const {
      deck,
      deleteDeck,
    } = this.props;
    if (deck.local) {
      const options: AlertButton[] = [];
      const isLatestUpgrade = deck.previous_deck && !deck.next_deck;
      if (isLatestUpgrade) {
        options.push({
          text: L('Delete this upgrade ({{version}})', { version: deck.version }),
          onPress: () => {
            deleteDeck(false);
          },
          style: 'destructive',
        });
        options.push({
          text: L('Delete all versions'),
          onPress: () => {
            deleteDeck(true);
          },
          style: 'destructive',
        });
      } else {
        const isUpgraded = !!deck.next_deck;
        options.push({
          text: isUpgraded ? L('Delete all versions') : L('Delete'),
          onPress: () => {
            deleteDeck(true);
          },
          style: 'destructive',
        });
      }
      options.push({
        text: L('Cancel'),
        style: 'cancel',
      });

      Alert.alert(
        L('Delete deck'),
        L('Are you sure you want to delete this deck?'),
        options,
      );
    } else {
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
  };

  _uploadToArkhamDB = () => {
    const {
      signedIn,
      login,
      deck,
      hasPendingEdits,
      uploadLocalDeck,
    } = this.props;
    if (hasPendingEdits) {
      Alert.alert(
        L('Save Local Changes'),
        L('Please save any local edits to this deck before sharing to ArkhamDB')
      );
    } else if (deck.next_deck || deck.previous_deck) {
      Alert.alert(
        L('Unsupported Operation'),
        L('This deck contains next/previous versions with upgrades, so we cannot upload it to ArkhamDB at this time. If you would like to upload it, you can use Copy to upload a clone of the current deck.')
      );
    } else if (!signedIn) {
      Alert.alert(
        L('Sign in to ArkhamDB'),
        L('ArkhamDB is a popular deck building site where you can manage and share decks with others.\n\nSign in to access your decks or share decks you have created with others.'),
        [
          { text: 'Sign In', onPress: login },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } else {
      Alert.alert(
        L('Upload to ArkhamDB'),
        L('You can upload your deck to ArkhamDB to share with others.\n\nAfter doing this you will need network access to make changes to the deck.'),
        [
          { text: 'Upload', onPress: uploadLocalDeck },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    }
  };

  _viewDeck = () => {
    Linking.openURL(`https://arkhamdb.com/deck/view/${this.props.deck.id}`);
  };

  _showInvestigator = () => {
    const {
      parsedDeck: {
        investigator,
      },
    } = this.props;
    this._showCard(investigator);
  };

  _showCard = (card: Card) => {
    showCard(this.props.componentId, card.code, card, false);
  };

  _renderSectionHeader = ({ section }: { section: CardSection }) => {
    const {
      parsedDeck: {
        investigator,
      },
    } = this.props;
    if (section.superTitle) {
      if (section.onPress) {
        return (
          <TouchableOpacity onPress={section.onPress} style={[
            styles.superHeaderRow,
            { backgroundColor: FACTION_DARK_GRADIENTS[investigator.factionCode()][0] },
          ]}>
            <Text style={[typography.label, styles.superHeaderText]}>
              { section.superTitle }
            </Text>
            <View style={styles.editIcon}>
              <MaterialIcons name="edit" color="#FFF" size={SMALL_EDIT_ICON_SIZE} />
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <View style={[
          styles.superHeaderRow,
          { backgroundColor: FACTION_DARK_GRADIENTS[investigator.factionCode()][0] },
        ]}>
          <Text style={[typography.label, styles.superHeaderText]}>
            { section.superTitle }
          </Text>
        </View>
      );
    }
    if (section.subTitle) {
      return (
        <View style={styles.subHeaderRow}>
          <Text style={typography.smallLabel}>
            { section.subTitle.toUpperCase() }
          </Text>
        </View>
      );
    }

    if (section.title) {
      return (
        <View style={styles.headerRow}>
          <Text style={typography.small}>
            { section.title.toUpperCase() }
          </Text>
        </View>
      );
    }
    return null;
  }

  _renderCard = ({ item }: { item: SectionCardId }) => {
    const {
      parsedDeck: {
        ignoreDeckLimitSlots,
      },
    } = this.props;
    const card = this.props.cards[item.id];
    if (!card) {
      return null;
    }
    const count = (item.special && ignoreDeckLimitSlots[item.id] > 0) ?
      ignoreDeckLimitSlots[item.id] :
      (item.quantity - (ignoreDeckLimitSlots[item.id] || 0));
    return (
      <CardSearchResult
        key={item.id}
        card={card}
        onPress={this._showCard}
        count={count}
      />
    );
  };

  renderProblem() {
    const {
      parsedDeck: {
        investigator,
      },
      problem,
    } = this.props;

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
            <AppIcon name="warning" size={14 * DeviceInfo.getFontScale()} color={isSurvivor ? COLORS.black : COLORS.white} />
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

  data() {
    const {
      parsedDeck: {
        normalCards,
        specialCards,
      },
      showEditSpecial,
    } = this.props;

    return [
      ...deckToSections(normalCards, false),
      {
        superTitle: L('Special Cards'),
        data: [],
        onPress: showEditSpecial,
      },
      ...deckToSections(specialCards, true),
    ];
  }

  render() {
    const {
      campaign,
      investigatorDataUpdates,
      componentId,
      deck,
      cards,
      deckName,
      parsedDeck: {
        normalCardCount,
        totalCardCount,
        experience,
        investigator,
      },
      isPrivate,
      buttons,
      showEditNameDialog,
      showTraumaDialog,
    } = this.props;

    const sections = this.data();

    return (
      <ScrollView>
        <View>
          { this.renderProblem() }
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={this._showInvestigator}>
                <View style={styles.image}>
                  <InvestigatorImage card={investigator} componentId={componentId} />
                </View>
              </TouchableOpacity>
              <View style={styles.metadata}>
                { (isPrivate && !deck.next_deck) ? (
                  <TouchableOpacity onPress={showEditNameDialog}>
                    <View style={styles.nameRow}>
                      <View style={styles.investigatorWrapper}>
                        <Text
                          style={styles.investigatorName}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          { deckName }
                        </Text>
                      </View>
                      <View style={styles.editIcon}>
                        <MaterialIcons name="edit" color="#222222" size={SMALL_EDIT_ICON_SIZE} />
                      </View>
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
              initialNumToRender={25}
              renderItem={this._renderCard}
              keyExtractor={this._keyForCard}
              renderSectionHeader={this._renderSectionHeader}
              sections={sections}
            />
          </View>
          { deck.local ? (
            <View style={styles.button}>
              <Button
                title={L('Upload to ArkhamDB')}
                onPress={this._uploadToArkhamDB}
              />
            </View>
          ) : (
            <View style={styles.button}>
              <Button
                title={L('View on ArkhamDB')}
                onPress={this._viewDeck}
              />
            </View>
          ) }
          { isPrivate && (
            <View style={styles.button}>
              <Button
                title={L('Delete Deck')}
                color={COLORS.red}
                onPress={this._deleteDeckPrompt}
              />
            </View>
          ) }
          <DeckProgressModule
            componentId={componentId}
            cards={cards}
            deck={deck}
            parsedDeck={this.props.parsedDeck}
            isPrivate={isPrivate}
            campaign={campaign}
            showTraumaDialog={showTraumaDialog}
            investigatorDataUpdates={investigatorDataUpdates}
          />
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
  investigatorWrapper: {
    flex: 1,
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
  superHeaderText: {
    color: '#FFF',
  },
  superHeaderRow: {
    marginTop: 32,
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  nameRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIcon: {
    width: SMALL_EDIT_ICON_SIZE,
    height: SMALL_EDIT_ICON_SIZE,
  },
});
