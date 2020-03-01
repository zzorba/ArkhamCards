import React, { useState, useEffect } from "react";
import { map } from 'lodash';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';
import { t } from 'ttag';

export interface DeckDescriptionProps {
  description: string;
  update: (description: string) => void;
}

type Props = DeckDescriptionProps;

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
};

export default class DeckDescriptionView extends React.Component<Props> {
  richtext?: RichTextEditor;

  _captureRef = (ref: RichTextEditor) => {
    this.richtext = ref;
  };

  render() {
    const { description } = this.props;
    return (
      <SafeAreaView style={styles.wrapper}>
        <RichTextEditor
          ref={this._captureRef}
          initialContentHtml=""
          enableOnChange
          hiddenTitle
        />
        <RichTextToolbar
          getEditor={() => this.richtext}
          onPressAddLink={this._onAddLink}
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
