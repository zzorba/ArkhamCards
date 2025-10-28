import React, { useCallback, useLayoutEffect } from 'react';

import { t } from 'ttag';

import { useAppDispatch } from '@app/store';
import DrawChaosBagComponent from './DrawChaosBagComponent';
import { updateCampaignChaosBag } from '@components/campaign/actions';
import { ChaosBag } from '@app_constants';
import COLORS from '@styles/colors';
import { CampaignCycleCode, CampaignId } from '@actions/types';
import { showChaosBagOddsCalculator } from '../campaign/nav';
import { useSetCampaignChaosBag } from '@data/remote/campaigns';
import { useChaosBagResults, useNonGuideChaosBag } from '@data/hooks';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';

export interface CampaignDrawChaosBagProps {
  campaignId: CampaignId;
  allInvestigators: CampaignInvestigator[];
  cycleCode: CampaignCycleCode,
}

function CampaignDrawChaosBagView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Campaign.DrawChaosBag'>>();
  const { campaignId, allInvestigators, cycleCode } = route.params;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const chaosBag = useNonGuideChaosBag(campaignId);
  const setCampaignChaosBag = useSetCampaignChaosBag();
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaignChaosBag(setCampaignChaosBag, campaignId, chaosBag));
  }, [dispatch, setCampaignChaosBag, campaignId]);

  const showEditChaosBagDialog = useCallback(() => {
    navigation.navigate('Dialog.EditChaosBag', {
      chaosBag,
      updateChaosBag: updateChaosBag,
      trackDeltas: true,
      cycleCode,
    });
  }, [navigation, cycleCode, chaosBag, updateChaosBag]);


  const showChaosBagOdds = useCallback(() => {
    showChaosBagOddsCalculator(navigation, campaignId, allInvestigators);
  }, [navigation, campaignId, allInvestigators]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          text={t`Edit`}
          color={COLORS.M}
          accessibilityLabel={t`Edit Chaos Bag`}
          onPress={showEditChaosBagDialog}
        />
      ),
    })
  }, [navigation, showEditChaosBagDialog]);
  const chaosBagResults = useChaosBagResults(campaignId);
  return (
    <DrawChaosBagComponent
      campaignId={campaignId}
      chaosBag={chaosBag}
      chaosBagResults={chaosBagResults}
      editViewPressed={showEditChaosBagDialog}
      viewChaosBagOdds={showChaosBagOdds}
      editable
    />
  );
}

export default CampaignDrawChaosBagView;
