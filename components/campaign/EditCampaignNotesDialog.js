import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { iconsMap } from '../../app/NavIcons';
import withTextEditDialog from '../core/withTextEditDialog';
import AddCampaignNoteSectionDialog from './AddCampaignNoteSectionDialog';
import EditCampaignNotesComponent from './EditCampaignNotesComponent';
import { updateCampaign } from './actions';
import { getCampaign } from '../../reducers';

class EditCampaignNotesDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    // From redux
    updateCampaign: PropTypes.func.isRequired,
    campaignNotes: PropTypes.object,
    latestDeckIds: PropTypes.array,
    // From Dialog HOC
    showTextEditDialog: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
    captureViewRef: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      campaignNotes: Object.assign({}, props.campaignNotes),
      addSectionVisible: false,
      addSectionFunction: null,
      hasPendingEdits: false,
    };

    const backButton = Platform.OS === 'ios' ? {
      systemItem: 'cancel',
      id: 'back',
    } : {
      icon: iconsMap['chevron-left'],
      id: 'back',
    };

    props.navigator.setButtons({
      leftButtons: [
        backButton,
      ],
      rightButtons: [
        {
          title: 'Save',
          id: 'save',
          showAsAction: 'ifRoom',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._toggleAddSectionDialog = this.toggleAddSectionDialog.bind(this);
    this._hideTraumaDialog = this.hideTraumaDialog.bind(this);
    this._showAddSectionDialog = this.showAddSectionDialog.bind(this);
    this._updateCampaignNotes = this.updateCampaignNotes.bind(this);
  }

  onNavigatorEvent(event) {
    const {
      campaignId,
      updateCampaign,
      navigator,
    } = this.props;
    const {
      campaignNotes,
      hasPendingEdits,
    } = this.state;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        updateCampaign(campaignId, {
          campaignNotes,
        });
        navigator.pop();
      } else if (event.id === 'back') {
        if (!hasPendingEdits) {
          navigator.pop();
        } else {
          Alert.alert(
            'Save campaign notes?',
            'Looks like you have made some changes that have not been saved.',
            [{
              text: 'Save Changes',
              onPress: () => {
                updateCampaign(campaignId, { campaignNotes });
                navigator.pop();
              },
            }, {
              text: 'Discard Changes',
              style: 'destructive',
              onPress: () => {
                navigator.pop();
              },
            }, {
              text: 'Cancel',
              style: 'cancel',
            }],
          );
        }
      }
    }
  }

  updateCampaignNotes(campaignNotes) {
    this.setState({
      campaignNotes,
      hasPendingEdits: true,
    });
  }

  showAddSectionDialog(addSectionFunction) {
    this.setState({
      addSectionVisible: true,
      addSectionFunction,
    });
  }

  toggleAddSectionDialog() {
    this.setState({
      addSectionVisible: !this.state.addSectionVisible,
    });
  }

  hideTraumaDialog() {
    this.setState({
      traumaDialogVisible: false,
    });
  }

  renderAddSectionDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      addSectionVisible,
      addSectionFunction,
    } = this.state;

    return (
      <AddCampaignNoteSectionDialog
        viewRef={viewRef}
        visible={addSectionVisible}
        addSection={addSectionFunction}
        toggleVisible={this._toggleAddSectionDialog}
      />
    );
  }

  render() {
    const {
      navigator,
      showTextEditDialog,
      captureViewRef,
      latestDeckIds,
    } = this.props;
    const {
      campaignNotes,
    } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} ref={captureViewRef}>
          <EditCampaignNotesComponent
            navigator={navigator}
            campaignNotes={campaignNotes}
            latestDeckIds={latestDeckIds}
            updateCampaignNotes={this._updateCampaignNotes}
            showDialog={showTextEditDialog}
            showAddSectionDialog={this._showAddSectionDialog}
          />
          <View style={styles.footer} />
        </ScrollView>
        { this.renderAddSectionDialog() }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.campaignId);
  return {
    latestDeckIds: campaign.latestDeckIds,
    campaignNotes: campaign.campaignNotes,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTextEditDialog(EditCampaignNotesDialog)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 100,
  },
});
