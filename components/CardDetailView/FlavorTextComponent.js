import React from 'react';
import PropTypes from 'prop-types';
import SimpleMarkdown from 'simple-markdown';
import { MarkdownView } from 'react-native-markdown-view';

import FlavorUnderlineNode from './FlavorUnderlineNode';
import CiteTagNode from './CiteTagNode';

const BreakTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<br\\/*>')),
  order: 1,
  parse: () => {
    return { text: '\n' };
  },
  render: FlavorUnderlineNode,
};

const CiteTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<cite>(.+?)<\\/cite>')),
  order: 1,
  parse: (capture) => {
    return { text: `  — ${capture[1]}` };
  },
  render: CiteTagNode,
};

const UnderlineHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<u>(.+?)<\\/u>')),
  order: 1,
  parse: (capture) => {
    return { text: capture[1] };
  },
  render: FlavorUnderlineNode,
};

export default class FlavorTextComponent extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render() {
    const {
      onLinkPress,
    } = this.props;
    // Text that has hyperlinks uses a different style for the icons.
    return (
      <MarkdownView
        style={{
          marginBottom: 4,
        }}
        rules={{
          uTag: UnderlineHtmlTagRule,
          brTag: BreakTagRule,
          citeTag: CiteTagRule,
        }}
        onLinkPress={onLinkPress}
        styles={{
          paragraph: {
            fontSize: 11,
            fontWeight: '600',
            fontStyle: 'italic',
          },
        }}
      >
        { this.props.text }
      </MarkdownView>
    );
  }
}
