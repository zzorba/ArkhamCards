import React, { ReactNode } from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { filter } from 'lodash';
import { bindActionCreators, Action, Dispatch } from 'redux';
import { connect } from 'react-redux';

import withNetworkStatus, { NetworkStatusProps } from './core/withNetworkStatus';
import { Campaign, Deck } from '../actions/types';
import { refreshMyDecks } from '../actions';
import L from '../app/i18n';
import Card from '../data/Card';
import DeckListComponent from './DeckListComponent';
import withLoginState, { LoginStateProps } from './withLoginState';
import { COLORS } from '../styles/colors';
import typography from '../styles/typography';
import space from '../styles/space';
import { getAllDecks, getMyDecksState, getDeckToCampaignMap, AppState } from '../reducers';

interface OwnProps {
  componentId: string;
  deckClicked: (deck: Deck, investigator?: Card) => void;
  onlyDeckIds?: number[];
  filterDeckIds?: number[]
  filterInvestigators?: string[];
  customHeader?: ReactNode;
  customFooter?: ReactNode;
}

interface ReduxProps {
  decks: { [id: number]: Deck };
  deckToCampaign: { [id: number]: Campaign };
  myDecks: number[];
  myDecksUpdated?: Date;
  refreshing: boolean;
  error?: string;
}

interface ReduxActionProps {
  refreshMyDecks: () => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps & LoginStateProps & NetworkStatusProps;

class MyDecksComponent extends React.Component<Props> {
  _reLogin = () => {
    this.props.login();
  };

  _onRefresh = () => {
    const {
      refreshing,
      refreshMyDecks,
    } = this.props;

    if (!refreshing) {
      refreshMyDecks();
    }
  };

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
      this._onRefresh();
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
    );
  }

  renderSignInFooter() {
    const {
      login,
      signedIn,
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
        customHeader={this.renderHeader()}
        customFooter={this.renderFooter()}
        deckIds={deckIds}
        deckClicked={deckClicked}
        deckToCampaign={deckToCampaign}
        onRefresh={signedIn ? this._onRefresh : undefined}
        refreshing={refreshing}
        isEmpty={myDecks.length === 0}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    decks: getAllDecks(state),
    deckToCampaign: getDeckToCampaignMap(state) || {},
    ...getMyDecksState(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({ refreshMyDecks }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  withNetworkStatus<ReduxProps & ReduxActionProps & OwnProps>(
    withLoginState<ReduxProps & ReduxActionProps & OwnProps & NetworkStatusProps>(
      MyDecksComponent
    )
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
