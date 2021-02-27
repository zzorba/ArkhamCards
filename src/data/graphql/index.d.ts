
declare module '*/campaigns.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const updateCampaignName: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/social.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getProfile: DocumentNode;

  export default defaultDocument;
}
    