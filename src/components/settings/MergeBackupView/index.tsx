import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CampaignMergeSection from './CampaignMergeSection';
import DeckMergeSection from './DeckMergeSection';
import { Campaign, CampaignGuideState, Deck, BackupState } from '@actions/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { AppState } from '@reducers';
import { mergeCampaigns, CampaignMergeResult, mergeDecks, DeckMergeResult } from '@lib/cloudHelper';
import { restoreBackup } from '@components/campaign/actions';
import COLORS from '@styles/colors';
import space from '@styles/space';
import typography from '@styles/typography';

export interface MergeBackupProps {
  backupData: BackupState;
}

interface ReduxProps {
  campaignMerge: CampaignMergeResult;
  deckMerge: DeckMergeResult;
}

interface ReduxActionProps {
  restoreBackup: (
    campaigns: Campaign[],
    guides: {
      [id: string]: CampaignGuideState;
    },
    decks: Deck[]
  ) => void;
}

type Props = ReduxProps & ReduxActionProps & PlayerCardProps;

interface State {
  importCampaigns: {
    [key: string]: boolean;
  };
  importDecks: {
    [key: string]: boolean;
  };
}
class MergeBackupView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Select items to import`,
          color: COLORS.darkText,
        },
        rightButtons: [{
          text: t`Import`,
          id: 'import',
          color: COLORS.navButton,
        }]
      },
    };
  }
  state: State = {
    importCampaigns: {},
    importDecks: {},
  };

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

  _onCampaignChange = (campaign: Campaign, value: boolean) => {
    if (campaign.uuid) {
      this.setState({
        importCampaigns: {
          ...this.state.importCampaigns,
          [campaign.id]: value,
        },
      });
    }
  };

  _onDeckChange = (deck: Deck, value: boolean) => {
    if (deck.local_uuid) {
      this.setState({
        importDecks: {
          ...this.state.importDecks,
          [deck.id]: value,
        },
      });
    }
  };

  _doImport = () => {

  };

  render() {
    const { campaignMerge, deckMerge, investigators } =  this.props;
    const { importCampaigns, importDecks } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <View style={[styles.headerRow, space.paddingS, space.paddingLeftM]}>
            <Text style={typography.bigLabel}>
              { t`Campaigns` }
            </Text>
          </View>
          <CampaignMergeSection
            title={t`New:`}
            campaigns={campaignMerge.newCampaigns}
            inverted
            values={importCampaigns}
            onValueChange={this._onCampaignChange}
          />
          <CampaignMergeSection
            title={t`Updated:`}
            campaigns={campaignMerge.updatedCampaigns}
            inverted
            values={importCampaigns}
            onValueChange={this._onCampaignChange}
          />
          <CampaignMergeSection
            title={t`No changes:`}
            campaigns={campaignMerge.sameCampaigns}
            values={importCampaigns}
            onValueChange={this._onCampaignChange}
          />
          <CampaignMergeSection
            title={t`Local version appears to be newer:`}
            campaigns={campaignMerge.staleCampaigns}
            values={importCampaigns}
            onValueChange={this._onCampaignChange}
          />
          <View style={[styles.headerRow, space.paddingS, space.paddingLeftM]}>
            <Text style={typography.bigLabel}>
              { t`Decks` }
            </Text>
          </View>
          <DeckMergeSection
            title={t`New:`}
            decks={deckMerge.newDecks}
            values={importDecks}
            inverted
            onValueChange={this._onDeckChange}
            investigators={investigators}
            scenarioCount={deckMerge.scenarioCount}
          />
          <DeckMergeSection
            title={t`Updated:`}
            decks={deckMerge.updatedDecks}
            values={importDecks}
            inverted
            onValueChange={this._onDeckChange}
            investigators={investigators}
            scenarioCount={deckMerge.scenarioCount}
          />
          <DeckMergeSection
            title={t`No changes:`}
            decks={deckMerge.sameDecks}
            values={importDecks}
            onValueChange={this._onDeckChange}
            investigators={investigators}
            scenarioCount={deckMerge.scenarioCount}
          />
          <DeckMergeSection
            title={t`Local version appears to be newer:`}
            decks={deckMerge.staleDecks}
            values={importDecks}
            onValueChange={this._onDeckChange}
            investigators={investigators}
            scenarioCount={deckMerge.scenarioCount}
          />
          <BasicButton onPress={this._doImport} title={t`Import selected data`} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppState, props: MergeBackupProps): ReduxProps {
  return {
    campaignMerge: mergeCampaigns(props.backupData.campaigns, state),
    deckMerge: mergeDecks(props.backupData.decks, state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    restoreBackup,
  }, dispatch);
}

export default withPlayerCards(
  connect<ReduxProps, ReduxActionProps, MergeBackupProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(MergeBackupView)
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.veryLightBackground,
  },
  list: {
    backgroundColor: COLORS.background,
  },
});
