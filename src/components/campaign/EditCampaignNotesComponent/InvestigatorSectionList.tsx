import React, { useCallback } from 'react';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import InvestigatorSectionRow from './InvestigatorSectionRow';
import { InvestigatorNotes } from '@actions/types';
import Card from '@data/Card';
import { ShowTextEditDialog } from '@components/core/withDialogs';
import { s } from '@styles/space';

interface Props {
  allInvestigators: Card[];
  updateInvestigatorNotes: (notes: InvestigatorNotes) => void;
  investigatorNotes: InvestigatorNotes;
  showDialog: ShowTextEditDialog;
}

export default function InvestigatorSectionList({ allInvestigators, updateInvestigatorNotes, investigatorNotes, showDialog }: Props) {
  const renderDeckRow = useCallback((investigator: Card) => {
    return (
      <InvestigatorSectionRow
        key={investigator.code}
        investigator={investigator}
        investigatorNotes={investigatorNotes}
        updateInvestigatorNotes={updateInvestigatorNotes}
        showDialog={showDialog}
      />
    );
  }, [investigatorNotes, updateInvestigatorNotes, showDialog]);

  return (
    <View style={styles.investigatorNotes}>
      { map(allInvestigators, investigator => renderDeckRow(investigator)) }
    </View>
  );
}

const styles = StyleSheet.create({
  investigatorNotes: {
    marginLeft: s,
    marginRight: s,
  },
});
