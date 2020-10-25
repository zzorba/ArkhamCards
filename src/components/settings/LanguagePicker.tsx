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

interface DialogStrings {
  title: string;
  description: string;
  confirmButton: string;
  cancelButton: string;
}

function dialogStrings(lang: string): DialogStrings {
  switch (lang) {
    case 'ru':
      return {
        title: 'Подтвердить',
        description: 'Для изменения языка необходимо загрузить перевод карт из ArkhamDB. Этот процесс требует интернет-соединения и займет какое-то время.',
        confirmButton: 'Загрузить сейчас',
        cancelButton: 'Отменить',
      };
    case 'de':
      return {
        title: 'Bestätige',
        description: 'Eine Änderung der Sprache der App erfordert einen Download der übersetzten Kartendaten von ArkhamDB. Dies dauert einige Zeit.',
        confirmButton: 'Jetzt Herunterladen',
        cancelButton: 'Abbrechen',
      };
    case 'fr':
      return {
        title: 'Confirmation',
        description: 'Changer la langue de l\'app nécessite le téléchargement des traductions des cartes depuis ArkhamDB. Ceci nécessite une connexion réseau et peu prendre du temps.',
        confirmButton: 'Télécharger maintenant',
        cancelButton: 'Annuler',
      };
    case 'ko':
      return {
        title: '확인',
        description: '앱 언어 변경은 아컴디비에서 번역된 카드를 다운받아야 합니다. 이 기능은 인터넷 연결이 필요하며 시간이 소요됩니다.',
        confirmButton: '지금 다운로드 하기',
        cancelButton: '취소',
      };
    case 'es':
      return {
        title: 'Confirma',
        description: 'Cambiar el idioma de la aplicación requiere descargar la información de las cartas traducidas de ArkhamDB. Es necesario disponer de conexión a Internet y el proceso puede llevar algunos minutos.',
        confirmButton: 'Descargar ahora',
        cancelButton: 'Cancelar',
      };
    case 'en':
    case 'it':
    case 'pl':
    case 'uk':
    default:
      return {
        title: t`Confirm`,
        description: t`Changing app language requires downloading the translated card information from ArkhamDB. This requires network and can take some time.`,
        confirmButton: t`Download now`,
        cancelButton: t`Cancel`,
      };
  }
}

export default function LanguagePicker() {
  const { db } = useContext(DatabaseContext);
  const { colors } = useContext(StyleContext);
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
      const {
        title,
        description,
        confirmButton,
        cancelButton,
      } = dialogStrings(newLang);
      setTimeout(() => {
        Alert.alert(
          title,
          description,
          [
            {
              text: confirmButton,
              onPress: () => {
                setTempLang(index);
                dispatch(fetchCards(db, newCardLang, newLang));
              },
            },
            {
              text: cancelButton,
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
  );
}