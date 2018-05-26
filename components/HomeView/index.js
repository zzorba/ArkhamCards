import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import FetchCardsGate from '../FetchCardsGate';
import MenuItem from './MenuItem';

export default class HomeView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };

  render() {
    const {
      navigator,
    } = this.props;
    return (
      <FetchCardsGate>
        <ScrollView>
          <MenuItem navigator={navigator} text="Popular Decks" screen="Browse.Decks" />
          <MenuItem navigator={navigator} text="All Cards" screen="Browse.Cards" />
          <MenuItem navigator={navigator} text="My Campaigns" screen="My.Campaigns" />
          <MenuItem navigator={navigator} text="My Decks" screen="My.Decks" />
          <MenuItem navigator={navigator} text="Settings" screen="Settings" />
        </ScrollView>
      </FetchCardsGate>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
