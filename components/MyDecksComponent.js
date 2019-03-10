import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { filter } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import withNetworkStatus from './core/withNetworkStatus';
import * as Actions from '../actions';
import L from '../app/i18n';
import DeckListComponent from './DeckListComponent';
import withLoginState from './withLoginState';
import { COLORS } from '../styles/colors';
import typography from '../styles/typography';
import space from '../styles/space';
import { getAllDecks, getMyDecksState, getDeckToCampaignMap } from '../reducers';

class MyDecksComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    deckClicked: PropTypes.func.isRequired,
    onlyDeckIds: PropTypes.array,
    filterDeckIds: PropTypes.array,
    filterInvestigators: PropTypes.array,
    refreshMyDecks: PropTypes.func.isRequired,
    decks: PropTypes.object,
    deckToCampaign: PropTypes.object,
    myDecks: PropTypes.array,
    myDecksUpdated: PropTypes.instanceOf(Date),
    refreshing: PropTypes.bool,
    error: PropTypes.string,
    networkType: PropTypes.string,
    customHeader: PropTypes.node,
    customFooter: PropTypes.node,
    // from loginState
    login: PropTypes.func.isRequired,
    signedIn: PropTypes.bool.isRequired,
    signInError: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._onRefresh = this.onRefresh.bind(this);
    this._renderHeader = this.renderHeader.bind(this);
    this._reLogin = this.reLogin.bind(this);
  }

  reLogin() {
    this.props.login();
  }

  onRefresh() {
    const {
      refreshing,
      refreshMyDecks,
    } = this.props;

    if (!refreshing) {
      refreshMyDecks();
    }
  }

  componentDidMount() {
    const {
      myDecksUpdated,
      myDecks,
      signedIn,
    } = this.props;
    const now = new Date();
    if ((!myDecks ||
      myDecks.length === 0 ||
      !myDecksUpdated ||
      (myDecksUpdated.getTime() / 1000 + 600) < (now.getTime() / 1000)
    ) && signedIn) {
      this.onRefresh();
    }
  }

  renderError() {
    const {
      error,
      networkType,
    } = this.props;

    if (error === null && networkType !== 'none') {
      return null;
    }
    if (networkType === 'none') {
      return (
        <View style={[styles.banner, styles.warning]}>
          <Text style={typography.small}>
            Unable to update: you appear to be offline.
          </Text>
        </View>
      );
    }
    if (error === 'badAccessToken') {
      return (
        <TouchableOpacity onPress={this._reLogin} style={[styles.banner, styles.error]}>
          <Text style={[typography.small, styles.errorText]}>
            We're having trouble updating your decks at this time.
            If the problem persists tap here to reauthorize.
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this._reLogin} style={[styles.banner, styles.error]}>
        <Text style={[typography.small, styles.errorText]}>
          { L('An unexpected error occurred ({{error}}). If restarting the app doesn\'t fix the problem, tap here to reauthorize.', { error }) }
        </Text>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    const {
      customFooter,
    } = this.props;
    return (
      <React.Fragment>
        { customFooter }
        { this.renderSignInFooter() }
      </React.Fragment>
    )
  }

  renderSignInFooter() {
    const {
      login,
      signedIn,
      signInError,
    } = this.props;
    if (signedIn) {
      return null;
    }
    return (
      <View style={styles.signInFooter}>
        <Text style={[typography.text, space.marginBottomM]}>
          { L('ArkhamDB is a popular deck building site where you can manage and share decks with others.\n\nSign in to access your decks or share decks you have created with others.') }
        </Text>
        <Button onPress={login} title={L('Connect to ArkhamDB')} />
      </View>
    );
  }

  renderHeader() {
    const {
      customHeader,
    } = this.props;
    const error = this.renderError();
    if (!customHeader && !error) {
      return null;
    }
    return (
      <View style={styles.stack}>
        { error }
        { !!customHeader && customHeader }
      </View>
    );
  }

  render() {
    const {
      componentId,
      deckClicked,
      filterDeckIds = [],
      filterInvestigators = [],
      myDecks,
      decks,
      refreshing,
      onlyDeckIds,
      deckToCampaign,
      signedIn,
    } = this.props;

    const filterDeckIdsSet = new Set(filterDeckIds);
    const filterInvestigatorsSet = new Set(filterInvestigators);
    const deckIds = filter(onlyDeckIds || myDecks, deckId => {
      const deck = decks[deckId];
      return !filterDeckIdsSet.has(deckId) && (
        !deck || !filterInvestigatorsSet.has(deck.investigator_code)
      );
    });
    return (
      <DeckListComponent
        componentId={componentId}
        customHeader={this.renderHeader()}
        customFooter={this.renderFooter()}
        deckIds={deckIds}
        deckClicked={deckClicked}
        deckToCampaign={deckToCampaign}
        onRefresh={signedIn ? this._onRefresh : null}
        refreshing={refreshing}
        isEmpty={myDecks.length === 0}
      />
    );
  }
}

function mapStateToProps(state) {
  return Object.assign({},
    {
      decks: getAllDecks(state),
      deckToCampaign: getDeckToCampaignMap(state),
    },
    getMyDecksState(state),
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withNetworkStatus(
    withLoginState(MyDecksComponent)
  )
);

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'column',
  },
  banner: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  error: {
    backgroundColor: COLORS.red,
  },
  warning: {
    backgroundColor: COLORS.yellow,
  },
  errorText: {
    color: COLORS.white,
  },
  signInFooter: {
    padding: 16,
    marginTop: 8,
    backgroundColor: COLORS.lightGray,
  },
});
