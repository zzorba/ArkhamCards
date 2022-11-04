import React, { useCallback, useContext } from 'react';
import { Linking } from 'react-native';
import { t } from 'ttag';

import LanguageContext from '@lib/i18n/LanguageContext';
import ArkhamButton from '@components/core/ArkhamButton';

const URLS: { [lang: string]: string | undefined } = {
  de: 'https://asmodee.de/Arkham-Horror-LCG-Print_Play',
  fr: 'http://www.fantasyflightgames.fr/jeux/collection/horreur_a_arkham_lcg',
  es: 'http://www.fantasyflightgames.es/juegos/coleccion/arkham_horror_el_juego_de_cartas',
  ko: 'https://cafe.naver.com/arkhamfiles/4361',
};

export default function DownloadParallelCardsButton() {
  const { lang } = useContext(LanguageContext);
  const onPress = useCallback(() => {
    const languageUrl = URLS[lang];
    Linking.openURL(languageUrl ||
      'https://www.fantasyflightgames.com/en/products/arkham-horror-the-card-game/'
    );
  }, [lang]);
  return (
    <ArkhamButton
      icon="world"
      onPress={onPress}
      title={t`Download printable cards`}
    />
  );
}