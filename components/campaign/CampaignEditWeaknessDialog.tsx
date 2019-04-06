import React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import L from '../../app/i18n';
import { Campaign, Slots, WeaknessSet } from '../../actions/types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaign } from './actions';
import { getCampaign, AppState } from '../../reducers';

interface OwnProps {
  componentId: string;
  campaignId: number;
}
interface ReduxProps {
  weaknessSet?: WeaknessSet;
}

interface ReduxActionProps {
  updateCampaign: (id: number, campaign: Campaign) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class CampaignEditWeaknessDialog extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        title: {
          text: L('Available weaknesses'),
        },
        backButton: {
          title: L('Back'),
        },
      },
    };
  }

  _updateAssignedCards = (assignedCards: Slots) => {
    const {
      campaignId,
      weaknessSet,
      updateCampaign,
    } = this.props;
    if (weaknessSet) {
      const updatedWeaknessSet = {
        ...weaknessSet,
        assignedCards,
      };
      updateCampaign(
        campaignId,
        { weaknessSet: updatedWeaknessSet } as Campaign
      );
    }
  };

  render() {
    const {
      componentId,
      weaknessSet,
    } = this.props;
    if (!weaknessSet) {
      return null;
    }
    return (
      <EditAssignedWeaknessComponent
        componentId={componentId}
        weaknessSet={weaknessSet}
        updateAssignedCards={this._updateAssignedCards}
      />
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    weaknessSet: (campaign && campaign.weaknessSet) || undefined,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  CampaignEditWeaknessDialog
);
