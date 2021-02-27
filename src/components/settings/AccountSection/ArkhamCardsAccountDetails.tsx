import React, { useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import { ngettext, msgid, t } from 'ttag';

import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import space from '@styles/space';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { useSimpleTextDialog } from '@components/deck/dialogs';
import { NavigationProps } from '@components/nav/types';
import { Navigation } from 'react-native-navigation';
import { FriendsViewProps } from '../FriendsView';
import { useUpdateHandle } from '@data/firebase/api';
import StyleContext from '@styles/StyleContext';
import { useMyProfile } from '@data/hooks';

export default function ArkhamCardsAccountDetails({ componentId }: NavigationProps) {
  const { typography } = useContext(StyleContext);
  const { user, loading } = useContext(ArkhamCardsAuthContext);
  const [profile, loadingProfile] = useMyProfile();

  const updateHandle = useUpdateHandle();
  const { dialog, showDialog } = useSimpleTextDialog({
    title: t`Account Name`,
    value: profile?.handle || '',
    onValidate: updateHandle,
    placeholder: t`Choose a handle for your account`,
  });
  const editFriendsPressed = useCallback(() => {
    if (user) {
      Navigation.push<FriendsViewProps>(componentId, {
        component: {
          name: 'Friends',
          passProps: {
            userId: user.uid,
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
  }, [componentId, user]);
  const friendCount = profile?.friends?.length || 0;
  const pendingFriendCount = profile?.receivedRequests?.length || 0;
  if (!user) {
    return (
      <View style={[space.paddingBottomS, space.paddingTopS, space.paddingSideS]}>
        <Text style={typography.text}>{t`This app works just fine without an account.\nBut signing in will allow you to sync campaigns between devices, with more features planned for the future.`}</Text>
      </View>
    );
  }
  const requestLabel = pendingFriendCount > 0 ? ngettext(msgid`${pendingFriendCount} pending request`, `${pendingFriendCount} pending requests`, pendingFriendCount) : undefined;
  const label = ngettext(msgid`${friendCount} friend`, `${friendCount} friends`, friendCount);
  return (
    <View style={[space.paddingTopS]}>
      <DeckPickerStyleButton
        icon="name"
        editable
        title={t`Account name`}
        valueLabel={loading || loadingProfile ? t`Loading` : (profile?.handle || t`Choose a handle`)}
        onPress={showDialog}
        first
      />
      <DeckPickerStyleButton
        icon="per_investigator"
        editable
        title={t`Friends`}
        valueLabel={!loading ? (requestLabel || label) : undefined}
        valueLabelDescription={!loading && requestLabel ? label : undefined}
        onPress={editFriendsPressed}
        editIcon="plus-thin"
        last
      />
      { dialog }
    </View>
  );
}
