import React, { useCallback, useEffect, useState } from 'react';

import { t } from 'ttag';

import { CampaignSelection } from '@components/campaign/SelectCampaignDialog';
import { CUSTOM } from '@actions/types';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { useNavigation } from '@react-navigation/native';

interface Props {
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

export default function CampaignSelector({ campaignChanged }: Props) {
  const navigation = useNavigation();
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
    navigation.navigate('Dialog.Campaign', {
      selectionChanged: handleCampaignChanged,
    });
  }, [navigation, handleCampaignChanged]);

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
