import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItemInfo, Platform, StyleSheet, Text, View } from 'react-native';
import { find, forEach, map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { useMyProfile, useProfile, SimpleUser } from '@data/remote/hooks';
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
import { FriendStatus, SearchResults, useSearchUsers, useUpdateFriendRequest } from '@data/remote/api';
import LanguageContext from '@lib/i18n/LanguageContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProps } from '@components/nav/types';

export interface FriendsViewProps {
  userId: string;
}

interface UserItem {
  type: 'user';
  user: SimpleUser;
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

type Item = UserItem | HeaderItem | ButtonItem | PlaceholderItem;

function UserRow({ user, status, showUser, acceptRequest, rejectRequest }: {
  user: SimpleUser;
  status?: FriendStatus;
  showUser?: (userId: string, handle?: string) => void;
  acceptRequest: (userId: string) => Promise<void>;
  rejectRequest: (userId: string) => Promise<void>;
}) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const fadeAnim = useCallback((props: any) => {
    return <Fade {...props} style={{ backgroundColor: colors.M }} duration={1000} />;
  }, [colors]);
  const onPress = useCallback(() => {
    showUser?.(user.id, user.handle);
  }, [showUser, user]);
  const [submitting, setSubmitting] = useState<'accept' | 'reject'>();
  const onAcceptPress = useCallback(async() => {
    setSubmitting('accept');
    await acceptRequest(user.id);
    setSubmitting(undefined);
  }, [acceptRequest, user.id]);
  const onRejectPress = useCallback(() => {
    setSubmitting('reject');
    rejectRequest(user.id);
    setSubmitting(undefined);
  }, [rejectRequest, user.id]);

  const controls = useMemo(() => {
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
        { controls }
      </View>
    </View>
  );
}

function FriendFeed({ componentId, userId, handleScroll, showHeader, focus, searchResults, searchTerm, onSearchChange, performSearch }: FriendsViewProps & {
  componentId: string;
  handleScroll: (...args: any[]) => void;
  showHeader: () => void;
  focus: () => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string, submit: boolean) => void;
  searchResults: SearchResults;
  performSearch: () => void;
}) {
  const { lang } = useContext(LanguageContext);
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
  const [error, setError] = useState<string>();
  const updateFriendRequest = useUpdateFriendRequest(setError);
  const acceptRequest = useCallback(async(userId: string) => {
    const result = await updateFriendRequest(userId, 'request');
    refetchMyProfile();
    return result;
  }, [updateFriendRequest, refetchMyProfile]);
  const rejectRequest = useCallback((userId: string) => {
    const result = updateFriendRequest(userId, 'revoke');
    return result;
  }, [updateFriendRequest]);
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
  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<Item>): React.ReactElement | null => {
    switch (item.type) {
      case 'user':
        return (
          <UserRow
            key={index}
            user={item.user}
            status={item.user.id !== user?.uid ? myFriendStatus[item.user.id] || FriendStatus.NONE : undefined}
            showUser={item.user.id !== user?.uid ? showUser : undefined}
            acceptRequest={acceptRequest}
            rejectRequest={rejectRequest}
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
  }, [user, myFriendStatus, borderStyle, typography, showUser, acceptRequest, rejectRequest]);
  const searchFriendsPressed = useCallback(() => {
    showHeader();
    focus();
  }, [showHeader, focus]);
  const clearSearchPressed = useCallback(() => {
    onSearchChange('', true);
  }, [onSearchChange]);

  const data: Item[] = useMemo(() => {
    const feed: Item[] = [];
    if (searchTerm && searchTerm !== searchResults.term) {
      feed.push({
        type: 'button',
        title: t`Search for ${searchTerm}`,
        icon: 'search',
        onPress: performSearch,
      });
    }
    const normalizedSearch = searchTerm && searchTerm.toLocaleLowerCase(lang);
    const matchesSearch = (f: SimpleUser) => {
      return !normalizedSearch || !f.handle || f.handle.toLocaleLowerCase(lang).indexOf(normalizedSearch) !== -1;
    };
    if (find(profile?.receivedRequests, matchesSearch) && isSelf) {
      feed.push({ type: 'header', header: t`Friend Requests` });
      forEach(profile?.receivedRequests, f => {
        if (matchesSearch(f)) {
          feed.push({ type: 'user', user: f });
        }
      });
    }
    if (find(profile?.sentRequests, matchesSearch) && isSelf) {
      feed.push({ type: 'header', header: t`Pending Friend Requests` });
      forEach(profile?.sentRequests, f => {
        if (matchesSearch(f)) {
          feed.push({ type: 'user', user: f });
        }
      });
    }
    if (!searchTerm || find(profile?.friends, matchesSearch)) {
      feed.push({ type: 'header', header: t`Friends` });
      forEach(profile?.friends, f => {
        if (matchesSearch(f)) {
          feed.push({ type: 'user', user: f });
        }
      });
    }
    if (isSelf && !searchTerm) {
      feed.push({
        type: 'button',
        title: t`Search for friends to add`,
        icon: 'search',
        onPress: searchFriendsPressed,
      });
    }
    if (searchTerm && !searchResults.loading) {
      feed.push({ type: 'header', header: t`Search Results` });
      if (find(searchResults.results || [], matchesSearch)) {
        forEach(searchResults.results, f => {
          if (matchesSearch(f)) {
            feed.push({ type: 'user', user: f });
          }
        });
      } else if (searchResults.term === searchTerm) {
        feed.push({ type: 'placeholder', text: t`No results found for search '${searchResults.term}'.` });
        feed.push({ type: 'button', title: t`Clear search`, icon: 'search', onPress: clearSearchPressed });
      } else {
        feed.push({
          type: 'button',
          title: t`Search for ${searchTerm}`,
          icon: 'search',
          onPress: performSearch,
        });
      }
    }
    return feed;
  }, [isSelf, profile, lang, searchFriendsPressed, performSearch, clearSearchPressed, searchResults, searchTerm]);
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
        { !!searchResults.error && (
          <View style={[space.paddingM, { backgroundColor: colors.warn }]}>
            <Text style={[typography.text, typography.white]}>{ searchResults.error }</Text>
          </View>
        ) }
      </>
    );
  }, [colors, error, typography, searchResults.error]);
  const doRefresh = useCallback(() => {
    refetchMyProfile();
    refetchProfile();
  }, [refetchMyProfile, refetchProfile]);
  return (
    <FlatList
      contentInset={Platform.OS === 'android' ? undefined : { top: SEARCH_BAR_HEIGHT }}
      contentOffset={Platform.OS === 'android' ? undefined : { x: 0, y: -SEARCH_BAR_HEIGHT }}
      ListHeaderComponent={header}
      onRefresh={doRefresh}
      refreshing={loading || loadingMyProfile || searchResults.loading}
      onScroll={handleScroll}
      data={data}
      renderItem={renderItem}
    />
  );
}
export default function FriendsView({ userId, componentId }: FriendsViewProps & NavigationProps) {
  const [searchTerm, updateSearchTerm] = useState<string>('');
  const { search, searchResults } = useSearchUsers();
  const onSearchChange = useCallback((value: string, submit: boolean) => {
    updateSearchTerm(value);
    if (submit) {
      search(value);
    }
  }, [updateSearchTerm, search]);
  const performSearch = useCallback(() => {
    search(searchTerm);
  }, [search, searchTerm]);

  return (
    <CollapsibleSearchBox
      prompt={t`Search friends`}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    >
      { (handleScroll, showHeader, focus) => (
        <FriendFeed
          componentId={componentId}
          userId={userId}
          handleScroll={handleScroll}
          showHeader={showHeader}
          focus={focus}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          performSearch={performSearch}
          searchResults={searchResults}
        />
      ) }
    </CollapsibleSearchBox>
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
