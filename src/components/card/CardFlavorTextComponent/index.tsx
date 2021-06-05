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

import CiteTagNode from './CiteTagNode';
import { xs } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { TextStyle } from 'react-native';

function BreakTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/*>')),
    order: 1,
    parse: () => {
      return { text: '\n' };
    },
    render: FlavorUnderlineNode(style),
  };
}


function ArkhamIconRule(style: StyleContextType, sizeScale: number): MarkdownRule<WithIconName, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]…]+)\\]')),
    order: 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(style, sizeScale),
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

function UnderlineHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<u>(.+?)<\\/u>')),
    order: 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: FlavorUnderlineNode(style),
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
    render: FlavorItalicNode(style),
  };
}

function BoldHtmlTagRule(style: StyleContextType): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<b>(.+?)<\\/b>')),
    order: 1,
    parse: (capture) => {
      return { text: capture[1] };
    },
    render: FlavorBoldNode(style),
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
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorCenterNode,
};

const RightHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<right>([\\s\\S]+?)<\\/right>')),
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorRightNode,
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

function InnsmouthTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<innsmouth>([\\s\\S]+?)<\\/innsmouth>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: InnsmouthNode(style),
  };
}

function GameTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<game>([\\s\\S]+?)<\\/game>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: GameTextNode(style),
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
  const textStyle: TextStyle = useMemo(() => {
    return {
      fontFamily: 'Alegreya',
      fontStyle: 'italic',
      fontWeight: 'normal',
      fontSize: 16 * context.fontScale * sizeScale,
      lineHeight: 20 * context.fontScale * sizeScale,
      marginTop: 4,
      marginBottom: 4,
      color: color || context.colors.darkText,
      textAlign: context.justifyContent ? 'justify' : 'left',
    };
  }, [context, sizeScale, color]);
  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      style={{
        marginBottom: xs,
        width,
      }}
      rules={{
        iconTag: ArkhamIconRule(context, sizeScale),
        bTag: BoldHtmlTagRule(context),
        uTag: UnderlineHtmlTagRule(context),
        brTag: BreakTagRule(context),
        citeTag: CiteTagRule(context),
        fancyTag: FancyHtmlTagRule(context),
        centerTag: CenterHtmlTagRule,
        rightTag: RightHtmlTagRule,
        iTag: ItalicHtmlTagRule(context),
        smallCapsTag: SmallCapsHtmlTagRule(context),
        innsmouthTag: InnsmouthTagRule(context),
        gameTag: GameTagRule(context),
      }}
      onLinkPress={onLinkPress}
      styles={{
        paragraph: textStyle,
      }}
      fonts={{
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
      }}
    >
      { text.replace(/\/n/g,'\n') }
    </MarkdownView>
  );
}
