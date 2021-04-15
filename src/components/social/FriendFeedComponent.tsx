import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItemInfo, Platform, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { forEach, map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { useMyProfile, useProfile, SimpleUser, UserProfile } from '@data/remote/hooks';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import StyleContext from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ArkhamButton from '@components/core/ArkhamButton';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import space from '@styles/space';
import RoundButton from '@components/core/RoundButton';
import AppIcon from '@icons/AppIcon';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';
import { FriendStatus, SearchResults } from '@data/remote/api';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
  type: 'user';
  user: SimpleUser;
  controls?: UserControls;
}
interface HeaderItem {
  type: 'header';
  header: string;
}
interface ButtonItem {
  type: 'button';
  icon: ArkhamButtonIconType;
  title: string;
  onPress: () => void;
}
interface PlaceholderItem {
  type: 'placeholder';
  text: string;
}

export type FriendFeedItem = UserItem | HeaderItem | ButtonItem | PlaceholderItem;

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
        <RoundButton onPress={onAcceptPress} disabled={!!submitting}>
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
        <RoundButton onPress={onRejectPress} disabled={!!submitting}>
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
        <RoundButton onPress={onRemovePress} disabled={!!submitting}>
          { submitting === 'remove' ? (
            <ActivityIndicator size="small" animating color={colors.D30} />
          ) : (
            <AppIcon size={16} name="dismiss" color={colors.D30} />
          ) }
        </RoundButton>
      ) : (
        <RoundButton onPress={onInvitePress} disabled={!!submitting}>
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

function UserRow({ user, showUser, status, controls, refetchMyProfile }: {
  user: SimpleUser;
  refetchMyProfile: () => void;
  showUser?: (userId: string, handle?: string) => void;
  controls: UserControls | undefined;
  status?: FriendStatus;
}) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
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
    <View style={[styles.userRow, borderStyle, space.paddingM]}>
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

interface Props {
  componentId: string;
  userId: string;
  handleScroll?: (...args: any[]) => void;
  searchResults?: SearchResults;
  error?: string;

  toFeed: (
    isSelf: boolean,
    profile?: UserProfile
  ) => FriendFeedItem[]
}

export default function FriendFeedComponent({ componentId, userId, handleScroll, error, searchResults, toFeed }: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const [myProfile, loadingMyProfile, refetchMyProfile] = useMyProfile(true);
  const isSelf = user?.uid === userId;
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
  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<FriendFeedItem>): React.ReactElement | null => {
    switch (item.type) {
      case 'user':
        return (
          <UserRow
            key={index}
            user={item.user}
            refetchMyProfile={refetchMyProfile}
            controls={item.controls}
            status={item.user.id !== user?.uid ? myFriendStatus[item.user.id] || FriendStatus.NONE : undefined}
            showUser={item.user.id !== user?.uid ? showUser : undefined}
          />
        );
      case 'header':
        return (
          <CardSectionHeader key={index} section={{ title: item.header }} />
        );
      case 'button':
        return (
          <ArkhamButton key={index} onPress={item.onPress} title={item.title} icon={item.icon} />
        );
      case 'placeholder':
        return (
          <View style={[styles.userRow, borderStyle, space.paddingM]}>
            <Text style={typography.large}>
              { item.text }
            </Text>
          </View>
        );
      default:
        return null;
    }
  }, [user, myFriendStatus, borderStyle, typography, refetchMyProfile, showUser]);

  const data: FriendFeedItem[] = useMemo(() => toFeed(isSelf, profile), [toFeed, isSelf, profile]);
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
  const doRefresh = useCallback(() => {
    refetchMyProfile();
    refetchProfile();
  }, [refetchMyProfile, refetchProfile]);
  useEffect(() => {
    doRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isRefreshing = loading || loadingMyProfile || !!searchResults?.loading;
  return (
    <FlatList
      contentInset={!handleScroll || Platform.OS === 'android' ? undefined : { top: SEARCH_BAR_HEIGHT }}
      contentOffset={!handleScroll || Platform.OS === 'android' ? undefined : { x: 0, y: -SEARCH_BAR_HEIGHT }}
      ListHeaderComponent={handleScroll && header}
      refreshControl={(
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={doRefresh}
          tintColor={colors.lightText}
          progressViewOffset={SEARCH_BAR_HEIGHT}
        />
      )}
      onScroll={handleScroll}
      data={data}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

