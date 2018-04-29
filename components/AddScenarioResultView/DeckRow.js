import React from 'react';
import PropTypes from 'prop-types';
import { flatten, head } from 'lodash';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import * as Actions from '../../actions';
import { getDeck } from '../../reducers';
import InvestigatorImage from '../core/InvestigatorImage';
import LabeledTextBox from '../core/LabeledTextBox';

class DeckRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    investigator: PropTypes.object,
    updates: PropTypes.object,
    remove: PropTypes.func.isRequired,
    updatesChanged: PropTypes.func.isRequired,
    fetchDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateTrauma = this.updateTrauma.bind(this);
    this._onRemove = this.onRemove.bind(this);
    this._showTraumaDialog = this.showTraumaDialog.bind(this);
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
      fetchDeck,
    } = this.props;
    if (!deck) {
      fetchDeck(id, false);
    }
  }

  traumaText() {
    const {
      updates: {
        trauma: {
          physical = 0,
          mental = 0,
        },
      },
    } = this.props;
    if (mental === 0 && physical === 0) {
      return 'None';
    }
    return flatten([
      (physical === 0 ? [] : [`Physical: ${physical}`]),
      (mental === 0 ? [] : [`Mental: ${mental}`]),
    ]).join(', ');
  }

  renderTrauma() {
    return (
      <LabeledTextBox
        label="Trauma"
        onPress={this._showTraumaDialog}
        value={this.traumaText()}
      />
    );
  }

  render() {
    const {
      deck,
      investigator,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.deleteIcon}>
          <TouchableOpacity onPress={this._onRemove}>
            <MaterialCommunityIcons name="close" size={24} color="#444" />
          </TouchableOpacity>
        </View>
        <View style={styles.investigatorImage}>
          <InvestigatorImage card={investigator} />
        </View>
        <View style={styles.column}>
          <Text>{ deck.name }</Text>
          { this.renderTrauma() }
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(DeckRow, {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      if (!props.deck || !props.deck.investigator_code) {
        return {
          investigator: null,
        };
      }
      const query = `code == "${props.deck.investigator_code}"`;
      return {
        investigator: head(results.cards.filtered(query)),
      };
    },
  }),
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  investigatorImage: {
    marginRight: 8,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: 8,
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
  },
});
