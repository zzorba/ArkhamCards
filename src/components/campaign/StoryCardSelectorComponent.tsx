import React from 'react';
import { flatMap, forEach } from 'lodash';
import { connect } from 'react-redux';
import { t } from 'ttag';

import Database from '@data/Database';
import DbRender from '@components/data/DbRender';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { scenarioRewards } from '@components/campaign/constants';
import { Deck, Slots } from '@actions/types';
import Card from '@data/Card';
import { PLAYER_CARDS_QUERY, combineQueries, where } from '@data/query';
import { getDeck, getTabooSet, AppState } from '@reducers';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';

interface OwnProps {
  componentId: string;
  investigator: Card;
  fontScale: number;
  deckId: number;
  encounterCodes: string[];
  scenarioName?: string;
  updateStoryCounts: (exileCounts: Slots) => void;
}

interface ReduxProps {
  deck?: Deck;
  tabooSetId?: number;
}

interface StoryCards {
  storyCards: Card[];
  deckStoryCards: Card[];
}
type Props = OwnProps & ReduxProps;
interface State {
  initialized: boolean;
  storyCounts: Slots;
}

class StoryCardSelectorComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      initialized: false,
      storyCounts: {},
    };
  }

  componentDidMount() {
    this.props.updateStoryCounts(this.state.storyCounts);
  }

  _updateStoryCounts = (storyCounts: Slots) => {
    this.setState({
      storyCounts,
    }, () => this.props.updateStoryCounts(storyCounts));
  };

  renderScenarioStoryCards(storyCards: Card[]) {
    const {
      componentId,
      scenarioName,
      investigator,
      fontScale,
    } = this.props;
    const {
      storyCounts,
    } = this.state;
    if (!storyCards.length) {
      return null;
    }

    const header = (
      <CardSectionHeader
        investigator={investigator}
        section={{ superTitle: scenarioName ? t`Story cards to add - ${scenarioName}` : t`Story cards to add` }}
        fontScale={fontScale}
      />
    );
    const slots: Slots = {};
    forEach(storyCards, card => {
      if (card.code && card.deck_limit) {
        slots[card.code] = card.deck_limit;
      }
    });
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={slots}
        counts={storyCounts}
        updateCounts={this._updateStoryCounts}
        header={header}
      />
    );
  }


  renderDeckStoryCards(deckStoryCards: Card[]) {
    const {
      componentId,
      investigator,
      fontScale,
    } = this.props;
    const {
      storyCounts,
    } = this.state;
    if (!deckStoryCards.length) {
      return null;
    }

    const header = (
      <CardSectionHeader
        investigator={investigator}
        section={{ superTitle: t`Story Cards - Existing` }}
        fontScale={fontScale}
      />
    );
    const slots: Slots = {};
    forEach(deckStoryCards, card => {
      if (card.code && card.deck_limit) {
        slots[card.code] = card.deck_limit;
      }
    });
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={slots}
        counts={storyCounts}
        updateCounts={this._updateStoryCounts}
        header={header}
      />
    );
  }

  _render = (storyCards?: StoryCards) => {
    if (!storyCards) {
      return null;
    }
    return (
      <>
        { this.renderScenarioStoryCards(storyCards.storyCards) }
        { this.renderDeckStoryCards(storyCards.deckStoryCards) }
      </>
    );
  };

  _getStoryCards = async(db: Database): Promise<StoryCards> => {
    const {
      deck,
      tabooSetId,
    } = this.props;
    const allStoryCards = await db.getCards(
      combineQueries(
        where('c.encounter_code is not null'),
        [PLAYER_CARDS_QUERY],
        'and'
      ),
      tabooSetId,
      [
        { s: 'c.renderName', direction: 'ASC' },
        { s: 'c.xp', direction: 'ASC' },
      ]
    );
    const deckStorySlots: Slots = {};
    const storyCards: Card[] = [];
    const deckStoryCards: Card[] = [];
    const encounterCodes = new Set(flatMap(this.props.encounterCodes, encounterCode => {
      return [
        encounterCode,
        ...scenarioRewards(encounterCode),
      ];
    }));
    forEach(allStoryCards, card => {
      if (deck && card.code && deck.slots[card.code] > 0) {
        deckStoryCards.push(card);
        deckStorySlots[card.code] = deck.slots[card.code];
      } else if (card.encounter_code && encounterCodes.has(card.encounter_code)) {
        storyCards.push(card);
      }
    });
    if (!this.state.initialized) {
      this.setState({
        initialized: true,
        storyCounts: { ...deckStorySlots },
      });
    }
    return {
      storyCards,
      deckStoryCards,
    };
  };

  render() {
    const { deck } = this.props;
    return (
      <DbRender name="story-cards" getData={this._getStoryCards} ids={[deck && deck.slots]}>
        { this._render }
      </DbRender>
    );
  }
}


function mapStateToProps(
  state: AppState,
  props: OwnProps
): ReduxProps {
  return {
    deck: getDeck(state, props.deckId) || undefined,
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, OwnProps, AppState>(
  mapStateToProps
)(StoryCardSelectorComponent);
