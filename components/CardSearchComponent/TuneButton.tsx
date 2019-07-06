import React from 'react';
import { countBy, keys } from 'lodash';
import { connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { filterToQuery } from '../../lib/filters';
import { AppState, getFilterState, getDefaultFilterState } from '../../reducers';
import { COLORS } from '../../styles/colors';

const SIZE = 36;

interface OwnProps {
  filterId: string;
  onPress: () => void;
  lightButton?: boolean;
}

interface ReduxProps {
  filters: boolean;
}

type Props = OwnProps & ReduxProps;

function TuneButton({ filters, onPress, lightButton }: Props) {
  const defaultColor = Platform.OS === 'ios' ? '#007AFF' : COLORS.button;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.touchable}>
          <MaterialIcons name="tune" size={28} color={lightButton ? 'white' : defaultColor} />
          { filters && <View style={styles.chiclet} /> }
        </View>
      </TouchableOpacity>
    </View>
  );
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const filters = getFilterState(state, props.filterId);
  if (!filters) {
    return {
      filters: false,
    };
  }
  return {
    filters: filterToQuery(filters).length > 0,
  };
}

export default connect(mapStateToProps)(TuneButton);

const EXTRA_ANDROID_WIDTH = (Platform.OS === 'android' ? 8 : 0);
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 8 : 12,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    position: 'relative',
  },
  touchable: {
    padding: 4,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
  },
  chiclet: {
    borderColor: 'white',
    borderWidth: 1,
    position: 'absolute',
    top: 1,
    right: 1 + EXTRA_ANDROID_WIDTH,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
