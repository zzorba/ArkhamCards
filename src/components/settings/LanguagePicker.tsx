import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { find, map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { fetchCards, setLanguageChoice } from '@components/card/actions';
import DatabaseContext from '@data/DatabaseContext';
import { AppState } from '@reducers';
import { getSystemLanguage, localizedName, ALL_LANGUAGES } from '@lib/i18n';
import { usePickerDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import LanguageContext from '@lib/i18n/LanguageContext';

function languages() {
  const systemLang = getSystemLanguage();
  const systemLanguage = localizedName(systemLang);
  return [
    { title: t`Default (${systemLanguage})`, value: 'system', valueLabel: systemLanguage },
    ...map(ALL_LANGUAGES, lang => {
      const label = localizedName(lang);
      return {
        title: label,
        value: lang,
        valueLabel: label,
      };
    }),
  ];
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

export default function LanguagePicker({ first, last }: { first?: boolean; last?: boolean }) {
  const { db } = useContext(DatabaseContext);
  const { lang } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [tempLang, setTempLang] = useState<string | undefined>();
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);
  const useSystemLang = useSelector((state: AppState) => state.settings.lang === 'system');

  useEffect(() => {
    if (!cardsLoading && tempLang !== undefined) {
      setTempLang(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsLoading]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => languages(), [lang]);

  const onLanguageChange = useCallback((newLang: string) => {
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
                setTempLang(newLang);
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

  const selectedValue = useMemo(() => {
    if (tempLang !== undefined) {
      return tempLang;
    }
    return useSystemLang ? 'system' : lang;
  }, [tempLang, useSystemLang, lang]);

  const { showDialog, dialog } = usePickerDialog<string>({
    title: t`Language`,
    description: t`Note: not all cards have translations available.`,
    items,
    selectedValue,
    onValueChange: onLanguageChange,
  });

  return (
    <>
      <DeckPickerStyleButton
        title={t`Language`}
        icon="world"
        editable={!cardsLoading}
        onPress={showDialog}
        valueLabel={find(items, option => option.value === selectedValue)?.valueLabel || 'Unknown'}
        first={first}
        last={last}
      />
      { dialog }
    </>
  );
}