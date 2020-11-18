import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { filter, find, flatMap, map, forEach } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CampaignMergeSection from './CampaignMergeSection';
import DeckMergeSection from './DeckMergeSection';
import { Campaign, CampaignGuideState, Deck, BackupState } from '@actions/types';
import { AppState } from '@reducers';
import { mergeCampaigns, mergeDecks } from '@lib/cloudHelper';
import { restoreComplexBackup } from '@components/campaign/actions';
import COLORS from '@styles/colors';
import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { useInvestigatorCards, useToggles } from '@components/core/hooks';

export interface MergeBackupProps {
  backupData: BackupState;
}

type Props = MergeBackupProps & NavigationProps;

interface State {
  importCampaigns: {
    [key: string]: boolean;
  };
  importDecks: {
    [key: string]: boolean;
  };
}

function MergeBackupView({ backupData, componentId }: Props) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  const campaignMergeSelector = useCallback((state: AppState) => mergeCampaigns(backupData.campaigns, state), [backupData.campaigns]);
  const campaignMerge = useSelector(campaignMergeSelector);
  const deckMergeSelector = useCallback((state: AppState) => mergeDecks(backupData.decks, state), [backupData.decks]);
  const deckMerge = useSelector(deckMergeSelector);
  const [importCampaigns,, setImportCampaigns] = useToggles({});
  const [importDecks,, setImportDecks] = useToggles({});

  const dependentDecks = useCallback((decks: Deck[]) => {
    return flatMap(decks, deck => {
      const dependentDecks: Deck[] = [deck];
      while (deck && deck.next_deck) {
        deck = deckMerge.upgradeDecks[deck.next_deck];
        if (deck) {
          dependentDecks.push(deck);
        }
      }
      return dependentDecks;
    });
  }, [deckMerge]);

  const selectedDecks: Deck[] = useMemo(() => {
    const decks = [
      ...filter(deckMerge.newDecks, c => !importDecks[c.id]),
      ...filter(deckMerge.updatedDecks, c => !importDecks[c.id]),
      ...filter(deckMerge.staleDecks, c => !!importDecks[c.id]),
      ...filter(deckMerge.sameDecks, c => !!importDecks[c.id]),
    ];
    return dependentDecks(decks);
  }, [deckMerge, importDecks, dependentDecks]);

  const selectedCampaigns: Campaign[] = useMemo(() => {
    return [
      ...filter(campaignMerge.newCampaigns, c => !importCampaigns[c.id]),
      ...filter(campaignMerge.updatedCampaigns, c => !importCampaigns[c.id]),
      ...filter(campaignMerge.staleCampaigns, c => !!importCampaigns[c.id]),
      ...filter(campaignMerge.sameCampaigns, c => !!importCampaigns[c.id]),
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
      setImportCampaigns(campaign.id, value);
    }
  }, [setImportCampaigns]);

  const onDeckChange = useCallback((deck: Deck, value: boolean) => {
    if (deck.uuid) {
      setImportDecks(deck.id, value);
    }
  }, [setImportDecks]);

  const missingDecks: Deck[] = useMemo(() => {
    const decks = [
      ...filter(deckMerge.newDecks, c => !!importDecks[c.id]),
    ];
    return dependentDecks(decks);
  }, [deckMerge, importDecks, dependentDecks]);

  const actuallyDoImport = useCallback(() => {
    const selectedGuides: { [key: string]: CampaignGuideState } = {};
    forEach(selectedCampaigns, campaign => {
      if (backupData.guides[campaign.id]) {
        selectedGuides[campaign.id] = backupData.guides[campaign.id];
      }
    });
    const deckRemapping = { ...deckMerge.localRemapping };
    forEach(missingDecks, deck => {
      delete deckRemapping[deck.id];
    });

    dispatch(restoreComplexBackup(
      selectedCampaigns,
      selectedGuides,
      campaignMerge.localRemapping,
      selectedDecks,
      deckRemapping,
    ));
    Navigation.pop(componentId);
  }, [componentId, backupData.guides, campaignMerge, deckMerge, selectedCampaigns, selectedDecks, missingDecks, dispatch]);

  const doImport = useCallback(() => {
    const importedDecks = new Set(map(selectedDecks, deck => deck.id));
    const newDecks = new Set(map(deckMerge.newDecks, deck => deck.id));
    const campaignWithoutDecks = find(selectedCampaigns, campaign => {
      return !!find(campaign.baseDeckIds || [], deckId => (
        deckId < 0 && !importedDecks.has(deckId) && newDecks.has(deckId)
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
