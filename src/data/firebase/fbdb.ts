import database from '@react-native-firebase/database';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UploadedCampaignId } from '@actions/types';


export function campaign(campaignId: UploadedCampaignId) {
  return database().ref('/campaigns').child(campaignId.serverId);
}

export function campaignDecks(campaignId: UploadedCampaignId) {
  return campaign(campaignId).child('decks');
}
export function campaignDetail(campaignId: UploadedCampaignId) {
  return campaign(campaignId).child('campaigns').child(campaignId.campaignId);
}
export function campaignGuide(campaignId: UploadedCampaignId) {
  return campaign(campaignId).child('guides').child(campaignId.campaignId);
}

export function myCampaigns(user: FirebaseAuthTypes.User) {
  return database().ref('/user_campaigns').child(user.uid).child('campaigns');
}
export function myRemovedCampaigns(user: FirebaseAuthTypes.User) {
  return database().ref('/user_campaigns').child(user.uid).child('removed_campaigns');
}

export function profile(user: { uid: string }) {
  return database().ref('/profiles').child(user.uid);
}

export default {
  campaign,
  campaignDecks,
  campaignDetail,
  campaignGuide,
  myCampaigns,
  myRemovedCampaigns,
  profile,
};
