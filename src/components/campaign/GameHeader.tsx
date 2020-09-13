import React from 'react';
import { Text, View } from 'react-native';

import typography from '@styles/typography';
import space from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  text: string;
}

export default class GameHeader extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;
  render() {
    const { text } = this.props;
    const { gameFont } = this.context;
    return (
      <View style={space.marginTopXs}>
        <Text style={[typography.bigGameFont, { fontFamily: gameFont }]}>
          { text }
        </Text>
      </View>
    );
  }
}
