import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, WebView } from 'react-native';

export default class WebViewWrapper extends React.Component {
  static propTypes = {
    uri: PropTypes.string.isRequired,
  };

  render() {
    return (
      <WebView
        source={{ uri: this.props.uri }}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});
