import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { UploadedCampaignId } from '@actions/types';


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

export function myCampaigns(user: FirebaseAuthTypes.User): FirebaseDatabaseTypes.Reference {
  return database().ref('/user_campaigns').child(user.uid);
}

export function profile(user: { uid: string }): FirebaseDatabaseTypes.Reference {
  return database().ref('/profiles').child(user.uid);
}

export default {
  campaign,
  campaignDecks,
  campaignDetail,
  campaignGuide,
  myCampaigns,
  profile,
};
