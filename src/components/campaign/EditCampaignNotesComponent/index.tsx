import React, { useCallback, useMemo } from 'react';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { CampaignNotes, InvestigatorNotes } from '@actions/types';
import Card from '@data/Card';
import { ShowTextEditDialog } from '@components/core/withDialogs';
import EditCountComponent from '../EditCountComponent';
import InvestigatorSectionList from './InvestigatorSectionList';
import NotesSection from './NotesSection';
import { s, xs } from '@styles/space';

interface Props {
  allInvestigators: Card[];
  campaignNotes: CampaignNotes;
  updateCampaignNotes: (campaignNotes: CampaignNotes) => void;
  showDialog: ShowTextEditDialog;
  showAddSectionDialog: (
    addSection: (
      name: string,
      isCount: boolean,
      perInvestigator: boolean
    ) => void
  ) => void;
}
export default function EditCampaignNotesComponent({
  allInvestigators,
  campaignNotes,
  updateCampaignNotes,
  showDialog,
  showAddSectionDialog,
}: Props) {
  const addNotesSection = useCallback((name: string, isCount: boolean, perInvestigator: boolean) => {
    const newCampaignNotes = { ...campaignNotes };
    if (perInvestigator) {
      const newInvestigatorNotes = { ...campaignNotes.investigatorNotes };
      if (isCount) {
        newInvestigatorNotes.counts = (newInvestigatorNotes.counts || []).slice();
        newInvestigatorNotes.counts.push({ title: name, counts: {}, custom: true });
      } else {
        newInvestigatorNotes.sections = (newInvestigatorNotes.sections || []).slice();
        newInvestigatorNotes.sections.push({ title: name, notes: {}, custom: true });
      }
      newCampaignNotes.investigatorNotes = newInvestigatorNotes;
    } else {
      if (isCount) {
        newCampaignNotes.counts = (campaignNotes.counts || []).slice();
        newCampaignNotes.counts.push({ title: name, count: 0, custom: true });
      } else {
        newCampaignNotes.sections = (campaignNotes.sections || []).slice();
        newCampaignNotes.sections.push({ title: name, notes: [], custom: true });
      }
    }
    updateCampaignNotes(newCampaignNotes);
  }, [campaignNotes, updateCampaignNotes]);
  const addSectionDialogPressed = useCallback(() => {
    showAddSectionDialog(addNotesSection);
  }, [showAddSectionDialog, addNotesSection]);

  const notesChanged = useCallback((index: number, notes: string[]) => {
    const sections = (campaignNotes.sections || []).slice();
    sections[index] = {
      ...sections[index],
      notes,
    };
    updateCampaignNotes({
      ...campaignNotes,
      sections,
    });
  }, [updateCampaignNotes, campaignNotes]);

  const countChanged = useCallback((index: number, count: number) => {
    const counts = (campaignNotes.counts || []).slice();
    counts[index] = { ...counts[index], count };
    updateCampaignNotes({ ...campaignNotes, counts });
  }, [updateCampaignNotes, campaignNotes]);

  const updateInvestigatorNotes = useCallback((investigatorNotes: InvestigatorNotes) => {
    updateCampaignNotes({
      ...campaignNotes,
      investigatorNotes,
    });
  }, [updateCampaignNotes, campaignNotes]);

  const notesSection = useMemo(() => {
    return (
      <View>
        { map(campaignNotes.sections, (section, idx) => (
          <NotesSection
            key={idx}
            title={section.title}
            notes={section.notes}
            index={idx}
            notesChanged={notesChanged}
            showDialog={showDialog}
          />
        )) }
      </View>
    );
  }, [campaignNotes.sections, notesChanged, showDialog]);

  const countsSection = useMemo(() => {
    return (
      <View>
        { map(campaignNotes.counts, (section, idx) => (
          <EditCountComponent
            key={idx}
            index={idx}
            title={section.title}
            count={section.count || 0}
            countChanged={countChanged}
          />
        )) }
      </View>
    );
  }, [campaignNotes.counts, countChanged]);

  const investigatorSection = useMemo(() => {
    const investigatorNotes = campaignNotes.investigatorNotes;
    return (
      <View style={styles.investigatorSection}>
        <InvestigatorSectionList
          allInvestigators={allInvestigators}
          investigatorNotes={investigatorNotes}
          updateInvestigatorNotes={updateInvestigatorNotes}
          showDialog={showDialog}
        />
      </View>
    );
  }, [campaignNotes.investigatorNotes, allInvestigators, showDialog, updateInvestigatorNotes]);
  return (
    <View style={styles.underline}>
      { notesSection }
      { countsSection }
      { investigatorSection }
      <BasicButton title={t`Add Log Section`} onPress={addSectionDialogPressed} />
    </View>
  );
}

const styles = StyleSheet.create({
  underline: {
    paddingBottom: s,
    marginBottom: xs,
  },
  investigatorSection: {
    marginTop: s,
  },
});
