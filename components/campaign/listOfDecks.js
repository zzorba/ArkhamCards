import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import Button from '../core/Button';
import withPlayerCards from '../withPlayerCards';
import { COLORS } from '../../styles/colors';
import typography from '../../styles/typography';

export default function listOfDecks(DeckComponent, { deckLimit }) {
  class DeckListerComponent extends React.Component {
    static propTypes = {
      navigator: PropTypes.object.isRequired,
      campaignId: PropTypes.number.isRequired,
      deckIds: PropTypes.array.isRequired,
      deckAdded: PropTypes.func,
      deckRemoved: PropTypes.func,
      label: PropTypes.string,

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
        label,
        investigators,
        ...otherProps
      } = this.props;
      const showAddDeck = !!deckAdded && (!deckLimit || deckIds.length < deckLimit);
      return (
        <View>
          { !!label && (
            <TouchableOpacity
              style={styles.inlineAddButton}
              onPress={this._showDeckSelector}
              disabled={!showAddDeck}
            >
              <View style={styles.row}>
                <Text style={[typography.small, styles.label]}>
                  { label.toUpperCase() }
                </Text>
                { showAddDeck && (
                  <MaterialIcons color={COLORS.lightBlue} name="add" size={28} />
                ) }
              </View>
            </TouchableOpacity>
          ) }
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
          { !label && !!deckAdded && (!deckLimit || deckIds.length < deckLimit) && (
            <View style={styles.addDeckButton}>
              <Button
                align="left"
                text="Add Deck"
                onPress={this._showDeckSelector}
              />
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
  addDeckButton: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 24,
  },
  inlineAddButton: {
    padding: 4,
  },
  label: {
    marginLeft: 8,
  },
});
