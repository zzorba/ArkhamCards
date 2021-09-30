import React, { useCallback, useContext, useMemo } from 'react';
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
import RightNode from './RightNode';
import UnderlineHtmlTagNode from './UnderlineHtmlTagNode';
import StrikethroughTextNode from './StrikethroughTextNode';
import SmallCapsNode from './SmallCapsNode';
import CenterNode from './CenterNode';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import LanguageContext from '@lib/i18n/LanguageContext';
import { TextStyle } from 'react-native';

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

function ArkhamIconRule(usePingFang: boolean, style: StyleContextType, sizeScale: number, avoidLinks: boolean): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(
      avoidLinks ? new RegExp('^\\[([^\\]]+)\\](?=$|[^(])') : new RegExp('^\\[([^\\]]+)\\]')
    ),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(usePingFang, style, sizeScale),
  };
}

function ArkhamIconSkillTextRule(usePingFang: boolean, style: StyleContextType, sizeScale: number): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\](?=\\([0-9X]+\\))')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(usePingFang, style, sizeScale),
  };
}

function ArkahmIconSpanRule(usePingFang: boolean, style: StyleContextType, sizeScale: number): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<span class="icon-([^"]+)"( title="[^"]*")?><\\/span>')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(usePingFang, style, sizeScale),
  };
}

function BreakTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/>')),
    order: BASE_ORDER + 1,
    parse: () => {
      return { text: '\n' };
    },
    render: BoldItalicHtmlTagNode(usePingFang, style),
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

function EmphasisMarkdownTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[\\[([\\s\\S]+?)\\]\\]')),
    order: BASE_ORDER + 0,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(usePingFang, style),
  };
}

function MalformedBoldItalicHtmlTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([^<]+?)<\\/b><\\/i>')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(usePingFang, style),
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
  match: SimpleMarkdown.inlineRegex(new RegExp('^<hr[/]?>')),
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

function BoldItalicHtmlTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([\\s\\S]+?)<\\/i><\\/b>')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: BoldItalicHtmlTagNode(usePingFang, style),
  };
}

function BoldHtmlTagRule(usePingFang: boolean, style: StyleContextType, sizeScale: number): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b>([\\s\\S]+?)<\\/b>')),
    order: BASE_ORDER + 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: BoldHtmlTagNode(usePingFang, style, sizeScale),
  };
}

const CenterHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<center>([\\s\\S]+?)<\\/center>')),
  order: BASE_ORDER + 3,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: CenterNode,
};


const RightHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<right>(([\\s\\S]+?))<\\/right>')),
  order: BASE_ORDER + 3,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: RightNode,
};

function UnderlineHtmlTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<u>([\\s\\S]+?)<\\/u>')),
    order: BASE_ORDER + 2,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: UnderlineHtmlTagNode(usePingFang, style),
  };
}

function EmphasisHtmlTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<em>([\\s\\S]+?)<\\/em>')),
    order: BASE_ORDER + 1,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: EmphasisHtmlTagNode(usePingFang, style),
  };
}

function ItalicHtmlTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<i>([\\s\\S]+?)<\\/i>')),
    order: BASE_ORDER + 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: ItalicHtmlTagNode(usePingFang, style),
  };
}

interface Props {
  text: string;
  onLinkPress?: (url: string, context: StyleContextType) => void;
  sizeScale?: number;
  noBullet?: boolean;
}

