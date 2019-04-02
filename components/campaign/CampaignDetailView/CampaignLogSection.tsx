import React from 'react';

import { ShowTextEditDialog } from '../../core/withDialogs';
import { CampaignNotes } from '../../../actions/types';
import Card from '../../../data/Card';
import EditCampaignNotesComponent from '../EditCampaignNotesComponent';

interface Props {
  componentId: string;
  campaignNotes: CampaignNotes;
  updateCampaignNotes: (campaignNotes: CampaignNotes) => void;
  showTextEditDialog: ShowTextEditDialog;
  showAddSectionDialog: (
    addSection: (
      name: string,
      isCount: boolean,
      perInvestigator: boolean
    ) => void
  ) => void;
  allInvestigators: Card[];
}

export default class CampaignLogSection extends React.Component<Props> {

  _updateCampaignNotes = (campaignNotes: CampaignNotes) => {
    setTimeout(() => {
      this.props.updateCampaignNotes(campaignNotes);
    }, 0);
  };

  render() {
    const {
      componentId,
      campaignNotes,
      showTextEditDialog,
      showAddSectionDialog,
      allInvestigators,
    } = this.props;
    return (
      <EditCampaignNotesComponent
        componentId={componentId}
        campaignNotes={campaignNotes}
        allInvestigators={allInvestigators}
        updateCampaignNotes={this._updateCampaignNotes}
        showDialog={showTextEditDialog}
        showAddSectionDialog={showAddSectionDialog}
      />
    );
  }
}
