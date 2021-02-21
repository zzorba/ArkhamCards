import Parse from 'parse/react-native';

import { ArkhamCardsUser } from '@lib/ArkhamCardsAuthContext';
import { UploadedCampaignId } from '@actions/types';
import UserFriendStatus, { FriendStatus, UserHandle } from './types';


export function campaign(campaignId: UploadedCampaignId): FirebaseDatabaseTypes.Reference {
  return database().ref('/campaigns').child(campaignId.serverId);
}

export function campaignDecks(campaignId: UploadedCampaignId): FirebaseDatabaseTypes.Reference {
  return campaign(campaignId).child('decks');
}
export function campaignDetail(campaignId: UploadedCampaignId): FirebaseDatabaseTypes.Reference {
  return campaign(campaignId).child('campaigns').child(campaignId.campaignId);
}
export function campaignGuide(campaignId: UploadedCampaignId): FirebaseDatabaseTypes.Reference {
  return campaign(campaignId).child('guides').child(campaignId.campaignId);
}

export function myCampaigns(user: ArkhamCardsUser): FirebaseDatabaseTypes.Reference {
  return database().ref('/user_campaigns').child(user.id);
}

export function userHandle(user: { id: string }): Parse.Query<UserHandle> {
  return new Parse.Query(UserHandle).equalTo('user', user.id).limit(1);
}

export function userFriends(user: { id: string }): Parse.Query<UserFriendStatus> {
  return Parse.Query.or(
    new Parse.Query(UserFriendStatus).equalTo('userA', user).notEqualTo('status', FriendStatus.NONE),
    new Parse.Query(UserFriendStatus).equalTo('userB', user).notEqualTo('status', FriendStatus.NONE)
  );
}

export default {
  campaign,
  campaignDecks,
  campaignDetail,
  campaignGuide,
  myCampaigns,
  userHandle,
};
