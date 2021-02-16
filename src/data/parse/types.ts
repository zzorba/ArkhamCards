import Parse from 'parse/react-native';

import { Campaign, Deck, GuideInput, UploadedCampaignId, GuideAchievement } from '@actions/types';

export enum FriendStatus {
  NONE = 'none',
  RECEIVED = 'received',
  SENT = 'sent',
  FRIENDS = 'friends',
}

export class UserHandle extends Parse.Object {
  user() {
    return this.get('user');
  }

  handle() {
    return this.get('handle');
  }

  constructor() {
    super('UserHandle');
  }
}

export default class UserFriendStatus extends Parse.Object {

  private rawStatus(): FriendStatus {
    return this.get('status');
  }

  status(user: Parse.User) {
    const status = this.rawStatus();
    if (user.id === this.get('userA')) {
      return status;
    }
    if (user.id === this.get('userB')) {
      switch (status) {
        case FriendStatus.RECEIVED:
          return FriendStatus.SENT;
        case FriendStatus.SENT:
          return FriendStatus.RECEIVED;
        default:
          return status;
      }
    }
    return FriendStatus.NONE;
  }

  constructor() {
    super('UserFriendStatus');
  }
}

export function initParseObjects() {
  Parse.Object.registerSubclass('UserHandle', UserHandle);
  Parse.Object.registerSubclass('UserFriendStatus', UserFriendStatus);
}


export interface ArkhamCardsProfile {
  handle?: string;
  friends?: { [uid: string]: FriendStatus | undefined };
}

export interface ArkhamCardsUserCampaigns {
  campaigns?: {
    [serverId: string]: UploadedCampaignId | undefined;
  };
  removed_campaigns?: {
    [serverId: string]: UploadedCampaignId | undefined;
  };
}

export interface UploadedCampaignGuideState {
  inputs?: {
    [key: string]: GuideInput;
  };
  undo?: {
    [key: string]: boolean;
  };
  achievements?: {
    [key: string]: GuideAchievement;
  };
  lastUpdated?: Date | string;
}

export interface UploadedCampaign {
  campaigns?: {
    [campaignId: string]: Campaign | undefined;
  };
  decks?: {
    [deckId: string]: Deck | undefined;
  };
  guides?: {
    [campaignId: string]: UploadedCampaignGuideState | undefined;
  };
}
