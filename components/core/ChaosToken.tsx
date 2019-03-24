import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import ChaosTokenIcon from './ChaosTokenIcon';
import { ChaosTokenType } from '../../constants';

const SCALE = ((DeviceInfo.getFontScale() - 1) / 4 + 1);
export const SIZE = 36 * SCALE;

interface Props {
  id: ChaosTokenType;
  status?: 'added' | 'removed';
}
export default function ChaosToken({ id, status }: Props) {
  let color = '#eeeeee';
  switch (status) {
    case 'added': color = '#cfe3d0'; break;
    case 'removed': color = '#f5d6d7'; break;
  }
  return (
    <View style={[styles.button, { backgroundColor: color }]}>
      <ChaosTokenIcon icon={id} size={28 * SCALE} />
    </View>
  );
}

ChaosToken.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['added', 'removed']),
};

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    marginRight: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
});
