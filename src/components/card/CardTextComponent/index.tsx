import React, { useContext } from 'react';
import SimpleMarkdown from 'simple-markdown';
import {
  MarkdownView,
  MarkdownRule,
  RegexComponents,
  NestedParseFunction,
  ParseState,
} from 'react-native-markdown-view';

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
import SmallCapsNode from './SmallCapsNode';
import CenterNode from './CenterNode';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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

function ArkhamIconRule(style: StyleContextType): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\]')),
    order: 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(style),
  };
}

function ArkahmIconSpanRule(style: StyleContextType): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<span class="icon-(.+?)"( title="[^"]*")?></span>')),
    order: 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(style),
  };
}

function BreakTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/>')),
    order: 1,
    parse: () => {
      return { text: '\n' };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function SmallCapsHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<smallcaps>([\\s\\S]+?)<\\/smallcaps>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: SmallCapsNode(style),
  };
}

function EmphasisMarkdownTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[\\[([\\s\\S]+?)\\]\\]')),
    order: 0,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function MalformedBoldItalicHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([^<]+?)<\\/b><\\/i>')),
    order: 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function DelHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<del>([^<]+?)<\\/del>')),
    order: 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: StrikethroughTextNode(style),
  };
}

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

function BoldItalicHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([\\s\\S]+?)<\\/i><\\/b>')),
    order: 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function BoldHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b>([\\s\\S]+?)<\\/b>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: BoldHtmlTagNode(style),
  };
}

const CenterHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<center>([\\s\\S]+?)<\\/center>')),
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: CenterNode,
};

function UnderlineHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<u>([\\s\\S]+?)<\\/u>')),
    order: 2,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: UnderlineHtmlTagNode(style),
  };
}

function EmphasisHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<em>([\\s\\S]+?)<\\/em>')),
    order: 1,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: EmphasisHtmlTagNode(style),
  };
}

function ItalicHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<i>([\\s\\S]+?)<\\/i>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: ItalicHtmlTagNode(style),
  };
}

interface Props {
  text: string;
  onLinkPress?: (url: string) => void;
}

export default function CardText({ text, onLinkPress }: Props) {
  const context = useContext(StyleContext);
  const cleanText = text
    .replace(/&rarr;/g, '→')
    .replace(/\/n/g, '\n')
    .replace(/(^\s?-|^—\s+)(.+)$/gm,
      onLinkPress ? '<span class="icon-bullet"></span> $2' : '[bullet] $2'
    );

  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      rules={{
        emMarkdown: EmphasisMarkdownTagRule(context),
        arkhamIconSpan: ArkahmIconSpanRule(context),
        hrTag: HrTagRule,
        blockquoteTag: BlockquoteHtmlTagRule,
        delTag: DelHtmlTagRule(context),
        brTag: BreakTagRule(context),
        biTag: BoldItalicHtmlTagRule(context),
        badBiTag: MalformedBoldItalicHtmlTagRule(context),
        bTag: BoldHtmlTagRule(context),
        pTag: ParagraphTagRule,
        uTag: UnderlineHtmlTagRule(context),
        emTag: EmphasisHtmlTagRule(context),
        iTag: ItalicHtmlTagRule(context),
        smallcapsTag: SmallCapsHtmlTagRule(context),
        center: CenterHtmlTagRule,
        ...(onLinkPress ? {} : { arkhamIcon: ArkhamIconRule(context) }),
      }}
      styles={{
        list: {
          marginLeft: 4,
        },
        listItemBullet: {
          minWidth: 12,
          marginRight: 4,
        },
        paragraph: {
          ...context.typography.small,
          fontSize: 16 * context.fontScale,
          lineHeight: 20 * context.fontScale,
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
