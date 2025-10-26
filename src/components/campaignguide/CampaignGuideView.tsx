import React, { useCallback, useContext, useLayoutEffect, useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { t } from 'ttag';

import { updateCampaignName } from '@components/campaign/actions';
import withCampaignGuideContext, { CampaignGuideInputProps, InjectedCampaignGuideContextProps } from '@components/campaignguide/withCampaignGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import { useStopAudioOnUnmount } from '@lib/audio/narrationHelpers';
import { useAlertDialog, useCountDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import CampaignDetailTab from './CampaignDetailTab';
import UploadCampaignButton from '@components/campaign/UploadCampaignButton';
import DeleteCampaignButton from '@components/campaign/DeleteCampaignButton';
import space, { s } from '@styles/space';
import { useCampaignDeleted, useDismissOnCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import { useDeckActions } from '@data/remote/decks';
import DeckButton from '@components/deck/controls/DeckButton';
import LanguageContext from '@lib/i18n/LanguageContext';
import { getDownloadLink } from './ScenarioComponent';
import CampaignErrorView from './CampaignErrorView';
import LoadingSpinner from '@components/core/LoadingSpinner';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import useProcessedCampaign from './useProcessedCampaign';
import { useAppDispatch } from '@app/store';
import CampaignHeader from './CampaignHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';
import StyleContext from '@styles/StyleContext';

export type CampaignGuideProps = CampaignGuideInputProps & { upload?: boolean };

type Props = CampaignGuideProps & InjectedCampaignGuideContextProps;

function CampaignGuideView(props: Props & LoginStateProps) {
  const navigation = useNavigation();
  const { colors } = useContext(StyleContext);
  const [countDialog, showCountDialog] = useCountDialog();
  const { setCampaignServerId, login, upload } = props;
  const campaignData = useContext(CampaignGuideContext);
  const { lang } = useContext(LanguageContext);
  const { campaignId } = campaignData;
  const dispatch = useAppDispatch();
  const deckActions = useDeckActions();
  const updateCampaignActions = useUpdateCampaignActions();
  const setCampaignName = useCallback((name: string) => {
    dispatch(updateCampaignName(updateCampaignActions, campaignId, name));
  }, [campaignId, dispatch, updateCampaignActions]);

  const [dialog, showEditNameDialog] = useSimpleTextDialog({
    title: t`Name`,
    value: campaignData.campaign.name,
    onValueChange: setCampaignName,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: campaignData.campaign.name,
      headerRight: () => (
        <HeaderButton
          iconName="edit"
          onPress={showEditNameDialog}
          color={colors.M}
          accessibilityLabel={t`Edit Name`}
        />
      ),
    });
  }, [campaignData.campaign.name, showEditNameDialog, navigation, colors]);
  useStopAudioOnUnmount();

  const { campaignGuide, campaignState, campaign } = campaignData;
  useCampaignDeleted(campaign);
  useDismissOnCampaignDeleted(navigation, campaign);

  const [processedCampaign, processedCampaignError] = useProcessedCampaign(campaignGuide, campaignState);
  const [alertDialog, showAlert] = useAlertDialog();
  const customData = campaignGuide.campaignCustomData();
  const downloadPressed = useCallback(() => {
    const link = getDownloadLink(lang, customData);
    if (link) {
      Linking.openURL(link);
    }
  }, [customData, lang]);
  const footerButtons = useMemo(() => {
    return (
      <View style={space.paddingSideS}>
        <CampaignHeader style={space.paddingTopS} title={t`Settings`} />
        {
          !!customData && (
            <DeckButton
              icon="world"
              title={t`Download printable cards`}
              thin
              color="light_gray"
              onPress={downloadPressed}
              bottomMargin={s}
            />
          )
        }
        <UploadCampaignButton
          campaignId={campaignId}
          campaign={campaign}
          setCampaignServerId={setCampaignServerId}
          showAlert={showAlert}
          deckActions={deckActions}
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
  }, [campaign, campaignId, deckActions, customData, updateCampaignActions, upload, downloadPressed, setCampaignServerId, showAlert]);
  if (!processedCampaign) {
    if (processedCampaignError) {
      return <CampaignErrorView message={processedCampaignError} />;
    }
    return <LoadingSpinner large />;
  }
  return (
    <View style={styles.wrapper}>
      <CampaignDetailTab
        processedCampaign={processedCampaign}
        showAlert={showAlert}
        showCountDialog={showCountDialog}
        footerButtons={footerButtons}
        updateCampaignActions={updateCampaignActions}
        login={login}
      />
      { alertDialog }
      { dialog }
      { countDialog }
    </View>
  );
}

const WrappedComponent = withCampaignGuideContext<CampaignGuideProps>(
  withLoginState<Props>(CampaignGuideView, { noWrapper: true }),
  { rootView: true }
);

export default function CampaignGuideWrapper() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.Campaign'>>();
  const { campaignId, upload } = route.params;
  return <WrappedComponent campaignId={campaignId} upload={upload} />;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
