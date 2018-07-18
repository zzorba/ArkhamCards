import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';

import ChaosBagSection from '../ChaosBagSection';
import CampaignNotesSection from './CampaignNotesSection';
import InvestigatorNotesSection from './InvestigatorNotesSection';
import { CUSTOM } from '../constants';
import AddDeckRow from '../../AddDeckRow';
import Button from '../../core/Button';
import { updateCampaign, deleteCampaign } from '../actions';
import { getCampaign, getAllPacks } from '../../../reducers';
import typography from '../../../styles/typography';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    // redux
    updateCampaign: PropTypes.func.isRequired,
    deleteCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    scenarioPack: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'investigators', title: 'Decks' },
        { key: 'notes', title: 'Notes' },
        { key: 'bag', title: 'Bag' },
      ],
    };
    this._onIndexChange = this.onIndexChange.bind(this);
    this._renderChaosBagSection = this.renderChaosBagSection.bind(this);
    this._renderInvestigatorSection = this.renderInvestigatorSection.bind(this);
    this._renderCampaignLogSection = this.renderCampaignLogSection.bind(this);
    this._addDeck = this.addDeck.bind(this);
    this._showCampaignNotesDialog = this.showCampaignNotesDialog.bind(this);
    this._updateLatestDeckIds = this.applyCampaignUpdate.bind(this, 'latestDeckIds');
    this._updateChaosBag = this.applyCampaignUpdate.bind(this, 'chaosBag');
    this._updateCampaignNotes = this.applyCampaignUpdate.bind(this, 'campaignNotes');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');
    this._deletePressed = this.deletePressed.bind(this);
    this._delete = this.delete.bind(this);
    this._addScenarioResult = this.addScenarioResult.bind(this);
  }
  onIndexChange(index) {
    this.setState({
      index,
    });
  }

  addDeck(deckId) {
    const {
      campaign: {
        latestDeckIds,
      },
    } = this.props;
    const newLatestDeckIds = latestDeckIds.slice();
    newLatestDeckIds.push(deckId);
    this._updateLatestDeckIds(newLatestDeckIds);
  }

  applyCampaignUpdate(key, value) {
    const {
      campaign,
      updateCampaign,
    } = this.props;
    updateCampaign(campaign.id, { [key]: value });
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

  addScenarioResult() {
    const {
      campaign,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Campaign.AddResult',
      passProps: {
        campaign,
      },
      backButtonTitle: 'Cancel',
    });
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

  renderChaosBagSection() {
    const {
      navigator,
      campaign,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView>
        <ChaosBagSection
          navigator={navigator}
          chaosBag={campaign.chaosBag}
          updateChaosBag={this._updateChaosBag}
        />
      </ScrollView>
    );
  }

  renderCampaignLogSection() {
    const {
      campaign,
      scenarioPack,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView>
        <Text style={[typography.bigLabel, styles.margin]}>
          { campaign.name }
        </Text>
        { campaign.cycleCode !== CUSTOM && (
          <Text style={[typography.text, styles.margin]}>
            { scenarioPack.name }
          </Text>
        ) }
        <View style={styles.section}>
          <CampaignNotesSection
            campaignNotes={campaign.campaignNotes}
          />
          <View style={styles.button}>
            <Button text="Edit" align="left" onPress={this._showCampaignNotesDialog} />
          </View>
        </View>
        <View style={styles.margin}>
          <Button color="red" onPress={this._deletePressed} text="Delete Campaign" />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }

  renderInvestigatorSection() {
    const {
      navigator,
      campaign,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView>
        <Button onPress={this._addScenarioResult} text="Record Scenario Result" />
        <View style={styles.section}>
          <InvestigatorNotesSection
            navigator={navigator}
            campaign={campaign}
          />
          <AddDeckRow
            navigator={navigator}
            deckAdded={this._addDeck}
            selectedDeckIds={campaign.latestDeckIds}
          />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }

  render() {
    const {
      campaign,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          investigators: this._renderInvestigatorSection,
          notes: this._renderCampaignLogSection,
          bag: this._renderChaosBagSection,
        })}
        onIndexChange={this._onIndexChange}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  const packs = getAllPacks(state);
  return {
    campaign: campaign,
    scenarioPack: campaign && find(packs, pack => pack.code === campaign.cycleCode),
    packs: packs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteCampaign,
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailView);

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingBottom: 8,
    marginBottom: 8,
  },
  margin: {
    margin: 8,
  },
  footer: {
    height: 100,
  },
});
