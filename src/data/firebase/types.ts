import { Campaign, Deck, GuideInput, UploadedCampaignId, GuideAchievement } from '@actions/types';

export enum FriendStatus {
  NONE = 'none',
  RECEIVED = 'received',
  SENT = 'sent',
  FRIEND = 'friend',
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
