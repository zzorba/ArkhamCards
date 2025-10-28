import React, { useCallback, useContext, useLayoutEffect, useMemo } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { useStopAudioOnUnmount } from '@lib/audio/narrationHelpers';
import { useAlertDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import DeleteCampaignButton from '@components/campaign/DeleteCampaignButton';
import UploadCampaignButton from '@components/campaign/UploadCampaignButton';
import ScenarioComponent from './ScenarioComponent';
import withScenarioGuideContext, { ScenarioGuideInputProps } from './withScenarioGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import { useDeckActions } from '@data/remote/decks';
import { InjectedCampaignGuideContextProps } from './withCampaignGuideContext';
import space from '@styles/space';
import ScenarioGuideContext from './ScenarioGuideContext';
import { useCampaignDeleted, useDismissOnCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import CampaignHeader from './CampaignHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import { updateCampaignName } from '@components/campaign/actions';
import { useAppDispatch } from '@app/store';

export interface StandaloneGuideProps extends ScenarioGuideInputProps {
  campaignId: CampaignId;
  upload?: boolean;
}

function StandaloneGuideView({ campaignId, setCampaignServerId, upload }: StandaloneGuideProps & InjectedCampaignGuideContextProps) {
  const { campaign } = useContext(CampaignGuideContext);
  const { processedScenario } = useContext(ScenarioGuideContext);
  useStopAudioOnUnmount();
  const [alertDialog, showAlert] = useAlertDialog();
  const deckActions = useDeckActions();
  const updateCampaignActions = useUpdateCampaignActions();
  const dispatch = useAppDispatch();
  const setCampaignName = useCallback((name: string) => {
    dispatch(updateCampaignName(updateCampaignActions, campaignId, name));
  }, [campaignId, dispatch, updateCampaignActions]);
  const navigation = useNavigation();
  useCampaignDeleted(campaign);
  useDismissOnCampaignDeleted(navigation, campaign);

  const [dialog, showEditNameDialog] = useSimpleTextDialog({
    title: t`Name`,
    value: campaign?.name || '',
    onValueChange: setCampaignName,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: campaign.name,
    });
  }, [navigation, campaign.name]);

  const footer = useMemo(() => {
    return (
      <View style={space.paddingSideS}>
        <CampaignHeader style={space.paddingTopS} title={t`Settings`} />
        <UploadCampaignButton
          campaignId={campaign.id}
          campaign={campaign}
          deckActions={deckActions}
          setCampaignServerId={setCampaignServerId}
          showAlert={showAlert}
          standalone
          upload={upload}
        />
        <DeleteCampaignButton
          actions={updateCampaignActions}
          campaignId={campaignId}
          campaign={campaign}
          showAlert={showAlert}
          standalone
        />
      </View>
    );
  }, [upload, campaignId, setCampaignServerId, showAlert, updateCampaignActions, deckActions, campaign]);

  return (
    <>
      <ScenarioComponent
        standalone
        footer={campaign && processedScenario && footer}
        onEditNamePressed={showEditNameDialog}
      />
      { alertDialog }
      { dialog }
    </>
  );
}

const WrappedComponent = withScenarioGuideContext(StandaloneGuideView);
export default function StandaloneGuideViewWrapper() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.Standalone'>>();
  const { campaignId, scenarioId } = route.params;
  return (
    <WrappedComponent
      campaignId={campaignId}
      scenarioId={scenarioId}
    />
  );
}