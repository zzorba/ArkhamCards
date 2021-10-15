import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { filter, find, flatMap, map, forEach, values } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CampaignMergeSection from './CampaignMergeSection';
import DeckMergeSection from './DeckMergeSection';
import { Campaign, Deck, BackupState, LegacyBackupState, getDeckId, LocalDeck } from '@actions/types';
import { AppState, getAllDecks } from '@reducers';
import { DeckMergeResult, mergeCampaigns, mergeDecks } from './backupHelper';
import { restoreComplexBackup } from '@components/campaign/actions';
import COLORS from '@styles/colors';
import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { useInvestigatorCards, useNavigationButtonPressed, useToggles } from '@components/core/hooks';
import { migrateCampaigns, migrateDecks, migrateGuides } from '@reducers/migrators';

export interface MergeBackupProps {
  backupData: BackupState | LegacyBackupState;
}

type Props = MergeBackupProps & NavigationProps;

function dependentDecks(decks: Deck[], deckMerge: DeckMergeResult) {
  return flatMap(decks, deck => {
    const dependentDecks: Deck[] = [deck];

    let d = deck;
    while (d && d.nextDeckId) {
      const uuid = d.nextDeckId.uuid;
      d = deckMerge.upgradeDecks[uuid];
      if (d) {
        dependentDecks.push(d);
      }
    }
    return dependentDecks;
  });
}

