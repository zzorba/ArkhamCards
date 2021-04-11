import React, { useCallback, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { find, filter, forEach, map } from 'lodash';

import { UploadedCampaignId } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { useEditCampaignAccessRequest } from '@data/remote/campaigns';
import FriendFeedComponent, { FriendFeedItem } from '@components/social/FriendFeedComponent';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCampaignAccess, UserProfile } from '@data/remote/hooks';
import { FriendsViewProps } from '@components/social/FriendsView';

export interface CampaignAccessProps {
  campaignId: UploadedCampaignId;
}
export default function EditCampaignAccessView({ campaignId, componentId }: CampaignAccessProps & NavigationProps) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaignAccess = useCampaignAccess(campaignId);
  const editCampaignAccess = useEditCampaignAccessRequest();
  const inviteUser = useCallback(async(user: string) => {
    await editCampaignAccess(campaignId, [user], 'grant');
  }, [editCampaignAccess, campaignId]);
  const removeUser = useCallback(async(user: string) => {
    await editCampaignAccess(campaignId, [user], 'revoke');
  }, [editCampaignAccess, campaignId]);
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

  const toFeed = useCallback((isSelf: boolean, profile?: UserProfile) => {
    const feed: FriendFeedItem[] = [];
    if (campaignAccess) {
      feed.push({ type: 'header', header: t`Campaign players` });
      feed.push({
        type: 'user',
        user: campaignAccess.owner,
      });
      const otherPlayers = filter(campaignAccess.access, u => u.id !== campaignAccess.owner.id);
      if (otherPlayers.length) {
        forEach(otherPlayers, u => {
          feed.push({
            type: 'user',
            user: u,
            controls: u.id !== user?.uid ? {
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
        feed.push({ type: 'header', header: t`Add friends to campaign` });
        forEach(profile?.friends || [], u => {
          if (!accessUsers.has(u.id)) {
            feed.push({
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
      type: 'button',
      title: t`Add friends`,
      icon: 'expand',
      onPress: editFriendsPressed,
    });
    return feed;
  }, [campaignAccess, user, editFriendsPressed, inviteUser, removeUser]);
  if (!user) {
    return <LoadingSpinner />;
  }
  return (
    <FriendFeedComponent
      componentId={componentId}
      userId={user.uid}
      toFeed={toFeed}
    />
  );
}
