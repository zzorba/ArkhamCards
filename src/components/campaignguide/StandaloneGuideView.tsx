import React, { useCallback, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import { CampaignId, StandaloneId } from '@actions/types';
import { deleteCampaign } from '@components/campaign/actions';
import BasicButton from '@components/core/BasicButton';
import { NavigationProps } from '@components/nav/types';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import ScenarioView from './ScenarioView';
import StyleContext from '@styles/StyleContext';
import { useAlertDialog } from '@components/deck/dialogs';

export interface StandaloneGuideProps {
  campaignId: CampaignId;
  standaloneId: StandaloneId;
}
export default function StandaloneGuideView({ campaignId, standaloneId, componentId }: StandaloneGuideProps & NavigationProps) {
  const { colors } = useContext(StyleContext);
  useStopAudioOnUnmount();
  const dispatch = useDispatch();
  const handleDelete = useCallback(() => {
    dispatch(deleteCampaign(campaignId));
    Navigation.pop(componentId);
  }, [campaignId, componentId, dispatch]);
  const [alertDialog, showAlert] = useAlertDialog();
  const deletePressed = useCallback(() => {
    showAlert(
      t`Delete`,
      t`Are you sure you want to delete this standalone?`,
      [
        { text: t`Cancel`, style: 'cancel' },
        { text: t`Delete`, onPress: handleDelete, style: 'destructive' },
      ],
    );
  }, [handleDelete, showAlert]);

  return (
    <>
      <ScenarioView
        componentId={componentId}
        campaignId={campaignId.campaignId}
        scenarioId={standaloneId.scenarioId}
        standalone
        footer={<BasicButton onPress={deletePressed} title={t`Delete standalone`} color={colors.warn} />}
      />
      { alertDialog }
    </>
  );
}