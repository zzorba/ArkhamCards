import React from 'react';
import { connect } from 'react-redux';
import { find, flatMap, map } from 'lodash';
import { t } from 'ttag';

import Database from '@data/Database';
import DbRender from '@components/data/DbRender';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from '@data/Card';
import { getTabooSet, AppState } from '@reducers';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import FilterBuilder from '@lib/filters';

interface OwnProps {
  componentId?: string;
  cards: Card[];
  width: number;
}

interface ReduxProps {
  tabooSetId?: number;
}

type Props = OwnProps & ReduxProps;

interface BondedCards {
  bonded_to_cards: Card[];
  bonded_from_cards: Card[];
}

class BondedCardsComponent extends React.Component<Props> {
  async bondedToCards(db: Database): Promise<Card[]> {
    const { cards, tabooSetId } = this.props;
    if (!find(cards, card => !!card.bonded_name)) {
      return [];
    }
    const filterBuilder = new FilterBuilder('bonded_to');
    const query = filterBuilder.bondedFilter(
      'real_name',
      flatMap(cards, card => card.bonded_name ? [card.bonded_name] : [])
    );
    if (!query) {
      return [];
    }
    return await db.getCards(query, tabooSetId);
  }

  async bondedFromCards(db: Database): Promise<Card[]> {
    const { cards, tabooSetId } = this.props;
    if (!cards) {
      return [];
    }
    const filterBuilder = new FilterBuilder('bonded_from');
    const query = filterBuilder.bondedFilter('bonded_name', map(cards, card => card.real_name));
    if (!query) {
      return [];
    }
    return await db.getCards(query, tabooSetId);
  }

  _getBondedCards = async(db: Database): Promise<BondedCards> => {
    return {
      bonded_to_cards: await this.bondedToCards(db),
      bonded_from_cards: await this.bondedFromCards(db),
    };
  };

  _render = (bondedCards?: BondedCards) => {
    const {
      componentId,
      width,
    } = this.props;
    if (!bondedCards) {
      return null;
    }
    const {
      bonded_from_cards,
      bonded_to_cards,
    } = bondedCards;
    if (!(bonded_to_cards && bonded_to_cards.length) &&
      !(bonded_from_cards && bonded_from_cards.length)) {
      return null;
    }
    return (
      <>
        { !!(bonded_to_cards && bonded_to_cards.length) && (
          <>
            <CardDetailSectionHeader title={t`Bonded`} />
            { map(bonded_to_cards, card => (
              <TwoSidedCardComponent
                componentId={componentId}
                key={card.code}
                card={card}
                width={width}
              />
            )) }
          </>
        ) }
        { !!(bonded_from_cards && bonded_from_cards.length) && (
          <>
            <CardDetailSectionHeader title={t`Bound Cards`} />
            { map(bonded_from_cards, card => (
              <TwoSidedCardComponent
                key={card.code}
                componentId={componentId}
                card={card}
                width={width}
              />
            )) }
          </>
        ) }
      </>
    );
  };

  render() {
    const {
      cards,
    } = this.props;
    return (
      <DbRender name="bonded" getData={this._getBondedCards} ids={map(cards, c => c.id)}>
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
)(BondedCardsComponent);
