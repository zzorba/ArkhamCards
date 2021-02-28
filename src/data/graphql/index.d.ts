
declare module '*/campaigns.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const updateCampaignName: DocumentNode;
export const getMyCampaigns: DocumentNode;
export const uploadNewCampaign: DocumentNode;
export const insertNewDeck: DocumentNode;
export const insertNextLocalDeck: DocumentNode;
export const insertNextArkhamDbDeck: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/social.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getProfile: DocumentNode;

  export default defaultDocument;
}
    