import React from 'react';
import { connect } from 'react-redux';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { Deck } from 'actions/types';
import PickerStyleButton from '@components/core/PickerStyleButton';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { showDeckModal } from '@components/nav/helper';
import Card, { CardsMap } from '@data/Card';
import { AppState, getDeck } from '@reducers';
import { parseBasicDeck } from 'lib/parseDeck';

interface OwnProps {
  componentId: string;
  deck: Deck;
  cards: CardsMap;
  investigator: Card;
  fontScale: number;
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
}

interface ReduxProps {
  previousDeck?: Deck;
}

type Props = OwnProps & ReduxProps;

class DeckXpSection extends React.Component<Props> {
  _showDeckUpgrade = () => {
    const {
      investigator,
      deck,
      showDeckUpgrade,
    } = this.props;
    if (deck && showDeckUpgrade) {
      showDeckUpgrade(investigator, deck);
    }
  };

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
    const { deck, investigator, previousDeck, fontScale, cards, showDeckUpgrade } = this.props;
    if (!previousDeck && !showDeckUpgrade) {
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
    if (!changes && !showDeckUpgrade) {
      return null;
    }
    const availableXp = (deck.xp || 0) + (deck.xp_adjustment || 0);
    return (
      <>
        <CardSectionHeader
          fontScale={fontScale}
          investigator={investigator}
          section={{ superTitle: t`Experience points` }}
        />
        { !!changes && (
          <PickerStyleButton
            id="xp"
            title={`${changes.spentXp} of ${availableXp} spent`}
            onPress={this._onPress}
            widget="nav"
            settingsStyle
          />
        ) }
        { !!showDeckUpgrade && (
          <BasicButton
            title={t`Upgrade Deck`}
            onPress={this._showDeckUpgrade}
          />
        ) }
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
