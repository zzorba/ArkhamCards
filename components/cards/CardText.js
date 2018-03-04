import React from 'react';
import PropTypes from 'prop-types';
import { values } from 'lodash';
const {
  StyleSheet,
  Text,
} = require('react-native');
import SimpleMarkdown from 'simple-markdown'
import { MarkdownView } from 'react-native-markdown-view';

import ArkhamIcon from '../../assets/ArkhamIcon';

const BAD_ICON_NAMES = {
  'per investigator': 'per_investigator',
  lightning: 'free',
  'auto-fail': 'auto_fail',
};

const ArkhamIconRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^\\[([^\\]]+)\\]')),
  order: 1,
  parse: (capture) => {
    return { name: capture[1] };
  },
  render: (node, output, state) =>
    <ArkhamIcon
      key={state.key}
      name={BAD_ICON_NAMES[node.name] || node.name}
      size={16}
      color="#000000"
    />,
};

const BoldHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<b>(.+?)<\\/b>')),
  order: 1,
  parse: (capture, nestedParse, state) => {
    return { text: capture[1] };
  },
  render: (node, output, state) => {
    return (
      <Text key={state.key} style={styles.boldText}>
        { node.text }
      </Text>
    );
  },
};
const ItalicHtmlTagRule = {
  match: SimpleMarkdown.inlineRegex(new RegExp('^<i>(.+?)<\\/i>')),
  order: 1,
  parse: (capture, nestedParse, state) => {
    return { text: capture[1] };
  },
  render: (node, output, state) => {
    return (
      <Text key={state.key} style={styles.italicText}>
        { node.text }
      </Text>
    );
  },
};

export default class CardText extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render() {
    return (
      <MarkdownView
         rules={{
           arkhamIcon: ArkhamIconRule,
           bTag: BoldHtmlTagRule,
           iTag: ItalicHtmlTagRule,
         }}
       >
         { this.props.text }
       </MarkdownView>
    );
  }
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: '700',
  },
  italicText: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
});
