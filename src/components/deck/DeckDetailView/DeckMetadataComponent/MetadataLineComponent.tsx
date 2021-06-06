import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  last?: boolean;
}

export default function MetadataLineComponent({ icon, title, description, last }: Props) {
  const { borderStyle } = useContext(StyleContext);
  return (
    <View style={[styles.row, space.paddingTopS, space.paddingBottomS, borderStyle, space.marginSideM, !last ? styles.border : undefined]}>
      <View style={styles.icon}>
        { icon }
      </View>
      <View style={styles.column}>
        { title }
        { description }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: s,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
