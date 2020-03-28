import React from 'react';
import SimpleMarkdown from 'simple-markdown';
import {
  MarkdownView,
  MarkdownRule,
} from 'react-native-markdown-view';

import { WithText, State } from '../CardTextComponent/types';
import { isBig } from 'styles/space';
import { COLORS } from 'styles/colors';
import FlavorBoldNode from './FlavorBoldNode';
import FlavorFancyNode from './FlavorFancyNode';
import FlavorFancyCenterNode from './FlavorFancyCenterNode';
import FlavorFancyRightNode from './FlavorFancyRightNode';
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

const BoldHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b>(.+?)<\\/b>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: FlavorBoldNode,
};

const FancyHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<fancy>(.+?)<\\/fancy>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: FlavorFancyNode,
};

const CenterHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<center><fancy>(.+?)<\\/fancy><\\/center>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: FlavorFancyCenterNode,
};

const RightHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<right><fancy>(.+?)<\\/fancy><\\/right>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: FlavorFancyRightNode,
};

interface Props {
  text: string;
  onLinkPress?: (url: string) => void;
  color?: string;
}

export default function CardFlavorTextComponent(
  { text, onLinkPress, color }: Props
) {
  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      style={{
        marginBottom: 4,
      }}
      rules={{
        bTag: BoldHtmlTagRule,
        uTag: UnderlineHtmlTagRule,
        brTag: BreakTagRule,
        citeTag: CiteTagRule,
        fancyTag: FancyHtmlTagRule,
        centerTag: CenterHtmlTagRule,
        rightTag: RightHtmlTagRule,
      }}
      onLinkPress={onLinkPress}
      styles={{
        paragraph: {
          fontSize: isBig ? 24 : 14,
          fontWeight: '400',
          fontStyle: 'italic',
          color: color || COLORS.darkGray,
        },
      }}
    >
      { text.replace(/\/n/g,'\n') }
    </MarkdownView>
  );
}
