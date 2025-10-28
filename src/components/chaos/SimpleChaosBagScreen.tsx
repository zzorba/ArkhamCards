import React, { useCallback, useContext, useEffect, useLayoutEffect } from 'react';
import { t } from 'ttag';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { CampaignDifficulty, FIXED_CHAOS_BAG_CAMPAIGN_ID, NEW_CAMPAIGN, NewCampaignAction } from '@actions/types';
import { getChaosBag } from '@components/campaign/constants';
import { useCampaignFromRedux, useChaosBagResultsRedux } from '@data/local/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { showChaosBagOddsCalculator } from '@components/campaign/nav';
import { updateCampaignChaosBag } from '@components/campaign/actions';
import { ChaosBag } from '@app_constants';
import { useSetCampaignChaosBag } from '@data/remote/campaigns';
import { useAppDispatch } from '@app/store';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { useNavigation } from '@react-navigation/native';
import HeaderButton from '@components/core/HeaderButton';
import StyleContext from '@styles/StyleContext';

export default function ChaosBagTab() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const dummyCampaign = useCampaignFromRedux(FIXED_CHAOS_BAG_CAMPAIGN_ID);
  useEffect(() => {
    if (!dummyCampaign) {
      const action: NewCampaignAction = {
        type: NEW_CAMPAIGN,
        name: '',
        uuid: FIXED_CHAOS_BAG_CAMPAIGN_ID.campaignId,
        cycleCode: 'custom',
        difficulty: CampaignDifficulty.STANDARD,
        chaosBag: getChaosBag('custom', CampaignDifficulty.STANDARD),
        campaignLog: {},
        weaknessSet: {
          packCodes: [],
          assignedCards: {},
        },
        deckIds: [],
        investigatorIds: [],
        guided: false,
        now: new Date(),
      };
      dispatch(action);
    }
  }, [dispatch, dummyCampaign]);
  const chaosBag = dummyCampaign?.chaosBag;
  const chaosBagResults = useChaosBagResultsRedux(FIXED_CHAOS_BAG_CAMPAIGN_ID);

  const showChaosBagOdds = useCallback(() => {
    showChaosBagOddsCalculator(navigation, FIXED_CHAOS_BAG_CAMPAIGN_ID, []);
  }, [navigation]);

  const setCampaignChaosBag = useSetCampaignChaosBag();
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaignChaosBag(setCampaignChaosBag, FIXED_CHAOS_BAG_CAMPAIGN_ID, chaosBag));
  }, [dispatch, setCampaignChaosBag]);

  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag, chaosBagResults);
  const showEditChaosBagDialog = useCallback(() => {
    if (dummyCampaign) {
      navigation.navigate('Dialog.EditChaosBag',{
        chaosBag: dummyCampaign.chaosBag,
        updateChaosBag: updateChaosBag,
        trackDeltas: true,
        cycleCode: dummyCampaign.cycleCode,
      });
    }
  }, [navigation, dummyCampaign, updateChaosBag]);
  const { colors } = useContext(StyleContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton iconName="edit" onPress={showEditChaosBagDialog} accessibilityLabel={t`Edit Chaos Bag`} color={colors.M} />
      ),
    })
  }, [navigation, colors, showEditChaosBagDialog]);

  if (!chaosBag) {
    return <LoadingSpinner large />;
  }
  return (
    <>
      <DrawChaosBagComponent
        campaignId={FIXED_CHAOS_BAG_CAMPAIGN_ID}
        chaosBag={chaosBag}
        chaosBagResults={chaosBagResults}
        viewChaosBagOdds={showChaosBagOdds}
        editViewPressed={showDialog}
      />
      { dialog }
    </>
  );
}