import React, { useCallback, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { find, filter, forEach, map } from 'lodash';

import { UploadedCampaignId } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { useEditCampaignAccessRequest } from '@data/remote/campaigns';
import useFriendFeedComponent, { FriendFeedItem } from '@components/social/useFriendFeedComponent';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCampaignAccess, UserProfile } from '@data/remote/hooks';
import { FriendsViewProps } from '@components/social/FriendsView';

export interface CampaignAccessProps {
  campaignId: UploadedCampaignId;
  isOwner: boolean;
}
export default function EditCampaignAccessView({ campaignId, isOwner, componentId }: CampaignAccessProps & NavigationProps) {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const campaignAccess = useCampaignAccess(campaignId);
  const editCampaignAccess = useEditCampaignAccessRequest();
  const inviteUser = useCallback(async(user: string) => {
    await editCampaignAccess(campaignId, [user], 'grant');
  }, [editCampaignAccess, campaignId]);
  const removeUser = useCallback(async(user: string) => {
    await editCampaignAccess(campaignId, [user], 'revoke');
  }, [editCampaignAccess, campaignId]);
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

  const toFeed = useCallback((isSelf: boolean, profile?: UserProfile) => {
    const feed: FriendFeedItem[] = [];
    if (campaignAccess) {
      feed.push({ id: 'campaign_players_header', type: 'header', header: t`Campaign players` });
      feed.push({
        id: 'owner',
        type: 'user',
        user: campaignAccess.owner,
      });
      const otherPlayers = filter(campaignAccess.access, u => u.id !== campaignAccess.owner.id);
      if (otherPlayers.length) {
        forEach(otherPlayers, u => {
          feed.push({
            id: `player-${u.id}`,
            type: 'user',
            user: u,
            controls: u.id !== userId && isOwner ? {
              type: 'campaign',
              hasAccess: true,
              inviteUser,
              removeUser,
            } : undefined,
          });
        });
      }
      const accessUsers = new Set(map(campaignAccess.access, u => u.id));
      if (find(profile?.friends || [], u => !accessUsers.has(u.id))) {
        feed.push({ id: 'add_friends_header', type: 'header', header: t`Add friends to campaign` });
        forEach(profile?.friends || [], u => {
          if (!accessUsers.has(u.id)) {
            feed.push({
              id: `friends-${u.id}`,
              type: 'user',
              user: u,
              controls: {
                type: 'campaign',
                hasAccess: false,
                inviteUser,
                removeUser,
              },
            });
          }
        });
      }
    } else {
      // Loading?
    }
    feed.push({
      id: 'search_friends_button',
      type: 'button',
      title: t`Add friends`,
      icon: 'expand',
      onPress: editFriendsPressed,
    });
    return feed;
  }, [campaignAccess, userId, isOwner, editFriendsPressed, inviteUser, removeUser]);
  const [feed] = useFriendFeedComponent({ componentId, userId, toFeed });
  if (!userId) {
    return <LoadingSpinner />;
  }
  return feed;
}
