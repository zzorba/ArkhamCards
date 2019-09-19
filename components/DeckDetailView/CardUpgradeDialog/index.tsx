import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { filter, find, reverse, map, sortBy, sumBy } from 'lodash';
import { t } from 'ttag';
import DialogComponent from 'react-native-dialog';

import CardUpgradeOption from './CardUpgradeOption';
import { Deck, DeckMeta, Slots } from '../../../actions/types';
import Dialog from '../../core/Dialog';
import DeckValidation from '../../../lib/DeckValidation';
import Card, { CardsMap } from '../../../data/Card';
import { COLORS } from '../../../styles/colors';

interface Props {
  deck: Deck;
  meta: DeckMeta;
  card?: Card;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  investigator: Card;
  tabooSetId?: number;
  slots?: Slots;
  visible: boolean;
  viewRef?: View;
  toggleVisible: () => void;
  updateSlots: (slots: Slots) => void;
}

interface State {
  slots: Slots;
}

export default class CardUpgradeDialog extends React.Component<Props, State> {
  state: State = {
    slots: {},
  };

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
      slots,
    } = this.props;
    if (visible && !prevProps.visible && slots) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        slots,
      });
    }
  }

  namedCards() {
    const {
      card,
      cardsByName,
      investigator,
      meta,
    } = this.props;
    const validation = new DeckValidation(investigator, meta);
    return sortBy(
      filter((card && cardsByName[card.real_name]) || [],
        card => validation.canIncludeCard(card, false)),
      card => card.xp || 0
    );
  }

  _onOkayPress = () => {
    const {
      toggleVisible,
      updateSlots,
    } = this.props;
    const {
      slots,
    } = this.state;
    updateSlots(slots);
    toggleVisible();
  }

  overLimit(slots: Slots) {
    const namedCards = this.namedCards();
    const limit = (namedCards && namedCards.length) ?
      (namedCards[0].deck_limit || 2) :
      2;
    return sumBy(namedCards, card => slots[card.code] || 0) > limit;
  }

  _onIncrement = (code: string) => {
    const { cards } = this.props;
    this.setState((state) => {
      const slots: Slots = {
        ...state.slots,
        [code]: (state.slots[code] || 0) + 1,
      };
      const possibleDecrement = find(reverse(this.namedCards()), card => (
        card.code !== code && slots[card.code] > 0 &&
        (card.xp || 0) < (cards[code].xp || 0)
      ));
      if (possibleDecrement) {
        slots[possibleDecrement.code]--;
        if (slots[possibleDecrement.code] <= 0) {
          delete slots[possibleDecrement.code];
        }
      }
      return {
        slots,
      };
    });
  };

  _onDecrement = (code: string) => {
    this.setState((state) => {
      const slots: Slots = {
        ...state.slots,
        [code]: (state.slots[code] || 0) - 1,
      };
      if (slots[code] <= 0) {
        delete slots[code];
      }
      return {
        slots,
      };
    });
  };

  render() {
    const {
      toggleVisible,
      visible,
      viewRef,
      card,
    } = this.props;
    const {
      slots,
    } = this.state;
    const overLimit = this.overLimit(slots);
    const namedCards = this.namedCards();
    return (
      <Dialog
        title={card ? card.renderName : t`Upgrade Card`}
        visible={visible}
        viewRef={viewRef}
      >
        { !!overLimit && (
          <DialogComponent.Description>
            { t`Too many copies of the card` }
          </DialogComponent.Description>
        ) }
        <View style={styles.column}>
          { map(namedCards, card => (
            <CardUpgradeOption
              key={card.code}
              card={card}
              code={card.code}
              count={slots[card.code] || 0}
              onIncrement={this._onIncrement}
              onDecrement={this._onDecrement}
            />
          )) }
        </View>
        <DialogComponent.Button
          label={t`Cancel`}
          onPress={toggleVisible}
        />
        <DialogComponent.Button
          label={t`Okay`}
          disabled={overLimit}
          color={overLimit ? COLORS.darkGray : COLORS.lightBlue}
          onPress={this._onOkayPress}
        />
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});
