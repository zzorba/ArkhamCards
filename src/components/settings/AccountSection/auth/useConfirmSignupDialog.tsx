import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import { useDialog } from '@components/deck/dialogs';
import space from '@styles/space';
import { useMyProfile } from '@data/remote/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import LoadingSpinner from '@components/core/LoadingSpinner';
import NewDialog from '@components/core/NewDialog';
import { useUpdateHandle } from '@data/remote/api';
import DeckButton from '@components/deck/controls/DeckButton';

export default function useConfirmSignupDialog(): [React.ReactNode, () => void] {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { typography } = useContext(StyleContext);
  const [myProfile, loadingMyProfile, refreshMyProfile] = useMyProfile(false);
  const [submitting, setSubmitting] = useState(false);
  const [liveValue, setLiveValue] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const textInputRef = useRef<TextInput>(null);
  const updateHandle = useUpdateHandle();
  const doSubmit = useCallback(async(submitValue: string) => {
    setSubmitting(true);
    const error = await updateHandle(submitValue);
    if (error) {
      setError(error);
      setSubmitting(false);
    }
    setSubmitting(false);
    refreshMyProfile();
  }, [updateHandle, setError, setSubmitting, refreshMyProfile]);
  const submitButtonPressed = useCallback(() => {
    doSubmit(liveValue);
  }, [doSubmit, liveValue]);
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const closeDialog = useCallback(() => {
    if (setVisibleRef.current) {
      setVisibleRef.current(false);
    }
  }, []);
  const content = useMemo(() => {
    if (!user || loadingMyProfile || !myProfile) {
      return (
        <View style={[styles.column, space.paddingM, styles.center]}>
          <View style={space.paddingBottomM}>
            <Text style={typography.text}>
              { t`Fetching account details...` }
            </Text>
          </View>
          <LoadingSpinner inline />
        </View>
      );
    }
    if (!myProfile.handle) {
      return (
        <View style={space.marginS}>
          <View style={[space.paddingS, space.paddingBottomM]}>
            <Text style={typography.text}>
              { t`Thanks for signing up for Arkham Cards.\n\nFirst of all, you'll need to create a handle for your account.` }
            </Text>
          </View>
          <View style={space.paddingBottomS}>
            <NewDialog.TextInput
              textInputRef={textInputRef}
              value={liveValue}
              error={error}
              disabled={submitting}
              placeholder={t`Choose a handle for your account`}
              onChangeText={setLiveValue}
              onSubmit={doSubmit}
            />
          </View>
          <DeckButton
            key="save"
            icon="check-thin"
            title={t`Save`}
            thin
            loading={submitting}
            onPress={submitButtonPressed}
          />
          <View style={[space.paddingS, space.paddingTopM]}>
            <Text style={typography.text}>
              { t`People will be able to search for friends using their handle so you can join their campaigns.` }
            </Text>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.column}>
        <View style={space.paddingS}>
          <Text style={[typography.text, space.paddingBottomM]}>
            { t`Now that you are signed in, you should have access to your saved campaigns.` }
            { '\n\n' }
            { t`Campaigns can now be 'uploaded' so they can be synced between devices or shared with friends.` }
          </Text>
          <DeckButton
            key="save"
            icon="check-thin"
            title={t`Okay`}
            thin
            onPress={closeDialog}
          />
        </View>
      </View>
    );
  }, [typography, doSubmit, setLiveValue, submitButtonPressed, closeDialog, submitting, liveValue, textInputRef, error, loadingMyProfile, user, myProfile]);
  const { dialog, showDialog, setVisible } = useDialog({
    title: t`Welcome`,
    alignment: 'center',
    content,
    allowDismiss: !!myProfile?.handle,
  });
  setVisibleRef.current = setVisible;

  const maybeShowDialog = useCallback(() => {
    setTimeout(() => {
      showDialog();
    }, 250);
  }, [showDialog]);
  return [dialog, maybeShowDialog];
}


const styles = StyleSheet.create({
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
});
