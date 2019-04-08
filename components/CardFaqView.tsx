import React from 'react';
import { head, startsWith } from 'lodash';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Realm, { Results } from 'realm';
import { connectRealm, CardAndFaqResults } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';
import { InAppBrowser } from '@matt-block/react-native-in-app-browser';

import Card from '../data/Card';
import FaqEntry from '../data/FaqEntry';
import CardTextComponent from './CardTextComponent';
import { showCard } from './navHelper';
import { NavigationProps } from './types';
import { WebViewProps } from './WebViewWrapper';
import { getFaqEntry } from '../lib/publicApi';
import typography from '../styles/typography';
import { m } from '../styles/space';

export interface CardFaqProps {
  id: string;
}

interface RealmProps {
  realm: Realm;
  cards: Results<Card>;
  faqEntries: Results<FaqEntry>;
}

type Props = NavigationProps & CardFaqProps & RealmProps;

interface State {
  faqLoading: boolean;
  faqError?: string;
}

class CardFaqView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      faqLoading: false,
    };
  }

  componentDidMount() {
    if (!head(this.props.faqEntries)) {
      this._loadFaq();
    }
  }

  openUrl(url: string) {
    const {
      componentId,
    } = this.props;
    InAppBrowser.open(url).catch(() => {
      Navigation.push<WebViewProps>(componentId, {
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

  _linkPressed = (url: string) => {
    const {
      componentId,
      cards,
    } = this.props;
    const regex = /\/card\/(\d+)/;
    const match = url.match(regex);
    if (match) {
      const code = match[1];
      const card = head(cards.filtered(`code == '${code}'`));
      if (card) {
        showCard(componentId, code, card);
      }
    } else if (url.indexOf('arkhamdb.com') !== -1) {
      this.openUrl(url);
    } else if (startsWith(url, '/')) {
      this.openUrl(`https://arkhamdb.com${url}`);
    }
  };

  _loadFaq = () => {
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
          faqError: undefined,
        });
      }).catch(() => {
        this.setState({
          faqLoading: false,
          faqError: 'Problem loading FAQ, please try again later.',
        });
      });
    }
  };

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
        { !!faqEntry && !!faqEntry.fetched && (
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

export default connectRealm<NavigationProps & CardFaqProps, RealmProps, Card, FaqEntry>(CardFaqView, {
  schemas: ['Card', 'FaqEntry'],
  mapToProps(
    results: CardAndFaqResults<Card, FaqEntry>,
    realm: Realm,
    props: NavigationProps & CardFaqProps
  ): RealmProps {
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
