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

import * as Actions from '../actions';
import { syncCards } from '../lib/api';

/**
 * Simple component to block children rendering until cards/packs are loaded.
 */
class FetchCardsGate extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    cardCount: PropTypes.number,
    packs: PropTypes.array,
    fetchPacks: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loadingCards: false,
    };
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

  render() {
    const {
      loading,
      children,
    } = this.props;
    const {
      loadingCards,
      deckIds,
    } = this.state;
    if (loading || loadingCards) {
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

    return children;
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
  connect(mapStateToProps, mapDispatchToProps)(FetchCardsGate),
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
