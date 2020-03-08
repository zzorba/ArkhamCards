import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import typography from 'styles/typography';

interface Props {
  text: string;
}

export default class GameHeader extends React.Component<Props> {
  render() {
    const {
      text,
    } = this.props;
    return (
      <View style={styles.marginTop}>
        <Text style={typography.bigGameFont}>
          { text }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 4,
  },
});
