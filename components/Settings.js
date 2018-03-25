import React from 'react';
import { forEach } from 'lodash';
import {
  Button,
  View,
  Text,
} from 'react-native';

import { read, write } from '../data';
import Card from '../data/Card';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      cardCount: '???',
    };

    this._syncCards = this.syncCards.bind(this);
  }

  componentDidMount() {
    read(realm => {
      this.setState({
        cardCount: realm.objects('Card').length,
      });
    });
  }

  syncCards() {
    fetch('https://arkhamdb.com/api/public/cards/?encounter=1',
      { method: 'GET' })
      .then(response => response.json())
      .then(json => {
        write(realm => {
          forEach(json, card => {
            try {
              realm.create('Card', Card.fromJson(card), true);
            } catch (e) {
              console.log(e);
              console.log(card);
            }
          });
        });
      })
      .then(() => {
        read(realm => {
          this.setState({
            cardCount: realm.objects('Card').length,
          });
        });
      })
      .catch(err => this.setState(err.message || err));
  }

  render() {
    return (
      <View>
        <Text>Settings</Text>
        <Text>We have {this.state.cardCount} cards in database</Text>
        <Button onPress={this._syncCards} title="Check for card updates" />
      </View>
    );
  }
}
