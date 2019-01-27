import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

import { isBig } from '../../styles/space';

export const ROW_NON_COLLECTION_HEIGHT = isBig ? 52 : 38;

export default class ShowNonCollectionFooter extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
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
  button: {
    height: ROW_NON_COLLECTION_HEIGHT,
  },
  row: {
    height: ROW_NON_COLLECTION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
