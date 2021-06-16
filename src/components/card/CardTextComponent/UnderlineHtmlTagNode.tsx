import LanguageContext from '@lib/i18n/LanguageContext';
import { StyleContextType } from '@styles/StyleContext';
import React, { useContext } from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from './types';

export default function UnderlineHtmlTagNode(usePingFang: boolean, { typography }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[{
        fontFamily: usePingFang ? 'PingFangTC' : 'Alegreya',
        fontStyle: 'normal',
        fontWeight: '700',
      }, typography.underline]}>
        { node.text }
      </MarkdownText>
    );
  };
}
