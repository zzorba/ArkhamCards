import React from 'react';
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';

import typography from 'styles/typography';

export default class AboutView extends React.Component {
  _octopusLink = () => {
    Linking.openURL(`https://www.vecteezy.com/free-vector/octopus`);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={typography.text}>
          The information presented in this app about Arkham Horror: The Card
          Game, both literal and graphical, is copyrighted by Fantasy Flight
          Games. This app is not produced, endorsed, supported, or affiliated
          with Fantasy Flight Games.
          { '\n\n' }
          This application was created by Daniel Salinas as a fan project to
          help support the Arkham Horror: The Card Game community. Additional
          development by Joshua Payne. If you find yourself managing lots of
          decks and campaigns, I'm hoping it proves useful.
          { '\n\n' }
          Feedback and bug reports are welcome by email at arkhamcards@gmail.com
          or via Twitter @ArkhamCards
          { '\n\n' }
          Many thanks to ArkhamDB.com for providing the structured data, API
          access and access to card images. Without their continued support, this
          project would not have been possible.
          { '\n\n' }
        </Text>
        <Text style={typography.small}>
          <Text style={typography.bold}>Icon Attribution:</Text>
          { '\n' }
          • 'deck of cards' icon by Daniel Solis from the Noun Project.
          { '\n' }
          • 'FAQ' icon by Gregor Cresnar from the Noun Project.
          { '\n' }
          • 'Cards' icon by Dmitriy Ivanov from the Noun Project.
          { '\n' }
          • 'flip over' icon by Nathan Smith from the Noun Project.
          { '\n' }
          • 'books'  by Mr Balind from the Noun Project.
        </Text>
        <TouchableOpacity onPress={this._octopusLink}>
          <Text style={typography.small}>
            • <Text style={styles.underline}>Octopus Vectors by Vecteezy</Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footer: {
    height: 100,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
