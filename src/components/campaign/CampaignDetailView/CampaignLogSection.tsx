import React from 'react';

import { ShowTextEditDialog } from 'components/core/withDialogs';
import { CampaignNotes } from 'actions/types';
import Card from 'data/Card';
import EditCampaignNotesComponent from '../EditCampaignNotesComponent';

interface Props {
  componentId: string;
  fontScale: number;
  campaignNotes: CampaignNotes;
  scenarioCount: number;
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
      scenarioCount,
      fontScale,
    } = this.props;
    return (
      <EditCampaignNotesComponent
        key={scenarioCount}
        fontScale={fontScale}
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
