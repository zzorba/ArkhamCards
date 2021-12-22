import React, { useCallback, useContext } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import ArkhamButton from '@components/core/ArkhamButton';
import StyleContext from '@styles/StyleContext';
import LanguageContext from '@lib/i18n/LanguageContext';

export function rowNonCollectionHeight(fontScale: number, lang: string) {
  return ArkhamButton.computeHeight(fontScale, lang);
}

interface Props {
  id: string;
  title: string;
  onPress: (id: string) => void;
  noBorder?: boolean;
}
export default function ShowNonCollectionFooter({ id, title, onPress, noBorder }: Props) {
  const { fontScale, borderStyle } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const handleOnPress = useCallback(() => {
    onPress(id);
  }, [onPress, id]);

  return (
    <View style={[noBorder ? undefined : styles.border, borderStyle, { height: rowNonCollectionHeight(fontScale, lang) }]}>
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
