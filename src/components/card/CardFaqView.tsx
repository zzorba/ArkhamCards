import React from 'react';
import { head } from 'lodash';
import { connect } from 'react-redux';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import CardTextComponent from './CardTextComponent';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import FaqEntry from '@data/FaqEntry';
import connectDb from '@components/data/connectDb';
import { openUrl } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import { getFaqEntry } from '@lib/publicApi';
import { getTabooSet, AppState } from '@reducers';
import space, { m } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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

  _linkPressed = async(url: string, context: StyleContextType) => {
    const { componentId, tabooSetId } = this.props;
    await openUrl(url, context, this.context.db, componentId, tabooSetId);
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
    const lastUpdated = faqEntry && faqEntry.fetched && faqEntry.fetched.toISOString().slice(0, 10);
    return (
      <StyleContext.Consumer>
        { ({ typography }) => (
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
                  { faqLoading ? t`Checking for FAQ` : t`No entries at this time.` }
                </Text>
              ) }
            </View>
            { !!lastUpdated && (
              <View style={space.marginTopS}>
                <Text style={typography.text}>
                  { t`Last Updated: ${lastUpdated}` }
                </Text>
              </View>
            ) }
          </View>
        ) }
      </StyleContext.Consumer>
    );
  }

  render() {
    return (
      <StyleContext.Consumer>
        { ({ backgroundStyle, colors }) => (
          <ScrollView
            contentContainerStyle={[styles.container, backgroundStyle]}
            refreshControl={
              <RefreshControl
                refreshing={this.state.faqLoading}
                onRefresh={this._loadFaq}
                tintColor={colors.lightText}
              />
            }
          >
            { this.renderFaqContent() }
          </ScrollView>
        ) }
      </StyleContext.Consumer>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, unknown, NavigationProps & CardFaqProps, AppState>(
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
    padding: m,
  },
  error: {
    color: 'red',
  },
});
