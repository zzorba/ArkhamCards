import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
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

const REFETCH_DAYS = 7;
const REPROMPT_DAYS = 3;
const REFETCH_SECONDS = REFETCH_DAYS * 24 * 60 * 60;
const REPROMPT_SECONDS = REPROMPT_DAYS * 24 * 60 * 60;
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
    dismissUpdatePrompt: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    dateFetched: PropTypes.number,
    dateUpdatePrompt: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      loadingCards: this.fetchNeeded(),
    };

    this._doFetch = this.doFetch.bind(this);
    this._ignoreUpdate = this.ignoreUpdate.bind(this);
    this._fetchCards = this.fetchCards.bind(this);
  }

  fetchNeeded() {
    const {
      packs,
      cardCount,
    } = this.props;
    return (cardCount === 0 || packs.length === 0);
  }

  updateNeeded() {
    const {
      dateFetched,
      dateUpdatePrompt,
    } = this.props;
    const nowSeconds = (new Date()).getTime() / 1000;
    return (
      dateFetched === null ||
      (dateFetched + REFETCH_SECONDS) < nowSeconds
    ) && (
      dateUpdatePrompt === null ||
      (dateUpdatePrompt + REPROMPT_SECONDS) < nowSeconds
    );
  }

  fetchCards(packs) {
    const {
      realm,
    } = this.props;

    syncCards(realm, packs).then(
      () => {
        this.setState({
          loadingCards: false,
        });
      },
      err => {
        this.setState({
          loadingCards: false,
          error: err.message || err,
        });
      }
    );
  }

  ignoreUpdate() {
    const {
      dismissUpdatePrompt,
    } = this.props;
    dismissUpdatePrompt();
  }

  doFetch() {
    const {
      fetchPacks,
    } = this.props;
    if (!this.state.loadingCards) {
      this.setState({
        loadingCards: true,
        error: null,
      });
    }
    fetchPacks(this._fetchCards);
  }

  componentDidMount() {
    if (this.fetchNeeded()) {
      this.doFetch();
    } else if (this.updateNeeded()) {
      Alert.alert(
        'Check for updated cards?',
        'It has been more than a week since you checked for new cards.\nShould we check for updates?',
        [
          { text: 'Ask me later', onPress: this._ignoreUpdate },
          { text: 'OK', onPress: this._doFetch },
        ]
      );
    }
  }

  render() {
    const {
      loading,
      children,
    } = this.props;
    const {
      loadingCards,
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
    dateFetched: state.packs.dateFetched,
    dateUpdatePrompt: state.packs.dateUpdatePrompt,
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
