import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import withTextEditDialog from '../core/withTextEditDialog';
import EditCampaignNotesComponent from './EditCampaignNotesComponent';

class EditCampaignNotesDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    updateCampaignNotes: PropTypes.func.isRequired,
    campaignNotes: PropTypes.object,
    investigators: PropTypes.array,
    showTextEditDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      campaignNotes: Object.assign({}, props.campaignNotes),
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

    this._updateCampaignNotes = this.updateCampaignNotes.bind(this);
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

  render() {
    const {
      investigators,
      showTextEditDialog,
    } = this.props;
    const {
      campaignNotes,
    } = this.state;
    return (
      <EditCampaignNotesComponent
        campaignNotes={campaignNotes}
        investigators={investigators}
        updateCampaignNotes={this._updateCampaignNotes}
        showDialog={showTextEditDialog}
      />
    );
  }
}

export default withTextEditDialog(EditCampaignNotesDialog);
