import React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { t } from 'ttag';
import { Campaign, Slots, WeaknessSet } from '../../actions/types';
import { NavigationProps } from '../types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaign } from './actions';
import { getCampaign, AppState } from '../../reducers';

export interface CampaignEditWeaknessProps {
  campaignId: number;
}

interface ReduxProps {
  weaknessSet?: WeaknessSet;
}

interface ReduxActionProps {
  updateCampaign: (id: number, campaign: Campaign) => void;
}

type Props = NavigationProps & CampaignEditWeaknessProps & ReduxProps & ReduxActionProps;

class CampaignEditWeaknessDialog extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Available weaknesses`,
        },
        backButton: {
          title: t`Back`,
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

function mapStateToProps(state: AppState, props: NavigationProps & CampaignEditWeaknessProps): ReduxProps {
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

export default connect<ReduxProps, ReduxActionProps, NavigationProps & CampaignEditWeaknessProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  CampaignEditWeaknessDialog
);
