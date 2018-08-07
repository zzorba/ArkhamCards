import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Button,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import withPlayerCards from '../withPlayerCards';

export default function listOfDecks(DeckComponent) {
  class DeckListerComponent extends React.Component {
    static propTypes = {
      navigator: PropTypes.object.isRequired,
      campaignId: PropTypes.number.isRequired,
      deckIds: PropTypes.array.isRequired,
      deckAdded: PropTypes.func,
      deckRemoved: PropTypes.func,

      // From realm, not passed in.
      cards: PropTypes.object,
      investigators: PropTypes.object,
    };

    constructor(props) {
      super(props);
      this._showDeckSelector = this.showDeckSelector.bind(this);
    }

    showDeckSelector() {
      const {
        navigator,
        deckIds,
        deckAdded,
        campaignId,
      } = this.props;
      navigator.showModal({
        screen: 'Dialog.DeckSelector',
        passProps: {
          campaignId: campaignId,
          onDeckSelect: deckAdded,
          selectedDeckIds: deckIds,
        },
      });
    }

    render() {
      const {
        navigator,
        deckIds,
        deckAdded,
        deckRemoved,
        cards,
        investigators,
        ...otherProps
      } = this.props;
      return (
        <View>
          { map(deckIds, deckId => (
            <DeckComponent
              key={deckId}
              navigator={navigator}
              id={deckId}
              cards={cards}
              investigators={investigators}
              remove={deckRemoved}
              {...otherProps}
            />
          )) }
          { !!deckAdded && (
            <Button title="Add Investigator" onPress={this._showDeckSelector} />
          ) }
        </View>
      );
    }
  }

  const result = withPlayerCards(DeckListerComponent);
  hoistNonReactStatic(result, DeckComponent);
  return result;
}
