import React, { useContext } from 'react';
import {
  Linking,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

function linkPressed(url: string) {
  Linking.openURL(url);
}

export default function AboutView() {
  const { backgroundStyle } = useContext(StyleContext);
  return (
    <ScrollView style={[space.paddingM, backgroundStyle]}>
      <CardTextComponent onLinkPress={linkPressed}
        text={'The information presented in this app about Arkham Horror: The Card Game, both literal and graphical, is copyrighted by Fantasy Flight Games. This app is not produced, endorsed, supported, or affiliated with Fantasy Flight Games.\n\nThis application was created by Daniel Salinas as a fan project to help support the Arkham Horror: The Card Game community, with design from Eugene Sarnetsky and additional development by North101, Joshua Payne, and Akaan. If you find yourself managing lots of decks and campaigns, I\'m hoping it proves useful.\n\nFeedback and bug reports are welcome by email at [arkhamcards@gmail.com](mailto:arkhamcards@gmail.com)\n\nMany thanks to ArkhamDB.com for providing the structured data, API access and access to card images. Without their continued support, this project wouldn\'t be possible.'} />
      <View style={space.marginTopM}>
        <CardTextComponent onLinkPress={linkPressed}
          text={'<b>Translation:</b>\n• Spanish: [@TengounplanAH](https://twitter.com/TengounplanAH), Midraed and Alvaro\n• French: Fabrice2, Aifé\n• German: Hauke, tjanu\n• Russian: Eugene Sarnetsky, Alexander “Sheff” Buryakov, [Artem “NL” Grechka](https://twitter.com/lnll), Max “Youbi” Zakharov, Vladimir “Sliptip” Litvaliev, Andrey “Dartemilion” Lubyanov, Mikhail “Necros47” Lisovsky\n• Korean: 엘케인(elkeinkrad), 푸른이(derornos)'} />
      </View>
      <View style={space.marginTopM}>
        <CardTextComponent onLinkPress={linkPressed}
          text={'<b>Additional Contributions:</b>\n• Visual Design: [Eugene Sarnetsky](mailto:sarnetsky@gmail.com)\n• Digital chaos bag + odds calculator: Joshua Payne (@suxur)\n• Dissonant Voices audio integration: North101\n• Tooling and build support: Akaan'} />
      </View>
      <View style={space.marginTopM}>
        <CardTextComponent onLinkPress={linkPressed}
          text={'<b>Icon Attribution:</b>\n• Original icon designs: [Eugene Sarnetsky](mailto:sarnetsky@gmail.com)\n• \'crate\' by Imogen Oh from the Noun Project\n• \'dodo\', \'griffin\', and  by Icons Producer from the Noun Project\n• \'caterpillar\' by Georgiana Ionescu from the Noun Project\n• \'turtle\' by Ecem Afacan from the Noun Project\n• \'cracked egg\' by Peter van Driel from the Noun Project\n• \'unicorn\' by Jennifer Ann Rött from the Noun Project\n• \'lion\' by Felix Brönnimann from the Noun Project\n• \'chess queen\' by Akshar Pathak from the Noun Project\n• \'pepper shaker\' by Phạm Thanh Lộc, VN from the Noun Project'} />
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
