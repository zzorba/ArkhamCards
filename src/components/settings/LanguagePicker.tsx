import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { findIndex, map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { fetchCards, setLanguageChoice } from '@components/card/actions';
import DatabaseContext from '@data/DatabaseContext';
import { getLangPreference, AppState } from '@reducers';
import { getSystemLanguage, localizedName, ALL_LANGUAGES } from '@lib/i18n';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

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

function formatLabel(idx: number) {
  if (idx === 0) {
    const systemLang = getSystemLanguage();
    return localizedName(systemLang);
  }
  return languages()[idx].label;
}

export default function LanguagePicker() {
  const { db } = useContext(DatabaseContext);
  const dispatch = useDispatch();
  const [tempLang, setTempLang] = useState<number | undefined>();
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);
  const useSystemLang = useSelector((state: AppState) => state.settings.lang === 'system');
  const lang = useSelector(getLangPreference);

  useEffect(() => {
    if (!cardsLoading && tempLang !== undefined) {
      setTempLang(undefined);
    }
  }, [cardsLoading]);

  const onLanguageChange = useCallback((index: number | null) => {
    if (index === null) {
      return;
    }
    const newLang = languages()[index].value;
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
                setTempLang(index);
                dispatch(fetchCards(db, newCardLang, newLang));
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
      dispatch(setLanguageChoice(newLang));
    }
  }, [lang, dispatch, setTempLang, db]);

  const allLanguages = languages();
  return (
    <StyleContext.Consumer>
      { ({ colors }) => (
        <SinglePickerComponent
          title={t`Language`}
          description={t`Note: not all cards have translations available.`}
          onChoiceChange={onLanguageChange}
          selectedIndex={tempLang !== undefined ? tempLang : findIndex(allLanguages, x => useSystemLang ? x.value === 'system' : x.value === lang)}
          choices={map(allLanguages, lang => {
            return {
              text: lang.label,
            };
          })}
          colors={{
            modalColor: COLORS.lightBlue,
            modalTextColor: '#FFF',
            backgroundColor: colors.background,
            textColor: colors.darkText,
          }}
          editable={!cardsLoading}
          settingsStyle
          noBorder
          hideWidget
          formatLabel={formatLabel}
        />
      ) }
    </StyleContext.Consumer>
  );
}