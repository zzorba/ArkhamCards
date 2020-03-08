import React from 'react';
import { find } from 'lodash';
import Realm from 'realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { SettingsPicker } from 'react-native-settings-components';

import { t } from 'ttag';
import { fetchCards } from 'components/card/actions';
import Card from 'data/Card';
import { AppState } from 'reducers';
import { COLORS } from 'styles/colors';

interface ReduxProps {
  lang: string;
  cardsLoading?: boolean;
  cardsError?: string;
}

interface ReduxActionProps {
  fetchCards: (realm: Realm, lang: string) => void;
}

interface RealmProps {
  realm: Realm;
}

type Props = ReduxProps & ReduxActionProps & RealmProps;

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Italiano', value: 'it' },
  { label: 'Français', value: 'fr' },
];

class LanguagePicker extends React.Component<Props> {
  languagePickerRef?: SettingsPicker<string>;

  _captureLanguagePickerRef = (ref: SettingsPicker<string>) => {
    this.languagePickerRef = ref;
  }

  _onLanguageChange = (newLang: string) => {
    this.languagePickerRef && this.languagePickerRef.closeModal();
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    if (newLang && newLang !== lang) {
      fetchCards(realm, newLang);
    }
  };

  _langCodeToLanguage = (lang: string) => {
    const language = find(LANGUAGES, obj => obj.value === lang);
    if (language) {
      return language.label;
    }
    return 'Unknown';
  }

  render() {
    const {
      cardsLoading,
      lang,
    } = this.props;
    return (
      <SettingsPicker
        ref={this._captureLanguagePickerRef}
        title={t`Card Language`}
        value={lang}
        dialogDescription={t`Note: not all cards have translations available.`}
        valueFormat={this._langCodeToLanguage}
        onValueChange={this._onLanguageChange}
        modalStyle={{
          header: {
            wrapper: {
              backgroundColor: COLORS.lightBlue,
            },
            description: {
              paddingTop: 8,
            },
          },
          list: {
            itemColor: COLORS.lightBlue,
          },
        }}
        valueStyle={{
          color: COLORS.darkGray,
        }}
        options={LANGUAGES}
        disabled={cardsLoading}
      />
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  return {
    cardsLoading: state.cards.loading,
    cardsError: state.cards.error || undefined,
    lang: state.packs.lang || 'en',
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    fetchCards,
  }, dispatch);
}

export default connectRealm<{}, RealmProps, Card>(
  connect<ReduxProps, ReduxActionProps, RealmProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(LanguagePicker), {
    mapToProps(results: any, realm: Realm): RealmProps {
      return {
        realm,
      };
    },
  });
