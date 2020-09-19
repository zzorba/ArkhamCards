import React from 'react';
import { connect } from 'react-redux';
import { flatMap, map, partition } from 'lodash';
import {
  View,
} from 'react-native';
import { t } from 'ttag';

import Database from '@data/Database';
import DbRender from '@components/data/DbRender';
import SignatureCardItem from './SignatureCardItem';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import BondedCardsComponent from './BondedCardsComponent';
import Card from '@data/Card';
import { where } from '@data/query';
import { getTabooSet, AppState } from '@reducers';
import space, { m, s } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
}
type Props = OwnProps & ReduxProps;

class SignatureCardsComponent extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _render = (signatureCards?: SignatureCards) => {
    const {
      componentId,
      width,
    } = this.props;
    const { typography } = this.context;
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
        { !!(requiredCards && requiredCards.length) && (
          <>
            <CardDetailSectionHeader title={t`Required Cards`} />
            { map(requiredCards, card => (
              <SignatureCardItem
                key={card.code}
                componentId={componentId}
                card={card}
                width={width}
              />
            )) }
          </>
        ) }
        { !!(altCards && altCards.length) && (
          <>
            <CardDetailSectionHeader title={t`Alternate Cards`} />
            { map(altCards, card => (
              <SignatureCardItem
                key={card.code}
                componentId={componentId}
                card={card}
                width={width}
              />
            )) }
          </>
        ) }
        { !!(advancedCards && advancedCards.length) && (
          <>
            <CardDetailSectionHeader title={t`Advanced Cards`} />
            { map(advancedCards, card => (
              <SignatureCardItem
                key={card.code}
                componentId={componentId}
                card={card}
                width={width}
              />
            )) }
          </>
        ) }
        <BondedCardsComponent
          componentId={componentId}
          width={width}
          cards={[
            ...(requiredCards || []),
            ...(altCards || []),
            ...(advancedCards || [])
          ]}
        />
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

export default connect<ReduxProps, unknown, OwnProps, AppState>(
  mapStateToProps
)(SignatureCardsComponent);
