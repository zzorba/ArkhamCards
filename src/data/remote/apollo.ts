import { ApolloCache, DocumentNode, MutationUpdaterFn } from '@apollo/client';
import { filter, find, flatMap, map, pick } from 'lodash';

import { AddCampaignInvestigatorDocument, AddCampaignInvestigatorMutation, AddGuideInputDocument, AddGuideInputMutation, DecCountAchievementDocument, DecCountAchievementMutation, DeleteAllLocalDeckMutation, DeleteArkhamDbDeckMutation, DeleteInvestigatorDecksDocument, DeleteInvestigatorDecksMutation, FullCampaignFragment, FullCampaignFragmentDoc, FullCampaignGuideStateFragment, FullCampaignGuideStateFragmentDoc, FullInvestigatorDataFragment, GetCampaignDocument, GetCampaignGuideDocument, GetCampaignGuideQuery, GetCampaignQuery, GetMyCampaignsDocument, GetMyCampaignsQuery, GetMyDecksDocument, GetMyDecksQuery, GuideAchievementFragment, GuideAchievementFragmentDoc, IncCountAchievementDocument, IncCountAchievementMaxDocument, IncCountAchievementMaxMutation, IncCountAchievementMutation, MiniCampaignFragment, MiniCampaignFragmentDoc, RemoveCampaignInvestigatorDocument, RemoveCampaignInvestigatorMutation, RemoveGuideInputsDocument, RemoveGuideInputsMutation, SetBinaryAchievementDocument, SetBinaryAchievementMutation, UpdateAvailableXpDocument, UpdateAvailableXpMutation, UpdateCampaignDifficultyDocument, UpdateCampaignGuideVersionDocument, UpdateCampaignNameDocument, UpdateCampaignNotesDocument, UpdateCampaignScenarioResultsDocument, UpdateCampaignShowInterludesDocument, UpdateChaosBagDocument, UpdateInvestigatorDataDocument, UpdateInvestigatorDataMutation, UpdateInvestigatorTraumaDocument, UpdateInvestigatorTraumaMutation, UpdateSpentXpDocument, UpdateSpentXpMutation, UpdateWeaknessSetDocument, UploadNewCampaignMutation } from '@generated/graphql/apollo-schema';

function fullToMiniCampaignFragment(fragment: FullCampaignFragment): MiniCampaignFragment {
  return {
    __typename: 'campaign',
    ...pick(fragment, [
      'id',
      'uuid',
      'name',
      'investigator_data',
      'latest_decks',
      'investigators',
      'difficulty',
      'updated_at',
      'guided',
      'scenarioResults',
    ]),
  };
}

export const handleDeleteAllLocalDecks: MutationUpdaterFn<DeleteAllLocalDeckMutation> = (cache, { data }) => {
  if (data === undefined || !data?.delete_campaign_deck?.returning.length) {
    return;
  }
  const { campaign_id, owner_id } = data.delete_campaign_deck.returning[0];
  const local_uuids = new Set(flatMap(data.delete_campaign_deck.returning, d => d.local_uuid || []));
  const ids = new Set(flatMap(data.delete_campaign_deck.returning, d => d.id === -1 ? [] : d.id));

  updateMiniCampaign(cache, campaign_id, (fragment) => {
    return {
      ...fragment,
      latest_decks: filter(fragment.latest_decks, d => {
        if (!d.deck) {
          return false;
        }
        return d.deck.id !== -1 ? !ids.has(d.deck.id) : (!d.deck.local_uuid || !local_uuids.has(d.deck.local_uuid));
      }),
    };
  });
  updateFullCampaign(cache, campaign_id, (fragment) => {
    return {
      ...fragment,
      latest_decks: filter(fragment.latest_decks, d => {
        if (!d.deck) {
          return false;
        }
        return d.deck.id !== -1 ? !ids.has(d.deck.id) : (!d.deck.local_uuid || !local_uuids.has(d.deck.local_uuid));
      }),
    };
  });
  const myCampaignsCacheData = cache.readQuery<GetMyDecksQuery>({
    query: GetMyDecksDocument,
    variables: {
      userId: owner_id,
    },
  });
  if (myCampaignsCacheData?.users_by_pk) {
    cache.writeQuery<GetMyDecksQuery>({
      query: GetMyDecksDocument,
      variables: {
        userId: owner_id,
      },
      data: {
        users_by_pk: {
          __typename: 'users',
          id: owner_id,
          decks: filter(myCampaignsCacheData.users_by_pk.decks, d => {
            return !!d.deck && (d.deck.id !== -1 ? !ids.has(d.deck.id) : (!d.deck.local_uuid || !local_uuids.has(d.deck.local_uuid)));
          }),
          all_decks: filter(myCampaignsCacheData.users_by_pk.all_decks, d => {
            return d.id !== -1 ? !ids.has(d.id) : (!d.local_uuid || !local_uuids.has(d.local_uuid));
          }),
        },
      },
    });
  }
};

