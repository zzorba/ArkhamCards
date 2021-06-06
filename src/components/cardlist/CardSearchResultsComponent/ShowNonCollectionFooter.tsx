import React, { useCallback, useContext } from 'react';
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
  noBorder?: boolean;
}
export default function ShowNonCollectionFooter({ id, title, onPress, noBorder }: Props) {
  const { fontScale, borderStyle } = useContext(StyleContext);
  const handleOnPress = useCallback(() => {
    onPress(id);
  }, [onPress, id]);

  return (
    <View style={[noBorder ? undefined : styles.border, borderStyle, { height: rowNonCollectionHeight(fontScale) }]}>
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
