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

import Button from '../core/Button';
import { fetchCards, dismissUpdatePrompt } from './actions';
import typography from '../../styles/typography';

const REFETCH_DAYS = 7;
const REPROMPT_DAYS = 3;
const REFETCH_SECONDS = REFETCH_DAYS * 24 * 60 * 60;
const REPROMPT_SECONDS = REPROMPT_DAYS * 24 * 60 * 60;
/**
 * Simple component to block children rendering until cards/packs are loaded.
 */
class FetchCardsGate extends React.Component {
  static propTypes = {
    // from redux/realm.
    realm: PropTypes.object.isRequired,
    promptForUpdate: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.string,
    lang: PropTypes.string,
    /* eslint-disable react/no-unused-prop-types */
    cardCount: PropTypes.number,
    /* eslint-disable react/no-unused-prop-types */
    fetchNeeded: PropTypes.bool,
    // From redux
    fetchCards: PropTypes.func.isRequired,
    dismissUpdatePrompt: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    dateFetched: PropTypes.number,
    dateUpdatePrompt: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {};

    this._doFetch = this.doFetch.bind(this);
    this._ignoreUpdate = this.ignoreUpdate.bind(this);
  }

  fetchNeeded(props) {
    return props.fetchNeeded || props.cardCount === 0;
  }

  componentDidUpdate(prevProps) {
    if (this.fetchNeeded(this.props) && !this.fetchNeeded(prevProps)) {
      this.doFetch();
    }
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

  ignoreUpdate() {
    const {
      dismissUpdatePrompt,
    } = this.props;
    dismissUpdatePrompt();
  }

  doFetch() {
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    fetchCards(realm, lang);
  }

  componentDidMount() {
    if (this.fetchNeeded(this.props)) {
      this.doFetch();
    } else if (this.props.promptForUpdate && this.updateNeeded()) {
      Alert.alert(
        'Check for updated cards?',
        'It has been more than a week since you checked for new cards.\nCheck for new cards from ArkhamDB?',
        [
          { text: 'Ask me later', onPress: this._ignoreUpdate },
          { text: 'Check for updates', onPress: this._doFetch },
        ],
      );
    }
  }

  render() {
    const {
      loading,
      error,
      children,
    } = this.props;
    if (error) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <Text style={[typography.text, styles.error]}>
            Error loading cards, make sure your network is working.
          </Text>
          <Text style={[typography.text, styles.error]}>
            { error }
          </Text>
          <Button onPress={this._doFetch} text="Try Again" />
        </View>
      );
    }
    const fetchNeeded = this.fetchNeeded(this.props);
    if (loading || fetchNeeded) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <Text style={typography.text}>
            Loading latest cards...
          </Text>
          <ActivityIndicator
            style={styles.spinner}
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
    fetchNeeded: state.packs.all.length === 0,
    lang: state.packs.lang,
    loading: state.packs.loading || state.cards.loading,
    error: state.packs.error || state.cards.error,
    dateFetched: state.packs.dateFetched,
    dateUpdatePrompt: state.packs.dateUpdatePrompt,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCards,
    dismissUpdatePrompt,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(FetchCardsGate,
    {
      schemas: ['Card'],
      mapToProps(results, realm) {
        return {
          realm,
          cardCount: results.cards.length,
        };
      },
    },
  )
);

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spinner: {
    height: 80,
  },
  error: {
    color: 'red',
  },
});