export default function CardTextComponent({ text, onLinkPress, sizeScale = 1, noBullet }: Props) {
  const { usePingFang } = useContext(LanguageContext);
  const context = useContext(StyleContext);
  const cleanTextA = text
    .replace(/\\u2022/g, '•')
    .replace(/<span class="icon-([^"]+?)"><\/span>/g, '[$1]')
    .replace(/&rarr;/g, '→')
    .replace(/\/n/g, '\n')
    .replace(/^---*$/gm, '<hr>');
  const cleanText = noBullet ? cleanTextA :
    cleanTextA.replace(/(^\s?-|^—\s+)([^0-9].+)$/gm,
      onLinkPress ? '<span class="icon-bullet"></span> $2' : '[bullet] $2'
    ).replace(/(<p>- )|(<p>–)/gm, onLinkPress ? '<p><span class="icon-bullet"></span> ' : '<p>[bullet] ');

  const wrappedOnLinkPress = useCallback((url: string) => {
    onLinkPress && onLinkPress(url, context);
  }, [onLinkPress, context]);
  const rules = useMemo(() => {
    return {
      emMarkdown: EmphasisMarkdownTagRule(usePingFang, context),
      arkhamIconSpan: ArkahmIconSpanRule(usePingFang, context, sizeScale),
      hrTag: HrTagRule,
      blockquoteTag: BlockquoteHtmlTagRule,
      delTag: DelHtmlTagRule(context),
      brTag: BreakTagRule(usePingFang, context),
      biTag: BoldItalicHtmlTagRule(usePingFang, context),
      badBiTag: MalformedBoldItalicHtmlTagRule(usePingFang, context),
      bTag: BoldHtmlTagRule(usePingFang, context, sizeScale),
      pTag: ParagraphTagRule,
      uTag: UnderlineHtmlTagRule(usePingFang, context),
      emTag: EmphasisHtmlTagRule(usePingFang, context),
      iTag: ItalicHtmlTagRule(usePingFang, context),
      smallcapsTag: SmallCapsHtmlTagRule(context),
      center: CenterHtmlTagRule,
      right: RightHtmlTagRule,
      arkhamIcon: ArkhamIconRule(usePingFang, context, sizeScale, !!onLinkPress),
      arkhamIconSkillTestRule: ArkhamIconSkillTextRule(usePingFang, context, sizeScale),
    };
  }, [usePingFang, context, sizeScale, onLinkPress]);
  const textStyle: TextStyle = useMemo(() => {
    return {
      fontFamily: usePingFang ? 'PingFangTC' : 'Alegreya',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16 * context.fontScale * sizeScale,
      lineHeight: 20 * context.fontScale * sizeScale,
      marginTop: 4,
      marginBottom: 4,
      color: context.colors.darkText,
      textAlign: context.justifyContent ? 'justify' : undefined,
    };
  }, [context, usePingFang, sizeScale]);
  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      rules={rules}
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
          textDecorationLine: 'underline',
        },
        tableHeaderCell: {
          minHeight: 40,
        },
        tableHeaderCellContent: {
          ...context.typography.small,
          ...context.typography.bold,
          fontFamily: 'Alegreya',
          fontStyle: 'normal',
          fontWeight: '700',
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
        paragraph: textStyle,
        tableCellContent: {
          ...context.typography.small,
          fontFamily: 'Alegreya',
          fontStyle: 'normal',
          margin: 0,
          padding: 16,
          paddingTop: 16,
          paddingBottom: 16,
        },
      }}
      fonts={{
        PingFangTC: {
          fontWeights: {
            300: 'Light',
            400: 'Regular',
            700: 'Semibold',
            800: 'ExtraBold',
            900: 'Black',
            normal: 'Regular',
            bold: 'Bold',
          },
          fontStyles: {
            normal: '',
            italic: 'Light',
          },
        },
        Courier: {
          fontWeights: {
            300: 'Light',
            400: 'Regular',
            500: 'Regular',
            700: 'Bold',
            800: 'ExtraBold',
            900: 'Black',
            normal: 'Regular',
            bold: 'Bold',
          },
          fontStyles: {
            normal: '',
            italic: 'Italic',
          },
        },
        Alegreya: {
          fontWeights: {
            300: 'Light',
            400: 'Regular',
            700: 'Bold',
            800: 'ExtraBold',
            900: 'Black',
            normal: 'Regular',
            bold: 'Bold',
          },
          fontStyles: {
            normal: '',
            italic: 'Italic',
          },
        },
        'Teutonic RU': {
          fontWeights: {
            300: 'Regular',
            400: 'Regular',
            500: 'Regular',
            600: 'Regular',
            700: 'Regular',
            normal: 'Regular',
          },
          fontStyles: {
            normal: '',
            italic: '',
          },
        },
        Teutonic: {
          fontWeights: {
            300: 'Regular',
            400: 'Regular',
            500: 'Regular',
            600: 'Regular',
            700: 'Regular',
            normal: 'Regular',
          },
          fontStyles: {
            normal: '',
            italic: '',
          },
        },
      }}
      onLinkPress={onLinkPress ? wrappedOnLinkPress : undefined}
    >
      { cleanText }
    </MarkdownView>
  );
}
