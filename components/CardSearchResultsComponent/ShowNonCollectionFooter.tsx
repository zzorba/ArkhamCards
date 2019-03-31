import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { isBig } from '../../styles/space';

export const ROW_NON_COLLECTION_HEIGHT = (isBig ? 52 : 38) * DeviceInfo.getFontScale();

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
      <View style={styles.row}>
        <Button
          title={title}
          onPress={this._onPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: ROW_NON_COLLECTION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
