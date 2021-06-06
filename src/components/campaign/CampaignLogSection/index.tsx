import React, { useCallback, useMemo } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { t } from 'ttag';
import { map } from 'lodash';

import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import { CampaignNotes, InvestigatorNotes } from '@actions/types';
import Card from '@data/types/Card';
import InvestigatorSectionList from './InvestigatorSectionList';
import EditCountComponent from '../EditCountComponent';
import NotesSection from './NotesSection';
import space, { s, xs } from '@styles/space';
import { ShowCountDialog } from '@components/deck/dialogs';
import DeckButton from '@components/deck/controls/DeckButton';

interface Props {
  campaignNotes: CampaignNotes | undefined;
  updateCampaignNotes: (campaignNotes: CampaignNotes) => void;
  showTextEditDialog: ShowTextEditDialog;
  showCountDialog: ShowCountDialog;
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
    showCountDialog,
    allInvestigators,
  } = props;
  const delayedUpdateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    InteractionManager.runAfterInteractions(() => {
      updateCampaignNotes(campaignNotes);
    });
  }, [updateCampaignNotes]);

  const addNotesSection = useCallback((name: string, isCount: boolean, perInvestigator: boolean) => {
    const newCampaignNotes: CampaignNotes = { ...(campaignNotes || {}) };
    if (perInvestigator) {
      const newInvestigatorNotes: InvestigatorNotes = { ...(campaignNotes?.investigatorNotes || {}) };
      if (isCount) {
        newInvestigatorNotes.counts = [...(newInvestigatorNotes.counts || [])];
        newInvestigatorNotes.counts.push({ title: name, counts: {}, custom: true });
      } else {
        newInvestigatorNotes.sections = [...(newInvestigatorNotes.sections || [])];
        newInvestigatorNotes.sections.push({ title: name, notes: {}, custom: true });
      }
      newCampaignNotes.investigatorNotes = newInvestigatorNotes;
    } else {
      if (isCount) {
        newCampaignNotes.counts = [...(campaignNotes?.counts || [])];
        newCampaignNotes.counts.push({ title: name, count: 0, custom: true });
      } else {
        newCampaignNotes.sections = [...(campaignNotes?.sections || [])];
        newCampaignNotes.sections.push({ title: name, notes: [], custom: true });
      }
    }
    delayedUpdateCampaignNotes(newCampaignNotes);
  }, [campaignNotes, delayedUpdateCampaignNotes]);
  const addSectionDialogPressed = useCallback(() => {
    showAddSectionDialog(addNotesSection);
  }, [showAddSectionDialog, addNotesSection]);

  const notesChanged = useCallback((index: number, notes: string[]) => {
    const sections = [...(campaignNotes?.sections || [])];
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
    if (campaignNotes?.counts?.[index]?.count !== count) {
      const counts = [...(campaignNotes?.counts || [])];
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
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        { map(campaignNotes?.sections || [], (section, idx) => (
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
  }, [campaignNotes?.sections, notesChanged, showTextEditDialog]);

  const countsSection = useMemo(() => {
    if (campaignNotes?.counts?.length === 0) {
      return null;
    }
    return (
      <View style={space.paddingSideS}>
        { map(campaignNotes?.counts || [], (section, idx) => (
          <EditCountComponent
            key={idx}
            index={idx}
            title={section.title}
            count={section.count || 0}
            countChanged={countChanged}
            showCountDialog={showCountDialog}
            first={idx === 0}
            last={idx === (campaignNotes?.counts?.length || 0) - 1}
          />
        )) }
      </View>
    );
  }, [campaignNotes?.counts, countChanged, showCountDialog]);

  const investigatorSection = useMemo(() => {
    const investigatorNotes = campaignNotes?.investigatorNotes;
    return (
      <InvestigatorSectionList
        allInvestigators={allInvestigators}
        investigatorNotes={investigatorNotes}
        updateInvestigatorNotes={updateInvestigatorNotes}
        showDialog={showTextEditDialog}
        showCountDialog={showCountDialog}
      />
    );
  }, [campaignNotes?.investigatorNotes, allInvestigators, showTextEditDialog, showCountDialog, updateInvestigatorNotes]);
  return (
    <View style={styles.underline}>
      { notesSection }
      { countsSection }
      { investigatorSection }
      <View style={[space.paddingSideS, space.paddingTopS]}>
        <DeckButton
          icon="plus-thin"
          title={t`Add Log Section`}
          onPress={addSectionDialogPressed}
          color="light_gray"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  underline: {
    paddingBottom: s,
    marginBottom: xs,
  },
});
