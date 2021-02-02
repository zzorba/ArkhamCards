import React, { useCallback, useContext } from 'react';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { t } from 'ttag';

import { isTablet, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useFlag, useNavigationConstants } from '@components/core/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { uploadCampaign } from '@components/campaignguide/actions';
import AppIcon from '@icons/AppIcon';
import { useCreateCampaignRequest } from '@data/firebase/api';
import { CampaignId } from '@actions/types';
import useNetworkStatus from '@components/core/useNetworkStatus';


interface Props {
  campaignId: CampaignId;
  guided: boolean;
  setCampaignServerId: (serverId: string) => void;
  showEditNameDialog: () => void;
}

export default function CampaignGuideFab({ campaignId, guided, showEditNameDialog, setCampaignServerId }: Props) {
  const campaign = useCampaign(campaignId);
  const [{ isConnected }] = useNetworkStatus();
  const { user } = useContext(ArkhamCardsAuthContext);
  const { colors, shadow, typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const [fabOpen, toggleFabOpen, setFabOpen] = useFlag(false);

  const createServerCampaign = useCreateCampaignRequest();
  const confirmUploadCampaign = useCallback(async() => {
    if (campaign && user) {
      setFabOpen(false);
      try {
        dispatch(uploadCampaign(user, createServerCampaign, setCampaignServerId, campaign, guided));
      } catch (e) {
        // TODO(error handling)
      }
    }
  }, [dispatch, createServerCampaign, setCampaignServerId, setFabOpen, guided, user, campaign]);

  const fabIcon = useCallback(() => {
    if (fabOpen) {
      return <AppIcon name="plus-thin" color={colors.L30} size={32} />;

    }
    return <AppIcon name="edit" color={colors.L30} size={24} />;
  }, [colors, fabOpen]);
  const editNamePressed = useCallback(() => {
    setFabOpen(false);
    showEditNameDialog();
  }, [setFabOpen, showEditNameDialog]);
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
  return (
    <ActionButton
      active={fabOpen}
      onReset={onReset}
      buttonColor={fabOpen ? colors.M : colors.D10}
      renderIcon={fabIcon}
      onPress={toggleFabOpen}
      offsetX={s + xs}
      offsetY={(isTablet || Platform.OS === 'ios' ? bottomTabsHeight : 0) + s + xs}
      shadowStyle={shadow.large}
      fixNativeFeedbackRadius
    >
      { !!user && !campaignId.serverId && (
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
    </ActionButton>
  );
}
