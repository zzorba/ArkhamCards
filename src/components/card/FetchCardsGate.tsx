import React, { ReactNode } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import Realm from 'realm';
import { bindActionCreators, Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { t } from 'ttag';

import Button from 'components/core/Button';
import Card from 'data/Card';
import { fetchCards, dismissUpdatePrompt } from './actions';
import { AppState } from 'reducers';
import typography from 'styles/typography';
import { l, s } from 'styles/space';

const REFETCH_DAYS = 7;
const REPROMPT_DAYS = 3;
const REFETCH_SECONDS = REFETCH_DAYS * 24 * 60 * 60;
const REPROMPT_SECONDS = REPROMPT_DAYS * 24 * 60 * 60;

interface RealmProps {
  realm: Realm;
  cardCount?: number;
}

interface ReduxProps {
  loading?: boolean;
  error?: string;
  lang: string;
  fetchNeeded?: boolean;
  dateFetched?: number;
  dateUpdatePrompt?: number;
}

interface ReduxActionProps {
  fetchCards: (realm: Realm, lang: string) => void;
  dismissUpdatePrompt: () => void;
}

interface OwnProps {
  promptForUpdate?: boolean;
  children: ReactNode;
}

type Props = RealmProps & ReduxProps & ReduxActionProps & OwnProps;

/**
 * Simple component to block children rendering until cards/packs are loaded.
 */
class FetchCardsGate extends React.Component<Props> {
  fetchNeeded(props: Props) {
    return props.fetchNeeded || props.cardCount === 0;
  }

  componentDidUpdate(prevProps: Props) {
    if (this.fetchNeeded(this.props) && !this.fetchNeeded(prevProps)) {
      this._doFetch();
    }
  }

  updateNeeded() {
    const {
      dateFetched,
      dateUpdatePrompt,
    } = this.props;
    const nowSeconds = (new Date()).getTime() / 1000;
    return (
      !dateFetched ||
      (dateFetched + REFETCH_SECONDS) < nowSeconds
    ) && (
      !dateUpdatePrompt ||
      (dateUpdatePrompt + REPROMPT_SECONDS) < nowSeconds
    );
  }

  _ignoreUpdate = () => {
    this.props.dismissUpdatePrompt();
  };

  _doFetch = () => {
    const {
      realm,
      lang,
    } = this.props;
    this.props.fetchCards(realm, lang);
  };

  componentDidMount() {
    if (this.fetchNeeded(this.props)) {
      this._doFetch();
    } else if (this.props.promptForUpdate && this.updateNeeded()) {
      Alert.alert(
        t`Check for updated cards?`,
        t`It has been more than a week since you checked for new cards.\nCheck for new cards from ArkhamDB?`,
        [
          { text: t`Ask me later`, onPress: this._ignoreUpdate },
          { text: t`Check for updates`, onPress: this._doFetch },
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
          <View style={styles.errorBlock}>
            <Text style={[typography.text, styles.error]}>
              { t`Error loading cards, make sure your network is working.` }
            </Text>
            <Text style={[typography.text, styles.error]}>
              { error }
            </Text>
          </View>
          <Button onPress={this._doFetch} text={t`Try Again`} />
        </View>
      );
    }
    const fetchNeeded = this.fetchNeeded(this.props);
    if (loading || fetchNeeded) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <Text style={typography.text}>
            { t`Loading latest cards...` }
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

function mapStateToProps(state: AppState): ReduxProps {
  return {
    fetchNeeded: state.packs.all.length === 0,
    lang: state.packs.lang || 'en',
    loading: state.packs.loading || state.cards.loading,
    error: state.packs.error || state.cards.error || undefined,
    dateFetched: state.packs.dateFetched || undefined,
    dateUpdatePrompt: state.packs.dateUpdatePrompt || undefined,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<Action>
): ReduxActionProps {
  return bindActionCreators({
    fetchCards,
    dismissUpdatePrompt,
  }, dispatch);
}

export default connectRealm<OwnProps, RealmProps, Card>(
  connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(FetchCardsGate),
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm
    ) {
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
  spinner: {
    height: 80,
  },
  errorBlock: {
    marginLeft: l,
    marginRight: l,
    flexDirection: 'column',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: s,
  },
});