export const handleUploadNewCampaign: MutationUpdaterFn<UploadNewCampaignMutation> = (cache, { data }) => {
  if (data === undefined || !data?.update_campaign_by_pk) {
    return;
  }
  const campaignId = data.update_campaign_by_pk.id;
  const ownerId = data.update_campaign_by_pk.owner;

  cache.writeQuery<GetCampaignQuery>({
    query: GetCampaignDocument,
    variables: {
      campaign_id: campaignId,
    },
    data: {
      __typename: 'query_root',
      campaign_by_pk: data.update_campaign_by_pk,
    },
  });

  const cacheData = cache.readQuery<GetMyCampaignsQuery>({
    query: GetMyCampaignsDocument,
    variables: {
      userId: ownerId,
    },
  });
  if (!cacheData || !cacheData.users_by_pk) {
    return;
  }
  cache.writeQuery<GetMyCampaignsQuery>({
    query: GetMyCampaignsDocument,
    variables: {
      userId: ownerId,
    },
    data: {
      users_by_pk: {
        __typename: 'users',
        id: ownerId,
        campaigns: [
          ...filter(cacheData.users_by_pk.campaigns, c => c.campaign?.id !== campaignId),
          {
            __typename: 'user_campaigns',
            campaign: {
              ...fullToMiniCampaignFragment(data.update_campaign_by_pk),
              link_a_campaign: data.update_campaign_by_pk.link_a_campaign,
              link_b_campaign: data.update_campaign_by_pk.link_b_campaign,
            },
          },
        ],
      },
    },
  })
};

function updateCampaignGuide(cache: ApolloCache<unknown>, campaignId: number, update: (cacheData: FullCampaignGuideStateFragment) => FullCampaignGuideStateFragment) {
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
  const newCampaignGuide = update(campaignGuide);
  cache.writeQuery<GetCampaignGuideQuery>({
    query: GetCampaignGuideDocument,
    variables: {
      campaign_id: campaignId,
    },
    data: {
      campaign_guide: [newCampaignGuide],
    },
  });
}


const handleAddGuideInput: MutationUpdaterFn<AddGuideInputMutation> = (cache, { data }) => {
  if (data === undefined || !data?.insert_guide_input_one) {
    return;
  }
  const campaignId = data.insert_guide_input_one.campaign_id;
  const inputId = data.insert_guide_input_one.id;
  const guide_input = data.insert_guide_input_one;
  updateCampaignGuide(cache, campaignId, campaignGuide => {
    const { guide_inputs } = campaignGuide;
    const newGuideInputs = [
      ...filter(guide_inputs, i => i.id !== inputId),
      {
        ...guide_input,
      },
    ];
    return {
      ...campaignGuide,
      guide_inputs: newGuideInputs,
    }
  });
};


