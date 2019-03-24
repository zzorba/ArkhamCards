import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import DeviceInfo from 'react-native-device-info';

import typography from '../../styles/typography';

interface Props {
  text?: string;
  onPress: () => void;
  indent?: boolean;
  children?: ReactNode;
}
export default function NavButton({ text, onPress, indent, children }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[
        styles.container,
        indent ? styles.indentedContainer : styles.bottomBorder,
      ]}>
        { text ? (
          <View style={styles.text}>
            <Text style={typography.text} numberOfLines={1}>
              { text }
            </Text>
          </View>
        ) : <View style={styles.flex}>{ children }</View> }
        <View style={styles.icon}>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color="rgb(0, 122,255)"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  indentedContainer: {
    paddingLeft: 18,
  },
  text: {
    paddingLeft: 6,
    flex: 1,
    height: 22 + 18 * DeviceInfo.getFontScale(),
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
  },
  flex: {
    flex: 1,
  },
});
