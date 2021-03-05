
declare module '*/createCampaigns.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const uploadNewCampaign: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/decks.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const insertNewDeck: DocumentNode;
export const insertNextLocalDeck: DocumentNode;
export const insertNextArkhamDbDeck: DocumentNode;
export const updateArkhamDbDeck: DocumentNode;
export const updateLocalDeck: DocumentNode;
export const deleteLocalDeck: DocumentNode;
export const deleteArkhamDbDeck: DocumentNode;
export const getMyDecks: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/fragments.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const MiniInvestigatorData: DocumentNode;
export const FullInvestigatorData: DocumentNode;
export const MiniCampaign: DocumentNode;
export const FullCampaign: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/readCampaigns.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getMyCampaigns: DocumentNode;
export const getCampaign: DocumentNode;
export const campaign: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/social.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getProfile: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/updateCampaigns.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const deleteInvestigatorDecks: DocumentNode;
export const setBinaryAchievement: DocumentNode;
export const incCountAchievementMax: DocumentNode;
export const incCountAchievement: DocumentNode;
export const decCountAchievement: DocumentNode;
export const addGuideInput: DocumentNode;
export const updateInvestigatorTrauma: DocumentNode;
export const updateSpentXp: DocumentNode;
export const updateAvailableXp: DocumentNode;
export const updateWeaknessSet: DocumentNode;
export const updateCampaignName: DocumentNode;
export const addCampaignInvestigator: DocumentNode;
export const removeCampaignInvestigator: DocumentNode;

  export default defaultDocument;
}
    