const handleRemoveGuideInputs: MutationUpdaterFn<RemoveGuideInputsMutation> = (cache, { data }) => {
  if (data === undefined || !data?.delete_guide_input?.returning.length) {
    return;
  }
  const deletes = data.delete_guide_input.returning;
  const campaignId = deletes[0].campaign_id;
  const ids = new Set(map(deletes, d => d.id));
  updateCampaignGuide(cache, campaignId, (campaignGuide) => {
    return {
      ...campaignGuide,
      guide_inputs: filter(campaignGuide.guide_inputs, i => !ids.has(i.id)),
    }
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


function updateFullCampaignGuide(
  cache: ApolloCache<unknown>,
  campaignId: number,
  update: (fragment: FullCampaignGuideStateFragment) => FullCampaignGuideStateFragment
) {
  const id = cache.identify({ __typename: 'campaign', id: campaignId });
  const existingCacheData = cache.readFragment<FullCampaignGuideStateFragment>({
    fragment: FullCampaignGuideStateFragmentDoc,
    fragmentName: 'FullCampaignGuideState',
    id,
  });
  if (existingCacheData) {
    cache.writeFragment<FullCampaignGuideStateFragment>({
      fragment: FullCampaignGuideStateFragmentDoc,
      fragmentName: 'FullCampaignGuideState',
      data: update(existingCacheData),
    });
  }
}

const handleDeleteInvestigatorDecks: MutationUpdaterFn<DeleteInvestigatorDecksMutation> = (cache, { data }) => {
  if (!data?.delete_campaign_deck?.returning.length) {
    return;
  }
  const { investigator, campaign_id } = data.delete_campaign_deck.returning[0];
  updateMiniCampaign(cache, campaign_id, (campaign) => {
    return {
      ...campaign,
      latest_decks: filter(campaign.latest_decks, d => d.deck?.investigator !== investigator),
    };
  });
  updateFullCampaign(cache, campaign_id, (campaign) => {
    return {
      ...campaign,
      latest_decks: filter(campaign.latest_decks, d => d.deck?.investigator !== investigator),
    };
  });
};

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
    const removalSet = new Set(map(removed, i => i.investigator));
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

function updateFullInvestigatorData(cache: ApolloCache<unknown>, campaignId: number, investigator: string, update: (investigator_data?: FullInvestigatorDataFragment) => FullInvestigatorDataFragment) {
  updateFullCampaign(
    cache,
    campaignId,
    (existingCacheData: FullCampaignFragment) => {
      const existingInvestigatorData = find(existingCacheData.investigator_data, id => id.investigator === investigator);
      if (!existingInvestigatorData) {
        return {
          ...existingCacheData,
          investigator_data: [
            ...existingCacheData.investigator_data || [],
            update(),
          ],
        };
      }
      return {
        ...existingCacheData,
        investigator_data: [
          ...filter(existingCacheData.investigator_data, id => id.investigator !== investigator),
          update(existingInvestigatorData),
        ],
      };
    }
  );
}

function emptyInvestigatorData(campaign_id: number, investigator: string): FullInvestigatorDataFragment {
  return {
    __typename: 'investigator_data',
    id: `${campaign_id}-${investigator}`,
    campaign_id,
    investigator,
    insane: null,
    killed: null,
    mental: null,
    physical: null,
    storyAssets: [],
    specialXp: {},
    addedCards: [],
    removedCards: [],
    ignoreStoryAssets: [],
    availableXp: 0,
    spentXp: 0,
    updated_at: new Date(),
  };
}


const handleUpdateInvestigatorData: MutationUpdaterFn<UpdateInvestigatorDataMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  handleUpdateInvestigatorTrauma(cache, { data });
  updateFullInvestigatorData(cache, investigator_data.campaign_id, investigator_data.investigator, data => {
    if (!data) {
      return {
        ...emptyInvestigatorData(investigator_data.campaign_id, investigator_data.investigator),
        ...investigator_data,
      };
    }
    return {
      ...data,
      ...investigator_data,
    };
  });
};

const handleUpdateSpentXp: MutationUpdaterFn<UpdateSpentXpMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  updateFullInvestigatorData(cache, investigator_data.campaign_id, investigator_data.investigator, data => {
    if (!data) {
      return {
        ...emptyInvestigatorData(investigator_data.campaign_id, investigator_data.investigator),
        spentXp: investigator_data.spentXp || 0,
      };
    }
    return {
      ...data,
      ...investigator_data,
    };
  });
};

const handleUpdateAvailableXp: MutationUpdaterFn<UpdateAvailableXpMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  updateFullInvestigatorData(cache, investigator_data.campaign_id, investigator_data.investigator, data => {
    if (!data) {
      return {
        ...emptyInvestigatorData(investigator_data.campaign_id, investigator_data.investigator),
        availableXp: investigator_data.availableXp || 0,
      };
    }
    return {
      ...data,
      ...investigator_data,
    };
  });
};

function updateGuideAchievement(
  cache: ApolloCache<unknown>,
  achievement: GuideAchievementFragment,
  insert: () => GuideAchievementFragment,
  update: (achievement: GuideAchievementFragment) => GuideAchievementFragment
) {
  const id = achievement.id;
  cache.writeFragment<GuideAchievementFragment>({
    fragment: GuideAchievementFragmentDoc,
    data: achievement,
  });
  updateFullCampaignGuide(
    cache,
    achievement.campaign_id,
    (existingCacheData: FullCampaignGuideStateFragment) => {
      const existingAchievement = find(existingCacheData.guide_achievements, a => a.id === id);
      if (!existingAchievement) {
        return {
          ...existingCacheData,
          guide_achievements: [
            ...existingCacheData.guide_achievements || [],
            insert(),
          ],
        };
      }
      return {
        ...existingCacheData,
        guide_achievements: [
          ...filter(existingCacheData.guide_achievements, a => a.id !== id),
          update(existingAchievement),
        ],
      };
    }
  );
}

const handleSetBinaryAchievement: MutationUpdaterFn<SetBinaryAchievementMutation> = (cache, { data }) => {
  if (!data?.insert_guide_achievement_one) {
    return;
  }
  const achievement = data.insert_guide_achievement_one;
  updateGuideAchievement(cache, achievement, () => achievement, () => achievement);
};

