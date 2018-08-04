import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import withTraumaDialog from './withTraumaDialog';
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
    investigatorData: PropTypes.object,
    latestDeckIds: PropTypes.array,
    // From trauma HOC
    showTraumaDialog: PropTypes.func.isRequired,
    investigatorDataUpdates: PropTypes.object.isRequired,
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
    };

    props.navigator.setButtons({
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
    } = this.props;
    const {
      campaignNotes,
    } = this.state;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        updateCampaign(campaignId, {
          campaignNotes,
          investigatorData: this.investigatorData(),
        });
        this.props.navigator.pop();
      }
    }
  }

  investigatorData() {
    const {
      investigatorData,
      investigatorDataUpdates,
    } = this.props;
    return Object.assign({}, investigatorData, investigatorDataUpdates);
  }

  updateCampaignNotes(campaignNotes) {
    this.setState({
      campaignNotes,
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
      campaignId,
      showTraumaDialog,
    } = this.props;
    const {
      campaignNotes,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.container} ref={captureViewRef}>
          <EditCampaignNotesComponent
            navigator={navigator}
            campaignId={campaignId}
            campaignNotes={campaignNotes}
            latestDeckIds={latestDeckIds}
            investigatorData={this.investigatorData()}
            updateCampaignNotes={this._updateCampaignNotes}
            showDialog={showTextEditDialog}
            showTraumaDialog={showTraumaDialog}
            showAddSectionDialog={this._showAddSectionDialog}
          />
        </View>
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
    investigatorData: campaign.investigatorData || {},
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTraumaDialog(
    withTextEditDialog(EditCampaignNotesDialog)
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
