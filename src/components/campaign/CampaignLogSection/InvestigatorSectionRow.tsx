import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import EditCountComponent from '../EditCountComponent';
import NotesSection from './NotesSection';
import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import { InvestigatorNotes } from '@actions/types';
import Card from '@data/types/Card';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { ShowCountDialog } from '@components/deck/dialogs';

interface Props {
  investigator: Card;
  updateInvestigatorNotes: (investigatorNotes: InvestigatorNotes) => void;
  investigatorNotes: InvestigatorNotes | undefined;
  showDialog: ShowTextEditDialog;
  showCountDialog: ShowCountDialog;
  inline?: boolean;
  hideCounts?: boolean;
}

export default function InvestigatorSectionRow({
  investigator,
  updateInvestigatorNotes,
  investigatorNotes,
  showDialog,
  showCountDialog,
  inline,
  hideCounts,
}: Props) {
  const { borderStyle } = useContext(StyleContext);
  const notesChanged = useCallback((index: number, notes: string[]) => {
    const sections = (investigatorNotes?.sections || []).slice();
    const newNotes = Object.assign({}, sections[index].notes, { [investigator.code]: notes });
    sections[index] = Object.assign({}, sections[index], { notes: newNotes });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { sections }));
  }, [investigator, updateInvestigatorNotes, investigatorNotes]);

  const countChanged = useCallback((index: number, count: number) => {
    const counts = (investigatorNotes?.counts || []).slice();
    const newCounts = Object.assign({}, counts[index].counts, { [investigator.code]: count });
    counts[index] = Object.assign({}, counts[index], { counts: newCounts });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { counts }));
  }, [investigator, updateInvestigatorNotes, investigatorNotes]);
  const hasCounts = (investigatorNotes?.counts?.length || 0) > 0;

  const notesSection = useMemo(() => {
    return (
      <View style={[borderStyle, hasCounts ? styles.border : undefined]}>
        { map(investigatorNotes?.sections, (section, idx) => {
          return (
            <NotesSection
              key={idx}
              title={section.title}
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
  }, [investigator, investigatorNotes?.sections, notesChanged, showDialog, borderStyle, hasCounts]);

  const countsSection = useMemo(() => {
    if (investigatorNotes?.counts?.length === 0) {
      return null;
    }
    return (
      <View style={[space.paddingTopS, space.paddingBottomS]}>
        { map(investigatorNotes?.counts, (section, idx) => {
          return (
            <EditCountComponent
              key={idx}
              index={idx}
              title={section.title}
              count={section.counts[investigator.code] || 0}
              countChanged={countChanged}
              showCountDialog={showCountDialog}
              first={idx === 0}
              last={idx === (investigatorNotes?.counts?.length || 0) - 1}
            />
          );
        }) }
      </View>
    );
  }, [investigator, investigatorNotes?.counts, showCountDialog, countChanged]);
  const faction = investigator.factionCode();
  if (investigatorNotes?.sections?.length === 0 && investigatorNotes?.counts?.length === 0) {
    return null;
  }
  if (inline) {
    return (
      <>
        { notesSection }
        { !hideCounts && countsSection }
      </>
    );
  }
  return (
    <View style={space.paddingBottomS}>
      <RoundedFactionBlock
        header={<DeckSectionHeader faction={faction} title={investigator.name} />}
        faction={faction}
      >
        { notesSection }
        { !hideCounts && countsSection }
      </RoundedFactionBlock>
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