const handleIncCountAchievementMax: MutationUpdaterFn<IncCountAchievementMaxMutation> = (cache, { data, context }) => {
  if (!data?.update_guide_achievement || !data.update_guide_achievement.returning.length) {
    return;
  }
  const achievement = data.update_guide_achievement.returning[0];
  const id = achievement.id;
  const max = context?.max || 0;
  updateGuideAchievement(cache, achievement, () => {
    return {
      __typename: 'guide_achievement',
      id,
      campaign_id: achievement.campaign_id,
      type: 'count',
      value: Math.min(1, context?.max),
    };
  }, (a: GuideAchievementFragment) => {
    return {
      ...a,
      value: Math.min((a.value || 0) + 1, max),
    };
  });
};

const handleIncCountAchievement: MutationUpdaterFn<IncCountAchievementMutation> = (cache, { data }) => {
  if (!data?.update_guide_achievement || !data.update_guide_achievement.returning.length) {
    return;
  }
  const achievement = data.update_guide_achievement.returning[0];
  const id = achievement.id;
  updateGuideAchievement(cache, achievement, () => {
    return {
      __typename: 'guide_achievement',
      id,
      campaign_id: achievement.campaign_id,
      type: 'count',
      value: 1,
    };
  }, (a: GuideAchievementFragment) => {
    return {
      ...a,
      value: (a.value || 0) + 1,
    };
  });
};

const handleDecCountAchievement: MutationUpdaterFn<DecCountAchievementMutation> = (cache, { data }) => {
  if (!data?.update_guide_achievement || !data.update_guide_achievement.returning.length) {
    return;
  }
  const achievement = data.update_guide_achievement.returning[0];
  const id = achievement.id;
  updateGuideAchievement(cache, achievement, () => {
    return {
      __typename: 'guide_achievement',
      id,
      campaign_id: achievement.campaign_id,
      type: 'count',
      value: 0,
    };
  }, (a: GuideAchievementFragment) => {
    return {
      ...a,
      value: Math.max((a.value || 0) - 1, 0),
    };
  });
};

interface OptimisticUpdate {
  mutation: DocumentNode;
  update?: MutationUpdaterFn;
}

interface OptimisticUpdateByName {
  [name: string]: OptimisticUpdate | undefined;
}

export const optimisticUpdates = {
  addGuideInput: {
    mutation: AddGuideInputDocument,
    update: handleAddGuideInput,
  },
  removeGuideInputs: {
    mutation: RemoveGuideInputsDocument,
    update: handleRemoveGuideInputs,
  },
  addCampaignInvestigator: {
    mutation: AddCampaignInvestigatorDocument,
    update: handleAddCampaignInvestigator,
  },
  deleteInvestigatorDecks: {
    mutation: DeleteInvestigatorDecksDocument,
    update: handleDeleteInvestigatorDecks,
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
  setBinaryAchievement: {
    mutation: SetBinaryAchievementDocument,
    update: handleSetBinaryAchievement,
  },
  incCountAchievementMax: {
    mutation: IncCountAchievementMaxDocument,
    update: handleIncCountAchievementMax,
  },
  incCountAchievement: {
    mutation: IncCountAchievementDocument,
    update: handleIncCountAchievement,
  },
  decCountAchievement: {
    mutation: DecCountAchievementDocument,
    update: handleDecCountAchievement,
  },
  updateSpentXp: {
    mutation: UpdateSpentXpDocument,
    update: handleUpdateSpentXp,
  },
  updateAvailableXp: {
    mutation: UpdateAvailableXpDocument,
    update: handleUpdateAvailableXp,
  },
  // These are all just 'set' operations, i.e. we want to track them but don't
  // need fancy speculative updates, the standard apollo Key-Value update will do.
  updateChaosBag: {
    mutation: UpdateChaosBagDocument,
  },
  updateWeaknessSet: {
    mutation: UpdateWeaknessSetDocument,
  },
  updateCampaignNotes: {
    mutation: UpdateCampaignNotesDocument,
  },
  updateCampaignScenarioResults: {
    mutation: UpdateCampaignScenarioResultsDocument,
  },
  updateCampaignShowInterludes: {
    mutation: UpdateCampaignShowInterludesDocument,
  },
  updateCampaignDifficulty: {
    mutation: UpdateCampaignDifficultyDocument,
  },
  updateCampaignGuideVersion: {
    mutation: UpdateCampaignGuideVersionDocument,
  },
  updateCampaignName: {
    mutation: UpdateCampaignNameDocument,
  },
};

export const genericOptimisticUpdates: OptimisticUpdateByName = optimisticUpdates;