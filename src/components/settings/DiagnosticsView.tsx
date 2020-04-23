import React from 'react';
import { forEach } from 'lodash';
import {
  Alert,
  InteractionManager,
  Platform,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import {
  SettingsCategoryHeader,
} from 'react-native-settings-components';

import { t } from 'ttag';
import { Campaign, CampaignGuideState, Deck, Pack } from 'actions/types';
import withDialogs, { InjectedDialogProps } from 'components/core/withDialogs';
import { clearDecks } from 'actions';
import Card from 'data/Card';
import { getBackupData, getAllPacks, AppState } from 'reducers';
import { fetchCards } from 'components/card/actions';
import { restoreBackup } from 'components/campaign/actions';
import SettingsItem from './SettingsItem';
import COLORS from 'styles/colors';

interface RealmProps {
  realm: Realm;
}

interface ReduxProps {
  backupData: {
    campaigns: Campaign[];
    decks: Deck[];
    guides: {
      [id: string]: CampaignGuideState;
    };
  };
  packs: Pack[];
  lang: string;
}

interface ReduxActionProps {
  fetchCards: (realm: Realm, lang: string) => void;
  restoreBackup: (
    campaigns: Campaign[],
    guides: {
      [id: string]: CampaignGuideState;
    },
    decks: Deck[]
  ) => void;
  clearDecks: () => void;
}

type Props = RealmProps & ReduxProps & ReduxActionProps & InjectedDialogProps;

class DiagnosticsView extends React.Component<Props> {
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

  _importCampaignData = () => {
    const {
      showTextEditDialog,
    } = this.props;
    const erasedCopy = t`All local decks and campaigns will be overridden`;
    Alert.alert(
      t`Restore campaign data?`,
      t`This feature is intended for advanced diagnostics or to import data from another app.\n\n${erasedCopy}`,
      [{
        text: t`Nevermind`,
        style: 'cancel',
      }, {
        text: t`Import data`,
        style: 'destructive',
        onPress: () => {
          showTextEditDialog(
            t`Paste Backup Here`,
            '',
            (json) => {
              Keyboard.dismiss();
              InteractionManager.runAfterInteractions(
                () => this._importBackupDataJson(json)
              );
            },
            false,
            4
          );
        },
      }],
    );
  };

  _exportCampaignData = () => {
    Alert.alert(
      t`Backup campaign data?`,
      t`This feature is intended for advanced diagnostics or if you are trying to move your campaign data from one device to another. Just copy the data and paste it into the other app.`,
      [{
        text: t`Cancel`,
        style: 'cancel',
      }, {
        text: t`Export Campaign Data`,
        onPress: () => {
          Share.share({
            message: JSON.stringify(this.props.backupData),
          });
        },
      }],
    );
  };

  _clearCache = () => {
    const {
      realm,
      clearDecks,
    } = this.props;
    clearDecks();
    realm.write(() => {
      realm.delete(realm.objects('Card'));
      realm.delete(realm.objects('EncounterSet'));
      realm.delete(realm.objects('FaqEntry'));
      realm.delete(realm.objects('TabooSet'));
    });
    this._doSyncCards();
  };

  _doSyncCards = () => {
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    fetchCards(realm, lang);
  };

  addDebugCardJson(json: string) {
    const {
      realm,
      packs,
      lang,
    } = this.props;
    const packsByCode: { [code: string]: Pack } = {};
    const cycleNames: {
      [cycle_position: number]: {
        name?: string;
        code?: string;
      };
    } = {};
    forEach(packs, pack => {
      packsByCode[pack.code] = pack;
      if (pack.position === 1) {
        cycleNames[pack.cycle_position] = pack;
      }
    });
    cycleNames[50] = {
      name: t`Return to...`,
    };
    cycleNames[70] = {
      name: t`Investigator Starter Decks`,
    };
    cycleNames[80] = {
      name: t`Side stories`,
    };
    realm.write(() => {
      realm.create(
        'Card',
        Card.fromJson(JSON.parse(json), packsByCode, cycleNames, lang),
        true
      );
    });
  }

  _addDebugCard = () => {
    const {
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      t`Debug Card Json`,
      '',
      (json) => {
        Keyboard.dismiss();
        setTimeout(() => this.addDebugCardJson(json), 1000);
      },
      false,
      4
    );
  };

  renderDebugSection() {
    if (!__DEV__) {
      return null;
    }
    return (
      <>
        <SettingsCategoryHeader
          title={t`Debug`}
          titleStyle={Platform.OS === 'android' ? { color: COLORS.monza } : undefined}
        />
        <SettingsItem
          onPress={this._addDebugCard}
          text={t`Add Debug Card`}
        />
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <SettingsCategoryHeader
            title={t`Backup`}
            titleStyle={Platform.OS === 'android' ? { color: COLORS.monza } : undefined}
          />
          <SettingsItem
            onPress={this._exportCampaignData}
            text={t`Backup Campaign Data`}
          />
          <SettingsItem
            onPress={this._importCampaignData}
            text={t`Restore Campaign Data`}
          />
          <SettingsCategoryHeader
            title={t`Caches`}
            titleStyle={Platform.OS === 'android' ? { color: COLORS.monza } : undefined}
          />
          <SettingsItem
            onPress={this._clearCache}
            text={t`Clear cache`}
          />
          { this.renderDebugSection() }
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    backupData: getBackupData(state),
    packs: getAllPacks(state),
    lang: state.packs.lang || 'en',
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    clearDecks,
    fetchCards,
    restoreBackup,
  }, dispatch);
}

export default withDialogs(
  connectRealm<InjectedDialogProps, RealmProps, Card>(
    connect<ReduxProps, ReduxActionProps, RealmProps & InjectedDialogProps, AppState>(
      mapStateToProps,
      mapDispatchToProps
    )(DiagnosticsView),
    {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm
      ): RealmProps {
        return {
          realm,
        };
      },
    },
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    backgroundColor: COLORS.settingsBackground,
  },
});
