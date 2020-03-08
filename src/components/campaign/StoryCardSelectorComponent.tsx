import React from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { flatMap, forEach } from 'lodash';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { t } from 'ttag';

import { scenarioRewards } from 'components/campaign/constants';
import { Deck, Slots } from 'actions/types';
import Card from 'data/Card';
import { getDeck, getTabooSet, AppState } from 'reducers';
import typography from 'styles/typography';
import CardSelectorComponent from '../cardlist/CardSelectorComponent';

interface OwnProps {
  componentId: string;
  deckId: number;
  encounterCodes: string[];
  scenarioName?: string;
  updateStoryCounts: (exileCounts: Slots) => void;
}

interface ReduxProps {
  deck?: Deck;
  tabooSetId?: number;
}

interface RealmProps {
  storyCards: Card[];
  deckStoryCards: Card[];
  deckStorySlots: Slots;
}
type Props = OwnProps & ReduxProps & RealmProps;
interface State {
  storyCounts: Slots;
}

class StoryCardSelectorComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      storyCounts: {
        ...props.deckStorySlots,
      },
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

  renderScenarioStoryCards() {
    const {
      componentId,
      storyCards,
      scenarioName,
    } = this.props;
    const {
      storyCounts,
    } = this.state;
    if (!storyCards.length) {
      return null;
    }

    const header = (
      <Text style={[typography.small, styles.titleText]}>
        { scenarioName ? t`Story cards to add - ${scenarioName}` : t`Story cards to add` }
      </Text>
    );
    const slots: Slots = {};
    forEach(storyCards, card => {
      if (card.code && card.deck_limit) {
        slots[card.code] = card.deck_limit;
      }
    });
    return (
      <React.Fragment>
        <CardSelectorComponent
          componentId={componentId}
          slots={slots}
          counts={storyCounts}
          updateCounts={this._updateStoryCounts}
          header={header}
        />
      </React.Fragment>
    );
  }


  renderDeckStoryCards() {
    const {
      componentId,
      deckStoryCards,
    } = this.props;
    const {
      storyCounts,
    } = this.state;
    if (!deckStoryCards.length) {
      return null;
    }

    const header = (
      <Text style={[typography.small, styles.titleText]}>
        { t`Story Cards - Existing` }
      </Text>
    );
    const slots: Slots = {};
    forEach(deckStoryCards, card => {
      if (card.code && card.deck_limit) {
        slots[card.code] = card.deck_limit;
      }
    });
    return (
      <React.Fragment>
        <CardSelectorComponent
          componentId={componentId}
          slots={slots}
          counts={storyCounts}
          updateCounts={this._updateStoryCounts}
          header={header}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        { this.renderScenarioStoryCards() }
        { this.renderDeckStoryCards() }
      </React.Fragment>
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
)(
  connectRealm<OwnProps & ReduxProps, RealmProps, Card>(
    StoryCardSelectorComponent,
    {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: OwnProps & ReduxProps
      ): RealmProps {
        const allStoryCards = results.cards.filtered(
          `(encounter_code != null AND deck_limit > 0) and ${Card.tabooSetQuery(props.tabooSetId)}`
        ).sorted([['renderName', false], ['xp', false]]);
        const deckStorySlots: Slots = {};
        const storyCards: Card[] = [];
        const deckStoryCards: Card[] = [];
        const encounterCodes = new Set(flatMap(props.encounterCodes, encounterCode => {
          return [
            encounterCode,
            ...scenarioRewards(encounterCode),
          ];
        }));
        forEach(allStoryCards, card => {
          if (props.deck && card.code && props.deck.slots[card.code] > 0) {
            deckStoryCards.push(card);
            deckStorySlots[card.code] = props.deck.slots[card.code];
          } else if (card.encounter_code && encounterCodes.has(card.encounter_code)) {
            storyCards.push(card);
          }
        });
        return {
          storyCards,
          deckStoryCards,
          deckStorySlots,
        };
      },
    })
);

const styles = StyleSheet.create({
  titleText: {
    paddingLeft: 8,
    textTransform: 'uppercase',
  },
});
