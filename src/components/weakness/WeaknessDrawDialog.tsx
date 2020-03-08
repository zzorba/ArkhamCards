import React from 'react';
import { forEach, keys } from 'lodash';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import WeaknessDrawComponent from './WeaknessDrawComponent';
import withWeaknessCards, { WeaknessCardProps } from './withWeaknessCards';
import { t } from 'ttag';
import { Slots } from 'actions/types';
import Button from 'components/core/Button';
import { NavigationProps } from 'components/nav/types';
import { AppState } from 'reducers';
import { RANDOM_BASIC_WEAKNESS } from 'constants';

export interface DrawWeaknessProps {
  saveWeakness: (code: string, replaceRandomBasicWeakness: boolean) => void;
  slots: Slots;
}

interface ReduxProps {
  in_collection: { [pack_code: string]: boolean };
}

type Props = NavigationProps & DrawWeaknessProps & ReduxProps & WeaknessCardProps;

interface State {
  replaceRandomBasicWeakness: boolean;
  slots: Slots;
  saving: boolean;
  pendingNextCard?: string;
}

class WeaknessDrawDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      replaceRandomBasicWeakness: true,
      slots: props.slots,
      saving: false,
    };
  }

  _toggleReplaceRandomBasicWeakness = () => {
    this.setState({
      replaceRandomBasicWeakness: !this.state.replaceRandomBasicWeakness,
    });
  };

  _updateDrawnCard = (nextCard: string) => {
    this.setState({
      pendingNextCard: nextCard,
    });
  }

  _saveDrawnCard = () => {
    const {
      pendingNextCard,
    } = this.state;
    const {
      saveWeakness,
    } = this.props;
    const {
      replaceRandomBasicWeakness,
      slots,
    } = this.state;
    if (pendingNextCard) {
      // We are in 'pending' mode to don't save it immediately.
      saveWeakness(pendingNextCard, replaceRandomBasicWeakness);
      const newSlots = Object.assign({}, slots);
      newSlots[pendingNextCard] = (newSlots[pendingNextCard] || 0) + 1;
      if (replaceRandomBasicWeakness && newSlots[RANDOM_BASIC_WEAKNESS] > 0) {
        newSlots[RANDOM_BASIC_WEAKNESS] = newSlots[RANDOM_BASIC_WEAKNESS] - 1;
        if (newSlots[RANDOM_BASIC_WEAKNESS] === 0) {
          delete newSlots[RANDOM_BASIC_WEAKNESS];
        }
      }
      this.setState({
        pendingNextCard: undefined,
        slots: newSlots,
      });
    }
  }

  renderFlippedHeader() {
    const {
      pendingNextCard,
    } = this.state;
    if (!pendingNextCard) {
      return null;
    }

    return (
      <View style={styles.button}>
        <Button
          color="green"
          onPress={this._saveDrawnCard}
          text={t`Save to Deck`}
        />
      </View>
    );
  }

  weaknessSetFromCollection() {
    const {
      in_collection,
      cards,
      cardsMap,
    } = this.props;
    const {
      slots,
    } = this.state;
    const packCodes: { [pack_cod: string]: number } = {};
    forEach(cards, weaknessCard => {
      if (in_collection[weaknessCard.pack_code] || weaknessCard.pack_code === 'core') {
        packCodes[weaknessCard.pack_code] = 1;
      }
    });
    const assignedCards: Slots = {};
    forEach(slots, (count, code) => {
      if (cardsMap[code]) {
        assignedCards[code] = count;
      }
    });
    return {
      packCodes: keys(packCodes),
      assignedCards,
    };
  }

  render() {
    const {
      componentId,
    } = this.props;

    return (
      <WeaknessDrawComponent
        componentId={componentId}
        customFlippedHeader={this.renderFlippedHeader()}
        weaknessSet={this.weaknessSetFromCollection()}
        updateDrawnCard={this._updateDrawnCard}
        saving={this.state.saving}
      />
    );
  }
}

const EMPTY_IN_COLLECTION = {};
function mapStateToProps(state: AppState) {
  return {
    packs: state.packs.all,
    in_collection: state.packs.in_collection || EMPTY_IN_COLLECTION,
  };
}

export default connect(mapStateToProps)(
  withWeaknessCards(WeaknessDrawDialog)
);

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
});
