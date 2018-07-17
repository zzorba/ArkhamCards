import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import withTextEditDialog from '../core/withTextEditDialog';
import AddCampaignNoteSectionDialog from './AddCampaignNoteSectionDialog';
import EditCampaignNotesComponent from './EditCampaignNotesComponent';
import EditTraumaDialog from './EditTraumaDialog';

class EditCampaignNotesDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    updateCampaignNotes: PropTypes.func.isRequired,
    campaignNotes: PropTypes.object,
    investigatorData: PropTypes.object,
    investigators: PropTypes.array,
    showTextEditDialog: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
    captureViewRef: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      campaignNotes: Object.assign({}, props.campaignNotes),
      investigatorData: Object.assign({}, props.investigatorData),
      addSectionVisible: false,
      addSectionFunction: null,
      traumaDialogVisible: false,
      traumaInvestigator: null,
      traumaData: {},
      traumaUpdate: null,
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
    this._showTraumaDialog = this.showTraumaDialog.bind(this);
    this._showAddSectionDialog = this.showAddSectionDialog.bind(this);
    this._updateCampaignNotes = this.updateCampaignNotes.bind(this);
    this._updateTraumaData = this.updateTraumaData.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.props.updateCampaignNotes(this.state.campaignNotes);
        this.props.navigator.pop();
      }
    }
  }

  updateCampaignNotes(campaignNotes) {
    this.setState({
      campaignNotes,
    });
  }

  updateTraumaData(code, data) {
    const {
      investigatorData,
    } = this.state;
    this.setState({
      investigatorData: Object.assign({}, investigatorData, { [code]: data }),
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

  showTraumaDialog(investigator, traumaData) {
    this.setState({
      traumaDialogVisible: true,
      traumaInvestigator: investigator,
      traumaData,
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

  renderTraumaDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      traumaDialogVisible,
      traumaInvestigator,
      traumaData,
    } = this.state;

    return (
      <EditTraumaDialog
        visible={traumaDialogVisible}
        investigator={traumaInvestigator}
        trauma={traumaData}
        updateTrauma={this._updateTraumaData}
        hideDialog={this._hideTraumaDialog}
        viewRef={viewRef}
      />
    );
  }

  render() {
    const {
      investigators,
      showTextEditDialog,
      captureViewRef,
    } = this.props;
    const {
      campaignNotes,
      investigatorData,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.container} ref={captureViewRef}>
          <EditCampaignNotesComponent
            campaignNotes={campaignNotes}
            investigatorData={investigatorData}
            investigators={investigators}
            updateCampaignNotes={this._updateCampaignNotes}
            showDialog={showTextEditDialog}
            showTraumaDialog={this._showTraumaDialog}
            showAddSectionDialog={this._showAddSectionDialog}
          />
        </View>
        { this.renderTraumaDialog() }
        { this.renderAddSectionDialog() }
      </View>
    );
  }
}

export default withTextEditDialog(EditCampaignNotesDialog);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
