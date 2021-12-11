import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { forEach, map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { useMyProfile, useProfile, SimpleUser, UserProfile } from '@data/remote/hooks';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import StyleContext from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ArkhamButton from '@components/core/ArkhamButton';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import space, { m } from '@styles/space';
import RoundButton from '@components/core/RoundButton';
import AppIcon from '@icons/AppIcon';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';
import { FriendStatus, SearchResults } from '@data/remote/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LanguageContext from '@lib/i18n/LanguageContext';
import ArkhamLargeList from '@components/core/ArkhamLargeList';

interface FriendControls {
  type: 'friend';
  acceptRequest: (userId: string) => Promise<void>;
  rejectRequest: (userId: string) => Promise<void>;
}

interface CampaignAccessControls {
  type: 'campaign';
  hasAccess: boolean;
  inviteUser: (userId: string) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
}

export type UserControls = FriendControls | CampaignAccessControls;

interface UserItem {
  id: string;
  type: 'user';
  user: SimpleUser;
  controls?: UserControls;
}
interface HeaderItem {
  id: string;
  type: 'header';
  header: string;
}
interface ButtonItem {
  id: string;
  type: 'button';
  icon: ArkhamButtonIconType;
  title: string;
  onPress: () => void;
}
interface PlaceholderItem {
  id: string;
  type: 'placeholder';
  text: string;
}

interface PaddingItem {
  id: string;
  type: 'padding';
  padding: number;
}

export type FriendFeedItem = UserItem | HeaderItem | ButtonItem | PlaceholderItem | PaddingItem;

function FriendControlsComponent({ user, status, refetchMyProfile, acceptRequest, rejectRequest }: {
  user: SimpleUser;
  status?: FriendStatus;
  acceptRequest: (userId: string) => Promise<void>;
  rejectRequest: (userId: string) => Promise<void>;
  refetchMyProfile: () => void;
}) {
  const { colors } = useContext(StyleContext);
  const [submitting, setSubmitting] = useState<'accept' | 'reject'>();
  const onAcceptPress = useCallback(async() => {
    setSubmitting('accept');
    await acceptRequest(user.id);
    refetchMyProfile();
    setSubmitting(undefined);
  }, [acceptRequest, refetchMyProfile, user.id]);
  const onRejectPress = useCallback(async() => {
    setSubmitting('reject');
    await rejectRequest(user.id);
    refetchMyProfile();
    setSubmitting(undefined);
  }, [rejectRequest, refetchMyProfile, user.id]);

  return useMemo(() => {
    const buttons: React.ReactNode[] = [];
    if (status === FriendStatus.RECEIVED || status === FriendStatus.NONE) {
      buttons.push((
        <RoundButton onPress={onAcceptPress} disabled={!!submitting} accessibilityLabel={status === FriendStatus.RECEIVED ? t`Accept friend request` : t`Send friend request`}>
          { submitting === 'accept' ? (
            <ActivityIndicator size="small" animating color={colors.D30} />
          ) : (
            <AppIcon
              size={status === FriendStatus.RECEIVED ? 28 : 16}
              name={status === FriendStatus.RECEIVED ? 'check-thin' : 'plus-thin'}
              color={colors.D30}
            />
          ) }
        </RoundButton>
      ));
    }
    if (status && status !== FriendStatus.NONE) {
      buttons.push((
        <RoundButton onPress={onRejectPress} disabled={!!submitting} accessibilityLabel={status === FriendStatus.RECEIVED ? t`Reject friend request` : t`Revoke friend request`}>
          { submitting === 'reject' ? (
            <ActivityIndicator size="small" animating color={colors.D30} />
          ) : (
            <AppIcon size={16} name="dismiss" color={colors.D30} />
          ) }
        </RoundButton>
      ));
    }
    return (
      <>
        { map(buttons, (button, idx) => (
          <View key={idx} style={[styles.button, idx !== buttons.length - 1 ? space.marginRightM : undefined]}>
            { button }
          </View>
        )) }
      </>
    );
  }, [onAcceptPress, onRejectPress, colors, status, submitting]);
}


function AccessControlsComponent({ user, hasAccess, inviteUser, removeUser }: {
  user: SimpleUser;
  hasAccess: boolean;
  inviteUser: (userId: string) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
}) {
  const { colors } = useContext(StyleContext);
  const [submitting, setSubmitting] = useState<'invite' | 'remove'>();
  const onInvitePress = useCallback(async() => {
    setSubmitting('invite');
    await inviteUser(user.id);
    setSubmitting(undefined);
  }, [inviteUser, user.id]);
  const onRemovePress = useCallback(async() => {
    setSubmitting('remove');
    await removeUser(user.id);
    setSubmitting(undefined);
  }, [removeUser, user.id]);
  return (
    <View style={styles.button}>
      { hasAccess ? (
        <RoundButton onPress={onRemovePress} disabled={!!submitting} accessibilityLabel={t`Reject friend request`}>
          { submitting === 'remove' ? (
            <ActivityIndicator size="small" animating color={colors.D30} />
          ) : (
            <AppIcon size={16} name="dismiss" color={colors.D30} />
          ) }
        </RoundButton>
      ) : (
        <RoundButton onPress={onInvitePress} disabled={!!submitting} accessibilityLabel={t`Send friend request`}>
          { submitting === 'invite' ? (
            <ActivityIndicator size="small" animating color={colors.D30} />
          ) : (
            <AppIcon size={16} name={'plus-thin'} color={colors.D30} />
          ) }
        </RoundButton>
      ) }
    </View>
  );
}

const userRowHeight = (fontScale: number, lang: string) => {
  return m * 2 + StyleSheet.hairlineWidth + (lang === 'zh' ? 22 : 20) * fontScale;
};

function UserRow({ user, showUser, status, controls, refetchMyProfile }: {
  user: SimpleUser;
  refetchMyProfile: () => void;
  showUser?: (userId: string, handle?: string) => void;
  controls: UserControls | undefined;
  status?: FriendStatus;
}) {
  const { borderStyle, colors, fontScale, typography } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const fadeAnim = useCallback((props: any) => {
    return <Fade {...props} style={{ backgroundColor: colors.M }} duration={1000} />;
  }, [colors]);
  const onPress = useCallback(() => {
    showUser?.(user.id, user.handle);
  }, [showUser, user]);
  const controlsComponent = useMemo(() => {
    if (!controls) {
      return null;
    }
    switch (controls.type) {
      case 'friend':
        return (
          <FriendControlsComponent
            user={user}
            status={status}
            refetchMyProfile={refetchMyProfile}
            acceptRequest={controls.acceptRequest}
            rejectRequest={controls.rejectRequest}
          />
        );
      case 'campaign':
        return (
          <AccessControlsComponent
            user={user}
            hasAccess={controls.hasAccess}
            inviteUser={controls.inviteUser}
            removeUser={controls.removeUser}
          />
        );
      default:
        return null;
    }
  }, [user, status, controls, refetchMyProfile]);
  return (
    <View style={[styles.userRow, borderStyle, space.paddingM, { height: userRowHeight(fontScale, lang) }]}>
      { user.handle ? (
        <TouchableOpacity style={styles.pressable} onPress={onPress} disabled={!showUser}>
          <Text style={typography.large}>
            { user.handle }
          </Text>
        </TouchableOpacity>
      ) : (
        <Placeholder Animation={fadeAnim}>
          <PlaceholderLine noMargin style={styles.textPlaceholder} color={colors.M} />
        </Placeholder>
      ) }
      <View style={styles.controls}>
        { controlsComponent }
      </View>
    </View>
  );
}
UserRow.computeHeight = userRowHeight;

interface Props {
  componentId: string;
  userId?: string;
  handleScroll?: (...args: any[]) => void;
  searchResults?: SearchResults;
  error?: string;

  toFeed: (
    isSelf: boolean,
    profile?: UserProfile,
  ) => FriendFeedItem[]
}

export default function useFriendFeedComponent({ componentId, userId, handleScroll, error, searchResults, toFeed }: Props): [React.ReactNode, () => void] {
  const { borderStyle, colors, height, fontScale, typography } = useContext(StyleContext);
  const { userId: currentUserId } = useContext(ArkhamCardsAuthContext);
  const { lang } = useContext(LanguageContext);
  const [myProfile, loadingMyProfile, refetchMyProfile] = useMyProfile(true);
  const isSelf: boolean = (currentUserId && userId) ? currentUserId === userId : false;
  const [profile, loading, refetchProfile] = useProfile(userId, isSelf);
  const myFriendStatus = useMemo(() => {
    const status: { [uid: string]: FriendStatus } = {};
    if (myProfile) {
      forEach(myProfile.friends, u => {
        status[u.id] = FriendStatus.FRIEND;
      });
      forEach(myProfile.sentRequests, u => {
        status[u.id] = FriendStatus.SENT;
      });
      forEach(myProfile.receivedRequests, u => {
        status[u.id] = FriendStatus.RECEIVED;
      });
    }
    return status;
  }, [myProfile]);
  const showUser = useCallback((userId: string, handle?: string) => {
    Navigation.push(componentId, {
      component: {
        name: 'Friends',
        passProps: {
          userId: userId,
        },
        options: {
          topBar: {
            title: {
              text: handle ? t`${handle}'s Friends` : t`Friends`,
            },
          },
        },
      },
    });
  }, [componentId]);
  const heightItem = useCallback((item: FriendFeedItem) => {
    switch (item.type) {
      case 'user':
        return UserRow.computeHeight(fontScale, lang);
      case 'header':
        return CardSectionHeader.computeHeight({ title: item.header }, fontScale);
      case 'button':
        return ArkhamButton.computeHeight(fontScale, lang);
      case 'placeholder':
        return UserRow.computeHeight(fontScale, lang);
      case 'padding':
        return item.padding;
    }
  }, [fontScale, lang])
  const renderItem = useCallback((item: FriendFeedItem) => {
    switch (item.type) {
      case 'padding': {
        return <View style={{ height: item.padding }} />
      }
      case 'user':
        return (
          <UserRow
            key={item.id}
            user={item.user}
            refetchMyProfile={refetchMyProfile}
            controls={item.controls}
            status={item.user.id !== currentUserId ? myFriendStatus[item.user.id] || FriendStatus.NONE : undefined}
            showUser={item.user.id !== currentUserId ? showUser : undefined}
          />
        );
      case 'header':
        return (
          <CardSectionHeader key={item.id} section={{ title: item.header }} />
        );
      case 'button':
        return (
          <ArkhamButton key={item.id} onPress={item.onPress} title={item.title} icon={item.icon} />
        );
      case 'placeholder':
        return (
          <View style={[styles.placeholderRow, borderStyle, space.paddingM]}>
            <Text style={[typography.large, typography.center]}>
              { item.text }
            </Text>
          </View>
        );
    }
  }, [currentUserId, myFriendStatus, borderStyle, typography, refetchMyProfile, showUser]);
  const [refreshing, setRefreshing] = useState(false);
  const doRefresh = useCallback(async() => {
    setRefreshing(true);
    await refetchMyProfile();
    await refetchProfile();
    setRefreshing(false);
  }, [refetchMyProfile, refetchProfile]);

  const hasSearch = !!handleScroll;
  const data: FriendFeedItem[] = useMemo(() => {
    const paddingItem: PaddingItem | undefined = hasSearch ? { type: 'padding', id: 'padding', padding: SEARCH_BAR_HEIGHT } : undefined;
    return [
      ...(paddingItem ? [paddingItem] : []),
      ...toFeed(isSelf, profile),
    ];
  }, [toFeed, isSelf, profile, hasSearch]);
  const searchResultsError = searchResults?.error;
  const header = useMemo(() => {
    const spacer = Platform.OS === 'android' && <View style={styles.searchBarPadding} />;
    return (
      <>
        { spacer }
        { !!error && (
          <View style={[space.paddingM, { backgroundColor: colors.warn }]}>
            <Text style={[typography.text, typography.white]}>{ error }</Text>
          </View>
        ) }
        { !!searchResultsError && (
          <View style={[space.paddingM, { backgroundColor: colors.warn }]}>
            <Text style={[typography.text, typography.white]}>{ searchResultsError }</Text>
          </View>
        ) }
      </>
    );
  }, [colors, error, typography, searchResultsError]);

  useEffect(() => {
    setTimeout(() => doRefresh(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderHeader = useCallback(() => {
    return header;
  }, [header]);
  const isRefreshing = loading || loadingMyProfile || !!searchResults?.loading || refreshing;
  return [(
    <ArkhamLargeList
      key="friend_feed"
      noSearch={!handleScroll}
      renderHeader={handleScroll ? renderHeader : undefined}
      refreshing={isRefreshing}
      onRefresh={doRefresh}
      onScroll={handleScroll}
      data={[{ items: data }]}
      renderItem={renderItem}
      heightForItem={heightItem}
      renderSection={renderItem}
      heightForSection={heightItem}
      updateTimeInterval={100}
      groupCount={4}
      groupMinHeight={height}
    />
  ), doRefresh];
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  placeholderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBarPadding: {
    height: SEARCH_BAR_HEIGHT,
  },
  textPlaceholder: {
    height: 24,
    maxWidth: 150,
  },
  controls: {
    flexDirection: 'row',
  },
  button: {
    width: 32,
  },
  pressable: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

