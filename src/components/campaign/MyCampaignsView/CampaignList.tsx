import React from 'react';
import { FlatList, ListRenderItemInfo, Keyboard } from 'react-native';
import { map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Campaign } from 'actions/types';
import { iconsMap } from 'app/NavIcons';
import CampaignItem from './CampaignItem';
import { CampaignDetailProps } from '@components/campaign/CampaignDetailView';
import { CampaignGuideProps } from '@components/campaignguide/CampaignGuideView';
import { LinkedCampaignGuideProps } from '@components/campaignguide/LinkedCampaignGuideView';
import LinkedCampaignItem from './LinkedCampaignItem';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import COLORS from '@styles/colors';

interface OwnProps {
  onScroll: (...args: any[]) => void;
  componentId: string;
  campaigns: Campaign[];
  footer: React.ReactElement;
}

type Props = OwnProps & PlayerCardProps;

interface CampaignItemType {
  campaign: Campaign;
}
class CampaignList extends React.Component<Props> {
  _onPress = (id: number, campaign: Campaign) => {
    const {
      componentId,
    } = this.props;
    Keyboard.dismiss();
    const options = {
      topBar: {
        title: {
          text: campaign.name,
        },
        backButton: {
          title: t`Back`,
        },
        rightButtons: [
          campaign.guided ? {
            icon: iconsMap.edit,
            id: 'edit',
            color: COLORS.navButton,
            testID: t`Edit name`,
          } : {
            icon: iconsMap.menu,
            id: 'menu',
            color: COLORS.navButton,
          },
        ],
      },
    };
    if (campaign.guided) {
      if (campaign.link) {
        Navigation.push<LinkedCampaignGuideProps>(componentId, {
          component: {
            name: 'Guide.LinkedCampaign',
            passProps: {
              campaignId: campaign.id,
              campaignIdA: campaign.link.campaignIdA,
              campaignIdB: campaign.link.campaignIdB,
            },
            options,
          },
        });
        return;
      }
      Navigation.push<CampaignGuideProps>(componentId, {
        component: {
          name: 'Guide.Campaign',
          passProps: {
            campaignId: campaign.id,
          },
          options,
        },
      });
    } else {
      Navigation.push<CampaignDetailProps>(componentId, {
        component: {
          name: 'Campaign',
          passProps: {
            id,
          },
          options,
        },
      });
    }
  };

  _renderItem = ({ item: { campaign } }: ListRenderItemInfo<CampaignItemType>) => {
    const {
      investigators,
    } = this.props;
    if (campaign.link) {
      return (
        <LinkedCampaignItem
          key={campaign.id}
          campaign={campaign}
          investigators={investigators}
          onPress={this._onPress}
        />
      );
    }
    return (
      <CampaignItem
        key={campaign.id}
        campaign={campaign}
        investigators={investigators}
        onPress={this._onPress}
      />
    );
  };

  render() {
    const { campaigns, footer, onScroll } = this.props;
    return (
      <FlatList
        onScroll={onScroll}
        data={map(campaigns, campaign => {
          return {
            key: `${campaign.id}`,
            campaign,
          };
        })}
        renderItem={this._renderItem}
        ListFooterComponent={footer}
      />
    );
  }
}

export default withPlayerCards(CampaignList);