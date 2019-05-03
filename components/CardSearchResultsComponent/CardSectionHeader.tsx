import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { COLORS } from '../../styles/colors';
import typography from '../../styles/typography';
import { isBig } from '../../styles/space';

export const ROW_HEADER_HEIGHT = (isBig ? 42 : 30) * DeviceInfo.getFontScale();
interface Props {
  title: string;
  bold?: boolean;
}
export default function CardSectionHeader({ title, bold }: Props) {
  return (
    <View style={[styles.row, bold ? styles.boldRow : {}]}>
      <Text style={[typography.text, styles.headerText]}>
        { title }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: ROW_HEADER_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  boldRow: {
    backgroundColor: '#ccc',
    borderColor: '#bdbdbd',
  },
  headerText: {
    marginLeft: 8,
    color: COLORS.black,
  },
});
