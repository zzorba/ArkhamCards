import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { ngettext, msgid, t } from 'ttag';

import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import space from '@styles/space';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { ShowAlert, useSimpleTextDialog } from '@components/deck/dialogs';
import { NavigationProps } from '@components/nav/types';
import { Navigation } from 'react-native-navigation';
import { FriendsViewProps } from '@components/social/FriendsView';
import StyleContext from '@styles/StyleContext';
import { useMyProfile } from '@data/remote/hooks';
import { useComponentDidAppear } from '@components/core/hooks';
import LanguageContext from '@lib/i18n/LanguageContext';
import ArkhamCardsLoginButton from './auth/ArkhamCardsLoginButton';
import { useUpdateHandleMutation } from '@generated/graphql/apollo-schema';

interface Props {
  showAlert: ShowAlert;
}
export default function ArkhamCardsAccountDetails({ componentId, showAlert }: NavigationProps & Props) {
  const { typography } = useContext(StyleContext);
  const { userId, loading } = useContext(ArkhamCardsAuthContext);
  const { lang } = useContext(LanguageContext);
  const [profile, loadingProfile, refresh] = useMyProfile(false);

  useComponentDidAppear(() => {
    refresh();
  }, componentId, [refresh]);

  const [updateHandle] = useUpdateHandleMutation();
  const [dialog, showDialog] = useSimpleTextDialog({
    title: t`Account Name`,
    value: profile?.handle || '',
    onValidate: async (handle: string) => {
      const result = await updateHandle({ variables: { handle } });
      if (result.errors) {
        return t`Handle is already taken`;
      }
      return undefined;
    },
    placeholder: t`Choose a handle for your account`,
  });
  const editFriendsPressed = useCallback(() => {
    if (userId) {
      Navigation.push<FriendsViewProps>(componentId, {
        component: {
          name: 'Friends',
          passProps: {
            userId,
          },
          options: {
            topBar: {
              title: {
                text: t`Your Friends`,
              },
            },
          },
        },
      });
    }
  }, [componentId, userId]);
  const friendCount = profile?.friends?.length || 0;
  const pendingFriendCount = profile?.receivedRequests?.length || 0;
  const accountNameLabel = useMemo(() => {
    if (loading) {
      return t`Loading account`;
    }
    if (profile?.handle) {
      return profile.handle;
    }
    if (loadingProfile) {
      return t`Loading`;
    }
    return t`Choose a handle`;
  }, [loading, loadingProfile, profile])
  const requestLabel = pendingFriendCount > 0 ? ngettext(msgid`${pendingFriendCount} pending request`, `${pendingFriendCount} pending requests`, pendingFriendCount) : undefined;
  const label = ngettext(msgid`${friendCount} friend`, `${friendCount} friends`, friendCount);
  return (
    <View style={[space.paddingTopS]}>
      { !userId ? (
        <View style={[space.paddingBottomS, space.paddingTopS, space.paddingSideS]}>
          <Text style={typography.text}>
            {
              lang === 'en' ?
                t`Signing into Arkham Cards will let you backup your campaigns between your devices and share in-progress campaigns with other friends.` :
                t`This app works just fine without an account.\nBut signing in will allow you to sync campaigns between devices, with more features planned for the future.`
            }
          </Text>
        </View>
      ) : (
        <>
          <DeckPickerStyleButton
            icon="name"
            editable
            title={t`Account name`}
            valueLabel={accountNameLabel}
            onPress={showDialog}
            first
          />
          <DeckPickerStyleButton
            icon="per_investigator"
            editable={!loading}
            title={t`Friends`}
            valueLabel={!loading ? (requestLabel || label) : undefined}
            valueLabelDescription={!loading && requestLabel ? label : undefined}
            onPress={profile?.handle ? editFriendsPressed : showDialog}
            editIcon="plus-button"
            last
          />
        </>
      ) }
      <ArkhamCardsLoginButton showAlert={showAlert} handle={accountNameLabel} />
      { dialog }
    </View>
  );
}
