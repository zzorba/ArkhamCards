import React, { useCallback, useEffect, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { CampaignSelection, SelectCampagaignProps } from '@components/campaign/SelectCampaignDialog';
import { CUSTOM, CORE } from '@actions/types';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';

interface Props {
  componentId: string;
  campaignChanged: (
    selection: CampaignSelection,
    campaignName: string,
    hasGuide: boolean
  ) => void;
}

interface CampaignState {
  selectedCampaign: string;
  selection: CampaignSelection,
  customCampaign?: string;
  hasGuide: boolean;
}

export default function CampaignSelector({ componentId, campaignChanged }: Props) {
  const [campaignState, setCampaignState] = useState<CampaignState | undefined>();
  useEffect(() => {
    if (campaignState) {
      const {
        selectedCampaign,
        selection,
        customCampaign,
        hasGuide,
      } = campaignState;
      campaignChanged(
        selection,
        (selection.type === 'campaign' && selection.code === CUSTOM) ?
          (customCampaign || 'Custom Campaign') :
          selectedCampaign,
        hasGuide
      );
    }
  }, [campaignState, campaignChanged]);

  const handleCampaignChanged = useCallback((selection: CampaignSelection, text: string, hasGuide: boolean) => {
    setCampaignState({
      selectedCampaign: text,
      selection: selection,
      hasGuide,
    });
  }, [setCampaignState]);

  const campaignPressed = useCallback(() => {
    Navigation.push<SelectCampagaignProps>(componentId, {
      component: {
        name: 'Dialog.Campaign',
        passProps: {
          selectionChanged: handleCampaignChanged,
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

  return (
    <DeckPickerStyleButton
      first
      editable
      title={!campaignState || campaignState.selection.type === 'campaign' ? t`Campaign` : t`Standalone`}
      valueLabel={campaignState?.selectedCampaign}
      onPress={campaignPressed}
      icon="book"
    />
  );
}
