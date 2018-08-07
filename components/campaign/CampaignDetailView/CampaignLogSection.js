import React from 'react';
import PropTypes from 'prop-types';

import EditCampaignNotesComponent from '../EditCampaignNotesComponent';

export default class CampaignLogSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignNotes: PropTypes.object.isRequired,
    updateCampaignNotes: PropTypes.func.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    showAddSectionDialog: PropTypes.func.isRequired,
    allInvestigators: PropTypes.array,
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
      campaignNotes,
      showTextEditDialog,
      showAddSectionDialog,
      allInvestigators,
    } = this.props;
    return (
      <EditCampaignNotesComponent
        navigator={navigator}
        campaignNotes={campaignNotes}
        allInvestigators={allInvestigators}
        updateCampaignNotes={this._updateCampaignNotes}
        showDialog={showTextEditDialog}
        showAddSectionDialog={showAddSectionDialog}
      />
    );
  }
}
