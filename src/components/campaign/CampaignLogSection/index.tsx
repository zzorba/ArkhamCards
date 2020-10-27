import React, { useCallback, useMemo } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { t } from 'ttag';
import { map } from 'lodash';

import { ShowTextEditDialog } from '@components/core/withDialogs';
import { CampaignNotes, InvestigatorNotes } from '@actions/types';
import Card from '@data/Card';
import InvestigatorSectionList from './InvestigatorSectionList';
import EditCountComponent from '../EditCountComponent';
import NotesSection from './NotesSection';
import BasicButton from '@components/core/BasicButton';
import TextEditDialog from '@components/core/TextEditDialog';
import { s, xs } from '@styles/space';

interface Props {
  campaignNotes: CampaignNotes;
  updateCampaignNotes: (campaignNotes: CampaignNotes) => void;
  showTextEditDialog: ShowTextEditDialog;
  showAddSectionDialog: (
    addSection: (
      name: string,
      isCount: boolean,
      perInvestigator: boolean
    ) => void
  ) => void;
  allInvestigators: Card[];
}

export default function CampaignLogSection(props: Props) {
  const {
    campaignNotes,
    updateCampaignNotes,
    showTextEditDialog,
    showAddSectionDialog,
    allInvestigators,
  } = props;
  const delayedUpdateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    InteractionManager.runAfterInteractions(() => {
      updateCampaignNotes(campaignNotes);
    });
  }, [updateCampaignNotes]);

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
    delayedUpdateCampaignNotes(newCampaignNotes);
  }, [campaignNotes, delayedUpdateCampaignNotes]);
  const addSectionDialogPressed = useCallback(() => {
    showAddSectionDialog(addNotesSection);
  }, [showAddSectionDialog, addNotesSection]);

  const notesChanged = useCallback((index: number, notes: string[]) => {
    const sections = (campaignNotes.sections || []).slice();
    sections[index] = {
      ...sections[index],
      notes,
    };
    delayedUpdateCampaignNotes({
      ...campaignNotes,
      sections,
    });
  }, [delayedUpdateCampaignNotes, campaignNotes]);

  const countChanged = useCallback((index: number, count: number) => {
    if (campaignNotes.counts[index].count !== count) {
      const counts = (campaignNotes.counts || []).slice();
      counts[index] = { ...counts[index], count };
      delayedUpdateCampaignNotes({ ...campaignNotes, counts });
    }
  }, [delayedUpdateCampaignNotes, campaignNotes]);

  const updateInvestigatorNotes = useCallback((investigatorNotes: InvestigatorNotes) => {
    delayedUpdateCampaignNotes({
      ...campaignNotes,
      investigatorNotes,
    });
  }, [delayedUpdateCampaignNotes, campaignNotes]);

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
            showDialog={showTextEditDialog}
          />
        )) }
      </View>
    );
  }, [campaignNotes.sections, notesChanged, showTextEditDialog]);

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
          showDialog={showTextEditDialog}
        />
      </View>
    );
  }, [campaignNotes.investigatorNotes, allInvestigators, showTextEditDialog, updateInvestigatorNotes]);
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
