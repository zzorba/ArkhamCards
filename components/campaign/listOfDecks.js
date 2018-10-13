import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import withPlayerCards from '../withPlayerCards';

export default function listOfDecks(DeckComponent) {
  class DeckListerComponent extends React.Component {
    static propTypes = {
      componentId: PropTypes.string.isRequired,
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
        deckIds,
        deckAdded,
        campaignId,
      } = this.props;
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'Dialog.DeckSelector',
              passProps: {
                campaignId: campaignId,
                onDeckSelect: deckAdded,
                selectedDeckIds: deckIds,
              },
            },
          }],
        },
      });
    }

    render() {
      const {
        componentId,
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
              componentId={componentId}
              id={deckId}
              cards={cards}
              investigators={investigators}
              remove={deckRemoved}
              {...otherProps}
            />
          )) }
          { !!deckAdded && (
            <View style={styles.button}>
              <Button title={L('Add Investigator')} onPress={this._showDeckSelector} />
            </View>
          ) }
        </View>
      );
    }
  }

  const result = withPlayerCards(DeckListerComponent);
  hoistNonReactStatic(result, DeckComponent);
  return result;
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
