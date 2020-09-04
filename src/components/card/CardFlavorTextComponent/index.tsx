import React from 'react';
import SimpleMarkdown from 'simple-markdown';
import {
  MarkdownView,
  MarkdownRule,
  RegexComponents,
  NestedParseFunction,
  ParseState,
} from 'react-native-markdown-view';

import { WithChildren, WithText, WithIconName, State } from '../CardTextComponent/types';
import COLORS from '@styles/colors';
import ArkhamIconNode from '../CardTextComponent/ArkhamIconNode';
import FlavorItalicNode from './FlavorItalicNode';
import FlavorBoldNode from './FlavorBoldNode';
import FlavorFancyNode from './FlavorFancyNode';
import FlavorCenterNode from './FlavorCenterNode';
import FlavorSmallCapsNode from './FlavorSmallCapsNode';
import FlavorRightNode from './FlavorRightNode';
import FlavorUnderlineNode from './FlavorUnderlineNode';
import CiteTagNode from './CiteTagNode';
import { isBig, xs } from '@styles/space';

const BreakTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/*>')),
  order: 1,
  parse: () => {
    return { text: '\n' };
  },
  render: FlavorUnderlineNode,
};


const ArkhamIconRule: MarkdownRule<WithIconName, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\]')),
  order: 1,
  parse: (capture) => {
    return { name: capture[1] };
  },
  render: ArkhamIconNode,
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

const ItalicHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<i>([\\s\\S]+?)<\\/i>')),
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorItalicNode,
};

const BoldHtmlTagRule: MarkdownRule<WithText, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b>(.+?)<\\/b>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: FlavorBoldNode,
};

const FancyHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<fancy>([\\s\\S]+?)<\\/fancy>')),
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorFancyNode,
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

const SmallCapsHtmlTagRule: MarkdownRule<WithChildren, State> = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<smallcaps>([\\s\\S]+?)<\\/smallcaps>')),
  order: 2,
  parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: FlavorSmallCapsNode,
};

interface Props {
  text: string;
  onLinkPress?: (url: string) => void;
  color?: string;
  fontAdjustment?: number;
}

export default function CardFlavorTextComponent(
  { text, onLinkPress, color, fontAdjustment }: Props
) {
  // Text that has hyperlinks uses a different style for the icons.
  return (
    <MarkdownView
      style={{
        marginBottom: xs,
      }}
      rules={{
        iconTag: ArkhamIconRule,
        bTag: BoldHtmlTagRule,
        uTag: UnderlineHtmlTagRule,
        brTag: BreakTagRule,
        citeTag: CiteTagRule,
        fancyTag: FancyHtmlTagRule,
        centerTag: CenterHtmlTagRule,
        rightTag: RightHtmlTagRule,
        iTag: ItalicHtmlTagRule,
        smallCapsTag: SmallCapsHtmlTagRule,
      }}
      onLinkPress={onLinkPress}
      styles={{
        paragraph: {
          fontSize: (fontAdjustment || 1) * (isBig ? 24 : 14),
          marginTop: 4,
          marginBottom: 4,
          fontWeight: '400',
          fontStyle: 'italic',
          color: color || COLORS.darkText,
        },
      }}
    >
      { text.replace(/\/n/g,'\n') }
    </MarkdownView>
  );
}
