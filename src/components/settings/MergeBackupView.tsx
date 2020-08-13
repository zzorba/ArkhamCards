import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import CategoryHeader from './CategoryHeader';
import { Campaign, CampaignGuideState, Deck, Pack } from '@actions/types';
import { clearDecks } from '@actions';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { AppState } from '@reducers';
import { mergeCampaigns, CampaignMergeResult, mergeDecks, DeckMergeResult } from '@lib/cloudHelper';
import { fetchCards } from '@components/card/actions';
import { restoreBackup } from '@components/campaign/actions';
import { ensureUuid } from './actions';
import COLORS from '@styles/colors';

export interface MergeBackupProps {
  guides: { [key: string]: CampaignGuideState };
  decks: Deck[];
  campaigns: Campaign[];
}

interface ReduxProps {
  campaignMerge: CampaignMergeResult;
  deckMerge: DeckMergeResult;
}

interface ReduxActionProps {
  fetchCards: (db: Database, lang: string) => void;
  restoreBackup: (
    campaigns: Campaign[],
    guides: {
      [id: string]: CampaignGuideState;
    },
    decks: Deck[]
  ) => void;
  clearDecks: () => void;
  ensureUuid: () => void;
}

type Props = ReduxProps & ReduxActionProps;

class MergeBackupView extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  componentDidMount() {
    this.props.ensureUuid();
  }

  _importBackupDataJson = (json: any) => {
    try {
      const backupData = JSON.parse(json) || {};
      const campaigns: Campaign[] = backupData.campaigns || [];
      const guides: { [id: string]: CampaignGuideState } = backupData.guides || {};
      const decks: Deck[] = backupData.decks || [];
      this.props.restoreBackup(
        campaigns,
        guides,
        decks
      );
      return;
    } catch (e) {
      console.log(e);
      Alert.alert(
        t`Problem with import`,
        t`We were not able to parse any campaigns from that pasted data.\n\nMake sure its an exact copy of the text provided by the Backup feature of an Arkham Cards app.`,
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <CategoryHeader
            title={t`Backup`}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppState, props: MergeBackupProps): ReduxProps {
  return {
    campaignMerge: mergeCampaigns(props.campaigns, state),
    deckMerge: mergeDecks(props.decks, state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    clearDecks,
    fetchCards,
    restoreBackup,
    ensureUuid,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, MergeBackupProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(MergeBackupView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.veryLightBackground,
  },
  list: {
    backgroundColor: COLORS.veryLightBackground,
  },
});
