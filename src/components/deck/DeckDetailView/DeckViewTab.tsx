import React, { ReactNode } from 'react';
import { filter, find, flatMap, forEach, map, sum, sumBy, uniqBy } from 'lodash';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from 'ttag';

import Switch from 'components/core/Switch';
import PickerStyleButton from 'components/core/PickerStyleButton';
import {
  Campaign,
  CardId,
  Deck,
  DeckMeta,
  DeckProblem,
  InvestigatorData,
  ParsedDeck,
  SplitCards,
  Slots,
  Trauma,
} from 'actions/types';
import { showCard, showCardSwipe } from 'components/nav/helper';
import DeckProblemRow from 'components/core/DeckProblemRow';
import CardTabooTextBlock from 'components/card/CardTabooTextBlock';
import AppIcon from 'icons/AppIcon';
import InvestigatorImage from 'components/core/InvestigatorImage';
import CardTextComponent from 'components/card/CardTextComponent';
import DeckProgressComponent from '../DeckProgressComponent';
import InvestigatorOptionsModule from './InvestigatorOptionsModule';
import CardSectionHeader, { CardSectionHeaderData } from 'components/core/CardSectionHeader';
import TabooSetPicker from 'components/core/TabooSetPicker';
import CardSearchResult from 'components/cardlist/CardSearchResult';
import InvestigatorStatLine from 'components/core/InvestigatorStatLine';
import HealthSanityLine from 'components/core/HealthSanityLine';
import { BODY_OF_A_YITHIAN } from 'constants';
import DeckValidation from 'lib/DeckValidation';
import Card, { CardsMap } from 'data/Card';
import TabooSet from 'data/TabooSet';
import COLORS from 'styles/colors';
import { isBig, m, s, xs } from 'styles/space';
import typography from 'styles/typography';

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
  validation: DeckValidation,
  inCollection: { [pack_code: string]: boolean }
): boolean {
  const card = cards[code];
  return !!(
    card &&
    card.has_upgrades &&
    find(cardsByName[card.real_name] || [], upgradeCard => (
      upgradeCard &&
      upgradeCard.code !== code &&
      validation.canIncludeCard(upgradeCard, false) &&
      (upgradeCard.pack_code === 'core' || inCollection[upgradeCard.pack_code])
    )));
}

