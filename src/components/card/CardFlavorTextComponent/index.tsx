import React, { useContext } from 'react';
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
import CiteTagNode from './CiteTagNode';
import { xs } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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

const CiteTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<cite>(.+?)<\\/cite>')),
  order: 1,
  parse: (capture) => {
    return { text: `  — ${capture[1]}` };
  },
  render: CiteTagNode,
};

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

interface Props {
  text: string;
  onLinkPress?: (url: string) => void;
  color?: string;
  fontAdjustment?: number;
}

export default function CardFlavorTextComponent(
  { text, onLinkPress, color, fontAdjustment }: Props
) {
  const context = useContext(StyleContext);
  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      style={{
        marginBottom: xs,
      }}
      rules={{
        iconTag: ArkhamIconRule(context),
        bTag: BoldHtmlTagRule(context),
        uTag: UnderlineHtmlTagRule(context),
        brTag: BreakTagRule(context),
        citeTag: CiteTagRule,
        fancyTag: FancyHtmlTagRule(context),
        centerTag: CenterHtmlTagRule,
        rightTag: RightHtmlTagRule,
        iTag: ItalicHtmlTagRule(context),
        smallCapsTag: SmallCapsHtmlTagRule(context),
      }}
      onLinkPress={onLinkPress}
      styles={{
        paragraph: {
          fontFamily: 'Alegreya-Italic',
          lineHeight: (fontAdjustment || 1) * 18,
          fontSize: (fontAdjustment || 1) * 14,
          marginTop: 4,
          marginBottom: 4,
          color: color || context.colors.darkText,
        },
      }}
    >
      { text.replace(/\/n/g,'\n') }
    </MarkdownView>
  );
}