function MergeBackupView({ backupData, componentId }: Props) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const decks = useSelector(getAllDecks);
  const migratedBackupData: BackupState = useMemo(() => {
    if (backupData.version === 1) {
      // Already migrated.
      return backupData;
    }
    const [updatedDecks, deckMap] = migrateDecks(backupData.decks);
    const allDecks = {
      ...decks,
      ...updatedDecks,
    };
    forEach(decks, deck => {
      if (!deck.local) {
        deckMap[deck.id] = getDeckId(deck);
      }
    });
    const [updatedCampaigns, campaignMap] = migrateCampaigns(backupData.campaigns, deckMap, allDecks);
    const updatedGuides = migrateGuides(backupData.guides, campaignMap, deckMap);
    return {
      version: 1,
      guides: flatMap(values(updatedGuides), x => x || []),
      decks: filter(values(updatedDecks), d => !!d.local) as LocalDeck[],
      campaigns: values(updatedCampaigns),
    };
  }, [backupData, decks]);
  const dispatch = useDispatch();
  const campaignMergeSelector = useCallback((state: AppState) => mergeCampaigns(migratedBackupData.campaigns, state), [migratedBackupData.campaigns]);
  const campaignMerge = useSelector(campaignMergeSelector);
  const deckMergeSelector = useCallback((state: AppState) => mergeDecks(migratedBackupData.decks, state), [migratedBackupData.decks]);
  const deckMerge = useSelector(deckMergeSelector);
  const [importCampaigns,, setImportCampaigns] = useToggles({});
  const [importDecks,, setImportDecks] = useToggles({});

  const selectedDecks: Deck[] = useMemo(() => {
    const decks = [
      ...filter(deckMerge.newDecks, d => !importDecks[getDeckId(d).uuid]),
      ...filter(deckMerge.updatedDecks, d => !importDecks[getDeckId(d).uuid]),
      ...filter(deckMerge.staleDecks, d => !!importDecks[getDeckId(d).uuid]),
      ...filter(deckMerge.sameDecks, d => !!importDecks[getDeckId(d).uuid]),
    ];
    return dependentDecks(decks, deckMerge);
  }, [deckMerge, importDecks]);

  const selectedCampaigns: Campaign[] = useMemo(() => {
    return [
      ...filter(campaignMerge.newCampaigns, c => !importCampaigns[c.uuid]),
      ...filter(campaignMerge.updatedCampaigns, c => !importCampaigns[c.uuid]),
      ...filter(campaignMerge.staleCampaigns, c => !!importCampaigns[c.uuid]),
      ...filter(campaignMerge.sameCampaigns, c => !!importCampaigns[c.uuid]),
    ];
  }, [campaignMerge, importCampaigns]);

  const canImport = selectedCampaigns.length > 0 || selectedDecks.length > 0;
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [{
          text: t`Import`,
          id: 'import',
          color: COLORS.M,
          enabled: canImport,
          accessibilityLabel: t`Import`,
        }],
      },
    });
  }, [componentId, canImport]);

  const onCampaignChange = useCallback((campaign: Campaign, value: boolean) => {
    if (campaign.uuid) {
      setImportCampaigns(campaign.uuid, value);
    }
  }, [setImportCampaigns]);

  const onDeckChange = useCallback((deck: Deck, value: boolean) => {
    setImportDecks(getDeckId(deck).uuid, value);
  }, [setImportDecks]);

  const actuallyDoImport = useCallback(() => {
    const campaignIds = new Set(map(selectedCampaigns, c => c.uuid));
    const selectedGuides = filter(migratedBackupData.guides, g => !!g && campaignIds.has(g.uuid));
    dispatch(restoreComplexBackup(
      selectedCampaigns,
      selectedGuides,
      selectedDecks,
    ));
    Navigation.pop(componentId);
  }, [componentId, migratedBackupData.guides, selectedCampaigns, selectedDecks, dispatch]);

  const doImport = useCallback(() => {
    const importedDecks = new Set(map(selectedDecks, deck => getDeckId(deck).uuid));
    const newDecks = new Set(map(deckMerge.newDecks, deck => getDeckId(deck).uuid));
    const campaignWithoutDecks = find(selectedCampaigns, campaign => {
      return !!find(campaign.deckIds || [], deckId => (
        deckId.local && !importedDecks.has(deckId.uuid) && newDecks.has(deckId.uuid)
      ));
    });
    if (campaignWithoutDecks) {
      Alert.alert(
        t`Missing decks`,
        t`It seems like you have chosen to import a campaign without importing one or more non-ArkhamDB decks. The campaign can still be imported, however the deck information will be removed.`,
        [
          { text: t`Import anyway`, onPress: actuallyDoImport },
          { text: t`Cancel`, style: 'cancel' },
        ]
      );
    } else {
      actuallyDoImport();
    }
  }, [deckMerge, selectedCampaigns, selectedDecks, actuallyDoImport]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'import' && canImport) {
      doImport();
    }
  }, componentId, [doImport, canImport]);

  const cancel = useCallback(() => {
    Navigation.pop(componentId);
  }, [componentId]);
  const investigators = useInvestigatorCards();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.L20 }]}>
      <ScrollView style={backgroundStyle}>
        <CardSectionHeader section={{ title: t`Campaigns` }} />
        <CampaignMergeSection
          title={t`New:`}
          campaigns={campaignMerge.newCampaigns}
          inverted
          values={importCampaigns}
          onValueChange={onCampaignChange}
        />
        <CampaignMergeSection
          title={t`Updated:`}
          campaigns={campaignMerge.updatedCampaigns}
          inverted
          values={importCampaigns}
          onValueChange={onCampaignChange}
        />
        <CampaignMergeSection
          title={t`No changes:`}
          campaigns={campaignMerge.sameCampaigns}
          values={importCampaigns}
          onValueChange={onCampaignChange}
        />
        <CampaignMergeSection
          title={t`Local version appears to be newer:`}
          campaigns={campaignMerge.staleCampaigns}
          values={importCampaigns}
          onValueChange={onCampaignChange}
        />
        <CardSectionHeader section={{ title: t`Decks` }} />
        <DeckMergeSection
          title={t`New:`}
          decks={deckMerge.newDecks}
          values={importDecks}
          inverted
          onValueChange={onDeckChange}
          investigators={investigators}
          scenarioCount={deckMerge.scenarioCount}
        />
        <DeckMergeSection
          title={t`Updated:`}
          decks={deckMerge.updatedDecks}
          values={importDecks}
          inverted
          onValueChange={onDeckChange}
          investigators={investigators}
          scenarioCount={deckMerge.scenarioCount}
        />
        <DeckMergeSection
          title={t`No changes:`}
          decks={deckMerge.sameDecks}
          values={importDecks}
          onValueChange={onDeckChange}
          investigators={investigators}
          scenarioCount={deckMerge.scenarioCount}
        />
        <DeckMergeSection
          title={t`Local version appears to be newer:`}
          decks={deckMerge.staleDecks}
          values={importDecks}
          onValueChange={onDeckChange}
          investigators={investigators}
          scenarioCount={deckMerge.scenarioCount}
        />
        <BasicButton
          onPress={doImport}
          title={t`Import selected data`}
          disabled={!canImport}
        />
        <BasicButton onPress={cancel} title={t`Cancel`} color={COLORS.red} />
      </ScrollView>
    </SafeAreaView>
  );
}

MergeBackupView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Select items to import`,
      },
      rightButtons: [{
        text: t`Import`,
        id: 'import',
        color: COLORS.M,
        accessibilityLabel: t`Import`,
      }],
    },
  };
};
export default MergeBackupView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
