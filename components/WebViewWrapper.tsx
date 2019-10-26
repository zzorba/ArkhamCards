import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export interface WebViewProps {
  uri: string;
}

export default class WebViewWrapper extends React.Component<WebViewProps> {
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
