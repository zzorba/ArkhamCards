import React from 'react';
import Realm from 'realm';
import PropTypes from 'prop-types';
import { flatMap, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm, CardResults } from 'react-native-realm';
import { Subtract } from 'utility-types';

import L from '../../app/i18n';
import SignatureCardItem from './SignatureCardItem';
import Card from '../../data/Card';
import FaqEntry from '../../data/FaqEntry';

interface RealmProps {
  requiredCards?: Card[];
  alternateCards?: Card[];
}

interface OwnProps {
  componentId: string;
  investigator: Card;
}
type Props = OwnProps & RealmProps;

class SignatureCardsComponent extends React.Component<Props> {
  render() {
    const {
      componentId,
      requiredCards,
      alternateCards,
    } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{ L('Required Cards') }</Text>
        { !!(requiredCards && requiredCards.length) && (
          map(requiredCards, card => (
          <SignatureCardItem key={card.code} componentId={componentId} card={card} />
        ))) }
        { !!(alternateCards && alternateCards.length) && (
          <React.Fragment>
            <Text style={styles.header}>{ L('Alternate Cards') }</Text>
            { map(alternateCards, card => (
              <SignatureCardItem key={card.code} componentId={componentId} card={card} />
            )) }
          </React.Fragment>
        ) }
      </View>
    );
  }
}


export default connectRealm<OwnProps, RealmProps, Card>(
  SignatureCardsComponent, {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps
    ) {
      const requirements = props.investigator.deck_requirements;
      const card_requirements = requirements && requirements.card;
      const requiredQuery = map(card_requirements || [], req => {
        return `code == '${req.code}'`;
      }).join(' OR ');
      const alternateQuery = map(
        flatMap(card_requirements || [], req => (req.alternates || [])),
        code => `code == '${code}'`).join(' OR ');
      return {
        requiredCards: requiredQuery ? results.cards.filtered(requiredQuery) : undefined,
        alternateCards: alternateQuery ? results.cards.filtered(alternateQuery) : undefined,
      };
    },
  });

const styles = StyleSheet.create({
  header: {
    marginTop: 24,
    paddingLeft: 8,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    fontFamily: 'System',
  },
  container: {
    marginBottom: 8,
  },
});
