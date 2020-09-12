import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import SearchResultButton from '@components/cardlist/SearchResultButton';
import BasicButton from '@components/core/BasicButton';
import { isBig } from '@styles/space';
import COLORS from '@styles/colors';

const NEW_STYLE = false;
export function rowNonCollectionHeight(fontScale: number) {
  if (NEW_STYLE) {
    return SearchResultButton.Height(fontScale);
  }
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
    console.log('press');
    this.props.onPress(this.props.id);
  }

  render() {
    const {
      title,
      fontScale,
    } = this.props;
    return (
      <View style={[styles.border, { height: rowNonCollectionHeight(fontScale) }]}>
        { NEW_STYLE ? (
          <SearchResultButton
            icon="expand"
            title={title}
            onPress={this._onPress}
            fontScale={fontScale}
          />
        ) : (<BasicButton onPress={this._onPress} title={title} />) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
