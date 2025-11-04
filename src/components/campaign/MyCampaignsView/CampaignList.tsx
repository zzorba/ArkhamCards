import React, { useCallback, useContext, useMemo } from 'react';
import { Keyboard, View } from 'react-native';
import { map } from 'lodash';

import { STANDALONE } from '@actions/types';
import CampaignItem from './CampaignItem';
import StandaloneItem from './StandaloneItem';
import StyleContext from '@styles/StyleContext';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import useConnectionProblemBanner from '@components/core/useConnectionProblemBanner';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import ArkhamLargeList from '@components/core/ArkhamLargeList';
import ArkhamButton from '@components/core/ArkhamButton';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useDeckActions } from '@data/remote/decks';
import { useMyDecks } from '@data/hooks';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import { useNavigation } from '@react-navigation/native';

interface Props {
  onScroll: (...args: any[]) => void;
  campaigns: MiniCampaignT[];
  footer: React.ReactElement;
  footerHeight?: number;
  standalonesById: { [campaignId: string]: { [scenarioId: string]: string | undefined } | undefined };
  onRefresh?: () => void;
  refreshing?: boolean;
  header?: React.ReactElement;
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

function CampaignList({ onScroll, header, campaigns, footer, footerHeight, standalonesById, onRefresh, refreshing, buttons, login }: Props & LoginStateProps) {
  const { fontScale, width } = useContext(StyleContext);
  const navigation = useNavigation();
  const reLogin = useCallback(() => {
    login();
  }, [login]);

  const { lang } = useContext(LanguageContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
  const onPress = useCallback((id: string, campaign: MiniCampaignT) => {
    Keyboard.dismiss();
    if (campaign.cycleCode === STANDALONE) {
      const standaloneId = campaign.standaloneId;
      if (standaloneId) {
        navigation.navigate('Guide.Standalone', {
          campaignId: campaign.id,
          scenarioId: standaloneId.scenarioId,
          standalone: true,
        });
      }
    } else if (campaign.guided) {
      const link = campaign.linked;
      if (link) {
        navigation.navigate('Guide.LinkedCampaign', {
          campaignId: campaign.id,
          campaignIdA: link.campaignIdA,
          campaignIdB: link.campaignIdB,
        });
      } else {
        navigation.navigate('Guide.Campaign', {
          campaignId: campaign.id,
        });
      }
    } else {
      navigation.navigate('Campaign', {
        campaignId: campaign.id,
      });
    }
  }, [navigation]);

  const deckActions = useDeckActions();
  const [{ refreshing: decksRefreshing, error }, refreshDecks] = useMyDecks(deckActions);
  const [connectionProblemBanner] = useConnectionProblemBanner({ width, arkhamdbState: { error, reLogin } });
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
        { !!header && header }
      </View>
    );
  }, [userId, refreshing, connectionProblemBanner, header]);

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
            campaign={campaign}
            onPress={onPress}
            scenarioName={standalonesById[standaloneId.campaignId]?.[standaloneId.scenarioId]}
          />
        ) : <View />;
      }
      return (
        <CampaignItem
          campaign={campaign}
          onPress={onPress}
        />
      );
    }
    return <>{item.button}</>;
  }, [onPress, renderFooter, standalonesById]);
  const combinedRefreshing = !!(refreshing || decksRefreshing);
  const handleRefresh = useCallback(() => {
    onRefresh?.();
    refreshDecks(false);
  }, [onRefresh, refreshDecks]);

  return (
    <ArkhamLargeList
      onRefresh={handleRefresh}
      onScroll={onScroll}
      data={data}
      refreshing={combinedRefreshing}
      heightForItem={heightForItem}
      renderItem={renderItem}
      renderHeader={renderHeader}
      estimatedItemSize={CampaignItem.computeHeight(fontScale)}
    />
  );
}

export default withLoginState<Props>(CampaignList);
