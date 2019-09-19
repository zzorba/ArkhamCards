import React, { ReactNode } from 'react';
import { head, find, forEach, keys, map, sum, sumBy } from 'lodash';
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
  SectionListData,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import DeviceInfo from 'react-native-device-info';
import { msgid, ngettext, t } from 'ttag';

import AppIcon from '../../assets/AppIcon';
import { Campaign, CardId, Deck, DeckMeta, DeckProblem, InvestigatorData, ParsedDeck, SplitCards, Slots, Trauma } from '../../actions/types';
import { showCard, showCardSwipe } from '../navHelper';
import InvestigatorImage from '../core/InvestigatorImage';
import DeckProgressModule from './DeckProgressModule';
import InvestigatorOptionsModule from './InvestigatorOptionsModule';
import CardSectionHeader, { CardSectionHeaderData } from './CardSectionHeader';
import CardSearchResult from '../CardSearchResult';
import DeckValidation from '../../lib/DeckValidation';
import Card, { CardsMap } from '../../data/Card';
import TabooSet from '../../data/TabooSet';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';
import { s, sizeScale } from '../../styles/space';

const SMALL_EDIT_ICON_SIZE = 18 * sizeScale * DeviceInfo.getFontScale();

interface SectionCardId extends CardId {
  special: boolean;
  hasUpgrades: boolean;
}

interface CardSection extends CardSectionHeaderData {
  id: string;
  data: SectionCardId[];
}

function hasUpgrades(
  code: string,
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation
) {
  const card = cards[code];
  return !!(
    card &&
    card.has_upgrades &&
    find(cardsByName[card.real_name] || [], upgradeCard => (
      upgradeCard.code !== code &&
      validation.canIncludeCard(upgradeCard, false) &&
      (card.xp || 0) < (upgradeCard.xp || 0)
    )));

}

function deckToSections(
  halfDeck: SplitCards,
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation,
  special: boolean
): CardSection[] {
  const result: CardSection[] = [];
  if (halfDeck.Assets) {
    const assetCount = sum(halfDeck.Assets.map(subAssets =>
      sum(subAssets.data.map(c => c.quantity))));
    result.push({
      id: `assets${special ? '-special' : ''}`,
      title: t`Assets (${assetCount})`,
      data: [],
    });
    forEach(halfDeck.Assets, (subAssets, idx) => {
      result.push({
        id: `asset${special ? '-special' : ''}-${idx}`,
        subTitle: subAssets.type,
        data: map(subAssets.data, c => {
          return {
            ...c,
            special,
            hasUpgrades: hasUpgrades(c.id, cards, cardsByName, validation),
          };
        }),
      });
    });
  }
  forEach({
    [t`Event`]: halfDeck.Event,
    [t`Skill`]: halfDeck.Skill,
    [t`Enemy`]: halfDeck.Enemy,
    [t`Treachery`]: halfDeck.Treachery,
  }, (cardSplitGroup, localizedName) => {
    if (cardSplitGroup) {
      const count = sumBy(cardSplitGroup, c => c.quantity);
      result.push({
        id: `${localizedName}-${special ? '-special' : ''}`,
        title: `${localizedName} (${count})`,
        data: map(cardSplitGroup, c => {
          return {
            ...c,
            special,
            hasUpgrades: hasUpgrades(c.id, cards, cardsByName, validation),
          };
        }),
      });
    }
  });
  return result;
}


function bondedSections(
  slots: Slots,
  cards: CardsMap,
  bondedCardsByName: { [name: string]: Card[] }
): CardSection[] {
  const bondedCards: Card[] = [];
  forEach(keys(slots), code => {
    const card = cards[code];
    if (slots[code] > 0 && card) {
      const possibleBondedCards = bondedCardsByName[card.real_name];
      if (possibleBondedCards && possibleBondedCards.length) {
        forEach(possibleBondedCards, bonded => {
          bondedCards.push(bonded);
        });
      }
    }
  });
  if (!bondedCards.length) {
    return [];
  }
  const count = sumBy(bondedCards, card => card.quantity || 0);
  return [{
    id: 'bonded-cards',
    title: t`Bonded Cards (${count})`,
    data: map(bondedCards, c => {
      return {
        id: c.code,
        quantity: c.quantity || 0,
        special: true,
        hasUpgrades: false,
      };
    }),
  }];
}

const DECK_PROBLEM_MESSAGES = {
  too_few_cards: t`Not enough cards.`,
  too_many_cards: t`Too many cards.`,
  too_many_copies: t`Too many copies of a card with the same name.`,
  invalid_cards: t`Contains forbidden cards (cards not permitted by Faction)`,
  deck_options_limit: t`Contains too many limited cards.`,
  investigator: t`Doesn't comply with the Investigator requirements.`,
};

