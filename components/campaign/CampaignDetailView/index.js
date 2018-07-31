import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ChaosBagSection from './ChaosBagSection';
import DecksSection from './DecksSection';
import ScenarioSection from './ScenarioSection';
import WeaknessSetSection from './WeaknessSetSection';
import { campaignToText } from '../campaignUtil';
import withPlayerCards from '../../withPlayerCards';
import Button from '../../core/Button';
import NavButton from '../../core/NavButton';
import { iconsMap } from '../../../app/NavIcons';
import { updateCampaign, deleteCampaign } from '../actions';
import { getCampaign, getAllPacks, getAllDecks } from '../../../reducers';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    // redux
    updateCampaign: PropTypes.func.isRequired,
    deleteCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    decks: PropTypes.object,
    investigators: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._viewCampaignLog = this.viewCampaignLog.bind(this);
    this._updateChaosBag = this.applyCampaignUpdate.bind(this, 'chaosBag');
    this._deletePressed = this.deletePressed.bind(this);
    this._delete = this.delete.bind(this);

    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    const {
      campaign,
      decks,
      investigators,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'share') {
        Share.share({
          text: campaign.name,
          message: campaignToText(campaign, decks, investigators),
        }, {
          subject: campaign.name,
        });
      }
    }
  }

  viewCampaignLog() {
    const {
      navigator,
      id,
    } = this.props;
    navigator.push({
      screen: 'Campaign.Log',
      title: 'Campaign Log',
      passProps: {
        id,
      },
    });
  }

  applyCampaignUpdate(key, value) {
    const {
      campaign,
      updateCampaign,
    } = this.props;
    updateCampaign(campaign.id, { [key]: value });
  }

  componentDidMount() {
    this.props.navigator.setButtons({
      rightButtons: [{
        icon: iconsMap.share,
        id: 'share',
      }],
    });
  }

  componentDidUpdate(prevProps) {
    const {
      campaign,
      navigator,
    } = this.props;
    if (campaign && prevProps.campaign && campaign.name !== prevProps.campaign.name) {
      navigator.setSubTitle({ subtitle: campaign.name });
    }
  }

  updateChaosBag(bag) {
    this.setState({
      chaosBag: bag,
    });
  }

  deletePressed() {
    const {
      campaign,
    } = this.props;
    Alert.alert(
      'Delete',
      `Are you sure you want to delete the campaign: ${campaign.name}?`,
      [
        { text: 'Delete', onPress: this._delete, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  delete() {
    const {
      id,
      deleteCampaign,
      navigator,
    } = this.props;
    deleteCampaign(id);
    navigator.pop();
  }

  showCampaignNotesDialog() {
    const {
      navigator,
      campaign,
    } = this.props;
    navigator.push({
      screen: 'Dialog.EditCampaignNotes',
      title: 'Campaign Log',
      passProps: {
        campaignId: campaign.id,
      },
      backButtonTitle: 'Cancel',
    });
  }

  render() {
    const {
      navigator,
      campaign,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView>
        <ScenarioSection
          navigator={navigator}
          campaign={campaign}
        />
        <DecksSection
          navigator={navigator}
          campaign={campaign}
        />
        <NavButton text="Campaign Log" onPress={this._viewCampaignLog} />
        <ChaosBagSection
          navigator={navigator}
          chaosBag={campaign.chaosBag}
          updateChaosBag={this._updateChaosBag}
        />
        <WeaknessSetSection
          navigator={navigator}
          campaignId={campaign.id}
          weaknessSet={campaign.weaknessSet}
        />
        <View style={styles.margin}>
          <Button color="red" onPress={this._deletePressed} text="Delete Campaign" />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  const packs = getAllPacks(state);
  return {
    campaign: campaign,
    packs: packs,
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteCampaign,
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withPlayerCards(CampaignDetailView)
);

const styles = StyleSheet.create({
  margin: {
    margin: 8,
  },
  footer: {
    height: 100,
  },
});
