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
import { InAppBrowser } from '@matt-block/react-native-in-app-browser';

import CardTextComponent from './CardTextComponent';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { where } from '@data/query';
import FaqEntry from '@data/FaqEntry';
import connectDb from '@components/data/connectDb';
import { showCard } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import { getFaqEntry } from 'lib/publicApi';
import { getTabooSet, AppState } from '@reducers';
import typography from '@styles/typography';
import { m } from '@styles/space';

export interface CardFaqProps {
  id: string;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface Data {
  faqEntries: FaqEntry[];
}

type Props = NavigationProps & CardFaqProps & ReduxProps & Data;

interface State {
  faqLoading: boolean;
  faqError?: string;
}

class CardFaqView extends React.Component<Props, State> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

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

  async openCard(code: string) {
    const { componentId, tabooSetId } = this.props;
    const card = await this.context.db.getCard(
      where('c.code = :code', { code }),
      tabooSetId
    );
    if (card) {
      showCard(componentId, code, card);
    }
  }

  _linkPressed = (url: string) => {
    const regex = /\/card\/(\d+)/;
    const match = url.match(regex);
    if (match) {
      this.openCard(match[1]);
    } else if (url.indexOf('arkhamdb.com') !== -1) {
      this.openUrl(url);
    } else if (startsWith(url, '/')) {
      this.openUrl(`https://arkhamdb.com${url}`);
    }
  };

  _loadFaq = () => {
    const {
      id,
    } = this.props;
    if (!this.state.faqLoading) {
      this.setState({
        faqLoading: true,
      });

      getFaqEntry(this.context.db, id).then(() => {
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
)(
  connectDb<NavigationProps & CardFaqProps & ReduxProps, Data, string>(
    CardFaqView,
    (props: NavigationProps & CardFaqProps & ReduxProps) => props.id,
    async(db: Database, code: string) => {
      const qb = await db.faqEntries();
      const faqEntries = await qb.createQueryBuilder('faq')
        .where('faq.code = :code', { code })
        .getMany();
      return {
        faqEntries,
      };
    }
  )
);

const styles = StyleSheet.create({
  container: {
    margin: m,
  },
  error: {
    color: 'red',
  },
});
