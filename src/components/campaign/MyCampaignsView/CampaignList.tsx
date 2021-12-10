import React, { useCallback, useContext, useMemo } from 'react';
import { Keyboard, View } from 'react-native';
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
import useConnectionProblemBanner from '@components/core/useConnectionProblemBanner';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { NetInfoStateType } from '@react-native-community/netinfo';
import ArkhamLargeList, { BasicSection } from '@components/core/ArkhamLargeList';
import ArkhamButton from '@components/core/ArkhamButton';
import { useInvestigatorCards } from '@components/core/hooks';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  onScroll: (...args: any[]) => void;
  componentId: string;
  campaigns: MiniCampaignT[];
  footer: JSX.Element;
  standalonesById: { [campaignId: string]: { [scenarioId: string]: string } };
  onRefresh?: () => void;
  refreshing?: boolean;
  buttons: React.ReactNode[];
}

interface CampaignItemType {
  type: 'campaign';
  campaign: MiniCampaignT;
}

interface ButtonItemType {
  type: 'button';
  button: React.ReactNode;
}

type ItemType = CampaignItemType | ButtonItemType;

type ItemHeader = string;

export default function CampaignList({ onScroll, componentId, campaigns, footer, standalonesById, onRefresh, refreshing, buttons }: Props) {
  const { fontScale, height, width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
  const investigators = useInvestigatorCards();
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

  const [{ networkType, isConnected }] = useNetworkStatus();
  const offline = !isConnected || networkType === NetInfoStateType.none;
  const [connectionProblemBanner, connectionProblemBannerHeight] = useConnectionProblemBanner({ width });

  const [data, empty] = useMemo(() => {
    const items: ItemType[] = [
      ...map(campaigns, (campaign): CampaignItemType => {
        return {
          type: 'campaign',
          campaign,
        };
      }),
      ...map(buttons, (button): ButtonItemType => {
        return {
          type: 'button',
          button,
        };
      }),
    ];
    const feed: BasicSection<ItemType, ItemHeader>[] = [{ items, header: '1' }];
    return [feed, campaigns.length === 0];
  }, [campaigns, buttons]);
  const renderFooter = useCallback(() => {
    if (refreshing) {
      return <View />;
    }
    return <View style={{ paddingTop: empty ? SEARCH_BAR_HEIGHT : 0 }}>{footer}</View>;
  }, [footer, refreshing, empty]);

  const heightForSection = useCallback((): number => {
    return SEARCH_BAR_HEIGHT + (!!userId && !refreshing ? connectionProblemBannerHeight : 0);
  }, [userId, refreshing, connectionProblemBannerHeight]);

  const renderSection = useCallback((): React.ReactElement<any> => {
    return (
      <View style={{ paddingTop: SEARCH_BAR_HEIGHT }}>
        { !!userId && !refreshing && connectionProblemBanner ? connectionProblemBanner : null }
      </View>
    );
  }, [userId, refreshing, connectionProblemBanner]);

  const heightForItem = useCallback((item: ItemType) => {
    if (item.type === 'campaign') {
      const campaign = item.campaign;
      if (campaign.cycleCode === STANDALONE) {
        if (campaign.standaloneId) {
          return StandaloneItem.computeHeight(fontScale);
        }
        return 0;
      }
      return CampaignItem.computeHeight(fontScale);
    }
    return ArkhamButton.computeHeight(fontScale, lang);
  }, [fontScale, lang]);

  const renderItem = useCallback((item: ItemType) => {
    if (item.type === 'campaign') {
      const campaign = item.campaign;
      if (campaign.cycleCode === STANDALONE) {
        const standaloneId = campaign.standaloneId;
        return standaloneId ? (
          <StandaloneItem
            key={campaign.uuid}
            campaign={campaign}
            onPress={onPress}
            scenarioName={standalonesById[standaloneId.campaignId][standaloneId.scenarioId]}
          />
        ) : <View />;
      }
      return (
        <CampaignItem
          key={campaign.uuid}
          campaign={campaign}
          onPress={onPress}
        />
      );
    }
    return <>{item.button}</>;
  }, [onPress, standalonesById]);
  return (
    <ArkhamLargeList
      onRefresh={onRefresh}
      onScroll={onScroll}
      data={data}
      refreshing={!!refreshing || !investigators}
      heightForItem={heightForItem}
      heightForSection={heightForSection}
      renderItem={renderItem}
      renderSection={renderSection}
      renderHeader={empty ? renderFooter : undefined}
      renderFooter={!empty ? renderFooter : undefined}
      updateTimeInterval={100}
      groupCount={8}
      groupMinHeight={height}
    />
  );
}
