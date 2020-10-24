import React, { useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import { EventSubscription, Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { NavigationProps } from '@components/nav/types';
import { ChaosBag } from '@app_constants';
import COLORS from '@styles/colors';
import { EditChaosBagProps } from './EditChaosBagDialog';
import { AppState, getCampaign } from '@reducers';
import { useNavigationButtonPressed } from '@components/core/hooks';
import { Campaign } from '@data/scenario/types';

export interface CampaignChaosBagProps {
  componentId: string;
  campaignId: number;
  updateChaosBag: (chaosBag: ChaosBag) => void;
  trackDeltas?: boolean;
}

interface ReduxProps {
  chaosBag: ChaosBag;
}

type Props = NavigationProps & CampaignChaosBagProps & ReduxProps;

function CampaignChaosBagView({ componentId, campaignId, updateChaosBag, trackDeltas }: Props) {
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
      componentId={componentId}
      campaignId={campaignId}
      chaosBag={chaosBag}
      trackDeltas={trackDeltas}
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
