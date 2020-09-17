import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import ArkhamButton from '@components/core/ArkhamButton';
import StyleContext from '@styles/StyleContext';

export function rowNonCollectionHeight(fontScale: number) {
  return ArkhamButton.Height(fontScale);
}

interface Props {
  id: string;
  title: string;
  onPress: (id: string) => void;
}
export default class ShowNonCollectionFooter extends React.Component<Props> {
  _onPress = () => {
    this.props.onPress(this.props.id);
  }

  render() {
    const {
      title,
    } = this.props;
    return (
      <StyleContext.Consumer>
        { ({ fontScale, colors, borderStyle }) => (
          <View style={[styles.border, borderStyle, { height: rowNonCollectionHeight(fontScale) }]}>
            <ArkhamButton
              icon="expand"
              title={title}
              onPress={this._onPress}
            />
          </View>
        ) }
      </StyleContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
