import React, { useCallback, useEffect, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { SelectCampagaignProps } from '../SelectCampaignDialog';
import PickerStyleButton from '@components/core/PickerStyleButton';
import { CUSTOM, CORE, CampaignCycleCode } from '@actions/types';

interface Props {
  componentId: string;
  campaignChanged: (
    cycleCode: CampaignCycleCode,
    campaignName: string,
    hasGuide: boolean
  ) => void;
}

interface CampaignState {
  selectedCampaign: string;
  selectedCampaignCode: CampaignCycleCode;
  customCampaign?: string;
  hasGuide: boolean;
}

export default function CampaignSelector({ componentId, campaignChanged }: Props) {
  const [campaignState, setCampaignState] = useState<CampaignState>({
    hasGuide: true,
    selectedCampaign: t`The Night of the Zealot`,
    selectedCampaignCode: CORE,
  });
  useEffect(() => {
    const {
      selectedCampaign,
      selectedCampaignCode,
      customCampaign,
      hasGuide,
    } = campaignState;
    campaignChanged(
      selectedCampaignCode,
      selectedCampaignCode === CUSTOM ?
        (customCampaign || 'Custom Campaign') :
        selectedCampaign,
      hasGuide
    );
  }, [campaignState])

  const handleCampaignChanged = useCallback((code: CampaignCycleCode, text: string, hasGuide: boolean) => {
    setCampaignState({
      selectedCampaign: text,
      selectedCampaignCode: code,
      hasGuide,
    });
  }, [setCampaignState]);

  const campaignPressed = useCallback(() => {
    Navigation.push<SelectCampagaignProps>(componentId, {
      component: {
        name: 'Dialog.Campaign',
        passProps: {
          campaignChanged: handleCampaignChanged,
        },
        options: {
          topBar: {
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, handleCampaignChanged]);

  const {
    selectedCampaign,
  } = campaignState;

  return (
    <PickerStyleButton
      title={t`Campaign`}
      value={selectedCampaign}
      id="campaign"
      onPress={campaignPressed}
      widget="nav"
    />
  );
}
