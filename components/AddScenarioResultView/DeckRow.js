import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../../actions';
import { getDeck } from '../../reducers';
import InvestigatorImage from '../core/InvestigatorImage';

class DeckRow extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    investigator: PropTypes.object,
  };

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
      const investigator = head(
        results.cards.filtered(`code == "${props.deck.investigator_code}"`));
      return {
        investigator,
      };
    },
  }),
);

const styles = StyleSheet.create({
  row: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
});
