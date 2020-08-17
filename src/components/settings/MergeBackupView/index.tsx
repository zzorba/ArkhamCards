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
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { filter, find, flatMap, map, forEach } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CampaignMergeSection from './CampaignMergeSection';
import DeckMergeSection from './DeckMergeSection';
import { Campaign, CampaignGuideState, Deck, BackupState } from '@actions/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { AppState } from '@reducers';
import { mergeCampaigns, CampaignMergeResult, mergeDecks, DeckMergeResult } from '@lib/cloudHelper';
import { restoreComplexBackup } from '@components/campaign/actions';
import COLORS from '@styles/colors';
import space from '@styles/space';
import typography from '@styles/typography';
import { NavigationProps } from '@components/nav/types';

export interface MergeBackupProps {
  backupData: BackupState;
}

interface ReduxProps {
  campaignMerge: CampaignMergeResult;
  deckMerge: DeckMergeResult;
}

interface ReduxActionProps {
  restoreComplexBackup: (
    campaigns: Campaign[],
    guides: { [id: string]: CampaignGuideState },
    campaignRemapping: { [id: string]: number },
    decks: Deck[],
    deckRemapping: { [id: string]: number }
  ) => void;
}

type Props = MergeBackupProps & ReduxProps & ReduxActionProps & PlayerCardProps & NavigationProps;

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
        }],
      },
    };
  }
  state: State = {
    importCampaigns: {},
    importDecks: {},
  };

  componentDidMount() {
    this._syncNavButtons();
  }

  _syncNavButtons = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [{
          text: t`Import`,
          id: 'import',
          color: COLORS.navButton,
          enabled: this.canImport(),
        }],
      },
    });
  };

  _onCampaignChange = (campaign: Campaign, value: boolean) => {
    if (campaign.uuid) {
      this.setState({
        importCampaigns: {
          ...this.state.importCampaigns,
          [campaign.id]: value,
        },
      }, this._syncNavButtons);
    }
  };

  _onDeckChange = (deck: Deck, value: boolean) => {
    if (deck.uuid) {
      this.setState({
        importDecks: {
          ...this.state.importDecks,
          [deck.id]: value,
        },
      }, this._syncNavButtons);
    }
  };

  selectedCampaigns(): Campaign[] {
    const { campaignMerge } = this.props;
    const { importCampaigns } = this.state;
    return [
      ...filter(campaignMerge.newCampaigns, c => !importCampaigns[c.id]),
      ...filter(campaignMerge.updatedCampaigns, c => !importCampaigns[c.id]),
      ...filter(campaignMerge.staleCampaigns, c => !!importCampaigns[c.id]),
      ...filter(campaignMerge.sameCampaigns, c => !!importCampaigns[c.id]),
    ];
  }

  dependentDecks(decks: Deck[]) {
    const { deckMerge } = this.props;
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
  }

  missingDecks(): Deck[] {
    const { deckMerge } = this.props;
    const { importDecks } = this.state;
    const decks = [
      ...filter(deckMerge.newDecks, c => !!importDecks[c.id]),
    ];
    return this.dependentDecks(decks);
  }

  selectedDecks(): Deck[] {
    const { deckMerge } = this.props;
    const { importDecks } = this.state;
    const decks = [
      ...filter(deckMerge.newDecks, c => !importDecks[c.id]),
      ...filter(deckMerge.updatedDecks, c => !importDecks[c.id]),
      ...filter(deckMerge.staleDecks, c => !!importDecks[c.id]),
      ...filter(deckMerge.sameDecks, c => !!importDecks[c.id]),
    ];
    return this.dependentDecks(decks);
  }

  canImport() {
    return this.selectedCampaigns().length > 0 || this.selectedDecks().length > 0;
  }

  _actuallyDoImport = () => {
    const {
      componentId,
      backupData: {
        guides,
      },
      campaignMerge,
      deckMerge,
      restoreComplexBackup,
    } = this.props;
    const campaigns = this.selectedCampaigns();
    const decks = this.selectedDecks();
    const selectedGuides: { [key: string]: CampaignGuideState } = {};
    forEach(campaigns, campaign => {
      if (guides[campaign.id]) {
        selectedGuides[campaign.id] = guides[campaign.id];
      }
    });
    const deckRemapping = { ...deckMerge.localRemapping };
    forEach(this.missingDecks(), deck => {
      delete deckRemapping[deck.id];
    });

    restoreComplexBackup(
      campaigns,
      selectedGuides,
      campaignMerge.localRemapping,
      decks,
      deckRemapping,
    );
    Navigation.pop(componentId);
  }

  _doImport = () => {
    const { deckMerge } = this.props;
    const campaigns = this.selectedCampaigns();
    const decks = this.selectedDecks();
    const importedDecks = new Set(map(decks, deck => deck.id));
    const newDecks = new Set(map(deckMerge.newDecks, deck => deck.id));
    const campaignWithoutDecks = find(campaigns, campaign => {
      return !!find(campaign.baseDeckIds || [], deckId => (
        deckId < 0 && !importedDecks.has(deckId) && newDecks.has(deckId)
      ));
    });
    if (campaignWithoutDecks) {
      Alert.alert(
        t`Missing decks`,
        t`It seems like you have chosen to import a campaign without importing one or more non-ArkhamDB decks. The campaign can still be imported, however the deck information will be removed.`,
        [
          { text: t`Import anyway`, onPress: this._actuallyDoImport },
          { text: t`Cancel`, style: 'cancel' },
        ]
      );
    } else {
      this._actuallyDoImport();
    }
  };

  _cancel = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    const { campaignMerge, deckMerge, investigators } = this.props;
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
          <BasicButton
            onPress={this._doImport}
            title={t`Import selected data`}
            disabled={!this.canImport()}
          />
          <BasicButton onPress={this._cancel} title={t`Cancel`} color={COLORS.red} />
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
    restoreComplexBackup,
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
