import React, { useCallback, useContext } from 'react';
import { Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import { StandaloneId } from '@actions/types';
import { deleteCampaign } from '@components/campaign/actions';
import BasicButton from '@components/core/BasicButton';
import { NavigationProps } from '@components/nav/types';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import ScenarioView from './ScenarioView';
import StyleContext from '@styles/StyleContext';

export interface StandaloneGuideProps {
  campaignId: number;
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

  const deletePressed = useCallback(() => {
    Alert.alert(
      t`Delete`,
      t`Are you sure you want to delete this standalone?`,
      [
        { text: t`Delete`, onPress: handleDelete, style: 'destructive' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [handleDelete]);

  return (
    <ScenarioView
      componentId={componentId}
      campaignId={campaignId}
      scenarioId={standaloneId.scenarioId}
      standalone
      footer={<BasicButton onPress={deletePressed} title={t`Delete standalone`} color={colors.warn} />}
    />
  );
}