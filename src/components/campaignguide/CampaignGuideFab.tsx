import React, { useCallback, useContext } from 'react';
import { Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import ActionButton from 'react-native-action-button';
import { t } from 'ttag';

import { deleteCampaign } from '@components/campaign/actions';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationConstants } from '@components/core/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';


interface Props {
  componentId: string;
  campaignId: number;
  serverCampaignId?: string;
  campaignName: string;
  removeMode: boolean;
  showEditNameDialog: () => void;
  showAddInvestigator: () => void;
  toggleRemoveInvestigator: () => void;
}

export default function CampaignGuideFab({
  campaignId, componentId, campaignName, removeMode, serverCampaignId,
  showEditNameDialog, showAddInvestigator, toggleRemoveInvestigator,
}: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { colors, shadow, typography } = useContext(StyleContext);
  const dispatch = useDispatch();

  const actuallyDeleteCampaign = useCallback(() => {
    dispatch(deleteCampaign(campaignId));
    Navigation.pop(componentId);
  }, [dispatch, componentId, campaignId]);

  const confirmDeleteCampaign = useCallback(() => {
    Alert.alert(
      t`Delete`,
      t`Are you sure you want to delete the campaign: ${campaignName}`,
      [
        { text: t`Delete`, onPress: actuallyDeleteCampaign, style: 'destructive' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [campaignName, actuallyDeleteCampaign]);
  const { bottomTabsHeight = 0 } = useNavigationConstants();
  const confirmUploadCampaign = useCallback(() => {

  }, []);

  const [fabOpen, toggleFabOpen, setFabOpen] = useFlag(false);
  const fabIcon = useCallback(() => {
    if (removeMode) {
      return <AppIcon name="check-thin" color={colors.L30} size={32} />;
    }
    return <AppIcon name="plus-thin" color={colors.L30} size={32} />;
  }, [colors, removeMode]);
  const removeInvestigatorsPressed = useCallback(() => {
    setFabOpen(false);
    toggleRemoveInvestigator();
  }, [setFabOpen, toggleRemoveInvestigator]);
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
  return (
    <ActionButton
      active={fabOpen}
      buttonColor={fabOpen ? colors.M : colors.D10}
      renderIcon={fabIcon}
      onPress={removeMode ? toggleRemoveInvestigator : toggleFabOpen}
      offsetX={s + xs}
      offsetY={bottomTabsHeight + s + xs}
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
      <ActionButton.Item
        buttonColor={colors.D20}
        textStyle={actionLabelStyle}
        textContainerStyle={actionContainerStyle}
        title={t`Edit name`}
        onPress={showEditNameDialog}
        shadowStyle={shadow.medium}
        useNativeFeedback={false}
      >
        <AppIcon name="edit" color={colors.L30} size={24} />
      </ActionButton.Item>
      { !!user && !serverCampaignId && (
        <ActionButton.Item
          buttonColor={colors.D20}
          textStyle={actionLabelStyle}
          textContainerStyle={actionContainerStyle}
          title={t`Upload campaign`}
          onPress={confirmUploadCampaign}
          shadowStyle={shadow.medium}
          useNativeFeedback={false}
        >
          <AppIcon name="world" color={colors.L30} size={34} />
        </ActionButton.Item>
      ) }
      <ActionButton.Item
        buttonColor={colors.D20}
        textStyle={actionLabelStyle}
        textContainerStyle={actionContainerStyle}
        title={t`Add investigators`}
        onPress={showAddInvestigator}
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
