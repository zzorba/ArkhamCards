import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AddDeckRow from './AddDeckRow';
import DeckRow from './DeckRow';
import typography from '../../styles/typography';

export default function SelectedDeckListComponent({
  navigator,
  deckIds,
  deckUpdates = {},
  deckUpdatesChanged,
  deckAdded,
  deckRemoved,
}) {
  return (
    <View>
      <Text style={[typography.bigLabel, styles.margin]}>
        Investigators
      </Text>
      { map(deckIds, deckId => (
        <DeckRow
          key={deckId}
          id={deckId}
          navigator={navigator}
          updatesChanged={deckUpdatesChanged}
          remove={deckRemoved}
          updates={deckUpdates[deckId] || {}}
        />
      )) }
      { deckIds.length < 4 && (
        <AddDeckRow
          navigator={navigator}
          deckAdded={deckAdded}
          selectedDeckIds={deckIds}
        />
      ) }
    </View>
  );
}

SelectedDeckListComponent.propTypes = {
  navigator: PropTypes.object.isRequired,
  deckUpdatesChanged: PropTypes.func,
  deckRemoved: PropTypes.func.isRequired,
  deckAdded: PropTypes.func.isRequired,
  deckIds: PropTypes.array.isRequired,
  deckUpdates: PropTypes.object,
};

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
});
