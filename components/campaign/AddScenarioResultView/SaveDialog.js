import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, forEach, map } from 'lodash';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import DialogComponent from 'react-native-dialog';

import { exileString } from './exile';
import { traumaString, DEFAULT_TRAUMA_DATA } from '../trauma';
import Dialog from '../../core/Dialog';
import typography from '../../../styles/typography';
import { getAllDecks } from '../../../reducers';

class SaveDialog extends React.Component {
  static propTypes = {
    deckIds: PropTypes.array.isRequired,
    deckUpdates: PropTypes.object.isRequired,
    traumaDeltas: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onToggleDialog: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    viewRef: PropTypes.object,
    // From redux
    decks: PropTypes.object.isRequired,
    // From realm
    cards: PropTypes.object,
    investigators: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      saving: false,
      deckIds: [],
    };

    this._onCancel = this.onCancel.bind(this);
    this._onSave = this.onSave.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      visible,
      deckIds,
    } = this.props;
    if (visible && !prevProps.visible) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        visible,
        deckIds,
      });
    }
  }

  onCancel() {
    this.setState({
      saving: false,
    });
    this.props.onToggleDialog();
  }

  onSave() {
    this.setState({
      saving: true,
    });
    this.props.onSave();
  }

  investigators() {
    const {
      decks,
      investigators,
      deckIds,
    } = this.props;
    return flatMap(
      flatMap(deckIds, deckId => decks[deckId]),
      deck => investigators[deck.investigator_code]
    );
  }
  renderInvestigatorChangeSummaries() {
    const {
      decks,
      investigators,
      deckUpdates,
      traumaDeltas,
      cards,
    } = this.props;

    return (
      <View>
        { map(this.state.deckIds, deckId => {
          const deck = decks[deckId];
          const investigatorCode = deck.investigator_code;
          const investigator = investigators[investigatorCode];
          const updates = deckUpdates[deckId] || { xp: 0 };
          const trauma = traumaString(traumaDeltas[investigatorCode] || DEFAULT_TRAUMA_DATA, investigator);
          const exile = exileString(updates.exiles || {}, cards);
          return (
            <View key={deckId} style={styles.investigatorBlock}>
              <Text style={typography.small}>
                { investigator.name.toUpperCase() }
              </Text>
              { trauma !== 'None' && (
                <Text style={typography.text}>{ `Trauma: ${trauma}` }</Text>
              ) }
              <Text style={typography.text}>
                { `Experience: ${updates.xp}` }
              </Text>
              { exile !== 'None' && (
                <Text style={typography.text}>{ `Exile: ${exile}` }</Text>
              ) }
            </View>
          );
        }) }
      </View>
    );
  }

  render() {
    const {
      visible,
      viewRef,
    } = this.props;
    const {
      saving,
    } = this.state;

    return (
      <Dialog
        title="Save Scenario Results"
        visible={visible}
        viewRef={viewRef}
      >
        { saving ? (
          <View style={styles.savingContainer}>
            <Text style={typography.text}>Saving</Text>
            <ActivityIndicator
              style={[{ height: 80 }]}
              size="small"
              animating
            />
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={[typography.small, styles.text]}>
              Are you sure you want to save these changes to ArkhamDB?
            </Text>
            { this.renderInvestigatorChangeSummaries() }
            <Text style={[typography.small, styles.text]}>
              Note: A network connection is required
            </Text>
          </View>
        ) }
        <DialogComponent.Button disabled={saving} label="Cancel" onPress={this._onCancel} />
        <DialogComponent.Button disabled={saving} label="Save" onPress={this._onSave} />
      </Dialog>
    );
  }
}


function mapStateToProps(state) {
  return {
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(SaveDialog, {
    schemas: ['Card'],
    mapToProps(results) {
      const investigators = {};
      const cards = {};
      forEach(results.cards, card => {
        cards[card.code] = card;
        if (card.type_code === 'investigator') {
          investigators[card.code] = card;
        }
      });
      return {
        cards,
        investigators,
      };
    },
  })
);

const styles = StyleSheet.create({
  investigatorBlock: {
    marginBottom: 8,
    flexDirection: 'column',
  },
  content: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'column',
  },
  text: {
    marginBottom: 16,
  },
  savingContainer: {
    margin: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
