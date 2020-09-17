import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';

import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export interface DeckDescriptionProps {
  description: string;
  update: (description: string) => void;
}

type Props = DeckDescriptionProps;

export default class DeckDescriptionView extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  richtext!: RichTextEditor;

  _captureRef = (ref: RichTextEditor) => {
    this.richtext = ref;
  };

  _getEditor = () => {
    return this.richtext;
  };

  render() {
    const { backgroundStyle } = this.context;
    return (
      <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
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
