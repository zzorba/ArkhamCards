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

import BasicButton from '@components/core/BasicButton';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { fetchCards, dismissUpdatePrompt } from './actions';
import { getLangPreference, AppState } from '@reducers';
import { localizedName, getSystemLanguage } from '@lib/i18n';
import typography from '@styles/typography';
import { l, s } from '@styles/space';
import COLORS from '@styles/colors';

const REFETCH_DAYS = 7;
const REPROMPT_DAYS = 3;
const REFETCH_SECONDS = REFETCH_DAYS * 24 * 60 * 60;
const REPROMPT_SECONDS = REPROMPT_DAYS * 24 * 60 * 60;

interface ReduxProps {
  loading?: boolean;
  error?: string;
  currentCardLang: string;
  choiceLang: string;
  useSystemLang: boolean;
  fetchNeeded?: boolean;
  dateFetched?: number;
  dateUpdatePrompt?: number;
}

let CHANGING_LANGUAGE = false;

interface ReduxActionProps {
  fetchCards: (db: Database, cardLang: string, choiceLang: string) => void;
  dismissUpdatePrompt: () => void;
}

interface OwnProps {
  promptForUpdate?: boolean;
  children: ReactNode;
}

type Props = ReduxProps & ReduxActionProps & OwnProps;

const FULL_TRANSLATION_LANGS = new Set([
  'en',
  'ru',
  'es',
]);

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
      choiceLang,
      useSystemLang,
    } = this.props;
    this.props.fetchCards(this.context.db, choiceLang, useSystemLang ? 'system' : choiceLang);
  };

  langUpdateNeeded() {
    const { useSystemLang, choiceLang, currentCardLang } = this.props;
    return !!(currentCardLang && useSystemLang && choiceLang !== currentCardLang);
  }

  componentDidMount() {
    const { fetchNeeded, promptForUpdate } = this.props;
    if (fetchNeeded) {
      if (promptForUpdate){
        this._doFetch();
      }
      return;
    }
    this.cardCount().then(cardCount => {
      if (promptForUpdate) {

        if (cardCount === 0) {
          this._doFetch();
          return;
        }
        if (this.langUpdateNeeded() && !CHANGING_LANGUAGE) {
          CHANGING_LANGUAGE = true;
          const lang = localizedName(getSystemLanguage());
          Alert.alert(
            t`Download language cards`,
            t`Would you like to download updated cards from ArkhamDB to match your phone's preferred language (${lang})?\n\nYou can override your language preference for this app in Settings.`,
            [
              { text: t`Not now`, style: 'cancel' },
              { text: t`Download now`, onPress: this._doFetch },
            ]
          );
        } else if (this.updateNeeded()) {
          Alert.alert(
            t`Check for updated cards?`,
            t`It has been more than a week since you checked for new cards.\nCheck for new cards from ArkhamDB?`,
            [
              { text: t`Ask me later`, onPress: this._ignoreUpdate, style: 'cancel' },
              { text: t`Check for updates`, onPress: this._doFetch },
            ],
          );
        }
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
            color={COLORS.lightText}
          />
        </View>
      );
    }

    return children;
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  const lang = getLangPreference(state);
  return {
    fetchNeeded: state.packs.all.length === 0,
    currentCardLang: state.cards.card_lang || 'en',
    choiceLang: lang,
    useSystemLang: state.settings.lang === 'system',
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
