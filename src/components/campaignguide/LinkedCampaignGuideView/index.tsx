import React, { useCallback, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import useTabView from '@components/core/useTabView';
import { updateCampaignName } from '@components/campaign/actions';
import { useSingleCampaignGuideData } from '@components/campaignguide/contextHelper';
import { useCampaign } from '@data/hooks';
import useCampaignGuideContextFromActions from '@components/campaignguide/useCampaignGuideContextFromActions';
import { useStopAudioOnUnmount } from '@lib/audio/narrationHelpers';
import { useAlertDialog, useCountDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import { useCampaignLinkHelper } from './useCampaignLinkHelper';
import CampaignDetailTab from '../CampaignDetailTab';
import UploadCampaignButton from '@components/campaign/UploadCampaignButton';
import DeleteCampaignButton from '@components/campaign/DeleteCampaignButton';
import space from '@styles/space';
import { useCampaignDeleted, useDismissOnCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import { useDeckActions } from '@data/remote/decks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import CampaignErrorView from '@components/campaignguide/CampaignErrorView';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import { useLinkedCampaignId } from '@components/campaign/hooks';
import useProcessedCampaign from '../useProcessedCampaign';
import { useAppDispatch } from '@app/store';
import CampaignHeader from '../CampaignHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';
import StyleContext from '@styles/StyleContext';

export interface LinkedCampaignGuideProps {
  campaignId: CampaignId;
  campaignIdA: CampaignId;
  campaignIdB: CampaignId;
  upload?: boolean;
}

function LinkedCampaignGuideView(props: LoginStateProps) {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.LinkedCampaign'>>();
  const navigation = useNavigation();
  const upload = route.params.upload;
  const { login } = props;
  const [countDialog, showCountDialog] = useCountDialog();
  const [{ campaignId, campaignIdA, campaignIdB }, setCampaignLinkedServerId, uploadingCampaign] = useLinkedCampaignId({
    campaignId: route.params.campaignId,
    campaignIdA: route.params.campaignIdA,
    campaignIdB: route.params.campaignIdB,
  });
  const dispatch = useAppDispatch();
  const deckActions = useDeckActions();
  const updateCampaignActions = useUpdateCampaignActions();
  useStopAudioOnUnmount();
  const campaign = useCampaign(campaignId, true);
  useCampaignDeleted(campaign);
  useDismissOnCampaignDeleted(navigation, campaign);
  const campaignName = campaign?.name || '';
  const [campaignDataA] = useSingleCampaignGuideData(campaignIdA, true);
  const { colors } = useContext(StyleContext);
  const [campaignDataB] = useSingleCampaignGuideData(campaignIdB, true);

  const setCampaignName = useCallback((name: string) => {
    dispatch(updateCampaignName(updateCampaignActions, campaignId, name));
  }, [campaignId, dispatch, updateCampaignActions]);
  const [dialog, showEditNameDialog] = useSimpleTextDialog({
    title: t`Name`,
    value: campaignName,
    onValueChange: setCampaignName,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: campaignName,
      headerRight: () => <HeaderButton iconName="edit" color={colors.M} onPress={showEditNameDialog} accessibilityLabel={t`Edit name`} />,
    });
  }, [campaignName, navigation, colors, showEditNameDialog]);

  const contextA = useCampaignGuideContextFromActions(campaignIdA, deckActions, updateCampaignActions, campaignDataA);
  const contextB = useCampaignGuideContextFromActions(campaignIdB, deckActions, updateCampaignActions, campaignDataB);
  // console.log(`contextA: ${!!contextA}, contextA.campaignGuide: ${!!contextA?.campaignGuide}, contextA.campaignState: ${!!contextA?.campaignState}`);
  // console.log(`contextB: ${!!contextB}, contextB.campaignGuide: ${!!contextB?.campaignGuide}, contextB.campaignState: ${!!contextB?.campaignState}`);
  const [processedCampaignA, processedCampaignAError] = useProcessedCampaign(contextA?.campaignGuide, contextA?.campaignState);
  const [processedCampaignB, processedCampaignBError] = useProcessedCampaign(contextB?.campaignGuide, contextB?.campaignState);
  // console.log(`processedCampaignA: ${!!processedCampaignA}, processedCampaignB: ${!!processedCampaignB}`);

  const setSelectedTabRef = useRef<((index: number) => void) | undefined>(undefined);
  const [showCampaignScenarioA, showCampaignScenarioB, displayLinkScenarioCount] = useCampaignLinkHelper({
    campaignA: processedCampaignA,
    campaignDataA: contextA,
    campaignB: processedCampaignB,
    campaignDataB: contextB,
    setSelectedTab: setSelectedTabRef.current,
  });
  const [alertDialog, showAlert] = useAlertDialog();
  const footerButtons = useMemo(() => {
    return (
      <View style={space.paddingSideS}>
        <CampaignHeader style={space.paddingTopS} title={t`Settings`} />
        <UploadCampaignButton
          campaignId={campaignId}
          campaign={campaign}
          setCampaignLinkedServerId={setCampaignLinkedServerId}
          setCampaignServerId={undefined}
          deckActions={deckActions}
          showAlert={showAlert}
          upload={upload}
        />
        <DeleteCampaignButton
          actions={updateCampaignActions}
          campaignId={campaignId}
          campaign={campaign}
          showAlert={showAlert}
        />
      </View>
    );
  }, [showAlert, setCampaignLinkedServerId, updateCampaignActions, campaign, deckActions, campaignId, upload]);

  const campaignATab = useMemo(() => {
    if (!campaignDataA) {
      return null;
    }
    if (!processedCampaignA || !contextA || processedCampaignAError) {
      return {
        key: 'campaignA',
        title: campaignDataA.campaignGuide.campaignName(),
        node: (
          <SafeAreaView key="campaignA" style={styles.wrapper}>
            { processedCampaignAError ? <CampaignErrorView message={processedCampaignAError} /> : <LoadingSpinner large /> }
          </SafeAreaView>
        ),
      };
    }
    return {
      key: 'campaignA',
      title: contextA.campaignGuide.campaignName(),
      node: (
        <SafeAreaView key="campaignA" style={styles.wrapper}>
          <CampaignGuideContext.Provider value={contextA}>
            <CampaignDetailTab
              processedCampaign={processedCampaignA}
              showLinkedScenario={showCampaignScenarioB}
              showAlert={showAlert}
              showCountDialog={showCountDialog}
              displayLinkScenarioCount={displayLinkScenarioCount}
              footerButtons={footerButtons}
              updateCampaignActions={updateCampaignActions}
              login={login}
            />
          </CampaignGuideContext.Provider>
        </SafeAreaView>
      ),
    };
  }, [campaignDataA, processedCampaignA, processedCampaignAError, contextA,
    displayLinkScenarioCount, footerButtons, updateCampaignActions,
    login, showCampaignScenarioB, showCountDialog, showAlert]);
  const campaignBTab = useMemo(() => {
    if (!campaignDataB) {
      return null;
    }
    if (!processedCampaignB || !contextB || processedCampaignBError) {
      return {
        key: 'campaignB',
        title: campaignDataB.campaignGuide.campaignName(),
        node: (
          <SafeAreaView key="campaignB" style={styles.wrapper}>
            { processedCampaignBError ? <CampaignErrorView message={processedCampaignBError} /> : <LoadingSpinner large /> }
          </SafeAreaView>
        ),
      };
    }
    return {
      key: 'campaignB',
      title: contextB.campaignGuide.campaignName(),
      node: (
        <SafeAreaView key="campaignB" style={styles.wrapper}>
          <CampaignGuideContext.Provider value={contextB}>
            <CampaignDetailTab
              processedCampaign={processedCampaignB}
              showLinkedScenario={showCampaignScenarioA}
              showAlert={showAlert}
              showCountDialog={showCountDialog}
              displayLinkScenarioCount={displayLinkScenarioCount}
              updateCampaignActions={updateCampaignActions}
              login={login}
            />
          </CampaignGuideContext.Provider>
        </SafeAreaView>
      ),
    };
  }, [campaignDataB, processedCampaignB, processedCampaignBError, contextB, displayLinkScenarioCount,
    updateCampaignActions, showCampaignScenarioA, showCountDialog, showAlert, login]);
  const tabs = useMemo(() => {
    if (!campaignATab || !campaignBTab) {
      return [];
    }
    return [campaignATab, campaignBTab];
  }, [campaignATab, campaignBTab]);
  const [tabView, setSelectedTab] = useTabView({ tabs });
  setSelectedTabRef.current = setSelectedTab;

  if (!campaign && campaignId.serverId) {
    return (
      <LoadingSpinner large message={uploadingCampaign ? t`Uploading campaign` : undefined} />
    );
  }
  return (
    <View style={styles.wrapper}>
      { tabView }
      { alertDialog }
      { dialog }
      { countDialog }
    </View>
  );
}

export default withLoginState(LinkedCampaignGuideView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
