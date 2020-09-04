import React from 'react';
import { Alert } from 'react-native';
import { findIndex, map } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { fetchCards, setLanguageChoice } from '@components/card/actions';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { getLangPreference, AppState } from '@reducers';
import { getSystemLanguage, localizedName, ALL_LANGUAGES } from '@lib/i18n';
import COLORS from '@styles/colors';

interface ReduxProps {
  lang: string;
  useSystemLang: boolean;
  cardsLoading?: boolean;
  cardsError?: string;
}

interface ReduxActionProps {
  fetchCards: (db: Database, cardLang: string, langChoice: string) => void;
  setLanguageChoice: (langChoice: string) => void;
}

type Props = ReduxProps & ReduxActionProps;

function languages() {
  const systemLang = getSystemLanguage();
  const systemLanguage = localizedName(systemLang);
  return [
    { label: t`Default (${systemLanguage})`, value: 'system' },
    ...map(ALL_LANGUAGES, lang => {
      return {
        label: localizedName(lang),
        value: lang,
      };
    }),
  ];
}

class LanguagePicker extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  _formatLabel = (idx: number) => {
    if (idx === 0) {
      const systemLang = getSystemLanguage();
      return localizedName(systemLang);
    }
    return languages()[idx].label;
  };

  _onLanguageChange = (index: number) => {
    const newLang = languages()[index].value;
    const {
      lang,
      fetchCards,
      setLanguageChoice,
    } = this.props;
    const systemLang = getSystemLanguage();
    const newCardLang = newLang === 'system' ? systemLang : newLang;
    if (newCardLang !== lang) {
      setTimeout(() => {
        Alert.alert(
          t`Confirm`,
          t`Changing app language requires downloading the translated card information from ArkhamDB. This requires network and can take some time.`,
          [
            {
              text: t`Download now`,
              onPress: () => {
                fetchCards(
                  this.context.db,
                  newCardLang,
                  newLang
                );
              },
            },
            {
              text: t`Cancel`,
              style: 'cancel',
            },
          ]
        );
      }, 200);
    } else {
      setLanguageChoice(newLang);
    }
  };

  render() {
    const {
      cardsLoading,
      lang,
      useSystemLang,
    } = this.props;
    const allLanguages = languages();
    return (
      <SinglePickerComponent
        title={t`Language`}
        description={t`Note: not all cards have translations available.`}
        onChoiceChange={this._onLanguageChange}
        selectedIndex={findIndex(allLanguages, x => useSystemLang ? x.value === 'system' : x.value === lang)}
        choices={map(allLanguages, lang => {
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
        formatLabel={this._formatLabel}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    cardsLoading: state.cards.loading,
    cardsError: state.cards.error || undefined,
    useSystemLang: state.settings.lang === 'system',
    lang: getLangPreference(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    fetchCards,
    setLanguageChoice,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, unknown, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePicker);
