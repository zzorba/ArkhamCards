import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';

export interface DeckDescriptionProps {
  description: string;
  update: (description: string) => void;
}

type Props = DeckDescriptionProps;

export default class DeckDescriptionView extends React.Component<Props> {
  richtext!: RichTextEditor;

  _captureRef = (ref: RichTextEditor) => {
    this.richtext = ref;
  };

  _getEditor = () => {
    return this.richtext;
  };

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        <RichTextEditor
          ref={this._captureRef}
          // @ts-ignore TS2769
          initialContentHtml=""
          enableOnChange
          hiddenTitle
        />
        <RichTextToolbar
          getEditor={this._getEditor}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
});
