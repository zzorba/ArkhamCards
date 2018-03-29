import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  Button,
  View,
  Text,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import Card from '../data/Card';

class Settings extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      cardCount: props.realm.objects('Card').length,
    };

    this._syncCards = this.syncCards.bind(this);
    this._clearCache = this.clearCache.bind(this);
  }

  clearCache() {
    const {
      realm,
    } = this.props;
    realm.write(() => {
      realm.delete(realm.objects('Card'));
    });
  }

  syncCards() {
    const {
      realm,
    } = this.props;

    fetch('https://arkhamdb.com/api/public/cards/?encounter=1',
      { method: 'GET' })
      .then(response => response.json())
      .then(json => {
        realm.write(() => {
          forEach(json, card => {
            try {
              realm.create('Card', Card.fromJson(card), true);
            } catch (e) {
              console.log(e);
              console.log(card);
            }
          });
        });
        this.setState({
          cardCount: realm.objects('Card').length,
        });
      })
      .catch(err => this.setState(err.message || err));
  }

  render() {
    return (
      <View>
        <Text>Settings</Text>
        <Text>We have { this.state.cardCount } cards in database</Text>
        <Button onPress={this._syncCards} title="Check for card updates" />
        <Button onPress={this._clearCache} title="Clear cache" />
      </View>
    );
  }
}


export default connectRealm(Settings, {
  schemas: ['Card'],
  mapToProps(results, realm) {
    return {
      realm,
      cards: results.cards,
    };
  },
});
