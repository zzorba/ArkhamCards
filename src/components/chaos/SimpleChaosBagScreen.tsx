import React, { useCallback, useEffect } from 'react';
import { Navigation, NavigationProps } from 'react-native-navigation';
import { t } from 'ttag';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { CampaignDifficulty, FIXED_CHAOS_BAG_CAMPAIGN_ID, NEW_CAMPAIGN, NewCampaignAction } from '@actions/types';
import { getChaosBag } from '@components/campaign/constants';
import { useCampaignFromRedux, useChaosBagResultsRedux } from '@data/local/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { showChaosBagOddsCalculator } from '@components/campaign/nav';
import { EditChaosBagProps } from './EditChaosBagDialog';
import { updateCampaignChaosBag } from '@components/campaign/actions';
import { ChaosBag } from '@app_constants';
import { useSetCampaignChaosBag } from '@data/remote/campaigns';
import { useAppDispatch } from '@app/store';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { useNavigationButtonPressed } from '@components/core/hooks';

export default function ChaosBagTab({ componentId }: NavigationProps) {
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
    showChaosBagOddsCalculator(componentId, FIXED_CHAOS_BAG_CAMPAIGN_ID, []);
  }, [componentId]);

  const setCampaignChaosBag = useSetCampaignChaosBag();
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaignChaosBag(setCampaignChaosBag, FIXED_CHAOS_BAG_CAMPAIGN_ID, chaosBag));
  }, [dispatch, setCampaignChaosBag]);

  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag, chaosBagResults);
  const showEditChaosBagDialog = useCallback(() => {
    if (dummyCampaign) {
      Navigation.push<EditChaosBagProps>(componentId, {
        component: {
          name: 'Dialog.EditChaosBag',
          passProps: {
            chaosBag: dummyCampaign.chaosBag,
            updateChaosBag: updateChaosBag,
            trackDeltas: true,
            cycleCode: dummyCampaign.cycleCode,
          },
          options: {
            topBar: {
              title: {
                text: t`Chaos Bag`,
              },
              backButton: {
                title: t`Cancel`,
              },
            },
          },
        },
      });
    }
  }, [componentId, dummyCampaign, updateChaosBag]);
  useNavigationButtonPressed(
    ({ buttonId }) => {
      if (buttonId === 'edit') {
        showEditChaosBagDialog();
      }
    },
    componentId,
    [showEditChaosBagDialog],
  );

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