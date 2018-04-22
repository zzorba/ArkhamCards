import React from 'react';
import PropTypes from 'prop-types';
import SimpleMarkdown from 'simple-markdown';
import { MarkdownView } from 'react-native-markdown-view';

import ArkhamIconNode from './ArkhamIconNode';
import BoldHtmlTagNode from './BoldHtmlTagNode';
import ItalicHtmlTagNode from './ItalicHtmlTagNode';

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

const BoldHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b>(.+?)<\\/b>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: BoldHtmlTagNode,
};

const EmphasisHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<em>(.+?)<\\/em>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: ItalicHtmlTagNode,
};

const ItalicHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<i>(.+?)<\\/i>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
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
            arkhamIconSpan: ArkahmIconSpanRule,
            bTag: BoldHtmlTagRule,
            emTag: EmphasisHtmlTagRule,
            iTag: ItalicHtmlTagRule,
          }, onLinkPress ? {} : { arkhamIcon: ArkhamIconRule })
        }
        onLinkPress={onLinkPress}
      >
        { this.props.text }
      </MarkdownView>
    );
  }
}
