import React from 'react';
import Realm, { Results } from 'realm';
import { connect } from 'react-redux';
import { flatMap, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm, CardResults } from 'react-native-realm';
import { t } from 'ttag';

import SignatureCardItem from './SignatureCardItem';
import Card from 'data/Card';
import { getTabooSet, AppState } from 'reducers';

interface RealmProps {
  requiredCards?: Results<Card>;
  alternateCards?: Results<Card>;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface OwnProps {
  componentId?: string;
  investigator: Card;
  width: number;
  fontScale: number;
}
type Props = OwnProps & RealmProps & ReduxProps;

class SignatureCardsComponent extends React.Component<Props> {
  render() {
    const {
      componentId,
      requiredCards,
      alternateCards,
      width,
      fontScale,
    } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{ t`Required Cards` }</Text>
        { !!(requiredCards && requiredCards.length) && (
          map(requiredCards, card => (
            <SignatureCardItem
              key={card.code}
              componentId={componentId}
              fontScale={fontScale}
              card={card}
              width={width}
            />
          ))
        ) }
        { !!(alternateCards && alternateCards.length) && (
          <React.Fragment>
            <Text style={styles.header}>{ t`Alternate Cards` }</Text>
            { map(alternateCards, card => (
              <SignatureCardItem
                key={card.code}
                componentId={componentId}
                fontScale={fontScale}
                card={card}
                width={width}
              />
            )) }
          </React.Fragment>
        ) }
      </View>
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
  SignatureCardsComponent, {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps & ReduxProps
    ): RealmProps {
      const requirements = props.investigator.deck_requirements;
      const card_requirements = requirements && requirements.card;
      const requiredQuery = map(card_requirements || [], req => {
        return `code == '${req.code}'`;
      }).join(' OR ');
      const alternateQuery = map(
        flatMap(card_requirements || [], req => (req.alternates || [])),
        code => `code == '${code}'`).join(' OR ');
      return {
        requiredCards: requiredQuery ?
          results.cards.filtered(`(${requiredQuery}) and ${Card.tabooSetQuery(props.tabooSetId)}`) :
          undefined,
        alternateCards: alternateQuery ?
          results.cards.filtered(`(${alternateQuery}) and ${Card.tabooSetQuery(props.tabooSetId)}`) :
          undefined,
      };
    },
  }));

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
