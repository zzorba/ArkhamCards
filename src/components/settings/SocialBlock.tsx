import React, { useContext } from 'react';
import {
  Linking,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';
import LanguageContext from '@lib/i18n/LanguageContext';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import DeckButton from '@components/deck/controls/DeckButton';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

function discordPressed() {
  Linking.openURL('https://discord.gg/cqUudV2');
}
function vkPressed() {
  Linking.openURL('https://vk.com/arkham_cardgame');
}
function telegramPressed() {
  Linking.openURL('https://t.me/Arkham_Cardgame');
}

export default function SocialBlock() {
  const { typography } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  if (lang !== 'ru') {
    return null;
  }

  return (
    <View style={space.paddingS}>
      <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Social`} />}>
        <Text style={[typography.text, space.paddingS]}>
          Общайтесь с другими поклонниками карточного «Ужаса Аркхэма» в русскоязычных сообществах:
        </Text>
        <DeckButton
          icon="discord"
          topMargin={s}
          bottomMargin={s}
          onPress={discordPressed}
          title={t`Discord`}
        />
        <DeckButton
          bottomMargin={s}
          icon="vk"
          onPress={vkPressed}
          title={t`VK`}
        />
        <DeckButton
          icon="telegram"
          onPress={telegramPressed}
          title={t`Telegram`}
        />
      </RoundedFactionBlock>
    </View>
  );
}