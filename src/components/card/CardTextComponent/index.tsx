import React, { useCallback, useContext } from 'react';
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

const BASE_ORDER = 0;
const ParagraphTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<p>(.+?)<\\/p>')),
  order: BASE_ORDER + 0,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: ParagraphHtmlTagNode,
};

function ArkhamIconRule(style: StyleContextType, sizeScale: number): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\](?=$|[^(])')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(style, sizeScale),
  };
}

function ArkhamIconSkillTextRule(style: StyleContextType, sizeScale: number): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\](?=\\([0-9X]+\\))')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(style, sizeScale),
  };
}

function ArkahmIconSpanRule(style: StyleContextType, sizeScale: number): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<span class="icon-(.+?)"( title="[^"]*")?></span>')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      console.log(capture[1]);
      return { name: capture[1] };
    },
    render: ArkhamIconNode(style, sizeScale),
  };
}

function BreakTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/>')),
    order: BASE_ORDER + 1,
    parse: () => {
      return { text: '\n' };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function SmallCapsHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<smallcaps>([\\s\\S]+?)<\\/smallcaps>')),
    order: BASE_ORDER + 2,
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
    order: BASE_ORDER + 0,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function MalformedBoldItalicHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([^<]+?)<\\/b><\\/i>')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function DelHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<del>([^<]+?)<\\/del>')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: StrikethroughTextNode(style),
  };
}

const HrTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<hr>')),
  order: BASE_ORDER + 1,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return { children: nestedParse(capture[1], state) };
  },
  render: HrTagNode,
};

const BlockquoteHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<blockquote>([\\s\\S]+?)<\\/blockquote>')),
  order: BASE_ORDER + 1,
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
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(style),
  };
}

function BoldHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b>([\\s\\S]+?)<\\/b>')),
    order: BASE_ORDER + 2,
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
  order: BASE_ORDER + 2,
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
    order: BASE_ORDER + 2,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: UnderlineHtmlTagNode(style),
  };
}

function EmphasisHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<em>([\\s\\S]+?)<\\/em>')),
    order: BASE_ORDER + 1,
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
    order: BASE_ORDER + 2,
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
  onLinkPress?: (url: string, context: StyleContextType) => void;
  sizeScale?: number;
}

export default function CardTextComponent({ text, onLinkPress, sizeScale = 1 }: Props) {
  const context = useContext(StyleContext);
  const cleanText = text
    .replace(/\\u2022/g, '•')
    .replace(/<span class="icon-(.+?)"><\/span>/g, '[$1]')
    .replace(/&rarr;/g, '→')
    .replace(/\/n/g, '\n')
    .replace(/^---*$/gm, '<hr>')
    .replace(/(^\s?-|^—\s+)(.+)$/gm,
      onLinkPress ? '<span class="icon-bullet"></span> $2' : '[bullet] $2'
    );
  const wrappedOnLinkPress = useCallback((url: string) => {
    onLinkPress && onLinkPress(url, context);
  }, [onLinkPress, context]);

  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      rules={{
        emMarkdown: EmphasisMarkdownTagRule(context),
        arkhamIconSpan: ArkahmIconSpanRule(context, sizeScale),
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
        arkhamIcon: ArkhamIconRule(context, sizeScale),
        arkhamIconSkillTestRule: ArkhamIconSkillTextRule(context, sizeScale),
      }}
      style={{ width: '100%' }}
      styles={{
        list: {
          marginLeft: 4,
        },
        listItemBullet: {
          minWidth: 12,
          marginRight: 4,
        },
        link: {
          color: context.colors.navButton,
        },
        paragraph: {
          fontFamily: 'Alegreya-Regular',
          color: context.colors.darkText,
          fontSize: 16 * context.fontScale * sizeScale,
          lineHeight: 20 * context.fontScale * sizeScale,
          marginTop: 4,
          marginBottom: 4,
        },
        tableHeaderCell: {
          minHeight: 40,
        },
        tableHeaderCellContent: {
          ...context.typography.small,
          ...context.typography.bold,
          minHeight: 50,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tableCell: {
          minHeight: 40,
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 8,
          margin: 0,
        },
        tableCellContent: {
          ...context.typography.small,
          margin: 0,
          padding: 16,
          paddingTop: 16,
          paddingBottom: 16,
        },
      }}
      onLinkPress={onLinkPress ? wrappedOnLinkPress : undefined}
    >
      { cleanText }
    </MarkdownView>
  );
}
