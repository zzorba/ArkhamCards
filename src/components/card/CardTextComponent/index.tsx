import React, { useCallback, useContext, useMemo } from 'react';
import SimpleMarkdown from 'simple-markdown';
import { reduce } from 'lodash';
import {
  MarkdownView,
  MarkdownRule,
  RegexComponents,
  NestedParseFunction,
  ParseState,
  TableNode,
  OutputFunction,
  RenderState,
  InlineNode,
} from 'react-native-markdown-view';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Table, Cell, Row } from 'react-native-table-component';

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
import RedNode from './RedNode';
import FlavorMiniCapsNode from '../CardFlavorTextComponent/FlavorMiniCapsNode';
import FlavorTypewriterNode from '../CardFlavorTextComponent/FlavorTypewriterNode';

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
      avoidLinks ? new RegExp('^\\[([^\\]]+?)\\](?=$|[^(])') : new RegExp('^\\[([^\\]]+?)\\]')
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
    match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+?)\\](?=\\([0-9X]+\\))')),
    order: BASE_ORDER + 1,
    parse: (capture) => {
      return { name: capture[1] };
    },
    render: ArkhamIconNode(usePingFang, style, sizeScale),
  };
}

function RedTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<red>([\\s\\S]+?)<\\/red>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: RedNode(style),
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

function MiniCapsHtmlTagRule(): MarkdownRule<WithText, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<minicaps>([\\s\\S]+?)<\\/minicaps>')),
    order: 2,
    parse: (capture: RegexComponents) => {
      return { text: capture[1] };
    },
    render: FlavorMiniCapsNode,
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

function StrikeHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<strike>([\\s\\S]+?)<\\/strike>')),
    order: BASE_ORDER + 1,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: StrikethroughTextNode(style),
  };
}

function DelHtmlTagRule(style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<del>([^<]+?)<\\/del>')),
    order: BASE_ORDER + 1,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
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


const TypewriterHtmlTagRule = (style: StyleContextType): MarkdownRule<WithChildren, State> => {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<typewriter>([\\s\\S]+?)<\\/typewriter>')),
    order: 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
    },
    render: FlavorTypewriterNode(style),
  };
};

