import React from 'react';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Deck } from 'actions/types';
import NavButton from 'components/core/NavButton';
import CardSectionHeader from 'components/core/CardSectionHeader';
import { showDeckModal } from 'components/nav/helper';
import Card, { CardsMap } from 'data/Card';
import { AppState, getDeck } from 'reducers';
import { parseBasicDeck } from 'lib/parseDeck';

interface OwnProps {
  componentId: string;
  deck: Deck;
  cards: CardsMap;
  investigator: Card;
  fontScale: number;
}

interface ReduxProps {
  previousDeck?: Deck;
}

type Props = OwnProps & ReduxProps;

class DeckXpSection extends React.Component<Props> {
  _onPress = () => {
    const { componentId, deck, investigator } = this.props;
    showDeckModal(
      componentId,
      deck,
      investigator,
      undefined,
      true
    );
  };

  render() {
    const { deck, investigator, previousDeck, fontScale, cards } = this.props;
    if (!previousDeck) {
      return null;
    }
    const parsedDeck = parseBasicDeck(
      deck,
      cards,
      previousDeck
    );
    if (!parsedDeck) {
      return null;
    }
    const { changes } = parsedDeck;
    if (!changes) {
      return null;
    }
    const availableXp = (deck.xp || 0) + (deck.xp_adjustment || 0);
    const xpLine = `${changes.spentXp} of ${availableXp} spent`;
    return (
      <>
        <CardSectionHeader
          fontScale={fontScale}
          investigator={investigator}
          section={{ superTitle: t`Experience points` }}
        />
        <NavButton
          fontScale={fontScale}
          text={xpLine}
          onPress={this._onPress}
        />
      </>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const previousDeck = (
    props.deck.previous_deck &&
    getDeck(state, props.deck.previous_deck)
  ) || undefined;
  return {
    previousDeck,
  };
}

export default connect(mapStateToProps)(DeckXpSection);
