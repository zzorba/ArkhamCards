import React from 'react';
import PropTypes from 'prop-types';
import { find, flatten, keys, map, sum, values } from 'lodash';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import DeckListRow from '../DeckListRow';
import XpComponent from '../XpComponent';
import * as Actions from '../../actions';
import { getDeck } from '../../reducers';
import LabeledTextBox from '../core/LabeledTextBox';

class DeckRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    updates: PropTypes.object,
    remove: PropTypes.func.isRequired,
    updatesChanged: PropTypes.func,
    fetchPublicDeck: PropTypes.func.isRequired,
    // From realm
    investigators: PropTypes.object,
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._updateExiles = this.updateExiles.bind(this);
    this._updateXp = this.updateXp.bind(this);
    this._updateTrauma = this.updateTrauma.bind(this);
    this._onRemove = this.onRemove.bind(this);
    this._onDeckPress = this.onDeckPress.bind(this);
    this._showTraumaDialog = this.showTraumaDialog.bind(this);
    this._showExileDialog = this.showExileDialog.bind(this);
  }

  onDeckPress() {
    const {
      navigator,
      id,
    } = this.props;
    navigator.showModal({
      screen: 'Deck',
      passProps: {
        id: id,
        isPrivate: true,
        modal: true,
      },
    });
  }

  showExileDialog() {
    const {
      navigator,
      id,
      updates,
    } = this.props;
    navigator.push({
      screen: 'Dialog.ExileCards',
      passProps: {
        id,
        updateExiles: this._updateExiles,
        exiles: updates.exiles,
      },
    });
  }

  showTraumaDialog() {
    const {
      navigator,
      updates,
    } = this.props;
    navigator.showLightBox({
      screen: 'Dialog.EditTrauma',
      passProps: {
        updateTrauma: this._updateTrauma,
        trauma: updates.trauma,
      },
      style: {
        backgroundColor: 'rgba(128,128,128,.75)',
      },
    });
  }

  updateExiles(exiles) {
    const {
      id,
      updatesChanged,
      updates,
    } = this.props;
    updatesChanged(id, Object.assign({}, updates, { exiles }));
  }

  updateXp(xp) {
    const {
      id,
      updatesChanged,
      updates,
    } = this.props;
    updatesChanged(id, Object.assign({}, updates, { xp }));
  }

  updateTrauma(trauma) {
    const {
      id,
      updatesChanged,
      updates,
    } = this.props;
    updatesChanged(id, Object.assign({}, updates, { trauma }));
  }

  onRemove() {
    const {
      remove,
      id,
    } = this.props;
    remove(id);
  }

  componentDidMount() {
    const {
      id,
      deck,
      fetchPublicDeck,
    } = this.props;
    if (!deck) {
      fetchPublicDeck(id, false);
    }
  }

  renderXp() {
    const {
      updatesChanged,
      updates: {
        xp,
      },
    } = this.props;
    if (!updatesChanged) {
      return null;
    }
    return <XpComponent xp={xp} onChange={this._updateXp} />;
  }

  traumaText() {
    const {
      updates: {
        trauma: {
          physical = 0,
          mental = 0,
          killed = false,
          insane = false,
        },
      },
    } = this.props;
    if (killed) {
      return 'Killed';
    }
    if (insane) {
      return 'Insane';
    }
    if (mental === 0 && physical === 0) {
      return 'None';
    }
    return flatten([
      (physical === 0 ? [] : [`Physical: ${physical}`]),
      (mental === 0 ? [] : [`Mental: ${mental}`]),
    ]).join(', ');
  }

  exileText() {
    const {
      cards,
      updates: {
        exiles,
      },
    } = this.props;
    const numCards = keys(exiles).length;
    switch (numCards) {
      case 0: return 'None';
      case 1:
        return map(keys(exiles), code => {
          const count = exiles[code];
          const card = cards[code];
          if (count === 1) {
            return card.name;
          }
          return `${count}x ${card.name}`;
        }).join(', ');
      default: {
        // No room to print more than one card name, so just sum it
        const totalCount = sum(values(exiles));
        return `${totalCount} cards`;
      }
    }
  }

  hasExile() {
    const {
      deck,
      cards,
    } = this.props;
    return !!find(keys(deck.slots), code => cards[code].exile);
  }

  renderExile() {
    if (!this.props.updatesChanged || !this.hasExile()) {
      return null;
    }
    return (
      <View style={styles.row}>
        <LabeledTextBox
          label="Exiled Cards"
          onPress={this._showExileDialog}
          value={this.exileText()}
        />
      </View>
    );
  }

  renderDetails() {
    if (!this.props.updatesChanged) {
      return null;
    }
    return (
      <View>
        { this.renderXp() }
        { this.renderExile() }
      </View>
    );
  }

  render() {
    const {
      id,
      deck,
      cards,
      investigators,
    } = this.props;
    return (
      <View style={styles.card}>
        <DeckListRow
          id={id}
          deck={deck}
          cards={cards}
          investigators={investigators}
          onPress={this._onDeckPress}
          investigator={deck ? cards[deck.investigator_code] : null}
          titleButton={
            <TouchableOpacity onPress={this._onRemove}>
              <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          }
          details={this.renderDetails()}
        />
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckRow);

const styles = StyleSheet.create({
  row: {
    paddingBottom: 4,
    width: '100%',
  },
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
