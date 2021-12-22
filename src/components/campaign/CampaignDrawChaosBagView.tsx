import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { updateCampaignChaosBag } from '@components/campaign/actions';
import { NavigationProps } from '@components/nav/types';
import { ChaosBag } from '@app_constants';
import COLORS from '@styles/colors';
import { EditChaosBagProps } from './EditChaosBagDialog';
import { AppState, makeCampaignChaosBagSelector } from '@reducers';
import { useNavigationButtonPressed } from '@components/core/hooks';
import { CampaignCycleCode, CampaignId } from '@actions/types';
import { showChaosBagOddsCalculator } from './nav';
import Card from '@data/types/Card';
import { useSetCampaignChaosBag } from '@data/remote/campaigns';

export interface CampaignDrawChaosBagProps {
  campaignId: CampaignId;
  allInvestigators: Card[];
  cycleCode: CampaignCycleCode,
}

type Props = NavigationProps & CampaignDrawChaosBagProps;

function CampaignDrawChaosBagView({ componentId, campaignId, allInvestigators, cycleCode }: Props) {
  const chaosBagSelector = useMemo(makeCampaignChaosBagSelector, []);
  const dispatch = useDispatch();
  const chaosBag = useSelector((state: AppState) => chaosBagSelector(state, campaignId.campaignId));
  const setCampaignChaosBag = useSetCampaignChaosBag();
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaignChaosBag(setCampaignChaosBag, campaignId, chaosBag));
  }, [dispatch, setCampaignChaosBag, campaignId]);

  const showEditChaosBagDialog = useCallback(() => {
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag: updateChaosBag,
          trackDeltas: true,
          cycleCode,
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
  }, [componentId, cycleCode, chaosBag, updateChaosBag]);


  const showChaosBagOdds = useCallback(() => {
    showChaosBagOddsCalculator(componentId, campaignId, allInvestigators);
  }, [componentId, campaignId, allInvestigators]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'back' || buttonId === 'androidBack') {
      Navigation.pop(componentId);
    } else if (buttonId === 'edit') {
      showEditChaosBagDialog();
    }
  }, componentId, [componentId, showEditChaosBagDialog]);

  return (
    <DrawChaosBagComponent
      campaignId={campaignId}
      chaosBag={chaosBag}
      editViewPressed={showEditChaosBagDialog}
      viewChaosBagOdds={showChaosBagOdds}
      editable
    />
  );
}

CampaignDrawChaosBagView.options = (): Options => {
  return {
    topBar: {
      rightButtons: [{
        systemItem: 'save',
        text: t`Edit`,
        id: 'edit',
        color: COLORS.M,
        accessibilityLabel: t`Edit Chaos Bag`,
      }],
    },
  };
};

export default CampaignDrawChaosBagView;
