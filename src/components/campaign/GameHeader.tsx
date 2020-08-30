import React from 'react';
import { Text, View } from 'react-native';

import withStyles, { StylesProps } from '@components/core/withStyles';
import typography from '@styles/typography';
import space from '@styles/space';

interface Props {
  text: string;
}

class GameHeader extends React.Component<Props & StylesProps> {
  render() {
    const {
      text,
      gameFont,
    } = this.props;
    return (
      <View style={space.marginTopXs}>
        <Text style={[typography.bigGameFont, { fontFamily: gameFont }]}>
          { text }
        </Text>
      </View>
    );
  }
}

export default withStyles(GameHeader);