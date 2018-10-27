import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import SignatureCardItem from './SignatureCardItem';

class SignatureCardsComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    investigator: PropTypes.object.isRequired,
    requiredCards: PropTypes.object,
    alternateCards: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      componentId,
      requiredCards,
      alternateCards,
    } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Required Cards</Text>
        { map(requiredCards, card => (
          <SignatureCardItem key={card.code} componentId={componentId} card={card} />
        )) }
        { !!(alternateCards && alternateCards.length) && (
          <View>
            <Text style={styles.header}>Alternate Cards</Text>
            { map(alternateCards, card => (
              <SignatureCardItem key={card.code} componentId={componentId} card={card} />
            )) }
          </View>
        ) }
      </View>
    );
  }
}


export default connectRealm(SignatureCardsComponent, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const requirements = props.investigator.deck_requirements;
    const card_requirements = requirements && requirements.card;
    const requiredQuery = map(card_requirements || [], req => {
      return `code == '${req.code}'`;
    }).join(' OR ');
    const alternateQuery = map(
      flatMap(card_requirements || [], req => (req.alternates || [])),
      code => `code == '${code}'`).join(' OR ');
    return {
      requiredCards: requiredQuery ? results.cards.filtered(requiredQuery) : null,
      alternateCards: alternateQuery ? results.cards.filtered(alternateQuery) : null,
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
