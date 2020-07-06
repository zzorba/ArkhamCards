import React from 'react';
import { Brackets } from 'typeorm/browser';

import { Deck, DeckMeta, Slots } from 'actions/types';
import { VERSATILE_CODE, ON_YOUR_OWN_CODE } from 'app_constants';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import CardSearchComponent from 'components/cardlist/CardSearchComponent';
import QueryProvider from 'components/data/QueryProvider';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { queryForInvestigator, negativeQueryForInvestigator } from 'lib/InvestigatorRequirements';
import FilterBuilder, { defaultFilterState } from 'lib/filters';
import { STORY_CARDS_QUERY, ON_YOUR_OWN_RESTRICTION, where, combineQueries } from 'data/query';
import Card from 'data/Card';
import { parseDeck } from 'lib/parseDeck';
import DeckNavFooter from '../DeckNavFooter';
import { NavigationProps } from 'components/nav/types';

export interface EditDeckProps {
  deck: Deck;
  previousDeck?: Deck;
  tabooSetId?: number;
  xpAdjustment?: number;
  storyOnly?: boolean;
  slots: Slots;
  meta: DeckMeta;
  ignoreDeckLimitSlots: Slots;
  updateSlots: (slots: Slots) => void;
}

type Props = NavigationProps & EditDeckProps & PlayerCardProps & DimensionsProps;

interface State {
  deckCardCounts: Slots;
  slots: Slots;
}

interface QueryProps {
  meta: DeckMeta;
  storyOnly?: boolean;
  versatile: boolean;
  onYourOwn: boolean;
  investigator: Card;
}

class DeckEditView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      deckCardCounts: props.slots || {},
      slots: props.slots,
    };
  }

  investigator(): Card | undefined {
    const {
      deck,
      meta,
      investigators,
    } = this.props;
    const investigator_code = meta?.alternate_back || deck?.investigator_code;
    return investigator_code ? investigators[investigator_code] : undefined;
  }

  _syncDeckCardCounts = () => {
    this.props.updateSlots(this.state.deckCardCounts);
  };

  componentDidUpdate(prevProps: Props) {
    const {
      slots,
    } = this.props;
    if (slots !== prevProps.slots) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        deckCardCounts: slots,
      });
    }
  }

  _onDeckCountChange = (code: string, count: number) => {
    const newSlots = Object.assign(
      {},
      this.state.deckCardCounts,
      { [code]: count },
    );
    if (count === 0) {
      delete newSlots[code];
    }
    this.setState({
      deckCardCounts: newSlots,
    }, this._syncDeckCardCounts);
  };

  _renderFooter = (updatedDeckCardCounts?: Slots, controls?: React.ReactNode) => {
    const {
      componentId,
      deck,
      ignoreDeckLimitSlots,
      previousDeck,
      cards,
      xpAdjustment,
      meta,
      fontScale,
    } = this.props;
    const deckCardCounts = updatedDeckCardCounts || this.state.deckCardCounts;
    const pDeck = parseDeck(
      deck,
      meta,
      deckCardCounts,
      ignoreDeckLimitSlots,
      cards,
      previousDeck
    );
    if (!pDeck) {
      return null;
    }
    return (
      <DeckNavFooter
        componentId={componentId}
        fontScale={fontScale}
        meta={meta}
        parsedDeck={pDeck}
        cards={cards}
        xpAdjustment={xpAdjustment || 0}
        controls={controls}
      />
    );
  }

  static baseQuery({
    meta,
    storyOnly,
    versatile,
    onYourOwn,
    investigator,
  }: QueryProps): Brackets {
    if (storyOnly) {
      return combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code != 'basicweakness'`)],
        'and'
      );
    }
    const investigatorPart = queryForInvestigator(investigator, meta);
    const parts: Brackets[] = [
      ...(investigatorPart ? [investigatorPart] : []),
    ];
    if (versatile) {
      const versatileQuery = new FilterBuilder('versatile').filterToQuery({
        ...defaultFilterState,
        factions: ['guardian', 'seeker', 'rogue', 'mystic', 'survivor'],
        level: [0, 0],
        levelEnabled: true,
      });
      if (versatileQuery) {
        const invertedClause = negativeQueryForInvestigator(investigator, meta);
        if (invertedClause) {
          parts.push(
            new Brackets(qb => qb.where(invertedClause).andWhere(versatileQuery))
          );
        } else {
          parts.push(versatileQuery);
        }
      }
    }
    const joinedQuery = combineQueries(
      STORY_CARDS_QUERY,
      parts,
      'or'
    );
    if (onYourOwn) {
      return combineQueries(joinedQuery, [ON_YOUR_OWN_RESTRICTION], 'and');
    }
    return joinedQuery;
  }

  render() {
    const {
      componentId,
      tabooSetId,
      deck,
      storyOnly,
      meta,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    const investigator = this.investigator();
    if (!investigator) {
      return null;
    }
    return (
      <QueryProvider<QueryProps, Brackets>
        meta={meta}
        storyOnly={storyOnly}
        investigator={investigator}
        versatile={deckCardCounts[VERSATILE_CODE] > 0}
        onYourOwn={deckCardCounts[ON_YOUR_OWN_CODE] > 0}
        getQuery={DeckEditView.baseQuery}
      >
        { query => (
          <CardSearchComponent
            componentId={componentId}
            tabooSetOverride={tabooSetId}
            baseQuery={query}
            originalDeckSlots={deck.slots}
            investigator={investigator}
            deckCardCounts={deckCardCounts}
            onDeckCountChange={this._onDeckCountChange}
            renderFooter={this._renderFooter}
            storyOnly={storyOnly}
            modal
          />
        ) }
      </QueryProvider>
    );
  }
}

export default withPlayerCards<NavigationProps & EditDeckProps>(
  withDimensions(DeckEditView)
);
