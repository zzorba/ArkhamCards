import React, { useCallback } from 'react';
import { map } from 'lodash';


import EditCountComponent from '../EditCountComponent';
import { InvestigatorNotes } from '@actions/types';
import Card from '@data/types/Card';
import { ShowCountDialog } from '@components/deck/dialogs';

interface Props {
  investigator: Card;
  updateInvestigatorNotes: (investigatorNotes: InvestigatorNotes) => void;
  investigatorNotes: InvestigatorNotes;
  showCountDialog: ShowCountDialog;
  first?: boolean;
}

export default function InvestigatorCountsSection({
  investigator,
  updateInvestigatorNotes,
  investigatorNotes,
  showCountDialog,
  first,
}: Props) {
  const countChanged = useCallback((index: number, count: number) => {
    const counts = (investigatorNotes.counts || []).slice();
    const newCounts = Object.assign({}, counts[index].counts, { [investigator.code]: count });
    counts[index] = Object.assign({}, counts[index], { counts: newCounts });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { counts }));
  }, [investigator, updateInvestigatorNotes, investigatorNotes]);

  if (investigatorNotes?.counts?.length === 0) {
    return null;
  }
  return (
    <>
      { map(investigatorNotes.counts, (section, idx) => {
        return (
          <EditCountComponent
            key={idx}
            index={idx}
            title={section.title}
            count={section.counts[investigator.code] || 0}
            countChanged={countChanged}
            showCountDialog={showCountDialog}
            first={first && idx === 0}
            last={idx === (investigatorNotes?.counts?.length || 0) - 1}
          />
        );
      }) }
    </>
  );
}