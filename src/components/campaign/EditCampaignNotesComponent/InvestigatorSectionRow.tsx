import React, { useCallback, useMemo } from 'react';
import { map } from 'lodash';
import {
  View,
} from 'react-native';

import EditCountComponent from '../EditCountComponent';
import NotesSection from './NotesSection';
import { ShowTextEditDialog } from '@components/core/withDialogs';
import { InvestigatorNotes } from '@actions/types';
import Card from '@data/Card';

interface Props {
  investigator: Card;
  updateInvestigatorNotes: (investigatorNotes: InvestigatorNotes) => void;
  investigatorNotes: InvestigatorNotes;
  showDialog: ShowTextEditDialog;
}

export default function InvestigatorSectionRow({ investigator, updateInvestigatorNotes, investigatorNotes, showDialog }: Props) {
  const notesChanged = useCallback((index: number, notes: string[]) => {
    const sections = (investigatorNotes.sections || []).slice();
    const newNotes = Object.assign({}, sections[index].notes, { [investigator.code]: notes });
    sections[index] = Object.assign({}, sections[index], { notes: newNotes });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { sections }));
  }, [investigator, updateInvestigatorNotes, investigatorNotes]);

  const countChanged = useCallback((index: number, count: number) => {
    const counts = (investigatorNotes.counts || []).slice();
    const newCounts = Object.assign({}, counts[index].counts, { [investigator.code]: count });
    counts[index] = Object.assign({}, counts[index], { counts: newCounts });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { counts }));
  }, [investigator, updateInvestigatorNotes, investigatorNotes]);

  const notesSection = useMemo(() => {
    return (
      <View>
        { map(investigatorNotes.sections, (section, idx) => {
          const name = investigator.firstName || 'Unknown';
          const title = `${name}’s ${section.title}`;
          return (
            <NotesSection
              key={idx}
              title={title}
              notes={section.notes[investigator.code] || []}
              index={idx}
              notesChanged={notesChanged}
              showDialog={showDialog}
              isInvestigator
            />
          );
        }) }
      </View>
    );
  }, [investigator, investigatorNotes.sections, notesChanged, showDialog]);

  const countsSection = useMemo(() => {
    return (
      <View>
        { map(investigatorNotes.counts, (section, idx) => {
          const name = investigator.firstName ?
            investigator.firstName.toUpperCase() :
            'Unknown';
          const title = `${name}’S ${section.title}`;
          return (
            <EditCountComponent
              key={idx}
              index={idx}
              title={title}
              count={section.counts[investigator.code] || 0}
              countChanged={countChanged}
              isInvestigator
            />
          );
        }) }
      </View>
    );
  }, [investigator, investigatorNotes.counts, countChanged]);

  return (
    <View>
      { notesSection }
      { countsSection }
    </View>
  );
}
