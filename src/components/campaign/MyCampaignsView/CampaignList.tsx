import React, { useCallback, useContext, useMemo, useState } from 'react';
import { FlatList, ListRenderItemInfo, Keyboard, Platform, View, StyleSheet, RefreshControl } from 'react-native';
import { map } from 'lodash';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import { STANDALONE } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import CampaignItem from './CampaignItem';
import { CampaignDetailProps } from '@components/campaign/CampaignDetailView';
import { CampaignGuideProps } from '@components/campaignguide/CampaignGuideView';
import { StandaloneGuideProps } from '@components/campaignguide/StandaloneGuideView';
import { LinkedCampaignGuideProps } from '@components/campaignguide/LinkedCampaignGuideView';
import COLORS from '@styles/colors';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StandaloneItem from './StandaloneItem';
import StyleContext from '@styles/StyleContext';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import ConnectionProblemBanner from '@components/core/ConnectionProblemBanner';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { NetInfoStateType } from '@react-native-community/netinfo';

interface Props {
  onScroll: (...args: any[]) => void;
  componentId: string;
  campaigns: MiniCampaignT[];
  footer: JSX.Element;
  standalonesById: { [campaignId: string]: { [scenarioId: string]: string } };
  onRefresh?: () => void;
  refreshing?: boolean;
}

interface CampaignItemType {
  campaign: MiniCampaignT;
}

export default function CampaignList({ onScroll, componentId, campaigns, footer, standalonesById, onRefresh, refreshing }: Props) {
  const { colors, width } = useContext(StyleContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
  const onPress = useCallback((id: string, campaign: MiniCampaignT) => {
    Keyboard.dismiss();
    const options: Options = {
      topBar: {
        title: {
          text: campaign.name,
        },
        backButton: {
          title: t`Back`,
        },
        rightButtons: [
          {
            icon: iconsMap.edit,
            id: 'edit',
            color: COLORS.M,
            accessibilityLabel: t`Edit name`,
          },
        ],
      },
    };
    if (campaign.cycleCode === STANDALONE) {
      const standaloneId = campaign.standaloneId;
      if (standaloneId) {
        Navigation.push<StandaloneGuideProps>(componentId, {
          component: {
            name: 'Guide.Standalone',
            passProps: {
              campaignId: campaign.id,
              scenarioId: standaloneId.scenarioId,
              standalone: true,
            },
            options,
          },
        });
      }
    } else if (campaign.guided) {
      const link = campaign.linked;
      if (link) {
        Navigation.push<LinkedCampaignGuideProps>(componentId, {
          component: {
            name: 'Guide.LinkedCampaign',
            passProps: {
              campaignId: campaign.id,
              campaignIdA: link.campaignIdA,
              campaignIdB: link.campaignIdB,
            },
            options,
          },
        });
      } else {
        Navigation.push<CampaignGuideProps>(componentId, {
          component: {
            name: 'Guide.Campaign',
            passProps: {
              campaignId: campaign.id,
            },
            options,
          },
        });
      }
    } else {
      Navigation.push<CampaignDetailProps>(componentId, {
        component: {
          name: 'Campaign',
          passProps: {
            campaignId: campaign.id,
          },
          options,
        },
      });
    }
  }, [componentId]);

  const renderItem = useCallback(({ item: { campaign } }: ListRenderItemInfo<CampaignItemType>) => {
    if (campaign.cycleCode === STANDALONE) {
      const standaloneId = campaign.standaloneId;
      return standaloneId ? (
        <StandaloneItem
          key={campaign.uuid}
          campaign={campaign}
          onPress={onPress}
          scenarioName={standalonesById[standaloneId.campaignId][standaloneId.scenarioId]}
        />
      ) : null;
    }
    return (
      <CampaignItem
        key={campaign.uuid}
        campaign={campaign}
        onPress={onPress}
      />
    );
  }, [onPress, standalonesById]);
  const [{ networkType, isConnected }] = useNetworkStatus();
  const offline = !isConnected || networkType === NetInfoStateType.none;
  const header = useMemo(() => {
    return (
      <>
        { Platform.OS === 'android' && <View style={styles.searchBarPadding} /> }
        { !!userId && <ConnectionProblemBanner width={width} /> }
      </>
    )
  }, [width, userId]);
  const [isRefreshing, setRefreshing] = useState(false);
  const doRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh && onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  }, [setRefreshing, onRefresh]);
  const data = useMemo(() => {
    return map(campaigns, campaign => {
      return {
        key: campaign.uuid,
        campaign,
      };
    });
  }, [campaigns]);
  return (
    <FlatList
      contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
      contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
      refreshControl={onRefresh ? (
        <RefreshControl
          refreshing={!offline && (isRefreshing || !!refreshing)}
          onRefresh={doRefresh}
          tintColor={colors.lightText}
          progressViewOffset={SEARCH_BAR_HEIGHT}
        />
      ) : undefined}
      onScroll={onScroll}
      data={data}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
    />
  );
}

const styles = StyleSheet.create({
  searchBarPadding: {
    height: SEARCH_BAR_HEIGHT,
  },
});
