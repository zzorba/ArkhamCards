import React, { ReactNode } from 'react';
import { find, forEach, keys, map, sum, sumBy } from 'lodash';
import {
  Button,
  StyleSheet,
  SectionList,
  View,
  TouchableOpacity,
  Text,
  SectionListData,
} from 'react-native';
import { t } from 'ttag';

import { Campaign, CardId, Deck, DeckMeta, DeckProblem, InvestigatorData, ParsedDeck, SplitCards, Slots, Trauma } from '../../actions/types';
import { showCard, showCardSwipe } from '../navHelper';
import ArkhamIcon from '../../assets/ArkhamIcon';
import AppIcon from '../../assets/AppIcon';
import InvestigatorImage from '../core/InvestigatorImage';
import DeckProgressModule from './DeckProgressModule';
import InvestigatorOptionsModule from './InvestigatorOptionsModule';
import CardSectionHeader, { CardSectionHeaderData } from './CardSectionHeader';
import CardSearchResult from '../CardSearchResult';
import TabooSetPicker from '../TabooSetPicker';
import { FACTION_DARK_GRADIENTS } from '../../constants';
import DeckValidation from '../../lib/DeckValidation';
import Card, { CardsMap } from '../../data/Card';
import TabooSet from '../../data/TabooSet';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';
import { isBig, s } from '../../styles/space';
import DeckProblemRow from '../DeckProblemRow';

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
      upgradeCard &&
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

interface Props {
  componentId: string;
  fontScale: number;
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
  editable: boolean;
  isPrivate: boolean;
  buttons?: ReactNode;
  showEditSpecial?: () => void;
  showEditNameDialog: () => void;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showCardUpgradeDialog: (card: Card) => void;
  investigatorDataUpdates?: InvestigatorData;
  deckName: string;
  tabooSet?: TabooSet;
  tabooOpen: boolean;
  singleCardView: boolean;
  tabooSetId?: number;
  showTaboo: boolean;
  setTabooSet: (tabooSetId?: number) => void;
  xpAdjustment: number;
  signedIn: boolean;
  login: () => void;
  problem?: DeckProblem;
  renderFooter: (slots?: Slots) => React.ReactNode;
  onDeckCountChange: (code: string, count: number) => void;
  setMeta: (key: string, value: string) => void;
  showEditCards: () => void;
  showDeckUpgrade: () => void;
  width: number;
}

