import React from 'react';
import PropTypes from 'prop-types';
import { capitalize, filter } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import WeaknessSetPackChooserComponent from '../weakness/WeaknessSetPackChooserComponent';
import { getPacksInCollection } from '../../reducers';
import CampaignSelector from './CampaignSelector';
import { CUSTOM } from './constants';
import LabeledTextBox from '../core/LabeledTextBox';
import ChaosBagLine from '../core/ChaosBagLine';
import Button from '../core/Button';
import EditNameDialog from '../core/EditNameDialog';
import SelectedDeckListComponent from '../SelectedDeckListComponent';
import { CAMPAIGN_CHAOS_BAGS, DIFFICULTY } from '../../constants';
import typography from '../../styles/typography';

class NewCampaignView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    newCampaign: PropTypes.func.isRequired,
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
      viewRef: null,
      editNameDialogVisible: false,
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._onWeaknessPackChange = this.onWeaknessPackChange.bind(this);
    this._toggleEditNameDialog = this.toggleEditNameDialog.bind(this);
    this._onNameChange = this.onNameChange.bind(this);
    this._captureViewRef = this.captureViewRef.bind(this);
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

  toggleEditNameDialog() {
    this.setState({
      editNameDialogVisible: !this.state.editNameDialogVisible,
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
    const {
      campaign,
      campaignCode,
      difficulty,
      deckIds,
    } = this.state;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.props.newCampaign(campaignCode, campaign, difficulty, deckIds, this.getChaosBag());
        this.props.navigator.pop();
      }
    }
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

  renderNameDialog() {
    const {
      name,
      viewRef,
      editNameDialogVisible,
    } = this.state;

    return (
      <EditNameDialog
        title="Campaign Name"
        visible={editNameDialogVisible}
        name={name}
        viewRef={viewRef}
        onNameChange={this._onNameChange}
        toggleVisible={this._toggleEditNameDialog}
      />
    );
  }

  renderWeaknessSetSection() {
    const {
      navigator,
    } = this.props;
    return (
      <View style={styles.margin}>
        <Text style={typography.bigLabel}>Weakness Set</Text>
        <WeaknessSetPackChooserComponent
          navigator={navigator}
          compact
          onSelectedPacksChanged={this._onWeaknessPackChange}
        />
      </View>
    );
  }

  render() {
    const {
      navigator,
    } = this.props;

    const {
      deckIds,
      name,
      campaign,
    } = this.state;

    return (
      <View ref={this._captureViewRef}>
        <ScrollView contentContainerStyle={styles.topPadding}>
          <View style={styles.underline}>
            <View style={[styles.margin, styles.topPadding]}>
              <LabeledTextBox
                label="Name"
                onPress={this._toggleEditNameDialog}
                placeholder={`My ${campaign}`}
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
          <SelectedDeckListComponent
            navigator={navigator}
            deckIds={deckIds}
            deckAdded={this._deckAdded}
            deckRemoved={this._deckRemoved}
          />
        </ScrollView>
        { this.renderNameDialog() }
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCampaignView);

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
});
