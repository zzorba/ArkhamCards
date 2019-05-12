import React from 'react';
import { forEach, head, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Realm, { Results } from 'realm';
import { connectRealm, CardAndTabooSetResults } from 'react-native-realm';
import { t } from 'ttag';

import Card from '../data/Card';
import TabooSet from '../data/TabooSet';
import FaqEntry from '../data/FaqEntry';
import CardTextComponent from './CardTextComponent';
import { NavigationProps } from './types';
import { m, xs, s } from '../styles/space';
import typography from '../styles/typography';

export interface CardTabooProps {
  id: string;
}

interface TabooSetMap {
  [id: number]: TabooSet;
}

interface RealmProps {
  realm: Realm;
  card?: Card;
  taboos: Results<Card>;
  tabooSets: TabooSetMap;
}

type Props = NavigationProps & CardTabooProps & RealmProps;

class CardTabooView extends React.Component<Props> {
  renderContent(card: Card, taboo: Card) {
    const { tabooSets } = this.props;
    const tabooSet = taboo.taboo_set_id && tabooSets[taboo.taboo_set_id];

    return (
      <View key={taboo.id}>
        { !!tabooSet && (
          <Text style={[typography.bigLabel, styles.tabooHeader]}>
            { `${tabooSet.name} - ${tabooSet.date_start}` }
          </Text>
        ) }
        <View style={styles.gameTextBlock}>
          { (!!taboo.extra_xp && taboo.extra_xp > 0) && (
            <Text>
              { t`Additional XP: ${taboo.extra_xp}.` }
            </Text>
          ) }
          { !!taboo.taboo_text_change && (
            <CardTextComponent text={taboo.taboo_text_change} />
          ) }
        </View>
      </View>
    );
  }

  render() {
    const {
      card,
      taboos,
    } = this.props;
    if (!card) {
      return null;
    }
    return (
      <ScrollView style={styles.container}>
        <Text style={[typography.small, styles.header]}>
          { t`The List of Taboos is a list of Arkham Horror: The Card Game cards with optional deckbuilding restrictions or text changes. This list is designed to craft a healthy balance between investigator power and scenario difficulty, and to enforce shifts in deckbuilding environments over time.` }
          { '\n\n' }
          { t`Adhering to The List of Taboos is completely optional. Investigators are not forced to adhere to the restrictions on this list, but if an investigator chooses to do so, they must do so in full (an investigator cannot pick and choose which restrictions to use).` }
        </Text>
        { map(taboos, taboo => this.renderContent(card, taboo)) }
      </ScrollView>
    );
  }
}

export default connectRealm<NavigationProps & CardTabooProps, RealmProps, Card, FaqEntry, TabooSet>(CardTabooView, {
  schemas: ['Card', 'TabooSet'],
  mapToProps(
    results: CardAndTabooSetResults<Card, TabooSet>,
    realm: Realm,
    props: NavigationProps & CardTabooProps
  ): RealmProps {
    const card = head(results.cards.filtered(`code == "${props.id}" and (taboo_set_id == 0 || taboo_set_id == null)`));
    const taboos = results.cards.filtered(`code == "${props.id}" and taboo_set_id > 0`);
    const tabooSets: TabooSetMap = {};
    forEach(results.tabooSets, tabooSet => {
      tabooSets[tabooSet.id] = tabooSet;
    });
    return {
      realm,
      card,
      taboos,
      tabooSets,
    };
  },
});

const styles = StyleSheet.create({
  container: {
    margin: m,
  },
  header: {
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
