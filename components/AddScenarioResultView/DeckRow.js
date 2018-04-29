import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import * as Actions from '../../actions';
import { getDeck } from '../../reducers';
import InvestigatorImage from '../core/InvestigatorImage';

class DeckRow extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    investigator: PropTypes.object,

    remove: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._onRemove = this.onRemove.bind(this);
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

  render() {
    const {
      deck,
      investigator,
    } = this.props;
    return (
      <View style={styles.row}>
        <View style={styles.deleteIcon}>
          <TouchableOpacity onPress={this._onRemove}>
            <MaterialCommunityIcons name="close" size={24} color="#444" />
          </TouchableOpacity>
        </View>
        <InvestigatorImage card={investigator} />
      </View>
    )
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
  row: {
    position: 'relative',
    height: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
  },
});
