import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { forEach, map, sumBy } from 'lodash';
import { Results } from 'realm';
import { t } from 'ttag';
import DialogComponent from 'react-native-dialog';
import { connectRealm, CardResults } from 'react-native-realm';

import CardUpgradeOption from './CardUpgradeOption';
import { Slots } from '../../../actions/types';
import Dialog from '../../core/Dialog';
import Card from '../../../data/Card';
import { COLORS } from '../../../styles/colors';

interface OwnProps {
  card?: Card;
  tabooSetId?: number;
  slots?: Slots;
  visible: boolean;
  viewRef?: View;
  toggleVisible: () => void;
  updateSlots: (slots: Slots) => void;
}

interface RealmProps {
  cards: Results<Card>;
}

interface State {
  slots: Slots;
  namedCards: Card[];
}

type Props = OwnProps & RealmProps;

class CardUpgradeDialog extends React.Component<Props, State> {
  state: State = {
    slots: {},
    namedCards: [],
  };

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
      slots,
      cards,
      card,
      tabooSetId,
    } = this.props;
    if (visible && !prevProps.visible && slots && card) {
      const namedCards: Card[] = [];
      forEach(
        cards
          .filtered(`(real_name == "${card.real_name}") and (${Card.tabooSetQuery(tabooSetId)})`)
          .sorted([['real_name', false], ['xp', false]]),
        card => namedCards.push(card));
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        slots,
        namedCards,
      });
    }
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
    const {
      namedCards,
    } = this.state;
    const limit = (namedCards && namedCards.length) ? (namedCards[0].deck_limit || 2) : 2;
    return sumBy(namedCards, card => slots[card.code] || 0) > limit;
  }

  _onIncrement = (index: number) => {
    this.setState((state) => {
      const code = state.namedCards[index].code;
      const slots: Slots = {
        ...state.slots,
        [code]: (state.slots[code] || 0) + 1,
      };
      return {
        slots,
      };
    });
  };

  _onDecrement = (index: number) => {
    this.setState((state) => {
      const code = state.namedCards[index].code;
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
      namedCards,
    } = this.state;
    const overLimit = this.overLimit(slots);

    return (
      <Dialog
        title={card ? card.renderName : t`Upgrade Card`}
        visible={visible}
        viewRef={viewRef}
      >
        { overLimit && (
          <DialogComponent.Description>
            { t`Too many copies of the card` }
          </DialogComponent.Description>
        ) }
        <View style={styles.column}>
          { map(namedCards, (card, index) => (
            <CardUpgradeOption
              key={card.code}
              card={card}
              index={index}
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
          color={COLORS.lightBlue}
          onPress={this._onOkayPress}
        />
      </Dialog>
    );
  }
}

export default connectRealm<OwnProps, RealmProps, Card>(
  CardUpgradeDialog, {
    schemas: ['Card'],
    mapToProps(results: CardResults<Card>): RealmProps {
      return {
        cards: results.cards,
      };
    },
  });

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});