function deckToSections(
  halfDeck: SplitCards,
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation,
  special: boolean,
  inCollection: { [pack_code: string]: boolean },
  limitedSlots: boolean
): CardSection[] {
  const result: CardSection[] = [];
  if (halfDeck.Assets) {
    const assets = flatMap(halfDeck.Assets, subAssets => {
      const data = filter(subAssets.data, c => !limitedSlots || c.limited);
      if (!data.length) {
        return [];
      }
      return {
        ...subAssets,
        data,
      };
    });
    const assetCount = sumBy(
      assets,
      subAssets => sum(subAssets.data.map(c => c.quantity))
    );
    if (assetCount > 0) {
      result.push({
        id: `assets${special ? '-special' : ''}`,
        title: t`Assets (${assetCount})`,
        data: [],
      });
    }
    forEach(assets, (subAssets, idx) => {
      result.push({
        id: `asset${special ? '-special' : ''}-${idx}`,
        subTitle: subAssets.type,
        data: map(subAssets.data, c => {
          return {
            ...c,
            special,
            hasUpgrades: hasUpgrades(
              c.id,
              cards,
              cardsByName,
              validation,
              inCollection
            ),
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
      const cardIds = filter(cardSplitGroup, c => !limitedSlots || c.limited);
      if (!cardIds.length) {
        return;
      }
      const count = sumBy(cardIds, c => c.quantity);
      result.push({
        id: `${localizedName}-${special ? '-special' : ''}`,
        title: `${localizedName} (${count})`,
        data: map(cardIds, c => {
          return {
            ...c,
            special,
            hasUpgrades: hasUpgrades(
              c.id,
              cards,
              cardsByName,
              validation,
              inCollection
            ),
          };
        }),
      });
    }
  });
  if (!special && result.length === 0) {
    result.push({
      id: 'cards-placeholder',
      placeholder: true,
      data: [],
    });
  }
  return result;
}


function bondedSections(
  slots: Slots,
  cards: CardsMap,
  bondedCardsByName: { [name: string]: Card[] }
): CardSection[] {
  const bondedCards: Card[] = [];
  forEach(slots, (count, code) => {
    const card = cards[code];
    if (count > 0 && card) {
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
  const uniqBondedCards = uniqBy(bondedCards, c => c.code);
  const count = sumBy(uniqBondedCards, card => card.quantity || 0);
  return [{
    id: 'bonded-cards',
    title: t`Bonded Cards (${count})`,
    data: map(uniqBondedCards, c => {
      return {
        id: c.code,
        quantity: c.quantity || 0,
        special: true,
        hasUpgrades: false,
        limited: false,
        invalid: false,
      };
    }),
  }];
}

interface Props {
  componentId: string;
  fontScale: number;
  deck: Deck;
  parallelInvestigators: Card[];
  hideCampaign?: boolean;
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
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  showEditCards: () => void;
  showDeckUpgrade: () => void;
  showDeckHistory: () => void;
  width: number;
  inCollection: {
    [pack_code: string]: boolean;
  };
}

interface State {
  limitedSlots: boolean;
}

export default class DeckViewTab extends React.Component<Props, State> {
  state: State = {
    limitedSlots: false,
  };

  _keyForCard = (item: SectionCardId) => {
    return item.id;
  };

  investigatorFront() {
    const {
      deck,
      cards,
      meta,
      parallelInvestigators,
    } = this.props;
    const altFront = meta.alternate_front && find(
      parallelInvestigators,
      card => card.code === meta.alternate_front);
    return altFront || cards[deck.investigator_code];
  }

  investigatorBack() {
    const {
      parsedDeck: {
        investigator,
      },
      meta,
      parallelInvestigators,
    } = this.props;
    const altFront = meta.alternate_back && find(
      parallelInvestigators,
      card => card.code === meta.alternate_back);
    return altFront || investigator;
  }

  _showInvestigator = () => {
    const {
      componentId,
      tabooSetId,
    } = this.props;
    const investigator = this.investigatorFront();
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
        slots,
      },
      renderFooter,
      onDeckCountChange,
      singleCardView,
    } = this.props;
    const investigator = this.investigatorFront();
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
      renderFooter
    );
  };

  _renderSectionHeader = ({ section }: {
    section: SectionListData<SectionCardId>;
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

  _renderCard = ({ item, index, section }: SectionListRenderItemInfo<SectionCardId>) => {
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
        invalid={item.invalid}
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
        slots,
      },
      meta,
      showEditCards,
      showEditSpecial,
      cards,
      cardsByName,
      bondedCardsByName,
      inCollection,
      editable,
    } = this.props;
    const { limitedSlots } = this.state;
    const investigator = this.investigatorBack();
    const validation = new DeckValidation(investigator, slots, meta);
    return [
      {
        id: 'cards',
        superTitle: t`Deck Cards`,
        data: [],
        onPress: editable ? showEditCards : undefined,
      },
      ...deckToSections(
        normalCards,
        cards,
        cardsByName,
        validation,
        false,
        inCollection,
        limitedSlots
      ), {
        id: 'special',
        superTitle: t`Special Cards`,
        data: [],
        onPress: showEditSpecial,
      },
      ...deckToSections(
        specialCards,
        cards,
        cardsByName,
        validation,
        true,
        inCollection,
        limitedSlots
      ),
      ...(limitedSlots ? [] : bondedSections(slots, cards, bondedCardsByName)),
    ];
  }

  renderAvailableExperienceButton() {
    const {
      parsedDeck: {
        changes,
      },
      deck,
      showEditNameDialog,
      xpAdjustment,
      editable,
    } = this.props;
    if (!changes) {
      return null;
    }
    const adjustedXp = (deck.xp || 0) + xpAdjustment;
    return (
      <PickerStyleButton
        id="xp"
        title={t`Experience`}
        value={t`${changes.spentXp} of ${adjustedXp}`}
        disabled={!editable}
        onPress={showEditNameDialog}
        colors={{
          backgroundColor: 'transparent',
          textColor: COLORS.darkText,
        }}
        widget="nav"
        noBorder
        settingsStyle
      />
    );
  }

  _toggleLimitedSlots = () => {
    this.setState(state => {
      return {
        limitedSlots: !state.limitedSlots,
      };
    });
  };

  renderInvestigatorOptions() {
    const {
      parsedDeck: {
        investigator,
        limitedSlots,
      },
      parallelInvestigators,
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
      <View style={styles.optionsContainer}>
        { (tabooOpen || showTaboo || !!tabooSet) && (
          <TabooSetPicker
            open={tabooOpen}
            disabled={!editable}
            tabooSetId={tabooSetId}
            setTabooSet={setTabooSet}
            color={COLORS.faction[
              investigator ? investigator.factionCode() : 'neutral'
            ].darkBackground}
            transparent
          />
        ) }
        <InvestigatorOptionsModule
          investigator={investigator}
          meta={meta}
          parallelInvestigators={parallelInvestigators}
          setMeta={setMeta}
          editWarning={!!deck.previous_deck}
          disabled={!editable}
        />
        { this.renderAvailableExperienceButton() }
        { limitedSlots && (
          <View style={styles.toggleRow}>
            <Text style={typography.label}>
              { t`Show limited splash` }
            </Text>
            <Switch
              value={this.state.limitedSlots}
              onValueChange={this._toggleLimitedSlots}
            />
          </View>
        ) }
      </View>
    );
  }

  renderInvestigatorBlock() {
    const {
      componentId,
      parsedDeck: {
        slots,
      },
      fontScale,
      cards,
    } = this.props;
    const investigator = (
      (slots[BODY_OF_A_YITHIAN] || 0) > 0 ?
        cards[BODY_OF_A_YITHIAN] :
        undefined
    ) || this.investigatorFront();

    return (
      <View style={styles.column}>
        <TouchableOpacity onPress={this._showInvestigator}>
          <View>
            <View style={styles.header}>
              <View style={styles.headerTextColumn}>
                <InvestigatorStatLine
                  fontScale={fontScale}
                  investigator={investigator}
                />
                { !!investigator.text && (
                  <View style={[styles.gameTextBlock, styles.headerLeftMargin]}>
                    <CardTextComponent
                      text={investigator.text}
                    />
                  </View>
                ) }
              </View>
              <View style={[styles.headerColumn, styles.headerLeftMargin]}>
                <View style={styles.image}>
                  <InvestigatorImage
                    card={investigator}
                    componentId={componentId}
                    yithian={(slots[BODY_OF_A_YITHIAN] || 0) > 0}
                    border
                  />
                </View>
                <HealthSanityLine
                  investigator={investigator}
                  fontScale={fontScale}
                />
              </View>
            </View>
          </View>
          <View style={styles.headerLeftMargin}>
            <CardTabooTextBlock card={investigator} fontScale={fontScale} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderHeader = () => {
    const {
      buttons,
      width,
    } = this.props;

    return (
      <View style={styles.headerWrapper}>
        <View style={[styles.kraken, { width: width * 2, top: -width / 3, left: -width * 0.75 }]}>
          <AppIcon
            name="kraken"
            size={width}
            color={COLORS.veryVeryLightBackgound}
          />
        </View>
        <View style={styles.headerBlock}>
          { this.renderProblem() }
          <View style={styles.containerWrapper}>
            <View style={styles.container}>
              { this.renderInvestigatorBlock() }
            </View>
            { this.renderInvestigatorOptions() }
          </View>
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
      showDeckHistory,
      editable,
      parsedDeck,
      tabooSetId,
      renderFooter,
      onDeckCountChange,
      singleCardView,
      hideCampaign,
    } = this.props;
    return (
      <DeckProgressComponent
        componentId={componentId}
        fontScale={fontScale}
        cards={cards}
        deck={deck}
        parsedDeck={parsedDeck}
        editable={editable}
        isPrivate={isPrivate}
        campaign={campaign}
        hideCampaign={hideCampaign}
        showTraumaDialog={showTraumaDialog}
        showDeckUpgrade={showDeckUpgrade}
        showDeckHistory={showDeckHistory}
        investigatorDataUpdates={investigatorDataUpdates}
        xpAdjustment={xpAdjustment}
        tabooSetId={tabooSetId}
        renderFooter={renderFooter}
        onDeckCountChange={onDeckCountChange}
        singleCardView={singleCardView}
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
        initialNumToRender={50}
        renderItem={this._renderCard}
        keyExtractor={this._keyForCard}
        renderSectionHeader={this._renderSectionHeader}
        sections={sections}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerLeftMargin: {
    marginLeft: xs,
  },
  header: {
    marginTop: m,
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerTextColumn: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    marginBottom: xs,
  },
  headerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: s,
  },
  headerWrapper: {
    position: 'relative',
  },
  kraken: {
    position: 'absolute',
    top: -50,
  },
  column: {
    flex: 1,
  },
  containerWrapper: {
    flexDirection: isBig ? 'row' : 'column',
  },
  container: {
    marginLeft: s,
    marginRight: s,
    flexDirection: 'row',
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  problemBox: {
    flex: 1,
    paddingTop: xs,
    paddingBottom: xs,
    paddingRight: s,
    paddingLeft: s,
  },
  headerBlock: {
    paddingBottom: s,
    position: 'relative',
  },
  gameTextBlock: {
    paddingLeft: xs,
    marginBottom: s,
    marginRight: s,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s,
    paddingLeft: m,
    paddingRight: m,
  },
});
