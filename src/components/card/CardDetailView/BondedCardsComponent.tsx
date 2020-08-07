import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import Database from '@data/Database';
import DbRender from '@components/data/DbRender';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from '@data/Card';
import { where } from '@data/query';
import { getTabooSet, AppState } from '@reducers';
import { m, s } from '@styles/space';

interface OwnProps {
  componentId?: string;
  card?: Card;
  width: number;
  fontScale: number;
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
    const { card, tabooSetId } = this.props;
    if (!card || !card.bonded_name) {
      return [];
    }
    return await db.getCards(
      where('c.real_name = :bonded_name', { bonded_name: card.bonded_name }),
      tabooSetId
    );
  }

  async bondedFromCards(db: Database): Promise<Card[]> {
    const { card, tabooSetId } = this.props;
    if (!card) {
      return [];
    }
    return await db.getCards(
      where('c.bonded_name == :real_name', { real_name: card.real_name }),
      tabooSetId
    );
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
      fontScale,
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
  };

  render() {
    const {
      card,
    } = this.props;
    return (
      <DbRender name="bonded" getData={this._getBondedCards} ids={card ? [card.id] : []}>
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

const styles = StyleSheet.create({
  header: {
    marginTop: m + s,
    paddingLeft: s,
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
