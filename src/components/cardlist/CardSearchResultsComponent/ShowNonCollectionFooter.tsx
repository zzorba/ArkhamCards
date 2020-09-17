import React, { useContext } from 'react';
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
export default function ShowNonCollectionFooter({ id, title, onPress }: Props) {
  const { fontScale, borderStyle } = useContext(StyleContext);
  const handleOnPress = () => {
    onPress(id);
  };

  return (
    <View style={[styles.border, borderStyle, { height: rowNonCollectionHeight(fontScale) }]}>
      <ArkhamButton
        icon="expand"
        title={title}
        onPress={handleOnPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
