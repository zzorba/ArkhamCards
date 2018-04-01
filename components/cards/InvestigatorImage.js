import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

const adjustments = {

};

export default class InvestigatorImage extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={[styles.image]}
          source={{ uri: `https://arkhamdb.com/${this.props.source}` }}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 6,
    width: 80,
    height: 80,
  },
  image: {
    position: 'absolute',
    top: -34,
    left: -10,
    width: 166 + 44,
    height: 136 + 34,
  },
  right: {

  },
  left: {

  },
});
