import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { NavigationProps } from '@components/nav/types';
import { ChaosBag } from '@app_constants';
import COLORS from '@styles/colors';
import { EditChaosBagProps } from './EditChaosBagDialog';
import { AppState, getCampaign } from '@reducers';
import { useNavigationButtonPressed } from '@components/core/hooks';

export interface CampaignChaosBagProps {
  campaignId: number;
  updateChaosBag: (chaosBag: ChaosBag) => void;
}

type Props = NavigationProps & CampaignChaosBagProps;

function CampaignChaosBagView({ componentId, campaignId, updateChaosBag }: Props) {
  const chaosBagSelector = useCallback((state: AppState) => {
    const campaign = getCampaign(state, campaignId);
    return (campaign && campaign.chaosBag) || {};
  }, [campaignId]);
  const chaosBag = useSelector(chaosBagSelector);

  const showChaosBagDialog = useCallback(() => {
    if (!updateChaosBag) {
      return;
    }
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag: updateChaosBag,
          trackDeltas: true,
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
  }, [componentId, chaosBag, updateChaosBag]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'back' || buttonId === 'androidBack') {
      Navigation.pop(componentId);
    } else if (buttonId === 'edit') {
      showChaosBagDialog();
    }
  }, componentId, [componentId, showChaosBagDialog]);

  return (
    <DrawChaosBagComponent
      campaignId={campaignId}
      chaosBag={chaosBag}
    />
  );
}

CampaignChaosBagView.options = (): Options => {
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

export default CampaignChaosBagView;
