import React from 'react';
import { Text, View } from 'react-native';

import typography from '@styles/typography';
import space from '@styles/space';

interface Props {
  text: string;
}

export default class GameHeader extends React.Component<Props> {
  render() {
    const {
      text,
    } = this.props;
    return (
      <View style={space.marginTopXs}>
        <Text style={typography.bigGameFont}>
          { text }
        </Text>
      </View>
    );
  }
}
