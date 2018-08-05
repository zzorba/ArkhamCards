import React from 'react';
import PropTypes from 'prop-types';

import EditCampaignNotesComponent from '../EditCampaignNotesComponent';

export default class CampaignLogSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    updateCampaignNotes: PropTypes.func.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    showAddSectionDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateCampaignNotes = this.updateCampaignNotes.bind(this);
  }

  updateCampaignNotes(campaignNotes) {
    setTimeout(() => {
      this.props.updateCampaignNotes(campaignNotes);
    }, 0);
  }

  render() {
    const {
      navigator,
      campaign,
      showTextEditDialog,
      showAddSectionDialog,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <EditCampaignNotesComponent
        navigator={navigator}
        campaignNotes={campaign.campaignNotes}
        latestDeckIds={campaign.latestDeckIds}
        updateCampaignNotes={this._updateCampaignNotes}
        showDialog={showTextEditDialog}
        showAddSectionDialog={showAddSectionDialog}
      />
    );
  }
}
