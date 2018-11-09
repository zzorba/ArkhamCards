import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  StyleSheet,
} from 'react-native';

import L from '../../app/i18n';

export default class ShowNonCollectionFooter extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
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
      count,
    } = this.props;
    return (
      <Button
        style={styles.button}
        title={L('Show {{count}} Non-Collection Cards', { count })}
        onPress={this._onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 38,
  },
});
