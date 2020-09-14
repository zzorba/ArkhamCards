import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import SearchResultButton from '@components/cardlist/SearchResultButton';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

export function rowNonCollectionHeight(fontScale: number) {
  return SearchResultButton.Height(fontScale);
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
        { ({ fontScale, colors }) => (
          <View style={[styles.border, { borderColor: colors.divider, height: rowNonCollectionHeight(fontScale) }]}>
            <SearchResultButton
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
