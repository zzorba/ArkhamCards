import { ApolloCache, DocumentNode, MutationUpdaterFn } from '@apollo/client';
import { filter, find } from 'lodash';

import { AddCampaignInvestigatorDocument, AddCampaignInvestigatorMutation, AddGuideInputDocument, AddGuideInputMutation, FullCampaignFragment, FullCampaignFragmentDoc, GetCampaignGuideDocument, GetCampaignGuideQuery, MiniCampaignFragment, MiniCampaignFragmentDoc, RemoveCampaignInvestigatorDocument, RemoveCampaignInvestigatorMutation, UpdateInvestigatorDataDocument, UpdateInvestigatorDataMutation, UpdateInvestigatorTraumaDocument, UpdateInvestigatorTraumaMutation } from '@generated/graphql/apollo-schema';

const handleAddGuideInput: MutationUpdaterFn<AddGuideInputMutation> = (cache, { data }) => {
  if (data === undefined || !data?.insert_guide_input_one) {
    return;
  }
  const campaignId = data.insert_guide_input_one.campaign_id;
  const cacheData = cache.readQuery<GetCampaignGuideQuery>({
    query: GetCampaignGuideDocument,
    variables: {
      campaign_id: campaignId,
    },
  });
  if (cacheData === null || !cacheData.campaign_guide.length) {
    return;
  }
  const campaignGuide = cacheData.campaign_guide[0];
  const { guide_inputs } = campaignGuide;
  const inputId = data.insert_guide_input_one.id;
  const newGuideInputs = [
    ...filter(guide_inputs, i => i.id !== inputId),
    {
      ...data.insert_guide_input_one,
    },
  ];
  cache.writeQuery<GetCampaignGuideQuery>({
    query: GetCampaignGuideDocument,
    variables: {
      campaign_id: campaignId,
    },
    data: {
      campaign_guide: [{
        ...campaignGuide,
        guide_inputs: newGuideInputs,
      }],
    },
  });
};

function updateMiniCampaign(cache: ApolloCache<unknown>, campaignId: number, update: (fragment: MiniCampaignFragment) => MiniCampaignFragment) {
  const id = cache.identify({ __typename: 'campaign', id: campaignId });
  const existingCacheData = cache.readFragment<MiniCampaignFragment>({
    fragment: MiniCampaignFragmentDoc,
    fragmentName: 'MiniCampaign',
    id,
  });
  if (existingCacheData) {
    cache.writeFragment<MiniCampaignFragment>({
      fragment: MiniCampaignFragmentDoc,
      fragmentName: 'MiniCampaign',
      data: update(existingCacheData),
    });
  }
}


function updateFullCampaign(cache: ApolloCache<unknown>, campaignId: number, update: (fragment: FullCampaignFragment) => FullCampaignFragment) {
  const id = cache.identify({ __typename: 'campaign', id: campaignId });
  const existingCacheData = cache.readFragment<FullCampaignFragment>({
    fragment: FullCampaignFragmentDoc,
    fragmentName: 'FullCampaign',
    id,
  });
  if (existingCacheData) {
    cache.writeFragment<FullCampaignFragment>({
      fragment: FullCampaignFragmentDoc,
      fragmentName: 'FullCampaign',
      data: update(existingCacheData),
    });
  }
}


const handleAddCampaignInvestigator: MutationUpdaterFn<AddCampaignInvestigatorMutation> = (cache, { data }) => {
  if (!data?.insert_campaign_investigator_one) {
    return;
  }
  const { campaign_id, investigator } = data.insert_campaign_investigator_one;
  updateMiniCampaign(
    cache,
    campaign_id,
    (existingCacheData: MiniCampaignFragment) => {
      return {
        ...existingCacheData,
        investigators: [
          ...filter(existingCacheData.investigators, i => i.investigator !== investigator),
          {
            id: `${campaign_id}-${investigator}`,
            investigator,
          },
        ],
      };
    }
  );
};

const handleRemoveCampaignInvestigator: MutationUpdaterFn<RemoveCampaignInvestigatorMutation> = (cache, { data }) => {
  if (!data?.delete_campaign_investigator?.returning) {
    return;
  }
  const removed = data.delete_campaign_investigator?.returning;
  if (removed.length) {
    const removal = removed[0];
    const removalSet = new Set(removed.map(i => i.investigator));
    const campaign_id = removal.campaign_id;
    updateMiniCampaign(
      cache,
      campaign_id,
      (existingCacheData: MiniCampaignFragment) => {
        return {
          ...existingCacheData,
          investigators: filter(existingCacheData.investigators, i => !removalSet.has(i.investigator)),
        };
      }
    );
  }
};

const handleUpdateInvestigatorTrauma: MutationUpdaterFn<UpdateInvestigatorTraumaMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  updateMiniCampaign(
    cache,
    investigator_data.campaign_id,
    (existingCacheData: MiniCampaignFragment) => {
      const existingInvestigatorData = find(existingCacheData.investigator_data, id => id.investigator === investigator_data.investigator);
      if (!existingInvestigatorData) {
        return {
          ...existingCacheData,
          investigator_data: [
            ...existingCacheData.investigator_data || [],
            investigator_data,
          ],
        };
      }
      return {
        ...existingCacheData,
        investigator_data: [
          ...filter(existingCacheData.investigator_data, id => id.investigator !== investigator_data.investigator),
          {
            ...existingInvestigatorData,
            ...investigator_data,
          },
        ],
      };
    }
  );
};


const handleUpdateInvestigatorData: MutationUpdaterFn<UpdateInvestigatorDataMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  handleUpdateInvestigatorTrauma(cache, { data });
  updateFullCampaign(
    cache,
    investigator_data.campaign_id,
    (existingCacheData: FullCampaignFragment) => {
      const existingInvestigatorData = find(existingCacheData.investigator_data, id => id.investigator === investigator_data.investigator);
      if (!existingInvestigatorData) {
        return {
          ...existingCacheData,
          investigator_data: [
            ...existingCacheData.investigator_data || [],
            investigator_data,
          ],
        };
      }
      return {
        ...existingCacheData,
        investigator_data: [
          ...filter(existingCacheData.investigator_data, id => id.investigator !== investigator_data.investigator),
          {
            ...existingInvestigatorData,
            ...investigator_data,
          },
        ],
      };
    }
  );
};

interface OptimisticUpdate {
  mutation: DocumentNode;
  update: MutationUpdaterFn;
}

interface OptimisticUpdateByName {
  [name: string]: OptimisticUpdate | undefined;
}

export const optimisticUpdates: OptimisticUpdateByName = {
  addGuideInput: {
    mutation: AddGuideInputDocument,
    update: handleAddGuideInput,
  },
  addCampaignInvestigator: {
    mutation: AddCampaignInvestigatorDocument,
    update: handleAddCampaignInvestigator,
  },
  removeCampaignInvestigator: {
    mutation: RemoveCampaignInvestigatorDocument,
    update: handleRemoveCampaignInvestigator,
  },
  updateInvestigatorTrauma: {
    mutation: UpdateInvestigatorTraumaDocument,
    update: handleUpdateInvestigatorTrauma,
  },
  updateInvestigatorData: {
    mutation: UpdateInvestigatorDataDocument,
    update: handleUpdateInvestigatorData,
  },
};
