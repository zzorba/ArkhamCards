import React from 'react';
import { forEach, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Database from '@data/Database';
import DbRender from '@components/data/DbRender';
import { t } from 'ttag';

import Card from '@data/Card';
import TabooSet from '@data/TabooSet';
import CardTextComponent from './CardTextComponent';
import { NavigationProps } from '@components/nav/types';
import { l, m, xs, s } from '@styles/space';
import typography from '@styles/typography';
import COLORS from '@styles/colors';

export interface CardTabooProps {
  id: string;
}

interface TabooSetMap {
  [id: number]: TabooSet;
}

interface TabooData {
  card?: Card;
  taboos: Card[];
  tabooSets: TabooSetMap;
}

type Props = NavigationProps & CardTabooProps;

export default class CardTabooView extends React.Component<Props> {
  renderContent(card: Card, taboo: Card, tabooSets: TabooSetMap) {
    const tabooSet = taboo.taboo_set_id && tabooSets[taboo.taboo_set_id];
    if (taboo.taboo_placeholder) {
      return null;
    }

    return (
      <View key={taboo.id}>
        { !!tabooSet && (
          <Text style={[typography.bigLabel, styles.tabooHeader]}>
            { `${tabooSet.name} - ${tabooSet.date_start}` }
          </Text>
        ) }
        <View style={styles.gameTextBlock}>
          { !!taboo.extra_xp && (
            <Text style={typography.text}>
              { taboo.extra_xp > 0 ?
                t`Additional XP: ${taboo.extra_xp}.` :
                t`XP Discount: ${taboo.extra_xp}.` }
            </Text>
          ) }
          { !!taboo.taboo_text_change && (
            <CardTextComponent text={taboo.taboo_text_change} />
          ) }
        </View>
      </View>
    );
  }

  _getData = async(db: Database): Promise<TabooData> => {
    const { id } = this.props;
    const cardsQuery = await db.cardsQuery();
    const card = await cardsQuery
      .where('c.code = :code and (c.taboo_set_id = 0 or c.taboo_set_id is null)', { code: id })
      .getOne();
    const taboos = await cardsQuery
      .where('c.code = :code and c.taboo_set_id > 0', { code: id })
      .getMany();
    const allTabooSets = await (await db.tabooSets()).createQueryBuilder().orderBy('id', 'ASC').getMany();
    const tabooSets: TabooSetMap = {};
    forEach(allTabooSets, tabooSet => {
      tabooSets[tabooSet.id] = tabooSet;
    });
    return {
      card,
      taboos,
      tabooSets,
    };
  };

  _renderData = (tabooData?: TabooData) => {
    if (!tabooData) {
      return null;
    }
    const {
      card,
      taboos,
      tabooSets,
    } = tabooData;
    if (!card) {
      return null;
    }
    return map(taboos, taboo => this.renderContent(card, taboo, tabooSets));
  };

  render() {
    const {
      id,
    } = this.props;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <DbRender name="taboo" getData={this._getData} ids={[id]}>
          { this._renderData }
        </DbRender>
        <Text style={[typography.small, styles.header]}>
          { t`The List of Taboos is a list of Arkham Horror: The Card Game cards with optional deckbuilding restrictions or text changes. This list is designed to craft a healthy balance between investigator power and scenario difficulty, and to enforce shifts in deckbuilding environments over time.` }
          { '\n\n' }
          { t`Adhering to The List of Taboos is completely optional. Investigators are not forced to adhere to the restrictions on this list, but if an investigator chooses to do so, they must do so in full (an investigator cannot pick and choose which restrictions to use).` }
          { '\n\n' }
          { t`You can opt-in to always seeing taboos and buiding decks with them in Settings.` }
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: m,
    backgroundColor: COLORS.background,
  },
  header: {
    marginTop: l,
    marginBottom: m,
  },
  gameTextBlock: {
    borderLeftWidth: 4,
    paddingLeft: xs,
    marginBottom: s,
    marginRight: s,
    paddingTop: m,
    paddingBottom: m,
  },
  tabooHeader: {
    marginTop: s,
    marginBottom: m,
  },
});
