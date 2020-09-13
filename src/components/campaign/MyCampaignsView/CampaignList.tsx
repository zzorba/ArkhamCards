import React from 'react';
import { FlatList, ListRenderItemInfo, Keyboard } from 'react-native';
import { map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Campaign } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import CampaignItem from './CampaignItem';
import { CampaignDetailProps } from '@components/campaign/CampaignDetailView';
import { CampaignGuideProps } from '@components/campaignguide/CampaignGuideView';
import { LinkedCampaignGuideProps } from '@components/campaignguide/LinkedCampaignGuideView';
import LinkedCampaignItem from './LinkedCampaignItem';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import COLORS from '@styles/colors';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';

interface Props {
  onScroll: (...args: any[]) => void;
  componentId: string;
  campaigns: Campaign[];
  footer: React.ReactElement;
}

interface CampaignItemType {
  campaign: Campaign;
}
export default class CampaignList extends React.Component<Props> {
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
    if (campaign.link) {
      return (
        <LinkedCampaignItem
          key={campaign.id}
          campaign={campaign}
          onPress={this._onPress}
        />
      );
    }
    return (
      <CampaignItem
        key={campaign.id}
        campaign={campaign}
        onPress={this._onPress}
      />
    );
  };

  render() {
    const { campaigns, footer, onScroll } = this.props;
    return (
      <FlatList
        contentInset={{ top: SEARCH_BAR_HEIGHT }}
        contentOffset={{ x: 0, y: -SEARCH_BAR_HEIGHT }}
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

