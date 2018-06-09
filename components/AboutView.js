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
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
