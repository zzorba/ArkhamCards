import React from 'react';
import PropTypes from 'prop-types';
import { capitalize, filter, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CampaignSelector from './CampaignSelector';
import CampaignNoteSectionRow from './CampaignNoteSectionRow';
import { CUSTOM } from '../constants';
import AddCampaignNoteSectionDialog from '../AddCampaignNoteSectionDialog';
import Button from '../../core/Button';
import ChaosBagLine from '../../core/ChaosBagLine';
import withTextEditDialog from '../../core/withTextEditDialog';
import LabeledTextBox from '../../core/LabeledTextBox';
import SelectedDeckListComponent from '../../SelectedDeckListComponent';
import WeaknessSetPackChooserComponent from '../../weakness/WeaknessSetPackChooserComponent';
import { CAMPAIGN_CHAOS_BAGS, CAMPAIGN_LOGS, DIFFICULTY } from '../../../constants';
import { getNextCampaignId } from '../../../reducers';
import typography from '../../../styles/typography';
import { newCampaign } from '../actions';

class NewCampaignView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    newCampaign: PropTypes.func.isRequired,
    onCreateCampaign: PropTypes.func.isRequired,
    nextId: PropTypes.number.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    captureViewRef: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
  };

  constructor(props) {
    super(props);

    props.navigator.setTitle({
      title: 'New Campaign',
    });

    this.state = {
      name: '',
      campaign: '',
      campaignCode: '',
      difficulty: 'standard',
      deckIds: [],
      weaknessPacks: [],
      customChaosBag: Object.assign({}, CAMPAIGN_CHAOS_BAGS.core[1]),
      customCampaignLog: { sections: ['Campaign Notes'] },
      campaignLogDialogVisible: false,
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._onSave = this.onSave.bind(this);
    this._onWeaknessPackChange = this.onWeaknessPackChange.bind(this);
    this._addCampaignNoteSection = this.addCampaignNoteSection.bind(this);
    this._deleteCampaignNoteSection = this.deleteCampaignNoteSection.bind(this);
    this._toggleCampaignLogDialog = this.toggleCampaignLogDialog.bind(this);
    this._showCampaignNameDialog = this.showCampaignNameDialog.bind(this);
    this._onNameChange = this.onNameChange.bind(this);
    this._updateChaosBag = this.updateChaosBag.bind(this);
    this._updateDifficulty = this.updateDifficulty.bind(this);
    this._showChaosBagDialog = this.showChaosBagDialog.bind(this);
    this._showDifficultyDialog = this.showDifficultyDialog.bind(this);
    this._campaignChanged = this.campaignChanged.bind(this);
    this._updateNavigatorButtons = this.updateNavigatorButtons.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
    this._deckRemoved = this.deckRemoved.bind(this);
  }

  onWeaknessPackChange(packs) {
    this.setState({
      weaknessPacks: packs,
    });
  }

  static getKeyName(isCount, perInvestigator) {
    if (perInvestigator) {
      if (isCount) {
        return 'investigatorCounts';
      }
      return 'investigatorSections';
    }
    if (isCount) {
      return 'counts';
    }
    return 'sections';
  }

  addCampaignNoteSection(name, isCount, perInvestigator) {
    const customCampaignLog = Object.assign({}, this.state.customCampaignLog);
    const keyName = NewCampaignView.getKeyName(isCount, perInvestigator);
    customCampaignLog[keyName] = (customCampaignLog[keyName] || []).slice();
    customCampaignLog[keyName].push(name);
    this.setState({
      customCampaignLog,
    });
  }

  deleteCampaignNoteSection(name, isCount, perInvestigator) {
    const customCampaignLog = Object.assign({}, this.state.customCampaignLog);
    const keyName = NewCampaignView.getKeyName(isCount, perInvestigator);
    customCampaignLog[keyName] = filter(
      customCampaignLog[keyName] || [],
      sectionName => name !== sectionName);

    this.setState({
      customCampaignLog,
    });
  }

  toggleCampaignLogDialog() {
    this.setState({
      campaignLogDialogVisible: !this.state.campaignLogDialogVisible,
    });
  }

  onNameChange(name) {
    this.setState({
      name: name,
    });
  }

  deckAdded(id) {
    this.setState({
      deckIds: [...this.state.deckIds, id],
    });
  }

  deckRemoved(id) {
    this.setState({
      deckIds: filter([...this.state.deckIds], deckId => deckId !== id),
    });
  }

  updateNavigatorButtons() {
    const {
      navigator,
    } = this.props;
    const {
      campaign,
      campaignCode,
    } = this.state;
    navigator.setButtons({
      rightButtons: [
        {
          title: 'Done',
          id: 'save',
          showAsAction: 'ifRoom',
          disabled: campaignCode === CUSTOM && !campaign,
        },
      ],
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.onSave();
      }
    }
  }

  placeholderName() {
    const {
      campaign,
      campaignCode,
    } = this.state;
    if (campaignCode === CUSTOM) {
      return 'My Custom Campaign';
    }
    return `My ${campaign} Campaign`;
  }

  onSave() {
    const {
      nextId,
      newCampaign,
      onCreateCampaign,
    } = this.props;
    const {
      name,
      campaignCode,
      difficulty,
      deckIds,
      weaknessPacks,
    } = this.state;
    // Save to redux.
    newCampaign(
      nextId,
      name || this.placeholderName(),
      campaignCode,
      difficulty,
      deckIds,
      this.getChaosBag(),
      this.getCampaignLog(),
      weaknessPacks,
    );
    onCreateCampaign(nextId);
  }

  updateChaosBag(chaosBag) {
    this.setState({
      customChaosBag: chaosBag,
    });
  }

  updateDifficulty(value) {
    this.setState({
      difficulty: value,
    }, this._updateNavigatorButtons);
  }

  showChaosBagDialog() {
    const {
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Dialog.EditChaosBag',
      title: 'Chaos Bag',
      passProps: {
        chaosBag: this.state.customChaosBag,
        updateChaosBag: this._updateChaosBag,
      },
      backButtonTitle: 'Cancel',
    });
  }

  showDifficultyDialog() {
    const {
      navigator,
    } = this.props;
    navigator.showLightBox({
      screen: 'Dialog.CampaignDifficulty',
      passProps: {
        difficulty: this.state.difficulty,
        updateDifficulty: this._updateDifficulty,
      },
      style: {
        backgroundColor: 'rgba(128,128,128,.75)',
      },
    });
  }

  campaignChanged(campaignCode, campaign) {
    this.setState({
      campaign,
      campaignCode,
    }, this._updateNavigatorButtons);
  }

  hasDefinedChaosBag() {
    const {
      campaignCode,
      difficulty,
    } = this.state;

    return (
      campaignCode !== CUSTOM &&
      CAMPAIGN_CHAOS_BAGS[campaignCode] &&
      CAMPAIGN_CHAOS_BAGS[campaignCode][DIFFICULTY[difficulty]]
    );
  }

  getChaosBag() {
    const {
      campaignCode,
      difficulty,
      customChaosBag,
    } = this.state;
    if (this.hasDefinedChaosBag()) {
      return CAMPAIGN_CHAOS_BAGS[campaignCode][DIFFICULTY[difficulty]];
    }

    return customChaosBag;
  }

  hasDefinedCampaignLog() {
    const {
      campaignCode,
    } = this.state;
    return (campaignCode !== CUSTOM && CAMPAIGN_LOGS[campaignCode]);
  }

  getCampaignLog() {
    const {
      campaignCode,
      customCampaignLog,
    } = this.state;
    if (this.hasDefinedCampaignLog()) {
      return CAMPAIGN_LOGS[campaignCode];
    }
    return customCampaignLog;
  }

  captureViewRef(ref) {
    this.setState({
      viewRef: ref,
    });
  }

  renderChaosBagSection() {
    const {
      difficulty,
    } = this.state;
    const chaosBag = this.getChaosBag();
    return (
      <View style={styles.margin}>
        <Text style={typography.bigLabel}>Chaos Bag</Text>
        <View style={styles.topPadding}>
          { this.hasDefinedChaosBag() ?
            <LabeledTextBox
              label="Difficulty"
              onPress={this._showDifficultyDialog}
              value={capitalize(difficulty)}
            /> :
            <Button
              text="Customize Bag"
              onPress={this._showChaosBagDialog}
            />
          }
        </View>
        <View style={styles.topPadding}>
          <ChaosBagLine chaosBag={chaosBag} />
        </View>
      </View>
    );
  }

  showCampaignNameDialog() {
    const {
      name,
    } = this.state;
    this.props.showTextEditDialog(
      'Campaign Name',
      name,
      this._onNameChange
    );
  }

  renderWeaknessSetSection() {
    const {
      navigator,
    } = this.props;
    return (
      <View style={styles.margin}>
        <Text style={typography.bigLabel}>Weakness Set</Text>
        <Text style={typography.small}>
          Include all basic weaknesses from these expansions
        </Text>
        <WeaknessSetPackChooserComponent
          navigator={navigator}
          compact
          onSelectedPacksChanged={this._onWeaknessPackChange}
        />
      </View>
    );
  }

  renderCampaignLogSection() {
    const campaignLog = this.getCampaignLog();
    const onPress = this.hasDefinedCampaignLog() ?
      null :
      this._deleteCampaignNoteSection;

    return (
      <View style={styles.margin}>
        <Text style={typography.bigLabel}>
          Campaign Log Sections
        </Text>
        <View style={styles.margin}>
          { map(campaignLog.sections || [], section => (
            <CampaignNoteSectionRow key={section} name={section} onPress={onPress} />
          )) }
          { map(campaignLog.counts || [], section => (
            <CampaignNoteSectionRow key={section} name={section} isCount onPress={onPress} />
          )) }
          { map(campaignLog.investigatorSections || [], section => (
            <CampaignNoteSectionRow key={section} name={section} perInvestigator onPress={onPress} />
          )) }
          { map(campaignLog.investigatorCounts || [], section => (
            <CampaignNoteSectionRow key={section} name={section} perInvestigator isCount onPress={onPress} />
          )) }
        </View>
        { !this.hasDefinedChaosBag() && (
          <Button text="Add Section" onPress={this._toggleCampaignLogDialog} />
        ) }
      </View>
    );
  }

  renderCampaignSectionDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      campaignLogDialogVisible,
    } = this.state;
    return (
      <AddCampaignNoteSectionDialog
        viewRef={viewRef}
        visible={campaignLogDialogVisible}
        addSection={this._addCampaignNoteSection}
        toggleVisible={this._toggleCampaignLogDialog}
      />
    );
  }

  render() {
    const {
      navigator,
      captureViewRef,
    } = this.props;

    const {
      deckIds,
      name,
    } = this.state;

    return (
      <View>
        <ScrollView
          contentContainerStyle={styles.topPadding}
          ref={captureViewRef}
        >
          <View style={styles.underline}>
            <View style={[styles.margin, styles.topPadding]}>
              <LabeledTextBox
                label="Name"
                onPress={this._showCampaignNameDialog}
                placeholder={this.placeholderName()}
                value={name}
              />
            </View>
            <View style={styles.topPadding}>
              <CampaignSelector
                navigator={navigator}
                campaignChanged={this._campaignChanged}
              />
            </View>
          </View>
          <View style={styles.underline}>
            { this.renderChaosBagSection() }
          </View>
          <View style={styles.underline}>
            { this.renderWeaknessSetSection() }
          </View>
          <View style={styles.underline}>
            { this.renderCampaignLogSection() }
          </View>
          <SelectedDeckListComponent
            navigator={navigator}
            deckIds={deckIds}
            deckAdded={this._deckAdded}
            deckRemoved={this._deckRemoved}
          />
          <Button
            style={styles.topPadding}
            color="green"
            text="Save New Campaign"
            onPress={this._onSave}
          />
          <View style={styles.footer} />
        </ScrollView>
        { this.renderCampaignSectionDialog() }
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    nextId: getNextCampaignId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    newCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTextEditDialog(NewCampaignView)
);

const styles = StyleSheet.create({
  topPadding: {
    marginTop: 8,
  },
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
  underline: {
    paddingBottom: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  footer: {
    height: 100,
  },
});
