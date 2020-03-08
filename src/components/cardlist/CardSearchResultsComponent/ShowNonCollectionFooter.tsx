import React from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

import { isBig } from 'styles/space';

export function rowNonCollectionHeight(fontScale: number) {
  return (isBig ? 52 : 38) * fontScale + 16;
}

interface Props {
  id: string;
  title: string;
  fontScale: number;
  onPress: (id: string) => void;
}
export default class ShowNonCollectionFooter extends React.Component<Props> {
  _onPress = () => {
    this.props.onPress(this.props.id);
  }

  render() {
    const {
      title,
      fontScale,
    } = this.props;
    return (
      <View style={[styles.row, { height: rowNonCollectionHeight(fontScale) }]}>
        <Button
          title={title}
          onPress={this._onPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 8 * (isBig ? 1.2 : 1.0),
  },
});
