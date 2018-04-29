import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import { syncCards } from '../../lib/api';
import DeckListComponent from '../DeckListComponent';

class BrowseDecksView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    realm: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    cardCount: PropTypes.number,
    packs: PropTypes.array,
    fetchPacks: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      loadingCards: false,
      deckIds: [
        5168,
        5167,
        4922,
        4946,
        4950,
        4519,
        101,
        381,
        180,
        530,
        2932,
        294,
        1179,
        2381,
        132081,
        137338,
      ],
    };

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

  componentDidMount() {
    const {
      packs,
      fetchPacks,
      cardCount,
      realm,
    } = this.props;
    if (cardCount === 0) {
      setTimeout(() => this.setState({
        loadingCards: true,
      }), 0);
      syncCards(realm).then(() => {
        this.setState({
          loadingCards: false,
        });
      }).catch(err => {
        this.setState({
          loadingCards: false,
          error: err.message || err,
        });
      });
    }

    if (packs.length === 0) {
      fetchPacks();
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
    const {
      loading,
      navigator,
    } = this.props;
    const {
      loadingCards,
      deckIds,
    } = this.state;
    if (loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }
    if (loadingCards) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <Text>Loading latest cards...</Text>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }
    return (
      <DeckListComponent
        navigator={navigator}
        deckIds={deckIds}
        deckClicked={this._deckNavClicked}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.packs.loading,
    packs: state.packs.all,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(BrowseDecksView),
  {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
        cardCount: results.cards.length,
      };
    },
  },
);

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
