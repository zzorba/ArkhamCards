import React, { useCallback, useMemo, useRef, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import useTabView from '@components/core/useTabView';
import { updateCampaignName } from '@components/campaign/actions';
import { useSingleCampaignGuideData } from '@components/campaignguide/contextHelper';
import { NavigationProps } from '@components/nav/types';
import { useCampaign } from '@data/hooks';
import { useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import useCampaignGuideContextFromActions from '@components/campaignguide/useCampaignGuideContextFromActions';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import { useAlertDialog, useCountDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import { useCampaignLinkHelper } from './useCampaignLinkHelper';
import CampaignDetailTab from '../CampaignDetailTab';
import UploadCampaignButton from '@components/campaign/UploadCampaignButton';
import DeleteCampaignButton from '@components/campaign/DeleteCampaignButton';
import space from '@styles/space';
import { useCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import { useDeckActions } from '@data/remote/decks';
import StyleContext from '@styles/StyleContext';
import LoadingSpinner from '@components/core/LoadingSpinner';
import CampaignErrorView from '@components/campaignguide/CampaignErrorView';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import { useLinkedCampaignId } from '@components/campaign/hooks';

export interface LinkedCampaignGuideProps {
  campaignId: CampaignId;
  campaignIdA: CampaignId;
  campaignIdB: CampaignId;
  upload?: boolean;
}

type Props = LinkedCampaignGuideProps & NavigationProps & LoginStateProps;

function LinkedCampaignGuideView(props: Props) {
  const { componentId, login, upload } = props;
  const [countDialog, showCountDialog] = useCountDialog();
  const [{ campaignId, campaignIdA, campaignIdB }, setCampaignLinkedServerId, uploadingCampaign] = useLinkedCampaignId({
    campaignId: props.campaignId,
    campaignIdA: props.campaignIdA,
    campaignIdB: props.campaignIdB,
  });
  const { typography } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const dispatch = useDispatch();
  const deckActions = useDeckActions();
  const updateCampaignActions = useUpdateCampaignActions();
  useStopAudioOnUnmount();
  const campaign = useCampaign(campaignId, true);
  useCampaignDeleted(componentId, campaign);
  const campaignName = campaign?.name || '';
  const [campaignDataA] = useSingleCampaignGuideData(campaignIdA, investigators, true);
  const [campaignDataB] = useSingleCampaignGuideData(campaignIdB, investigators, true);
  const setCampaignName = useCallback((name: string) => {
    dispatch(updateCampaignName(updateCampaignActions, campaignId, name));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, updateCampaignActions, componentId]);

  const [dialog, showEditNameDialog] = useSimpleTextDialog({
    title: t`Name`,
    value: campaignName,
    onValueChange: setCampaignName,
  });

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);

  const contextA = useCampaignGuideContextFromActions(campaignIdA, deckActions, updateCampaignActions, campaignDataA);
  const contextB = useCampaignGuideContextFromActions(campaignIdB, deckActions, updateCampaignActions, campaignDataB);
  // console.log(`contextA: ${!!contextA}, contextA.campaignGuide: ${!!contextA?.campaignGuide}, contextA.campaignState: ${!!contextA?.campaignState}`);
  // console.log(`contextB: ${!!contextB}, contextB.campaignGuide: ${!!contextB?.campaignGuide}, contextB.campaignState: ${!!contextB?.campaignState}`);
  const [processedCampaignA, processedCampaignAError] = useMemo(() => {
    if (!contextA?.campaignGuide || !contextA?.campaignState) {
      return [undefined, undefined];
    }
    return contextA.campaignGuide.processAllScenarios(contextA.campaignState);
  }, [contextA]);
  const [processedCampaignB, processedCampaignBError] = useMemo(() => {
    if (!contextB?.campaignGuide || !contextB?.campaignState) {
      return [undefined, undefined];
    }
    return contextB.campaignGuide.processAllScenarios(contextB.campaignState);
  }, [contextB]);
  // console.log(`processedCampaignA: ${!!processedCampaignA}, processedCampaignB: ${!!processedCampaignB}`);

  const setSelectedTabRef = useRef<((index: number) => void) | undefined>(undefined);
  const [showCampaignScenarioA, showCampaignScenarioB, displayLinkScenarioCount] = useCampaignLinkHelper({
    componentId,
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
        <View style={[space.paddingBottomS, space.paddingTopS]}>
          <Text style={[typography.large, typography.center, typography.light]}>
            { `— ${t`Settings`} —` }
          </Text>
        </View>
        <UploadCampaignButton
          componentId={componentId}
          campaignId={campaignId}
          campaign={campaign}
          setCampaignLinkedServerId={setCampaignLinkedServerId}
          setCampaignServerId={undefined}
          deckActions={deckActions}
          showAlert={showAlert}
          upload={upload}
        />
        <DeleteCampaignButton
          componentId={componentId}
          actions={updateCampaignActions}
          campaignId={campaignId}
          campaign={campaign}
          showAlert={showAlert}
        />
      </View>
    );
  }, [showAlert, setCampaignLinkedServerId, updateCampaignActions, typography, campaign, deckActions, componentId, campaignId, upload]);

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
              componentId={componentId}
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
    componentId, displayLinkScenarioCount, footerButtons, updateCampaignActions,
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
              componentId={componentId}
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
  }, [campaignDataB, processedCampaignB, processedCampaignBError, contextB, componentId, displayLinkScenarioCount,
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

export default withLoginState<Props>(LinkedCampaignGuideView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
