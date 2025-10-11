import React, { useCallback, useMemo, useContext } from 'react';

import { ScrollView, StyleSheet, Text } from 'react-native';
import { c, t } from 'ttag';

import {
  ALL_CAMPAIGNS,
  CampaignCycleCode, CUSTOM_CAMPAIGNS, StandaloneId,
} from '@actions/types';
import useTabView from '@components/core/useTabView';
import StandaloneTab from './StandaloneTab';
import CampaignTab from './CampaignTab';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import space from '@styles/space';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';

const SHOW_CUSTOM = true;

export type CampaignSelection = {
  type: 'campaign';
  code: CampaignCycleCode;
} | {
  type: 'standalone';
  id: StandaloneId;
}
export interface SelectCampaignProps {
  selectionChanged: (selection: CampaignSelection, text: string, hasGuide: boolean) => void;
}

function SelectCampaignDialog() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Dialog.Campaign'>>();
  const { selectionChanged } = route.params;
  const { backgroundStyle, typography } = useContext(StyleContext);
  const navigation = useNavigation();
  const campaignChanged = useCallback((packCode: CampaignCycleCode, text: string, hasGuide: boolean) => {
    selectionChanged({ type: 'campaign', code: packCode }, text, hasGuide);
    navigation.goBack();
  }, [selectionChanged, navigation]);
  const standaloneChanged = useCallback((id: StandaloneId, text: string, hasGuide: boolean) => {
    selectionChanged({ type: 'standalone', id }, text, hasGuide);
    navigation.goBack();
  }, [selectionChanged, navigation]);

  const editCollection = useCallback(() => {
    navigation.navigate('My.Collection', {})
  }, [navigation]);

  const tabs = useMemo(() => [
    {
      key: 'campaign',
      title: c('new_campaign_type').t`Campaigns`,
      node: (
        <ScrollView style={[styles.flex, backgroundStyle]}>
          <CampaignTab
            campaignChanged={campaignChanged}
            campaigns={ALL_CAMPAIGNS}
            segment
            includeCustom={!SHOW_CUSTOM}
          />
          <ArkhamButton
            icon="edit"
            onPress={editCollection}
            title={t`Edit Collection`}
          />
          { !!SHOW_CUSTOM && (
            <>
              <CardDetailSectionHeader normalCase color="dark" title={t`Fan-Made Campaigns` } />
              <CampaignTab
                campaignChanged={campaignChanged}
                campaigns={CUSTOM_CAMPAIGNS}
                includeCustom
              />
              <Text style={[space.marginSideM, space.marginTopM, space.marginBottomL, typography.text]}>
                { t`If you are a custom content creator who has a "finished" campaign you'd like to see in the app, contact me at arkhamcards@gmail.com. Custom campaigns are a fair amount of work, but I'd love to support the community in anyway I can.` }
              </Text>
            </>
          ) }
        </ScrollView>
      ),
    },
    {
      key: 'standalone',
      title: c('new_campaign_type').t`Standalones`,
      node: (
        <ScrollView style={[styles.flex, backgroundStyle]}>
          <StandaloneTab standaloneChanged={standaloneChanged} campaignChanged={campaignChanged} />
          <ArkhamButton
            icon="edit"
            onPress={editCollection}
            title={t`Edit Collection`}
          />
          <Text style={[space.marginSideM, space.marginTopM, space.marginBottomL, typography.text]}>
            { t`Don't see your favorite Standalone scenario here? Let me know at arkhamcards@gmail.com, and I'll see about including it in a future release.` }
          </Text>
        </ScrollView>
      ),
    },
  ], [campaignChanged, standaloneChanged, editCollection, backgroundStyle, typography]);
  const onTabChange = useCallback((key: string) => {
    navigation.setOptions({
      title: key === 'campaign' ? t`Select Campaign` : t`Select Standalone`,
    });
  }, [navigation]);
  const [tabView] = useTabView({ tabs, onTabChange });
  return <>{tabView}</>;
}

export default SelectCampaignDialog;


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
