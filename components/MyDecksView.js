import React from 'react';
import PropTypes from 'prop-types';

import { iconsMap } from '../app/NavIcons';

import MyDecksComponent from './MyDecksComponent';

export default class MyDecksView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this._deckNavClicked = this.deckNavClicked.bind(this);
    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.add,
          id: 'add',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        navigator.push({
          screen: 'Deck.New',
        });
      }
    }
  }

  deckNavClicked(id) {
    this.props.navigator.push({
      screen: 'Deck',
      passProps: {
        id: id,
      },
      navigatorStyle: {
        tabBarHidden: true,
      },
    });
  }

  render() {
    return (
      <MyDecksComponent
        navigator={this.props.navigator}
        deckClicked={this._deckNavClicked}
      />
    );
  }
}
