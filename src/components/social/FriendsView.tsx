import React, { useCallback, useContext, useMemo, useState, useRef } from 'react';
import { find, forEach } from 'lodash';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { SimpleUser, UserProfile } from '@data/remote/hooks';
import { SearchResults, useSearchUsers, useUpdateFriendRequest } from '@data/remote/api';
import { NavigationProps } from '@components/nav/types';
import useFriendFeedComponent, { FriendFeedItem, UserControls } from './useFriendFeedComponent';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface FriendsViewProps {
  userId: string;
}

type Refresh = () => void;

function FeedComponent({ userId, componentId, searchTerm, searchResults, handleScroll, onSearchChange, performSearch, showHeader, focus }: {
  componentId: string;
  userId: string;
  searchTerm: string;
  searchResults: SearchResults;
  handleScroll: (...args: any[]) => void;
  onSearchChange: (value: string, submit: boolean) => void;
  performSearch: () => void;
  showHeader: () => void;
  focus: () => void;
}) {
  const refreshFeed = useRef<Refresh | undefined>(undefined);
  const searchFriendsPressed = useCallback(() => {
    showHeader();
    focus();
  }, [showHeader, focus]);
  const clearSearchPressed = useCallback(() => {
    onSearchChange('', true);
    refreshFeed.current?.();
  }, [onSearchChange]);
  const { lang } = useContext(LanguageContext);
  const [error, setError] = useState<string>();
  const updateFriendRequest = useUpdateFriendRequest(setError);
  const acceptRequest = useCallback(async(userId: string) => {
    return await updateFriendRequest(userId, 'request');
  }, [updateFriendRequest]);
  const rejectRequest = useCallback((userId: string) => {
    return updateFriendRequest(userId, 'revoke');
  }, [updateFriendRequest]);
  const controls: UserControls = useMemo(() => {
    return {
      type: 'friend',
      acceptRequest,
      rejectRequest,
    }
  }, [acceptRequest, rejectRequest]);
  const toFeed = useCallback((
    isSelf: boolean,
    profile?: UserProfile
  ) => {
    const normalizedSearch = searchTerm && searchTerm.toLocaleLowerCase(lang);
    const matchesSearch = (f: SimpleUser) => {
      return !normalizedSearch || !f.handle || f.handle.toLocaleLowerCase(lang).indexOf(normalizedSearch) !== -1;
    };
    const feed: FriendFeedItem[] = [];
    if (searchTerm && searchTerm !== searchResults.term) {
      feed.push({
        id: 'search',
        type: 'button',
        title: t`Search for ${searchTerm}`,
        icon: 'search',
        onPress: performSearch,
      });
    }
    if (find(profile?.receivedRequests, matchesSearch) && isSelf) {
      feed.push({ id: 'requests_header', type: 'header', header: t`Friend Requests` });
      forEach(profile?.receivedRequests, f => {
        if (matchesSearch(f)) {
          feed.push({ id: `request_${f.id}`, type: 'user', user: f, controls });
        }
      });
    }
    if (find(profile?.sentRequests, matchesSearch) && isSelf) {
      feed.push({ id: 'pending_header', type: 'header', header: t`Pending Friend Requests` });
      forEach(profile?.sentRequests, f => {
        if (matchesSearch(f)) {
          feed.push({ id: `pending_${f.id}`, type: 'user', user: f, controls });
        }
      });
    }
    if (!searchTerm || find(profile?.friends, matchesSearch)) {
      feed.push({ id: 'friends_header', type: 'header', header: t`Friends` });
      forEach(profile?.friends, f => {
        if (matchesSearch(f)) {
          feed.push({ id: `friend_${f.id}`, type: 'user', user: f, controls });
        }
      });
    }
    if (isSelf && !searchTerm) {
      feed.push({
        id: 'search',
        type: 'button',
        title: t`Search for friends to add`,
        icon: 'search',
        onPress: searchFriendsPressed,
      });
    }
    if (searchTerm && !searchResults.loading) {
      feed.push({ id: 'search_results', type: 'header', header: t`Search Results` });
      if (find(searchResults.results || [], matchesSearch)) {
        forEach(searchResults.results, f => {
          if (matchesSearch(f)) {
            feed.push({ id: `match_${f.id}`, type: 'user', user: f, controls });
          }
        });
      } else if (searchResults.term === searchTerm) {
        feed.push({ id: 'no_results', type: 'placeholder', text: t`No results found for search '${searchResults.term}'.` });
        feed.push({ id: 'clear', type: 'button', title: t`Clear search`, icon: 'search', onPress: clearSearchPressed });
      } else {
        feed.push({
          id: 'search_now',
          type: 'button',
          title: t`Search for ${searchTerm}`,
          icon: 'search',
          onPress: performSearch,
        });
      }
    }
    return feed;
  }, [clearSearchPressed, performSearch, lang, controls, searchResults, searchFriendsPressed, searchTerm]);
  const [feed, refresh] = useFriendFeedComponent({
    componentId,
    error,
    userId,
    toFeed,
    handleScroll,
    searchResults,
  });
  refreshFeed.current = refresh;

  return (
    <>
      { feed }
    </>
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
        <FeedComponent
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