export default class DeckViewTab extends React.Component<Props> {
  _keyForCard = (item: SectionCardId) => {
    return item.id;
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
      fontScale,
    } = this.props;
    return (
      <CardSectionHeader
        key={section.id}
        section={section as CardSectionHeaderData}
        investigator={investigator}
        fontScale={fontScale}
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
      fontScale,
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
        fontScale={fontScale}
      />
    );
  };

  renderProblem() {
    const {
      parsedDeck: {
        investigator,
      },
      problem,
      fontScale,
    } = this.props;

    if (!problem) {
      return null;
    }
    const isSurvivor = investigator.faction_code === 'survivor';
    return (
      <View style={[styles.problemBox,
        { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
      ]}>
        <DeckProblemRow
          problem={problem}
          color={isSurvivor ? COLORS.black : COLORS.white}
          fontSize={14}
          fontScale={fontScale}
        />
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
      showEditCards,
      showEditSpecial,
      cards,
      cardsByName,
      bondedCardsByName,
    } = this.props;

    const validation = new DeckValidation(investigator, meta);

    return [
      {
        id: 'cards',
        superTitle: t`Cards`,
        data: [],
        onPress: showEditCards,
      },
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

  renderMetadata() {
    const {
      tabooSet,
    } = this.props;
    return (
      <View style={styles.metadata}>
        { !!tabooSet && (
          <Text style={typography.small}>
            { t`Taboo List: ${tabooSet.date_start}.` }
          </Text>
        ) }
      </View>
    );
  }

  renderInvestigatorStats() {
    const {
      parsedDeck: {
        investigator,
      },
      fontScale,
    } = this.props;

    const ICON_SIZE = fontScale * (isBig ? 1.5 : 1.0) * 18;
    return (
      <View>
        <View style={styles.skillRow}>
          <Text style={typography.gameFont}>
            { investigator.skill_willpower || 0 }
            <ArkhamIcon name="willpower" size={ICON_SIZE} color="#222" />
          </Text>
          <Text style={typography.gameFont}>
            { investigator.skill_intellect || 0 }
            <ArkhamIcon name="intellect" size={ICON_SIZE} color="#222" />
          </Text>
          <Text style={typography.gameFont}>
            { investigator.skill_combat || 0 }
            <ArkhamIcon name="combat" size={ICON_SIZE} color="#222" />
          </Text>
          <Text style={typography.gameFont}>
            { investigator.skill_agility || 0 }
            <ArkhamIcon name="agility" size={ICON_SIZE} color="#222" />
          </Text>
        </View>
        <View style={styles.skillRow}>
          <Text style={typography.gameFont}>
            { t`Health: ${investigator.health || 0}` }
          </Text>
          <Text style={typography.gameFont}>
            { t`Sanity: ${investigator.sanity || 0}` }
          </Text>
        </View>
      </View>
    );
  }

  renderInvestigatorOptions() {
    const {
      parsedDeck: {
        investigator,
      },
      deck,
      meta,
      setMeta,
      tabooSet,
      tabooSetId,
      setTabooSet,
      showTaboo,
      tabooOpen,
      editable,
    } = this.props;
    return (
      <View>
        { (tabooOpen || showTaboo || !!tabooSet) && (
          <TabooSetPicker
            open={tabooOpen}
            disabled={!editable}
            tabooSetId={tabooSetId}
            setTabooSet={setTabooSet}
            color={FACTION_DARK_GRADIENTS[
              (investigator ? investigator.faction_code : null) || 'neutral'
            ][0]}
            transparent
          />
        ) }
        <InvestigatorOptionsModule
          investigator={investigator}
          meta={meta}
          setMeta={setMeta}
          editWarning={!!deck.previous_deck}
          disabled={!editable}
        />
      </View>
    );
  }

  _renderHeader = () => {
    const {
      componentId,
      parsedDeck: {
        investigator,
      },
      buttons,
      editable,
      showEditCards,
      width,
    } = this.props;

    return (
      <View style={styles.headerWrapper}>
        <View style={[styles.kraken, { width: width * 2, top: -width / 3, left: -width * 0.75 }]}>
          <AppIcon
            name="kraken"
            size={width}
            color={COLORS.veryLightGray}
          />
        </View>
        <View style={styles.headerBlock}>

          { this.renderProblem() }
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={this._showInvestigator}>
                <View style={styles.image}>
                  <InvestigatorImage
                    card={investigator}
                    componentId={componentId}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.metadata}>
                { this.renderInvestigatorStats() }
                { editable && (
                  <View style={styles.buttonContainer}>
                    <Button
                      title={t`Edit Cards`}
                      onPress={showEditCards}
                    />
                  </View>
                ) }
              </View>
            </View>
          </View>
          { this.renderInvestigatorOptions() }
          { buttons }
        </View>
      </View>
    );
  };

  _renderFooter = () => {
    const {
      campaign,
      investigatorDataUpdates,
      componentId,
      deck,
      cards,
      isPrivate,
      showTraumaDialog,
      xpAdjustment,
      fontScale,
      showDeckUpgrade,
      editable,
    } = this.props;
    return (
      <DeckProgressModule
        componentId={componentId}
        fontScale={fontScale}
        cards={cards}
        deck={deck}
        parsedDeck={this.props.parsedDeck}
        editable={editable}
        isPrivate={isPrivate}
        campaign={campaign}
        showTraumaDialog={showTraumaDialog}
        showDeckUpgrade={showDeckUpgrade}
        investigatorDataUpdates={investigatorDataUpdates}
        xpAdjustment={xpAdjustment}
      />
    );
  };

  render() {
    const sections = this.data();
    return (
      <SectionList
        ListHeaderComponent={this._renderHeader}
        ListFooterComponent={this._renderFooter}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        initialNumToRender={25}
        renderItem={this._renderCard}
        keyExtractor={this._keyForCard}
        renderSectionHeader={this._renderSectionHeader}
        sections={sections}
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: s,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerWrapper: {
    position: 'relative',
  },
  kraken: {
    position: 'absolute',
    top: -50,
  },
  metadata: {
    flexDirection: 'column',
    flex: 1,
    maxWidth: 300,
  },
  image: {
    marginRight: s,
  },
  container: {
    marginLeft: s,
    marginRight: s,
  },
  buttonContainer: {
    marginTop: s,
  },
  problemBox: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: s,
    paddingLeft: s,
  },
  headerBlock: {
    paddingBottom: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    position: 'relative',
  },
  skillRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
