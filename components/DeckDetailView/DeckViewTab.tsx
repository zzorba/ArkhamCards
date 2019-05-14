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
import { msgid, ngettext, t } from 'ttag';

import AppIcon from '../../assets/AppIcon';
import { Campaign, Deck, DeckProblem, InvestigatorData, Trauma } from '../../actions/types';
import { CardId, ParsedDeck, SplitCards } from '../parseDeck';
import { showCard } from '../navHelper';
import InvestigatorImage from '../core/InvestigatorImage';
import DeckProgressModule from './DeckProgressModule';
import CardSearchResult from '../CardSearchResult';
import Card, { CardsMap } from '../../data/Card';
import TabooSet from '../../data/TabooSet';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';
import { l, s } from '../../styles/space';
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
      title: t`Assets (${assetCount})`,
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
    [t`Event`]: halfDeck.Event,
    [t`Skill`]: halfDeck.Skill,
    [t`Enemy`]: halfDeck.Enemy,
    [t`Treachery`]: halfDeck.Treachery,
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
  hasPendingEdits?: boolean;
  cards: CardsMap;
  isPrivate: boolean;
  buttons?: ReactNode;
  showEditSpecial?: () => void;
  showEditNameDialog: () => void;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  investigatorDataUpdates?: InvestigatorData;
  deckName: string;
  tabooSet?: TabooSet;
  tabooSetId?: number;
  xpAdjustment: number;
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
    } = this.props;
    this._showCard(investigator);
  };

  _showCard = (card: Card) => {
    const {
      componentId,
      tabooSetId,
    } = this.props;
    showCard(
      componentId,
      card.code,
      card,
      false,
      tabooSetId,
    );
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
        superTitle: t`Special Cards`,
        data: [],
        onPress: showEditSpecial,
      },
      ...deckToSections(specialCards, true),
    ];
  }

  xpString() {
    const {
      parsedDeck: {
        deck: {
          xp,
          previous_deck,
        },
        spentXp,
        experience,
      },
      xpAdjustment,
    } = this.props;
    if (!previous_deck) {
      return t`Experience Required: ${experience}`;
    }
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    if (xpAdjustment !== 0) {
      const adjustment = xpAdjustment > 0 ? `+${xpAdjustment}` : xpAdjustment;
      return t`Experience: ${spentXp} of ${adjustedExperience} (${adjustment})`;
    }
    return t`Experience: ${spentXp} of ${adjustedExperience}`;
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
        <Text style={styles.defaultText}>
          { ngettext(
            msgid`${normalCardCount} card (${totalCardCount} total)`,
            `${normalCardCount} cards (${totalCardCount} total)`,
            normalCardCount
          ) }
        </Text>
        <Text style={styles.defaultText}>
          { this.xpString() }
        </Text>
        { !!tabooSet && (
          <Text style={styles.defaultText}>
            { t`Taboo List: ${tabooSet.date_start}.` }
          </Text>
        ) }
      </View>
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
          { isPrivate && (
            <View style={styles.button}>
              <Button
                title={t`Delete Deck`}
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
    width: 80,
    height: 80,
    marginRight: s,
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
    marginLeft: s,
    marginRight: s,
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
  superHeaderText: {
    color: '#FFF',
  },
  superHeaderRow: {
    marginTop: l,
    padding: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subHeaderRow: {
    backgroundColor: '#eee',
    paddingLeft: s,
    paddingRight: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  headerRow: {
    backgroundColor: '#ccc',
    paddingLeft: s,
    paddingRight: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
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
