import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { filter, find, map, reverse, partition, sortBy, sumBy, shuffle, flatMap, uniq } from 'lodash';
import { connect } from 'react-redux';
import { t, ngettext, msgid } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CardTextComponent from '@components/card/CardTextComponent';
import CardUpgradeOption from './CardUpgradeOption';
import DeckProblemRow from '@components/core/DeckProblemRow';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import CardDetailComponent from '@components/card/CardDetailView/CardDetailComponent';
import { Deck, DeckMeta, ParsedDeck, Slots } from '@actions/types';
import DeckValidation from '@lib/DeckValidation';
import Card, { CardsMap } from '@data/Card';
import COLORS from '@styles/colors';
import { NavigationProps } from '@components/nav/types';
import space, { m, s, xs } from '@styles/space';
import DeckNavFooter from '../../DeckNavFooter';
import { parseDeck } from '@lib/parseDeck';
import {
  getPacksInCollection,
  AppState,
} from '@reducers';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { PARALLEL_SKIDS_CODE, SHREWD_ANALYSIS_CODE, UNIDENTIFIED_UNTRANSLATED } from '@app_constants';
import ArkhamButton from '@components/core/ArkhamButton';
import CardSearchResult from '@components/cardlist/CardSearchResult';

export interface CardUpgradeDialogProps {
  componentId: string;
  card?: Card;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  ignoreDeckLimitSlots: Slots;
  investigator: Card;
  meta: DeckMeta;
  parsedDeck: ParsedDeck;
  previousDeck?: Deck;
  slots?: Slots;
  tabooSetId?: number;
  updateSlots: (slots: Slots) => void;
  updateIgnoreDeckLimitSlots: (slots: Slots) => void;
  updateXpAdjustment: (xpAdjustment: number) => void;
  xpAdjustment: number;
}

interface ReduxProps {
  inCollection: {
    [pack_code: string]: boolean;
  };
}

interface State {
  parsedDeck: ParsedDeck;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  xpAdjustment: number;
  showNonCollection: boolean;
  shrewdAnalysisResults: string[];
}

type Props = CardUpgradeDialogProps & ReduxProps & NavigationProps & DimensionsProps;

