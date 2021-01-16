import React, { useCallback, useContext } from 'react';
import { Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { t } from 'ttag';

import { deleteCampaign } from '@components/campaign/actions';
import { isTablet, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationConstants } from '@components/core/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { uploadCampaign } from '@components/campaignguide/actions';
import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';
import { useCreateCampaignRequest, useDeleteCampaignRequest } from '@data/firebase/api';
import { Campaign, CampaignId } from '@actions/types';
import useNetworkStatus from '@components/core/useNetworkStatus';


interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaign?: Campaign;
  serverCampaignId?: string;
  campaignName: string;
  removeMode: boolean;
  guided: boolean;
  setSelectedTab: (tab: number) => void;
  showEditNameDialog: () => void;
  showAddInvestigator: () => void;
  toggleRemoveInvestigator: () => void;
}

export default function CampaignGuideFab({
  campaignId, componentId, campaignName, removeMode, serverCampaignId, guided,
  showEditNameDialog, showAddInvestigator, toggleRemoveInvestigator, setSelectedTab,
}: Props) {
  const [{ isConnected }] = useNetworkStatus();
  const { user } = useContext(ArkhamCardsAuthContext);
  const { colors, shadow, typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const [fabOpen, toggleFabOpen, setFabOpen] = useFlag(false);

  const deleteServerCampaign = useDeleteCampaignRequest();
  const createServerCampaign = useCreateCampaignRequest();

  const actuallyDeleteCampaign = useCallback(() => {
    dispatch(deleteCampaign(campaignId));
    if (serverCampaignId && user) {
      deleteServerCampaign(serverCampaignId);
    }
    Navigation.pop(componentId);
  }, [dispatch, componentId, campaignId, deleteServerCampaign, user, serverCampaignId]);
  const confirmDeleteCampaign = useCallback(() => {
    setFabOpen(false);
    Alert.alert(
      t`Delete`,
      t`Are you sure you want to delete the campaign: ${campaignName}`,
      [
        { text: t`Delete`, onPress: actuallyDeleteCampaign, style: 'destructive' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [campaignName, actuallyDeleteCampaign, setFabOpen]);
  const confirmUploadCampaign = useCallback(async() => {
    setFabOpen(false);
    try {
      const serverId = await createServerCampaign();
      dispatch(uploadCampaign(campaignId.campaignId, serverId, guided));
    } catch (e) {
      // TODO(error handling)
    }
  }, [dispatch, campaignId, createServerCampaign, setFabOpen, guided]);

  const fabIcon = useCallback(() => {
    if (removeMode) {
      return <AppIcon name="check-thin" color={colors.L30} size={32} />;
    }
    return <AppIcon name="plus-thin" color={colors.L30} size={32} />;
  }, [colors, removeMode]);
  const editNamePressed = useCallback(() => {
    setFabOpen(false);
    showEditNameDialog();
  }, [setFabOpen, showEditNameDialog]);
  const removeInvestigatorsPressed = useCallback(() => {
    setFabOpen(false);
    setSelectedTab(0);
    toggleRemoveInvestigator();
  }, [setFabOpen, setSelectedTab, toggleRemoveInvestigator]);

  const addInvestigatorsPressed = useCallback(() => {
    setFabOpen(false);
    setSelectedTab(0);
    showAddInvestigator();
  }, [setFabOpen, setSelectedTab, showAddInvestigator]);
  const actionLabelStyle = {
    ...typography.small,
    color: colors.L30,
    paddingTop: 5,
    paddingLeft: s,
    paddingRight: s,
  };
  const actionContainerStyle = {
    backgroundColor: colors.D20,
    borderRadius: 16,
    borderWidth: 0,
    minHeight: 32,
    marginTop: -3,
  };
  const disabledActionContainerStyle = {
    backgroundColor: colors.D10,
    borderRadius: 16,
    borderWidth: 0,
    minHeight: 32,
    marginTop: -3,
  };
  const onReset = useCallback(() => setFabOpen(false), [setFabOpen]);
  const { bottomTabsHeight = 0 } = useNavigationConstants();
  if (removeMode) {
    return (
      <ActionButton
        active={fabOpen}
        buttonColor={fabOpen ? colors.M : colors.D10}
        renderIcon={fabIcon}
        onPress={toggleRemoveInvestigator}
        offsetX={s + xs}
        offsetY={(isTablet ? bottomTabsHeight : 0) + s + xs}
        shadowStyle={shadow.large}
        fixNativeFeedbackRadius
      />
    );
  }
  return (
    <ActionButton
      active={fabOpen}
      onReset={onReset}
      buttonColor={fabOpen ? colors.M : colors.D10}
      renderIcon={fabIcon}
      onPress={removeMode ? toggleRemoveInvestigator : toggleFabOpen}
      offsetX={s + xs}
      offsetY={(isTablet ? bottomTabsHeight : 0) + s + xs}
      shadowStyle={shadow.large}
      fixNativeFeedbackRadius
    >
      <ActionButton.Item
        buttonColor={colors.D20}
        textStyle={actionLabelStyle}
        textContainerStyle={actionContainerStyle}
        title={t`Delete campaign`}
        onPress={confirmDeleteCampaign}
        shadowStyle={shadow.medium}
        useNativeFeedback={false}
      >
        <AppIcon name="delete" color={colors.L30} size={34} />
      </ActionButton.Item>
      { !!user && !serverCampaignId && guided && (
        <ActionButton.Item
          buttonColor={isConnected ? colors.D20 : colors.M}
          textStyle={actionLabelStyle}
          textContainerStyle={isConnected ? actionContainerStyle : disabledActionContainerStyle}
          title={isConnected ? t`Upload campaign` : t`Upload campaign (network required)`}
          onPress={isConnected ? confirmUploadCampaign : undefined}
          shadowStyle={shadow.medium}
          useNativeFeedback={false}
        >
          <MaterialIcons name="backup" color={isConnected ? colors.L30 : colors.L20} size={34} />
        </ActionButton.Item>
      ) }
      <ActionButton.Item
        buttonColor={colors.D20}
        textStyle={actionLabelStyle}
        textContainerStyle={actionContainerStyle}
        title={t`Edit name`}
        onPress={editNamePressed}
        shadowStyle={shadow.medium}
        useNativeFeedback={false}
      >
        <AppIcon name="edit" color={colors.L30} size={24} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor={colors.D20}
        textStyle={actionLabelStyle}
        textContainerStyle={actionContainerStyle}
        title={t`Add investigators`}
        onPress={addInvestigatorsPressed}
        shadowStyle={shadow.medium}
        useNativeFeedback={false}
      >
        <ArkhamIcon name="per_investigator" color={colors.L30} size={28} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor={colors.D20}
        textStyle={actionLabelStyle}
        textContainerStyle={actionContainerStyle}
        title={t`Remove investigators`}
        onPress={removeInvestigatorsPressed}
        shadowStyle={shadow.medium}
        useNativeFeedback={false}
      >
        <AppIcon name="delete" color={colors.L30} size={34} />
      </ActionButton.Item>
    </ActionButton>
  );
}
