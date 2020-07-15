import React from 'react';
import { findIndex, map } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { SettingsPicker } from 'react-native-settings-components';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { fetchCards } from '@components/card/actions';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { AppState } from '@reducers';
import COLORS from '@styles/colors';

interface ReduxProps {
  lang: string;
  cardsLoading?: boolean;
  cardsError?: string;
}

interface ReduxActionProps {
  fetchCards: (db: Database, lang: string) => void;
}

type Props = ReduxProps & ReduxActionProps;

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Italiano', value: 'it' },
  { label: 'Français', value: 'fr' },
  { label: '한국어', value: 'ko' },
  { label: 'Українська', value: 'uk' },
  { label: 'Polski', value: 'pl' },
];

class LanguagePicker extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  languagePickerRef?: SettingsPicker<string>;

  _captureLanguagePickerRef = (ref: SettingsPicker<string>) => {
    this.languagePickerRef = ref;
  }

  _onLanguageChange = (index: number) => {
    const newLang = LANGUAGES[index].value;
    this.languagePickerRef && this.languagePickerRef.closeModal();
    const {
      lang,
      fetchCards,
    } = this.props;
    if (newLang && newLang !== lang) {
      fetchCards(this.context.db, newLang);
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
          backgroundColor: COLORS.background,
          textColor: COLORS.darkText,
        }}
        editable={!cardsLoading}
        settingsStyle
        noBorder
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

export default connect<ReduxProps, ReduxActionProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePicker);
