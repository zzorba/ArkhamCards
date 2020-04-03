import React from 'react';
import { Platform, Text } from 'react-native';
import { map } from 'lodash';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { MyDecksSelectorProps } from 'components/campaign/MyDecksSelectorDialog';
import InvestigatorsTab from './InvestigatorsTab';
import CampaignLogTab from './CampaignLogTab';
import ScenarioListTab from './ScenarioListTab';
import { Deck, CUSTOM } from 'actions/types';
import TabView from 'components/core/TabView';
import Card from 'data/Card';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { CampaignGuideContextType } from '../CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '../withCampaignGuideContext';
import { NavigationProps } from 'components/nav/types';

export type CampaignGuideProps = CampaignGuideInputProps;

type Props = CampaignGuideProps & NavigationProps & DimensionsProps;

class CampaignGuideView extends React.Component<Props & CampaignGuideContextType> {
  _onTabChange = (tab: string) => {
  };

  _deckAdded = (deck: Deck) => {
    const { campaignState } = this.props;
    campaignState.addInvestigator(deck.investigator_code, deck.id);
  };

  _investigatorAdded = (card: Card) => {
    const { campaignState } = this.props;
    campaignState.addInvestigator(card.code);
  };

  _showChooseDeckForInvestigator = (card: Card) => {
    const {
      campaign,
    } = this.props;
    const passProps: MyDecksSelectorProps = {
      campaignId: campaign.id,
      singleInvestigator: card.code,
      onDeckSelect: this._deckAdded,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps,
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  };

  _showChooseDeck = () => {
    const {
      campaign,
      campaignInvestigators,
    } = this.props;
    const passProps: MyDecksSelectorProps = {
      campaignId: campaign.id,
      selectedInvestigatorIds: map(campaignInvestigators, investigator => investigator.code),
      onDeckSelect: this._deckAdded,
      onInvestigatorSelect: this._investigatorAdded,
      simpleOptions: true,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps,
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  };

  render() {
    const {
      campaign,
      campaignGuide,
      campaignState,
      fontScale,
      componentId,
      latestDecks,
    } = this.props;
    if (campaign.cycleCode === CUSTOM) {
      return (
        <Text>No custom scenarios</Text>
      );
    }
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    const tabs = [
      {
        key: 'investigators',
        title: t`Investigators`,
        node: (
          <InvestigatorsTab
            componentId={componentId}
            chooseDeckForInvestigator={this._showChooseDeckForInvestigator}
            addInvestigator={this._showChooseDeck}
            fontScale={fontScale}
            campaign={campaign}
            campaignLog={processedCampaign.campaignLog}
            latestDecks={latestDecks}
          />
        ),
      },
      {
        key: 'scenarios',
        title: t`Scenarios`,
        node: (
          <ScenarioListTab
            campaign={campaign}
            processedCampaign={processedCampaign}
            fontScale={fontScale}
            componentId={componentId}
          />
        ),
      },
      {
        key: 'log',
        title: t`Campaign Log`,
        node: (
          <CampaignLogTab
            campaignGuide={campaignGuide}
            campaignLog={processedCampaign.campaignLog}
            fontScale={fontScale}
          />
        ),
      },
    ];

    return (
      <TabView
        tabs={tabs}
        onTabChange={this._onTabChange}
      />
    );
  }
}

export default withDimensions(
  withCampaignGuideContext<Props>(
    CampaignGuideView
  )
);