class CardUpgradeDialog extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      parsedDeck: props.parsedDeck,
      slots: props.slots || {},
      ignoreDeckLimitSlots: props.ignoreDeckLimitSlots,
      xpAdjustment: props.xpAdjustment,
      showNonCollection: false,
      shrewdAnalysisResults: [],
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }

  _onIncrementIgnore = (code: string) => {
    const {
      updateIgnoreDeckLimitSlots,
    } = this.props;
    const {
      slots,
      ignoreDeckLimitSlots,
    } = this.state;

    const newSlots: Slots = {
      ...ignoreDeckLimitSlots,
      [code]: (ignoreDeckLimitSlots[code] || 0) + 1,
    };

    const parsedDeck = this.updateXp(slots, newSlots);
    this.setState({
      ignoreDeckLimitSlots: newSlots,
      parsedDeck: parsedDeck || this.state.parsedDeck,
    });

    updateIgnoreDeckLimitSlots(newSlots);
  };

  _onDecrementIgnore = (code: string) => {
    const {
      updateIgnoreDeckLimitSlots,
    } = this.props;
    const {
      slots,
      ignoreDeckLimitSlots,
    } = this.state;

    const newSlots: Slots = {
      ...ignoreDeckLimitSlots,
      [code]: (ignoreDeckLimitSlots[code] || 0) - 1,
    };

    if (newSlots[code] <= 0) {
      delete newSlots[code];
    }

    const parsedDeck = this.updateXp(slots, newSlots);
    this.setState({
      ignoreDeckLimitSlots: newSlots,
      parsedDeck: parsedDeck || this.state.parsedDeck,
    });

    updateIgnoreDeckLimitSlots(newSlots);
  };

  _onIncrement = (code: string) => {
    const {
      cards,
      updateSlots,
    } = this.props;
    const {
      slots,
      ignoreDeckLimitSlots,
    } = this.state;

    const newSlots: Slots = {
      ...slots,
      [code]: (slots[code] || 0) + 1,
    };

    const possibleDecrement = find(reverse(this.namedCards()), card => {
      return (
        card.code !== code && newSlots[card.code] > 0 &&
        (ignoreDeckLimitSlots[card.code] || 0) < newSlots[card.code] &&
        (card.xp || 0) < (cards[code]?.xp || 0)
      );
    });

    if (possibleDecrement) {
      newSlots[possibleDecrement.code]--;
      if (newSlots[possibleDecrement.code] <= 0) {
        delete newSlots[possibleDecrement.code];
      }
    }

    const parsedDeck = this.updateXp(newSlots, ignoreDeckLimitSlots);
    this.setState({
      slots: newSlots,
      parsedDeck: parsedDeck || this.state.parsedDeck,
    });

    updateSlots(newSlots);
  };

  _onDecrement = (code: string) => {
    const {
      updateSlots,
    } = this.props;
    const {
      slots,
      ignoreDeckLimitSlots,
    } = this.state;

    const newSlots: Slots = {
      ...slots,
      [code]: (slots[code] || 0) - 1,
    };

    if (newSlots[code] <= 0) {
      delete newSlots[code];
    }

    const parsedDeck = this.updateXp(newSlots, ignoreDeckLimitSlots);

    this.setState({
      slots: newSlots,
      parsedDeck: parsedDeck || this.state.parsedDeck,
    });

    updateSlots(newSlots);
  };

  namedCards() {
    const {
      card,
      cardsByName,
      investigator,
      meta,
    } = this.props;
    const {
      slots,
    } = this.state;
    const validation = new DeckValidation(investigator, slots, meta);
    return sortBy(
      filter((card && cardsByName[card.real_name]) || [],
        card => validation.canIncludeCard(card, false)),
      card => card.xp || 0
    );
  }

  overLimit(slots: Slots) {
    const { ignoreDeckLimitSlots } = this.state;
    const namedCards = this.namedCards();
    const limit = (namedCards && namedCards.length) ?
      (namedCards[0].deck_limit || 2) :
      2;
    return sumBy(namedCards, card => (slots[card.code] || 0) - (ignoreDeckLimitSlots[card.code] || 0)) > limit;
  }

  updateXp(slots: Slots, ignoreDeckLimitSlots: Slots): ParsedDeck | undefined {
    const {
      cards,
      parsedDeck,
      previousDeck,
      meta,
    } = this.props;

    const deck = parsedDeck.deck;
    return parseDeck(
      deck,
      meta,
      slots,
      ignoreDeckLimitSlots || {},
      cards,
      previousDeck
    );
  }

  _showNonCollection = () => {
    this.setState({
      showNonCollection: true,
    });
  };

  inCollection(card: Card): boolean {
    const { inCollection } = this.props;
    const { showNonCollection } = this.state;
    return (
      card.code === 'core' ||
      inCollection[card.pack_code] ||
      showNonCollection
    );
  }


  specialSkidsRule(card: Card, highestLevel: boolean) {
    const { investigator } = this.props;
    return investigator.code === PARALLEL_SKIDS_CODE &&
      card.real_traits_normalized &&
      (card.real_traits_normalized.indexOf('#gambit#') !== -1 || card.real_traits_normalized.indexOf('#fortune#') !== -1) &&
      !highestLevel;
  }

  shrewdAnalysisRule(card: Card) {
    const { slots } = this.state;
    return (slots[SHREWD_ANALYSIS_CODE] > 0) && UNIDENTIFIED_UNTRANSLATED.has(card.code);
  }

  renderCard(card: Card, highestLevel: boolean) {
    const {
      componentId,
      tabooSetId,
      width,
    } = this.props;
    const {
      slots,
      ignoreDeckLimitSlots,
    } = this.state;
    const { borderStyle } = this.context;
    const allowIgnore = this.specialSkidsRule(card, highestLevel);

    return (
      <View style={[styles.column, borderStyle]} key={card.code}>
        <CardUpgradeOption
          key={card.code}
          card={card}
          code={card.code}
          count={slots[card.code] || 0}
          ignoreCount={ignoreDeckLimitSlots[card.code] || 0}
          onIncrement={this._onIncrement}
          onDecrement={this._onDecrement}
          onIgnore={allowIgnore ? {
            onIncrement: this._onIncrementIgnore,
            onDecrement: this._onDecrementIgnore,
          } : undefined}
        />
        <CardDetailComponent
          componentId={componentId}
          card={card}
          showSpoilers
          tabooSetId={tabooSetId}
          width={width}
          simple
        />
      </View>
    );
  }


  _doShrewdAnalysis = () => {
    const { slots, ignoreDeckLimitSlots, xpAdjustment } = this.state;
    const namedCards = this.namedCards();
    const [inCollection] = partition(
      namedCards,
      card => this.inCollection(card) || slots[card.code] > 0);
    const [baseCards, eligibleCards] = partition(inCollection, card => this.shrewdAnalysisRule(card));
    if (eligibleCards.length && baseCards.length) {
      const baseCard = baseCards[0];
      const firstCard = shuffle(eligibleCards)[0];
      const secondCard = shuffle(eligibleCards)[0];
      const xpCost = (firstCard.xp || 0) + (firstCard.extra_xp || 0) - ((baseCard.xp || 0) + (baseCard.extra_xp || 0));
      const {
        updateSlots,
        updateXpAdjustment,
      } = this.props;

      const newSlots: Slots = {
        ...slots,
        [baseCard.code]: (slots[baseCard.code] || 0) - 2,
      };
      if (newSlots[baseCard.code] <= 0) {
        delete newSlots[baseCard.code];
      }
      newSlots[firstCard.code] = (newSlots[firstCard.code] || 0) + 1;
      newSlots[secondCard.code] = (newSlots[secondCard.code] || 0) + 1;
      const parsedDeck = this.updateXp(newSlots, ignoreDeckLimitSlots);
      const newXpAdjustment = xpAdjustment + xpCost;
      this.setState({
        slots: newSlots,
        xpAdjustment: newXpAdjustment,
        shrewdAnalysisResults: [firstCard.code, secondCard.code],
        parsedDeck: parsedDeck || this.state.parsedDeck,
      });

      updateSlots(newSlots);
      updateXpAdjustment(newXpAdjustment);
    }
  };

  _askShrewdAnalysis = () => {
    const { slots } = this.state;
    const namedCards = this.namedCards();
    const [inCollection] = partition(
      namedCards,
      card => this.inCollection(card) || slots[card.code] > 0);
    const [baseCards, eligibleCards] = partition(inCollection, card => this.shrewdAnalysisRule(card));
    if (eligibleCards.length && baseCards.length) {
      const baseCard = baseCards[0];
      const sampleCard = eligibleCards[0];
      const xpCost = (sampleCard.xp || 0) + (sampleCard.extra_xp || 0) - ((baseCard.xp || 0) + (baseCard.extra_xp || 0));
      const upgradeCards = map(eligibleCards, eligibleCards => eligibleCards.subname || eligibleCards.name).join('\n');
      Alert.alert(
        t`Shrewd Analysis Rule`,
        [
          ngettext(
            msgid`This upgrade will cost ${xpCost} experience.`,
            `This upgrade will cost ${xpCost} experience.`,
            xpCost
          ),
          ngettext(
            msgid`Two random cards will be chosen among the following choice:\n\n${upgradeCards}`,
            `Two random cards will be chosen among the following choices:\n\n${upgradeCards}`,
            upgradeCards.length
          ),
          t`You can edit your collection under Settings to adjust the eligible choices.`,
        ].join('\n\n'),
        [
          {
            text: t`Upgrade`,
            onPress: this._doShrewdAnalysis,
          },
          {
            text: t`Cancel`,
            style: 'cancel',
          },
        ]
      );
    }
  };

  shrewdAnalysisResults(): Card[] {
    const { cards } = this.props;
    const { shrewdAnalysisResults } = this.state;
    return flatMap(uniq(shrewdAnalysisResults), code => {
      const card = cards[code];
      return card ? [card] : [];
    });
  }

  renderCards() {
    const { slots } = this.state;
    const { borderStyle, typography } = this.context;
    const namedCards = this.namedCards();
    const shrewdAnalysisResults = this.shrewdAnalysisResults();
    const [inCollection, nonCollection] = partition(
      namedCards,
      card => this.inCollection(card) || slots[card.code] > 0);
    const cards = map(inCollection, card => {
      return {
        card,
        highestLevel: !find(inCollection, c => (c.xp || 0) > (card.xp || 0)),
      };
    });
    const skidsRule = !!find(cards, ({ card, highestLevel }) => this.specialSkidsRule(card, highestLevel));
    const shrewdAnalysisRule = !!find(cards, ({ card }) => this.shrewdAnalysisRule(card) && slots[card.code] >= 2);
    return (
      <>
        { skidsRule && (
          <View style={space.paddingM}>
            <CardTextComponent
              text={t`<b>Additional Options</b>: When you upgrade a [[Fortune]] or [[Gambit]] card, you may instead pay the full experience cost on the higher level version and leave the lower level version in your deck (it does not count towards your deck size or the number of copies of that card in your deck).` }
            />
          </View>
        ) }
        { (shrewdAnalysisRule || !!shrewdAnalysisResults.length) && (
          <>
            <View style={space.paddingM}>
              <CardTextComponent
                text={t`<b>Shrewd Analysis</b>: If you meet the campaign conditions, you may use Shrewd Analysis to choose both upgrades randomly and only pay for one.\n\n<i>Note: the app handles this by adjusting experience to account for the 'free' upgrade.</i>` }
              />
            </View>
            { shrewdAnalysisResults.length ? (
              <>
                <View style={[styles.shrewdAnalysisResults, borderStyle]}>
                  <Text style={[typography.text, typography.light, typography.right, space.paddingS, space.paddingRightM]}>
                    { t`Upgrade results` }
                  </Text>
                </View>
                { map(shrewdAnalysisResults, (card, idx) => <CardSearchResult key={idx} card={card} count={slots[card.code] || 0} />) }
              </>
            ) : (
              <ArkhamButton title={t`Upgrade with Shrewd Analysis`} icon="up" onPress={this._askShrewdAnalysis} />
            ) }
          </>
        ) }
        { map(cards, ({ card, highestLevel }) => this.renderCard(card, highestLevel)) }
        { nonCollection.length > 0 ? (
          <BasicButton
            key="non-collection"
            title={ngettext(
              msgid`Show ${nonCollection.length} non-collection card`,
              `Show ${nonCollection.length} non-collection cards`,
              nonCollection.length
            )}
            onPress={this._showNonCollection}
          />
        ) : null }
      </>
    );
  }

  renderFooter(slots?: Slots, controls?: React.ReactNode) {
    const {
      componentId,
      cards,
      meta,
    } = this.props;
    const {
      parsedDeck,
      xpAdjustment,
    } = this.state;

    if (!parsedDeck) {
      return null;
    }

    return (
      <DeckNavFooter
        componentId={componentId}
        parsedDeck={parsedDeck}
        meta={meta}
        cards={cards}
        xpAdjustment={xpAdjustment}
        controls={controls}
      />
    );
  }

  render() {
    const {
      investigator,
    } = this.props;
    const {
      slots,
    } = this.state;
    const { backgroundStyle } = this.context;
    const overLimit = this.overLimit(slots);

    const isSurvivor = investigator.faction_code === 'survivor';
    return (
      <View
        style={[styles.wrapper, backgroundStyle]}
      >
        <ScrollView
          overScrollMode="never"
          bounces={false}
        >
          { overLimit && (
            <View style={[styles.problemBox,
              { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
            ]}>
              <DeckProblemRow
                problem={{ reason: 'too_many_copies' }}
                color={isSurvivor ? COLORS.black : COLORS.white}
                fontSize={14}
              />
            </View>
          ) }
          { this.renderCards() }
          <View style={styles.footerPadding} />
        </ScrollView>
        { this.renderFooter() }
      </View>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    inCollection: getPacksInCollection(state),
  };
}

export default connect(mapStateToProps)(
  withDimensions(CardUpgradeDialog)
);

const styles = StyleSheet.create({
  column: {
    paddingTop: m,
    paddingBottom: m,
    flexDirection: 'column',
    borderBottomWidth: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  problemBox: {
    flex: 1,
    paddingTop: xs,
    paddingBottom: xs,
    paddingRight: s,
    paddingLeft: s,
  },
  footerPadding: {
    height: m,
  },
  shrewdAnalysisResults: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
