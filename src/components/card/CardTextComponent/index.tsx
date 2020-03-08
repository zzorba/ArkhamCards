import React from 'react';
import SimpleMarkdown from 'simple-markdown';
import {
  MarkdownView,
  MarkdownRule,
  RegexComponents,
  NestedParseFunction,
  ParseState,
} from 'react-native-markdown-view';

import { isBig } from 'styles/space';

import { WithChildren, WithIconName, WithText, State } from './types';
import ArkhamIconNode from './ArkhamIconNode';
import BlockquoteHtmlTagNode from './BlockquoteHtmlTagNode';
import BoldHtmlTagNode from './BoldHtmlTagNode';
import BoldItalicHtmlTagNode from './BoldItalicHtmlTagNode';
import ItalicHtmlTagNode from './ItalicHtmlTagNode';
import EmphasisHtmlTagNode from './EmphasisHtmlTagNode';
import HrTagNode from './HrTagNode';
import ParagraphHtmlTagNode from './ParagraphHtmlTagNode';
import UnderlineHtmlTagNode from './UnderlineHtmlTagNode';
import StrikethroughTextNode from './StrikethroughTextNode';

const ParagraphTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<p>(.+?)<\\/p>')),
  order: 0,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: ParagraphHtmlTagNode,
};

const ArkhamIconRule: MarkdownRule<WithIconName, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\]')),
  order: 1,
  parse: (capture) => {
    return { name: capture[1] };
  },
  render: ArkhamIconNode,
};

const ArkahmIconSpanRule: MarkdownRule<WithIconName, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<span class="icon-(.+?)"( title="[^"]*")?></span>')),
  order: 1,
  parse: (capture) => {
    return { name: capture[1] };
  },
  render: ArkhamIconNode,
};

const BreakTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/>')),
  order: 1,
  parse: () => {
    return { text: '\n' };
  },
  render: BoldItalicHtmlTagNode,
};

const EmphasisMarkdownTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^\\[\\[([\\s\\S]+?)\\]\\]')),
  order: 0,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: BoldItalicHtmlTagNode,
};

const MalformedBoldItalicHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([^<]+?)<\\/b><\\/i>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: BoldItalicHtmlTagNode,
};

const DelHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<del>([^<]+?)<\\/del>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: StrikethroughTextNode,
};

const HrTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<hr>')),
  order: 1,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return { children: nestedParse(capture[1], state) };
  },
  render: HrTagNode,
};

const BlockquoteHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<blockquote>([\\s\\S]+?)<\\/blockquote>')),
  order: 1,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: BlockquoteHtmlTagNode,
};

const BoldItalicHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([\\s\\S]+?)<\\/i><\\/b>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: BoldItalicHtmlTagNode,
};

const BoldHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b>([\\s\\S]+?)<\\/b>')),
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: BoldHtmlTagNode,
};

const UnderlineHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<u>([\\s\\S]+?)<\\/u>')),
  order: 2,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: UnderlineHtmlTagNode,
};

const EmphasisHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<em>([\\s\\S]+?)<\\/em>')),
  order: 1,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: EmphasisHtmlTagNode,
};

const ItalicHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<i>([\\s\\S]+?)<\\/i>')),
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: ItalicHtmlTagNode,
};


interface Props {
  text: string;
  onLinkPress?: (url: string) => void;
}

export default function CardText({ text, onLinkPress }: Props) {
  const cleanText = text
    .replace(/&rarr;/g, '→')
    .replace(/\/n/g, '\n')
    .replace(/^\s?-|—\s+(.+)$/gm,
      onLinkPress ? '<span class="icon-bullet"></span> $1' : '[bullet] $1'
    );

  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      rules={
        Object.assign({
          emMarkdown: EmphasisMarkdownTagRule,
          arkhamIconSpan: ArkahmIconSpanRule,
          hrTag: HrTagRule,
          blockquoteTag: BlockquoteHtmlTagRule,
          delTag: DelHtmlTagRule,
          brTag: BreakTagRule,
          biTag: BoldItalicHtmlTagRule,
          badBiTag: MalformedBoldItalicHtmlTagRule,
          bTag: BoldHtmlTagRule,
          pTag: ParagraphTagRule,
          uTag: UnderlineHtmlTagRule,
          emTag: EmphasisHtmlTagRule,
          iTag: ItalicHtmlTagRule,
        }, onLinkPress ? {} : { arkhamIcon: ArkhamIconRule })
      }
      styles={{
        list: {
          marginLeft: 4,
        },
        listItemBullet: {
          minWidth: 12,
          marginRight: 4,
        },
        paragraph: {
          fontSize: isBig ? 24 : 14,
          marginTop: 4,
          marginBottom: 4,
        },
      }}
      onLinkPress={onLinkPress}
    >
      { cleanText }
    </MarkdownView>
  );
}
