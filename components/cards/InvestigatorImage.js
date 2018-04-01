import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

export default class InvestigatorImage extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
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
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#000000',
    width: 90,
    height: 90,
  },
  image: {
    position: 'absolute',
    top: -40,
    left: -10,
    width: 166 + 88,
    height: 136 + 68,
  },
});
