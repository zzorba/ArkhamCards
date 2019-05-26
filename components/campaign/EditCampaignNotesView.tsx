import React from 'react';
import { filter, flatMap } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { ShowTextEditDialog } from '../core/withDialogs';
import { Campaign, CampaignNotes, Deck } from '../../actions/types';
import Card from '../../data/Card';
import EditCampaignNotesComponent from './EditCampaignNotesComponent';
import { updateCampaign } from './actions';
import { NavigationProps } from '../types';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import { AppState, getCampaign, getAllDecks, getLatestDeckIds } from '../../reducers';

interface OwnProps {
  id: number;
  showTextEditDialog: ShowTextEditDialog;
  showAddSectionDialog: (
    addSection: (
      name: string,
      isCount: boolean,
      perInvestigator: boolean
    ) => void
  ) => void;
}

interface ReduxProps {
  campaign?: Campaign;
  allInvestigators: Card[];
}

interface ReduxActionProps {
  updateCampaign: (id: number, sparseCampaign: Partial<Campaign>) => void;
}

type Props = NavigationProps & OwnProps & ReduxProps & ReduxActionProps & PlayerCardProps;
class EditCampaignNotesView extends React.Component<Props> {

  _updateCampaignNotes = (campaignNotes: CampaignNotes) => {
    const {
      updateCampaign,
      campaign,
    } = this.props;
    if (campaign) {
      setTimeout(() => {
        updateCampaign(campaign.id, { campaignNotes });
      }, 0);
    }
  };

  render() {
    const {
      componentId,
      campaign,
      showTextEditDialog,
      showAddSectionDialog,
      allInvestigators,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <EditCampaignNotesComponent
        componentId={componentId}
        campaignNotes={campaign.campaignNotes}
        allInvestigators={allInvestigators}
        updateCampaignNotes={this._updateCampaignNotes}
        showDialog={showTextEditDialog}
        showAddSectionDialog={showAddSectionDialog}
      />
    );
  }
}


function mapStateToProps(
  state: AppState,
  props: NavigationProps & OwnProps & PlayerCardProps
): ReduxProps {
  const campaign = getCampaign(state, props.id) || undefined;
  const decks = getAllDecks(state);
  const latestDeckIds = campaign ? getLatestDeckIds(state, campaign) : [];
  const latestDecks: Deck[] = flatMap(latestDeckIds, deckId => decks[deckId]);
  return {
    allInvestigators: flatMap(
      filter(latestDecks, deck => !!(deck && deck.investigator_code)),
      deck => props.investigators[deck.investigator_code]),
    campaign,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default withPlayerCards<NavigationProps & OwnProps>(
  connect<ReduxProps, ReduxActionProps, NavigationProps & OwnProps & PlayerCardProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(
    EditCampaignNotesView
  )
);
