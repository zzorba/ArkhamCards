import React, { useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { filter, map } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
// @ts-ignore TS7016
import ProgressBar from 'react-native-progress/Bar';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import { useDialog } from '@components/deck/dialogs';
import space from '@styles/space';
import { useToggles } from '@components/core/hooks';
import { AppState, getCampaigns } from '@reducers';
import { uploadCampaign } from '@components/campaignguide/actions';
import { useCreateCampaignActions } from '@data/remote/campaigns';
import { useDeckActions } from '@data/remote/decks';
import { useMyProfile } from '@data/remote/hooks';

interface UploadState {
  total: number;
  finished: number;
  completed: boolean;
}

type UploadDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export default function useConfirmSignupDialog(user?: FirebaseAuthTypes.User): [React.ReactNode, () => void] {
  const localCampaigns = useSelector(getCampaigns);
  const dispatch: UploadDispatch = useDispatch();
  const { colors, typography, width } = useContext(StyleContext);
  const [noUpload,, setNoUpload] = useToggles({});
  const [myProfile, loadingMyProfile, refetchMyProfile] = useMyProfile(true);
  /*
  const content = useMemo(() => {
    if (uploadState) {
      return (
        <View style={[styles.column, space.paddingBottomS, styles.center]}>
          <View style={space.paddingS}>
            <Text style={typography.large}>{t`Uploading`}</Text>
          </View>
          <View style={[styles.row, space.paddingBottomS]}>
            <ProgressBar progress={uploadState.finished / uploadState.total} color={colors.D30} width={width * 0.6} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.column}>
        <View style={space.paddingS}>
          <Text style={typography.text}>
            { t`Campaigns can be uploaded to your Arkham Cards account.` }
            { '\n' }
            { t`Uploaded campaigns will be synced between devices.` }
          </Text>
        </View>
        { map(localCampaigns, (campaign, idx) => (
          <CampaignRow
            key={campaign.uuid}
            campaign={campaign}
            value={!!noUpload[campaign.uuid]}
            onChange={setNoUpload}
            last={idx === localCampaigns.length - 1}
          />
        )) }
      </View>
    );
  }, [localCampaigns, setNoUpload, noUpload, typography, uploadState, width, colors]);
  const createCampaignActions = useCreateCampaignActions();
  const deckActions = useDeckActions();
  const uploadCampaigns = useCallback(async() => {
    if (user) {
      const uploadCampaigns = filter(localCampaigns, c => !noUpload[c.uuid]);
      updateUploadState({ type: 'start', total: uploadCampaigns.length });
      await Promise.all(
        map(uploadCampaigns, c => {
          return dispatch(uploadCampaign(createCampaignActions, deckActions, c.id)).then(
            () => updateUploadState({ type: 'finish' }),
            () => updateUploadState({ type: 'error' }),
          );
        }),
      );
    }
    return true;
  }, [user, localCampaigns, noUpload, dispatch, updateUploadState, createCampaignActions, deckActions]);
  const uploading = !!uploadState?.completed;
  const { dialog, showDialog, setVisible } = useDialog({
    title: t`Upload campaigns`,
    alignment: 'center',
    content,
    allowDismiss: false,
    confirm: {
      title: uploading ? t`Uploading` : t`Upload`,
      onPress: uploadCampaigns,
      loading: uploading,
    },
    dismiss: {
      title: t`Later`,
    },
  });

  useEffect(() => {
    if (uploadState && uploadState.completed) {
      setVisible(false);
    }
  }, [setVisible, uploadState]);
  const maybeShowDialog = useCallback(() => {
    if (localCampaigns.length) {
      setTimeout(() => {
        showDialog();
      }, 500);
    }
  }, [localCampaigns, showDialog]);
*/
  return [null, () => {}];
}


const styles = StyleSheet.create({
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
});
