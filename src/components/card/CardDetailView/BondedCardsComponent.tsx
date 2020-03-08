import React from 'react';
import Realm, { Results } from 'realm';
import { connect } from 'react-redux';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm, CardResults } from 'react-native-realm';
import { t } from 'ttag';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from 'data/Card';
import { getTabooSet, AppState } from 'reducers';

interface OwnProps {
  componentId?: string;
  card: Card;
  width: number;
  fontScale: number;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface RealmProps {
  bonded_to_cards?: Results<Card>;
  bonded_from_cards?: Results<Card>;
}

type Props = OwnProps & ReduxProps & RealmProps;

class BondedCardsComponent extends React.Component<Props> {
  render() {
    const {
      componentId,
      bonded_to_cards,
      bonded_from_cards,
      width,
      fontScale,
    } = this.props;
    if (!(bonded_to_cards && bonded_to_cards.length) &&
      !(bonded_from_cards && bonded_from_cards.length)) {
      return null;
    }
    return (
      <React.Fragment>
        { !!(bonded_to_cards && bonded_to_cards.length) && (
          <React.Fragment>
            <View style={styles.bondedContainer}>
              <Text style={styles.header}>{ t`Bonded` }</Text>
            </View>
            { map(bonded_to_cards, card => (
              <TwoSidedCardComponent
                componentId={componentId}
                key={card.code}
                card={card}
                width={width}
                fontScale={fontScale}
              />
            )) }
          </React.Fragment>
        ) }
        { !!(bonded_from_cards && bonded_from_cards.length) && (
          <React.Fragment>
            <View style={styles.bondedContainer}>
              <Text style={styles.header}>{ t`Bound Cards` }</Text>
            </View>
            { map(bonded_from_cards, card => (
              <TwoSidedCardComponent
                key={card.code}
                componentId={componentId}
                card={card}
                width={width}
                fontScale={fontScale}
              />
            )) }
          </React.Fragment>
        ) }
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, OwnProps, AppState>(
  mapStateToProps
)(connectRealm<OwnProps & ReduxProps, RealmProps, Card>(
  BondedCardsComponent, {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps & ReduxProps
    ): RealmProps {
      const bonded_to_cards = (props.card && props.card.bonded_name) ?
        results.cards.filtered(`(real_name == $0) and ${Card.tabooSetQuery(props.tabooSetId)}`, props.card.bonded_name) : undefined;
      const bonded_from_cards = props.card &&
        results.cards.filtered(`(bonded_name == $0) and ${Card.tabooSetQuery(props.tabooSetId)}`, props.card.real_name);
      return {
        bonded_to_cards,
        bonded_from_cards,
      };
    },
  })
);

const styles = StyleSheet.create({
  header: {
    marginTop: 24,
    paddingLeft: 8,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    fontFamily: 'System',
  },
  bondedContainer: {
    width: '100%',
    maxWidth: 768,
  },
});
