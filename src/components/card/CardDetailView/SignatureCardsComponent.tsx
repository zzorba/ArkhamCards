import React from 'react';
import { connect } from 'react-redux';
import { flatMap, map, partition } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import Database from '@data/Database';
import DbRender from '@components/data/DbRender';
import SignatureCardItem from './SignatureCardItem';
import Card from '@data/Card';
import { where } from '@data/query';
import { getTabooSet, AppState } from '@reducers';
import space, { m, s } from '@styles/space';
import COLORS from '@styles/colors';

interface SignatureCards {
  requiredCards: Card[];
  alternateCards: Card[];
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
type Props = OwnProps & ReduxProps;

class SignatureCardsComponent extends React.Component<Props> {

  _render = (signatureCards?: SignatureCards) => {
    const {
      componentId,
      width,
      fontScale,
    } = this.props;
    if (!signatureCards) {
      return null;
    }
    const {
      requiredCards,
      alternateCards,
    } = signatureCards;

    const [advancedCards, altCards] = partition(alternateCards, card => !!card.advanced);

    return (
      <View style={space.marginBottomS}>
        <Text style={styles.header}>
          { t`Required Cards` }
        </Text>
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
        { !!(altCards && altCards.length) && (
          <React.Fragment>
            <Text style={styles.header}>
              { t`Alternate Cards` }
            </Text>
            { map(altCards, card => (
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
        { !!(advancedCards && advancedCards.length) && (
          <React.Fragment>
            <Text style={styles.header}>
              { t`Advanced Cards` }
            </Text>
            { map(advancedCards, card => (
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
  };

  _getSignatureCards = async(db: Database) => {
    const { investigator, tabooSetId } = this.props;
    const requirements = investigator.deck_requirements;
    const card_requirements = requirements && requirements.card;
    const requiredQuery = map(card_requirements || [], req => {
      return `c.code = '${req.code}'`;
    }).join(' OR ');
    const requiredCards = requiredQuery ?
      await db.getCards(
        where(requiredQuery),
        tabooSetId
      ) : [];

    const alternateQuery = map(
      flatMap(card_requirements || [], req => (req.alternates || [])),
      code => `c.code = '${code}'`).join(' OR ');

    const alternateCards = alternateQuery ?
      await db.getCards(
        where(alternateQuery),
        tabooSetId
      ) : [];

    return {
      requiredCards,
      alternateCards,
    };
  };

  render() {
    const { investigator } = this.props;
    return (
      <DbRender name="sig" getData={this._getSignatureCards} ids={[investigator.id]}>
        { this._render }
      </DbRender>
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
)(SignatureCardsComponent);

const styles = StyleSheet.create({
  header: {
    marginTop: m + s,
    paddingLeft: s,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    fontFamily: 'System',
    color: COLORS.darkText,
  },
});
