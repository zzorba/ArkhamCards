import React, { useCallback } from 'react';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import InvestigatorSectionRow from './InvestigatorSectionRow';
import { InvestigatorNotes } from '@actions/types';
import Card from '@data/types/Card';
import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import { s } from '@styles/space';
import { ShowCountDialog } from '@components/deck/dialogs';

interface Props {
  allInvestigators: Card[];
  updateInvestigatorNotes: (notes: InvestigatorNotes) => void;
  investigatorNotes: InvestigatorNotes | undefined;
  showDialog: ShowTextEditDialog;
  showCountDialog: ShowCountDialog;
}

export default function InvestigatorSectionList({ allInvestigators, updateInvestigatorNotes, investigatorNotes, showDialog, showCountDialog }: Props) {
  const renderDeckRow = useCallback((investigator: Card) => {
    return (
      <InvestigatorSectionRow
        key={investigator.code}
        investigator={investigator}
        investigatorNotes={investigatorNotes}
        updateInvestigatorNotes={updateInvestigatorNotes}
        showDialog={showDialog}
        showCountDialog={showCountDialog}
      />
    );
  }, [investigatorNotes, updateInvestigatorNotes, showDialog, showCountDialog]);

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
