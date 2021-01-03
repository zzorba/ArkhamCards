
export enum FriendStatus {
  NONE = 'none',
  RECEIVED = 'received',
  SENT = 'sent',
  FRIENDS = 'friends',
}

export interface ArkhamCardsProfile {
  handle?: string;
  friends?: { [uid: string]: FriendStatus | undefined };
}
