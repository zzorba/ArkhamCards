import React from 'react';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import InvestigatorSectionRow from './InvestigatorSectionRow';
import { InvestigatorNotes } from 'actions/types';
import Card from 'data/Card';
import { ShowTextEditDialog } from 'components/core/withDialogs';
import { s } from 'styles/space';

interface Props {
  componentId: string;
  allInvestigators: Card[];
  updateInvestigatorNotes: (notes: InvestigatorNotes) => void;
  investigatorNotes: InvestigatorNotes;
  showDialog: ShowTextEditDialog;
}

export default class InvestigatorSectionList extends React.Component<Props> {
  renderDeckRow(investigator: Card) {
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
        { map(allInvestigators, investigator =>
          this.renderDeckRow(investigator)
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  investigatorNotes: {
    marginLeft: s,
    marginRight: s,
  },
});
