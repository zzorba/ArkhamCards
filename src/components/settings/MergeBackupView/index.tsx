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

import CategoryHeader from '../CategoryHeader';
import CampaignMergeItem from './CampaignMergeItem';
import { Campaign, CampaignGuideState, Deck } from '@actions/types';
import { AppState } from '@reducers';
import { mergeCampaigns, CampaignMergeResult, mergeDecks, DeckMergeResult } from '@lib/cloudHelper';
import { restoreBackup } from '@components/campaign/actions';
import COLORS from '@styles/colors';
import { map } from 'lodash';

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
  restoreBackup: (
    campaigns: Campaign[],
    guides: {
      [id: string]: CampaignGuideState;
    },
    decks: Deck[]
  ) => void;
}

type Props = ReduxProps & ReduxActionProps;

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

  };

  renderSection(name: string, campaigns: Campaign[], inverted: boolean) {
    const { importCampaigns } = this.state;
    if (!campaigns.length) {
      return null;
    }
    return (
      <>
        <CategoryHeader title={name} />
        { map(campaigns, campaign => (
          <CampaignMergeItem
            key={campaign.uuid || campaign.id}
            campaign={campaign}
            inverted={inverted}
            value={!!importCampaigns[campaign.id]}
            onValueChange={this._onCampaignChange}
          />
        )) }
      </>
    );
  }

  render() {
    const { campaignMerge } =  this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          { this.renderSection(t`New campaigns`, campaignMerge.newCampaigns, true) }
          { this.renderSection(t`Campaigns with updates`, campaignMerge.updatedCampaigns, true) }
          { this.renderSection(t`Campaigns with newer local version`, campaignMerge.staleCampaigns, false) }
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
    restoreBackup,
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
