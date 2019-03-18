import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Alert,
  Platform,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { ImageCacheManager } from 'react-native-cached-image';
import {
  SettingsCategoryHeader,
} from 'react-native-settings-components';

import L from '../../app/i18n';
import withDialogs from '../core/withDialogs';
import { clearDecks } from '../../actions';
import { getCampaigns } from '../../reducers';
import { fetchCards } from '../cards/actions';
import { setAllCampaigns } from '../campaign/actions';
import SettingsItem from './SettingsItem';
import { COLORS } from '../../styles/colors';

const defaultImageCacheManager = ImageCacheManager();

class DiagnosticsView extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    // from redux.
    campaigns: PropTypes.array.isRequired,
    fetchCards: PropTypes.func.isRequired,
    setAllCampaigns: PropTypes.func.isRequired,
    clearDecks: PropTypes.func.isRequired,
    lang: PropTypes.string,
    // From HOC
    showTextEditDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._importCampaignDataJson = this.importCampaignDataJson.bind(this);
    this._importCampaignData = this.importCampaignData.bind(this);
    this._exportCampaignData = this.exportCampaignData.bind(this);
    this._doSyncCards = this.doSyncCards.bind(this);
    this._clearImageCache = this.clearImageCache.bind(this);
    this._clearCache = this.clearCache.bind(this);
  }

  importCampaignDataJson(json) {
    try {
      const newCampaigns = JSON.parse(json) || [];
      if (newCampaigns.length) {
        const newCampaignNames = map(newCampaigns, campaign => campaign.name).join('\n');
        Alert.alert(
          L('Confirm import'),
          L(
            'We found the following campaigns:\n{{campaignNames}}\nAre you sure you want to import this and erase your current campaigns?',
            { campaignNames: newCampaignNames }),
          [{
            text: L('Nevermind'),
            style: 'cancel',
          }, {
            text: L('Save These Campaigns'),
            style: 'destructive',
            onPress: () => {
              this.props.setAllCampaigns(newCampaigns);
            },
          }],
        );
        return;
      }
    } catch (e) {
      console.log(e);
    }
    Alert.alert(
      L('Problem with import'),
      L('We were not able to parse any campaigns from that pasted data.\n\nMake sure its an exact copy of the text provided by the Backup feature of an Arkham Cards app.'),
    );
  }

  importCampaignData() {
    const {
      campaigns,
      showTextEditDialog,
    } = this.props;
    const erasedCampaigns = map(campaigns, campaign => campaign.name).join('\n');
    const erasedCopy = erasedCampaigns ?
      L('The following campaigns will be ERASED: \n{{campaigns}}',
        { campaigns: erasedCampaigns }) : '';
    Alert.alert(
      L('Restore campaign data?'),
      L('This feature is intended for advanced diagnostics or to import data from another app.\n\n{{erasedCampaigns}}',
        { erasedCampaigns: erasedCopy }
      ),
      [{
        text: L('Nevermind'),
        style: 'cancel',
      }, {
        text: L('Import and Erase Current Campaigns'),
        style: 'destructive',
        onPress: () => {
          showTextEditDialog(
            L('Paste Backup Here'),
            '',
            (json) => {
              Keyboard.dismiss();
              setTimeout(() => this._importCampaignDataJson(json), 1000);
            },
            false,
            4
          );
        },
      }],
    );
  }

  exportCampaignData() {
    Alert.alert(
      L('Backup campaign data?'),
      L('This feature is intended for advanced diagnostics or if you are trying to move your campaign data from one device to another. Just copy the data and paste it into the other app.'),
      [{
        text: L('Cancel'),
        style: 'cancel',
      }, {
        text: L('Export Campaign Data'),
        onPress: () => {
          Share.share({
            message: JSON.stringify(this.props.campaigns),
          });
        },
      }],
    );

  }

  clearImageCache() {
    defaultImageCacheManager.clearCache({});
  }

  clearCache() {
    const {
      realm,
      clearDecks,
    } = this.props;
    clearDecks();
    realm.write(() => {
      realm.delete(realm.objects('Card'));
    });
    this.doSyncCards();
  }

  doSyncCards() {
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    fetchCards(realm, lang);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <SettingsCategoryHeader
            title={L('Backup')}
            textStyle={Platform.OS === 'android' ? { color: COLORS.monza } : null}
          />
          <SettingsItem onPress={this._exportCampaignData} text={L('Backup Campaign Data')} />
          <SettingsItem onPress={this._importCampaignData} text={L('Restore Campaign Data')} />
          <SettingsCategoryHeader
            title={L('Caches')}
            textStyle={Platform.OS === 'android' ? { color: COLORS.monza } : null}
          />
          <SettingsItem onPress={this._clearImageCache} text={L('Clear image cache')} />
          <SettingsItem onPress={this._clearCache} text={L('Clear cache')} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    campaigns: getCampaigns(state),
    lang: state.packs.lang,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearDecks,
    fetchCards,
    setAllCampaigns,
  }, dispatch);
}

export default withDialogs(
  connectRealm(
    connect(mapStateToProps, mapDispatchToProps)(DiagnosticsView),
    {
      schemas: ['Card'],
      mapToProps(results, realm) {
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
    backgroundColor: Platform.OS === 'ios' ? COLORS.iosSettingsBackground : COLORS.white,
  },
});
