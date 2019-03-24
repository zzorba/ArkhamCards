import React from 'react';
import PropTypes from 'prop-types';
import { head, startsWith } from 'lodash';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';
import { InAppBrowser } from '@matt-block/react-native-in-app-browser';

import CardTextComponent from './CardTextComponent';
import { showCard } from './navHelper';
import { getFaqEntry } from '../lib/publicApi';
import typography from '../styles/typography';
import { m } from '../styles/space';

class CardFaqView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    realm: PropTypes.object.isRequired,
    cards: PropTypes.object,
    faqEntries: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      faqLoading: false,
    };

    this._linkPressed = this.linkPressed.bind(this);
    this._loadFaq = this.loadFaq.bind(this);
  }

  componentDidMount() {
    if (!head(this.props.faqEntries)) {
      this.loadFaq();
    }
  }

  openUrl(url) {
    const {
      componentId,
    } = this.props;
    InAppBrowser.open(url).catch(() => {
      Navigation.push(componentId, {
        component: {
          name: 'WebView',
          passProps: {
            uri: url,
          },
          options: {
            topBar: {
              title: {
                text: 'ArkhamDB',
              },
            },
          },
        },
      });
    });
  }

  linkPressed(url) {
    const {
      componentId,
      cards,
    } = this.props;
    const regex = /\/card\/(\d+)/;
    const match = url.match(regex);
    if (match) {
      const code = match[1];
      const card = head(cards.filtered(`code == '${code}'`));
      showCard(componentId, code, card);
    } else if (url.indexOf('arkhamdb.com') !== -1) {
      this.openUrl(url);
    } else if (startsWith(url, '/')) {
      this.openUrl(`https://arkhamdb.com${url}`);
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

      getFaqEntry(realm, id).then(() => {
        this.setState({
          faqLoading: false,
          faqError: null,
        });
      }).catch(() => {
        this.setState({
          faqLoading: false,
          faqError: 'Problem loading FAQ, please try again later.',
        });
      });
    }
  }

  renderFaqContent() {
    const {
      faqEntries,
    } = this.props;
    const {
      faqLoading,
      faqError,
    } = this.state;

    const faqEntry = head(faqEntries);
    return (
      <View>
        { !!faqError && (
          <Text style={[typography.text, styles.error]}>
            { faqError }
          </Text>
        ) }
        <View>
          { (faqEntry && faqEntry.text) ? (
            <CardTextComponent
              text={faqEntry.text}
              onLinkPress={this._linkPressed}
            />
          ) : (
            <Text style={typography.text}>
              { faqLoading ? 'Checking for FAQ' : 'No entries at this time.' }
            </Text>
          ) }
        </View>
        { !!faqEntry && (
          <Text style={typography.small}>
            Last Updated: { faqEntry.fetched.toISOString().slice(0, 10) }
          </Text>
        ) }
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.faqLoading}
            onRefresh={this._loadFaq}
          />
        }
      >
        { this.renderFaqContent() }
      </ScrollView>
    );
  }
}

export default connectRealm(CardFaqView, {
  schemas: ['Card', 'FaqEntry'],
  mapToProps(results, realm, props) {
    return {
      realm,
      cards: results.cards,
      faqEntries: results.faqEntries.filtered(`code == '${props.id}'`),
    };
  },
});

const styles = StyleSheet.create({
  container: {
    margin: m,
  },
  error: {
    color: 'red',
  },
});
