import React, { useContext, useMemo } from 'react';
import SimpleMarkdown from 'simple-markdown';
import {
  MarkdownView,
  MarkdownRule,
  RegexComponents,
  NestedParseFunction,
  ParseState,
} from 'react-native-markdown-view';

import { WithChildren, WithText, WithIconName, State } from '../CardTextComponent/types';
import ArkhamIconNode from '../CardTextComponent/ArkhamIconNode';
import FlavorItalicNode from './FlavorItalicNode';
import FlavorBoldNode from './FlavorBoldNode';
import FlavorFancyNode from './FlavorFancyNode';
import FlavorCenterNode from './FlavorCenterNode';
import FlavorSmallCapsNode from './FlavorSmallCapsNode';
import FlavorRightNode from './FlavorRightNode';
import FlavorUnderlineNode from './FlavorUnderlineNode';
import InnsmouthNode from './InnsmouthNode';
import GameTextNode from './GameTextNode';
import FlavorBlockquoteHtmlTagNode from './FlavorBlockquoteHtmlTagNode';

import CiteTagNode from './CiteTagNode';
import { xs } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { TextStyle } from 'react-native';
import LanguageContext from '@lib/i18n/LanguageContext';

function BreakTagRule(): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/*>')),
    order: 1,
    parse: () => {
      return { text: '\n' };
    },
    render: FlavorUnderlineNode(),
  };
}


function ArkhamIconRule(usePingFang: boolean, style: StyleContextType, sizeScale: number): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]…]+)\\]')),
    order: 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(usePingFang, style, sizeScale),
  };
}

function CiteTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<cite>(.+?)<\\/cite>')),
    order: 1,
    parse: (capture) => {
      return { text: `  — ${capture[1]}` };
    },
    render: CiteTagNode(style),
  };
}

function UnderlineHtmlTagRule(): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<u>(.+?)<\\/u>')),
    order: 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: FlavorUnderlineNode(),
  };
}

function ItalicHtmlTagRule(): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<i>([\\s\\S]+?)<\\/i>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: FlavorItalicNode(),
  };
}


function BoldHtmlTagRule(usePingFang: boolean): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b>(.+?)<\\/b>')),
    order: 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: FlavorBoldNode(usePingFang),
  };
}

const FancyHtmlTagRule = (style: StyleContextType): MarkdownRule<WithChildren, State> => {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<fancy>([\\s\\S]+?)<\\/fancy>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: FlavorFancyNode(style),
  };
};

const CenterHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<center>([\\s\\S]+?)<\\/center>')),
  order: 3,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorCenterNode,
};

const RightHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<right>(([\\s\\S]+?))<\\/right>')),
  order: 3,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorRightNode,
};

const BlockquoteHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.blockRegex(new RegExp('^<blockquote>([\\s\\S]+?)<\\/blockquote>')),
  order: 0,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorBlockquoteHtmlTagNode,
};

function SmallCapsHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<smallcaps>([\\s\\S]+?)<\\/smallcaps>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: FlavorSmallCapsNode(style),
  };
}

function InnsmouthTagRule(style: StyleContextType, sizeScale: number): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<innsmouth>([\\s\\S]+?)<\\/innsmouth>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: InnsmouthNode(sizeScale, style),
  };
}

function GameTagRule(style: StyleContextType, sizeScale: number): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<game>([\\s\\S]+?)<\\/game>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: GameTextNode(style, sizeScale),
  };
}

interface Props {
  text: string;
  onLinkPress?: (url: string) => void;
  color?: string;
  width?: string | number;
  sizeScale?: number;
}

export default function CardFlavorTextComponent(
  { text, onLinkPress, color, width, sizeScale = 1 }: Props
) {
  const context = useContext(StyleContext);
  const { usePingFang } = useContext(LanguageContext);

  const textStyle: TextStyle = useMemo(() => {
    return {
      fontFamily: usePingFang ? 'PingFangTC' : 'Alegreya',
      fontStyle: 'italic',
      fontWeight: 'normal',
      fontSize: 16 * context.fontScale * sizeScale,
      lineHeight: 20 * context.fontScale * sizeScale,
      marginTop: 4,
      marginBottom: 4,
      color: color || context.colors.darkText,
      textAlign: context.justifyContent ? 'justify' : undefined,
    };
  }, [context, usePingFang, sizeScale, color]);
  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      style={{
        marginBottom: xs,
        width,
      }}
      rules={{
        blockquoteTag: BlockquoteHtmlTagRule,
        iconTag: ArkhamIconRule(usePingFang, context, sizeScale),
        bTag: BoldHtmlTagRule(usePingFang),
        uTag: UnderlineHtmlTagRule(),
        brTag: BreakTagRule(),
        citeTag: CiteTagRule(context),
        fancyTag: FancyHtmlTagRule(context),
        centerTag: CenterHtmlTagRule,
        rightTag: RightHtmlTagRule,
        iTag: ItalicHtmlTagRule(),
        smallCapsTag: SmallCapsHtmlTagRule(context),
        innsmouthTag: InnsmouthTagRule(context, sizeScale),
        gameTag: GameTagRule(context, sizeScale),
      }}
      onLinkPress={onLinkPress}
      styles={{
        paragraph: textStyle,
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
        AboutDead: {
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
        Caveat: {
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
    >
      { text.replace(/\/n/g,'\n') }
    </MarkdownView>
  );
}
