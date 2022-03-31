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
import StandaloneItem from './StandaloneItem';
import StyleContext from '@styles/StyleContext';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import useConnectionProblemBanner from '@components/core/useConnectionProblemBanner';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { NetInfoStateType } from '@react-native-community/netinfo';
import ArkhamLargeList from '@components/core/ArkhamLargeList';
import ArkhamButton from '@components/core/ArkhamButton';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  onScroll: (...args: any[]) => void;
  componentId: string;
  campaigns: MiniCampaignT[];
  footer: JSX.Element;
  footerHeight?: number;
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

interface FooterType {
  type: 'footer';
  height: number;
}

type ItemType = CampaignItemType | ButtonItemType | FooterType;

export default function CampaignList({ onScroll, componentId, campaigns, footer, footerHeight, standalonesById, onRefresh, refreshing, buttons }: Props) {
  const { fontScale, width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
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

  const [{ networkType, isConnected }] = useNetworkStatus();
  const offline = !isConnected || networkType === NetInfoStateType.none;
  const [connectionProblemBanner] = useConnectionProblemBanner({ width });

  const data = useMemo(() => {
    const empty = campaigns.length === 0;
    const footerItem: FooterType = { type: 'footer', height: footerHeight || 0 };
    const items: ItemType[] = [
      ...(empty ? [footerItem] : []),
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
      ...(!empty ? [footerItem] : []),
    ];
    return items;
  }, [campaigns, buttons, footerHeight]);
  const renderFooter = useCallback(() => {
    if (refreshing) {
      return <View />;
    }
    return (
      <View style={{ flexDirection: 'column' }}>
        { footer }
      </View>
    );
  }, [footer, refreshing]);

  const renderHeader = useCallback((): React.ReactElement<any> => {
    return (
      <View>
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
    if (item.type === 'footer') {
      return refreshing ? 0 : item.height;
    }
    return ArkhamButton.computeHeight(fontScale, lang);
  }, [fontScale, lang, refreshing]);

  const renderItem = useCallback((item: ItemType) => {
    if (item.type === 'footer') {
      return renderFooter();
    }
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
  }, [onPress, renderFooter, standalonesById]);
  return (
    <ArkhamLargeList
      onRefresh={onRefresh}
      onScroll={onScroll}
      data={data}
      refreshing={!!refreshing}
      heightForItem={heightForItem}
      renderItem={renderItem}
      renderHeader={renderHeader}
    />
  );
}
