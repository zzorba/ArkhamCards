import React from 'react';
import { head, startsWith } from 'lodash';
import { connect } from 'react-redux';
import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Realm, { Results } from 'realm';
import { connectRealm, CardAndFaqResults } from 'react-native-realm';
import { InAppBrowser } from '@matt-block/react-native-in-app-browser';

import CardTextComponent from './CardTextComponent';
import Card from 'data/Card';
import FaqEntry from 'data/FaqEntry';
import { showCard } from 'components/nav/helper';
import { NavigationProps } from 'components/nav/types';
import { getFaqEntry } from 'lib/publicApi';
import { getTabooSet, AppState } from 'reducers';
import typography from 'styles/typography';
import { m } from 'styles/space';

export interface CardFaqProps {
  id: string;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface RealmProps {
  realm: Realm;
  cards: Results<Card>;
  faqEntries: Results<FaqEntry>;
}

type Props = NavigationProps & CardFaqProps & ReduxProps & RealmProps;

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
    InAppBrowser.open(url).catch(() => {
      Linking.openURL(url);
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

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, NavigationProps & CardFaqProps, AppState>(
  mapStateToProps
)(connectRealm<NavigationProps & CardFaqProps & ReduxProps, RealmProps, Card, FaqEntry>(CardFaqView, {
  schemas: ['Card', 'FaqEntry'],
  mapToProps(
    results: CardAndFaqResults<Card, FaqEntry>,
    realm: Realm,
    props: NavigationProps & CardFaqProps & ReduxProps
  ): RealmProps {
    return {
      realm,
      cards: results.cards.filtered(Card.tabooSetQuery(props.tabooSetId)),
      faqEntries: results.faqEntries.filtered(`code == '${props.id}'`),
    };
  },
}));

const styles = StyleSheet.create({
  container: {
    margin: m,
  },
  error: {
    color: 'red',
  },
});