function UnderlineHtmlTagRule(usePingFang: boolean, style: StyleContextType): MarkdownRule<WithChildren, State> {
  return {
    match: SimpleMarkdown.inlineRegex(new RegExp('^<u>([\\s\\S]+?)<\\/u>')),
    order: BASE_ORDER + 2,
    parse: (capture: RegexComponents, nestedParse: NestedParseFunction, state: ParseState) => {
      return {
        children: nestedParse(capture[1], state),
      };
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

function renderTableCell(cell: InlineNode, row: number, column: number, rowCount: number, columnCount: number, output: OutputFunction, state: RenderState, styles: any) {
  const cellStyle: ViewStyle[] = [styles.tableCell]
  const contentStyle: TextStyle[] = [styles.tableCellContent]

  if (row % 2 === 0) {
    cellStyle.push(styles.tableCellEvenRow)
    contentStyle.push(styles.tableCellContentEvenRow)
  } else {
    cellStyle.push(styles.tableCellOddRow)
    contentStyle.push(styles.tableCellContentOddRow)
  }

  if (column % 2 === 0) {
    cellStyle.push(styles.tableCellEvenColumn)
    contentStyle.push(styles.tableCellContentEvenColumn)
  } else {
    cellStyle.push(styles.tableCellOddColumn)
    contentStyle.push(styles.tableCellContentOddColumn)
  }

  if (row === 1) {
    cellStyle.push(styles.tableHeaderCell)
    contentStyle.push(styles.tableHeaderCellContent)
  } else if (row === rowCount) {
    cellStyle.push(styles.tableCellLastRow)
    contentStyle.push(styles.tableCellContentLastRow)
  }

  if (column === columnCount) {
    cellStyle.push(styles.tableCellLastColumn)
    contentStyle.push(styles.tableCellContentLastColumn)
  }

  return (
    <Cell
      rowId={row}
      id={`${column}`}
      key={column}
      style={StyleSheet.flatten(cellStyle)}
      textStyle={StyleSheet.flatten(contentStyle)}
      data={output(cell, state)}
    />
  );
}

const TableRule: MarkdownRule<TableNode, State> = {
  order: 0,
  render: (node: TableNode, output: OutputFunction, state: RenderState & State, styles: any) => (
    <Table key={state.key} borderStyle={{ borderWidth: 1 }} style={{ width: '100%' }}>
      {[
        <Row
          id="1"
          key={1}
          style={{ flexDirection: 'row' }}
          data={node.header.map((cell, column) => renderTableCell(cell, 1, column + 1, node.cells.length + 1, node.header.length, output, state, styles))}
        />,
      ].concat(node.cells.map((cells, row) => (
        <Row
          id={`${row + 2}`}
          key={row + 2}
          style={{ flexDirection: 'row' }}
          data={cells.map((cell, column) => renderTableCell(cell, row + 2, column + 1, node.cells.length + 1, cells.length, output, state, styles))}
        />
      )))}
    </Table>
  ),
}

const WEIRD_BULLET_REGEX = /\\u2022/g;
const ICON_HTML_REGEX = /<span class="icon-([^"]+?)"><\/span>/g;
const ARRAY_XML_REGEX = /&rarr;/g;
const BAD_LINEBREAK_REGEX = /\/n/g;
const DIVIDER_REGEX = /^---*$/gm;
const INDENTED_BULLET_REGEX = /(^\s?--|^-—\s+)([^0-9].+)$/gm;
const BULLET_REGEX = /(^\s?-|^—\s+)([^0-9].+)$/gm;
const GUIDE_BULLET_REGEX = /(^\s?=|^=\s+)([^0-9].+)$/gm;
const PARAGRAPH_BULLET_REGEX = /(<p>- )|(<p>–)/gm;

export default function CardTextComponent({ text, onLinkPress, sizeScale = 1, noBullet }: Props) {
  const { usePingFang } = useContext(LanguageContext);
  const context = useContext(StyleContext);
  const cleanTextA = text
    .replace(WEIRD_BULLET_REGEX, '•')
    .replace(ICON_HTML_REGEX, '[$1]')
    .replace(ARRAY_XML_REGEX, '→')
    .replace(BAD_LINEBREAK_REGEX, '\n')
    .replace(DIVIDER_REGEX, '<hr>');
  const cleanText = noBullet ? cleanTextA :
    cleanTextA.replace(INDENTED_BULLET_REGEX,
      onLinkPress ? '\t<span class="icon-bullet"></span> $2' : '\t[bullet] $2'
    ).replace(BULLET_REGEX,
      onLinkPress ? '<span class="icon-bullet"></span> $2' : '[bullet] $2'
    ).replace(GUIDE_BULLET_REGEX,
      onLinkPress ? '<span class="icon-guide_bullet"></span> $2' : '[guide_bullet] $2'
    ).replace(PARAGRAPH_BULLET_REGEX, onLinkPress ? '<p><span class="icon-bullet"></span> ' : '<p>[bullet] ');

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
      strikeTag: StrikeHtmlTagRule(context),
      brTag: BreakTagRule(usePingFang, context),
      biTag: BoldItalicHtmlTagRule(usePingFang, context),
      badBiTag: MalformedBoldItalicHtmlTagRule(usePingFang, context),
      bTag: BoldHtmlTagRule(usePingFang, context, sizeScale),
      pTag: ParagraphTagRule,
      redTag: RedTagRule(context),
      uTag: UnderlineHtmlTagRule(usePingFang, context),
      emTag: EmphasisHtmlTagRule(usePingFang, context),
      iTag: ItalicHtmlTagRule(usePingFang, context),
      table: TableRule,
      typewriterTag: TypewriterHtmlTagRule(context),
      smallcapsTag: SmallCapsHtmlTagRule(context),
      minicapsTag: MiniCapsHtmlTagRule(),
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
      alignSelf: 'flex-start',
      flexShrink: 1,
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
          paddingTop: 8,
          paddingBottom: 8,
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
        'TT2020 Style E': {
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
        'TT2020StyleE-Regular': {
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
        'Alegreya SC': {
          fontWeights: {
            300: 'Medium',
            400: 'Medium',
            700: 'Medium',
            800: 'Medium',
            900: 'Medium',
            normal: 'Medium',
            bold: 'Medium',
          },
          fontStyles: {
            normal: '',
            italic: 'Italic',
          },
        },
        'AlegreyaSC-Medium': {
          fontWeights: {
            300: 'Medium',
            400: 'Medium',
            500: 'Medium',
            700: 'Medium',
            800: 'Medium',
            900: 'Medium',
            normal: 'Medium',
            bold: 'Medium',
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
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexShrink: 1,
        backgroundColor: '0xBB8888',
      }}
      onLinkPress={onLinkPress ? wrappedOnLinkPress : undefined}
    >
      { cleanText }
    </MarkdownView>
  );
}
