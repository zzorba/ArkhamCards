import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys } from 'lodash';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WeaknessDrawComponent from './WeaknessDrawComponent';
import withWeaknessCards from './withWeaknessCards';
import L from '../../app/i18n';
import Button from '../core/Button';
import { RANDOM_BASIC_WEAKNESS } from '../../constants';

class WeaknessDrawDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    saveWeakness: PropTypes.func.isRequired,
    slots: PropTypes.object.isRequired,

    // From redux
    in_collection: PropTypes.object,
    // From weakness HOC
    cards: PropTypes.object,
    cardsMap: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      replaceRandomBasicWeakness: true,
      slots: props.slots,
      saving: false,
      pendingNextCard: null,
    };

    this._saveDrawnCard = this.saveDrawnCard.bind(this);
    this._updateDrawnCard = this.updateDrawnCard.bind(this);
    this._toggleReplaceRandomBasicWeakness = this.toggleReplaceRandomBasicWeakness.bind(this);
  }

  toggleReplaceRandomBasicWeakness() {
    this.setState({
      replaceRandomBasicWeakness: !this.state.replaceRandomBasicWeakness,
    });
  }

  updateDrawnCard(nextCard) {
    this.setState({
      pendingNextCard: nextCard,
    });
  }

  saveDrawnCard() {
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
      pendingNextCard: null,
      slots: newSlots,
    });
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
          text={L('Save to Deck')}
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
    const packCodes = {};
    forEach(cards, weaknessCard => {
      if (in_collection[weaknessCard.pack_code] || weaknessCard.pack_code === 'core') {
        packCodes[weaknessCard.pack_code] = 1;
      }
    });
    const assignedCards = {};
    forEach(keys(slots), code => {
      if (cardsMap[code]) {
        assignedCards[code] = slots[code];
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

function mapStateToProps(state) {
  return {
    packs: state.packs.all,
    in_collection: state.packs.in_collection || {},
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withWeaknessCards(WeaknessDrawDialog)
);

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
});
