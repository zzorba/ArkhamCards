import React from 'react';
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import space from '@styles/space';
import COLORS from '@styles/colors';

export default class AboutView extends React.Component {
  _linkPressed = (url: string) => {
    Linking.openURL(url);
  };

  render() {
    return (
      <ScrollView style={[space.paddingM, styles.background]}>
        <CardTextComponent onLinkPress={this._linkPressed} fontAdjustment={1.2}
          text={"The information presented in this app about Arkham Horror: The Card Game, both literal and graphical, is copyrighted by Fantasy Flight Games. This app is not produced, endorsed, supported, or affiliated with Fantasy Flight Games.\n\nThis application was created by Daniel Salinas as a fan project to help support the Arkham Horror: The Card Game community, with design contributions from Eugene Sarnetsky and additional development by Joshua Payne. If you find yourself managing lots of decks and campaigns, I'm hoping it proves useful.\n\nFeedback and bug reports are welcome by email at [arkhamcards@gmail.com](mailto:arkhamcards@gmail.com)\n\nMany thanks to ArkhamDB.com for providing the structured data, API access and access to card images. Without their continued support, this project would not have been possible."} />
        <View style={space.marginTopM}>
          <CardTextComponent onLinkPress={this._linkPressed} fontAdjustment={1.2}
            text={"<b>Translation:</b>\n• Spanish: [@TengounplanAH](https://twitter.com/TengounplanAH), Midraed and Alvaro\n• French: Fabrice2\n• German: Hauke\n• Russian: Eugene Sarnetsky, Alexander “Sheff” Buryakov, [Artem “NL” Grechka](https://twitter.com/lnll), Max “Youbi” Zakharov, Vladimir “Sliptip” Litvaliev, Andrey “Dartemilion” Lubyanov, Mikhail “Necros47” Lisovsky"} />
        </View>
        <View style={space.marginTopM}>
          <CardTextComponent onLinkPress={this._linkPressed} fontAdjustment={1.2}
            text={"<b>Additional Contributionos:</b>\n• Visual Design: [Eugene Sarnetsky](https://t.me/sarnetsky)\n• Digital chaos bag + odds calculator: Joshua Payne (@suxur)\n• Tooling and build support: Akaan"} />
        </View>
        <View style={space.marginTopM}>
          <CardTextComponent onLinkPress={this._linkPressed} fontAdjustment={1}
            text={"<b>Icon Attribution:</b>\n• 'Cards', 'Decks', 'Campaigns' and 'Settings' icons by Eugene Sarnetsky\n• 'FAQ' icon by Gregor Cresnar from the Noun Project.\n• 'Cards' icon by Dmitriy Ivanov from the Noun Project.\n• 'Cards' icon by Dmitriy Ivanov from the Noun Project.\n• Octopus Vectors by [Vecteezy](https://www.vecteezy.com/free-vector/octopus)"} />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    height: 100,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  background: {
    backgroundColor: COLORS.background,
  },
});
