import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

export default class SignatureCardItem extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    card: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      navigator,
      card,
    } = this.props;
    navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
      },
    });
  }

  render() {
    const {
      card,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Text style={styles.text}>{ card.quantity }x { card.name }</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 16,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
});
