import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  StyleSheet,
} from 'react-native';

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
      <Button
        style={styles.button}
        title={title}
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
