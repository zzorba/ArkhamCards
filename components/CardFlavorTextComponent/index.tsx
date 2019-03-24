import React from 'react';
import PropTypes from 'prop-types';
import SimpleMarkdown from 'simple-markdown';
import {
  MarkdownView,
  MarkdownRule,
  RegexComponents,
  NestedParseFunction,
  ParseState,
} from 'react-native-markdown-view';

import { WithText, State } from '../CardTextComponent/types';
import { isBig } from '../../styles/space';
import FlavorUnderlineNode from './FlavorUnderlineNode';
import CiteTagNode from './CiteTagNode';

const BreakTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/*>')),
  order: 1,
  parse: () => {
    return { text: '\n' };
  },
  render: FlavorUnderlineNode,
};

const CiteTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<cite>(.+?)<\\/cite>')),
  order: 1,
  parse: (capture) => {
    return { text: `  — ${capture[1]}` };
  },
  render: CiteTagNode,
};

const UnderlineHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<u>(.+?)<\\/u>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: FlavorUnderlineNode,
};

interface Props {
  text: string;
  onLinkPress?: (url:  string) => void;
}

export default function CardFlavorTextComponent(
  { text, onLinkPress }: Props
) {
  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      style={{
        marginBottom: 4,
      }}
      rules={{
        uTag: UnderlineHtmlTagRule,
        brTag: BreakTagRule,
        citeTag: CiteTagRule,
      }}
      onLinkPress={onLinkPress}
      styles={{
        paragraph: {
          fontSize: isBig ? 24 : 14,
          fontWeight: isBig ? '300' : '100',
          fontStyle: 'italic',
        },
      }}
    >
      { text.replace(/\/n/g,'\n') }
    </MarkdownView>
  );
}
