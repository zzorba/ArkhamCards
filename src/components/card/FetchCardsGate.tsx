import React, { ReactNode } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { bindActionCreators, Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import Database from 'data/Database';
import DatabaseContext, { DatabaseContextType } from 'data/DatabaseContext';
import { fetchCards, dismissUpdatePrompt } from './actions';
import { AppState } from 'reducers';
import typography from 'styles/typography';
import { l, s } from 'styles/space';
import COLORS from 'styles/colors';

const REFETCH_DAYS = 7;
const REPROMPT_DAYS = 3;
const REFETCH_SECONDS = REFETCH_DAYS * 24 * 60 * 60;
const REPROMPT_SECONDS = REPROMPT_DAYS * 24 * 60 * 60;

interface ReduxProps {
  loading?: boolean;
  error?: string;
  lang: string;
  fetchNeeded?: boolean;
  dateFetched?: number;
  dateUpdatePrompt?: number;
}

interface ReduxActionProps {
  fetchCards: (db: Database, lang: string) => void;
  dismissUpdatePrompt: () => void;
}

interface OwnProps {
  promptForUpdate?: boolean;
  children: ReactNode;
}

type Props = ReduxProps & ReduxActionProps & OwnProps;

/**
 * Simple component to block children rendering until cards/packs are loaded.
 */
class FetchCardsGate extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  async cardCount() {
    const cards = await this.context.db.cards();
    return await cards.count();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.fetchNeeded && !prevProps.fetchNeeded) {
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
      lang,
    } = this.props;
    this.props.fetchCards(this.context.db, lang);
  };

  componentDidMount() {
    if (this.props.fetchNeeded) {
      if (this.props.promptForUpdate){
        this._doFetch();
      }
      return;
    }
    this.cardCount().then(cardCount => {
      if (cardCount === 0) {
        this._doFetch();
        return;
      }
      if (this.props.promptForUpdate && this.updateNeeded()) {
        Alert.alert(
          t`Check for updated cards?`,
          t`It has been more than a week since you checked for new cards.\nCheck for new cards from ArkhamDB?`,
          [
            { text: t`Ask me later`, onPress: this._ignoreUpdate },
            { text: t`Check for updates`, onPress: this._doFetch },
          ],
        );
      }
    });
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
          <BasicButton onPress={this._doFetch} title={t`Try Again`} />
        </View>
      );
    }
    if (loading || this.props.fetchNeeded) {
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

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(FetchCardsGate);

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: COLORS.background,
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
