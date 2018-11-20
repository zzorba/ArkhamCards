import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import SimpleMarkdown from 'simple-markdown';
import { MarkdownView } from 'react-native-markdown-view';

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

const ParagraphTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<p>(.+?)<\\/p>')),
  order: 0,
  parse: (capture, nestedParse, state) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: ParagraphHtmlTagNode,
};

const ArkhamIconRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\]')),
  order: 1,
  parse: (capture) => {
    return { name: capture[1] };
  },
  render: ArkhamIconNode,
};

const ArkahmIconSpanRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<span class="icon-(.+?)"></span>')),
  order: 1,
  parse: (capture) => {
    return { name: capture[1] };
  },
  render: ArkhamIconNode,
};

const BreakTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/>')),
  order: 1,
  parse: () => {
    return { text: '\n' };
  },
  render: BoldItalicHtmlTagNode,
};

const EmphasisMarkdownTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^\\[\\[([\\s\\S]+?)\\]\\]')),
  order: 0,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: BoldItalicHtmlTagNode,
};

const MalformedBoldItalicHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([\\s\\S]+?)<\\/b><\\/i>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: BoldItalicHtmlTagNode,
};

const DelHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<del>([\\s\\S]+?)<\\/del>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: StrikethroughTextNode,
};

const HrTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<hr>')),
  order: 1,
  parse: (capture, nestedParse, state) => {
    return { children: nestedParse(capture[1], state) };
  },
  render: HrTagNode,
};

const BlockquoteHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<blockquote>([\\s\\S]+?)<\\/blockquote>')),
  order: 1,
  parse: (capture, nestedParse, state) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: BlockquoteHtmlTagNode,
};

const BoldItalicHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b><i>([\\s\\S]+?)<\\/i><\\/b>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: BoldItalicHtmlTagNode,
};

const BoldHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b>([\\s\\S]+?)<\\/b>')),
  order: 2,
  parse: (capture, nestedParse, state) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: BoldHtmlTagNode,
};

const UnderlineHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<u>([\\s\\S]+?)<\\/u>')),
  order: 2,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: UnderlineHtmlTagNode,
};

const EmphasisHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<em>([\\s\\S]+?)<\\/em>')),
  order: 1,
  parse: (capture, nestedParse, state) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: EmphasisHtmlTagNode,
};

const ItalicHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<i>([\\s\\S]+?)<\\/i>')),
  order: 2,
  parse: (capture, nestedParse, state) => {
    return {
      children: nestedParse(capture[1], state),
    };
  },
  render: ItalicHtmlTagNode,
};

export default class CardText extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onLinkPress: PropTypes.func,
  };

  render() {
    const {
      onLinkPress,
    } = this.props;
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
            marginTop: 4,
            marginBottom: 4,
          },
        }}
        onLinkPress={onLinkPress}
      >
        { this.props.text.replace('&rarr;', '→').replace(/\/n/g, '\n') }
      </MarkdownView>
    );
  }
}
