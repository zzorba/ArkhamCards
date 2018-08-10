import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { ImageCacheManager } from 'react-native-cached-image';

import withTextEditDialog from '../core/withTextEditDialog';
import { clearDecks } from '../../actions';
import { getCampaigns } from '../../reducers';
import { fetchCards } from '../cards/actions';
import { setAllCampaigns } from '../campaign/actions';
import SettingsItem from './SettingsItem';

const defaultImageCacheManager = ImageCacheManager();

class DiagnosticsView extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    // from redux.
    campaigns: PropTypes.array.isRequired,
    fetchCards: PropTypes.func.isRequired,
    setAllCampaigns: PropTypes.func.isRequired,
    clearDecks: PropTypes.func.isRequired,
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
          'Confirm import',
          `We found the following campaigns:\n${newCampaignNames}\nAre you sure you want to import this and erase your current campaigns?`,
          [{
            text: 'Nevermind',
            style: 'cancel',
          }, {
            text: 'Save These Campaigns',
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
      'Problem with import',
      'We were not able to parse any campaigns from that pasted data.\n\nMake sure its an exact copy of the text provided by the Backup feature of an Arkham Cards app.',
    );
  }

  importCampaignData() {
    const {
      campaigns,
      showTextEditDialog,
    } = this.props;
    const erasedCampaigns = map(campaigns, campaign => campaign.name).join('\n');
    Alert.alert(
      'Restore campaign data?',
      `This feature is intended for advanced diagnostics or to import data from another app.\n\n${erasedCampaigns ? `The following campaigns will be ERASED: \n${erasedCampaigns}` : ''}`,
      [{
        text: 'Nevermind',
        style: 'cancel',
      }, {
        text: 'Import and Erase Current Campaigns',
        style: 'destructive',
        onPress: () => {
          showTextEditDialog(
            'Paste Backup Here',
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
      'Backup campaign data?',
      'This feature is intended for advanced diagnostics or if you are trying to move your campaign data from one device to another. Just copy the data and paste it into the other app.',
      [{
        text: 'Cancel',
        style: 'cancel',
      }, {
        text: 'Export Campaign Data',
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
      fetchCards,
    } = this.props;
    fetchCards(realm);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
          <SettingsItem onPress={this._exportCampaignData} text="Backup Campaign Data" />
          <SettingsItem onPress={this._importCampaignData} text="Restore Campaign Data" />
          <SettingsItem onPress={this._clearImageCache} text="Clear image cache" />
          <SettingsItem onPress={this._clearCache} text="Clear cache" />
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    campaigns: getCampaigns(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearDecks,
    fetchCards,
    setAllCampaigns,
  }, dispatch);
}

export default withTextEditDialog(
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
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 16,
  },
  list: {
    padding: 8,
  },
});
