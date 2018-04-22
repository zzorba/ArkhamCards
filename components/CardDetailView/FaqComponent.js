import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { Bar } from 'react-native-progress';
import { Button } from 'react-native-elements';

import CardTextComponent from '../CardTextComponent';
import { getFaqEntry } from '../../lib/api';

class FaqComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    realm: PropTypes.object.isRequired,
    cards: PropTypes.object,
    faqEntry: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      faqLoading: false,
    };

    this._linkPressed = this.linkPressed.bind(this);
    this._loadFaq = this.loadFaq.bind(this);
  }

  linkPressed(url) {
    const {
      navigator,
      cards,
    } = this.props;
    const regex = /\/card\/(\d+)/;
    const match = url.match(regex);
    if (match) {
      const code = match[1];
      const card = head(cards.filtered(`code == '${code}'`));
      navigator.push({
        screen: 'Card',
        passProps: {
          id: code,
          pack_code: card ? card.pack_code : null,
        },
      });
    } else if (url.indexOf('arkhamdb.com') !== -1) {
      navigator.push({
        screen: 'WebView',
        title: 'ArkhamDB',
        passProps: {
          uri: url,
        },
      });
    }
  }

  loadFaq() {
    const {
      id,
      realm,
    } = this.props;
    if (!this.state.faqLoading) {
      this.setState({
        faqLoading: true,
      });

      getFaqEntry(realm, id).then(hasFaq => {
        if (!hasFaq) {
          this.setState({
            noFaqEntry: !hasFaq,
          });
        }
      }).catch(() => {
        this.setState({
          faqLoading: false,
          faqError: 'Problem loading FAQ, please try again later.',
        });
      });
    }
  }

  render() {
    const {
      faqEntry,
    } = this.props;
    if (faqEntry) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>FAQ</Text>
          <CardTextComponent 
            text={faqEntry.text}
            onLinkPress={this._linkPressed}
          />
        </View>
      );
    }
    const {
      faqLoading,
      noFaqEntry,
      faqError,
    } = this.state;
    if (noFaqEntry) {
      return (
        <View style={styles.container}>
          <Text>No FAQ entries at this time</Text>
        </View>
      );
    }
    if (faqLoading) {
      return (
        <View style={styles.container}>
          <Bar indeterminate />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        { !!faqError && <Text>{ faqError }</Text> }
        <Button onPress={this._loadFaq} text="Check for FAQ Entries" />
      </View>
    );
  }
}

export default connectRealm(FaqComponent, {
  schemas: ['Card', 'FaqEntry'],
  mapToProps(results, realm, props) {
    return {
      realm,
      cards: results.cards,
      faqEntry: head(results.faqEntries.filtered(`code == '${props.id}'`)),
    };
  },
});

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'System',
  },
});
