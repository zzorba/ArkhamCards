import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import InvestigatorSectionRow from './InvestigatorSectionRow';

export default class InvestigatorSectionList extends React.Component {
  static propTypes = {
    allInvestigators: PropTypes.array,
    updateInvestigatorNotes: PropTypes.func.isRequired,
    investigatorNotes: PropTypes.object.isRequired,
    showDialog: PropTypes.func.isRequired,
  };

  renderDeckRow(investigator) {
    const {
      investigatorNotes,
      updateInvestigatorNotes,
      showDialog,
    } = this.props;
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
      allInvestigators,
    } = this.props;
    return (
      <View style={styles.investigatorNotes}>
        { map(allInvestigators, investigator => this.renderDeckRow(investigator)) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  investigatorNotes: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});
