import React from 'react';
import { findIndex, map } from 'lodash';
import Realm from 'realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { SettingsPicker } from 'react-native-settings-components';

import { t } from 'ttag';
import SinglePickerComponent from 'components/core/SinglePickerComponent';
import { fetchCards } from 'components/card/actions';
import Card from 'data/Card';
import { AppState } from 'reducers';
import COLORS from 'styles/colors';

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
  { label: '한국어', value: 'ko' },
  { label: 'Українська', value: 'uk' },
];

class LanguagePicker extends React.Component<Props> {
  languagePickerRef?: SettingsPicker<string>;

  _captureLanguagePickerRef = (ref: SettingsPicker<string>) => {
    this.languagePickerRef = ref;
  }

  _onLanguageChange = (index: number) => {
    const newLang = LANGUAGES[index].value;
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

  render() {
    const {
      cardsLoading,
      lang,
    } = this.props;
    return (
      <SinglePickerComponent
        title={t`Card Language`}
        description={t`Note: not all cards have translations available.`}
        onChoiceChange={this._onLanguageChange}
        selectedIndex={findIndex(LANGUAGES, x => x.value === lang)}
        choices={map(LANGUAGES, lang => {
          return {
            text: lang.label,
          };
        })}
        colors={{
          modalColor: COLORS.lightBlue,
          modalTextColor: '#FFF',
          backgroundColor: '#FFF',
          textColor: COLORS.darkTextColor,
        }}
        editable={!cardsLoading}
        settingsStyle
        hideWidget
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
