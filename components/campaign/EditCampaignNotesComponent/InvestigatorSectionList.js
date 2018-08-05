import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import InvestigatorSectionRow from './InvestigatorSectionRow';
import withPlayerCards from '../../withPlayerCards';
import { getAllDecks } from '../../../reducers';

class InvestigatorSectionList extends React.Component {
  static propTypes = {
    deckIds: PropTypes.array.isRequired,
    updateInvestigatorNotes: PropTypes.func.isRequired,
    investigatorNotes: PropTypes.object.isRequired,
    showDialog: PropTypes.func.isRequired,
    // from Redux
    decks: PropTypes.object.isRequired,
    // from withPlayerCards
    investigators: PropTypes.object,
  };

  renderDeckRow(deckId) {
    const {
      decks,
      investigators,
      investigatorNotes,
      updateInvestigatorNotes,
      showDialog,
    } = this.props;
    const deck = decks[deckId];
    if (!deck) {
      return null;
    }
    const investigator = investigators[deck.investigator_code];
    if (!investigator) {
      return null;
    }

    return (
      <InvestigatorSectionRow
        key={investigator.code}
        investigator={investigator}
        investigatorNotes={investigatorNotes}
        updateInvestigatorNotes={updateInvestigatorNotes}
        showDialog={showDialog}
      />
    );
  }

  render() {
    const {
      deckIds,
    } = this.props;
    return (
      <View style={styles.investigatorNotes}>
        { map(deckIds, deckId => this.renderDeckRow(deckId)) }
      </View>
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

export default withPlayerCards(
  connect(mapStateToProps, mapDispatchToProps)(InvestigatorSectionList)
);

const styles = StyleSheet.create({
  investigatorNotes: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});
