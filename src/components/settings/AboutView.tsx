import React, { useContext } from 'react';
import {
  Linking,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { t } from 'ttag';

import CardTextComponent from '@components/card/CardTextComponent';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

function linkPressed(url: string) {
  Linking.openURL(url);
}

export default function AboutView() {
  const { backgroundStyle } = useContext(StyleContext);
  const visualDesigner = '[Eugene Sarnetsky](mailto:sarnetsky@gmail.com)';
  const chaosBagDeveloper = 'Joshua Payne (@suxur)';
  const dissonantVoicesDeveloper = 'North101';
  const toolingDeveloper = 'Akaan';
  const spanishTranslators = '[@TengounplanAH](https://twitter.com/TengounplanAH), Midraed, Alvaro'
  const frenchTranslators = 'Alexandre Carpentier, Fabrice2, Aifé';
  const germanTranslators = 'Hauke, tjanu';
  const russianTranslators = 'Eugene Sarnetsky, Alexander “Sheff” Buryakov, Eugene Karelin, [Artem “NL” Grechka](https://twitter.com/lnll), Max “Youbi” Zakharov, Vladimir “Sliptip” Litvaliev, Andrey “Dartemilion” Lubyanov, Mikhail “Necros47” Lisovsky, fnordmonkey';
  const koreanTranslators = '엘케인(elkeinkrad), 푸른이(derornos)';
  const simplifiedChineseTranslators = 'Chris 崔家宁';
  const originalIconDesigns = t`<b>Icon Attribution:</b>\n• Original icon designs: ${visualDesigner}`;
  return (
    <ScrollView style={[space.paddingM, backgroundStyle]}>
      <CardTextComponent onLinkPress={linkPressed}
        text={t`The information presented in this app about Arkham Horror: The Card Game, both literal and graphical, is copyrighted by Fantasy Flight Games. This app is not produced, endorsed, supported, or affiliated with Fantasy Flight Games.\n\nThis application was created by Daniel Salinas as a fan project to help support the Arkham Horror: The Card Game community, with design from ${visualDesigner} and additional development by ${dissonantVoicesDeveloper}, ${chaosBagDeveloper}, and ${toolingDeveloper}. If you find yourself managing lots of decks and campaigns, I\'m hoping it proves useful.\n\nFeedback and bug reports are welcome by email at [arkhamcards@gmail.com](mailto:arkhamcards@gmail.com)\n\nMany thanks to ArkhamDB.com for providing the structured data, API access and access to card images. Without their continued support, this project wouldn\'t be possible.`} />
      <View style={space.marginTopM}>
        <CardTextComponent onLinkPress={linkPressed}
          text={
            [
              t`<b>Translation:</b>\n• Spanish: ${spanishTranslators}\n• French: ${frenchTranslators}\n• German: ${germanTranslators}\n• Russian: ${russianTranslators}\n• Korean: ${koreanTranslators}`,
              t`Chinese (Simplified): ${simplifiedChineseTranslators}`,
            ].join('\n')} />
      </View>
      <View style={space.marginTopM}>
        <CardTextComponent onLinkPress={linkPressed}
          text={t`<b>Additional Contributions:</b>\n• Visual Design: ${visualDesigner}\n• Digital chaos bag + odds calculator: ${chaosBagDeveloper}\n• Dissonant Voices audio integration: ${dissonantVoicesDeveloper}\n• Tooling and build support: ${toolingDeveloper}`} />
      </View>
      <View style={space.marginTopM}>
        <CardTextComponent onLinkPress={linkPressed}
          text={`${originalIconDesigns}\n• 'crate' by Imogen Oh from the Noun Project\n• 'dodo' and 'griffin' by Icons Producer from the Noun Project\n• 'caterpillar' by Georgiana Ionescu from the Noun Project\n• 'turtle' by Ecem Afacan from the Noun Project\n• 'cracked egg' by Peter van Driel from the Noun Project\n• 'unicorn' by Jennifer Ann Rött from the Noun Project\n• 'lion' by Felix Brönnimann from the Noun Project\n• 'chess queen' by Akshar Pathak from the Noun Project\n• 'pepper shaker' by Phạm Thanh Lộc, VN from the Noun Project\n• 'rail' by Angelo Troiano from Noun Project`}
        />
      </View>
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 100,
  },
});
