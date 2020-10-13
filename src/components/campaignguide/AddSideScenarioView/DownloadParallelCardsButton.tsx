import React, { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { getLangPreference } from '@reducers';

const URLS: { [lang: string]: string | undefined } = {
  fr: 'http://www.fantasyflightgames.fr/jeux/collection/horreur_a_arkham_lcg',
  es: 'http://www.fantasyflightgames.es/juegos/coleccion/arkham_horror_el_juego_de_cartas',
};

export default function DownloadParallelCardsButton() {
  const lang = useSelector(getLangPreference);
  const onPress = useCallback(() => {
    const languageUrl = URLS[lang];
    Linking.openURL(languageUrl ||
      'https://www.fantasyflightgames.com/en/products/arkham-horror-the-card-game/'
    );
  }, []);
  return (
    <BasicButton
      onPress={onPress}
      title={t`Download printable cards`}
    />
  );
}