interface Props {
  componentId: string;
  deck: Deck;
  campaign?: Campaign;
  parsedDeck: ParsedDeck;
  meta: DeckMeta;
  hasPendingEdits?: boolean;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  bondedCardsByName: {
    [name: string]: Card[];
  };
  isPrivate: boolean;
  buttons?: ReactNode;
  showEditSpecial?: () => void;
  showEditNameDialog: () => void;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showCardUpgradeDialog: (card: Card) => void;
  investigatorDataUpdates?: InvestigatorData;
  deckName: string;
  tabooSet?: TabooSet;
  singleCardView: boolean;
  tabooSetId?: number;
  xpAdjustment: number;
  signedIn: boolean;
  login: () => void;
  deleteDeck: (allVersions: boolean) => void;
  uploadLocalDeck: () => void;
  problem?: DeckProblem;
  renderFooter: (slots?: Slots) => React.ReactNode;
  onDeckCountChange: (code: string, count: number) => void;
  setMeta: (key: string, value: string) => void;
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
          text: t`Delete this upgrade (${deck.version})`,
          onPress: () => {
            deleteDeck(false);
          },
          style: 'destructive',
        });
        options.push({
          text: t`Delete all versions`,
          onPress: () => {
            deleteDeck(true);
          },
          style: 'destructive',
        });
      } else {
        const isUpgraded = !!deck.next_deck;
        options.push({
          text: isUpgraded ? t`Delete all versions` : t`Delete`,
          onPress: () => {
            deleteDeck(true);
          },
          style: 'destructive',
        });
      }
      options.push({
        text: t`Cancel`,
        style: 'cancel',
      });

      Alert.alert(
        t`Delete deck`,
        t`Are you sure you want to delete this deck?`,
        options,
      );
    } else {
      Alert.alert(
        t`Visit ArkhamDB to delete?`,
        t`Unfortunately to delete decks you have to visit ArkhamDB at this time.`,
        [
          {
            text: t`Visit ArkhamDB`,
            onPress: () => {
              Linking.openURL(`https://arkhamdb.com/deck/view/${deck.id}`);
            },
          },
          {
            text: t`Cancel`,
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
        t`Save Local Changes`,
        t`Please save any local edits to this deck before sharing to ArkhamDB`
      );
    } else if (deck.next_deck || deck.previous_deck) {
      Alert.alert(
        t`Unsupported Operation`,
        t`This deck contains next/previous versions with upgrades, so we cannot upload it to ArkhamDB at this time. If you would like to upload it, you can use Copy to upload a clone of the current deck.`
      );
    } else if (!signedIn) {
      Alert.alert(
        t`Sign in to ArkhamDB`,
        t`ArkhamDB is a popular deck building site where you can manage and share decks with others.\n\nSign in to access your decks or share decks you have created with others.`,
        [
          { text: 'Sign In', onPress: login },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } else {
      Alert.alert(
        t`Upload to ArkhamDB`,
        t`You can upload your deck to ArkhamDB to share with others.\n\nAfter doing this you will need network access to make changes to the deck.`,
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
      componentId,
      tabooSetId,
    } = this.props;
    showCard(
      componentId,
      investigator.code,
      investigator,
      false,
      tabooSetId,
    );
  };

  _showSwipeCard = (id: string, card: Card) => {
    const {
      componentId,
      tabooSetId,
      parsedDeck: {
        investigator,
        slots,
      },
      renderFooter,
      onDeckCountChange,
      singleCardView,
    } = this.props;
    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        true,
        tabooSetId
      );
      return;
    }
    const [sectionId, cardIndex] = id.split('.');
    let index = 0;
    const cards: Card[] = [];
    forEach(this.data(), section => {
      if (sectionId === section.id) {
        index = cards.length + parseInt(cardIndex, 10);
      }
      forEach(section.data, item => {
        const card = this.props.cards[item.id];
        cards.push(card);
      });
    });
    showCardSwipe(
      componentId,
      cards,
      index,
      false,
      tabooSetId,
      slots,
      onDeckCountChange,
      investigator,
      renderFooter,
    );
  };

  _renderSectionHeader = ({ section }: {
    section: SectionListData<CardSection>;
  }) => {
    const {
      parsedDeck: {
        investigator,
      },
    } = this.props;
    return (
      <CardSectionHeader
        key={section.id}
        section={section as CardSectionHeaderData}
        investigator={investigator}
      />
    );
  }

  _renderCard = ({ item, index, section }: {
    item: SectionCardId;
    index: number;
    section: SectionListData<CardSection>;
  }) => {
    const {
      parsedDeck: {
        ignoreDeckLimitSlots,
        deck: {
          previous_deck,
          next_deck,
        },
      },
      showCardUpgradeDialog,
    } = this.props;
    const card = this.props.cards[item.id];
    if (!card) {
      return null;
    }
    const count = (item.special && ignoreDeckLimitSlots[item.id] > 0) ?
      ignoreDeckLimitSlots[item.id] :
      (item.quantity - (ignoreDeckLimitSlots[item.id] || 0));
    const id = `${section.id}.${index}`;
    const upgradeEnabled = previous_deck && !next_deck && item.hasUpgrades;
    return (
      <CardSearchResult
        key={id}
        card={card}
        id={id}
        onUpgrade={upgradeEnabled ? showCardUpgradeDialog : undefined}
        onPressId={this._showSwipeCard}
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

  data(): CardSection[] {
    const {
      parsedDeck: {
        normalCards,
        specialCards,
        investigator,
        slots,
      },
      meta,
      showEditSpecial,
      cards,
      cardsByName,
      bondedCardsByName,
    } = this.props;

    const validation = new DeckValidation(investigator, meta);

    return [
      ...deckToSections(normalCards, cards, cardsByName, validation, false),
      {
        id: 'special',
        superTitle: t`Special Cards`,
        data: [],
        onPress: showEditSpecial,
      },
      ...deckToSections(specialCards, cards, cardsByName, validation, true),
      ...bondedSections(slots, cards, bondedCardsByName),
    ];
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
      return t`Experience required: ${experience}`;
    }
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    return t`Available experience: ${adjustedExperience}\nSpent experience: ${changes.spentXp}`;
  }

  renderMetadata() {
    const {
      tabooSet,
      parsedDeck: {
        normalCardCount,
        totalCardCount,
      },
    } = this.props;
    return (
      <View style={styles.metadata}>
        <Text style={typography.small}>
          { ngettext(
            msgid`${normalCardCount} card (${totalCardCount} total)`,
            `${normalCardCount} cards (${totalCardCount} total)`,
            normalCardCount
          ) }
        </Text>
        <Text style={typography.small}>
          { this.xpString() }
        </Text>
        { !!tabooSet && (
          <Text style={typography.small}>
            { t`Taboo List: ${tabooSet.date_start}.` }
          </Text>
        ) }
      </View>
    );
  }

  renderInvestigatorOptions() {
    const {
      parsedDeck: {
        investigator,
      },
      meta,
      setMeta,
    } = this.props;
    return (
      <InvestigatorOptionsModule
        investigator={investigator}
        meta={meta}
        setMeta={setMeta}
      />
    );
  }

  render() {
    const {
      campaign,
      investigatorDataUpdates,
      componentId,
      deck,
      deckName,
      cards,
      parsedDeck: {
        investigator,
      },
      isPrivate,
      buttons,
      showEditNameDialog,
      showTraumaDialog,
      xpAdjustment,
    } = this.props;

    const sections = this.data();
    const detailsEditable = (isPrivate && !deck.next_deck);
    return (
      <ScrollView>
        <View>
          { this.renderProblem() }
          <View style={styles.container}>
            { detailsEditable ? (
              <TouchableOpacity onPress={showEditNameDialog}>
                <View style={styles.nameRow}>
                  <View style={styles.investigatorWrapper}>
                    <Text
                      style={[typography.text, typography.bold]}
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
              <Text style={[typography.text, typography.bold]}>
                { `${deckName}  ` }
              </Text>
            ) }
            <View style={styles.header}>
              <TouchableOpacity onPress={this._showInvestigator}>
                <View style={styles.image}>
                  <InvestigatorImage card={investigator} componentId={componentId} />
                </View>
              </TouchableOpacity>
              <View style={styles.metadata}>
                { detailsEditable ? (
                  <TouchableOpacity onPress={showEditNameDialog}>
                    { this.renderMetadata() }
                  </TouchableOpacity>
                ) : (
                  this.renderMetadata()
                ) }
              </View>
            </View>
          </View>
          { this.renderInvestigatorOptions() }
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
          <DeckProgressModule
            componentId={componentId}
            cards={cards}
            deck={deck}
            parsedDeck={this.props.parsedDeck}
            isPrivate={isPrivate}
            campaign={campaign}
            showTraumaDialog={showTraumaDialog}
            investigatorDataUpdates={investigatorDataUpdates}
            xpAdjustment={xpAdjustment}
          />
          { deck.local ? (
            <View style={styles.button}>
              <Button
                title={t`Upload to ArkhamDB`}
                onPress={this._uploadToArkhamDB}
              />
            </View>
          ) : (
            <View style={styles.button}>
              <Button
                title={t`View on ArkhamDB`}
                onPress={this._viewDeck}
              />
            </View>
          ) }
          { !!isPrivate && (
            <View style={styles.button}>
              <Button
                title={t`Delete Deck`}
                color={COLORS.red}
                onPress={this._deleteDeckPrompt}
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
    marginTop: s,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  button: {
    margin: s,
  },
  metadata: {
    flexDirection: 'column',
    flex: 1,
  },
  image: {
    marginRight: s,
  },
  investigatorWrapper: {
    flex: 1,
  },
  container: {
    marginLeft: s,
    marginRight: s,
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
    paddingRight: s,
    paddingLeft: s,
  },
  problemText: {
    color: COLORS.white,
    fontSize: 14,
    flex: 1,
  },
  warningIcon: {
    marginRight: 4,
  },
  cards: {
    marginTop: s,
    borderTopWidth: 1,
    borderColor: '#bdbdbd',
  },
  nameRow: {
    marginTop: s,
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
