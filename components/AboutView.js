import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default function AboutView() {
  return (
    <View style={styles.container}>
      <Text>
        All 'Arkham Horror: The Card Game' card text and images are
        copyright Fantasy Flight Games.
        { '\n\n' }
        This application was created by Daniel Salinas as a fan project to
        help support the Arkham Horror: The Card Game community.
        { '\n\n' }
        Many thanks to arkhamdb.com for providing data and images, without which
        this project would not have been possible.
        { '\n\n' }
        Attribution:
        { '\n' }
        • 'deck of cards' icon by Daniel Solis from the Noun Project.
        { '\n' }
        • 'FAQ' icon by Gregor Cresnar from the Noun Project.
        { '\n' }
        • 'Cards' icon by Dmitriy Ivanov from the Noun Project.
        { '\n' }
        • 'flip over' icon by Nathan Smith from the Noun Project.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
