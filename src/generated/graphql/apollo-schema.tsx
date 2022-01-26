import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  jsonb: any;
  timestamp: any;
  timestamptz: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "base_decks" */
export type Base_Decks = {
  __typename?: 'base_decks';
  /** An object relationship */
  campaign?: Maybe<Campaign>;
  campaign_id?: Maybe<Scalars['Int']>;
  /** An object relationship */
  deck?: Maybe<Campaign_Deck>;
  id?: Maybe<Scalars['Int']>;
};

/** aggregated selection of "base_decks" */
export type Base_Decks_Aggregate = {
  __typename?: 'base_decks_aggregate';
  aggregate?: Maybe<Base_Decks_Aggregate_Fields>;
  nodes: Array<Base_Decks>;
};

/** aggregate fields of "base_decks" */
export type Base_Decks_Aggregate_Fields = {
  __typename?: 'base_decks_aggregate_fields';
  avg?: Maybe<Base_Decks_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Base_Decks_Max_Fields>;
  min?: Maybe<Base_Decks_Min_Fields>;
  stddev?: Maybe<Base_Decks_Stddev_Fields>;
  stddev_pop?: Maybe<Base_Decks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Base_Decks_Stddev_Samp_Fields>;
  sum?: Maybe<Base_Decks_Sum_Fields>;
  var_pop?: Maybe<Base_Decks_Var_Pop_Fields>;
  var_samp?: Maybe<Base_Decks_Var_Samp_Fields>;
  variance?: Maybe<Base_Decks_Variance_Fields>;
};


/** aggregate fields of "base_decks" */
export type Base_Decks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Base_Decks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "base_decks" */
export type Base_Decks_Aggregate_Order_By = {
  avg?: InputMaybe<Base_Decks_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Base_Decks_Max_Order_By>;
  min?: InputMaybe<Base_Decks_Min_Order_By>;
  stddev?: InputMaybe<Base_Decks_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Base_Decks_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Base_Decks_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Base_Decks_Sum_Order_By>;
  var_pop?: InputMaybe<Base_Decks_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Base_Decks_Var_Samp_Order_By>;
  variance?: InputMaybe<Base_Decks_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "base_decks" */
export type Base_Decks_Arr_Rel_Insert_Input = {
  data: Array<Base_Decks_Insert_Input>;
};

/** aggregate avg on columns */
export type Base_Decks_Avg_Fields = {
  __typename?: 'base_decks_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "base_decks" */
export type Base_Decks_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "base_decks". All fields are combined with a logical 'AND'. */
export type Base_Decks_Bool_Exp = {
  _and?: InputMaybe<Array<Base_Decks_Bool_Exp>>;
  _not?: InputMaybe<Base_Decks_Bool_Exp>;
  _or?: InputMaybe<Array<Base_Decks_Bool_Exp>>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  deck?: InputMaybe<Campaign_Deck_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "base_decks" */
export type Base_Decks_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "base_decks" */
export type Base_Decks_Insert_Input = {
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  deck?: InputMaybe<Campaign_Deck_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Base_Decks_Max_Fields = {
  __typename?: 'base_decks_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "base_decks" */
export type Base_Decks_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Base_Decks_Min_Fields = {
  __typename?: 'base_decks_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "base_decks" */
export type Base_Decks_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "base_decks" */
export type Base_Decks_Mutation_Response = {
  __typename?: 'base_decks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Base_Decks>;
};

/** Ordering options when selecting data from "base_decks". */
export type Base_Decks_Order_By = {
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  deck?: InputMaybe<Campaign_Deck_Order_By>;
  id?: InputMaybe<Order_By>;
};

/** select columns of table "base_decks" */
export enum Base_Decks_Select_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "base_decks" */
export type Base_Decks_Set_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Base_Decks_Stddev_Fields = {
  __typename?: 'base_decks_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "base_decks" */
export type Base_Decks_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Base_Decks_Stddev_Pop_Fields = {
  __typename?: 'base_decks_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "base_decks" */
export type Base_Decks_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Base_Decks_Stddev_Samp_Fields = {
  __typename?: 'base_decks_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "base_decks" */
export type Base_Decks_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Base_Decks_Sum_Fields = {
  __typename?: 'base_decks_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "base_decks" */
export type Base_Decks_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Base_Decks_Var_Pop_Fields = {
  __typename?: 'base_decks_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "base_decks" */
export type Base_Decks_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Base_Decks_Var_Samp_Fields = {
  __typename?: 'base_decks_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "base_decks" */
export type Base_Decks_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Base_Decks_Variance_Fields = {
  __typename?: 'base_decks_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "base_decks" */
export type Base_Decks_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** columns and relationships of "campaign" */
export type Campaign = {
  __typename?: 'campaign';
  /** An array relationship */
  access: Array<Campaign_Access>;
  /** An aggregate relationship */
  access_aggregate: Campaign_Access_Aggregate;
  archived?: Maybe<Scalars['Boolean']>;
  /** An array relationship */
  base_decks: Array<Base_Decks>;
  /** An aggregate relationship */
  base_decks_aggregate: Base_Decks_Aggregate;
  campaignNotes?: Maybe<Scalars['jsonb']>;
  /** An object relationship */
  campaign_guide?: Maybe<Campaign_Guide>;
  chaosBag?: Maybe<Scalars['jsonb']>;
  /** An array relationship */
  chaos_bag_result: Array<Chaos_Bag_Result>;
  /** An aggregate relationship */
  chaos_bag_result_aggregate: Chaos_Bag_Result_Aggregate;
  created_at: Scalars['timestamptz'];
  cycleCode?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  difficulty?: Maybe<Scalars['String']>;
  guide_version?: Maybe<Scalars['Int']>;
  guided?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  /** An array relationship */
  investigator_data: Array<Investigator_Data>;
  /** An aggregate relationship */
  investigator_data_aggregate: Investigator_Data_Aggregate;
  /** An array relationship */
  investigators: Array<Campaign_Investigator>;
  /** An aggregate relationship */
  investigators_aggregate: Campaign_Investigator_Aggregate;
  /** An array relationship */
  latest_decks: Array<Latest_Decks>;
  /** An aggregate relationship */
  latest_decks_aggregate: Latest_Decks_Aggregate;
  /** An object relationship */
  link_a_campaign: Campaign;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  /** An object relationship */
  link_b_campaign: Campaign;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  link_campaign_id?: Maybe<Scalars['Int']>;
  /** An object relationship */
  linked_campaign: Campaign;
  name?: Maybe<Scalars['String']>;
  /** An object relationship */
  owner: Users;
  owner_id: Scalars['String'];
  scenarioResults?: Maybe<Scalars['jsonb']>;
  showInterludes?: Maybe<Scalars['Boolean']>;
  standaloneId?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamptz'];
  uuid: Scalars['String'];
  weaknessSet?: Maybe<Scalars['jsonb']>;
};


/** columns and relationships of "campaign" */
export type CampaignAccessArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignAccess_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignBase_DecksArgs = {
  distinct_on?: InputMaybe<Array<Base_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Base_Decks_Order_By>>;
  where?: InputMaybe<Base_Decks_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignBase_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Base_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Base_Decks_Order_By>>;
  where?: InputMaybe<Base_Decks_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignCampaignNotesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignChaosBagArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignChaos_Bag_ResultArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Result_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignChaos_Bag_Result_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Result_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignInvestigator_DataArgs = {
  distinct_on?: InputMaybe<Array<Investigator_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Investigator_Data_Order_By>>;
  where?: InputMaybe<Investigator_Data_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignInvestigator_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investigator_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Investigator_Data_Order_By>>;
  where?: InputMaybe<Investigator_Data_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignInvestigatorsArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Investigator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Investigator_Order_By>>;
  where?: InputMaybe<Campaign_Investigator_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignInvestigators_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Investigator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Investigator_Order_By>>;
  where?: InputMaybe<Campaign_Investigator_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignLatest_DecksArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignLatest_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignScenarioResultsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignStandaloneIdArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignWeaknessSetArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "campaign_access" */
export type Campaign_Access = {
  __typename?: 'campaign_access';
  campaign_id: Scalars['Int'];
  hidden?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['String'];
};

/** aggregated selection of "campaign_access" */
export type Campaign_Access_Aggregate = {
  __typename?: 'campaign_access_aggregate';
  aggregate?: Maybe<Campaign_Access_Aggregate_Fields>;
  nodes: Array<Campaign_Access>;
};

/** aggregate fields of "campaign_access" */
export type Campaign_Access_Aggregate_Fields = {
  __typename?: 'campaign_access_aggregate_fields';
  avg?: Maybe<Campaign_Access_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Campaign_Access_Max_Fields>;
  min?: Maybe<Campaign_Access_Min_Fields>;
  stddev?: Maybe<Campaign_Access_Stddev_Fields>;
  stddev_pop?: Maybe<Campaign_Access_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Campaign_Access_Stddev_Samp_Fields>;
  sum?: Maybe<Campaign_Access_Sum_Fields>;
  var_pop?: Maybe<Campaign_Access_Var_Pop_Fields>;
  var_samp?: Maybe<Campaign_Access_Var_Samp_Fields>;
  variance?: Maybe<Campaign_Access_Variance_Fields>;
};


/** aggregate fields of "campaign_access" */
export type Campaign_Access_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "campaign_access" */
export type Campaign_Access_Aggregate_Order_By = {
  avg?: InputMaybe<Campaign_Access_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Campaign_Access_Max_Order_By>;
  min?: InputMaybe<Campaign_Access_Min_Order_By>;
  stddev?: InputMaybe<Campaign_Access_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Campaign_Access_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Campaign_Access_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Campaign_Access_Sum_Order_By>;
  var_pop?: InputMaybe<Campaign_Access_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Campaign_Access_Var_Samp_Order_By>;
  variance?: InputMaybe<Campaign_Access_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "campaign_access" */
export type Campaign_Access_Arr_Rel_Insert_Input = {
  data: Array<Campaign_Access_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Campaign_Access_On_Conflict>;
};

/** aggregate avg on columns */
export type Campaign_Access_Avg_Fields = {
  __typename?: 'campaign_access_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "campaign_access" */
export type Campaign_Access_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "campaign_access". All fields are combined with a logical 'AND'. */
export type Campaign_Access_Bool_Exp = {
  _and?: InputMaybe<Array<Campaign_Access_Bool_Exp>>;
  _not?: InputMaybe<Campaign_Access_Bool_Exp>;
  _or?: InputMaybe<Array<Campaign_Access_Bool_Exp>>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  hidden?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "campaign_access" */
export enum Campaign_Access_Constraint {
  /** unique or primary key constraint */
  CampaignAccessPkey = 'campaign_access_pkey',
  /** unique or primary key constraint */
  CampaignAccessUserIdCampaignIdKey = 'campaign_access_user_id_campaign_id_key'
}

/** input type for incrementing numeric columns in table "campaign_access" */
export type Campaign_Access_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "campaign_access" */
export type Campaign_Access_Insert_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Campaign_Access_Max_Fields = {
  __typename?: 'campaign_access_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "campaign_access" */
export type Campaign_Access_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Campaign_Access_Min_Fields = {
  __typename?: 'campaign_access_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "campaign_access" */
export type Campaign_Access_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "campaign_access" */
export type Campaign_Access_Mutation_Response = {
  __typename?: 'campaign_access_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Campaign_Access>;
};

/** on conflict condition type for table "campaign_access" */
export type Campaign_Access_On_Conflict = {
  constraint: Campaign_Access_Constraint;
  update_columns: Array<Campaign_Access_Update_Column>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};

/** Ordering options when selecting data from "campaign_access". */
export type Campaign_Access_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  hidden?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: campaign_access */
export type Campaign_Access_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "campaign_access" */
export enum Campaign_Access_Select_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Hidden = 'hidden',
  /** column name */
  Id = 'id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "campaign_access" */
export type Campaign_Access_Set_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Campaign_Access_Stddev_Fields = {
  __typename?: 'campaign_access_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "campaign_access" */
export type Campaign_Access_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Campaign_Access_Stddev_Pop_Fields = {
  __typename?: 'campaign_access_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "campaign_access" */
export type Campaign_Access_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Campaign_Access_Stddev_Samp_Fields = {
  __typename?: 'campaign_access_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "campaign_access" */
export type Campaign_Access_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Campaign_Access_Sum_Fields = {
  __typename?: 'campaign_access_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "campaign_access" */
export type Campaign_Access_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** update columns of table "campaign_access" */
export enum Campaign_Access_Update_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Hidden = 'hidden',
  /** column name */
  Id = 'id',
  /** column name */
  UserId = 'user_id'
}

/** aggregate var_pop on columns */
export type Campaign_Access_Var_Pop_Fields = {
  __typename?: 'campaign_access_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "campaign_access" */
export type Campaign_Access_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Campaign_Access_Var_Samp_Fields = {
  __typename?: 'campaign_access_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "campaign_access" */
export type Campaign_Access_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Campaign_Access_Variance_Fields = {
  __typename?: 'campaign_access_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "campaign_access" */
export type Campaign_Access_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregated selection of "campaign" */
export type Campaign_Aggregate = {
  __typename?: 'campaign_aggregate';
  aggregate?: Maybe<Campaign_Aggregate_Fields>;
  nodes: Array<Campaign>;
};

/** aggregate fields of "campaign" */
export type Campaign_Aggregate_Fields = {
  __typename?: 'campaign_aggregate_fields';
  avg?: Maybe<Campaign_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Campaign_Max_Fields>;
  min?: Maybe<Campaign_Min_Fields>;
  stddev?: Maybe<Campaign_Stddev_Fields>;
  stddev_pop?: Maybe<Campaign_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Campaign_Stddev_Samp_Fields>;
  sum?: Maybe<Campaign_Sum_Fields>;
  var_pop?: Maybe<Campaign_Var_Pop_Fields>;
  var_samp?: Maybe<Campaign_Var_Samp_Fields>;
  variance?: Maybe<Campaign_Variance_Fields>;
};


/** aggregate fields of "campaign" */
export type Campaign_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Campaign_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Campaign_Append_Input = {
  campaignNotes?: InputMaybe<Scalars['jsonb']>;
  chaosBag?: InputMaybe<Scalars['jsonb']>;
  scenarioResults?: InputMaybe<Scalars['jsonb']>;
  standaloneId?: InputMaybe<Scalars['jsonb']>;
  weaknessSet?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type Campaign_Avg_Fields = {
  __typename?: 'campaign_avg_fields';
  guide_version?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
  link_campaign_id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "campaign". All fields are combined with a logical 'AND'. */
export type Campaign_Bool_Exp = {
  _and?: InputMaybe<Array<Campaign_Bool_Exp>>;
  _not?: InputMaybe<Campaign_Bool_Exp>;
  _or?: InputMaybe<Array<Campaign_Bool_Exp>>;
  access?: InputMaybe<Campaign_Access_Bool_Exp>;
  archived?: InputMaybe<Boolean_Comparison_Exp>;
  base_decks?: InputMaybe<Base_Decks_Bool_Exp>;
  campaignNotes?: InputMaybe<Jsonb_Comparison_Exp>;
  campaign_guide?: InputMaybe<Campaign_Guide_Bool_Exp>;
  chaosBag?: InputMaybe<Jsonb_Comparison_Exp>;
  chaos_bag_result?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  cycleCode?: InputMaybe<String_Comparison_Exp>;
  deleted?: InputMaybe<Boolean_Comparison_Exp>;
  difficulty?: InputMaybe<String_Comparison_Exp>;
  guide_version?: InputMaybe<Int_Comparison_Exp>;
  guided?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  investigator_data?: InputMaybe<Investigator_Data_Bool_Exp>;
  investigators?: InputMaybe<Campaign_Investigator_Bool_Exp>;
  latest_decks?: InputMaybe<Latest_Decks_Bool_Exp>;
  link_a_campaign?: InputMaybe<Campaign_Bool_Exp>;
  link_a_campaign_id?: InputMaybe<Int_Comparison_Exp>;
  link_b_campaign?: InputMaybe<Campaign_Bool_Exp>;
  link_b_campaign_id?: InputMaybe<Int_Comparison_Exp>;
  link_campaign_id?: InputMaybe<Int_Comparison_Exp>;
  linked_campaign?: InputMaybe<Campaign_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  owner?: InputMaybe<Users_Bool_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  scenarioResults?: InputMaybe<Jsonb_Comparison_Exp>;
  showInterludes?: InputMaybe<Boolean_Comparison_Exp>;
  standaloneId?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  uuid?: InputMaybe<String_Comparison_Exp>;
  weaknessSet?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "campaign" */
export enum Campaign_Constraint {
  /** unique or primary key constraint */
  CampaignDataPkey = 'campaign_data_pkey'
}

/** columns and relationships of "campaign_deck" */
export type Campaign_Deck = {
  __typename?: 'campaign_deck';
  arkhamdb_id?: Maybe<Scalars['Int']>;
  arkhamdb_user?: Maybe<Scalars['Int']>;
  base?: Maybe<Scalars['Boolean']>;
  /** An object relationship */
  campaign: Campaign;
  campaign_id: Scalars['Int'];
  content?: Maybe<Scalars['jsonb']>;
  content_hash?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  investigator: Scalars['String'];
  /** An object relationship */
  investigator_data?: Maybe<Investigator_Data>;
  local_uuid?: Maybe<Scalars['String']>;
  /** An object relationship */
  next_deck?: Maybe<Campaign_Deck>;
  next_deck_id?: Maybe<Scalars['Int']>;
  /** An array relationship */
  other_decks: Array<Campaign_Deck>;
  /** An aggregate relationship */
  other_decks_aggregate: Campaign_Deck_Aggregate;
  /** An object relationship */
  owner: Users;
  owner_id: Scalars['String'];
  /** An object relationship */
  previous_deck?: Maybe<Campaign_Deck>;
  /** An array relationship */
  previous_decks: Array<Campaign_Deck>;
  /** An aggregate relationship */
  previous_decks_aggregate: Campaign_Deck_Aggregate;
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "campaign_deck" */
export type Campaign_DeckContentArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "campaign_deck" */
export type Campaign_DeckOther_DecksArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


/** columns and relationships of "campaign_deck" */
export type Campaign_DeckOther_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


/** columns and relationships of "campaign_deck" */
export type Campaign_DeckPrevious_DecksArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


/** columns and relationships of "campaign_deck" */
export type Campaign_DeckPrevious_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};

/** aggregated selection of "campaign_deck" */
export type Campaign_Deck_Aggregate = {
  __typename?: 'campaign_deck_aggregate';
  aggregate?: Maybe<Campaign_Deck_Aggregate_Fields>;
  nodes: Array<Campaign_Deck>;
};

/** aggregate fields of "campaign_deck" */
export type Campaign_Deck_Aggregate_Fields = {
  __typename?: 'campaign_deck_aggregate_fields';
  avg?: Maybe<Campaign_Deck_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Campaign_Deck_Max_Fields>;
  min?: Maybe<Campaign_Deck_Min_Fields>;
  stddev?: Maybe<Campaign_Deck_Stddev_Fields>;
  stddev_pop?: Maybe<Campaign_Deck_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Campaign_Deck_Stddev_Samp_Fields>;
  sum?: Maybe<Campaign_Deck_Sum_Fields>;
  var_pop?: Maybe<Campaign_Deck_Var_Pop_Fields>;
  var_samp?: Maybe<Campaign_Deck_Var_Samp_Fields>;
  variance?: Maybe<Campaign_Deck_Variance_Fields>;
};


/** aggregate fields of "campaign_deck" */
export type Campaign_Deck_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "campaign_deck" */
export type Campaign_Deck_Aggregate_Order_By = {
  avg?: InputMaybe<Campaign_Deck_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Campaign_Deck_Max_Order_By>;
  min?: InputMaybe<Campaign_Deck_Min_Order_By>;
  stddev?: InputMaybe<Campaign_Deck_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Campaign_Deck_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Campaign_Deck_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Campaign_Deck_Sum_Order_By>;
  var_pop?: InputMaybe<Campaign_Deck_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Campaign_Deck_Var_Samp_Order_By>;
  variance?: InputMaybe<Campaign_Deck_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Campaign_Deck_Append_Input = {
  content?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "campaign_deck" */
export type Campaign_Deck_Arr_Rel_Insert_Input = {
  data: Array<Campaign_Deck_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Campaign_Deck_On_Conflict>;
};

/** aggregate avg on columns */
export type Campaign_Deck_Avg_Fields = {
  __typename?: 'campaign_deck_avg_fields';
  arkhamdb_id?: Maybe<Scalars['Float']>;
  arkhamdb_user?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  next_deck_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "campaign_deck" */
export type Campaign_Deck_Avg_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "campaign_deck". All fields are combined with a logical 'AND'. */
export type Campaign_Deck_Bool_Exp = {
  _and?: InputMaybe<Array<Campaign_Deck_Bool_Exp>>;
  _not?: InputMaybe<Campaign_Deck_Bool_Exp>;
  _or?: InputMaybe<Array<Campaign_Deck_Bool_Exp>>;
  arkhamdb_id?: InputMaybe<Int_Comparison_Exp>;
  arkhamdb_user?: InputMaybe<Int_Comparison_Exp>;
  base?: InputMaybe<Boolean_Comparison_Exp>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  content?: InputMaybe<Jsonb_Comparison_Exp>;
  content_hash?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  investigator?: InputMaybe<String_Comparison_Exp>;
  investigator_data?: InputMaybe<Investigator_Data_Bool_Exp>;
  local_uuid?: InputMaybe<String_Comparison_Exp>;
  next_deck?: InputMaybe<Campaign_Deck_Bool_Exp>;
  next_deck_id?: InputMaybe<Int_Comparison_Exp>;
  other_decks?: InputMaybe<Campaign_Deck_Bool_Exp>;
  owner?: InputMaybe<Users_Bool_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  previous_deck?: InputMaybe<Campaign_Deck_Bool_Exp>;
  previous_decks?: InputMaybe<Campaign_Deck_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "campaign_deck" */
export enum Campaign_Deck_Constraint {
  /** unique or primary key constraint */
  DeckArkhamdbIdCampaignIdKey = 'deck_arkhamdb_id_campaign_id_key',
  /** unique or primary key constraint */
  DeckLocalUuidCampaignIdKey = 'deck_local_uuid_campaign_id_key',
  /** unique or primary key constraint */
  DeckPkey = 'deck_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Campaign_Deck_Delete_At_Path_Input = {
  content?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Campaign_Deck_Delete_Elem_Input = {
  content?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Campaign_Deck_Delete_Key_Input = {
  content?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "campaign_deck" */
export type Campaign_Deck_Inc_Input = {
  arkhamdb_id?: InputMaybe<Scalars['Int']>;
  arkhamdb_user?: InputMaybe<Scalars['Int']>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  next_deck_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "campaign_deck" */
export type Campaign_Deck_Insert_Input = {
  arkhamdb_id?: InputMaybe<Scalars['Int']>;
  arkhamdb_user?: InputMaybe<Scalars['Int']>;
  base?: InputMaybe<Scalars['Boolean']>;
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  content?: InputMaybe<Scalars['jsonb']>;
  content_hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  investigator?: InputMaybe<Scalars['String']>;
  investigator_data?: InputMaybe<Investigator_Data_Obj_Rel_Insert_Input>;
  local_uuid?: InputMaybe<Scalars['String']>;
  next_deck?: InputMaybe<Campaign_Deck_Obj_Rel_Insert_Input>;
  next_deck_id?: InputMaybe<Scalars['Int']>;
  other_decks?: InputMaybe<Campaign_Deck_Arr_Rel_Insert_Input>;
  owner?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  owner_id?: InputMaybe<Scalars['String']>;
  previous_deck?: InputMaybe<Campaign_Deck_Obj_Rel_Insert_Input>;
  previous_decks?: InputMaybe<Campaign_Deck_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Campaign_Deck_Max_Fields = {
  __typename?: 'campaign_deck_max_fields';
  arkhamdb_id?: Maybe<Scalars['Int']>;
  arkhamdb_user?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  content_hash?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  investigator?: Maybe<Scalars['String']>;
  local_uuid?: Maybe<Scalars['String']>;
  next_deck_id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "campaign_deck" */
export type Campaign_Deck_Max_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  content_hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  local_uuid?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Campaign_Deck_Min_Fields = {
  __typename?: 'campaign_deck_min_fields';
  arkhamdb_id?: Maybe<Scalars['Int']>;
  arkhamdb_user?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  content_hash?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  investigator?: Maybe<Scalars['String']>;
  local_uuid?: Maybe<Scalars['String']>;
  next_deck_id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "campaign_deck" */
export type Campaign_Deck_Min_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  content_hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  local_uuid?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "campaign_deck" */
export type Campaign_Deck_Mutation_Response = {
  __typename?: 'campaign_deck_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Campaign_Deck>;
};

/** input type for inserting object relation for remote table "campaign_deck" */
export type Campaign_Deck_Obj_Rel_Insert_Input = {
  data: Campaign_Deck_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Campaign_Deck_On_Conflict>;
};

/** on conflict condition type for table "campaign_deck" */
export type Campaign_Deck_On_Conflict = {
  constraint: Campaign_Deck_Constraint;
  update_columns: Array<Campaign_Deck_Update_Column>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};

/** Ordering options when selecting data from "campaign_deck". */
export type Campaign_Deck_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  base?: InputMaybe<Order_By>;
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  content_hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  investigator_data?: InputMaybe<Investigator_Data_Order_By>;
  local_uuid?: InputMaybe<Order_By>;
  next_deck?: InputMaybe<Campaign_Deck_Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
  other_decks_aggregate?: InputMaybe<Campaign_Deck_Aggregate_Order_By>;
  owner?: InputMaybe<Users_Order_By>;
  owner_id?: InputMaybe<Order_By>;
  previous_deck?: InputMaybe<Campaign_Deck_Order_By>;
  previous_decks_aggregate?: InputMaybe<Campaign_Deck_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: campaign_deck */
export type Campaign_Deck_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Campaign_Deck_Prepend_Input = {
  content?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "campaign_deck" */
export enum Campaign_Deck_Select_Column {
  /** column name */
  ArkhamdbId = 'arkhamdb_id',
  /** column name */
  ArkhamdbUser = 'arkhamdb_user',
  /** column name */
  Base = 'base',
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Content = 'content',
  /** column name */
  ContentHash = 'content_hash',
  /** column name */
  Id = 'id',
  /** column name */
  Investigator = 'investigator',
  /** column name */
  LocalUuid = 'local_uuid',
  /** column name */
  NextDeckId = 'next_deck_id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "campaign_deck" */
export type Campaign_Deck_Set_Input = {
  arkhamdb_id?: InputMaybe<Scalars['Int']>;
  arkhamdb_user?: InputMaybe<Scalars['Int']>;
  base?: InputMaybe<Scalars['Boolean']>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  content?: InputMaybe<Scalars['jsonb']>;
  content_hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  investigator?: InputMaybe<Scalars['String']>;
  local_uuid?: InputMaybe<Scalars['String']>;
  next_deck_id?: InputMaybe<Scalars['Int']>;
  owner_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Campaign_Deck_Stddev_Fields = {
  __typename?: 'campaign_deck_stddev_fields';
  arkhamdb_id?: Maybe<Scalars['Float']>;
  arkhamdb_user?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  next_deck_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "campaign_deck" */
export type Campaign_Deck_Stddev_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Campaign_Deck_Stddev_Pop_Fields = {
  __typename?: 'campaign_deck_stddev_pop_fields';
  arkhamdb_id?: Maybe<Scalars['Float']>;
  arkhamdb_user?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  next_deck_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "campaign_deck" */
export type Campaign_Deck_Stddev_Pop_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Campaign_Deck_Stddev_Samp_Fields = {
  __typename?: 'campaign_deck_stddev_samp_fields';
  arkhamdb_id?: Maybe<Scalars['Float']>;
  arkhamdb_user?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  next_deck_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "campaign_deck" */
export type Campaign_Deck_Stddev_Samp_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Campaign_Deck_Sum_Fields = {
  __typename?: 'campaign_deck_sum_fields';
  arkhamdb_id?: Maybe<Scalars['Int']>;
  arkhamdb_user?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  next_deck_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "campaign_deck" */
export type Campaign_Deck_Sum_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** update columns of table "campaign_deck" */
export enum Campaign_Deck_Update_Column {
  /** column name */
  ArkhamdbId = 'arkhamdb_id',
  /** column name */
  ArkhamdbUser = 'arkhamdb_user',
  /** column name */
  Base = 'base',
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Content = 'content',
  /** column name */
  ContentHash = 'content_hash',
  /** column name */
  Id = 'id',
  /** column name */
  Investigator = 'investigator',
  /** column name */
  LocalUuid = 'local_uuid',
  /** column name */
  NextDeckId = 'next_deck_id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Campaign_Deck_Var_Pop_Fields = {
  __typename?: 'campaign_deck_var_pop_fields';
  arkhamdb_id?: Maybe<Scalars['Float']>;
  arkhamdb_user?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  next_deck_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "campaign_deck" */
export type Campaign_Deck_Var_Pop_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Campaign_Deck_Var_Samp_Fields = {
  __typename?: 'campaign_deck_var_samp_fields';
  arkhamdb_id?: Maybe<Scalars['Float']>;
  arkhamdb_user?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  next_deck_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "campaign_deck" */
export type Campaign_Deck_Var_Samp_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Campaign_Deck_Variance_Fields = {
  __typename?: 'campaign_deck_variance_fields';
  arkhamdb_id?: Maybe<Scalars['Float']>;
  arkhamdb_user?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  next_deck_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "campaign_deck" */
export type Campaign_Deck_Variance_Order_By = {
  arkhamdb_id?: InputMaybe<Order_By>;
  arkhamdb_user?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  next_deck_id?: InputMaybe<Order_By>;
};

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Campaign_Delete_At_Path_Input = {
  campaignNotes?: InputMaybe<Array<Scalars['String']>>;
  chaosBag?: InputMaybe<Array<Scalars['String']>>;
  scenarioResults?: InputMaybe<Array<Scalars['String']>>;
  standaloneId?: InputMaybe<Array<Scalars['String']>>;
  weaknessSet?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Campaign_Delete_Elem_Input = {
  campaignNotes?: InputMaybe<Scalars['Int']>;
  chaosBag?: InputMaybe<Scalars['Int']>;
  scenarioResults?: InputMaybe<Scalars['Int']>;
  standaloneId?: InputMaybe<Scalars['Int']>;
  weaknessSet?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Campaign_Delete_Key_Input = {
  campaignNotes?: InputMaybe<Scalars['String']>;
  chaosBag?: InputMaybe<Scalars['String']>;
  scenarioResults?: InputMaybe<Scalars['String']>;
  standaloneId?: InputMaybe<Scalars['String']>;
  weaknessSet?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "campaign_guide" */
export type Campaign_Guide = {
  __typename?: 'campaign_guide';
  /** An array relationship */
  access: Array<Campaign_Access>;
  /** An aggregate relationship */
  access_aggregate: Campaign_Access_Aggregate;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  guide_achievements: Array<Guide_Achievement>;
  /** An aggregate relationship */
  guide_achievements_aggregate: Guide_Achievement_Aggregate;
  /** An array relationship */
  guide_inputs: Array<Guide_Input>;
  /** An aggregate relationship */
  guide_inputs_aggregate: Guide_Input_Aggregate;
  id?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
};


/** columns and relationships of "campaign_guide" */
export type Campaign_GuideAccessArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


/** columns and relationships of "campaign_guide" */
export type Campaign_GuideAccess_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


/** columns and relationships of "campaign_guide" */
export type Campaign_GuideGuide_AchievementsArgs = {
  distinct_on?: InputMaybe<Array<Guide_Achievement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Achievement_Order_By>>;
  where?: InputMaybe<Guide_Achievement_Bool_Exp>;
};


/** columns and relationships of "campaign_guide" */
export type Campaign_GuideGuide_Achievements_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guide_Achievement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Achievement_Order_By>>;
  where?: InputMaybe<Guide_Achievement_Bool_Exp>;
};


/** columns and relationships of "campaign_guide" */
export type Campaign_GuideGuide_InputsArgs = {
  distinct_on?: InputMaybe<Array<Guide_Input_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Input_Order_By>>;
  where?: InputMaybe<Guide_Input_Bool_Exp>;
};


/** columns and relationships of "campaign_guide" */
export type Campaign_GuideGuide_Inputs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guide_Input_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Input_Order_By>>;
  where?: InputMaybe<Guide_Input_Bool_Exp>;
};

/** aggregated selection of "campaign_guide" */
export type Campaign_Guide_Aggregate = {
  __typename?: 'campaign_guide_aggregate';
  aggregate?: Maybe<Campaign_Guide_Aggregate_Fields>;
  nodes: Array<Campaign_Guide>;
};

/** aggregate fields of "campaign_guide" */
export type Campaign_Guide_Aggregate_Fields = {
  __typename?: 'campaign_guide_aggregate_fields';
  avg?: Maybe<Campaign_Guide_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Campaign_Guide_Max_Fields>;
  min?: Maybe<Campaign_Guide_Min_Fields>;
  stddev?: Maybe<Campaign_Guide_Stddev_Fields>;
  stddev_pop?: Maybe<Campaign_Guide_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Campaign_Guide_Stddev_Samp_Fields>;
  sum?: Maybe<Campaign_Guide_Sum_Fields>;
  var_pop?: Maybe<Campaign_Guide_Var_Pop_Fields>;
  var_samp?: Maybe<Campaign_Guide_Var_Samp_Fields>;
  variance?: Maybe<Campaign_Guide_Variance_Fields>;
};


/** aggregate fields of "campaign_guide" */
export type Campaign_Guide_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Campaign_Guide_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Campaign_Guide_Avg_Fields = {
  __typename?: 'campaign_guide_avg_fields';
  id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "campaign_guide". All fields are combined with a logical 'AND'. */
export type Campaign_Guide_Bool_Exp = {
  _and?: InputMaybe<Array<Campaign_Guide_Bool_Exp>>;
  _not?: InputMaybe<Campaign_Guide_Bool_Exp>;
  _or?: InputMaybe<Array<Campaign_Guide_Bool_Exp>>;
  access?: InputMaybe<Campaign_Access_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  guide_achievements?: InputMaybe<Guide_Achievement_Bool_Exp>;
  guide_inputs?: InputMaybe<Guide_Input_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  owner?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  uuid?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "campaign_guide" */
export type Campaign_Guide_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "campaign_guide" */
export type Campaign_Guide_Insert_Input = {
  access?: InputMaybe<Campaign_Access_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  guide_achievements?: InputMaybe<Guide_Achievement_Arr_Rel_Insert_Input>;
  guide_inputs?: InputMaybe<Guide_Input_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uuid?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Campaign_Guide_Max_Fields = {
  __typename?: 'campaign_guide_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Campaign_Guide_Min_Fields = {
  __typename?: 'campaign_guide_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "campaign_guide" */
export type Campaign_Guide_Mutation_Response = {
  __typename?: 'campaign_guide_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Campaign_Guide>;
};

/** input type for inserting object relation for remote table "campaign_guide" */
export type Campaign_Guide_Obj_Rel_Insert_Input = {
  data: Campaign_Guide_Insert_Input;
};

/** Ordering options when selecting data from "campaign_guide". */
export type Campaign_Guide_Order_By = {
  access_aggregate?: InputMaybe<Campaign_Access_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  guide_achievements_aggregate?: InputMaybe<Guide_Achievement_Aggregate_Order_By>;
  guide_inputs_aggregate?: InputMaybe<Guide_Input_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uuid?: InputMaybe<Order_By>;
};

/** select columns of table "campaign_guide" */
export enum Campaign_Guide_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Owner = 'owner',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Uuid = 'uuid'
}

/** input type for updating data in table "campaign_guide" */
export type Campaign_Guide_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uuid?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Campaign_Guide_Stddev_Fields = {
  __typename?: 'campaign_guide_stddev_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Campaign_Guide_Stddev_Pop_Fields = {
  __typename?: 'campaign_guide_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Campaign_Guide_Stddev_Samp_Fields = {
  __typename?: 'campaign_guide_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Campaign_Guide_Sum_Fields = {
  __typename?: 'campaign_guide_sum_fields';
  id?: Maybe<Scalars['Int']>;
};

/** aggregate var_pop on columns */
export type Campaign_Guide_Var_Pop_Fields = {
  __typename?: 'campaign_guide_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Campaign_Guide_Var_Samp_Fields = {
  __typename?: 'campaign_guide_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Campaign_Guide_Variance_Fields = {
  __typename?: 'campaign_guide_variance_fields';
  id?: Maybe<Scalars['Float']>;
};

/** input type for incrementing numeric columns in table "campaign" */
export type Campaign_Inc_Input = {
  guide_version?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  link_a_campaign_id?: InputMaybe<Scalars['Int']>;
  link_b_campaign_id?: InputMaybe<Scalars['Int']>;
  link_campaign_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "campaign" */
export type Campaign_Insert_Input = {
  access?: InputMaybe<Campaign_Access_Arr_Rel_Insert_Input>;
  archived?: InputMaybe<Scalars['Boolean']>;
  base_decks?: InputMaybe<Base_Decks_Arr_Rel_Insert_Input>;
  campaignNotes?: InputMaybe<Scalars['jsonb']>;
  campaign_guide?: InputMaybe<Campaign_Guide_Obj_Rel_Insert_Input>;
  chaosBag?: InputMaybe<Scalars['jsonb']>;
  chaos_bag_result?: InputMaybe<Chaos_Bag_Result_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  cycleCode?: InputMaybe<Scalars['String']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  difficulty?: InputMaybe<Scalars['String']>;
  guide_version?: InputMaybe<Scalars['Int']>;
  guided?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  investigator_data?: InputMaybe<Investigator_Data_Arr_Rel_Insert_Input>;
  investigators?: InputMaybe<Campaign_Investigator_Arr_Rel_Insert_Input>;
  latest_decks?: InputMaybe<Latest_Decks_Arr_Rel_Insert_Input>;
  link_a_campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  link_a_campaign_id?: InputMaybe<Scalars['Int']>;
  link_b_campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  link_b_campaign_id?: InputMaybe<Scalars['Int']>;
  link_campaign_id?: InputMaybe<Scalars['Int']>;
  linked_campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  owner_id?: InputMaybe<Scalars['String']>;
  scenarioResults?: InputMaybe<Scalars['jsonb']>;
  showInterludes?: InputMaybe<Scalars['Boolean']>;
  standaloneId?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uuid?: InputMaybe<Scalars['String']>;
  weaknessSet?: InputMaybe<Scalars['jsonb']>;
};

/** columns and relationships of "campaign_investigator" */
export type Campaign_Investigator = {
  __typename?: 'campaign_investigator';
  /** An object relationship */
  campaign: Campaign;
  campaign_id: Scalars['Int'];
  created_at: Scalars['timestamptz'];
  /** A computed field, executes function "campaign_investigator_id" */
  id?: Maybe<Scalars['String']>;
  investigator: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "campaign_investigator" */
export type Campaign_Investigator_Aggregate = {
  __typename?: 'campaign_investigator_aggregate';
  aggregate?: Maybe<Campaign_Investigator_Aggregate_Fields>;
  nodes: Array<Campaign_Investigator>;
};

/** aggregate fields of "campaign_investigator" */
export type Campaign_Investigator_Aggregate_Fields = {
  __typename?: 'campaign_investigator_aggregate_fields';
  avg?: Maybe<Campaign_Investigator_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Campaign_Investigator_Max_Fields>;
  min?: Maybe<Campaign_Investigator_Min_Fields>;
  stddev?: Maybe<Campaign_Investigator_Stddev_Fields>;
  stddev_pop?: Maybe<Campaign_Investigator_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Campaign_Investigator_Stddev_Samp_Fields>;
  sum?: Maybe<Campaign_Investigator_Sum_Fields>;
  var_pop?: Maybe<Campaign_Investigator_Var_Pop_Fields>;
  var_samp?: Maybe<Campaign_Investigator_Var_Samp_Fields>;
  variance?: Maybe<Campaign_Investigator_Variance_Fields>;
};


/** aggregate fields of "campaign_investigator" */
export type Campaign_Investigator_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Campaign_Investigator_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "campaign_investigator" */
export type Campaign_Investigator_Aggregate_Order_By = {
  avg?: InputMaybe<Campaign_Investigator_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Campaign_Investigator_Max_Order_By>;
  min?: InputMaybe<Campaign_Investigator_Min_Order_By>;
  stddev?: InputMaybe<Campaign_Investigator_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Campaign_Investigator_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Campaign_Investigator_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Campaign_Investigator_Sum_Order_By>;
  var_pop?: InputMaybe<Campaign_Investigator_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Campaign_Investigator_Var_Samp_Order_By>;
  variance?: InputMaybe<Campaign_Investigator_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "campaign_investigator" */
export type Campaign_Investigator_Arr_Rel_Insert_Input = {
  data: Array<Campaign_Investigator_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Campaign_Investigator_On_Conflict>;
};

/** aggregate avg on columns */
export type Campaign_Investigator_Avg_Fields = {
  __typename?: 'campaign_investigator_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "campaign_investigator". All fields are combined with a logical 'AND'. */
export type Campaign_Investigator_Bool_Exp = {
  _and?: InputMaybe<Array<Campaign_Investigator_Bool_Exp>>;
  _not?: InputMaybe<Campaign_Investigator_Bool_Exp>;
  _or?: InputMaybe<Array<Campaign_Investigator_Bool_Exp>>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  investigator?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "campaign_investigator" */
export enum Campaign_Investigator_Constraint {
  /** unique or primary key constraint */
  CampaignInvestigatorCampaignIdInvestigatorKey = 'campaign_investigator_campaign_id_investigator_key',
  /** unique or primary key constraint */
  CampaignInvestigatorPkey = 'campaign_investigator_pkey'
}

/** input type for incrementing numeric columns in table "campaign_investigator" */
export type Campaign_Investigator_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "campaign_investigator" */
export type Campaign_Investigator_Insert_Input = {
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  investigator?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Campaign_Investigator_Max_Fields = {
  __typename?: 'campaign_investigator_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  investigator?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Campaign_Investigator_Min_Fields = {
  __typename?: 'campaign_investigator_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  investigator?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "campaign_investigator" */
export type Campaign_Investigator_Mutation_Response = {
  __typename?: 'campaign_investigator_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Campaign_Investigator>;
};

/** on conflict condition type for table "campaign_investigator" */
export type Campaign_Investigator_On_Conflict = {
  constraint: Campaign_Investigator_Constraint;
  update_columns: Array<Campaign_Investigator_Update_Column>;
  where?: InputMaybe<Campaign_Investigator_Bool_Exp>;
};

/** Ordering options when selecting data from "campaign_investigator". */
export type Campaign_Investigator_Order_By = {
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: campaign_investigator */
export type Campaign_Investigator_Pk_Columns_Input = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};

/** select columns of table "campaign_investigator" */
export enum Campaign_Investigator_Select_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Investigator = 'investigator',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "campaign_investigator" */
export type Campaign_Investigator_Set_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  investigator?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Campaign_Investigator_Stddev_Fields = {
  __typename?: 'campaign_investigator_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Campaign_Investigator_Stddev_Pop_Fields = {
  __typename?: 'campaign_investigator_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Campaign_Investigator_Stddev_Samp_Fields = {
  __typename?: 'campaign_investigator_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Campaign_Investigator_Sum_Fields = {
  __typename?: 'campaign_investigator_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** update columns of table "campaign_investigator" */
export enum Campaign_Investigator_Update_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Investigator = 'investigator',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Campaign_Investigator_Var_Pop_Fields = {
  __typename?: 'campaign_investigator_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Campaign_Investigator_Var_Samp_Fields = {
  __typename?: 'campaign_investigator_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Campaign_Investigator_Variance_Fields = {
  __typename?: 'campaign_investigator_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "campaign_investigator" */
export type Campaign_Investigator_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate max on columns */
export type Campaign_Max_Fields = {
  __typename?: 'campaign_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  cycleCode?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['String']>;
  guide_version?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  link_campaign_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Campaign_Min_Fields = {
  __typename?: 'campaign_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  cycleCode?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['String']>;
  guide_version?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  link_campaign_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "campaign" */
export type Campaign_Mutation_Response = {
  __typename?: 'campaign_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Campaign>;
};

/** input type for inserting object relation for remote table "campaign" */
export type Campaign_Obj_Rel_Insert_Input = {
  data: Campaign_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Campaign_On_Conflict>;
};

/** on conflict condition type for table "campaign" */
export type Campaign_On_Conflict = {
  constraint: Campaign_Constraint;
  update_columns: Array<Campaign_Update_Column>;
  where?: InputMaybe<Campaign_Bool_Exp>;
};

/** Ordering options when selecting data from "campaign". */
export type Campaign_Order_By = {
  access_aggregate?: InputMaybe<Campaign_Access_Aggregate_Order_By>;
  archived?: InputMaybe<Order_By>;
  base_decks_aggregate?: InputMaybe<Base_Decks_Aggregate_Order_By>;
  campaignNotes?: InputMaybe<Order_By>;
  campaign_guide?: InputMaybe<Campaign_Guide_Order_By>;
  chaosBag?: InputMaybe<Order_By>;
  chaos_bag_result_aggregate?: InputMaybe<Chaos_Bag_Result_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  cycleCode?: InputMaybe<Order_By>;
  deleted?: InputMaybe<Order_By>;
  difficulty?: InputMaybe<Order_By>;
  guide_version?: InputMaybe<Order_By>;
  guided?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  investigator_data_aggregate?: InputMaybe<Investigator_Data_Aggregate_Order_By>;
  investigators_aggregate?: InputMaybe<Campaign_Investigator_Aggregate_Order_By>;
  latest_decks_aggregate?: InputMaybe<Latest_Decks_Aggregate_Order_By>;
  link_a_campaign?: InputMaybe<Campaign_Order_By>;
  link_a_campaign_id?: InputMaybe<Order_By>;
  link_b_campaign?: InputMaybe<Campaign_Order_By>;
  link_b_campaign_id?: InputMaybe<Order_By>;
  link_campaign_id?: InputMaybe<Order_By>;
  linked_campaign?: InputMaybe<Campaign_Order_By>;
  name?: InputMaybe<Order_By>;
  owner?: InputMaybe<Users_Order_By>;
  owner_id?: InputMaybe<Order_By>;
  scenarioResults?: InputMaybe<Order_By>;
  showInterludes?: InputMaybe<Order_By>;
  standaloneId?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uuid?: InputMaybe<Order_By>;
  weaknessSet?: InputMaybe<Order_By>;
};

/** primary key columns input for table: campaign */
export type Campaign_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Campaign_Prepend_Input = {
  campaignNotes?: InputMaybe<Scalars['jsonb']>;
  chaosBag?: InputMaybe<Scalars['jsonb']>;
  scenarioResults?: InputMaybe<Scalars['jsonb']>;
  standaloneId?: InputMaybe<Scalars['jsonb']>;
  weaknessSet?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "campaign" */
export enum Campaign_Select_Column {
  /** column name */
  Archived = 'archived',
  /** column name */
  CampaignNotes = 'campaignNotes',
  /** column name */
  ChaosBag = 'chaosBag',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CycleCode = 'cycleCode',
  /** column name */
  Deleted = 'deleted',
  /** column name */
  Difficulty = 'difficulty',
  /** column name */
  GuideVersion = 'guide_version',
  /** column name */
  Guided = 'guided',
  /** column name */
  Id = 'id',
  /** column name */
  LinkACampaignId = 'link_a_campaign_id',
  /** column name */
  LinkBCampaignId = 'link_b_campaign_id',
  /** column name */
  LinkCampaignId = 'link_campaign_id',
  /** column name */
  Name = 'name',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  ScenarioResults = 'scenarioResults',
  /** column name */
  ShowInterludes = 'showInterludes',
  /** column name */
  StandaloneId = 'standaloneId',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Uuid = 'uuid',
  /** column name */
  WeaknessSet = 'weaknessSet'
}

/** input type for updating data in table "campaign" */
export type Campaign_Set_Input = {
  archived?: InputMaybe<Scalars['Boolean']>;
  campaignNotes?: InputMaybe<Scalars['jsonb']>;
  chaosBag?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  cycleCode?: InputMaybe<Scalars['String']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  difficulty?: InputMaybe<Scalars['String']>;
  guide_version?: InputMaybe<Scalars['Int']>;
  guided?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  link_a_campaign_id?: InputMaybe<Scalars['Int']>;
  link_b_campaign_id?: InputMaybe<Scalars['Int']>;
  link_campaign_id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  owner_id?: InputMaybe<Scalars['String']>;
  scenarioResults?: InputMaybe<Scalars['jsonb']>;
  showInterludes?: InputMaybe<Scalars['Boolean']>;
  standaloneId?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uuid?: InputMaybe<Scalars['String']>;
  weaknessSet?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate stddev on columns */
export type Campaign_Stddev_Fields = {
  __typename?: 'campaign_stddev_fields';
  guide_version?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
  link_campaign_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Campaign_Stddev_Pop_Fields = {
  __typename?: 'campaign_stddev_pop_fields';
  guide_version?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
  link_campaign_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Campaign_Stddev_Samp_Fields = {
  __typename?: 'campaign_stddev_samp_fields';
  guide_version?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
  link_campaign_id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Campaign_Sum_Fields = {
  __typename?: 'campaign_sum_fields';
  guide_version?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  link_campaign_id?: Maybe<Scalars['Int']>;
};

/** update columns of table "campaign" */
export enum Campaign_Update_Column {
  /** column name */
  Archived = 'archived',
  /** column name */
  CampaignNotes = 'campaignNotes',
  /** column name */
  ChaosBag = 'chaosBag',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CycleCode = 'cycleCode',
  /** column name */
  Deleted = 'deleted',
  /** column name */
  Difficulty = 'difficulty',
  /** column name */
  GuideVersion = 'guide_version',
  /** column name */
  Guided = 'guided',
  /** column name */
  Id = 'id',
  /** column name */
  LinkACampaignId = 'link_a_campaign_id',
  /** column name */
  LinkBCampaignId = 'link_b_campaign_id',
  /** column name */
  LinkCampaignId = 'link_campaign_id',
  /** column name */
  Name = 'name',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  ScenarioResults = 'scenarioResults',
  /** column name */
  ShowInterludes = 'showInterludes',
  /** column name */
  StandaloneId = 'standaloneId',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Uuid = 'uuid',
  /** column name */
  WeaknessSet = 'weaknessSet'
}

/** aggregate var_pop on columns */
export type Campaign_Var_Pop_Fields = {
  __typename?: 'campaign_var_pop_fields';
  guide_version?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
  link_campaign_id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Campaign_Var_Samp_Fields = {
  __typename?: 'campaign_var_samp_fields';
  guide_version?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
  link_campaign_id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Campaign_Variance_Fields = {
  __typename?: 'campaign_variance_fields';
  guide_version?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
  link_campaign_id?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "card" */
export type Card = {
  __typename?: 'card';
  clues?: Maybe<Scalars['Int']>;
  code: Scalars['String'];
  cost?: Maybe<Scalars['Int']>;
  deck_limit?: Maybe<Scalars['Int']>;
  doom?: Maybe<Scalars['Int']>;
  double_sided?: Maybe<Scalars['Boolean']>;
  encounter_code?: Maybe<Scalars['String']>;
  encounter_position?: Maybe<Scalars['Int']>;
  exceptional?: Maybe<Scalars['Boolean']>;
  exile?: Maybe<Scalars['Boolean']>;
  faction_code: Scalars['String'];
  health?: Maybe<Scalars['Int']>;
  illustrator?: Maybe<Scalars['String']>;
  is_unique?: Maybe<Scalars['Boolean']>;
  myriad?: Maybe<Scalars['Boolean']>;
  pack_code: Scalars['String'];
  pack_position: Scalars['Int'];
  /** An array relationship */
  packs: Array<Card_Pack>;
  /** An aggregate relationship */
  packs_aggregate: Card_Pack_Aggregate;
  permanent?: Maybe<Scalars['Boolean']>;
  position: Scalars['Int'];
  quantity: Scalars['Int'];
  real_back_flavor?: Maybe<Scalars['String']>;
  real_back_name?: Maybe<Scalars['String']>;
  real_back_text?: Maybe<Scalars['String']>;
  real_flavor?: Maybe<Scalars['String']>;
  real_name: Scalars['String'];
  real_pack_name: Scalars['String'];
  real_slot?: Maybe<Scalars['String']>;
  real_subname?: Maybe<Scalars['String']>;
  real_text?: Maybe<Scalars['String']>;
  real_traits?: Maybe<Scalars['String']>;
  sanity?: Maybe<Scalars['Int']>;
  skill_agility?: Maybe<Scalars['Int']>;
  skill_combat?: Maybe<Scalars['Int']>;
  skill_intellect?: Maybe<Scalars['Int']>;
  skill_wild?: Maybe<Scalars['Int']>;
  skill_willpower?: Maybe<Scalars['Int']>;
  stage?: Maybe<Scalars['Int']>;
  subtype_code?: Maybe<Scalars['String']>;
  /** An array relationship */
  translations: Array<Card_Text>;
  /** An aggregate relationship */
  translations_aggregate: Card_Text_Aggregate;
  type_code: Scalars['String'];
};


/** columns and relationships of "card" */
export type CardPacksArgs = {
  distinct_on?: InputMaybe<Array<Card_Pack_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Pack_Order_By>>;
  where?: InputMaybe<Card_Pack_Bool_Exp>;
};


/** columns and relationships of "card" */
export type CardPacks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Pack_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Pack_Order_By>>;
  where?: InputMaybe<Card_Pack_Bool_Exp>;
};


/** columns and relationships of "card" */
export type CardTranslationsArgs = {
  distinct_on?: InputMaybe<Array<Card_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Text_Order_By>>;
  where?: InputMaybe<Card_Text_Bool_Exp>;
};


/** columns and relationships of "card" */
export type CardTranslations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Text_Order_By>>;
  where?: InputMaybe<Card_Text_Bool_Exp>;
};

/** aggregated selection of "card" */
export type Card_Aggregate = {
  __typename?: 'card_aggregate';
  aggregate?: Maybe<Card_Aggregate_Fields>;
  nodes: Array<Card>;
};

/** aggregate fields of "card" */
export type Card_Aggregate_Fields = {
  __typename?: 'card_aggregate_fields';
  avg?: Maybe<Card_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Card_Max_Fields>;
  min?: Maybe<Card_Min_Fields>;
  stddev?: Maybe<Card_Stddev_Fields>;
  stddev_pop?: Maybe<Card_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Card_Stddev_Samp_Fields>;
  sum?: Maybe<Card_Sum_Fields>;
  var_pop?: Maybe<Card_Var_Pop_Fields>;
  var_samp?: Maybe<Card_Var_Samp_Fields>;
  variance?: Maybe<Card_Variance_Fields>;
};


/** aggregate fields of "card" */
export type Card_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Card_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Card_Avg_Fields = {
  __typename?: 'card_avg_fields';
  clues?: Maybe<Scalars['Float']>;
  cost?: Maybe<Scalars['Float']>;
  deck_limit?: Maybe<Scalars['Float']>;
  doom?: Maybe<Scalars['Float']>;
  encounter_position?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  pack_position?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  sanity?: Maybe<Scalars['Float']>;
  skill_agility?: Maybe<Scalars['Float']>;
  skill_combat?: Maybe<Scalars['Float']>;
  skill_intellect?: Maybe<Scalars['Float']>;
  skill_wild?: Maybe<Scalars['Float']>;
  skill_willpower?: Maybe<Scalars['Float']>;
  stage?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "card". All fields are combined with a logical 'AND'. */
export type Card_Bool_Exp = {
  _and?: InputMaybe<Array<Card_Bool_Exp>>;
  _not?: InputMaybe<Card_Bool_Exp>;
  _or?: InputMaybe<Array<Card_Bool_Exp>>;
  clues?: InputMaybe<Int_Comparison_Exp>;
  code?: InputMaybe<String_Comparison_Exp>;
  cost?: InputMaybe<Int_Comparison_Exp>;
  deck_limit?: InputMaybe<Int_Comparison_Exp>;
  doom?: InputMaybe<Int_Comparison_Exp>;
  double_sided?: InputMaybe<Boolean_Comparison_Exp>;
  encounter_code?: InputMaybe<String_Comparison_Exp>;
  encounter_position?: InputMaybe<Int_Comparison_Exp>;
  exceptional?: InputMaybe<Boolean_Comparison_Exp>;
  exile?: InputMaybe<Boolean_Comparison_Exp>;
  faction_code?: InputMaybe<String_Comparison_Exp>;
  health?: InputMaybe<Int_Comparison_Exp>;
  illustrator?: InputMaybe<String_Comparison_Exp>;
  is_unique?: InputMaybe<Boolean_Comparison_Exp>;
  myriad?: InputMaybe<Boolean_Comparison_Exp>;
  pack_code?: InputMaybe<String_Comparison_Exp>;
  pack_position?: InputMaybe<Int_Comparison_Exp>;
  packs?: InputMaybe<Card_Pack_Bool_Exp>;
  permanent?: InputMaybe<Boolean_Comparison_Exp>;
  position?: InputMaybe<Int_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  real_back_flavor?: InputMaybe<String_Comparison_Exp>;
  real_back_name?: InputMaybe<String_Comparison_Exp>;
  real_back_text?: InputMaybe<String_Comparison_Exp>;
  real_flavor?: InputMaybe<String_Comparison_Exp>;
  real_name?: InputMaybe<String_Comparison_Exp>;
  real_pack_name?: InputMaybe<String_Comparison_Exp>;
  real_slot?: InputMaybe<String_Comparison_Exp>;
  real_subname?: InputMaybe<String_Comparison_Exp>;
  real_text?: InputMaybe<String_Comparison_Exp>;
  real_traits?: InputMaybe<String_Comparison_Exp>;
  sanity?: InputMaybe<Int_Comparison_Exp>;
  skill_agility?: InputMaybe<Int_Comparison_Exp>;
  skill_combat?: InputMaybe<Int_Comparison_Exp>;
  skill_intellect?: InputMaybe<Int_Comparison_Exp>;
  skill_wild?: InputMaybe<Int_Comparison_Exp>;
  skill_willpower?: InputMaybe<Int_Comparison_Exp>;
  stage?: InputMaybe<Int_Comparison_Exp>;
  subtype_code?: InputMaybe<String_Comparison_Exp>;
  translations?: InputMaybe<Card_Text_Bool_Exp>;
  type_code?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "card" */
export enum Card_Constraint {
  /** unique or primary key constraint */
  CardPkey = 'card_pkey'
}

/** input type for incrementing numeric columns in table "card" */
export type Card_Inc_Input = {
  clues?: InputMaybe<Scalars['Int']>;
  cost?: InputMaybe<Scalars['Int']>;
  deck_limit?: InputMaybe<Scalars['Int']>;
  doom?: InputMaybe<Scalars['Int']>;
  encounter_position?: InputMaybe<Scalars['Int']>;
  health?: InputMaybe<Scalars['Int']>;
  pack_position?: InputMaybe<Scalars['Int']>;
  position?: InputMaybe<Scalars['Int']>;
  quantity?: InputMaybe<Scalars['Int']>;
  sanity?: InputMaybe<Scalars['Int']>;
  skill_agility?: InputMaybe<Scalars['Int']>;
  skill_combat?: InputMaybe<Scalars['Int']>;
  skill_intellect?: InputMaybe<Scalars['Int']>;
  skill_wild?: InputMaybe<Scalars['Int']>;
  skill_willpower?: InputMaybe<Scalars['Int']>;
  stage?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "card" */
export type Card_Insert_Input = {
  clues?: InputMaybe<Scalars['Int']>;
  code?: InputMaybe<Scalars['String']>;
  cost?: InputMaybe<Scalars['Int']>;
  deck_limit?: InputMaybe<Scalars['Int']>;
  doom?: InputMaybe<Scalars['Int']>;
  double_sided?: InputMaybe<Scalars['Boolean']>;
  encounter_code?: InputMaybe<Scalars['String']>;
  encounter_position?: InputMaybe<Scalars['Int']>;
  exceptional?: InputMaybe<Scalars['Boolean']>;
  exile?: InputMaybe<Scalars['Boolean']>;
  faction_code?: InputMaybe<Scalars['String']>;
  health?: InputMaybe<Scalars['Int']>;
  illustrator?: InputMaybe<Scalars['String']>;
  is_unique?: InputMaybe<Scalars['Boolean']>;
  myriad?: InputMaybe<Scalars['Boolean']>;
  pack_code?: InputMaybe<Scalars['String']>;
  pack_position?: InputMaybe<Scalars['Int']>;
  packs?: InputMaybe<Card_Pack_Arr_Rel_Insert_Input>;
  permanent?: InputMaybe<Scalars['Boolean']>;
  position?: InputMaybe<Scalars['Int']>;
  quantity?: InputMaybe<Scalars['Int']>;
  real_back_flavor?: InputMaybe<Scalars['String']>;
  real_back_name?: InputMaybe<Scalars['String']>;
  real_back_text?: InputMaybe<Scalars['String']>;
  real_flavor?: InputMaybe<Scalars['String']>;
  real_name?: InputMaybe<Scalars['String']>;
  real_pack_name?: InputMaybe<Scalars['String']>;
  real_slot?: InputMaybe<Scalars['String']>;
  real_subname?: InputMaybe<Scalars['String']>;
  real_text?: InputMaybe<Scalars['String']>;
  real_traits?: InputMaybe<Scalars['String']>;
  sanity?: InputMaybe<Scalars['Int']>;
  skill_agility?: InputMaybe<Scalars['Int']>;
  skill_combat?: InputMaybe<Scalars['Int']>;
  skill_intellect?: InputMaybe<Scalars['Int']>;
  skill_wild?: InputMaybe<Scalars['Int']>;
  skill_willpower?: InputMaybe<Scalars['Int']>;
  stage?: InputMaybe<Scalars['Int']>;
  subtype_code?: InputMaybe<Scalars['String']>;
  translations?: InputMaybe<Card_Text_Arr_Rel_Insert_Input>;
  type_code?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Card_Max_Fields = {
  __typename?: 'card_max_fields';
  clues?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  cost?: Maybe<Scalars['Int']>;
  deck_limit?: Maybe<Scalars['Int']>;
  doom?: Maybe<Scalars['Int']>;
  encounter_code?: Maybe<Scalars['String']>;
  encounter_position?: Maybe<Scalars['Int']>;
  faction_code?: Maybe<Scalars['String']>;
  health?: Maybe<Scalars['Int']>;
  illustrator?: Maybe<Scalars['String']>;
  pack_code?: Maybe<Scalars['String']>;
  pack_position?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  real_back_flavor?: Maybe<Scalars['String']>;
  real_back_name?: Maybe<Scalars['String']>;
  real_back_text?: Maybe<Scalars['String']>;
  real_flavor?: Maybe<Scalars['String']>;
  real_name?: Maybe<Scalars['String']>;
  real_pack_name?: Maybe<Scalars['String']>;
  real_slot?: Maybe<Scalars['String']>;
  real_subname?: Maybe<Scalars['String']>;
  real_text?: Maybe<Scalars['String']>;
  real_traits?: Maybe<Scalars['String']>;
  sanity?: Maybe<Scalars['Int']>;
  skill_agility?: Maybe<Scalars['Int']>;
  skill_combat?: Maybe<Scalars['Int']>;
  skill_intellect?: Maybe<Scalars['Int']>;
  skill_wild?: Maybe<Scalars['Int']>;
  skill_willpower?: Maybe<Scalars['Int']>;
  stage?: Maybe<Scalars['Int']>;
  subtype_code?: Maybe<Scalars['String']>;
  type_code?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Card_Min_Fields = {
  __typename?: 'card_min_fields';
  clues?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  cost?: Maybe<Scalars['Int']>;
  deck_limit?: Maybe<Scalars['Int']>;
  doom?: Maybe<Scalars['Int']>;
  encounter_code?: Maybe<Scalars['String']>;
  encounter_position?: Maybe<Scalars['Int']>;
  faction_code?: Maybe<Scalars['String']>;
  health?: Maybe<Scalars['Int']>;
  illustrator?: Maybe<Scalars['String']>;
  pack_code?: Maybe<Scalars['String']>;
  pack_position?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  real_back_flavor?: Maybe<Scalars['String']>;
  real_back_name?: Maybe<Scalars['String']>;
  real_back_text?: Maybe<Scalars['String']>;
  real_flavor?: Maybe<Scalars['String']>;
  real_name?: Maybe<Scalars['String']>;
  real_pack_name?: Maybe<Scalars['String']>;
  real_slot?: Maybe<Scalars['String']>;
  real_subname?: Maybe<Scalars['String']>;
  real_text?: Maybe<Scalars['String']>;
  real_traits?: Maybe<Scalars['String']>;
  sanity?: Maybe<Scalars['Int']>;
  skill_agility?: Maybe<Scalars['Int']>;
  skill_combat?: Maybe<Scalars['Int']>;
  skill_intellect?: Maybe<Scalars['Int']>;
  skill_wild?: Maybe<Scalars['Int']>;
  skill_willpower?: Maybe<Scalars['Int']>;
  stage?: Maybe<Scalars['Int']>;
  subtype_code?: Maybe<Scalars['String']>;
  type_code?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "card" */
export type Card_Mutation_Response = {
  __typename?: 'card_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Card>;
};

/** on conflict condition type for table "card" */
export type Card_On_Conflict = {
  constraint: Card_Constraint;
  update_columns: Array<Card_Update_Column>;
  where?: InputMaybe<Card_Bool_Exp>;
};

/** Ordering options when selecting data from "card". */
export type Card_Order_By = {
  clues?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  cost?: InputMaybe<Order_By>;
  deck_limit?: InputMaybe<Order_By>;
  doom?: InputMaybe<Order_By>;
  double_sided?: InputMaybe<Order_By>;
  encounter_code?: InputMaybe<Order_By>;
  encounter_position?: InputMaybe<Order_By>;
  exceptional?: InputMaybe<Order_By>;
  exile?: InputMaybe<Order_By>;
  faction_code?: InputMaybe<Order_By>;
  health?: InputMaybe<Order_By>;
  illustrator?: InputMaybe<Order_By>;
  is_unique?: InputMaybe<Order_By>;
  myriad?: InputMaybe<Order_By>;
  pack_code?: InputMaybe<Order_By>;
  pack_position?: InputMaybe<Order_By>;
  packs_aggregate?: InputMaybe<Card_Pack_Aggregate_Order_By>;
  permanent?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  real_back_flavor?: InputMaybe<Order_By>;
  real_back_name?: InputMaybe<Order_By>;
  real_back_text?: InputMaybe<Order_By>;
  real_flavor?: InputMaybe<Order_By>;
  real_name?: InputMaybe<Order_By>;
  real_pack_name?: InputMaybe<Order_By>;
  real_slot?: InputMaybe<Order_By>;
  real_subname?: InputMaybe<Order_By>;
  real_text?: InputMaybe<Order_By>;
  real_traits?: InputMaybe<Order_By>;
  sanity?: InputMaybe<Order_By>;
  skill_agility?: InputMaybe<Order_By>;
  skill_combat?: InputMaybe<Order_By>;
  skill_intellect?: InputMaybe<Order_By>;
  skill_wild?: InputMaybe<Order_By>;
  skill_willpower?: InputMaybe<Order_By>;
  stage?: InputMaybe<Order_By>;
  subtype_code?: InputMaybe<Order_By>;
  translations_aggregate?: InputMaybe<Card_Text_Aggregate_Order_By>;
  type_code?: InputMaybe<Order_By>;
};

/** columns and relationships of "card_pack" */
export type Card_Pack = {
  __typename?: 'card_pack';
  code: Scalars['String'];
  locale: Scalars['String'];
  name: Scalars['String'];
};

/** aggregated selection of "card_pack" */
export type Card_Pack_Aggregate = {
  __typename?: 'card_pack_aggregate';
  aggregate?: Maybe<Card_Pack_Aggregate_Fields>;
  nodes: Array<Card_Pack>;
};

/** aggregate fields of "card_pack" */
export type Card_Pack_Aggregate_Fields = {
  __typename?: 'card_pack_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Card_Pack_Max_Fields>;
  min?: Maybe<Card_Pack_Min_Fields>;
};


/** aggregate fields of "card_pack" */
export type Card_Pack_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Card_Pack_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "card_pack" */
export type Card_Pack_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Card_Pack_Max_Order_By>;
  min?: InputMaybe<Card_Pack_Min_Order_By>;
};

/** input type for inserting array relation for remote table "card_pack" */
export type Card_Pack_Arr_Rel_Insert_Input = {
  data: Array<Card_Pack_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Card_Pack_On_Conflict>;
};

/** Boolean expression to filter rows from the table "card_pack". All fields are combined with a logical 'AND'. */
export type Card_Pack_Bool_Exp = {
  _and?: InputMaybe<Array<Card_Pack_Bool_Exp>>;
  _not?: InputMaybe<Card_Pack_Bool_Exp>;
  _or?: InputMaybe<Array<Card_Pack_Bool_Exp>>;
  code?: InputMaybe<String_Comparison_Exp>;
  locale?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "card_pack" */
export enum Card_Pack_Constraint {
  /** unique or primary key constraint */
  CardPackPkey = 'card_pack_pkey'
}

/** input type for inserting data into table "card_pack" */
export type Card_Pack_Insert_Input = {
  code?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Card_Pack_Max_Fields = {
  __typename?: 'card_pack_max_fields';
  code?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "card_pack" */
export type Card_Pack_Max_Order_By = {
  code?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Card_Pack_Min_Fields = {
  __typename?: 'card_pack_min_fields';
  code?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "card_pack" */
export type Card_Pack_Min_Order_By = {
  code?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "card_pack" */
export type Card_Pack_Mutation_Response = {
  __typename?: 'card_pack_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Card_Pack>;
};

/** on conflict condition type for table "card_pack" */
export type Card_Pack_On_Conflict = {
  constraint: Card_Pack_Constraint;
  update_columns: Array<Card_Pack_Update_Column>;
  where?: InputMaybe<Card_Pack_Bool_Exp>;
};

/** Ordering options when selecting data from "card_pack". */
export type Card_Pack_Order_By = {
  code?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: card_pack */
export type Card_Pack_Pk_Columns_Input = {
  code: Scalars['String'];
  locale: Scalars['String'];
};

/** select columns of table "card_pack" */
export enum Card_Pack_Select_Column {
  /** column name */
  Code = 'code',
  /** column name */
  Locale = 'locale',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "card_pack" */
export type Card_Pack_Set_Input = {
  code?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "card_pack" */
export enum Card_Pack_Update_Column {
  /** column name */
  Code = 'code',
  /** column name */
  Locale = 'locale',
  /** column name */
  Name = 'name'
}

/** primary key columns input for table: card */
export type Card_Pk_Columns_Input = {
  code: Scalars['String'];
};

/** select columns of table "card" */
export enum Card_Select_Column {
  /** column name */
  Clues = 'clues',
  /** column name */
  Code = 'code',
  /** column name */
  Cost = 'cost',
  /** column name */
  DeckLimit = 'deck_limit',
  /** column name */
  Doom = 'doom',
  /** column name */
  DoubleSided = 'double_sided',
  /** column name */
  EncounterCode = 'encounter_code',
  /** column name */
  EncounterPosition = 'encounter_position',
  /** column name */
  Exceptional = 'exceptional',
  /** column name */
  Exile = 'exile',
  /** column name */
  FactionCode = 'faction_code',
  /** column name */
  Health = 'health',
  /** column name */
  Illustrator = 'illustrator',
  /** column name */
  IsUnique = 'is_unique',
  /** column name */
  Myriad = 'myriad',
  /** column name */
  PackCode = 'pack_code',
  /** column name */
  PackPosition = 'pack_position',
  /** column name */
  Permanent = 'permanent',
  /** column name */
  Position = 'position',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  RealBackFlavor = 'real_back_flavor',
  /** column name */
  RealBackName = 'real_back_name',
  /** column name */
  RealBackText = 'real_back_text',
  /** column name */
  RealFlavor = 'real_flavor',
  /** column name */
  RealName = 'real_name',
  /** column name */
  RealPackName = 'real_pack_name',
  /** column name */
  RealSlot = 'real_slot',
  /** column name */
  RealSubname = 'real_subname',
  /** column name */
  RealText = 'real_text',
  /** column name */
  RealTraits = 'real_traits',
  /** column name */
  Sanity = 'sanity',
  /** column name */
  SkillAgility = 'skill_agility',
  /** column name */
  SkillCombat = 'skill_combat',
  /** column name */
  SkillIntellect = 'skill_intellect',
  /** column name */
  SkillWild = 'skill_wild',
  /** column name */
  SkillWillpower = 'skill_willpower',
  /** column name */
  Stage = 'stage',
  /** column name */
  SubtypeCode = 'subtype_code',
  /** column name */
  TypeCode = 'type_code'
}

/** input type for updating data in table "card" */
export type Card_Set_Input = {
  clues?: InputMaybe<Scalars['Int']>;
  code?: InputMaybe<Scalars['String']>;
  cost?: InputMaybe<Scalars['Int']>;
  deck_limit?: InputMaybe<Scalars['Int']>;
  doom?: InputMaybe<Scalars['Int']>;
  double_sided?: InputMaybe<Scalars['Boolean']>;
  encounter_code?: InputMaybe<Scalars['String']>;
  encounter_position?: InputMaybe<Scalars['Int']>;
  exceptional?: InputMaybe<Scalars['Boolean']>;
  exile?: InputMaybe<Scalars['Boolean']>;
  faction_code?: InputMaybe<Scalars['String']>;
  health?: InputMaybe<Scalars['Int']>;
  illustrator?: InputMaybe<Scalars['String']>;
  is_unique?: InputMaybe<Scalars['Boolean']>;
  myriad?: InputMaybe<Scalars['Boolean']>;
  pack_code?: InputMaybe<Scalars['String']>;
  pack_position?: InputMaybe<Scalars['Int']>;
  permanent?: InputMaybe<Scalars['Boolean']>;
  position?: InputMaybe<Scalars['Int']>;
  quantity?: InputMaybe<Scalars['Int']>;
  real_back_flavor?: InputMaybe<Scalars['String']>;
  real_back_name?: InputMaybe<Scalars['String']>;
  real_back_text?: InputMaybe<Scalars['String']>;
  real_flavor?: InputMaybe<Scalars['String']>;
  real_name?: InputMaybe<Scalars['String']>;
  real_pack_name?: InputMaybe<Scalars['String']>;
  real_slot?: InputMaybe<Scalars['String']>;
  real_subname?: InputMaybe<Scalars['String']>;
  real_text?: InputMaybe<Scalars['String']>;
  real_traits?: InputMaybe<Scalars['String']>;
  sanity?: InputMaybe<Scalars['Int']>;
  skill_agility?: InputMaybe<Scalars['Int']>;
  skill_combat?: InputMaybe<Scalars['Int']>;
  skill_intellect?: InputMaybe<Scalars['Int']>;
  skill_wild?: InputMaybe<Scalars['Int']>;
  skill_willpower?: InputMaybe<Scalars['Int']>;
  stage?: InputMaybe<Scalars['Int']>;
  subtype_code?: InputMaybe<Scalars['String']>;
  type_code?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Card_Stddev_Fields = {
  __typename?: 'card_stddev_fields';
  clues?: Maybe<Scalars['Float']>;
  cost?: Maybe<Scalars['Float']>;
  deck_limit?: Maybe<Scalars['Float']>;
  doom?: Maybe<Scalars['Float']>;
  encounter_position?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  pack_position?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  sanity?: Maybe<Scalars['Float']>;
  skill_agility?: Maybe<Scalars['Float']>;
  skill_combat?: Maybe<Scalars['Float']>;
  skill_intellect?: Maybe<Scalars['Float']>;
  skill_wild?: Maybe<Scalars['Float']>;
  skill_willpower?: Maybe<Scalars['Float']>;
  stage?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Card_Stddev_Pop_Fields = {
  __typename?: 'card_stddev_pop_fields';
  clues?: Maybe<Scalars['Float']>;
  cost?: Maybe<Scalars['Float']>;
  deck_limit?: Maybe<Scalars['Float']>;
  doom?: Maybe<Scalars['Float']>;
  encounter_position?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  pack_position?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  sanity?: Maybe<Scalars['Float']>;
  skill_agility?: Maybe<Scalars['Float']>;
  skill_combat?: Maybe<Scalars['Float']>;
  skill_intellect?: Maybe<Scalars['Float']>;
  skill_wild?: Maybe<Scalars['Float']>;
  skill_willpower?: Maybe<Scalars['Float']>;
  stage?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Card_Stddev_Samp_Fields = {
  __typename?: 'card_stddev_samp_fields';
  clues?: Maybe<Scalars['Float']>;
  cost?: Maybe<Scalars['Float']>;
  deck_limit?: Maybe<Scalars['Float']>;
  doom?: Maybe<Scalars['Float']>;
  encounter_position?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  pack_position?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  sanity?: Maybe<Scalars['Float']>;
  skill_agility?: Maybe<Scalars['Float']>;
  skill_combat?: Maybe<Scalars['Float']>;
  skill_intellect?: Maybe<Scalars['Float']>;
  skill_wild?: Maybe<Scalars['Float']>;
  skill_willpower?: Maybe<Scalars['Float']>;
  stage?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Card_Sum_Fields = {
  __typename?: 'card_sum_fields';
  clues?: Maybe<Scalars['Int']>;
  cost?: Maybe<Scalars['Int']>;
  deck_limit?: Maybe<Scalars['Int']>;
  doom?: Maybe<Scalars['Int']>;
  encounter_position?: Maybe<Scalars['Int']>;
  health?: Maybe<Scalars['Int']>;
  pack_position?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  sanity?: Maybe<Scalars['Int']>;
  skill_agility?: Maybe<Scalars['Int']>;
  skill_combat?: Maybe<Scalars['Int']>;
  skill_intellect?: Maybe<Scalars['Int']>;
  skill_wild?: Maybe<Scalars['Int']>;
  skill_willpower?: Maybe<Scalars['Int']>;
  stage?: Maybe<Scalars['Int']>;
};

/** columns and relationships of "card_text" */
export type Card_Text = {
  __typename?: 'card_text';
  back_flavor?: Maybe<Scalars['String']>;
  back_name?: Maybe<Scalars['String']>;
  back_text?: Maybe<Scalars['String']>;
  code: Scalars['String'];
  encounter_name?: Maybe<Scalars['String']>;
  flavor?: Maybe<Scalars['String']>;
  locale: Scalars['String'];
  name: Scalars['String'];
  slot?: Maybe<Scalars['String']>;
  subname?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  traits?: Maybe<Scalars['String']>;
};

/** aggregated selection of "card_text" */
export type Card_Text_Aggregate = {
  __typename?: 'card_text_aggregate';
  aggregate?: Maybe<Card_Text_Aggregate_Fields>;
  nodes: Array<Card_Text>;
};

/** aggregate fields of "card_text" */
export type Card_Text_Aggregate_Fields = {
  __typename?: 'card_text_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Card_Text_Max_Fields>;
  min?: Maybe<Card_Text_Min_Fields>;
};


/** aggregate fields of "card_text" */
export type Card_Text_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Card_Text_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "card_text" */
export type Card_Text_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Card_Text_Max_Order_By>;
  min?: InputMaybe<Card_Text_Min_Order_By>;
};

/** input type for inserting array relation for remote table "card_text" */
export type Card_Text_Arr_Rel_Insert_Input = {
  data: Array<Card_Text_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Card_Text_On_Conflict>;
};

/** Boolean expression to filter rows from the table "card_text". All fields are combined with a logical 'AND'. */
export type Card_Text_Bool_Exp = {
  _and?: InputMaybe<Array<Card_Text_Bool_Exp>>;
  _not?: InputMaybe<Card_Text_Bool_Exp>;
  _or?: InputMaybe<Array<Card_Text_Bool_Exp>>;
  back_flavor?: InputMaybe<String_Comparison_Exp>;
  back_name?: InputMaybe<String_Comparison_Exp>;
  back_text?: InputMaybe<String_Comparison_Exp>;
  code?: InputMaybe<String_Comparison_Exp>;
  encounter_name?: InputMaybe<String_Comparison_Exp>;
  flavor?: InputMaybe<String_Comparison_Exp>;
  locale?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  slot?: InputMaybe<String_Comparison_Exp>;
  subname?: InputMaybe<String_Comparison_Exp>;
  text?: InputMaybe<String_Comparison_Exp>;
  traits?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "card_text" */
export enum Card_Text_Constraint {
  /** unique or primary key constraint */
  CardTextCodeLocaleKey = 'card_text_code_locale_key',
  /** unique or primary key constraint */
  CardTextPkey = 'card_text_pkey'
}

/** input type for inserting data into table "card_text" */
export type Card_Text_Insert_Input = {
  back_flavor?: InputMaybe<Scalars['String']>;
  back_name?: InputMaybe<Scalars['String']>;
  back_text?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  encounter_name?: InputMaybe<Scalars['String']>;
  flavor?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['String']>;
  subname?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  traits?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Card_Text_Max_Fields = {
  __typename?: 'card_text_max_fields';
  back_flavor?: Maybe<Scalars['String']>;
  back_name?: Maybe<Scalars['String']>;
  back_text?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  encounter_name?: Maybe<Scalars['String']>;
  flavor?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slot?: Maybe<Scalars['String']>;
  subname?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  traits?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "card_text" */
export type Card_Text_Max_Order_By = {
  back_flavor?: InputMaybe<Order_By>;
  back_name?: InputMaybe<Order_By>;
  back_text?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  encounter_name?: InputMaybe<Order_By>;
  flavor?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  slot?: InputMaybe<Order_By>;
  subname?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  traits?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Card_Text_Min_Fields = {
  __typename?: 'card_text_min_fields';
  back_flavor?: Maybe<Scalars['String']>;
  back_name?: Maybe<Scalars['String']>;
  back_text?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  encounter_name?: Maybe<Scalars['String']>;
  flavor?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slot?: Maybe<Scalars['String']>;
  subname?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  traits?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "card_text" */
export type Card_Text_Min_Order_By = {
  back_flavor?: InputMaybe<Order_By>;
  back_name?: InputMaybe<Order_By>;
  back_text?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  encounter_name?: InputMaybe<Order_By>;
  flavor?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  slot?: InputMaybe<Order_By>;
  subname?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  traits?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "card_text" */
export type Card_Text_Mutation_Response = {
  __typename?: 'card_text_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Card_Text>;
};

/** on conflict condition type for table "card_text" */
export type Card_Text_On_Conflict = {
  constraint: Card_Text_Constraint;
  update_columns: Array<Card_Text_Update_Column>;
  where?: InputMaybe<Card_Text_Bool_Exp>;
};

/** Ordering options when selecting data from "card_text". */
export type Card_Text_Order_By = {
  back_flavor?: InputMaybe<Order_By>;
  back_name?: InputMaybe<Order_By>;
  back_text?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  encounter_name?: InputMaybe<Order_By>;
  flavor?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  slot?: InputMaybe<Order_By>;
  subname?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  traits?: InputMaybe<Order_By>;
};

/** primary key columns input for table: card_text */
export type Card_Text_Pk_Columns_Input = {
  code: Scalars['String'];
  locale: Scalars['String'];
};

/** select columns of table "card_text" */
export enum Card_Text_Select_Column {
  /** column name */
  BackFlavor = 'back_flavor',
  /** column name */
  BackName = 'back_name',
  /** column name */
  BackText = 'back_text',
  /** column name */
  Code = 'code',
  /** column name */
  EncounterName = 'encounter_name',
  /** column name */
  Flavor = 'flavor',
  /** column name */
  Locale = 'locale',
  /** column name */
  Name = 'name',
  /** column name */
  Slot = 'slot',
  /** column name */
  Subname = 'subname',
  /** column name */
  Text = 'text',
  /** column name */
  Traits = 'traits'
}

/** input type for updating data in table "card_text" */
export type Card_Text_Set_Input = {
  back_flavor?: InputMaybe<Scalars['String']>;
  back_name?: InputMaybe<Scalars['String']>;
  back_text?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  encounter_name?: InputMaybe<Scalars['String']>;
  flavor?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['String']>;
  subname?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  traits?: InputMaybe<Scalars['String']>;
};

/** update columns of table "card_text" */
export enum Card_Text_Update_Column {
  /** column name */
  BackFlavor = 'back_flavor',
  /** column name */
  BackName = 'back_name',
  /** column name */
  BackText = 'back_text',
  /** column name */
  Code = 'code',
  /** column name */
  EncounterName = 'encounter_name',
  /** column name */
  Flavor = 'flavor',
  /** column name */
  Locale = 'locale',
  /** column name */
  Name = 'name',
  /** column name */
  Slot = 'slot',
  /** column name */
  Subname = 'subname',
  /** column name */
  Text = 'text',
  /** column name */
  Traits = 'traits'
}

/** update columns of table "card" */
export enum Card_Update_Column {
  /** column name */
  Clues = 'clues',
  /** column name */
  Code = 'code',
  /** column name */
  Cost = 'cost',
  /** column name */
  DeckLimit = 'deck_limit',
  /** column name */
  Doom = 'doom',
  /** column name */
  DoubleSided = 'double_sided',
  /** column name */
  EncounterCode = 'encounter_code',
  /** column name */
  EncounterPosition = 'encounter_position',
  /** column name */
  Exceptional = 'exceptional',
  /** column name */
  Exile = 'exile',
  /** column name */
  FactionCode = 'faction_code',
  /** column name */
  Health = 'health',
  /** column name */
  Illustrator = 'illustrator',
  /** column name */
  IsUnique = 'is_unique',
  /** column name */
  Myriad = 'myriad',
  /** column name */
  PackCode = 'pack_code',
  /** column name */
  PackPosition = 'pack_position',
  /** column name */
  Permanent = 'permanent',
  /** column name */
  Position = 'position',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  RealBackFlavor = 'real_back_flavor',
  /** column name */
  RealBackName = 'real_back_name',
  /** column name */
  RealBackText = 'real_back_text',
  /** column name */
  RealFlavor = 'real_flavor',
  /** column name */
  RealName = 'real_name',
  /** column name */
  RealPackName = 'real_pack_name',
  /** column name */
  RealSlot = 'real_slot',
  /** column name */
  RealSubname = 'real_subname',
  /** column name */
  RealText = 'real_text',
  /** column name */
  RealTraits = 'real_traits',
  /** column name */
  Sanity = 'sanity',
  /** column name */
  SkillAgility = 'skill_agility',
  /** column name */
  SkillCombat = 'skill_combat',
  /** column name */
  SkillIntellect = 'skill_intellect',
  /** column name */
  SkillWild = 'skill_wild',
  /** column name */
  SkillWillpower = 'skill_willpower',
  /** column name */
  Stage = 'stage',
  /** column name */
  SubtypeCode = 'subtype_code',
  /** column name */
  TypeCode = 'type_code'
}

/** aggregate var_pop on columns */
export type Card_Var_Pop_Fields = {
  __typename?: 'card_var_pop_fields';
  clues?: Maybe<Scalars['Float']>;
  cost?: Maybe<Scalars['Float']>;
  deck_limit?: Maybe<Scalars['Float']>;
  doom?: Maybe<Scalars['Float']>;
  encounter_position?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  pack_position?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  sanity?: Maybe<Scalars['Float']>;
  skill_agility?: Maybe<Scalars['Float']>;
  skill_combat?: Maybe<Scalars['Float']>;
  skill_intellect?: Maybe<Scalars['Float']>;
  skill_wild?: Maybe<Scalars['Float']>;
  skill_willpower?: Maybe<Scalars['Float']>;
  stage?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Card_Var_Samp_Fields = {
  __typename?: 'card_var_samp_fields';
  clues?: Maybe<Scalars['Float']>;
  cost?: Maybe<Scalars['Float']>;
  deck_limit?: Maybe<Scalars['Float']>;
  doom?: Maybe<Scalars['Float']>;
  encounter_position?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  pack_position?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  sanity?: Maybe<Scalars['Float']>;
  skill_agility?: Maybe<Scalars['Float']>;
  skill_combat?: Maybe<Scalars['Float']>;
  skill_intellect?: Maybe<Scalars['Float']>;
  skill_wild?: Maybe<Scalars['Float']>;
  skill_willpower?: Maybe<Scalars['Float']>;
  stage?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Card_Variance_Fields = {
  __typename?: 'card_variance_fields';
  clues?: Maybe<Scalars['Float']>;
  cost?: Maybe<Scalars['Float']>;
  deck_limit?: Maybe<Scalars['Float']>;
  doom?: Maybe<Scalars['Float']>;
  encounter_position?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  pack_position?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  sanity?: Maybe<Scalars['Float']>;
  skill_agility?: Maybe<Scalars['Float']>;
  skill_combat?: Maybe<Scalars['Float']>;
  skill_intellect?: Maybe<Scalars['Float']>;
  skill_wild?: Maybe<Scalars['Float']>;
  skill_willpower?: Maybe<Scalars['Float']>;
  stage?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "chaos_bag_result" */
export type Chaos_Bag_Result = {
  __typename?: 'chaos_bag_result';
  bless: Scalars['Int'];
  /** An object relationship */
  campaign: Campaign;
  created_at: Scalars['timestamptz'];
  curse: Scalars['Int'];
  drawn: Scalars['jsonb'];
  id: Scalars['Int'];
  sealed: Scalars['jsonb'];
  tarot?: Maybe<Chaos_Bag_Tarot_Mode_Enum>;
  /** An object relationship */
  tarot_mode: Chaos_Bag_Tarot_Mode;
  totalDrawn?: Maybe<Scalars['Int']>;
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "chaos_bag_result" */
export type Chaos_Bag_ResultDrawnArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "chaos_bag_result" */
export type Chaos_Bag_ResultSealedArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "chaos_bag_result" */
export type Chaos_Bag_Result_Aggregate = {
  __typename?: 'chaos_bag_result_aggregate';
  aggregate?: Maybe<Chaos_Bag_Result_Aggregate_Fields>;
  nodes: Array<Chaos_Bag_Result>;
};

/** aggregate fields of "chaos_bag_result" */
export type Chaos_Bag_Result_Aggregate_Fields = {
  __typename?: 'chaos_bag_result_aggregate_fields';
  avg?: Maybe<Chaos_Bag_Result_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Chaos_Bag_Result_Max_Fields>;
  min?: Maybe<Chaos_Bag_Result_Min_Fields>;
  stddev?: Maybe<Chaos_Bag_Result_Stddev_Fields>;
  stddev_pop?: Maybe<Chaos_Bag_Result_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Chaos_Bag_Result_Stddev_Samp_Fields>;
  sum?: Maybe<Chaos_Bag_Result_Sum_Fields>;
  var_pop?: Maybe<Chaos_Bag_Result_Var_Pop_Fields>;
  var_samp?: Maybe<Chaos_Bag_Result_Var_Samp_Fields>;
  variance?: Maybe<Chaos_Bag_Result_Variance_Fields>;
};


/** aggregate fields of "chaos_bag_result" */
export type Chaos_Bag_Result_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Chaos_Bag_Result_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "chaos_bag_result" */
export type Chaos_Bag_Result_Aggregate_Order_By = {
  avg?: InputMaybe<Chaos_Bag_Result_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Chaos_Bag_Result_Max_Order_By>;
  min?: InputMaybe<Chaos_Bag_Result_Min_Order_By>;
  stddev?: InputMaybe<Chaos_Bag_Result_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Chaos_Bag_Result_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Chaos_Bag_Result_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Chaos_Bag_Result_Sum_Order_By>;
  var_pop?: InputMaybe<Chaos_Bag_Result_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Chaos_Bag_Result_Var_Samp_Order_By>;
  variance?: InputMaybe<Chaos_Bag_Result_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Chaos_Bag_Result_Append_Input = {
  drawn?: InputMaybe<Scalars['jsonb']>;
  sealed?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "chaos_bag_result" */
export type Chaos_Bag_Result_Arr_Rel_Insert_Input = {
  data: Array<Chaos_Bag_Result_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Chaos_Bag_Result_On_Conflict>;
};

/** aggregate avg on columns */
export type Chaos_Bag_Result_Avg_Fields = {
  __typename?: 'chaos_bag_result_avg_fields';
  bless?: Maybe<Scalars['Float']>;
  curse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  totalDrawn?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Avg_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "chaos_bag_result". All fields are combined with a logical 'AND'. */
export type Chaos_Bag_Result_Bool_Exp = {
  _and?: InputMaybe<Array<Chaos_Bag_Result_Bool_Exp>>;
  _not?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
  _or?: InputMaybe<Array<Chaos_Bag_Result_Bool_Exp>>;
  bless?: InputMaybe<Int_Comparison_Exp>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  curse?: InputMaybe<Int_Comparison_Exp>;
  drawn?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  sealed?: InputMaybe<Jsonb_Comparison_Exp>;
  tarot?: InputMaybe<Chaos_Bag_Tarot_Mode_Enum_Comparison_Exp>;
  tarot_mode?: InputMaybe<Chaos_Bag_Tarot_Mode_Bool_Exp>;
  totalDrawn?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "chaos_bag_result" */
export enum Chaos_Bag_Result_Constraint {
  /** unique or primary key constraint */
  ChaosBagPkey = 'chaos_bag_pkey',
  /** unique or primary key constraint */
  ChaosBagResultsCampaignIdKey = 'chaos_bag_results_campaign_id_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Chaos_Bag_Result_Delete_At_Path_Input = {
  drawn?: InputMaybe<Array<Scalars['String']>>;
  sealed?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Chaos_Bag_Result_Delete_Elem_Input = {
  drawn?: InputMaybe<Scalars['Int']>;
  sealed?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Chaos_Bag_Result_Delete_Key_Input = {
  drawn?: InputMaybe<Scalars['String']>;
  sealed?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "chaos_bag_result" */
export type Chaos_Bag_Result_Inc_Input = {
  bless?: InputMaybe<Scalars['Int']>;
  curse?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  totalDrawn?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "chaos_bag_result" */
export type Chaos_Bag_Result_Insert_Input = {
  bless?: InputMaybe<Scalars['Int']>;
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  curse?: InputMaybe<Scalars['Int']>;
  drawn?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['Int']>;
  sealed?: InputMaybe<Scalars['jsonb']>;
  tarot?: InputMaybe<Chaos_Bag_Tarot_Mode_Enum>;
  tarot_mode?: InputMaybe<Chaos_Bag_Tarot_Mode_Obj_Rel_Insert_Input>;
  totalDrawn?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Chaos_Bag_Result_Max_Fields = {
  __typename?: 'chaos_bag_result_max_fields';
  bless?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  curse?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  totalDrawn?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Max_Order_By = {
  bless?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Chaos_Bag_Result_Min_Fields = {
  __typename?: 'chaos_bag_result_min_fields';
  bless?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  curse?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  totalDrawn?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Min_Order_By = {
  bless?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "chaos_bag_result" */
export type Chaos_Bag_Result_Mutation_Response = {
  __typename?: 'chaos_bag_result_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Chaos_Bag_Result>;
};

/** on conflict condition type for table "chaos_bag_result" */
export type Chaos_Bag_Result_On_Conflict = {
  constraint: Chaos_Bag_Result_Constraint;
  update_columns: Array<Chaos_Bag_Result_Update_Column>;
  where?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
};

/** Ordering options when selecting data from "chaos_bag_result". */
export type Chaos_Bag_Result_Order_By = {
  bless?: InputMaybe<Order_By>;
  campaign?: InputMaybe<Campaign_Order_By>;
  created_at?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  drawn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sealed?: InputMaybe<Order_By>;
  tarot?: InputMaybe<Order_By>;
  tarot_mode?: InputMaybe<Chaos_Bag_Tarot_Mode_Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: chaos_bag_result */
export type Chaos_Bag_Result_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Chaos_Bag_Result_Prepend_Input = {
  drawn?: InputMaybe<Scalars['jsonb']>;
  sealed?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "chaos_bag_result" */
export enum Chaos_Bag_Result_Select_Column {
  /** column name */
  Bless = 'bless',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Curse = 'curse',
  /** column name */
  Drawn = 'drawn',
  /** column name */
  Id = 'id',
  /** column name */
  Sealed = 'sealed',
  /** column name */
  Tarot = 'tarot',
  /** column name */
  TotalDrawn = 'totalDrawn',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "chaos_bag_result" */
export type Chaos_Bag_Result_Set_Input = {
  bless?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  curse?: InputMaybe<Scalars['Int']>;
  drawn?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['Int']>;
  sealed?: InputMaybe<Scalars['jsonb']>;
  tarot?: InputMaybe<Chaos_Bag_Tarot_Mode_Enum>;
  totalDrawn?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Chaos_Bag_Result_Stddev_Fields = {
  __typename?: 'chaos_bag_result_stddev_fields';
  bless?: Maybe<Scalars['Float']>;
  curse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  totalDrawn?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Stddev_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Chaos_Bag_Result_Stddev_Pop_Fields = {
  __typename?: 'chaos_bag_result_stddev_pop_fields';
  bless?: Maybe<Scalars['Float']>;
  curse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  totalDrawn?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Stddev_Pop_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Chaos_Bag_Result_Stddev_Samp_Fields = {
  __typename?: 'chaos_bag_result_stddev_samp_fields';
  bless?: Maybe<Scalars['Float']>;
  curse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  totalDrawn?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Stddev_Samp_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Chaos_Bag_Result_Sum_Fields = {
  __typename?: 'chaos_bag_result_sum_fields';
  bless?: Maybe<Scalars['Int']>;
  curse?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  totalDrawn?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Sum_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** update columns of table "chaos_bag_result" */
export enum Chaos_Bag_Result_Update_Column {
  /** column name */
  Bless = 'bless',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Curse = 'curse',
  /** column name */
  Drawn = 'drawn',
  /** column name */
  Id = 'id',
  /** column name */
  Sealed = 'sealed',
  /** column name */
  Tarot = 'tarot',
  /** column name */
  TotalDrawn = 'totalDrawn',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Chaos_Bag_Result_Var_Pop_Fields = {
  __typename?: 'chaos_bag_result_var_pop_fields';
  bless?: Maybe<Scalars['Float']>;
  curse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  totalDrawn?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Var_Pop_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Chaos_Bag_Result_Var_Samp_Fields = {
  __typename?: 'chaos_bag_result_var_samp_fields';
  bless?: Maybe<Scalars['Float']>;
  curse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  totalDrawn?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Var_Samp_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Chaos_Bag_Result_Variance_Fields = {
  __typename?: 'chaos_bag_result_variance_fields';
  bless?: Maybe<Scalars['Float']>;
  curse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  totalDrawn?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "chaos_bag_result" */
export type Chaos_Bag_Result_Variance_Order_By = {
  bless?: InputMaybe<Order_By>;
  curse?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  totalDrawn?: InputMaybe<Order_By>;
};

/** columns and relationships of "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode = {
  __typename?: 'chaos_bag_tarot_mode';
  value: Scalars['String'];
};

/** aggregated selection of "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_Aggregate = {
  __typename?: 'chaos_bag_tarot_mode_aggregate';
  aggregate?: Maybe<Chaos_Bag_Tarot_Mode_Aggregate_Fields>;
  nodes: Array<Chaos_Bag_Tarot_Mode>;
};

/** aggregate fields of "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_Aggregate_Fields = {
  __typename?: 'chaos_bag_tarot_mode_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Chaos_Bag_Tarot_Mode_Max_Fields>;
  min?: Maybe<Chaos_Bag_Tarot_Mode_Min_Fields>;
};


/** aggregate fields of "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "chaos_bag_tarot_mode". All fields are combined with a logical 'AND'. */
export type Chaos_Bag_Tarot_Mode_Bool_Exp = {
  _and?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Bool_Exp>>;
  _not?: InputMaybe<Chaos_Bag_Tarot_Mode_Bool_Exp>;
  _or?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Bool_Exp>>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "chaos_bag_tarot_mode" */
export enum Chaos_Bag_Tarot_Mode_Constraint {
  /** unique or primary key constraint */
  ChaosBagTarotModePkey = 'chaos_bag_tarot_mode_pkey'
}

export enum Chaos_Bag_Tarot_Mode_Enum {
  Judgement = 'judgement',
  JudgementInverted = 'judgement_inverted'
}

/** Boolean expression to compare columns of type "chaos_bag_tarot_mode_enum". All fields are combined with logical 'AND'. */
export type Chaos_Bag_Tarot_Mode_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Chaos_Bag_Tarot_Mode_Enum>;
  _in?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Chaos_Bag_Tarot_Mode_Enum>;
  _nin?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Enum>>;
};

/** input type for inserting data into table "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_Insert_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Chaos_Bag_Tarot_Mode_Max_Fields = {
  __typename?: 'chaos_bag_tarot_mode_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Chaos_Bag_Tarot_Mode_Min_Fields = {
  __typename?: 'chaos_bag_tarot_mode_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_Mutation_Response = {
  __typename?: 'chaos_bag_tarot_mode_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Chaos_Bag_Tarot_Mode>;
};

/** input type for inserting object relation for remote table "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_Obj_Rel_Insert_Input = {
  data: Chaos_Bag_Tarot_Mode_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Chaos_Bag_Tarot_Mode_On_Conflict>;
};

/** on conflict condition type for table "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_On_Conflict = {
  constraint: Chaos_Bag_Tarot_Mode_Constraint;
  update_columns: Array<Chaos_Bag_Tarot_Mode_Update_Column>;
  where?: InputMaybe<Chaos_Bag_Tarot_Mode_Bool_Exp>;
};

/** Ordering options when selecting data from "chaos_bag_tarot_mode". */
export type Chaos_Bag_Tarot_Mode_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: chaos_bag_tarot_mode */
export type Chaos_Bag_Tarot_Mode_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "chaos_bag_tarot_mode" */
export enum Chaos_Bag_Tarot_Mode_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "chaos_bag_tarot_mode" */
export type Chaos_Bag_Tarot_Mode_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "chaos_bag_tarot_mode" */
export enum Chaos_Bag_Tarot_Mode_Update_Column {
  /** column name */
  Value = 'value'
}

/** columns and relationships of "faq" */
export type Faq = {
  __typename?: 'faq';
  code: Scalars['String'];
  /** An array relationship */
  faq_texts: Array<Faq_Text>;
  /** An aggregate relationship */
  faq_texts_aggregate: Faq_Text_Aggregate;
  text: Scalars['String'];
};


/** columns and relationships of "faq" */
export type FaqFaq_TextsArgs = {
  distinct_on?: InputMaybe<Array<Faq_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Text_Order_By>>;
  where?: InputMaybe<Faq_Text_Bool_Exp>;
};


/** columns and relationships of "faq" */
export type FaqFaq_Texts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Faq_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Text_Order_By>>;
  where?: InputMaybe<Faq_Text_Bool_Exp>;
};

/** aggregated selection of "faq" */
export type Faq_Aggregate = {
  __typename?: 'faq_aggregate';
  aggregate?: Maybe<Faq_Aggregate_Fields>;
  nodes: Array<Faq>;
};

/** aggregate fields of "faq" */
export type Faq_Aggregate_Fields = {
  __typename?: 'faq_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Faq_Max_Fields>;
  min?: Maybe<Faq_Min_Fields>;
};


/** aggregate fields of "faq" */
export type Faq_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Faq_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "faq". All fields are combined with a logical 'AND'. */
export type Faq_Bool_Exp = {
  _and?: InputMaybe<Array<Faq_Bool_Exp>>;
  _not?: InputMaybe<Faq_Bool_Exp>;
  _or?: InputMaybe<Array<Faq_Bool_Exp>>;
  code?: InputMaybe<String_Comparison_Exp>;
  faq_texts?: InputMaybe<Faq_Text_Bool_Exp>;
  text?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "faq" */
export enum Faq_Constraint {
  /** unique or primary key constraint */
  FaqPkey = 'faq_pkey'
}

/** input type for inserting data into table "faq" */
export type Faq_Insert_Input = {
  code?: InputMaybe<Scalars['String']>;
  faq_texts?: InputMaybe<Faq_Text_Arr_Rel_Insert_Input>;
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Faq_Max_Fields = {
  __typename?: 'faq_max_fields';
  code?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Faq_Min_Fields = {
  __typename?: 'faq_min_fields';
  code?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "faq" */
export type Faq_Mutation_Response = {
  __typename?: 'faq_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Faq>;
};

/** on conflict condition type for table "faq" */
export type Faq_On_Conflict = {
  constraint: Faq_Constraint;
  update_columns: Array<Faq_Update_Column>;
  where?: InputMaybe<Faq_Bool_Exp>;
};

/** Ordering options when selecting data from "faq". */
export type Faq_Order_By = {
  code?: InputMaybe<Order_By>;
  faq_texts_aggregate?: InputMaybe<Faq_Text_Aggregate_Order_By>;
  text?: InputMaybe<Order_By>;
};

/** primary key columns input for table: faq */
export type Faq_Pk_Columns_Input = {
  code: Scalars['String'];
};

/** select columns of table "faq" */
export enum Faq_Select_Column {
  /** column name */
  Code = 'code',
  /** column name */
  Text = 'text'
}

/** input type for updating data in table "faq" */
export type Faq_Set_Input = {
  code?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "faq_text" */
export type Faq_Text = {
  __typename?: 'faq_text';
  code: Scalars['String'];
  locale: Scalars['String'];
  text: Scalars['String'];
};

/** aggregated selection of "faq_text" */
export type Faq_Text_Aggregate = {
  __typename?: 'faq_text_aggregate';
  aggregate?: Maybe<Faq_Text_Aggregate_Fields>;
  nodes: Array<Faq_Text>;
};

/** aggregate fields of "faq_text" */
export type Faq_Text_Aggregate_Fields = {
  __typename?: 'faq_text_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Faq_Text_Max_Fields>;
  min?: Maybe<Faq_Text_Min_Fields>;
};


/** aggregate fields of "faq_text" */
export type Faq_Text_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Faq_Text_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "faq_text" */
export type Faq_Text_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Faq_Text_Max_Order_By>;
  min?: InputMaybe<Faq_Text_Min_Order_By>;
};

/** input type for inserting array relation for remote table "faq_text" */
export type Faq_Text_Arr_Rel_Insert_Input = {
  data: Array<Faq_Text_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Faq_Text_On_Conflict>;
};

/** Boolean expression to filter rows from the table "faq_text". All fields are combined with a logical 'AND'. */
export type Faq_Text_Bool_Exp = {
  _and?: InputMaybe<Array<Faq_Text_Bool_Exp>>;
  _not?: InputMaybe<Faq_Text_Bool_Exp>;
  _or?: InputMaybe<Array<Faq_Text_Bool_Exp>>;
  code?: InputMaybe<String_Comparison_Exp>;
  locale?: InputMaybe<String_Comparison_Exp>;
  text?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "faq_text" */
export enum Faq_Text_Constraint {
  /** unique or primary key constraint */
  FaqTextPkey = 'faq_text_pkey'
}

/** input type for inserting data into table "faq_text" */
export type Faq_Text_Insert_Input = {
  code?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Faq_Text_Max_Fields = {
  __typename?: 'faq_text_max_fields';
  code?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "faq_text" */
export type Faq_Text_Max_Order_By = {
  code?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Faq_Text_Min_Fields = {
  __typename?: 'faq_text_min_fields';
  code?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "faq_text" */
export type Faq_Text_Min_Order_By = {
  code?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "faq_text" */
export type Faq_Text_Mutation_Response = {
  __typename?: 'faq_text_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Faq_Text>;
};

/** on conflict condition type for table "faq_text" */
export type Faq_Text_On_Conflict = {
  constraint: Faq_Text_Constraint;
  update_columns: Array<Faq_Text_Update_Column>;
  where?: InputMaybe<Faq_Text_Bool_Exp>;
};

/** Ordering options when selecting data from "faq_text". */
export type Faq_Text_Order_By = {
  code?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
};

/** primary key columns input for table: faq_text */
export type Faq_Text_Pk_Columns_Input = {
  code: Scalars['String'];
  locale: Scalars['String'];
};

/** select columns of table "faq_text" */
export enum Faq_Text_Select_Column {
  /** column name */
  Code = 'code',
  /** column name */
  Locale = 'locale',
  /** column name */
  Text = 'text'
}

/** input type for updating data in table "faq_text" */
export type Faq_Text_Set_Input = {
  code?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};

/** update columns of table "faq_text" */
export enum Faq_Text_Update_Column {
  /** column name */
  Code = 'code',
  /** column name */
  Locale = 'locale',
  /** column name */
  Text = 'text'
}

/** update columns of table "faq" */
export enum Faq_Update_Column {
  /** column name */
  Code = 'code',
  /** column name */
  Text = 'text'
}

/** columns and relationships of "friend_status" */
export type Friend_Status = {
  __typename?: 'friend_status';
  /** A computed field, executes function "friend_status_id" */
  id?: Maybe<Scalars['String']>;
  status: Friend_Status_Type_Enum;
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};

/** aggregated selection of "friend_status" */
export type Friend_Status_Aggregate = {
  __typename?: 'friend_status_aggregate';
  aggregate?: Maybe<Friend_Status_Aggregate_Fields>;
  nodes: Array<Friend_Status>;
};

/** aggregate fields of "friend_status" */
export type Friend_Status_Aggregate_Fields = {
  __typename?: 'friend_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Friend_Status_Max_Fields>;
  min?: Maybe<Friend_Status_Min_Fields>;
};


/** aggregate fields of "friend_status" */
export type Friend_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Friend_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "friend_status". All fields are combined with a logical 'AND'. */
export type Friend_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Friend_Status_Bool_Exp>>;
  _not?: InputMaybe<Friend_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Friend_Status_Bool_Exp>>;
  status?: InputMaybe<Friend_Status_Type_Enum_Comparison_Exp>;
  user_id_a?: InputMaybe<String_Comparison_Exp>;
  user_id_b?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "friend_status" */
export enum Friend_Status_Constraint {
  /** unique or primary key constraint */
  FriendStatusPkey = 'friend_status_pkey'
}

/** input type for inserting data into table "friend_status" */
export type Friend_Status_Insert_Input = {
  status?: InputMaybe<Friend_Status_Type_Enum>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Friend_Status_Max_Fields = {
  __typename?: 'friend_status_max_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Friend_Status_Min_Fields = {
  __typename?: 'friend_status_min_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "friend_status" */
export type Friend_Status_Mutation_Response = {
  __typename?: 'friend_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Friend_Status>;
};

/** on conflict condition type for table "friend_status" */
export type Friend_Status_On_Conflict = {
  constraint: Friend_Status_Constraint;
  update_columns: Array<Friend_Status_Update_Column>;
  where?: InputMaybe<Friend_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "friend_status". */
export type Friend_Status_Order_By = {
  status?: InputMaybe<Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** primary key columns input for table: friend_status */
export type Friend_Status_Pk_Columns_Input = {
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};

/** select columns of table "friend_status" */
export enum Friend_Status_Select_Column {
  /** column name */
  Status = 'status',
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** input type for updating data in table "friend_status" */
export type Friend_Status_Set_Input = {
  status?: InputMaybe<Friend_Status_Type_Enum>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "friend_status_type" */
export type Friend_Status_Type = {
  __typename?: 'friend_status_type';
  value: Scalars['String'];
};

/** aggregated selection of "friend_status_type" */
export type Friend_Status_Type_Aggregate = {
  __typename?: 'friend_status_type_aggregate';
  aggregate?: Maybe<Friend_Status_Type_Aggregate_Fields>;
  nodes: Array<Friend_Status_Type>;
};

/** aggregate fields of "friend_status_type" */
export type Friend_Status_Type_Aggregate_Fields = {
  __typename?: 'friend_status_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Friend_Status_Type_Max_Fields>;
  min?: Maybe<Friend_Status_Type_Min_Fields>;
};


/** aggregate fields of "friend_status_type" */
export type Friend_Status_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Friend_Status_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "friend_status_type". All fields are combined with a logical 'AND'. */
export type Friend_Status_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Friend_Status_Type_Bool_Exp>>;
  _not?: InputMaybe<Friend_Status_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Friend_Status_Type_Bool_Exp>>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "friend_status_type" */
export enum Friend_Status_Type_Constraint {
  /** unique or primary key constraint */
  FriendStatusTypePkey = 'friend_status_type_pkey'
}

export enum Friend_Status_Type_Enum {
  Friend = 'friend',
  None = 'none',
  Received = 'received',
  Sent = 'sent'
}

/** Boolean expression to compare columns of type "friend_status_type_enum". All fields are combined with logical 'AND'. */
export type Friend_Status_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Friend_Status_Type_Enum>;
  _in?: InputMaybe<Array<Friend_Status_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Friend_Status_Type_Enum>;
  _nin?: InputMaybe<Array<Friend_Status_Type_Enum>>;
};

/** input type for inserting data into table "friend_status_type" */
export type Friend_Status_Type_Insert_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Friend_Status_Type_Max_Fields = {
  __typename?: 'friend_status_type_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Friend_Status_Type_Min_Fields = {
  __typename?: 'friend_status_type_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "friend_status_type" */
export type Friend_Status_Type_Mutation_Response = {
  __typename?: 'friend_status_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Friend_Status_Type>;
};

/** on conflict condition type for table "friend_status_type" */
export type Friend_Status_Type_On_Conflict = {
  constraint: Friend_Status_Type_Constraint;
  update_columns: Array<Friend_Status_Type_Update_Column>;
  where?: InputMaybe<Friend_Status_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "friend_status_type". */
export type Friend_Status_Type_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: friend_status_type */
export type Friend_Status_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "friend_status_type" */
export enum Friend_Status_Type_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "friend_status_type" */
export type Friend_Status_Type_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "friend_status_type" */
export enum Friend_Status_Type_Update_Column {
  /** column name */
  Value = 'value'
}

/** update columns of table "friend_status" */
export enum Friend_Status_Update_Column {
  /** column name */
  Status = 'status',
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** columns and relationships of "guide_achievement" */
export type Guide_Achievement = {
  __typename?: 'guide_achievement';
  bool_value?: Maybe<Scalars['Boolean']>;
  /** An object relationship */
  campaign: Campaign;
  campaign_id: Scalars['Int'];
  created_at: Scalars['timestamptz'];
  id: Scalars['String'];
  type: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  value?: Maybe<Scalars['Int']>;
};

/** aggregated selection of "guide_achievement" */
export type Guide_Achievement_Aggregate = {
  __typename?: 'guide_achievement_aggregate';
  aggregate?: Maybe<Guide_Achievement_Aggregate_Fields>;
  nodes: Array<Guide_Achievement>;
};

/** aggregate fields of "guide_achievement" */
export type Guide_Achievement_Aggregate_Fields = {
  __typename?: 'guide_achievement_aggregate_fields';
  avg?: Maybe<Guide_Achievement_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Guide_Achievement_Max_Fields>;
  min?: Maybe<Guide_Achievement_Min_Fields>;
  stddev?: Maybe<Guide_Achievement_Stddev_Fields>;
  stddev_pop?: Maybe<Guide_Achievement_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Guide_Achievement_Stddev_Samp_Fields>;
  sum?: Maybe<Guide_Achievement_Sum_Fields>;
  var_pop?: Maybe<Guide_Achievement_Var_Pop_Fields>;
  var_samp?: Maybe<Guide_Achievement_Var_Samp_Fields>;
  variance?: Maybe<Guide_Achievement_Variance_Fields>;
};


/** aggregate fields of "guide_achievement" */
export type Guide_Achievement_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Guide_Achievement_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "guide_achievement" */
export type Guide_Achievement_Aggregate_Order_By = {
  avg?: InputMaybe<Guide_Achievement_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Guide_Achievement_Max_Order_By>;
  min?: InputMaybe<Guide_Achievement_Min_Order_By>;
  stddev?: InputMaybe<Guide_Achievement_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Guide_Achievement_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Guide_Achievement_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Guide_Achievement_Sum_Order_By>;
  var_pop?: InputMaybe<Guide_Achievement_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Guide_Achievement_Var_Samp_Order_By>;
  variance?: InputMaybe<Guide_Achievement_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "guide_achievement" */
export type Guide_Achievement_Arr_Rel_Insert_Input = {
  data: Array<Guide_Achievement_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Guide_Achievement_On_Conflict>;
};

/** aggregate avg on columns */
export type Guide_Achievement_Avg_Fields = {
  __typename?: 'guide_achievement_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "guide_achievement" */
export type Guide_Achievement_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "guide_achievement". All fields are combined with a logical 'AND'. */
export type Guide_Achievement_Bool_Exp = {
  _and?: InputMaybe<Array<Guide_Achievement_Bool_Exp>>;
  _not?: InputMaybe<Guide_Achievement_Bool_Exp>;
  _or?: InputMaybe<Array<Guide_Achievement_Bool_Exp>>;
  bool_value?: InputMaybe<Boolean_Comparison_Exp>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  value?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "guide_achievement" */
export enum Guide_Achievement_Constraint {
  /** unique or primary key constraint */
  GuideAchievementPkey = 'guide_achievement_pkey'
}

/** input type for incrementing numeric columns in table "guide_achievement" */
export type Guide_Achievement_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "guide_achievement" */
export type Guide_Achievement_Insert_Input = {
  bool_value?: InputMaybe<Scalars['Boolean']>;
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  value?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Guide_Achievement_Max_Fields = {
  __typename?: 'guide_achievement_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  value?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "guide_achievement" */
export type Guide_Achievement_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Guide_Achievement_Min_Fields = {
  __typename?: 'guide_achievement_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  value?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "guide_achievement" */
export type Guide_Achievement_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "guide_achievement" */
export type Guide_Achievement_Mutation_Response = {
  __typename?: 'guide_achievement_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Guide_Achievement>;
};

/** on conflict condition type for table "guide_achievement" */
export type Guide_Achievement_On_Conflict = {
  constraint: Guide_Achievement_Constraint;
  update_columns: Array<Guide_Achievement_Update_Column>;
  where?: InputMaybe<Guide_Achievement_Bool_Exp>;
};

/** Ordering options when selecting data from "guide_achievement". */
export type Guide_Achievement_Order_By = {
  bool_value?: InputMaybe<Order_By>;
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: guide_achievement */
export type Guide_Achievement_Pk_Columns_Input = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};

/** select columns of table "guide_achievement" */
export enum Guide_Achievement_Select_Column {
  /** column name */
  BoolValue = 'bool_value',
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "guide_achievement" */
export type Guide_Achievement_Set_Input = {
  bool_value?: InputMaybe<Scalars['Boolean']>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  value?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Guide_Achievement_Stddev_Fields = {
  __typename?: 'guide_achievement_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "guide_achievement" */
export type Guide_Achievement_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Guide_Achievement_Stddev_Pop_Fields = {
  __typename?: 'guide_achievement_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "guide_achievement" */
export type Guide_Achievement_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Guide_Achievement_Stddev_Samp_Fields = {
  __typename?: 'guide_achievement_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "guide_achievement" */
export type Guide_Achievement_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Guide_Achievement_Sum_Fields = {
  __typename?: 'guide_achievement_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "guide_achievement" */
export type Guide_Achievement_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** update columns of table "guide_achievement" */
export enum Guide_Achievement_Update_Column {
  /** column name */
  BoolValue = 'bool_value',
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** aggregate var_pop on columns */
export type Guide_Achievement_Var_Pop_Fields = {
  __typename?: 'guide_achievement_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "guide_achievement" */
export type Guide_Achievement_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Guide_Achievement_Var_Samp_Fields = {
  __typename?: 'guide_achievement_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "guide_achievement" */
export type Guide_Achievement_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Guide_Achievement_Variance_Fields = {
  __typename?: 'guide_achievement_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "guide_achievement" */
export type Guide_Achievement_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** columns and relationships of "guide_input" */
export type Guide_Input = {
  __typename?: 'guide_input';
  /** An object relationship */
  campaign: Campaign;
  campaign_id: Scalars['Int'];
  created_at: Scalars['timestamptz'];
  id: Scalars['String'];
  payload?: Maybe<Scalars['jsonb']>;
  scenario?: Maybe<Scalars['String']>;
  step?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};


/** columns and relationships of "guide_input" */
export type Guide_InputPayloadArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "guide_input" */
export type Guide_Input_Aggregate = {
  __typename?: 'guide_input_aggregate';
  aggregate?: Maybe<Guide_Input_Aggregate_Fields>;
  nodes: Array<Guide_Input>;
};

/** aggregate fields of "guide_input" */
export type Guide_Input_Aggregate_Fields = {
  __typename?: 'guide_input_aggregate_fields';
  avg?: Maybe<Guide_Input_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Guide_Input_Max_Fields>;
  min?: Maybe<Guide_Input_Min_Fields>;
  stddev?: Maybe<Guide_Input_Stddev_Fields>;
  stddev_pop?: Maybe<Guide_Input_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Guide_Input_Stddev_Samp_Fields>;
  sum?: Maybe<Guide_Input_Sum_Fields>;
  var_pop?: Maybe<Guide_Input_Var_Pop_Fields>;
  var_samp?: Maybe<Guide_Input_Var_Samp_Fields>;
  variance?: Maybe<Guide_Input_Variance_Fields>;
};


/** aggregate fields of "guide_input" */
export type Guide_Input_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Guide_Input_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "guide_input" */
export type Guide_Input_Aggregate_Order_By = {
  avg?: InputMaybe<Guide_Input_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Guide_Input_Max_Order_By>;
  min?: InputMaybe<Guide_Input_Min_Order_By>;
  stddev?: InputMaybe<Guide_Input_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Guide_Input_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Guide_Input_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Guide_Input_Sum_Order_By>;
  var_pop?: InputMaybe<Guide_Input_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Guide_Input_Var_Samp_Order_By>;
  variance?: InputMaybe<Guide_Input_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Guide_Input_Append_Input = {
  payload?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "guide_input" */
export type Guide_Input_Arr_Rel_Insert_Input = {
  data: Array<Guide_Input_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Guide_Input_On_Conflict>;
};

/** aggregate avg on columns */
export type Guide_Input_Avg_Fields = {
  __typename?: 'guide_input_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "guide_input" */
export type Guide_Input_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "guide_input". All fields are combined with a logical 'AND'. */
export type Guide_Input_Bool_Exp = {
  _and?: InputMaybe<Array<Guide_Input_Bool_Exp>>;
  _not?: InputMaybe<Guide_Input_Bool_Exp>;
  _or?: InputMaybe<Array<Guide_Input_Bool_Exp>>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  payload?: InputMaybe<Jsonb_Comparison_Exp>;
  scenario?: InputMaybe<String_Comparison_Exp>;
  step?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "guide_input" */
export enum Guide_Input_Constraint {
  /** unique or primary key constraint */
  GuideInputPkey = 'guide_input_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Guide_Input_Delete_At_Path_Input = {
  payload?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Guide_Input_Delete_Elem_Input = {
  payload?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Guide_Input_Delete_Key_Input = {
  payload?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "guide_input" */
export type Guide_Input_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "guide_input" */
export type Guide_Input_Insert_Input = {
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  payload?: InputMaybe<Scalars['jsonb']>;
  scenario?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Guide_Input_Max_Fields = {
  __typename?: 'guide_input_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  scenario?: Maybe<Scalars['String']>;
  step?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "guide_input" */
export type Guide_Input_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  scenario?: InputMaybe<Order_By>;
  step?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Guide_Input_Min_Fields = {
  __typename?: 'guide_input_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  scenario?: Maybe<Scalars['String']>;
  step?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "guide_input" */
export type Guide_Input_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  scenario?: InputMaybe<Order_By>;
  step?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "guide_input" */
export type Guide_Input_Mutation_Response = {
  __typename?: 'guide_input_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Guide_Input>;
};

/** on conflict condition type for table "guide_input" */
export type Guide_Input_On_Conflict = {
  constraint: Guide_Input_Constraint;
  update_columns: Array<Guide_Input_Update_Column>;
  where?: InputMaybe<Guide_Input_Bool_Exp>;
};

/** Ordering options when selecting data from "guide_input". */
export type Guide_Input_Order_By = {
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payload?: InputMaybe<Order_By>;
  scenario?: InputMaybe<Order_By>;
  step?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: guide_input */
export type Guide_Input_Pk_Columns_Input = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Guide_Input_Prepend_Input = {
  payload?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "guide_input" */
export enum Guide_Input_Select_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Payload = 'payload',
  /** column name */
  Scenario = 'scenario',
  /** column name */
  Step = 'step',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "guide_input" */
export type Guide_Input_Set_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  payload?: InputMaybe<Scalars['jsonb']>;
  scenario?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Guide_Input_Stddev_Fields = {
  __typename?: 'guide_input_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "guide_input" */
export type Guide_Input_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Guide_Input_Stddev_Pop_Fields = {
  __typename?: 'guide_input_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "guide_input" */
export type Guide_Input_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Guide_Input_Stddev_Samp_Fields = {
  __typename?: 'guide_input_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "guide_input" */
export type Guide_Input_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Guide_Input_Sum_Fields = {
  __typename?: 'guide_input_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "guide_input" */
export type Guide_Input_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** update columns of table "guide_input" */
export enum Guide_Input_Update_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Payload = 'payload',
  /** column name */
  Scenario = 'scenario',
  /** column name */
  Step = 'step',
  /** column name */
  Type = 'type'
}

/** aggregate var_pop on columns */
export type Guide_Input_Var_Pop_Fields = {
  __typename?: 'guide_input_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "guide_input" */
export type Guide_Input_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Guide_Input_Var_Samp_Fields = {
  __typename?: 'guide_input_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "guide_input" */
export type Guide_Input_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Guide_Input_Variance_Fields = {
  __typename?: 'guide_input_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "guide_input" */
export type Guide_Input_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "investigator_data" */
export type Investigator_Data = {
  __typename?: 'investigator_data';
  addedCards?: Maybe<Scalars['jsonb']>;
  availableXp?: Maybe<Scalars['Int']>;
  /** An object relationship */
  campaign_data: Campaign;
  campaign_id: Scalars['Int'];
  cardCounts?: Maybe<Scalars['jsonb']>;
  created_at: Scalars['timestamptz'];
  /** A computed field, executes function "investigator_data_id" */
  id?: Maybe<Scalars['String']>;
  ignoreStoryAssets?: Maybe<Scalars['jsonb']>;
  insane?: Maybe<Scalars['Boolean']>;
  investigator: Scalars['String'];
  killed?: Maybe<Scalars['Boolean']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  removedCards?: Maybe<Scalars['jsonb']>;
  specialXp?: Maybe<Scalars['jsonb']>;
  spentXp?: Maybe<Scalars['Int']>;
  storyAssets?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataAddedCardsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataCardCountsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataIgnoreStoryAssetsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataRemovedCardsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataSpecialXpArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataStoryAssetsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "investigator_data" */
export type Investigator_Data_Aggregate = {
  __typename?: 'investigator_data_aggregate';
  aggregate?: Maybe<Investigator_Data_Aggregate_Fields>;
  nodes: Array<Investigator_Data>;
};

/** aggregate fields of "investigator_data" */
export type Investigator_Data_Aggregate_Fields = {
  __typename?: 'investigator_data_aggregate_fields';
  avg?: Maybe<Investigator_Data_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Investigator_Data_Max_Fields>;
  min?: Maybe<Investigator_Data_Min_Fields>;
  stddev?: Maybe<Investigator_Data_Stddev_Fields>;
  stddev_pop?: Maybe<Investigator_Data_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Investigator_Data_Stddev_Samp_Fields>;
  sum?: Maybe<Investigator_Data_Sum_Fields>;
  var_pop?: Maybe<Investigator_Data_Var_Pop_Fields>;
  var_samp?: Maybe<Investigator_Data_Var_Samp_Fields>;
  variance?: Maybe<Investigator_Data_Variance_Fields>;
};


/** aggregate fields of "investigator_data" */
export type Investigator_Data_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Investigator_Data_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "investigator_data" */
export type Investigator_Data_Aggregate_Order_By = {
  avg?: InputMaybe<Investigator_Data_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Investigator_Data_Max_Order_By>;
  min?: InputMaybe<Investigator_Data_Min_Order_By>;
  stddev?: InputMaybe<Investigator_Data_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Investigator_Data_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Investigator_Data_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Investigator_Data_Sum_Order_By>;
  var_pop?: InputMaybe<Investigator_Data_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Investigator_Data_Var_Samp_Order_By>;
  variance?: InputMaybe<Investigator_Data_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Investigator_Data_Append_Input = {
  addedCards?: InputMaybe<Scalars['jsonb']>;
  cardCounts?: InputMaybe<Scalars['jsonb']>;
  ignoreStoryAssets?: InputMaybe<Scalars['jsonb']>;
  removedCards?: InputMaybe<Scalars['jsonb']>;
  specialXp?: InputMaybe<Scalars['jsonb']>;
  storyAssets?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "investigator_data" */
export type Investigator_Data_Arr_Rel_Insert_Input = {
  data: Array<Investigator_Data_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Investigator_Data_On_Conflict>;
};

/** aggregate avg on columns */
export type Investigator_Data_Avg_Fields = {
  __typename?: 'investigator_data_avg_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "investigator_data" */
export type Investigator_Data_Avg_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "investigator_data". All fields are combined with a logical 'AND'. */
export type Investigator_Data_Bool_Exp = {
  _and?: InputMaybe<Array<Investigator_Data_Bool_Exp>>;
  _not?: InputMaybe<Investigator_Data_Bool_Exp>;
  _or?: InputMaybe<Array<Investigator_Data_Bool_Exp>>;
  addedCards?: InputMaybe<Jsonb_Comparison_Exp>;
  availableXp?: InputMaybe<Int_Comparison_Exp>;
  campaign_data?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  cardCounts?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  ignoreStoryAssets?: InputMaybe<Jsonb_Comparison_Exp>;
  insane?: InputMaybe<Boolean_Comparison_Exp>;
  investigator?: InputMaybe<String_Comparison_Exp>;
  killed?: InputMaybe<Boolean_Comparison_Exp>;
  mental?: InputMaybe<Int_Comparison_Exp>;
  physical?: InputMaybe<Int_Comparison_Exp>;
  removedCards?: InputMaybe<Jsonb_Comparison_Exp>;
  specialXp?: InputMaybe<Jsonb_Comparison_Exp>;
  spentXp?: InputMaybe<Int_Comparison_Exp>;
  storyAssets?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "investigator_data" */
export enum Investigator_Data_Constraint {
  /** unique or primary key constraint */
  InvestigatorDataPkey = 'investigator_data_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Investigator_Data_Delete_At_Path_Input = {
  addedCards?: InputMaybe<Array<Scalars['String']>>;
  cardCounts?: InputMaybe<Array<Scalars['String']>>;
  ignoreStoryAssets?: InputMaybe<Array<Scalars['String']>>;
  removedCards?: InputMaybe<Array<Scalars['String']>>;
  specialXp?: InputMaybe<Array<Scalars['String']>>;
  storyAssets?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Investigator_Data_Delete_Elem_Input = {
  addedCards?: InputMaybe<Scalars['Int']>;
  cardCounts?: InputMaybe<Scalars['Int']>;
  ignoreStoryAssets?: InputMaybe<Scalars['Int']>;
  removedCards?: InputMaybe<Scalars['Int']>;
  specialXp?: InputMaybe<Scalars['Int']>;
  storyAssets?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Investigator_Data_Delete_Key_Input = {
  addedCards?: InputMaybe<Scalars['String']>;
  cardCounts?: InputMaybe<Scalars['String']>;
  ignoreStoryAssets?: InputMaybe<Scalars['String']>;
  removedCards?: InputMaybe<Scalars['String']>;
  specialXp?: InputMaybe<Scalars['String']>;
  storyAssets?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "investigator_data" */
export type Investigator_Data_Inc_Input = {
  availableXp?: InputMaybe<Scalars['Int']>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  mental?: InputMaybe<Scalars['Int']>;
  physical?: InputMaybe<Scalars['Int']>;
  spentXp?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "investigator_data" */
export type Investigator_Data_Insert_Input = {
  addedCards?: InputMaybe<Scalars['jsonb']>;
  availableXp?: InputMaybe<Scalars['Int']>;
  campaign_data?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  cardCounts?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  ignoreStoryAssets?: InputMaybe<Scalars['jsonb']>;
  insane?: InputMaybe<Scalars['Boolean']>;
  investigator?: InputMaybe<Scalars['String']>;
  killed?: InputMaybe<Scalars['Boolean']>;
  mental?: InputMaybe<Scalars['Int']>;
  physical?: InputMaybe<Scalars['Int']>;
  removedCards?: InputMaybe<Scalars['jsonb']>;
  specialXp?: InputMaybe<Scalars['jsonb']>;
  spentXp?: InputMaybe<Scalars['Int']>;
  storyAssets?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Investigator_Data_Max_Fields = {
  __typename?: 'investigator_data_max_fields';
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  investigator?: Maybe<Scalars['String']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  spentXp?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "investigator_data" */
export type Investigator_Data_Max_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Investigator_Data_Min_Fields = {
  __typename?: 'investigator_data_min_fields';
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  investigator?: Maybe<Scalars['String']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  spentXp?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "investigator_data" */
export type Investigator_Data_Min_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "investigator_data" */
export type Investigator_Data_Mutation_Response = {
  __typename?: 'investigator_data_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Investigator_Data>;
};

/** input type for inserting object relation for remote table "investigator_data" */
export type Investigator_Data_Obj_Rel_Insert_Input = {
  data: Investigator_Data_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Investigator_Data_On_Conflict>;
};

/** on conflict condition type for table "investigator_data" */
export type Investigator_Data_On_Conflict = {
  constraint: Investigator_Data_Constraint;
  update_columns: Array<Investigator_Data_Update_Column>;
  where?: InputMaybe<Investigator_Data_Bool_Exp>;
};

/** Ordering options when selecting data from "investigator_data". */
export type Investigator_Data_Order_By = {
  addedCards?: InputMaybe<Order_By>;
  availableXp?: InputMaybe<Order_By>;
  campaign_data?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  cardCounts?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  ignoreStoryAssets?: InputMaybe<Order_By>;
  insane?: InputMaybe<Order_By>;
  investigator?: InputMaybe<Order_By>;
  killed?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  removedCards?: InputMaybe<Order_By>;
  specialXp?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
  storyAssets?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: investigator_data */
export type Investigator_Data_Pk_Columns_Input = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Investigator_Data_Prepend_Input = {
  addedCards?: InputMaybe<Scalars['jsonb']>;
  cardCounts?: InputMaybe<Scalars['jsonb']>;
  ignoreStoryAssets?: InputMaybe<Scalars['jsonb']>;
  removedCards?: InputMaybe<Scalars['jsonb']>;
  specialXp?: InputMaybe<Scalars['jsonb']>;
  storyAssets?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "investigator_data" */
export enum Investigator_Data_Select_Column {
  /** column name */
  AddedCards = 'addedCards',
  /** column name */
  AvailableXp = 'availableXp',
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CardCounts = 'cardCounts',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IgnoreStoryAssets = 'ignoreStoryAssets',
  /** column name */
  Insane = 'insane',
  /** column name */
  Investigator = 'investigator',
  /** column name */
  Killed = 'killed',
  /** column name */
  Mental = 'mental',
  /** column name */
  Physical = 'physical',
  /** column name */
  RemovedCards = 'removedCards',
  /** column name */
  SpecialXp = 'specialXp',
  /** column name */
  SpentXp = 'spentXp',
  /** column name */
  StoryAssets = 'storyAssets',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "investigator_data" */
export type Investigator_Data_Set_Input = {
  addedCards?: InputMaybe<Scalars['jsonb']>;
  availableXp?: InputMaybe<Scalars['Int']>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  cardCounts?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  ignoreStoryAssets?: InputMaybe<Scalars['jsonb']>;
  insane?: InputMaybe<Scalars['Boolean']>;
  investigator?: InputMaybe<Scalars['String']>;
  killed?: InputMaybe<Scalars['Boolean']>;
  mental?: InputMaybe<Scalars['Int']>;
  physical?: InputMaybe<Scalars['Int']>;
  removedCards?: InputMaybe<Scalars['jsonb']>;
  specialXp?: InputMaybe<Scalars['jsonb']>;
  spentXp?: InputMaybe<Scalars['Int']>;
  storyAssets?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Investigator_Data_Stddev_Fields = {
  __typename?: 'investigator_data_stddev_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "investigator_data" */
export type Investigator_Data_Stddev_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Investigator_Data_Stddev_Pop_Fields = {
  __typename?: 'investigator_data_stddev_pop_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "investigator_data" */
export type Investigator_Data_Stddev_Pop_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Investigator_Data_Stddev_Samp_Fields = {
  __typename?: 'investigator_data_stddev_samp_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "investigator_data" */
export type Investigator_Data_Stddev_Samp_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Investigator_Data_Sum_Fields = {
  __typename?: 'investigator_data_sum_fields';
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  spentXp?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "investigator_data" */
export type Investigator_Data_Sum_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** update columns of table "investigator_data" */
export enum Investigator_Data_Update_Column {
  /** column name */
  AddedCards = 'addedCards',
  /** column name */
  AvailableXp = 'availableXp',
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  CardCounts = 'cardCounts',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IgnoreStoryAssets = 'ignoreStoryAssets',
  /** column name */
  Insane = 'insane',
  /** column name */
  Investigator = 'investigator',
  /** column name */
  Killed = 'killed',
  /** column name */
  Mental = 'mental',
  /** column name */
  Physical = 'physical',
  /** column name */
  RemovedCards = 'removedCards',
  /** column name */
  SpecialXp = 'specialXp',
  /** column name */
  SpentXp = 'spentXp',
  /** column name */
  StoryAssets = 'storyAssets',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Investigator_Data_Var_Pop_Fields = {
  __typename?: 'investigator_data_var_pop_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "investigator_data" */
export type Investigator_Data_Var_Pop_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Investigator_Data_Var_Samp_Fields = {
  __typename?: 'investigator_data_var_samp_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "investigator_data" */
export type Investigator_Data_Var_Samp_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Investigator_Data_Variance_Fields = {
  __typename?: 'investigator_data_variance_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "investigator_data" */
export type Investigator_Data_Variance_Order_By = {
  availableXp?: InputMaybe<Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  mental?: InputMaybe<Order_By>;
  physical?: InputMaybe<Order_By>;
  spentXp?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** columns and relationships of "latest_decks" */
export type Latest_Decks = {
  __typename?: 'latest_decks';
  /** An object relationship */
  campaign?: Maybe<Campaign>;
  campaign_id?: Maybe<Scalars['Int']>;
  /** An object relationship */
  deck?: Maybe<Campaign_Deck>;
  id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
};

/** aggregated selection of "latest_decks" */
export type Latest_Decks_Aggregate = {
  __typename?: 'latest_decks_aggregate';
  aggregate?: Maybe<Latest_Decks_Aggregate_Fields>;
  nodes: Array<Latest_Decks>;
};

/** aggregate fields of "latest_decks" */
export type Latest_Decks_Aggregate_Fields = {
  __typename?: 'latest_decks_aggregate_fields';
  avg?: Maybe<Latest_Decks_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Latest_Decks_Max_Fields>;
  min?: Maybe<Latest_Decks_Min_Fields>;
  stddev?: Maybe<Latest_Decks_Stddev_Fields>;
  stddev_pop?: Maybe<Latest_Decks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Latest_Decks_Stddev_Samp_Fields>;
  sum?: Maybe<Latest_Decks_Sum_Fields>;
  var_pop?: Maybe<Latest_Decks_Var_Pop_Fields>;
  var_samp?: Maybe<Latest_Decks_Var_Samp_Fields>;
  variance?: Maybe<Latest_Decks_Variance_Fields>;
};


/** aggregate fields of "latest_decks" */
export type Latest_Decks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "latest_decks" */
export type Latest_Decks_Aggregate_Order_By = {
  avg?: InputMaybe<Latest_Decks_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Latest_Decks_Max_Order_By>;
  min?: InputMaybe<Latest_Decks_Min_Order_By>;
  stddev?: InputMaybe<Latest_Decks_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Latest_Decks_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Latest_Decks_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Latest_Decks_Sum_Order_By>;
  var_pop?: InputMaybe<Latest_Decks_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Latest_Decks_Var_Samp_Order_By>;
  variance?: InputMaybe<Latest_Decks_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "latest_decks" */
export type Latest_Decks_Arr_Rel_Insert_Input = {
  data: Array<Latest_Decks_Insert_Input>;
};

/** aggregate avg on columns */
export type Latest_Decks_Avg_Fields = {
  __typename?: 'latest_decks_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "latest_decks" */
export type Latest_Decks_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "latest_decks". All fields are combined with a logical 'AND'. */
export type Latest_Decks_Bool_Exp = {
  _and?: InputMaybe<Array<Latest_Decks_Bool_Exp>>;
  _not?: InputMaybe<Latest_Decks_Bool_Exp>;
  _or?: InputMaybe<Array<Latest_Decks_Bool_Exp>>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  deck?: InputMaybe<Campaign_Deck_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "latest_decks" */
export type Latest_Decks_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "latest_decks" */
export type Latest_Decks_Insert_Input = {
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  deck?: InputMaybe<Campaign_Deck_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']>;
  owner_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Latest_Decks_Max_Fields = {
  __typename?: 'latest_decks_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "latest_decks" */
export type Latest_Decks_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Latest_Decks_Min_Fields = {
  __typename?: 'latest_decks_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "latest_decks" */
export type Latest_Decks_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "latest_decks" */
export type Latest_Decks_Mutation_Response = {
  __typename?: 'latest_decks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Latest_Decks>;
};

/** Ordering options when selecting data from "latest_decks". */
export type Latest_Decks_Order_By = {
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  deck?: InputMaybe<Campaign_Deck_Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
};

/** select columns of table "latest_decks" */
export enum Latest_Decks_Select_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id'
}

/** input type for updating data in table "latest_decks" */
export type Latest_Decks_Set_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  owner_id?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Latest_Decks_Stddev_Fields = {
  __typename?: 'latest_decks_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "latest_decks" */
export type Latest_Decks_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Latest_Decks_Stddev_Pop_Fields = {
  __typename?: 'latest_decks_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "latest_decks" */
export type Latest_Decks_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Latest_Decks_Stddev_Samp_Fields = {
  __typename?: 'latest_decks_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "latest_decks" */
export type Latest_Decks_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Latest_Decks_Sum_Fields = {
  __typename?: 'latest_decks_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "latest_decks" */
export type Latest_Decks_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Latest_Decks_Var_Pop_Fields = {
  __typename?: 'latest_decks_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "latest_decks" */
export type Latest_Decks_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Latest_Decks_Var_Samp_Fields = {
  __typename?: 'latest_decks_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "latest_decks" */
export type Latest_Decks_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Latest_Decks_Variance_Fields = {
  __typename?: 'latest_decks_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "latest_decks" */
export type Latest_Decks_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** columns and relationships of "local_decks" */
export type Local_Decks = {
  __typename?: 'local_decks';
  /** An object relationship */
  campaign?: Maybe<Campaign>;
  campaign_id?: Maybe<Scalars['Int']>;
  /** An object relationship */
  deck?: Maybe<Campaign_Deck>;
  id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
};

/** aggregated selection of "local_decks" */
export type Local_Decks_Aggregate = {
  __typename?: 'local_decks_aggregate';
  aggregate?: Maybe<Local_Decks_Aggregate_Fields>;
  nodes: Array<Local_Decks>;
};

/** aggregate fields of "local_decks" */
export type Local_Decks_Aggregate_Fields = {
  __typename?: 'local_decks_aggregate_fields';
  avg?: Maybe<Local_Decks_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Local_Decks_Max_Fields>;
  min?: Maybe<Local_Decks_Min_Fields>;
  stddev?: Maybe<Local_Decks_Stddev_Fields>;
  stddev_pop?: Maybe<Local_Decks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Local_Decks_Stddev_Samp_Fields>;
  sum?: Maybe<Local_Decks_Sum_Fields>;
  var_pop?: Maybe<Local_Decks_Var_Pop_Fields>;
  var_samp?: Maybe<Local_Decks_Var_Samp_Fields>;
  variance?: Maybe<Local_Decks_Variance_Fields>;
};


/** aggregate fields of "local_decks" */
export type Local_Decks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Local_Decks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "local_decks" */
export type Local_Decks_Aggregate_Order_By = {
  avg?: InputMaybe<Local_Decks_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Local_Decks_Max_Order_By>;
  min?: InputMaybe<Local_Decks_Min_Order_By>;
  stddev?: InputMaybe<Local_Decks_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Local_Decks_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Local_Decks_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Local_Decks_Sum_Order_By>;
  var_pop?: InputMaybe<Local_Decks_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Local_Decks_Var_Samp_Order_By>;
  variance?: InputMaybe<Local_Decks_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "local_decks" */
export type Local_Decks_Arr_Rel_Insert_Input = {
  data: Array<Local_Decks_Insert_Input>;
};

/** aggregate avg on columns */
export type Local_Decks_Avg_Fields = {
  __typename?: 'local_decks_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "local_decks" */
export type Local_Decks_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "local_decks". All fields are combined with a logical 'AND'. */
export type Local_Decks_Bool_Exp = {
  _and?: InputMaybe<Array<Local_Decks_Bool_Exp>>;
  _not?: InputMaybe<Local_Decks_Bool_Exp>;
  _or?: InputMaybe<Array<Local_Decks_Bool_Exp>>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  deck?: InputMaybe<Campaign_Deck_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "local_decks" */
export type Local_Decks_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "local_decks" */
export type Local_Decks_Insert_Input = {
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  deck?: InputMaybe<Campaign_Deck_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']>;
  owner_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Local_Decks_Max_Fields = {
  __typename?: 'local_decks_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "local_decks" */
export type Local_Decks_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Local_Decks_Min_Fields = {
  __typename?: 'local_decks_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  owner_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "local_decks" */
export type Local_Decks_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "local_decks" */
export type Local_Decks_Mutation_Response = {
  __typename?: 'local_decks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Local_Decks>;
};

/** Ordering options when selecting data from "local_decks". */
export type Local_Decks_Order_By = {
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  deck?: InputMaybe<Campaign_Deck_Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
};

/** select columns of table "local_decks" */
export enum Local_Decks_Select_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id'
}

/** input type for updating data in table "local_decks" */
export type Local_Decks_Set_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  owner_id?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Local_Decks_Stddev_Fields = {
  __typename?: 'local_decks_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "local_decks" */
export type Local_Decks_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Local_Decks_Stddev_Pop_Fields = {
  __typename?: 'local_decks_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "local_decks" */
export type Local_Decks_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Local_Decks_Stddev_Samp_Fields = {
  __typename?: 'local_decks_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "local_decks" */
export type Local_Decks_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Local_Decks_Sum_Fields = {
  __typename?: 'local_decks_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "local_decks" */
export type Local_Decks_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Local_Decks_Var_Pop_Fields = {
  __typename?: 'local_decks_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "local_decks" */
export type Local_Decks_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Local_Decks_Var_Samp_Fields = {
  __typename?: 'local_decks_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "local_decks" */
export type Local_Decks_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Local_Decks_Variance_Fields = {
  __typename?: 'local_decks_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "local_decks" */
export type Local_Decks_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "base_decks" */
  delete_base_decks?: Maybe<Base_Decks_Mutation_Response>;
  /** delete data from the table: "campaign" */
  delete_campaign?: Maybe<Campaign_Mutation_Response>;
  /** delete data from the table: "campaign_access" */
  delete_campaign_access?: Maybe<Campaign_Access_Mutation_Response>;
  /** delete single row from the table: "campaign_access" */
  delete_campaign_access_by_pk?: Maybe<Campaign_Access>;
  /** delete single row from the table: "campaign" */
  delete_campaign_by_pk?: Maybe<Campaign>;
  /** delete data from the table: "campaign_deck" */
  delete_campaign_deck?: Maybe<Campaign_Deck_Mutation_Response>;
  /** delete single row from the table: "campaign_deck" */
  delete_campaign_deck_by_pk?: Maybe<Campaign_Deck>;
  /** delete data from the table: "campaign_guide" */
  delete_campaign_guide?: Maybe<Campaign_Guide_Mutation_Response>;
  /** delete data from the table: "campaign_investigator" */
  delete_campaign_investigator?: Maybe<Campaign_Investigator_Mutation_Response>;
  /** delete single row from the table: "campaign_investigator" */
  delete_campaign_investigator_by_pk?: Maybe<Campaign_Investigator>;
  /** delete data from the table: "card" */
  delete_card?: Maybe<Card_Mutation_Response>;
  /** delete single row from the table: "card" */
  delete_card_by_pk?: Maybe<Card>;
  /** delete data from the table: "card_pack" */
  delete_card_pack?: Maybe<Card_Pack_Mutation_Response>;
  /** delete single row from the table: "card_pack" */
  delete_card_pack_by_pk?: Maybe<Card_Pack>;
  /** delete data from the table: "card_text" */
  delete_card_text?: Maybe<Card_Text_Mutation_Response>;
  /** delete single row from the table: "card_text" */
  delete_card_text_by_pk?: Maybe<Card_Text>;
  /** delete data from the table: "chaos_bag_result" */
  delete_chaos_bag_result?: Maybe<Chaos_Bag_Result_Mutation_Response>;
  /** delete single row from the table: "chaos_bag_result" */
  delete_chaos_bag_result_by_pk?: Maybe<Chaos_Bag_Result>;
  /** delete data from the table: "chaos_bag_tarot_mode" */
  delete_chaos_bag_tarot_mode?: Maybe<Chaos_Bag_Tarot_Mode_Mutation_Response>;
  /** delete single row from the table: "chaos_bag_tarot_mode" */
  delete_chaos_bag_tarot_mode_by_pk?: Maybe<Chaos_Bag_Tarot_Mode>;
  /** delete data from the table: "faq" */
  delete_faq?: Maybe<Faq_Mutation_Response>;
  /** delete single row from the table: "faq" */
  delete_faq_by_pk?: Maybe<Faq>;
  /** delete data from the table: "faq_text" */
  delete_faq_text?: Maybe<Faq_Text_Mutation_Response>;
  /** delete single row from the table: "faq_text" */
  delete_faq_text_by_pk?: Maybe<Faq_Text>;
  /** delete data from the table: "friend_status" */
  delete_friend_status?: Maybe<Friend_Status_Mutation_Response>;
  /** delete single row from the table: "friend_status" */
  delete_friend_status_by_pk?: Maybe<Friend_Status>;
  /** delete data from the table: "friend_status_type" */
  delete_friend_status_type?: Maybe<Friend_Status_Type_Mutation_Response>;
  /** delete single row from the table: "friend_status_type" */
  delete_friend_status_type_by_pk?: Maybe<Friend_Status_Type>;
  /** delete data from the table: "guide_achievement" */
  delete_guide_achievement?: Maybe<Guide_Achievement_Mutation_Response>;
  /** delete single row from the table: "guide_achievement" */
  delete_guide_achievement_by_pk?: Maybe<Guide_Achievement>;
  /** delete data from the table: "guide_input" */
  delete_guide_input?: Maybe<Guide_Input_Mutation_Response>;
  /** delete single row from the table: "guide_input" */
  delete_guide_input_by_pk?: Maybe<Guide_Input>;
  /** delete data from the table: "investigator_data" */
  delete_investigator_data?: Maybe<Investigator_Data_Mutation_Response>;
  /** delete single row from the table: "investigator_data" */
  delete_investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** delete data from the table: "latest_decks" */
  delete_latest_decks?: Maybe<Latest_Decks_Mutation_Response>;
  /** delete data from the table: "local_decks" */
  delete_local_decks?: Maybe<Local_Decks_Mutation_Response>;
  /** delete data from the table: "user_campaigns" */
  delete_user_campaigns?: Maybe<User_Campaigns_Mutation_Response>;
  /** delete data from the table: "user_flag" */
  delete_user_flag?: Maybe<User_Flag_Mutation_Response>;
  /** delete single row from the table: "user_flag" */
  delete_user_flag_by_pk?: Maybe<User_Flag>;
  /** delete data from the table: "user_flag_type" */
  delete_user_flag_type?: Maybe<User_Flag_Type_Mutation_Response>;
  /** delete single row from the table: "user_flag_type" */
  delete_user_flag_type_by_pk?: Maybe<User_Flag_Type>;
  /** delete data from the table: "user_friends" */
  delete_user_friends?: Maybe<User_Friends_Mutation_Response>;
  /** delete data from the table: "user_received_friend_requests" */
  delete_user_received_friend_requests?: Maybe<User_Received_Friend_Requests_Mutation_Response>;
  /** delete data from the table: "user_sent_friend_requests" */
  delete_user_sent_friend_requests?: Maybe<User_Sent_Friend_Requests_Mutation_Response>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "base_decks" */
  insert_base_decks?: Maybe<Base_Decks_Mutation_Response>;
  /** insert a single row into the table: "base_decks" */
  insert_base_decks_one?: Maybe<Base_Decks>;
  /** insert data into the table: "campaign" */
  insert_campaign?: Maybe<Campaign_Mutation_Response>;
  /** insert data into the table: "campaign_access" */
  insert_campaign_access?: Maybe<Campaign_Access_Mutation_Response>;
  /** insert a single row into the table: "campaign_access" */
  insert_campaign_access_one?: Maybe<Campaign_Access>;
  /** insert data into the table: "campaign_deck" */
  insert_campaign_deck?: Maybe<Campaign_Deck_Mutation_Response>;
  /** insert a single row into the table: "campaign_deck" */
  insert_campaign_deck_one?: Maybe<Campaign_Deck>;
  /** insert data into the table: "campaign_guide" */
  insert_campaign_guide?: Maybe<Campaign_Guide_Mutation_Response>;
  /** insert a single row into the table: "campaign_guide" */
  insert_campaign_guide_one?: Maybe<Campaign_Guide>;
  /** insert data into the table: "campaign_investigator" */
  insert_campaign_investigator?: Maybe<Campaign_Investigator_Mutation_Response>;
  /** insert a single row into the table: "campaign_investigator" */
  insert_campaign_investigator_one?: Maybe<Campaign_Investigator>;
  /** insert a single row into the table: "campaign" */
  insert_campaign_one?: Maybe<Campaign>;
  /** insert data into the table: "card" */
  insert_card?: Maybe<Card_Mutation_Response>;
  /** insert a single row into the table: "card" */
  insert_card_one?: Maybe<Card>;
  /** insert data into the table: "card_pack" */
  insert_card_pack?: Maybe<Card_Pack_Mutation_Response>;
  /** insert a single row into the table: "card_pack" */
  insert_card_pack_one?: Maybe<Card_Pack>;
  /** insert data into the table: "card_text" */
  insert_card_text?: Maybe<Card_Text_Mutation_Response>;
  /** insert a single row into the table: "card_text" */
  insert_card_text_one?: Maybe<Card_Text>;
  /** insert data into the table: "chaos_bag_result" */
  insert_chaos_bag_result?: Maybe<Chaos_Bag_Result_Mutation_Response>;
  /** insert a single row into the table: "chaos_bag_result" */
  insert_chaos_bag_result_one?: Maybe<Chaos_Bag_Result>;
  /** insert data into the table: "chaos_bag_tarot_mode" */
  insert_chaos_bag_tarot_mode?: Maybe<Chaos_Bag_Tarot_Mode_Mutation_Response>;
  /** insert a single row into the table: "chaos_bag_tarot_mode" */
  insert_chaos_bag_tarot_mode_one?: Maybe<Chaos_Bag_Tarot_Mode>;
  /** insert data into the table: "faq" */
  insert_faq?: Maybe<Faq_Mutation_Response>;
  /** insert a single row into the table: "faq" */
  insert_faq_one?: Maybe<Faq>;
  /** insert data into the table: "faq_text" */
  insert_faq_text?: Maybe<Faq_Text_Mutation_Response>;
  /** insert a single row into the table: "faq_text" */
  insert_faq_text_one?: Maybe<Faq_Text>;
  /** insert data into the table: "friend_status" */
  insert_friend_status?: Maybe<Friend_Status_Mutation_Response>;
  /** insert a single row into the table: "friend_status" */
  insert_friend_status_one?: Maybe<Friend_Status>;
  /** insert data into the table: "friend_status_type" */
  insert_friend_status_type?: Maybe<Friend_Status_Type_Mutation_Response>;
  /** insert a single row into the table: "friend_status_type" */
  insert_friend_status_type_one?: Maybe<Friend_Status_Type>;
  /** insert data into the table: "guide_achievement" */
  insert_guide_achievement?: Maybe<Guide_Achievement_Mutation_Response>;
  /** insert a single row into the table: "guide_achievement" */
  insert_guide_achievement_one?: Maybe<Guide_Achievement>;
  /** insert data into the table: "guide_input" */
  insert_guide_input?: Maybe<Guide_Input_Mutation_Response>;
  /** insert a single row into the table: "guide_input" */
  insert_guide_input_one?: Maybe<Guide_Input>;
  /** insert data into the table: "investigator_data" */
  insert_investigator_data?: Maybe<Investigator_Data_Mutation_Response>;
  /** insert a single row into the table: "investigator_data" */
  insert_investigator_data_one?: Maybe<Investigator_Data>;
  /** insert data into the table: "latest_decks" */
  insert_latest_decks?: Maybe<Latest_Decks_Mutation_Response>;
  /** insert a single row into the table: "latest_decks" */
  insert_latest_decks_one?: Maybe<Latest_Decks>;
  /** insert data into the table: "local_decks" */
  insert_local_decks?: Maybe<Local_Decks_Mutation_Response>;
  /** insert a single row into the table: "local_decks" */
  insert_local_decks_one?: Maybe<Local_Decks>;
  /** insert data into the table: "user_campaigns" */
  insert_user_campaigns?: Maybe<User_Campaigns_Mutation_Response>;
  /** insert a single row into the table: "user_campaigns" */
  insert_user_campaigns_one?: Maybe<User_Campaigns>;
  /** insert data into the table: "user_flag" */
  insert_user_flag?: Maybe<User_Flag_Mutation_Response>;
  /** insert a single row into the table: "user_flag" */
  insert_user_flag_one?: Maybe<User_Flag>;
  /** insert data into the table: "user_flag_type" */
  insert_user_flag_type?: Maybe<User_Flag_Type_Mutation_Response>;
  /** insert a single row into the table: "user_flag_type" */
  insert_user_flag_type_one?: Maybe<User_Flag_Type>;
  /** insert data into the table: "user_friends" */
  insert_user_friends?: Maybe<User_Friends_Mutation_Response>;
  /** insert a single row into the table: "user_friends" */
  insert_user_friends_one?: Maybe<User_Friends>;
  /** insert data into the table: "user_received_friend_requests" */
  insert_user_received_friend_requests?: Maybe<User_Received_Friend_Requests_Mutation_Response>;
  /** insert a single row into the table: "user_received_friend_requests" */
  insert_user_received_friend_requests_one?: Maybe<User_Received_Friend_Requests>;
  /** insert data into the table: "user_sent_friend_requests" */
  insert_user_sent_friend_requests?: Maybe<User_Sent_Friend_Requests_Mutation_Response>;
  /** insert a single row into the table: "user_sent_friend_requests" */
  insert_user_sent_friend_requests_one?: Maybe<User_Sent_Friend_Requests>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** update data of the table: "base_decks" */
  update_base_decks?: Maybe<Base_Decks_Mutation_Response>;
  /** update data of the table: "campaign" */
  update_campaign?: Maybe<Campaign_Mutation_Response>;
  /** update data of the table: "campaign_access" */
  update_campaign_access?: Maybe<Campaign_Access_Mutation_Response>;
  /** update single row of the table: "campaign_access" */
  update_campaign_access_by_pk?: Maybe<Campaign_Access>;
  /** update single row of the table: "campaign" */
  update_campaign_by_pk?: Maybe<Campaign>;
  /** update data of the table: "campaign_deck" */
  update_campaign_deck?: Maybe<Campaign_Deck_Mutation_Response>;
  /** update single row of the table: "campaign_deck" */
  update_campaign_deck_by_pk?: Maybe<Campaign_Deck>;
  /** update data of the table: "campaign_guide" */
  update_campaign_guide?: Maybe<Campaign_Guide_Mutation_Response>;
  /** update data of the table: "campaign_investigator" */
  update_campaign_investigator?: Maybe<Campaign_Investigator_Mutation_Response>;
  /** update single row of the table: "campaign_investigator" */
  update_campaign_investigator_by_pk?: Maybe<Campaign_Investigator>;
  /** update data of the table: "card" */
  update_card?: Maybe<Card_Mutation_Response>;
  /** update single row of the table: "card" */
  update_card_by_pk?: Maybe<Card>;
  /** update data of the table: "card_pack" */
  update_card_pack?: Maybe<Card_Pack_Mutation_Response>;
  /** update single row of the table: "card_pack" */
  update_card_pack_by_pk?: Maybe<Card_Pack>;
  /** update data of the table: "card_text" */
  update_card_text?: Maybe<Card_Text_Mutation_Response>;
  /** update single row of the table: "card_text" */
  update_card_text_by_pk?: Maybe<Card_Text>;
  /** update data of the table: "chaos_bag_result" */
  update_chaos_bag_result?: Maybe<Chaos_Bag_Result_Mutation_Response>;
  /** update single row of the table: "chaos_bag_result" */
  update_chaos_bag_result_by_pk?: Maybe<Chaos_Bag_Result>;
  /** update data of the table: "chaos_bag_tarot_mode" */
  update_chaos_bag_tarot_mode?: Maybe<Chaos_Bag_Tarot_Mode_Mutation_Response>;
  /** update single row of the table: "chaos_bag_tarot_mode" */
  update_chaos_bag_tarot_mode_by_pk?: Maybe<Chaos_Bag_Tarot_Mode>;
  /** update data of the table: "faq" */
  update_faq?: Maybe<Faq_Mutation_Response>;
  /** update single row of the table: "faq" */
  update_faq_by_pk?: Maybe<Faq>;
  /** update data of the table: "faq_text" */
  update_faq_text?: Maybe<Faq_Text_Mutation_Response>;
  /** update single row of the table: "faq_text" */
  update_faq_text_by_pk?: Maybe<Faq_Text>;
  /** update data of the table: "friend_status" */
  update_friend_status?: Maybe<Friend_Status_Mutation_Response>;
  /** update single row of the table: "friend_status" */
  update_friend_status_by_pk?: Maybe<Friend_Status>;
  /** update data of the table: "friend_status_type" */
  update_friend_status_type?: Maybe<Friend_Status_Type_Mutation_Response>;
  /** update single row of the table: "friend_status_type" */
  update_friend_status_type_by_pk?: Maybe<Friend_Status_Type>;
  /** update data of the table: "guide_achievement" */
  update_guide_achievement?: Maybe<Guide_Achievement_Mutation_Response>;
  /** update single row of the table: "guide_achievement" */
  update_guide_achievement_by_pk?: Maybe<Guide_Achievement>;
  /** update data of the table: "guide_input" */
  update_guide_input?: Maybe<Guide_Input_Mutation_Response>;
  /** update single row of the table: "guide_input" */
  update_guide_input_by_pk?: Maybe<Guide_Input>;
  /** update data of the table: "investigator_data" */
  update_investigator_data?: Maybe<Investigator_Data_Mutation_Response>;
  /** update single row of the table: "investigator_data" */
  update_investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** update data of the table: "latest_decks" */
  update_latest_decks?: Maybe<Latest_Decks_Mutation_Response>;
  /** update data of the table: "local_decks" */
  update_local_decks?: Maybe<Local_Decks_Mutation_Response>;
  /** update data of the table: "user_campaigns" */
  update_user_campaigns?: Maybe<User_Campaigns_Mutation_Response>;
  /** update data of the table: "user_flag" */
  update_user_flag?: Maybe<User_Flag_Mutation_Response>;
  /** update single row of the table: "user_flag" */
  update_user_flag_by_pk?: Maybe<User_Flag>;
  /** update data of the table: "user_flag_type" */
  update_user_flag_type?: Maybe<User_Flag_Type_Mutation_Response>;
  /** update single row of the table: "user_flag_type" */
  update_user_flag_type_by_pk?: Maybe<User_Flag_Type>;
  /** update data of the table: "user_friends" */
  update_user_friends?: Maybe<User_Friends_Mutation_Response>;
  /** update data of the table: "user_received_friend_requests" */
  update_user_received_friend_requests?: Maybe<User_Received_Friend_Requests_Mutation_Response>;
  /** update data of the table: "user_sent_friend_requests" */
  update_user_sent_friend_requests?: Maybe<User_Sent_Friend_Requests_Mutation_Response>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
};


/** mutation root */
export type Mutation_RootDelete_Base_DecksArgs = {
  where: Base_Decks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_CampaignArgs = {
  where: Campaign_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Campaign_AccessArgs = {
  where: Campaign_Access_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Campaign_Access_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Campaign_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Campaign_DeckArgs = {
  where: Campaign_Deck_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Campaign_Deck_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Campaign_GuideArgs = {
  where: Campaign_Guide_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Campaign_InvestigatorArgs = {
  where: Campaign_Investigator_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Campaign_Investigator_By_PkArgs = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_CardArgs = {
  where: Card_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Card_By_PkArgs = {
  code: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Card_PackArgs = {
  where: Card_Pack_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Card_Pack_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Card_TextArgs = {
  where: Card_Text_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Card_Text_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Chaos_Bag_ResultArgs = {
  where: Chaos_Bag_Result_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Chaos_Bag_Result_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Chaos_Bag_Tarot_ModeArgs = {
  where: Chaos_Bag_Tarot_Mode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Chaos_Bag_Tarot_Mode_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_FaqArgs = {
  where: Faq_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Faq_By_PkArgs = {
  code: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Faq_TextArgs = {
  where: Faq_Text_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Faq_Text_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Friend_StatusArgs = {
  where: Friend_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Friend_Status_By_PkArgs = {
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Friend_Status_TypeArgs = {
  where: Friend_Status_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Friend_Status_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Guide_AchievementArgs = {
  where: Guide_Achievement_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Guide_Achievement_By_PkArgs = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Guide_InputArgs = {
  where: Guide_Input_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Guide_Input_By_PkArgs = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Investigator_DataArgs = {
  where: Investigator_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Investigator_Data_By_PkArgs = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Latest_DecksArgs = {
  where: Latest_Decks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Local_DecksArgs = {
  where: Local_Decks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_CampaignsArgs = {
  where: User_Campaigns_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_FlagArgs = {
  where: User_Flag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Flag_By_PkArgs = {
  flag: User_Flag_Type_Enum;
  user_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_User_Flag_TypeArgs = {
  where: User_Flag_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Flag_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_User_FriendsArgs = {
  where: User_Friends_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Received_Friend_RequestsArgs = {
  where: User_Received_Friend_Requests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Sent_Friend_RequestsArgs = {
  where: User_Sent_Friend_Requests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootInsert_Base_DecksArgs = {
  objects: Array<Base_Decks_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Base_Decks_OneArgs = {
  object: Base_Decks_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_CampaignArgs = {
  objects: Array<Campaign_Insert_Input>;
  on_conflict?: InputMaybe<Campaign_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_AccessArgs = {
  objects: Array<Campaign_Access_Insert_Input>;
  on_conflict?: InputMaybe<Campaign_Access_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_Access_OneArgs = {
  object: Campaign_Access_Insert_Input;
  on_conflict?: InputMaybe<Campaign_Access_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_DeckArgs = {
  objects: Array<Campaign_Deck_Insert_Input>;
  on_conflict?: InputMaybe<Campaign_Deck_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_Deck_OneArgs = {
  object: Campaign_Deck_Insert_Input;
  on_conflict?: InputMaybe<Campaign_Deck_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_GuideArgs = {
  objects: Array<Campaign_Guide_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_Guide_OneArgs = {
  object: Campaign_Guide_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_InvestigatorArgs = {
  objects: Array<Campaign_Investigator_Insert_Input>;
  on_conflict?: InputMaybe<Campaign_Investigator_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_Investigator_OneArgs = {
  object: Campaign_Investigator_Insert_Input;
  on_conflict?: InputMaybe<Campaign_Investigator_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_OneArgs = {
  object: Campaign_Insert_Input;
  on_conflict?: InputMaybe<Campaign_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CardArgs = {
  objects: Array<Card_Insert_Input>;
  on_conflict?: InputMaybe<Card_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Card_OneArgs = {
  object: Card_Insert_Input;
  on_conflict?: InputMaybe<Card_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Card_PackArgs = {
  objects: Array<Card_Pack_Insert_Input>;
  on_conflict?: InputMaybe<Card_Pack_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Card_Pack_OneArgs = {
  object: Card_Pack_Insert_Input;
  on_conflict?: InputMaybe<Card_Pack_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Card_TextArgs = {
  objects: Array<Card_Text_Insert_Input>;
  on_conflict?: InputMaybe<Card_Text_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Card_Text_OneArgs = {
  object: Card_Text_Insert_Input;
  on_conflict?: InputMaybe<Card_Text_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Chaos_Bag_ResultArgs = {
  objects: Array<Chaos_Bag_Result_Insert_Input>;
  on_conflict?: InputMaybe<Chaos_Bag_Result_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Chaos_Bag_Result_OneArgs = {
  object: Chaos_Bag_Result_Insert_Input;
  on_conflict?: InputMaybe<Chaos_Bag_Result_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Chaos_Bag_Tarot_ModeArgs = {
  objects: Array<Chaos_Bag_Tarot_Mode_Insert_Input>;
  on_conflict?: InputMaybe<Chaos_Bag_Tarot_Mode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Chaos_Bag_Tarot_Mode_OneArgs = {
  object: Chaos_Bag_Tarot_Mode_Insert_Input;
  on_conflict?: InputMaybe<Chaos_Bag_Tarot_Mode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FaqArgs = {
  objects: Array<Faq_Insert_Input>;
  on_conflict?: InputMaybe<Faq_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Faq_OneArgs = {
  object: Faq_Insert_Input;
  on_conflict?: InputMaybe<Faq_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Faq_TextArgs = {
  objects: Array<Faq_Text_Insert_Input>;
  on_conflict?: InputMaybe<Faq_Text_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Faq_Text_OneArgs = {
  object: Faq_Text_Insert_Input;
  on_conflict?: InputMaybe<Faq_Text_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Friend_StatusArgs = {
  objects: Array<Friend_Status_Insert_Input>;
  on_conflict?: InputMaybe<Friend_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Friend_Status_OneArgs = {
  object: Friend_Status_Insert_Input;
  on_conflict?: InputMaybe<Friend_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Friend_Status_TypeArgs = {
  objects: Array<Friend_Status_Type_Insert_Input>;
  on_conflict?: InputMaybe<Friend_Status_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Friend_Status_Type_OneArgs = {
  object: Friend_Status_Type_Insert_Input;
  on_conflict?: InputMaybe<Friend_Status_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_AchievementArgs = {
  objects: Array<Guide_Achievement_Insert_Input>;
  on_conflict?: InputMaybe<Guide_Achievement_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_Achievement_OneArgs = {
  object: Guide_Achievement_Insert_Input;
  on_conflict?: InputMaybe<Guide_Achievement_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_InputArgs = {
  objects: Array<Guide_Input_Insert_Input>;
  on_conflict?: InputMaybe<Guide_Input_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_Input_OneArgs = {
  object: Guide_Input_Insert_Input;
  on_conflict?: InputMaybe<Guide_Input_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Investigator_DataArgs = {
  objects: Array<Investigator_Data_Insert_Input>;
  on_conflict?: InputMaybe<Investigator_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Investigator_Data_OneArgs = {
  object: Investigator_Data_Insert_Input;
  on_conflict?: InputMaybe<Investigator_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Latest_DecksArgs = {
  objects: Array<Latest_Decks_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Latest_Decks_OneArgs = {
  object: Latest_Decks_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Local_DecksArgs = {
  objects: Array<Local_Decks_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Local_Decks_OneArgs = {
  object: Local_Decks_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_User_CampaignsArgs = {
  objects: Array<User_Campaigns_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_User_Campaigns_OneArgs = {
  object: User_Campaigns_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_User_FlagArgs = {
  objects: Array<User_Flag_Insert_Input>;
  on_conflict?: InputMaybe<User_Flag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Flag_OneArgs = {
  object: User_Flag_Insert_Input;
  on_conflict?: InputMaybe<User_Flag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Flag_TypeArgs = {
  objects: Array<User_Flag_Type_Insert_Input>;
  on_conflict?: InputMaybe<User_Flag_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Flag_Type_OneArgs = {
  object: User_Flag_Type_Insert_Input;
  on_conflict?: InputMaybe<User_Flag_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_FriendsArgs = {
  objects: Array<User_Friends_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_User_Friends_OneArgs = {
  object: User_Friends_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_User_Received_Friend_RequestsArgs = {
  objects: Array<User_Received_Friend_Requests_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_User_Received_Friend_Requests_OneArgs = {
  object: User_Received_Friend_Requests_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_User_Sent_Friend_RequestsArgs = {
  objects: Array<User_Sent_Friend_Requests_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_User_Sent_Friend_Requests_OneArgs = {
  object: User_Sent_Friend_Requests_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Base_DecksArgs = {
  _inc?: InputMaybe<Base_Decks_Inc_Input>;
  _set?: InputMaybe<Base_Decks_Set_Input>;
  where: Base_Decks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_CampaignArgs = {
  _append?: InputMaybe<Campaign_Append_Input>;
  _delete_at_path?: InputMaybe<Campaign_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Campaign_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Campaign_Delete_Key_Input>;
  _inc?: InputMaybe<Campaign_Inc_Input>;
  _prepend?: InputMaybe<Campaign_Prepend_Input>;
  _set?: InputMaybe<Campaign_Set_Input>;
  where: Campaign_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_AccessArgs = {
  _inc?: InputMaybe<Campaign_Access_Inc_Input>;
  _set?: InputMaybe<Campaign_Access_Set_Input>;
  where: Campaign_Access_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_Access_By_PkArgs = {
  _inc?: InputMaybe<Campaign_Access_Inc_Input>;
  _set?: InputMaybe<Campaign_Access_Set_Input>;
  pk_columns: Campaign_Access_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_By_PkArgs = {
  _append?: InputMaybe<Campaign_Append_Input>;
  _delete_at_path?: InputMaybe<Campaign_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Campaign_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Campaign_Delete_Key_Input>;
  _inc?: InputMaybe<Campaign_Inc_Input>;
  _prepend?: InputMaybe<Campaign_Prepend_Input>;
  _set?: InputMaybe<Campaign_Set_Input>;
  pk_columns: Campaign_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_DeckArgs = {
  _append?: InputMaybe<Campaign_Deck_Append_Input>;
  _delete_at_path?: InputMaybe<Campaign_Deck_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Campaign_Deck_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Campaign_Deck_Delete_Key_Input>;
  _inc?: InputMaybe<Campaign_Deck_Inc_Input>;
  _prepend?: InputMaybe<Campaign_Deck_Prepend_Input>;
  _set?: InputMaybe<Campaign_Deck_Set_Input>;
  where: Campaign_Deck_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_Deck_By_PkArgs = {
  _append?: InputMaybe<Campaign_Deck_Append_Input>;
  _delete_at_path?: InputMaybe<Campaign_Deck_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Campaign_Deck_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Campaign_Deck_Delete_Key_Input>;
  _inc?: InputMaybe<Campaign_Deck_Inc_Input>;
  _prepend?: InputMaybe<Campaign_Deck_Prepend_Input>;
  _set?: InputMaybe<Campaign_Deck_Set_Input>;
  pk_columns: Campaign_Deck_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_GuideArgs = {
  _inc?: InputMaybe<Campaign_Guide_Inc_Input>;
  _set?: InputMaybe<Campaign_Guide_Set_Input>;
  where: Campaign_Guide_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_InvestigatorArgs = {
  _inc?: InputMaybe<Campaign_Investigator_Inc_Input>;
  _set?: InputMaybe<Campaign_Investigator_Set_Input>;
  where: Campaign_Investigator_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_Investigator_By_PkArgs = {
  _inc?: InputMaybe<Campaign_Investigator_Inc_Input>;
  _set?: InputMaybe<Campaign_Investigator_Set_Input>;
  pk_columns: Campaign_Investigator_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_CardArgs = {
  _inc?: InputMaybe<Card_Inc_Input>;
  _set?: InputMaybe<Card_Set_Input>;
  where: Card_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Card_By_PkArgs = {
  _inc?: InputMaybe<Card_Inc_Input>;
  _set?: InputMaybe<Card_Set_Input>;
  pk_columns: Card_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Card_PackArgs = {
  _set?: InputMaybe<Card_Pack_Set_Input>;
  where: Card_Pack_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Card_Pack_By_PkArgs = {
  _set?: InputMaybe<Card_Pack_Set_Input>;
  pk_columns: Card_Pack_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Card_TextArgs = {
  _set?: InputMaybe<Card_Text_Set_Input>;
  where: Card_Text_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Card_Text_By_PkArgs = {
  _set?: InputMaybe<Card_Text_Set_Input>;
  pk_columns: Card_Text_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Chaos_Bag_ResultArgs = {
  _append?: InputMaybe<Chaos_Bag_Result_Append_Input>;
  _delete_at_path?: InputMaybe<Chaos_Bag_Result_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Chaos_Bag_Result_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Chaos_Bag_Result_Delete_Key_Input>;
  _inc?: InputMaybe<Chaos_Bag_Result_Inc_Input>;
  _prepend?: InputMaybe<Chaos_Bag_Result_Prepend_Input>;
  _set?: InputMaybe<Chaos_Bag_Result_Set_Input>;
  where: Chaos_Bag_Result_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Chaos_Bag_Result_By_PkArgs = {
  _append?: InputMaybe<Chaos_Bag_Result_Append_Input>;
  _delete_at_path?: InputMaybe<Chaos_Bag_Result_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Chaos_Bag_Result_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Chaos_Bag_Result_Delete_Key_Input>;
  _inc?: InputMaybe<Chaos_Bag_Result_Inc_Input>;
  _prepend?: InputMaybe<Chaos_Bag_Result_Prepend_Input>;
  _set?: InputMaybe<Chaos_Bag_Result_Set_Input>;
  pk_columns: Chaos_Bag_Result_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Chaos_Bag_Tarot_ModeArgs = {
  _set?: InputMaybe<Chaos_Bag_Tarot_Mode_Set_Input>;
  where: Chaos_Bag_Tarot_Mode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Chaos_Bag_Tarot_Mode_By_PkArgs = {
  _set?: InputMaybe<Chaos_Bag_Tarot_Mode_Set_Input>;
  pk_columns: Chaos_Bag_Tarot_Mode_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_FaqArgs = {
  _set?: InputMaybe<Faq_Set_Input>;
  where: Faq_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Faq_By_PkArgs = {
  _set?: InputMaybe<Faq_Set_Input>;
  pk_columns: Faq_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Faq_TextArgs = {
  _set?: InputMaybe<Faq_Text_Set_Input>;
  where: Faq_Text_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Faq_Text_By_PkArgs = {
  _set?: InputMaybe<Faq_Text_Set_Input>;
  pk_columns: Faq_Text_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Friend_StatusArgs = {
  _set?: InputMaybe<Friend_Status_Set_Input>;
  where: Friend_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Friend_Status_By_PkArgs = {
  _set?: InputMaybe<Friend_Status_Set_Input>;
  pk_columns: Friend_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Friend_Status_TypeArgs = {
  _set?: InputMaybe<Friend_Status_Type_Set_Input>;
  where: Friend_Status_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Friend_Status_Type_By_PkArgs = {
  _set?: InputMaybe<Friend_Status_Type_Set_Input>;
  pk_columns: Friend_Status_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_AchievementArgs = {
  _inc?: InputMaybe<Guide_Achievement_Inc_Input>;
  _set?: InputMaybe<Guide_Achievement_Set_Input>;
  where: Guide_Achievement_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_Achievement_By_PkArgs = {
  _inc?: InputMaybe<Guide_Achievement_Inc_Input>;
  _set?: InputMaybe<Guide_Achievement_Set_Input>;
  pk_columns: Guide_Achievement_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_InputArgs = {
  _append?: InputMaybe<Guide_Input_Append_Input>;
  _delete_at_path?: InputMaybe<Guide_Input_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Guide_Input_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Guide_Input_Delete_Key_Input>;
  _inc?: InputMaybe<Guide_Input_Inc_Input>;
  _prepend?: InputMaybe<Guide_Input_Prepend_Input>;
  _set?: InputMaybe<Guide_Input_Set_Input>;
  where: Guide_Input_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_Input_By_PkArgs = {
  _append?: InputMaybe<Guide_Input_Append_Input>;
  _delete_at_path?: InputMaybe<Guide_Input_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Guide_Input_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Guide_Input_Delete_Key_Input>;
  _inc?: InputMaybe<Guide_Input_Inc_Input>;
  _prepend?: InputMaybe<Guide_Input_Prepend_Input>;
  _set?: InputMaybe<Guide_Input_Set_Input>;
  pk_columns: Guide_Input_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Investigator_DataArgs = {
  _append?: InputMaybe<Investigator_Data_Append_Input>;
  _delete_at_path?: InputMaybe<Investigator_Data_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Investigator_Data_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Investigator_Data_Delete_Key_Input>;
  _inc?: InputMaybe<Investigator_Data_Inc_Input>;
  _prepend?: InputMaybe<Investigator_Data_Prepend_Input>;
  _set?: InputMaybe<Investigator_Data_Set_Input>;
  where: Investigator_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Investigator_Data_By_PkArgs = {
  _append?: InputMaybe<Investigator_Data_Append_Input>;
  _delete_at_path?: InputMaybe<Investigator_Data_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Investigator_Data_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Investigator_Data_Delete_Key_Input>;
  _inc?: InputMaybe<Investigator_Data_Inc_Input>;
  _prepend?: InputMaybe<Investigator_Data_Prepend_Input>;
  _set?: InputMaybe<Investigator_Data_Set_Input>;
  pk_columns: Investigator_Data_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Latest_DecksArgs = {
  _inc?: InputMaybe<Latest_Decks_Inc_Input>;
  _set?: InputMaybe<Latest_Decks_Set_Input>;
  where: Latest_Decks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Local_DecksArgs = {
  _inc?: InputMaybe<Local_Decks_Inc_Input>;
  _set?: InputMaybe<Local_Decks_Set_Input>;
  where: Local_Decks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_CampaignsArgs = {
  _inc?: InputMaybe<User_Campaigns_Inc_Input>;
  _set?: InputMaybe<User_Campaigns_Set_Input>;
  where: User_Campaigns_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_FlagArgs = {
  _set?: InputMaybe<User_Flag_Set_Input>;
  where: User_Flag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Flag_By_PkArgs = {
  _set?: InputMaybe<User_Flag_Set_Input>;
  pk_columns: User_Flag_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Flag_TypeArgs = {
  _set?: InputMaybe<User_Flag_Type_Set_Input>;
  where: User_Flag_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Flag_Type_By_PkArgs = {
  _set?: InputMaybe<User_Flag_Type_Set_Input>;
  pk_columns: User_Flag_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_FriendsArgs = {
  _set?: InputMaybe<User_Friends_Set_Input>;
  where: User_Friends_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Received_Friend_RequestsArgs = {
  _set?: InputMaybe<User_Received_Friend_Requests_Set_Input>;
  where: User_Received_Friend_Requests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Sent_Friend_RequestsArgs = {
  _set?: InputMaybe<User_Sent_Friend_Requests_Set_Input>;
  where: User_Sent_Friend_Requests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** An array relationship */
  base_decks: Array<Base_Decks>;
  /** An aggregate relationship */
  base_decks_aggregate: Base_Decks_Aggregate;
  /** fetch data from the table: "campaign" */
  campaign: Array<Campaign>;
  /** fetch data from the table: "campaign_access" */
  campaign_access: Array<Campaign_Access>;
  /** fetch aggregated fields from the table: "campaign_access" */
  campaign_access_aggregate: Campaign_Access_Aggregate;
  /** fetch data from the table: "campaign_access" using primary key columns */
  campaign_access_by_pk?: Maybe<Campaign_Access>;
  /** fetch aggregated fields from the table: "campaign" */
  campaign_aggregate: Campaign_Aggregate;
  /** fetch data from the table: "campaign" using primary key columns */
  campaign_by_pk?: Maybe<Campaign>;
  /** fetch data from the table: "campaign_deck" */
  campaign_deck: Array<Campaign_Deck>;
  /** fetch aggregated fields from the table: "campaign_deck" */
  campaign_deck_aggregate: Campaign_Deck_Aggregate;
  /** fetch data from the table: "campaign_deck" using primary key columns */
  campaign_deck_by_pk?: Maybe<Campaign_Deck>;
  /** fetch data from the table: "campaign_guide" */
  campaign_guide: Array<Campaign_Guide>;
  /** fetch aggregated fields from the table: "campaign_guide" */
  campaign_guide_aggregate: Campaign_Guide_Aggregate;
  /** fetch data from the table: "campaign_investigator" */
  campaign_investigator: Array<Campaign_Investigator>;
  /** fetch aggregated fields from the table: "campaign_investigator" */
  campaign_investigator_aggregate: Campaign_Investigator_Aggregate;
  /** fetch data from the table: "campaign_investigator" using primary key columns */
  campaign_investigator_by_pk?: Maybe<Campaign_Investigator>;
  /** fetch data from the table: "card" */
  card: Array<Card>;
  /** fetch aggregated fields from the table: "card" */
  card_aggregate: Card_Aggregate;
  /** fetch data from the table: "card" using primary key columns */
  card_by_pk?: Maybe<Card>;
  /** fetch data from the table: "card_pack" */
  card_pack: Array<Card_Pack>;
  /** fetch aggregated fields from the table: "card_pack" */
  card_pack_aggregate: Card_Pack_Aggregate;
  /** fetch data from the table: "card_pack" using primary key columns */
  card_pack_by_pk?: Maybe<Card_Pack>;
  /** fetch data from the table: "card_text" */
  card_text: Array<Card_Text>;
  /** fetch aggregated fields from the table: "card_text" */
  card_text_aggregate: Card_Text_Aggregate;
  /** fetch data from the table: "card_text" using primary key columns */
  card_text_by_pk?: Maybe<Card_Text>;
  /** An array relationship */
  chaos_bag_result: Array<Chaos_Bag_Result>;
  /** An aggregate relationship */
  chaos_bag_result_aggregate: Chaos_Bag_Result_Aggregate;
  /** fetch data from the table: "chaos_bag_result" using primary key columns */
  chaos_bag_result_by_pk?: Maybe<Chaos_Bag_Result>;
  /** fetch data from the table: "chaos_bag_tarot_mode" */
  chaos_bag_tarot_mode: Array<Chaos_Bag_Tarot_Mode>;
  /** fetch aggregated fields from the table: "chaos_bag_tarot_mode" */
  chaos_bag_tarot_mode_aggregate: Chaos_Bag_Tarot_Mode_Aggregate;
  /** fetch data from the table: "chaos_bag_tarot_mode" using primary key columns */
  chaos_bag_tarot_mode_by_pk?: Maybe<Chaos_Bag_Tarot_Mode>;
  /** fetch data from the table: "faq" */
  faq: Array<Faq>;
  /** fetch aggregated fields from the table: "faq" */
  faq_aggregate: Faq_Aggregate;
  /** fetch data from the table: "faq" using primary key columns */
  faq_by_pk?: Maybe<Faq>;
  /** fetch data from the table: "faq_text" */
  faq_text: Array<Faq_Text>;
  /** fetch aggregated fields from the table: "faq_text" */
  faq_text_aggregate: Faq_Text_Aggregate;
  /** fetch data from the table: "faq_text" using primary key columns */
  faq_text_by_pk?: Maybe<Faq_Text>;
  /** fetch data from the table: "friend_status" */
  friend_status: Array<Friend_Status>;
  /** fetch aggregated fields from the table: "friend_status" */
  friend_status_aggregate: Friend_Status_Aggregate;
  /** fetch data from the table: "friend_status" using primary key columns */
  friend_status_by_pk?: Maybe<Friend_Status>;
  /** fetch data from the table: "friend_status_type" */
  friend_status_type: Array<Friend_Status_Type>;
  /** fetch aggregated fields from the table: "friend_status_type" */
  friend_status_type_aggregate: Friend_Status_Type_Aggregate;
  /** fetch data from the table: "friend_status_type" using primary key columns */
  friend_status_type_by_pk?: Maybe<Friend_Status_Type>;
  /** fetch data from the table: "guide_achievement" */
  guide_achievement: Array<Guide_Achievement>;
  /** fetch aggregated fields from the table: "guide_achievement" */
  guide_achievement_aggregate: Guide_Achievement_Aggregate;
  /** fetch data from the table: "guide_achievement" using primary key columns */
  guide_achievement_by_pk?: Maybe<Guide_Achievement>;
  /** fetch data from the table: "guide_input" */
  guide_input: Array<Guide_Input>;
  /** fetch aggregated fields from the table: "guide_input" */
  guide_input_aggregate: Guide_Input_Aggregate;
  /** fetch data from the table: "guide_input" using primary key columns */
  guide_input_by_pk?: Maybe<Guide_Input>;
  /** An array relationship */
  investigator_data: Array<Investigator_Data>;
  /** An aggregate relationship */
  investigator_data_aggregate: Investigator_Data_Aggregate;
  /** fetch data from the table: "investigator_data" using primary key columns */
  investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** An array relationship */
  latest_decks: Array<Latest_Decks>;
  /** An aggregate relationship */
  latest_decks_aggregate: Latest_Decks_Aggregate;
  /** An array relationship */
  local_decks: Array<Local_Decks>;
  /** An aggregate relationship */
  local_decks_aggregate: Local_Decks_Aggregate;
  /** fetch data from the table: "user_campaigns" */
  user_campaigns: Array<User_Campaigns>;
  /** fetch aggregated fields from the table: "user_campaigns" */
  user_campaigns_aggregate: User_Campaigns_Aggregate;
  /** fetch data from the table: "user_flag" */
  user_flag: Array<User_Flag>;
  /** fetch aggregated fields from the table: "user_flag" */
  user_flag_aggregate: User_Flag_Aggregate;
  /** fetch data from the table: "user_flag" using primary key columns */
  user_flag_by_pk?: Maybe<User_Flag>;
  /** fetch data from the table: "user_flag_type" */
  user_flag_type: Array<User_Flag_Type>;
  /** fetch aggregated fields from the table: "user_flag_type" */
  user_flag_type_aggregate: User_Flag_Type_Aggregate;
  /** fetch data from the table: "user_flag_type" using primary key columns */
  user_flag_type_by_pk?: Maybe<User_Flag_Type>;
  /** fetch data from the table: "user_friends" */
  user_friends: Array<User_Friends>;
  /** fetch aggregated fields from the table: "user_friends" */
  user_friends_aggregate: User_Friends_Aggregate;
  /** fetch data from the table: "user_received_friend_requests" */
  user_received_friend_requests: Array<User_Received_Friend_Requests>;
  /** fetch aggregated fields from the table: "user_received_friend_requests" */
  user_received_friend_requests_aggregate: User_Received_Friend_Requests_Aggregate;
  /** fetch data from the table: "user_sent_friend_requests" */
  user_sent_friend_requests: Array<User_Sent_Friend_Requests>;
  /** fetch aggregated fields from the table: "user_sent_friend_requests" */
  user_sent_friend_requests_aggregate: User_Sent_Friend_Requests_Aggregate;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Query_RootBase_DecksArgs = {
  distinct_on?: InputMaybe<Array<Base_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Base_Decks_Order_By>>;
  where?: InputMaybe<Base_Decks_Bool_Exp>;
};


export type Query_RootBase_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Base_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Base_Decks_Order_By>>;
  where?: InputMaybe<Base_Decks_Bool_Exp>;
};


export type Query_RootCampaignArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Order_By>>;
  where?: InputMaybe<Campaign_Bool_Exp>;
};


export type Query_RootCampaign_AccessArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


export type Query_RootCampaign_Access_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


export type Query_RootCampaign_Access_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootCampaign_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Order_By>>;
  where?: InputMaybe<Campaign_Bool_Exp>;
};


export type Query_RootCampaign_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootCampaign_DeckArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


export type Query_RootCampaign_Deck_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


export type Query_RootCampaign_Deck_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootCampaign_GuideArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Guide_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Guide_Order_By>>;
  where?: InputMaybe<Campaign_Guide_Bool_Exp>;
};


export type Query_RootCampaign_Guide_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Guide_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Guide_Order_By>>;
  where?: InputMaybe<Campaign_Guide_Bool_Exp>;
};


export type Query_RootCampaign_InvestigatorArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Investigator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Investigator_Order_By>>;
  where?: InputMaybe<Campaign_Investigator_Bool_Exp>;
};


export type Query_RootCampaign_Investigator_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Investigator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Investigator_Order_By>>;
  where?: InputMaybe<Campaign_Investigator_Bool_Exp>;
};


export type Query_RootCampaign_Investigator_By_PkArgs = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};


export type Query_RootCardArgs = {
  distinct_on?: InputMaybe<Array<Card_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Order_By>>;
  where?: InputMaybe<Card_Bool_Exp>;
};


export type Query_RootCard_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Order_By>>;
  where?: InputMaybe<Card_Bool_Exp>;
};


export type Query_RootCard_By_PkArgs = {
  code: Scalars['String'];
};


export type Query_RootCard_PackArgs = {
  distinct_on?: InputMaybe<Array<Card_Pack_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Pack_Order_By>>;
  where?: InputMaybe<Card_Pack_Bool_Exp>;
};


export type Query_RootCard_Pack_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Pack_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Pack_Order_By>>;
  where?: InputMaybe<Card_Pack_Bool_Exp>;
};


export type Query_RootCard_Pack_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


export type Query_RootCard_TextArgs = {
  distinct_on?: InputMaybe<Array<Card_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Text_Order_By>>;
  where?: InputMaybe<Card_Text_Bool_Exp>;
};


export type Query_RootCard_Text_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Text_Order_By>>;
  where?: InputMaybe<Card_Text_Bool_Exp>;
};


export type Query_RootCard_Text_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


export type Query_RootChaos_Bag_ResultArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Result_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
};


export type Query_RootChaos_Bag_Result_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Result_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
};


export type Query_RootChaos_Bag_Result_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootChaos_Bag_Tarot_ModeArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Tarot_Mode_Bool_Exp>;
};


export type Query_RootChaos_Bag_Tarot_Mode_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Tarot_Mode_Bool_Exp>;
};


export type Query_RootChaos_Bag_Tarot_Mode_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootFaqArgs = {
  distinct_on?: InputMaybe<Array<Faq_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Order_By>>;
  where?: InputMaybe<Faq_Bool_Exp>;
};


export type Query_RootFaq_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Faq_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Order_By>>;
  where?: InputMaybe<Faq_Bool_Exp>;
};


export type Query_RootFaq_By_PkArgs = {
  code: Scalars['String'];
};


export type Query_RootFaq_TextArgs = {
  distinct_on?: InputMaybe<Array<Faq_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Text_Order_By>>;
  where?: InputMaybe<Faq_Text_Bool_Exp>;
};


export type Query_RootFaq_Text_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Faq_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Text_Order_By>>;
  where?: InputMaybe<Faq_Text_Bool_Exp>;
};


export type Query_RootFaq_Text_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


export type Query_RootFriend_StatusArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Order_By>>;
  where?: InputMaybe<Friend_Status_Bool_Exp>;
};


export type Query_RootFriend_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Order_By>>;
  where?: InputMaybe<Friend_Status_Bool_Exp>;
};


export type Query_RootFriend_Status_By_PkArgs = {
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};


export type Query_RootFriend_Status_TypeArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Type_Order_By>>;
  where?: InputMaybe<Friend_Status_Type_Bool_Exp>;
};


export type Query_RootFriend_Status_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Type_Order_By>>;
  where?: InputMaybe<Friend_Status_Type_Bool_Exp>;
};


export type Query_RootFriend_Status_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootGuide_AchievementArgs = {
  distinct_on?: InputMaybe<Array<Guide_Achievement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Achievement_Order_By>>;
  where?: InputMaybe<Guide_Achievement_Bool_Exp>;
};


export type Query_RootGuide_Achievement_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guide_Achievement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Achievement_Order_By>>;
  where?: InputMaybe<Guide_Achievement_Bool_Exp>;
};


export type Query_RootGuide_Achievement_By_PkArgs = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};


export type Query_RootGuide_InputArgs = {
  distinct_on?: InputMaybe<Array<Guide_Input_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Input_Order_By>>;
  where?: InputMaybe<Guide_Input_Bool_Exp>;
};


export type Query_RootGuide_Input_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guide_Input_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Input_Order_By>>;
  where?: InputMaybe<Guide_Input_Bool_Exp>;
};


export type Query_RootGuide_Input_By_PkArgs = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};


export type Query_RootInvestigator_DataArgs = {
  distinct_on?: InputMaybe<Array<Investigator_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Investigator_Data_Order_By>>;
  where?: InputMaybe<Investigator_Data_Bool_Exp>;
};


export type Query_RootInvestigator_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investigator_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Investigator_Data_Order_By>>;
  where?: InputMaybe<Investigator_Data_Bool_Exp>;
};


export type Query_RootInvestigator_Data_By_PkArgs = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};


export type Query_RootLatest_DecksArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


export type Query_RootLatest_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


export type Query_RootLocal_DecksArgs = {
  distinct_on?: InputMaybe<Array<Local_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Local_Decks_Order_By>>;
  where?: InputMaybe<Local_Decks_Bool_Exp>;
};


export type Query_RootLocal_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Local_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Local_Decks_Order_By>>;
  where?: InputMaybe<Local_Decks_Bool_Exp>;
};


export type Query_RootUser_CampaignsArgs = {
  distinct_on?: InputMaybe<Array<User_Campaigns_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Campaigns_Order_By>>;
  where?: InputMaybe<User_Campaigns_Bool_Exp>;
};


export type Query_RootUser_Campaigns_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Campaigns_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Campaigns_Order_By>>;
  where?: InputMaybe<User_Campaigns_Bool_Exp>;
};


export type Query_RootUser_FlagArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Order_By>>;
  where?: InputMaybe<User_Flag_Bool_Exp>;
};


export type Query_RootUser_Flag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Order_By>>;
  where?: InputMaybe<User_Flag_Bool_Exp>;
};


export type Query_RootUser_Flag_By_PkArgs = {
  flag: User_Flag_Type_Enum;
  user_id: Scalars['String'];
};


export type Query_RootUser_Flag_TypeArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Type_Order_By>>;
  where?: InputMaybe<User_Flag_Type_Bool_Exp>;
};


export type Query_RootUser_Flag_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Type_Order_By>>;
  where?: InputMaybe<User_Flag_Type_Bool_Exp>;
};


export type Query_RootUser_Flag_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootUser_FriendsArgs = {
  distinct_on?: InputMaybe<Array<User_Friends_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Friends_Order_By>>;
  where?: InputMaybe<User_Friends_Bool_Exp>;
};


export type Query_RootUser_Friends_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Friends_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Friends_Order_By>>;
  where?: InputMaybe<User_Friends_Bool_Exp>;
};


export type Query_RootUser_Received_Friend_RequestsArgs = {
  distinct_on?: InputMaybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
};


export type Query_RootUser_Received_Friend_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
};


export type Query_RootUser_Sent_Friend_RequestsArgs = {
  distinct_on?: InputMaybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
};


export type Query_RootUser_Sent_Friend_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
  id: Scalars['String'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  base_decks: Array<Base_Decks>;
  /** An aggregate relationship */
  base_decks_aggregate: Base_Decks_Aggregate;
  /** fetch data from the table: "campaign" */
  campaign: Array<Campaign>;
  /** fetch data from the table: "campaign_access" */
  campaign_access: Array<Campaign_Access>;
  /** fetch aggregated fields from the table: "campaign_access" */
  campaign_access_aggregate: Campaign_Access_Aggregate;
  /** fetch data from the table: "campaign_access" using primary key columns */
  campaign_access_by_pk?: Maybe<Campaign_Access>;
  /** fetch aggregated fields from the table: "campaign" */
  campaign_aggregate: Campaign_Aggregate;
  /** fetch data from the table: "campaign" using primary key columns */
  campaign_by_pk?: Maybe<Campaign>;
  /** fetch data from the table: "campaign_deck" */
  campaign_deck: Array<Campaign_Deck>;
  /** fetch aggregated fields from the table: "campaign_deck" */
  campaign_deck_aggregate: Campaign_Deck_Aggregate;
  /** fetch data from the table: "campaign_deck" using primary key columns */
  campaign_deck_by_pk?: Maybe<Campaign_Deck>;
  /** fetch data from the table: "campaign_guide" */
  campaign_guide: Array<Campaign_Guide>;
  /** fetch aggregated fields from the table: "campaign_guide" */
  campaign_guide_aggregate: Campaign_Guide_Aggregate;
  /** fetch data from the table: "campaign_investigator" */
  campaign_investigator: Array<Campaign_Investigator>;
  /** fetch aggregated fields from the table: "campaign_investigator" */
  campaign_investigator_aggregate: Campaign_Investigator_Aggregate;
  /** fetch data from the table: "campaign_investigator" using primary key columns */
  campaign_investigator_by_pk?: Maybe<Campaign_Investigator>;
  /** fetch data from the table: "card" */
  card: Array<Card>;
  /** fetch aggregated fields from the table: "card" */
  card_aggregate: Card_Aggregate;
  /** fetch data from the table: "card" using primary key columns */
  card_by_pk?: Maybe<Card>;
  /** fetch data from the table: "card_pack" */
  card_pack: Array<Card_Pack>;
  /** fetch aggregated fields from the table: "card_pack" */
  card_pack_aggregate: Card_Pack_Aggregate;
  /** fetch data from the table: "card_pack" using primary key columns */
  card_pack_by_pk?: Maybe<Card_Pack>;
  /** fetch data from the table: "card_text" */
  card_text: Array<Card_Text>;
  /** fetch aggregated fields from the table: "card_text" */
  card_text_aggregate: Card_Text_Aggregate;
  /** fetch data from the table: "card_text" using primary key columns */
  card_text_by_pk?: Maybe<Card_Text>;
  /** An array relationship */
  chaos_bag_result: Array<Chaos_Bag_Result>;
  /** An aggregate relationship */
  chaos_bag_result_aggregate: Chaos_Bag_Result_Aggregate;
  /** fetch data from the table: "chaos_bag_result" using primary key columns */
  chaos_bag_result_by_pk?: Maybe<Chaos_Bag_Result>;
  /** fetch data from the table: "chaos_bag_tarot_mode" */
  chaos_bag_tarot_mode: Array<Chaos_Bag_Tarot_Mode>;
  /** fetch aggregated fields from the table: "chaos_bag_tarot_mode" */
  chaos_bag_tarot_mode_aggregate: Chaos_Bag_Tarot_Mode_Aggregate;
  /** fetch data from the table: "chaos_bag_tarot_mode" using primary key columns */
  chaos_bag_tarot_mode_by_pk?: Maybe<Chaos_Bag_Tarot_Mode>;
  /** fetch data from the table: "faq" */
  faq: Array<Faq>;
  /** fetch aggregated fields from the table: "faq" */
  faq_aggregate: Faq_Aggregate;
  /** fetch data from the table: "faq" using primary key columns */
  faq_by_pk?: Maybe<Faq>;
  /** fetch data from the table: "faq_text" */
  faq_text: Array<Faq_Text>;
  /** fetch aggregated fields from the table: "faq_text" */
  faq_text_aggregate: Faq_Text_Aggregate;
  /** fetch data from the table: "faq_text" using primary key columns */
  faq_text_by_pk?: Maybe<Faq_Text>;
  /** fetch data from the table: "friend_status" */
  friend_status: Array<Friend_Status>;
  /** fetch aggregated fields from the table: "friend_status" */
  friend_status_aggregate: Friend_Status_Aggregate;
  /** fetch data from the table: "friend_status" using primary key columns */
  friend_status_by_pk?: Maybe<Friend_Status>;
  /** fetch data from the table: "friend_status_type" */
  friend_status_type: Array<Friend_Status_Type>;
  /** fetch aggregated fields from the table: "friend_status_type" */
  friend_status_type_aggregate: Friend_Status_Type_Aggregate;
  /** fetch data from the table: "friend_status_type" using primary key columns */
  friend_status_type_by_pk?: Maybe<Friend_Status_Type>;
  /** fetch data from the table: "guide_achievement" */
  guide_achievement: Array<Guide_Achievement>;
  /** fetch aggregated fields from the table: "guide_achievement" */
  guide_achievement_aggregate: Guide_Achievement_Aggregate;
  /** fetch data from the table: "guide_achievement" using primary key columns */
  guide_achievement_by_pk?: Maybe<Guide_Achievement>;
  /** fetch data from the table: "guide_input" */
  guide_input: Array<Guide_Input>;
  /** fetch aggregated fields from the table: "guide_input" */
  guide_input_aggregate: Guide_Input_Aggregate;
  /** fetch data from the table: "guide_input" using primary key columns */
  guide_input_by_pk?: Maybe<Guide_Input>;
  /** An array relationship */
  investigator_data: Array<Investigator_Data>;
  /** An aggregate relationship */
  investigator_data_aggregate: Investigator_Data_Aggregate;
  /** fetch data from the table: "investigator_data" using primary key columns */
  investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** An array relationship */
  latest_decks: Array<Latest_Decks>;
  /** An aggregate relationship */
  latest_decks_aggregate: Latest_Decks_Aggregate;
  /** An array relationship */
  local_decks: Array<Local_Decks>;
  /** An aggregate relationship */
  local_decks_aggregate: Local_Decks_Aggregate;
  /** fetch data from the table: "user_campaigns" */
  user_campaigns: Array<User_Campaigns>;
  /** fetch aggregated fields from the table: "user_campaigns" */
  user_campaigns_aggregate: User_Campaigns_Aggregate;
  /** fetch data from the table: "user_flag" */
  user_flag: Array<User_Flag>;
  /** fetch aggregated fields from the table: "user_flag" */
  user_flag_aggregate: User_Flag_Aggregate;
  /** fetch data from the table: "user_flag" using primary key columns */
  user_flag_by_pk?: Maybe<User_Flag>;
  /** fetch data from the table: "user_flag_type" */
  user_flag_type: Array<User_Flag_Type>;
  /** fetch aggregated fields from the table: "user_flag_type" */
  user_flag_type_aggregate: User_Flag_Type_Aggregate;
  /** fetch data from the table: "user_flag_type" using primary key columns */
  user_flag_type_by_pk?: Maybe<User_Flag_Type>;
  /** fetch data from the table: "user_friends" */
  user_friends: Array<User_Friends>;
  /** fetch aggregated fields from the table: "user_friends" */
  user_friends_aggregate: User_Friends_Aggregate;
  /** fetch data from the table: "user_received_friend_requests" */
  user_received_friend_requests: Array<User_Received_Friend_Requests>;
  /** fetch aggregated fields from the table: "user_received_friend_requests" */
  user_received_friend_requests_aggregate: User_Received_Friend_Requests_Aggregate;
  /** fetch data from the table: "user_sent_friend_requests" */
  user_sent_friend_requests: Array<User_Sent_Friend_Requests>;
  /** fetch aggregated fields from the table: "user_sent_friend_requests" */
  user_sent_friend_requests_aggregate: User_Sent_Friend_Requests_Aggregate;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Subscription_RootBase_DecksArgs = {
  distinct_on?: InputMaybe<Array<Base_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Base_Decks_Order_By>>;
  where?: InputMaybe<Base_Decks_Bool_Exp>;
};


export type Subscription_RootBase_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Base_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Base_Decks_Order_By>>;
  where?: InputMaybe<Base_Decks_Bool_Exp>;
};


export type Subscription_RootCampaignArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Order_By>>;
  where?: InputMaybe<Campaign_Bool_Exp>;
};


export type Subscription_RootCampaign_AccessArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


export type Subscription_RootCampaign_Access_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Access_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Access_Order_By>>;
  where?: InputMaybe<Campaign_Access_Bool_Exp>;
};


export type Subscription_RootCampaign_Access_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootCampaign_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Order_By>>;
  where?: InputMaybe<Campaign_Bool_Exp>;
};


export type Subscription_RootCampaign_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootCampaign_DeckArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


export type Subscription_RootCampaign_Deck_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


export type Subscription_RootCampaign_Deck_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootCampaign_GuideArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Guide_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Guide_Order_By>>;
  where?: InputMaybe<Campaign_Guide_Bool_Exp>;
};


export type Subscription_RootCampaign_Guide_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Guide_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Guide_Order_By>>;
  where?: InputMaybe<Campaign_Guide_Bool_Exp>;
};


export type Subscription_RootCampaign_InvestigatorArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Investigator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Investigator_Order_By>>;
  where?: InputMaybe<Campaign_Investigator_Bool_Exp>;
};


export type Subscription_RootCampaign_Investigator_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Investigator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Investigator_Order_By>>;
  where?: InputMaybe<Campaign_Investigator_Bool_Exp>;
};


export type Subscription_RootCampaign_Investigator_By_PkArgs = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};


export type Subscription_RootCardArgs = {
  distinct_on?: InputMaybe<Array<Card_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Order_By>>;
  where?: InputMaybe<Card_Bool_Exp>;
};


export type Subscription_RootCard_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Order_By>>;
  where?: InputMaybe<Card_Bool_Exp>;
};


export type Subscription_RootCard_By_PkArgs = {
  code: Scalars['String'];
};


export type Subscription_RootCard_PackArgs = {
  distinct_on?: InputMaybe<Array<Card_Pack_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Pack_Order_By>>;
  where?: InputMaybe<Card_Pack_Bool_Exp>;
};


export type Subscription_RootCard_Pack_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Pack_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Pack_Order_By>>;
  where?: InputMaybe<Card_Pack_Bool_Exp>;
};


export type Subscription_RootCard_Pack_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


export type Subscription_RootCard_TextArgs = {
  distinct_on?: InputMaybe<Array<Card_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Text_Order_By>>;
  where?: InputMaybe<Card_Text_Bool_Exp>;
};


export type Subscription_RootCard_Text_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Card_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Card_Text_Order_By>>;
  where?: InputMaybe<Card_Text_Bool_Exp>;
};


export type Subscription_RootCard_Text_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


export type Subscription_RootChaos_Bag_ResultArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Result_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
};


export type Subscription_RootChaos_Bag_Result_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Result_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Result_Bool_Exp>;
};


export type Subscription_RootChaos_Bag_Result_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootChaos_Bag_Tarot_ModeArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Tarot_Mode_Bool_Exp>;
};


export type Subscription_RootChaos_Bag_Tarot_Mode_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Chaos_Bag_Tarot_Mode_Order_By>>;
  where?: InputMaybe<Chaos_Bag_Tarot_Mode_Bool_Exp>;
};


export type Subscription_RootChaos_Bag_Tarot_Mode_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootFaqArgs = {
  distinct_on?: InputMaybe<Array<Faq_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Order_By>>;
  where?: InputMaybe<Faq_Bool_Exp>;
};


export type Subscription_RootFaq_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Faq_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Order_By>>;
  where?: InputMaybe<Faq_Bool_Exp>;
};


export type Subscription_RootFaq_By_PkArgs = {
  code: Scalars['String'];
};


export type Subscription_RootFaq_TextArgs = {
  distinct_on?: InputMaybe<Array<Faq_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Text_Order_By>>;
  where?: InputMaybe<Faq_Text_Bool_Exp>;
};


export type Subscription_RootFaq_Text_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Faq_Text_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Faq_Text_Order_By>>;
  where?: InputMaybe<Faq_Text_Bool_Exp>;
};


export type Subscription_RootFaq_Text_By_PkArgs = {
  code: Scalars['String'];
  locale: Scalars['String'];
};


export type Subscription_RootFriend_StatusArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Order_By>>;
  where?: InputMaybe<Friend_Status_Bool_Exp>;
};


export type Subscription_RootFriend_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Order_By>>;
  where?: InputMaybe<Friend_Status_Bool_Exp>;
};


export type Subscription_RootFriend_Status_By_PkArgs = {
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};


export type Subscription_RootFriend_Status_TypeArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Type_Order_By>>;
  where?: InputMaybe<Friend_Status_Type_Bool_Exp>;
};


export type Subscription_RootFriend_Status_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Friend_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Friend_Status_Type_Order_By>>;
  where?: InputMaybe<Friend_Status_Type_Bool_Exp>;
};


export type Subscription_RootFriend_Status_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootGuide_AchievementArgs = {
  distinct_on?: InputMaybe<Array<Guide_Achievement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Achievement_Order_By>>;
  where?: InputMaybe<Guide_Achievement_Bool_Exp>;
};


export type Subscription_RootGuide_Achievement_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guide_Achievement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Achievement_Order_By>>;
  where?: InputMaybe<Guide_Achievement_Bool_Exp>;
};


export type Subscription_RootGuide_Achievement_By_PkArgs = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};


export type Subscription_RootGuide_InputArgs = {
  distinct_on?: InputMaybe<Array<Guide_Input_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Input_Order_By>>;
  where?: InputMaybe<Guide_Input_Bool_Exp>;
};


export type Subscription_RootGuide_Input_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guide_Input_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Guide_Input_Order_By>>;
  where?: InputMaybe<Guide_Input_Bool_Exp>;
};


export type Subscription_RootGuide_Input_By_PkArgs = {
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
};


export type Subscription_RootInvestigator_DataArgs = {
  distinct_on?: InputMaybe<Array<Investigator_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Investigator_Data_Order_By>>;
  where?: InputMaybe<Investigator_Data_Bool_Exp>;
};


export type Subscription_RootInvestigator_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investigator_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Investigator_Data_Order_By>>;
  where?: InputMaybe<Investigator_Data_Bool_Exp>;
};


export type Subscription_RootInvestigator_Data_By_PkArgs = {
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
};


export type Subscription_RootLatest_DecksArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


export type Subscription_RootLatest_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


export type Subscription_RootLocal_DecksArgs = {
  distinct_on?: InputMaybe<Array<Local_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Local_Decks_Order_By>>;
  where?: InputMaybe<Local_Decks_Bool_Exp>;
};


export type Subscription_RootLocal_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Local_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Local_Decks_Order_By>>;
  where?: InputMaybe<Local_Decks_Bool_Exp>;
};


export type Subscription_RootUser_CampaignsArgs = {
  distinct_on?: InputMaybe<Array<User_Campaigns_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Campaigns_Order_By>>;
  where?: InputMaybe<User_Campaigns_Bool_Exp>;
};


export type Subscription_RootUser_Campaigns_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Campaigns_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Campaigns_Order_By>>;
  where?: InputMaybe<User_Campaigns_Bool_Exp>;
};


export type Subscription_RootUser_FlagArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Order_By>>;
  where?: InputMaybe<User_Flag_Bool_Exp>;
};


export type Subscription_RootUser_Flag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Order_By>>;
  where?: InputMaybe<User_Flag_Bool_Exp>;
};


export type Subscription_RootUser_Flag_By_PkArgs = {
  flag: User_Flag_Type_Enum;
  user_id: Scalars['String'];
};


export type Subscription_RootUser_Flag_TypeArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Type_Order_By>>;
  where?: InputMaybe<User_Flag_Type_Bool_Exp>;
};


export type Subscription_RootUser_Flag_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Type_Order_By>>;
  where?: InputMaybe<User_Flag_Type_Bool_Exp>;
};


export type Subscription_RootUser_Flag_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootUser_FriendsArgs = {
  distinct_on?: InputMaybe<Array<User_Friends_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Friends_Order_By>>;
  where?: InputMaybe<User_Friends_Bool_Exp>;
};


export type Subscription_RootUser_Friends_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Friends_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Friends_Order_By>>;
  where?: InputMaybe<User_Friends_Bool_Exp>;
};


export type Subscription_RootUser_Received_Friend_RequestsArgs = {
  distinct_on?: InputMaybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
};


export type Subscription_RootUser_Received_Friend_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
};


export type Subscription_RootUser_Sent_Friend_RequestsArgs = {
  distinct_on?: InputMaybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
};


export type Subscription_RootUser_Sent_Friend_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['String'];
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "user_campaigns" */
export type User_Campaigns = {
  __typename?: 'user_campaigns';
  /** An object relationship */
  campaign?: Maybe<Campaign>;
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
};

/** aggregated selection of "user_campaigns" */
export type User_Campaigns_Aggregate = {
  __typename?: 'user_campaigns_aggregate';
  aggregate?: Maybe<User_Campaigns_Aggregate_Fields>;
  nodes: Array<User_Campaigns>;
};

/** aggregate fields of "user_campaigns" */
export type User_Campaigns_Aggregate_Fields = {
  __typename?: 'user_campaigns_aggregate_fields';
  avg?: Maybe<User_Campaigns_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<User_Campaigns_Max_Fields>;
  min?: Maybe<User_Campaigns_Min_Fields>;
  stddev?: Maybe<User_Campaigns_Stddev_Fields>;
  stddev_pop?: Maybe<User_Campaigns_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Campaigns_Stddev_Samp_Fields>;
  sum?: Maybe<User_Campaigns_Sum_Fields>;
  var_pop?: Maybe<User_Campaigns_Var_Pop_Fields>;
  var_samp?: Maybe<User_Campaigns_Var_Samp_Fields>;
  variance?: Maybe<User_Campaigns_Variance_Fields>;
};


/** aggregate fields of "user_campaigns" */
export type User_Campaigns_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Campaigns_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_campaigns" */
export type User_Campaigns_Aggregate_Order_By = {
  avg?: InputMaybe<User_Campaigns_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Campaigns_Max_Order_By>;
  min?: InputMaybe<User_Campaigns_Min_Order_By>;
  stddev?: InputMaybe<User_Campaigns_Stddev_Order_By>;
  stddev_pop?: InputMaybe<User_Campaigns_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<User_Campaigns_Stddev_Samp_Order_By>;
  sum?: InputMaybe<User_Campaigns_Sum_Order_By>;
  var_pop?: InputMaybe<User_Campaigns_Var_Pop_Order_By>;
  var_samp?: InputMaybe<User_Campaigns_Var_Samp_Order_By>;
  variance?: InputMaybe<User_Campaigns_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "user_campaigns" */
export type User_Campaigns_Arr_Rel_Insert_Input = {
  data: Array<User_Campaigns_Insert_Input>;
};

/** aggregate avg on columns */
export type User_Campaigns_Avg_Fields = {
  __typename?: 'user_campaigns_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "user_campaigns" */
export type User_Campaigns_Avg_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "user_campaigns". All fields are combined with a logical 'AND'. */
export type User_Campaigns_Bool_Exp = {
  _and?: InputMaybe<Array<User_Campaigns_Bool_Exp>>;
  _not?: InputMaybe<User_Campaigns_Bool_Exp>;
  _or?: InputMaybe<Array<User_Campaigns_Bool_Exp>>;
  campaign?: InputMaybe<Campaign_Bool_Exp>;
  campaign_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "user_campaigns" */
export type User_Campaigns_Inc_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "user_campaigns" */
export type User_Campaigns_Insert_Input = {
  campaign?: InputMaybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Campaigns_Max_Fields = {
  __typename?: 'user_campaigns_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_campaigns" */
export type User_Campaigns_Max_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Campaigns_Min_Fields = {
  __typename?: 'user_campaigns_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_campaigns" */
export type User_Campaigns_Min_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_campaigns" */
export type User_Campaigns_Mutation_Response = {
  __typename?: 'user_campaigns_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Campaigns>;
};

/** Ordering options when selecting data from "user_campaigns". */
export type User_Campaigns_Order_By = {
  campaign?: InputMaybe<Campaign_Order_By>;
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** select columns of table "user_campaigns" */
export enum User_Campaigns_Select_Column {
  /** column name */
  CampaignId = 'campaign_id',
  /** column name */
  Id = 'id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "user_campaigns" */
export type User_Campaigns_Set_Input = {
  campaign_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type User_Campaigns_Stddev_Fields = {
  __typename?: 'user_campaigns_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "user_campaigns" */
export type User_Campaigns_Stddev_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type User_Campaigns_Stddev_Pop_Fields = {
  __typename?: 'user_campaigns_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "user_campaigns" */
export type User_Campaigns_Stddev_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type User_Campaigns_Stddev_Samp_Fields = {
  __typename?: 'user_campaigns_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "user_campaigns" */
export type User_Campaigns_Stddev_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type User_Campaigns_Sum_Fields = {
  __typename?: 'user_campaigns_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "user_campaigns" */
export type User_Campaigns_Sum_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type User_Campaigns_Var_Pop_Fields = {
  __typename?: 'user_campaigns_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "user_campaigns" */
export type User_Campaigns_Var_Pop_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type User_Campaigns_Var_Samp_Fields = {
  __typename?: 'user_campaigns_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "user_campaigns" */
export type User_Campaigns_Var_Samp_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type User_Campaigns_Variance_Fields = {
  __typename?: 'user_campaigns_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "user_campaigns" */
export type User_Campaigns_Variance_Order_By = {
  campaign_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** columns and relationships of "user_flag" */
export type User_Flag = {
  __typename?: 'user_flag';
  flag: User_Flag_Type_Enum;
  user_id: Scalars['String'];
};

/** aggregated selection of "user_flag" */
export type User_Flag_Aggregate = {
  __typename?: 'user_flag_aggregate';
  aggregate?: Maybe<User_Flag_Aggregate_Fields>;
  nodes: Array<User_Flag>;
};

/** aggregate fields of "user_flag" */
export type User_Flag_Aggregate_Fields = {
  __typename?: 'user_flag_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Flag_Max_Fields>;
  min?: Maybe<User_Flag_Min_Fields>;
};


/** aggregate fields of "user_flag" */
export type User_Flag_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Flag_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_flag" */
export type User_Flag_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Flag_Max_Order_By>;
  min?: InputMaybe<User_Flag_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_flag" */
export type User_Flag_Arr_Rel_Insert_Input = {
  data: Array<User_Flag_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<User_Flag_On_Conflict>;
};

/** Boolean expression to filter rows from the table "user_flag". All fields are combined with a logical 'AND'. */
export type User_Flag_Bool_Exp = {
  _and?: InputMaybe<Array<User_Flag_Bool_Exp>>;
  _not?: InputMaybe<User_Flag_Bool_Exp>;
  _or?: InputMaybe<Array<User_Flag_Bool_Exp>>;
  flag?: InputMaybe<User_Flag_Type_Enum_Comparison_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_flag" */
export enum User_Flag_Constraint {
  /** unique or primary key constraint */
  UserFlagPkey = 'user_flag_pkey'
}

/** input type for inserting data into table "user_flag" */
export type User_Flag_Insert_Input = {
  flag?: InputMaybe<User_Flag_Type_Enum>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Flag_Max_Fields = {
  __typename?: 'user_flag_max_fields';
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_flag" */
export type User_Flag_Max_Order_By = {
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Flag_Min_Fields = {
  __typename?: 'user_flag_min_fields';
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_flag" */
export type User_Flag_Min_Order_By = {
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_flag" */
export type User_Flag_Mutation_Response = {
  __typename?: 'user_flag_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Flag>;
};

/** on conflict condition type for table "user_flag" */
export type User_Flag_On_Conflict = {
  constraint: User_Flag_Constraint;
  update_columns: Array<User_Flag_Update_Column>;
  where?: InputMaybe<User_Flag_Bool_Exp>;
};

/** Ordering options when selecting data from "user_flag". */
export type User_Flag_Order_By = {
  flag?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_flag */
export type User_Flag_Pk_Columns_Input = {
  flag: User_Flag_Type_Enum;
  user_id: Scalars['String'];
};

/** select columns of table "user_flag" */
export enum User_Flag_Select_Column {
  /** column name */
  Flag = 'flag',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "user_flag" */
export type User_Flag_Set_Input = {
  flag?: InputMaybe<User_Flag_Type_Enum>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "user_flag_type" */
export type User_Flag_Type = {
  __typename?: 'user_flag_type';
  value: Scalars['String'];
};

/** aggregated selection of "user_flag_type" */
export type User_Flag_Type_Aggregate = {
  __typename?: 'user_flag_type_aggregate';
  aggregate?: Maybe<User_Flag_Type_Aggregate_Fields>;
  nodes: Array<User_Flag_Type>;
};

/** aggregate fields of "user_flag_type" */
export type User_Flag_Type_Aggregate_Fields = {
  __typename?: 'user_flag_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Flag_Type_Max_Fields>;
  min?: Maybe<User_Flag_Type_Min_Fields>;
};


/** aggregate fields of "user_flag_type" */
export type User_Flag_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Flag_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "user_flag_type". All fields are combined with a logical 'AND'. */
export type User_Flag_Type_Bool_Exp = {
  _and?: InputMaybe<Array<User_Flag_Type_Bool_Exp>>;
  _not?: InputMaybe<User_Flag_Type_Bool_Exp>;
  _or?: InputMaybe<Array<User_Flag_Type_Bool_Exp>>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_flag_type" */
export enum User_Flag_Type_Constraint {
  /** unique or primary key constraint */
  UserFlagTypePkey = 'user_flag_type_pkey'
}

export enum User_Flag_Type_Enum {
  Admin = 'admin',
  EsDv = 'es_dv',
  EsDvAdmin = 'es_dv_admin'
}

/** Boolean expression to compare columns of type "user_flag_type_enum". All fields are combined with logical 'AND'. */
export type User_Flag_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<User_Flag_Type_Enum>;
  _in?: InputMaybe<Array<User_Flag_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<User_Flag_Type_Enum>;
  _nin?: InputMaybe<Array<User_Flag_Type_Enum>>;
};

/** input type for inserting data into table "user_flag_type" */
export type User_Flag_Type_Insert_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Flag_Type_Max_Fields = {
  __typename?: 'user_flag_type_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type User_Flag_Type_Min_Fields = {
  __typename?: 'user_flag_type_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "user_flag_type" */
export type User_Flag_Type_Mutation_Response = {
  __typename?: 'user_flag_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Flag_Type>;
};

/** on conflict condition type for table "user_flag_type" */
export type User_Flag_Type_On_Conflict = {
  constraint: User_Flag_Type_Constraint;
  update_columns: Array<User_Flag_Type_Update_Column>;
  where?: InputMaybe<User_Flag_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "user_flag_type". */
export type User_Flag_Type_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_flag_type */
export type User_Flag_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "user_flag_type" */
export enum User_Flag_Type_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "user_flag_type" */
export type User_Flag_Type_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "user_flag_type" */
export enum User_Flag_Type_Update_Column {
  /** column name */
  Value = 'value'
}

/** update columns of table "user_flag" */
export enum User_Flag_Update_Column {
  /** column name */
  Flag = 'flag',
  /** column name */
  UserId = 'user_id'
}

/** columns and relationships of "user_friends" */
export type User_Friends = {
  __typename?: 'user_friends';
  status?: Maybe<Scalars['String']>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregated selection of "user_friends" */
export type User_Friends_Aggregate = {
  __typename?: 'user_friends_aggregate';
  aggregate?: Maybe<User_Friends_Aggregate_Fields>;
  nodes: Array<User_Friends>;
};

/** aggregate fields of "user_friends" */
export type User_Friends_Aggregate_Fields = {
  __typename?: 'user_friends_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Friends_Max_Fields>;
  min?: Maybe<User_Friends_Min_Fields>;
};


/** aggregate fields of "user_friends" */
export type User_Friends_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Friends_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_friends" */
export type User_Friends_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Friends_Max_Order_By>;
  min?: InputMaybe<User_Friends_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_friends" */
export type User_Friends_Arr_Rel_Insert_Input = {
  data: Array<User_Friends_Insert_Input>;
};

/** Boolean expression to filter rows from the table "user_friends". All fields are combined with a logical 'AND'. */
export type User_Friends_Bool_Exp = {
  _and?: InputMaybe<Array<User_Friends_Bool_Exp>>;
  _not?: InputMaybe<User_Friends_Bool_Exp>;
  _or?: InputMaybe<Array<User_Friends_Bool_Exp>>;
  status?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id_a?: InputMaybe<String_Comparison_Exp>;
  user_id_b?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "user_friends" */
export type User_Friends_Insert_Input = {
  status?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Friends_Max_Fields = {
  __typename?: 'user_friends_max_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_friends" */
export type User_Friends_Max_Order_By = {
  status?: InputMaybe<Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Friends_Min_Fields = {
  __typename?: 'user_friends_min_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_friends" */
export type User_Friends_Min_Order_By = {
  status?: InputMaybe<Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_friends" */
export type User_Friends_Mutation_Response = {
  __typename?: 'user_friends_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Friends>;
};

/** Ordering options when selecting data from "user_friends". */
export type User_Friends_Order_By = {
  status?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** select columns of table "user_friends" */
export enum User_Friends_Select_Column {
  /** column name */
  Status = 'status',
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** input type for updating data in table "user_friends" */
export type User_Friends_Set_Input = {
  status?: InputMaybe<Scalars['String']>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "user_received_friend_requests" */
export type User_Received_Friend_Requests = {
  __typename?: 'user_received_friend_requests';
  status?: Maybe<Scalars['String']>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregated selection of "user_received_friend_requests" */
export type User_Received_Friend_Requests_Aggregate = {
  __typename?: 'user_received_friend_requests_aggregate';
  aggregate?: Maybe<User_Received_Friend_Requests_Aggregate_Fields>;
  nodes: Array<User_Received_Friend_Requests>;
};

/** aggregate fields of "user_received_friend_requests" */
export type User_Received_Friend_Requests_Aggregate_Fields = {
  __typename?: 'user_received_friend_requests_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Received_Friend_Requests_Max_Fields>;
  min?: Maybe<User_Received_Friend_Requests_Min_Fields>;
};


/** aggregate fields of "user_received_friend_requests" */
export type User_Received_Friend_Requests_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Received_Friend_Requests_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Received_Friend_Requests_Max_Order_By>;
  min?: InputMaybe<User_Received_Friend_Requests_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Arr_Rel_Insert_Input = {
  data: Array<User_Received_Friend_Requests_Insert_Input>;
};

/** Boolean expression to filter rows from the table "user_received_friend_requests". All fields are combined with a logical 'AND'. */
export type User_Received_Friend_Requests_Bool_Exp = {
  _and?: InputMaybe<Array<User_Received_Friend_Requests_Bool_Exp>>;
  _not?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
  _or?: InputMaybe<Array<User_Received_Friend_Requests_Bool_Exp>>;
  status?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id_a?: InputMaybe<String_Comparison_Exp>;
  user_id_b?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Insert_Input = {
  status?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Received_Friend_Requests_Max_Fields = {
  __typename?: 'user_received_friend_requests_max_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Max_Order_By = {
  status?: InputMaybe<Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Received_Friend_Requests_Min_Fields = {
  __typename?: 'user_received_friend_requests_min_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Min_Order_By = {
  status?: InputMaybe<Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Mutation_Response = {
  __typename?: 'user_received_friend_requests_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Received_Friend_Requests>;
};

/** Ordering options when selecting data from "user_received_friend_requests". */
export type User_Received_Friend_Requests_Order_By = {
  status?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** select columns of table "user_received_friend_requests" */
export enum User_Received_Friend_Requests_Select_Column {
  /** column name */
  Status = 'status',
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** input type for updating data in table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Set_Input = {
  status?: InputMaybe<Scalars['String']>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "user_sent_friend_requests" */
export type User_Sent_Friend_Requests = {
  __typename?: 'user_sent_friend_requests';
  status?: Maybe<Scalars['String']>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregated selection of "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Aggregate = {
  __typename?: 'user_sent_friend_requests_aggregate';
  aggregate?: Maybe<User_Sent_Friend_Requests_Aggregate_Fields>;
  nodes: Array<User_Sent_Friend_Requests>;
};

/** aggregate fields of "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Aggregate_Fields = {
  __typename?: 'user_sent_friend_requests_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Sent_Friend_Requests_Max_Fields>;
  min?: Maybe<User_Sent_Friend_Requests_Min_Fields>;
};


/** aggregate fields of "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Sent_Friend_Requests_Max_Order_By>;
  min?: InputMaybe<User_Sent_Friend_Requests_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Arr_Rel_Insert_Input = {
  data: Array<User_Sent_Friend_Requests_Insert_Input>;
};

/** Boolean expression to filter rows from the table "user_sent_friend_requests". All fields are combined with a logical 'AND'. */
export type User_Sent_Friend_Requests_Bool_Exp = {
  _and?: InputMaybe<Array<User_Sent_Friend_Requests_Bool_Exp>>;
  _not?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
  _or?: InputMaybe<Array<User_Sent_Friend_Requests_Bool_Exp>>;
  status?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id_a?: InputMaybe<String_Comparison_Exp>;
  user_id_b?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Insert_Input = {
  status?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Sent_Friend_Requests_Max_Fields = {
  __typename?: 'user_sent_friend_requests_max_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Max_Order_By = {
  status?: InputMaybe<Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Sent_Friend_Requests_Min_Fields = {
  __typename?: 'user_sent_friend_requests_min_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Min_Order_By = {
  status?: InputMaybe<Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Mutation_Response = {
  __typename?: 'user_sent_friend_requests_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Sent_Friend_Requests>;
};

/** Ordering options when selecting data from "user_sent_friend_requests". */
export type User_Sent_Friend_Requests_Order_By = {
  status?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id_a?: InputMaybe<Order_By>;
  user_id_b?: InputMaybe<Order_By>;
};

/** select columns of table "user_sent_friend_requests" */
export enum User_Sent_Friend_Requests_Select_Column {
  /** column name */
  Status = 'status',
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** input type for updating data in table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Set_Input = {
  status?: InputMaybe<Scalars['String']>;
  user_id_a?: InputMaybe<Scalars['String']>;
  user_id_b?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  /** An array relationship */
  all_decks: Array<Campaign_Deck>;
  /** An aggregate relationship */
  all_decks_aggregate: Campaign_Deck_Aggregate;
  /** An array relationship */
  campaigns: Array<User_Campaigns>;
  /** An aggregate relationship */
  campaigns_aggregate: User_Campaigns_Aggregate;
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  decks: Array<Latest_Decks>;
  /** An aggregate relationship */
  decks_aggregate: Latest_Decks_Aggregate;
  /** An array relationship */
  flags: Array<User_Flag>;
  /** An aggregate relationship */
  flags_aggregate: User_Flag_Aggregate;
  /** An array relationship */
  friends: Array<User_Friends>;
  /** An aggregate relationship */
  friends_aggregate: User_Friends_Aggregate;
  handle?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  /** An array relationship */
  local_decks: Array<Local_Decks>;
  /** An aggregate relationship */
  local_decks_aggregate: Local_Decks_Aggregate;
  /** An array relationship */
  received_requests: Array<User_Received_Friend_Requests>;
  /** An aggregate relationship */
  received_requests_aggregate: User_Received_Friend_Requests_Aggregate;
  /** An array relationship */
  sent_requests: Array<User_Sent_Friend_Requests>;
  /** An aggregate relationship */
  sent_requests_aggregate: User_Sent_Friend_Requests_Aggregate;
  updated_at: Scalars['timestamp'];
};


/** columns and relationships of "users" */
export type UsersAll_DecksArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersAll_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Campaign_Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Campaign_Deck_Order_By>>;
  where?: InputMaybe<Campaign_Deck_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersCampaignsArgs = {
  distinct_on?: InputMaybe<Array<User_Campaigns_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Campaigns_Order_By>>;
  where?: InputMaybe<User_Campaigns_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersCampaigns_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Campaigns_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Campaigns_Order_By>>;
  where?: InputMaybe<User_Campaigns_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersDecksArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersDecks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Latest_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Latest_Decks_Order_By>>;
  where?: InputMaybe<Latest_Decks_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersFlagsArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Order_By>>;
  where?: InputMaybe<User_Flag_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersFlags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Flag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Flag_Order_By>>;
  where?: InputMaybe<User_Flag_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersFriendsArgs = {
  distinct_on?: InputMaybe<Array<User_Friends_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Friends_Order_By>>;
  where?: InputMaybe<User_Friends_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersFriends_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Friends_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Friends_Order_By>>;
  where?: InputMaybe<User_Friends_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersLocal_DecksArgs = {
  distinct_on?: InputMaybe<Array<Local_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Local_Decks_Order_By>>;
  where?: InputMaybe<Local_Decks_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersLocal_Decks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Local_Decks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Local_Decks_Order_By>>;
  where?: InputMaybe<Local_Decks_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersReceived_RequestsArgs = {
  distinct_on?: InputMaybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersReceived_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersSent_RequestsArgs = {
  distinct_on?: InputMaybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersSent_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  all_decks?: InputMaybe<Campaign_Deck_Bool_Exp>;
  campaigns?: InputMaybe<User_Campaigns_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  decks?: InputMaybe<Latest_Decks_Bool_Exp>;
  flags?: InputMaybe<User_Flag_Bool_Exp>;
  friends?: InputMaybe<User_Friends_Bool_Exp>;
  handle?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  local_decks?: InputMaybe<Local_Decks_Bool_Exp>;
  received_requests?: InputMaybe<User_Received_Friend_Requests_Bool_Exp>;
  sent_requests?: InputMaybe<User_Sent_Friend_Requests_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  all_decks?: InputMaybe<Campaign_Deck_Arr_Rel_Insert_Input>;
  campaigns?: InputMaybe<User_Campaigns_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  decks?: InputMaybe<Latest_Decks_Arr_Rel_Insert_Input>;
  flags?: InputMaybe<User_Flag_Arr_Rel_Insert_Input>;
  friends?: InputMaybe<User_Friends_Arr_Rel_Insert_Input>;
  handle?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  local_decks?: InputMaybe<Local_Decks_Arr_Rel_Insert_Input>;
  received_requests?: InputMaybe<User_Received_Friend_Requests_Arr_Rel_Insert_Input>;
  sent_requests?: InputMaybe<User_Sent_Friend_Requests_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  all_decks_aggregate?: InputMaybe<Campaign_Deck_Aggregate_Order_By>;
  campaigns_aggregate?: InputMaybe<User_Campaigns_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  decks_aggregate?: InputMaybe<Latest_Decks_Aggregate_Order_By>;
  flags_aggregate?: InputMaybe<User_Flag_Aggregate_Order_By>;
  friends_aggregate?: InputMaybe<User_Friends_Aggregate_Order_By>;
  handle?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  local_decks_aggregate?: InputMaybe<Local_Decks_Aggregate_Order_By>;
  received_requests_aggregate?: InputMaybe<User_Received_Friend_Requests_Aggregate_Order_By>;
  sent_requests_aggregate?: InputMaybe<User_Sent_Friend_Requests_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  handle?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type GetCustomCardsQueryVariables = Exact<{
  locale: Scalars['String'];
}>;


export type GetCustomCardsQuery = { __typename?: 'query_root', card: Array<{ __typename?: 'card', code: string, cost?: number | null | undefined, deck_limit?: number | null | undefined, encounter_code?: string | null | undefined, encounter_position?: number | null | undefined, exile?: boolean | null | undefined, faction_code: string, health?: number | null | undefined, is_unique?: boolean | null | undefined, pack_code: string, pack_position: number, permanent?: boolean | null | undefined, position: number, quantity: number, real_flavor?: string | null | undefined, real_name: string, real_pack_name: string, real_slot?: string | null | undefined, real_subname?: string | null | undefined, real_text?: string | null | undefined, real_traits?: string | null | undefined, sanity?: number | null | undefined, skill_agility?: number | null | undefined, skill_combat?: number | null | undefined, skill_intellect?: number | null | undefined, skill_willpower?: number | null | undefined, skill_wild?: number | null | undefined, subtype_code?: string | null | undefined, type_code: string, stage?: number | null | undefined, doom?: number | null | undefined, clues?: number | null | undefined, double_sided?: boolean | null | undefined, illustrator?: string | null | undefined, real_back_flavor?: string | null | undefined, real_back_text?: string | null | undefined, real_back_name?: string | null | undefined, packs: Array<{ __typename?: 'card_pack', name: string }>, translations: Array<{ __typename?: 'card_text', flavor?: string | null | undefined, encounter_name?: string | null | undefined, name: string, slot?: string | null | undefined, subname?: string | null | undefined, text?: string | null | undefined, traits?: string | null | undefined, back_flavor?: string | null | undefined, back_text?: string | null | undefined, back_name?: string | null | undefined }> }> };

export type GetCardFaqQueryVariables = Exact<{
  code: Scalars['String'];
  locale: Scalars['String'];
}>;


export type GetCardFaqQuery = { __typename?: 'query_root', faq_by_pk?: { __typename?: 'faq', code: string, text: string, faq_texts: Array<{ __typename?: 'faq_text', code: string, locale: string, text: string }> } | null | undefined };

export type UploadChaosBagResultsMutationVariables = Exact<{
  id: Scalars['Int'];
  bless: Scalars['Int'];
  curse: Scalars['Int'];
  drawn: Scalars['jsonb'];
  sealed: Scalars['jsonb'];
  totalDrawn: Scalars['Int'];
  tarot?: InputMaybe<Chaos_Bag_Tarot_Mode_Enum>;
}>;


export type UploadChaosBagResultsMutation = { __typename?: 'mutation_root', update_chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, bless: number, curse: number, drawn: any, sealed: any, totalDrawn?: number | null | undefined, tarot?: Chaos_Bag_Tarot_Mode_Enum | null | undefined } | null | undefined };

export type ChaosBagClearTokensMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  bless: Scalars['Int'];
  curse: Scalars['Int'];
}>;


export type ChaosBagClearTokensMutation = { __typename?: 'mutation_root', update_chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, drawn: any, bless: number, curse: number } | null | undefined };

export type ChaosBagDrawTokenMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  drawn: Scalars['jsonb'];
}>;


export type ChaosBagDrawTokenMutation = { __typename?: 'mutation_root', update_chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, drawn: any, totalDrawn?: number | null | undefined } | null | undefined };

export type ChaosBagResetBlessCurseMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  drawn: Scalars['jsonb'];
  sealed: Scalars['jsonb'];
}>;


export type ChaosBagResetBlessCurseMutation = { __typename?: 'mutation_root', update_chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, bless: number, curse: number, drawn: any, sealed: any } | null | undefined };

export type ChaosBagSealTokensMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  sealed: Scalars['jsonb'];
}>;


export type ChaosBagSealTokensMutation = { __typename?: 'mutation_root', update_chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, sealed: any } | null | undefined };

export type ChaosBagSetBlessCurseMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  bless: Scalars['Int'];
  curse: Scalars['Int'];
}>;


export type ChaosBagSetBlessCurseMutation = { __typename?: 'mutation_root', update_chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, bless: number, curse: number } | null | undefined };

export type ChaosBagSetTarotMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  tarot?: InputMaybe<Chaos_Bag_Tarot_Mode_Enum>;
}>;


export type ChaosBagSetTarotMutation = { __typename?: 'mutation_root', update_chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, tarot?: Chaos_Bag_Tarot_Mode_Enum | null | undefined } | null | undefined };

export type UploadNewCampaignMutationVariables = Exact<{
  campaignId: Scalars['Int'];
  cycleCode: Scalars['String'];
  standaloneId?: InputMaybe<Scalars['jsonb']>;
  showInterludes?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  difficulty?: InputMaybe<Scalars['String']>;
  campaignNotes?: InputMaybe<Scalars['jsonb']>;
  scenarioResults?: InputMaybe<Scalars['jsonb']>;
  chaosBag?: InputMaybe<Scalars['jsonb']>;
  weaknessSet?: InputMaybe<Scalars['jsonb']>;
  guideVersion?: InputMaybe<Scalars['Int']>;
  inputs: Array<Guide_Input_Insert_Input> | Guide_Input_Insert_Input;
  achievements: Array<Guide_Achievement_Insert_Input> | Guide_Achievement_Insert_Input;
  investigator_data: Array<Investigator_Data_Insert_Input> | Investigator_Data_Insert_Input;
  investigators: Array<Campaign_Investigator_Insert_Input> | Campaign_Investigator_Insert_Input;
}>;


export type UploadNewCampaignMutation = { __typename?: 'mutation_root', insert_guide_input?: { __typename?: 'guide_input_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'guide_input', id: string, campaign_id: number, scenario?: string | null | undefined, step?: string | null | undefined, payload?: any | null | undefined, created_at: any }> } | null | undefined, insert_guide_achievement?: { __typename?: 'guide_achievement_mutation_response', affected_rows: number } | null | undefined, insert_investigator_data?: { __typename?: 'investigator_data_mutation_response', affected_rows: number } | null | undefined, insert_campaign_investigator?: { __typename?: 'campaign_investigator_mutation_response', affected_rows: number } | null | undefined, update_campaign_by_pk?: { __typename?: 'campaign', id: number, updated_at: any, uuid: string, name?: string | null | undefined, deleted?: boolean | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, campaignNotes?: any | null | undefined, chaosBag?: any | null | undefined, showInterludes?: boolean | null | undefined, scenarioResults?: any | null | undefined, weaknessSet?: any | null | undefined, guided?: boolean | null | undefined, guide_version?: number | null | undefined, archived?: boolean | null | undefined, owner_id: string, link_a_campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, scenarioResults?: any | null | undefined, guided?: boolean | null | undefined, archived?: boolean | null | undefined, owner_id: string, updated_at: any, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }>, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }> }, link_b_campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, scenarioResults?: any | null | undefined, guided?: boolean | null | undefined, archived?: boolean | null | undefined, owner_id: string, updated_at: any, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }>, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }> }, campaign_guide?: { __typename?: 'campaign_guide', id?: number | null | undefined, uuid?: string | null | undefined, updated_at?: any | null | undefined, guide_inputs: Array<{ __typename?: 'guide_input', id: string, campaign_id: number, step?: string | null | undefined, scenario?: string | null | undefined, type: string, payload?: any | null | undefined }>, guide_achievements: Array<{ __typename?: 'guide_achievement', id: string, campaign_id: number, type: string, value?: number | null | undefined, bool_value?: boolean | null | undefined }> } | null | undefined, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', spentXp?: number | null | undefined, addedCards?: any | null | undefined, ignoreStoryAssets?: any | null | undefined, removedCards?: any | null | undefined, cardCounts?: any | null | undefined, specialXp?: any | null | undefined, availableXp?: number | null | undefined, id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }>, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined }>, linked_campaign: { __typename?: 'campaign', id: number, uuid: string } } | null | undefined };

export type InsertNewDeckMutationVariables = Exact<{
  arkhamdb_id?: InputMaybe<Scalars['Int']>;
  local_uuid?: InputMaybe<Scalars['String']>;
  arkhamdb_user?: InputMaybe<Scalars['Int']>;
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  content: Scalars['jsonb'];
  content_hash: Scalars['String'];
  userId: Scalars['String'];
}>;


export type InsertNewDeckMutation = { __typename?: 'mutation_root', insert_campaign_deck_one?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined };

export type InsertNextLocalDeckMutationVariables = Exact<{
  previous_local_uuid?: InputMaybe<Scalars['String']>;
  local_uuid?: InputMaybe<Scalars['String']>;
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  content: Scalars['jsonb'];
  content_hash: Scalars['String'];
  userId: Scalars['String'];
}>;


export type InsertNextLocalDeckMutation = { __typename?: 'mutation_root', insert_campaign_deck_one?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, previous_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined };

export type InsertNextArkhamDbDeckMutationVariables = Exact<{
  previous_arkhamdb_id: Scalars['Int'];
  arkhamdb_id: Scalars['Int'];
  arkhamdb_user?: InputMaybe<Scalars['Int']>;
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  content: Scalars['jsonb'];
  content_hash: Scalars['String'];
  userId: Scalars['String'];
}>;


export type InsertNextArkhamDbDeckMutation = { __typename?: 'mutation_root', insert_campaign_deck_one?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, previous_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined };

export type UpdateArkhamDbDeckMutationVariables = Exact<{
  arkhamdb_id: Scalars['Int'];
  campaign_id: Scalars['Int'];
  content: Scalars['jsonb'];
  content_hash: Scalars['String'];
  arkhamdb_user?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateArkhamDbDeckMutation = { __typename?: 'mutation_root', update_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'campaign_deck', content?: any | null | undefined, content_hash?: string | null | undefined, arkhamdb_user?: number | null | undefined, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number }> } | null | undefined };

export type UpdateLocalDeckMutationVariables = Exact<{
  local_uuid: Scalars['String'];
  campaign_id: Scalars['Int'];
  content: Scalars['jsonb'];
  content_hash: Scalars['String'];
}>;


export type UpdateLocalDeckMutation = { __typename?: 'mutation_root', update_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'campaign_deck', content?: any | null | undefined, content_hash?: string | null | undefined, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number }> } | null | undefined };

export type DeleteAllLocalDecksMutationVariables = Exact<{
  local_uuid: Scalars['String'];
  campaign_id: Scalars['Int'];
}>;


export type DeleteAllLocalDecksMutation = { __typename?: 'mutation_root', delete_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number }> } | null | undefined };

export type DeleteAllArkhamDbDecksMutationVariables = Exact<{
  arkhamdb_id: Scalars['Int'];
  campaign_id: Scalars['Int'];
}>;


export type DeleteAllArkhamDbDecksMutation = { __typename?: 'mutation_root', delete_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number }> } | null | undefined };

export type DeleteLocalDeckMutationVariables = Exact<{
  local_uuid: Scalars['String'];
  campaign_id: Scalars['Int'];
}>;


export type DeleteLocalDeckMutation = { __typename?: 'mutation_root', update_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', returning: Array<{ __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }> } | null | undefined, delete_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined }> } | null | undefined };

export type DeleteArkhamDbDeckMutationVariables = Exact<{
  arkhamdb_id: Scalars['Int'];
  campaign_id: Scalars['Int'];
}>;


export type DeleteArkhamDbDeckMutation = { __typename?: 'mutation_root', update_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', returning: Array<{ __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }> } | null | undefined, delete_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined }> } | null | undefined };

export type GetMyDecksQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetMyDecksQuery = { __typename?: 'query_root', users_by_pk?: { __typename?: 'users', id: string, decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined }>, all_decks: Array<{ __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, campaign: { __typename?: 'campaign', id: number, uuid: string }, next_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }> } | null | undefined };

export type GetLatestLocalDeckQueryVariables = Exact<{
  campaign_id: Scalars['Int'];
  local_uuid: Scalars['String'];
}>;


export type GetLatestLocalDeckQuery = { __typename?: 'query_root', campaign_deck: Array<{ __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }> };

export type GetLatestArkhamDbDeckQueryVariables = Exact<{
  campaign_id: Scalars['Int'];
  arkhamdb_id: Scalars['Int'];
}>;


export type GetLatestArkhamDbDeckQuery = { __typename?: 'query_root', campaign_deck: Array<{ __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }> };

export type GetLatestDeckQueryVariables = Exact<{
  deckId: Scalars['Int'];
}>;


export type GetLatestDeckQuery = { __typename?: 'query_root', campaign_deck_by_pk?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined };

export type GetDeckHistoryQueryVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
}>;


export type GetDeckHistoryQuery = { __typename?: 'query_root', campaign_deck: Array<{ __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, next_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }> };

export type CoreCardFragment = { __typename?: 'card', code: string, cost?: number | null | undefined, deck_limit?: number | null | undefined, encounter_code?: string | null | undefined, encounter_position?: number | null | undefined, exile?: boolean | null | undefined, faction_code: string, health?: number | null | undefined, is_unique?: boolean | null | undefined, pack_code: string, pack_position: number, permanent?: boolean | null | undefined, position: number, quantity: number, real_flavor?: string | null | undefined, real_name: string, real_pack_name: string, real_slot?: string | null | undefined, real_subname?: string | null | undefined, real_text?: string | null | undefined, real_traits?: string | null | undefined, sanity?: number | null | undefined, skill_agility?: number | null | undefined, skill_combat?: number | null | undefined, skill_intellect?: number | null | undefined, skill_willpower?: number | null | undefined, skill_wild?: number | null | undefined, subtype_code?: string | null | undefined, type_code: string, stage?: number | null | undefined, doom?: number | null | undefined, clues?: number | null | undefined, double_sided?: boolean | null | undefined, illustrator?: string | null | undefined, real_back_flavor?: string | null | undefined, real_back_text?: string | null | undefined, real_back_name?: string | null | undefined };

export type CoreCardTextFragment = { __typename?: 'card_text', flavor?: string | null | undefined, encounter_name?: string | null | undefined, name: string, slot?: string | null | undefined, subname?: string | null | undefined, text?: string | null | undefined, traits?: string | null | undefined, back_flavor?: string | null | undefined, back_text?: string | null | undefined, back_name?: string | null | undefined };

export type UserInfoFragment = { __typename?: 'users', id: string, handle?: string | null | undefined };

export type GuideInputFragment = { __typename?: 'guide_input', id: string, campaign_id: number, step?: string | null | undefined, scenario?: string | null | undefined, type: string, payload?: any | null | undefined };

export type GuideAchievementFragment = { __typename?: 'guide_achievement', id: string, campaign_id: number, type: string, value?: number | null | undefined, bool_value?: boolean | null | undefined };

export type IdDeckFragment = { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number };

export type FullChaosBagResultFragment = { __typename?: 'chaos_bag_result', id: number, bless: number, curse: number, drawn: any, sealed: any, totalDrawn?: number | null | undefined, tarot?: Chaos_Bag_Tarot_Mode_Enum | null | undefined };

export type MiniDeckFragment = { __typename?: 'campaign_deck', investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number };

export type BasicDeckFragment = { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number };

export type AllDeckFragment = { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, campaign: { __typename?: 'campaign', id: number, uuid: string }, next_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined };

export type HistoryDeckFragment = { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, next_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined };

export type LatestDeckFragment = { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined };

export type MiniInvestigatorDataFragment = { __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined };

export type FullGuideInvestigatorDataFragment = { __typename?: 'investigator_data', addedCards?: any | null | undefined, ignoreStoryAssets?: any | null | undefined, removedCards?: any | null | undefined, cardCounts?: any | null | undefined, specialXp?: any | null | undefined, availableXp?: number | null | undefined, id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined };

export type FullInvestigatorDataFragment = { __typename?: 'investigator_data', spentXp?: number | null | undefined, addedCards?: any | null | undefined, ignoreStoryAssets?: any | null | undefined, removedCards?: any | null | undefined, cardCounts?: any | null | undefined, specialXp?: any | null | undefined, availableXp?: number | null | undefined, id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined };

export type MiniCampaignFragment = { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, scenarioResults?: any | null | undefined, guided?: boolean | null | undefined, archived?: boolean | null | undefined, owner_id: string, updated_at: any, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }>, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }> };

export type FullCampaignFragment = { __typename?: 'campaign', id: number, updated_at: any, uuid: string, name?: string | null | undefined, deleted?: boolean | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, campaignNotes?: any | null | undefined, chaosBag?: any | null | undefined, showInterludes?: boolean | null | undefined, scenarioResults?: any | null | undefined, weaknessSet?: any | null | undefined, guided?: boolean | null | undefined, guide_version?: number | null | undefined, archived?: boolean | null | undefined, owner_id: string, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', spentXp?: number | null | undefined, addedCards?: any | null | undefined, ignoreStoryAssets?: any | null | undefined, removedCards?: any | null | undefined, cardCounts?: any | null | undefined, specialXp?: any | null | undefined, availableXp?: number | null | undefined, id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }>, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined }>, link_a_campaign: { __typename?: 'campaign', id: number, uuid: string }, link_b_campaign: { __typename?: 'campaign', id: number, uuid: string }, linked_campaign: { __typename?: 'campaign', id: number, uuid: string } };

export type FullCampaignGuideStateFragment = { __typename?: 'campaign_guide', id?: number | null | undefined, uuid?: string | null | undefined, updated_at?: any | null | undefined, guide_inputs: Array<{ __typename?: 'guide_input', id: string, campaign_id: number, step?: string | null | undefined, scenario?: string | null | undefined, type: string, payload?: any | null | undefined }>, guide_achievements: Array<{ __typename?: 'guide_achievement', id: string, campaign_id: number, type: string, value?: number | null | undefined, bool_value?: boolean | null | undefined }> };

export type GetMyCampaignsQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetMyCampaignsQuery = { __typename?: 'query_root', users_by_pk?: { __typename?: 'users', id: string, campaigns: Array<{ __typename?: 'user_campaigns', campaign?: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, scenarioResults?: any | null | undefined, guided?: boolean | null | undefined, archived?: boolean | null | undefined, owner_id: string, updated_at: any, link_a_campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, scenarioResults?: any | null | undefined, guided?: boolean | null | undefined, archived?: boolean | null | undefined, owner_id: string, updated_at: any, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }>, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }> }, link_b_campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, scenarioResults?: any | null | undefined, guided?: boolean | null | undefined, archived?: boolean | null | undefined, owner_id: string, updated_at: any, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }>, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }> }, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined }>, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }> } | null | undefined }> } | null | undefined };

export type GetCampaignQueryVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type GetCampaignQuery = { __typename?: 'query_root', campaign_by_pk?: { __typename?: 'campaign', id: number, updated_at: any, uuid: string, name?: string | null | undefined, deleted?: boolean | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, campaignNotes?: any | null | undefined, chaosBag?: any | null | undefined, showInterludes?: boolean | null | undefined, scenarioResults?: any | null | undefined, weaknessSet?: any | null | undefined, guided?: boolean | null | undefined, guide_version?: number | null | undefined, archived?: boolean | null | undefined, owner_id: string, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', spentXp?: number | null | undefined, addedCards?: any | null | undefined, ignoreStoryAssets?: any | null | undefined, removedCards?: any | null | undefined, cardCounts?: any | null | undefined, specialXp?: any | null | undefined, availableXp?: number | null | undefined, id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }>, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined }>, link_a_campaign: { __typename?: 'campaign', id: number, uuid: string }, link_b_campaign: { __typename?: 'campaign', id: number, uuid: string }, linked_campaign: { __typename?: 'campaign', id: number, uuid: string } } | null | undefined };

export type GetCampaignGuideQueryVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type GetCampaignGuideQuery = { __typename?: 'query_root', campaign_guide: Array<{ __typename?: 'campaign_guide', id?: number | null | undefined, uuid?: string | null | undefined, updated_at?: any | null | undefined, guide_inputs: Array<{ __typename?: 'guide_input', id: string, campaign_id: number, step?: string | null | undefined, scenario?: string | null | undefined, type: string, payload?: any | null | undefined }>, guide_achievements: Array<{ __typename?: 'guide_achievement', id: string, campaign_id: number, type: string, value?: number | null | undefined, bool_value?: boolean | null | undefined }> }> };

export type GetCampaignAccessQueryVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type GetCampaignAccessQuery = { __typename?: 'query_root', campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, access: Array<{ __typename?: 'campaign_access', user: { __typename?: 'users', id: string, handle?: string | null | undefined } }> } | null | undefined };

export type GetChaosBagResultsQueryVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type GetChaosBagResultsQuery = { __typename?: 'query_root', chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, bless: number, curse: number, drawn: any, sealed: any, totalDrawn?: number | null | undefined, tarot?: Chaos_Bag_Tarot_Mode_Enum | null | undefined } | null | undefined };

export type CampaignSubscriptionVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type CampaignSubscription = { __typename?: 'subscription_root', campaign_by_pk?: { __typename?: 'campaign', id: number, updated_at: any, uuid: string, name?: string | null | undefined, deleted?: boolean | null | undefined, cycleCode?: string | null | undefined, standaloneId?: any | null | undefined, difficulty?: string | null | undefined, campaignNotes?: any | null | undefined, chaosBag?: any | null | undefined, showInterludes?: boolean | null | undefined, scenarioResults?: any | null | undefined, weaknessSet?: any | null | undefined, guided?: boolean | null | undefined, guide_version?: number | null | undefined, archived?: boolean | null | undefined, owner_id: string, investigators: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string }>, investigator_data: Array<{ __typename?: 'investigator_data', spentXp?: number | null | undefined, addedCards?: any | null | undefined, ignoreStoryAssets?: any | null | undefined, removedCards?: any | null | undefined, cardCounts?: any | null | undefined, specialXp?: any | null | undefined, availableXp?: number | null | undefined, id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined }>, latest_decks: Array<{ __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined }>, link_a_campaign: { __typename?: 'campaign', id: number, uuid: string }, link_b_campaign: { __typename?: 'campaign', id: number, uuid: string }, linked_campaign: { __typename?: 'campaign', id: number, uuid: string } } | null | undefined };

export type CampaignAccessSubscriptionVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type CampaignAccessSubscription = { __typename?: 'subscription_root', campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, access: Array<{ __typename?: 'campaign_access', user: { __typename?: 'users', id: string, handle?: string | null | undefined } }> } | null | undefined };

export type CampaignGuideSubscriptionVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type CampaignGuideSubscription = { __typename?: 'subscription_root', campaign_guide: Array<{ __typename?: 'campaign_guide', id?: number | null | undefined, uuid?: string | null | undefined, updated_at?: any | null | undefined, guide_inputs: Array<{ __typename?: 'guide_input', id: string, campaign_id: number, step?: string | null | undefined, scenario?: string | null | undefined, type: string, payload?: any | null | undefined }>, guide_achievements: Array<{ __typename?: 'guide_achievement', id: string, campaign_id: number, type: string, value?: number | null | undefined, bool_value?: boolean | null | undefined }> }> };

export type ChaosBagResultsSubscriptionVariables = Exact<{
  campaign_id: Scalars['Int'];
}>;


export type ChaosBagResultsSubscription = { __typename?: 'subscription_root', chaos_bag_result_by_pk?: { __typename?: 'chaos_bag_result', id: number, bless: number, curse: number, drawn: any, sealed: any, totalDrawn?: number | null | undefined, tarot?: Chaos_Bag_Tarot_Mode_Enum | null | undefined } | null | undefined };

export type GetProfileQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetProfileQuery = { __typename?: 'query_root', users_by_pk?: { __typename?: 'users', id: string, handle?: string | null | undefined, friends: Array<{ __typename?: 'user_friends', user?: { __typename?: 'users', id: string, handle?: string | null | undefined } | null | undefined }>, sent_requests: Array<{ __typename?: 'user_sent_friend_requests', user?: { __typename?: 'users', id: string, handle?: string | null | undefined } | null | undefined }>, received_requests: Array<{ __typename?: 'user_received_friend_requests', user?: { __typename?: 'users', id: string, handle?: string | null | undefined } | null | undefined }>, flags: Array<{ __typename?: 'user_flag', flag: User_Flag_Type_Enum }> } | null | undefined };

export type DeleteInvestigatorDecksMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  user_id: Scalars['String'];
}>;


export type DeleteInvestigatorDecksMutation = { __typename?: 'mutation_root', delete_campaign_deck?: { __typename?: 'campaign_deck_mutation_response', returning: Array<{ __typename?: 'campaign_deck', id: number, campaign_id: number, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, investigator: string, owner_id: string }> } | null | undefined };

export type SetBinaryAchievementMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
  value: Scalars['Boolean'];
}>;


export type SetBinaryAchievementMutation = { __typename?: 'mutation_root', insert_guide_achievement_one?: { __typename?: 'guide_achievement', id: string, campaign_id: number, type: string, value?: number | null | undefined, bool_value?: boolean | null | undefined } | null | undefined };

export type SetCountAchievementMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  id: Scalars['String'];
  value: Scalars['Int'];
}>;


export type SetCountAchievementMutation = { __typename?: 'mutation_root', insert_guide_achievement_one?: { __typename?: 'guide_achievement', id: string, campaign_id: number, type: string, value?: number | null | undefined, bool_value?: boolean | null | undefined } | null | undefined };

export type AddGuideInputMutationVariables = Exact<{
  id: Scalars['String'];
  campaign_id: Scalars['Int'];
  type: Scalars['String'];
  scenario?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<Scalars['String']>;
  payload?: InputMaybe<Scalars['jsonb']>;
}>;


export type AddGuideInputMutation = { __typename?: 'mutation_root', insert_guide_input_one?: { __typename?: 'guide_input', id: string, campaign_id: number, step?: string | null | undefined, scenario?: string | null | undefined, type: string, payload?: any | null | undefined } | null | undefined };

export type RemoveGuideInputsMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  ids: Array<Scalars['String']> | Scalars['String'];
}>;


export type RemoveGuideInputsMutation = { __typename?: 'mutation_root', delete_guide_input?: { __typename?: 'guide_input_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'guide_input', id: string, campaign_id: number }> } | null | undefined };

export type UpdateInvestigatorTraumaMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  physical?: InputMaybe<Scalars['Int']>;
  mental?: InputMaybe<Scalars['Int']>;
  killed?: InputMaybe<Scalars['Boolean']>;
  insane?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateInvestigatorTraumaMutation = { __typename?: 'mutation_root', insert_investigator_data_one?: { __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined } | null | undefined };

export type UpdateInvestigatorDataMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  physical?: InputMaybe<Scalars['Int']>;
  mental?: InputMaybe<Scalars['Int']>;
  killed?: InputMaybe<Scalars['Boolean']>;
  insane?: InputMaybe<Scalars['Boolean']>;
  addedCards?: InputMaybe<Scalars['jsonb']>;
  availableXp?: InputMaybe<Scalars['Int']>;
  specialXp?: InputMaybe<Scalars['jsonb']>;
  storyAssets?: InputMaybe<Scalars['jsonb']>;
  ignoreStoryAssets?: InputMaybe<Scalars['jsonb']>;
  removedCards?: InputMaybe<Scalars['jsonb']>;
  cardCounts?: InputMaybe<Scalars['jsonb']>;
}>;


export type UpdateInvestigatorDataMutation = { __typename?: 'mutation_root', insert_investigator_data_one?: { __typename?: 'investigator_data', addedCards?: any | null | undefined, ignoreStoryAssets?: any | null | undefined, removedCards?: any | null | undefined, cardCounts?: any | null | undefined, specialXp?: any | null | undefined, availableXp?: number | null | undefined, id?: string | null | undefined, campaign_id: number, investigator: string, mental?: number | null | undefined, physical?: number | null | undefined, insane?: boolean | null | undefined, killed?: boolean | null | undefined, storyAssets?: any | null | undefined } | null | undefined };

export type UpdateSpentXpMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  spent_xp: Scalars['Int'];
}>;


export type UpdateSpentXpMutation = { __typename?: 'mutation_root', insert_investigator_data_one?: { __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, spentXp?: number | null | undefined } | null | undefined };

export type UpdateAvailableXpMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
  available_xp: Scalars['Int'];
}>;


export type UpdateAvailableXpMutation = { __typename?: 'mutation_root', insert_investigator_data_one?: { __typename?: 'investigator_data', id?: string | null | undefined, campaign_id: number, investigator: string, availableXp?: number | null | undefined } | null | undefined };

export type UpdateCampaignArchivedMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  archived: Scalars['Boolean'];
}>;


export type UpdateCampaignArchivedMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, archived?: boolean | null | undefined } | null | undefined };

export type UpdateWeaknessSetMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  weakness_set: Scalars['jsonb'];
}>;


export type UpdateWeaknessSetMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, weaknessSet?: any | null | undefined } | null | undefined };

export type UpdateCampaignDifficultyMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  difficulty?: InputMaybe<Scalars['String']>;
}>;


export type UpdateCampaignDifficultyMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, difficulty?: string | null | undefined } | null | undefined };

export type UpdateCampaignScenarioResultsMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  scenarioResults: Scalars['jsonb'];
}>;


export type UpdateCampaignScenarioResultsMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, scenarioResults?: any | null | undefined } | null | undefined };

export type UpdateCampaignGuideVersionMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  guideVersion: Scalars['Int'];
}>;


export type UpdateCampaignGuideVersionMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, guide_version?: number | null | undefined } | null | undefined };

export type UpdateCampaignNotesMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  campaign_notes: Scalars['jsonb'];
}>;


export type UpdateCampaignNotesMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, campaignNotes?: any | null | undefined } | null | undefined };

export type UpdateCampaignShowInterludesMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  show_interludes: Scalars['Boolean'];
}>;


export type UpdateCampaignShowInterludesMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, showInterludes?: boolean | null | undefined } | null | undefined };

export type UpdateChaosBagMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  chaos_bag: Scalars['jsonb'];
}>;


export type UpdateChaosBagMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, chaosBag?: any | null | undefined } | null | undefined };

export type UpdateCampaignNameMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  name: Scalars['String'];
}>;


export type UpdateCampaignNameMutation = { __typename?: 'mutation_root', update_campaign_by_pk?: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined } | null | undefined };

export type AddCampaignInvestigatorMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
}>;


export type AddCampaignInvestigatorMutation = { __typename?: 'mutation_root', insert_campaign_investigator_one?: { __typename?: 'campaign_investigator', id?: string | null | undefined, investigator: string, campaign_id: number } | null | undefined };

export type RemoveCampaignInvestigatorMutationVariables = Exact<{
  campaign_id: Scalars['Int'];
  investigator: Scalars['String'];
}>;


export type RemoveCampaignInvestigatorMutation = { __typename?: 'mutation_root', delete_campaign_investigator?: { __typename?: 'campaign_investigator_mutation_response', returning: Array<{ __typename?: 'campaign_investigator', id?: string | null | undefined, campaign_id: number, investigator: string }> } | null | undefined };

export const CoreCardFragmentDoc = gql`
    fragment CoreCard on card {
  code
  cost
  deck_limit
  encounter_code
  encounter_position
  exile
  faction_code
  health
  is_unique
  pack_code
  pack_position
  permanent
  position
  quantity
  real_flavor
  real_name
  real_pack_name
  real_slot
  real_subname
  real_text
  real_traits
  sanity
  skill_agility
  skill_combat
  skill_intellect
  skill_willpower
  skill_wild
  subtype_code
  type_code
  stage
  doom
  clues
  double_sided
  illustrator
  real_back_flavor
  real_back_text
  real_back_name
}
    `;
export const CoreCardTextFragmentDoc = gql`
    fragment CoreCardText on card_text {
  flavor
  encounter_name
  name
  slot
  subname
  text
  traits
  back_flavor
  back_text
  back_name
}
    `;
export const FullChaosBagResultFragmentDoc = gql`
    fragment FullChaosBagResult on chaos_bag_result {
  id
  bless
  curse
  drawn
  sealed
  totalDrawn
  tarot
}
    `;
export const IdDeckFragmentDoc = gql`
    fragment IdDeck on campaign_deck {
  id
  owner_id
  arkhamdb_id
  local_uuid
  campaign_id
}
    `;
export const MiniDeckFragmentDoc = gql`
    fragment MiniDeck on campaign_deck {
  ...IdDeck
  investigator
}
    ${IdDeckFragmentDoc}`;
export const BasicDeckFragmentDoc = gql`
    fragment BasicDeck on campaign_deck {
  ...MiniDeck
  arkhamdb_user
  content
  content_hash
}
    ${MiniDeckFragmentDoc}`;
export const AllDeckFragmentDoc = gql`
    fragment AllDeck on campaign_deck {
  ...BasicDeck
  campaign {
    id
    uuid
  }
  next_deck {
    ...IdDeck
  }
  previous_deck {
    ...IdDeck
  }
}
    ${BasicDeckFragmentDoc}
${IdDeckFragmentDoc}`;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on users {
  id
  handle
}
    `;
export const HistoryDeckFragmentDoc = gql`
    fragment HistoryDeck on campaign_deck {
  ...BasicDeck
  owner {
    ...UserInfo
  }
  next_deck {
    ...IdDeck
  }
  previous_deck {
    ...IdDeck
  }
}
    ${BasicDeckFragmentDoc}
${UserInfoFragmentDoc}
${IdDeckFragmentDoc}`;
export const MiniInvestigatorDataFragmentDoc = gql`
    fragment MiniInvestigatorData on investigator_data {
  id
  campaign_id
  investigator
  mental
  physical
  insane
  killed
  storyAssets
}
    `;
export const MiniCampaignFragmentDoc = gql`
    fragment MiniCampaign on campaign {
  id
  uuid
  name
  cycleCode
  standaloneId
  difficulty
  scenarioResults
  guided
  archived
  owner_id
  latest_decks(order_by: {owner_id: asc}) {
    deck {
      ...MiniDeck
    }
  }
  investigators(order_by: {created_at: asc}) {
    id
    investigator
  }
  investigator_data(order_by: {created_at: asc}) {
    ...MiniInvestigatorData
  }
  updated_at
}
    ${MiniDeckFragmentDoc}
${MiniInvestigatorDataFragmentDoc}`;
export const FullGuideInvestigatorDataFragmentDoc = gql`
    fragment FullGuideInvestigatorData on investigator_data {
  ...MiniInvestigatorData
  addedCards
  ignoreStoryAssets
  removedCards
  cardCounts
  specialXp
  availableXp
}
    ${MiniInvestigatorDataFragmentDoc}`;
export const FullInvestigatorDataFragmentDoc = gql`
    fragment FullInvestigatorData on investigator_data {
  ...FullGuideInvestigatorData
  spentXp
}
    ${FullGuideInvestigatorDataFragmentDoc}`;
export const LatestDeckFragmentDoc = gql`
    fragment LatestDeck on campaign_deck {
  ...BasicDeck
  owner {
    ...UserInfo
  }
  campaign {
    id
    uuid
    name
  }
  investigator_data {
    id
    killed
    insane
    physical
    mental
  }
  previous_deck {
    ...BasicDeck
  }
}
    ${BasicDeckFragmentDoc}
${UserInfoFragmentDoc}`;
export const FullCampaignFragmentDoc = gql`
    fragment FullCampaign on campaign {
  id
  updated_at
  uuid
  name
  deleted
  cycleCode
  standaloneId
  difficulty
  campaignNotes
  chaosBag
  showInterludes
  scenarioResults
  weaknessSet
  guided
  guide_version
  archived
  owner_id
  investigators(order_by: {created_at: asc}) {
    id
    investigator
  }
  investigator_data(order_by: {created_at: asc}) {
    ...FullInvestigatorData
  }
  latest_decks(order_by: {owner_id: asc}) {
    deck {
      ...LatestDeck
    }
  }
  link_a_campaign {
    id
    uuid
  }
  link_b_campaign {
    id
    uuid
  }
  linked_campaign {
    id
    uuid
  }
}
    ${FullInvestigatorDataFragmentDoc}
${LatestDeckFragmentDoc}`;
export const GuideInputFragmentDoc = gql`
    fragment GuideInput on guide_input {
  id
  campaign_id
  step
  scenario
  type
  payload
}
    `;
export const GuideAchievementFragmentDoc = gql`
    fragment GuideAchievement on guide_achievement {
  id
  campaign_id
  type
  value
  bool_value
}
    `;
export const FullCampaignGuideStateFragmentDoc = gql`
    fragment FullCampaignGuideState on campaign_guide {
  id
  uuid
  updated_at
  guide_inputs(order_by: {created_at: asc}) {
    ...GuideInput
  }
  guide_achievements(order_by: {created_at: asc}) {
    ...GuideAchievement
  }
}
    ${GuideInputFragmentDoc}
${GuideAchievementFragmentDoc}`;
export const GetCustomCardsDocument = gql`
    query getCustomCards($locale: String!) {
  card {
    ...CoreCard
    packs(where: {locale: {_eq: $locale}}) {
      name
    }
    translations(where: {locale: {_eq: $locale}}) {
      ...CoreCardText
    }
  }
}
    ${CoreCardFragmentDoc}
${CoreCardTextFragmentDoc}`;

/**
 * __useGetCustomCardsQuery__
 *
 * To run a query within a React component, call `useGetCustomCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomCardsQuery({
 *   variables: {
 *      locale: // value for 'locale'
 *   },
 * });
 */
export function useGetCustomCardsQuery(baseOptions: Apollo.QueryHookOptions<GetCustomCardsQuery, GetCustomCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomCardsQuery, GetCustomCardsQueryVariables>(GetCustomCardsDocument, options);
      }
export function useGetCustomCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomCardsQuery, GetCustomCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomCardsQuery, GetCustomCardsQueryVariables>(GetCustomCardsDocument, options);
        }
export type GetCustomCardsQueryHookResult = ReturnType<typeof useGetCustomCardsQuery>;
export type GetCustomCardsLazyQueryHookResult = ReturnType<typeof useGetCustomCardsLazyQuery>;
export type GetCustomCardsQueryResult = Apollo.QueryResult<GetCustomCardsQuery, GetCustomCardsQueryVariables>;
export const GetCardFaqDocument = gql`
    query getCardFaq($code: String!, $locale: String!) {
  faq_by_pk(code: $code) {
    code
    text
    faq_texts(where: {locale: {_eq: $locale}}) {
      code
      locale
      text
    }
  }
}
    `;

/**
 * __useGetCardFaqQuery__
 *
 * To run a query within a React component, call `useGetCardFaqQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCardFaqQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCardFaqQuery({
 *   variables: {
 *      code: // value for 'code'
 *      locale: // value for 'locale'
 *   },
 * });
 */
export function useGetCardFaqQuery(baseOptions: Apollo.QueryHookOptions<GetCardFaqQuery, GetCardFaqQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCardFaqQuery, GetCardFaqQueryVariables>(GetCardFaqDocument, options);
      }
export function useGetCardFaqLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCardFaqQuery, GetCardFaqQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCardFaqQuery, GetCardFaqQueryVariables>(GetCardFaqDocument, options);
        }
export type GetCardFaqQueryHookResult = ReturnType<typeof useGetCardFaqQuery>;
export type GetCardFaqLazyQueryHookResult = ReturnType<typeof useGetCardFaqLazyQuery>;
export type GetCardFaqQueryResult = Apollo.QueryResult<GetCardFaqQuery, GetCardFaqQueryVariables>;
export const UploadChaosBagResultsDocument = gql`
    mutation uploadChaosBagResults($id: Int!, $bless: Int!, $curse: Int!, $drawn: jsonb!, $sealed: jsonb!, $totalDrawn: Int!, $tarot: chaos_bag_tarot_mode_enum) {
  update_chaos_bag_result_by_pk(
    pk_columns: {id: $id}
    _set: {bless: $bless, curse: $curse, drawn: $drawn, sealed: $sealed, totalDrawn: $totalDrawn, tarot: $tarot}
  ) {
    ...FullChaosBagResult
  }
}
    ${FullChaosBagResultFragmentDoc}`;
export type UploadChaosBagResultsMutationFn = Apollo.MutationFunction<UploadChaosBagResultsMutation, UploadChaosBagResultsMutationVariables>;

/**
 * __useUploadChaosBagResultsMutation__
 *
 * To run a mutation, you first call `useUploadChaosBagResultsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadChaosBagResultsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadChaosBagResultsMutation, { data, loading, error }] = useUploadChaosBagResultsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      bless: // value for 'bless'
 *      curse: // value for 'curse'
 *      drawn: // value for 'drawn'
 *      sealed: // value for 'sealed'
 *      totalDrawn: // value for 'totalDrawn'
 *      tarot: // value for 'tarot'
 *   },
 * });
 */
export function useUploadChaosBagResultsMutation(baseOptions?: Apollo.MutationHookOptions<UploadChaosBagResultsMutation, UploadChaosBagResultsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadChaosBagResultsMutation, UploadChaosBagResultsMutationVariables>(UploadChaosBagResultsDocument, options);
      }
export type UploadChaosBagResultsMutationHookResult = ReturnType<typeof useUploadChaosBagResultsMutation>;
export type UploadChaosBagResultsMutationResult = Apollo.MutationResult<UploadChaosBagResultsMutation>;
export type UploadChaosBagResultsMutationOptions = Apollo.BaseMutationOptions<UploadChaosBagResultsMutation, UploadChaosBagResultsMutationVariables>;
export const ChaosBagClearTokensDocument = gql`
    mutation chaosBagClearTokens($campaign_id: Int!, $bless: Int!, $curse: Int!) {
  update_chaos_bag_result_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {drawn: [], bless: $bless, curse: $curse}
  ) {
    id
    drawn
    bless
    curse
  }
}
    `;
export type ChaosBagClearTokensMutationFn = Apollo.MutationFunction<ChaosBagClearTokensMutation, ChaosBagClearTokensMutationVariables>;

/**
 * __useChaosBagClearTokensMutation__
 *
 * To run a mutation, you first call `useChaosBagClearTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChaosBagClearTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chaosBagClearTokensMutation, { data, loading, error }] = useChaosBagClearTokensMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      bless: // value for 'bless'
 *      curse: // value for 'curse'
 *   },
 * });
 */
export function useChaosBagClearTokensMutation(baseOptions?: Apollo.MutationHookOptions<ChaosBagClearTokensMutation, ChaosBagClearTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChaosBagClearTokensMutation, ChaosBagClearTokensMutationVariables>(ChaosBagClearTokensDocument, options);
      }
export type ChaosBagClearTokensMutationHookResult = ReturnType<typeof useChaosBagClearTokensMutation>;
export type ChaosBagClearTokensMutationResult = Apollo.MutationResult<ChaosBagClearTokensMutation>;
export type ChaosBagClearTokensMutationOptions = Apollo.BaseMutationOptions<ChaosBagClearTokensMutation, ChaosBagClearTokensMutationVariables>;
export const ChaosBagDrawTokenDocument = gql`
    mutation chaosBagDrawToken($campaign_id: Int!, $drawn: jsonb!) {
  update_chaos_bag_result_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {drawn: $drawn}
    _inc: {totalDrawn: 1}
  ) {
    id
    drawn
    totalDrawn
  }
}
    `;
export type ChaosBagDrawTokenMutationFn = Apollo.MutationFunction<ChaosBagDrawTokenMutation, ChaosBagDrawTokenMutationVariables>;

/**
 * __useChaosBagDrawTokenMutation__
 *
 * To run a mutation, you first call `useChaosBagDrawTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChaosBagDrawTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chaosBagDrawTokenMutation, { data, loading, error }] = useChaosBagDrawTokenMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      drawn: // value for 'drawn'
 *   },
 * });
 */
export function useChaosBagDrawTokenMutation(baseOptions?: Apollo.MutationHookOptions<ChaosBagDrawTokenMutation, ChaosBagDrawTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChaosBagDrawTokenMutation, ChaosBagDrawTokenMutationVariables>(ChaosBagDrawTokenDocument, options);
      }
export type ChaosBagDrawTokenMutationHookResult = ReturnType<typeof useChaosBagDrawTokenMutation>;
export type ChaosBagDrawTokenMutationResult = Apollo.MutationResult<ChaosBagDrawTokenMutation>;
export type ChaosBagDrawTokenMutationOptions = Apollo.BaseMutationOptions<ChaosBagDrawTokenMutation, ChaosBagDrawTokenMutationVariables>;
export const ChaosBagResetBlessCurseDocument = gql`
    mutation chaosBagResetBlessCurse($campaign_id: Int!, $drawn: jsonb!, $sealed: jsonb!) {
  update_chaos_bag_result_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {bless: 0, curse: 0, drawn: $drawn, sealed: $sealed}
  ) {
    id
    bless
    curse
    drawn
    sealed
  }
}
    `;
export type ChaosBagResetBlessCurseMutationFn = Apollo.MutationFunction<ChaosBagResetBlessCurseMutation, ChaosBagResetBlessCurseMutationVariables>;

/**
 * __useChaosBagResetBlessCurseMutation__
 *
 * To run a mutation, you first call `useChaosBagResetBlessCurseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChaosBagResetBlessCurseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chaosBagResetBlessCurseMutation, { data, loading, error }] = useChaosBagResetBlessCurseMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      drawn: // value for 'drawn'
 *      sealed: // value for 'sealed'
 *   },
 * });
 */
export function useChaosBagResetBlessCurseMutation(baseOptions?: Apollo.MutationHookOptions<ChaosBagResetBlessCurseMutation, ChaosBagResetBlessCurseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChaosBagResetBlessCurseMutation, ChaosBagResetBlessCurseMutationVariables>(ChaosBagResetBlessCurseDocument, options);
      }
export type ChaosBagResetBlessCurseMutationHookResult = ReturnType<typeof useChaosBagResetBlessCurseMutation>;
export type ChaosBagResetBlessCurseMutationResult = Apollo.MutationResult<ChaosBagResetBlessCurseMutation>;
export type ChaosBagResetBlessCurseMutationOptions = Apollo.BaseMutationOptions<ChaosBagResetBlessCurseMutation, ChaosBagResetBlessCurseMutationVariables>;
export const ChaosBagSealTokensDocument = gql`
    mutation chaosBagSealTokens($campaign_id: Int!, $sealed: jsonb!) {
  update_chaos_bag_result_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {sealed: $sealed}
  ) {
    id
    sealed
  }
}
    `;
export type ChaosBagSealTokensMutationFn = Apollo.MutationFunction<ChaosBagSealTokensMutation, ChaosBagSealTokensMutationVariables>;

/**
 * __useChaosBagSealTokensMutation__
 *
 * To run a mutation, you first call `useChaosBagSealTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChaosBagSealTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chaosBagSealTokensMutation, { data, loading, error }] = useChaosBagSealTokensMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      sealed: // value for 'sealed'
 *   },
 * });
 */
export function useChaosBagSealTokensMutation(baseOptions?: Apollo.MutationHookOptions<ChaosBagSealTokensMutation, ChaosBagSealTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChaosBagSealTokensMutation, ChaosBagSealTokensMutationVariables>(ChaosBagSealTokensDocument, options);
      }
export type ChaosBagSealTokensMutationHookResult = ReturnType<typeof useChaosBagSealTokensMutation>;
export type ChaosBagSealTokensMutationResult = Apollo.MutationResult<ChaosBagSealTokensMutation>;
export type ChaosBagSealTokensMutationOptions = Apollo.BaseMutationOptions<ChaosBagSealTokensMutation, ChaosBagSealTokensMutationVariables>;
export const ChaosBagSetBlessCurseDocument = gql`
    mutation chaosBagSetBlessCurse($campaign_id: Int!, $bless: Int!, $curse: Int!) {
  update_chaos_bag_result_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {bless: $bless, curse: $curse}
  ) {
    id
    bless
    curse
  }
}
    `;
export type ChaosBagSetBlessCurseMutationFn = Apollo.MutationFunction<ChaosBagSetBlessCurseMutation, ChaosBagSetBlessCurseMutationVariables>;

/**
 * __useChaosBagSetBlessCurseMutation__
 *
 * To run a mutation, you first call `useChaosBagSetBlessCurseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChaosBagSetBlessCurseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chaosBagSetBlessCurseMutation, { data, loading, error }] = useChaosBagSetBlessCurseMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      bless: // value for 'bless'
 *      curse: // value for 'curse'
 *   },
 * });
 */
export function useChaosBagSetBlessCurseMutation(baseOptions?: Apollo.MutationHookOptions<ChaosBagSetBlessCurseMutation, ChaosBagSetBlessCurseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChaosBagSetBlessCurseMutation, ChaosBagSetBlessCurseMutationVariables>(ChaosBagSetBlessCurseDocument, options);
      }
export type ChaosBagSetBlessCurseMutationHookResult = ReturnType<typeof useChaosBagSetBlessCurseMutation>;
export type ChaosBagSetBlessCurseMutationResult = Apollo.MutationResult<ChaosBagSetBlessCurseMutation>;
export type ChaosBagSetBlessCurseMutationOptions = Apollo.BaseMutationOptions<ChaosBagSetBlessCurseMutation, ChaosBagSetBlessCurseMutationVariables>;
export const ChaosBagSetTarotDocument = gql`
    mutation chaosBagSetTarot($campaign_id: Int!, $tarot: chaos_bag_tarot_mode_enum) {
  update_chaos_bag_result_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {tarot: $tarot}
  ) {
    id
    tarot
  }
}
    `;
export type ChaosBagSetTarotMutationFn = Apollo.MutationFunction<ChaosBagSetTarotMutation, ChaosBagSetTarotMutationVariables>;

/**
 * __useChaosBagSetTarotMutation__
 *
 * To run a mutation, you first call `useChaosBagSetTarotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChaosBagSetTarotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chaosBagSetTarotMutation, { data, loading, error }] = useChaosBagSetTarotMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      tarot: // value for 'tarot'
 *   },
 * });
 */
export function useChaosBagSetTarotMutation(baseOptions?: Apollo.MutationHookOptions<ChaosBagSetTarotMutation, ChaosBagSetTarotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChaosBagSetTarotMutation, ChaosBagSetTarotMutationVariables>(ChaosBagSetTarotDocument, options);
      }
export type ChaosBagSetTarotMutationHookResult = ReturnType<typeof useChaosBagSetTarotMutation>;
export type ChaosBagSetTarotMutationResult = Apollo.MutationResult<ChaosBagSetTarotMutation>;
export type ChaosBagSetTarotMutationOptions = Apollo.BaseMutationOptions<ChaosBagSetTarotMutation, ChaosBagSetTarotMutationVariables>;
export const UploadNewCampaignDocument = gql`
    mutation uploadNewCampaign($campaignId: Int!, $cycleCode: String!, $standaloneId: jsonb, $showInterludes: Boolean, $name: String!, $difficulty: String, $campaignNotes: jsonb, $scenarioResults: jsonb, $chaosBag: jsonb, $weaknessSet: jsonb, $guideVersion: Int, $inputs: [guide_input_insert_input!]!, $achievements: [guide_achievement_insert_input!]!, $investigator_data: [investigator_data_insert_input!]!, $investigators: [campaign_investigator_insert_input!]!) {
  insert_guide_input(objects: $inputs) {
    affected_rows
    returning {
      id
      campaign_id
      scenario
      step
      payload
      created_at
    }
  }
  insert_guide_achievement(objects: $achievements) {
    affected_rows
  }
  insert_investigator_data(objects: $investigator_data) {
    affected_rows
  }
  insert_campaign_investigator(objects: $investigators) {
    affected_rows
  }
  update_campaign_by_pk(
    pk_columns: {id: $campaignId}
    _set: {name: $name, cycleCode: $cycleCode, standaloneId: $standaloneId, difficulty: $difficulty, campaignNotes: $campaignNotes, chaosBag: $chaosBag, showInterludes: $showInterludes, scenarioResults: $scenarioResults, weaknessSet: $weaknessSet, guide_version: $guideVersion}
  ) {
    ...FullCampaign
    link_a_campaign {
      ...MiniCampaign
    }
    link_b_campaign {
      ...MiniCampaign
    }
    campaign_guide {
      ...FullCampaignGuideState
    }
  }
}
    ${FullCampaignFragmentDoc}
${MiniCampaignFragmentDoc}
${FullCampaignGuideStateFragmentDoc}`;
export type UploadNewCampaignMutationFn = Apollo.MutationFunction<UploadNewCampaignMutation, UploadNewCampaignMutationVariables>;

/**
 * __useUploadNewCampaignMutation__
 *
 * To run a mutation, you first call `useUploadNewCampaignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadNewCampaignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadNewCampaignMutation, { data, loading, error }] = useUploadNewCampaignMutation({
 *   variables: {
 *      campaignId: // value for 'campaignId'
 *      cycleCode: // value for 'cycleCode'
 *      standaloneId: // value for 'standaloneId'
 *      showInterludes: // value for 'showInterludes'
 *      name: // value for 'name'
 *      difficulty: // value for 'difficulty'
 *      campaignNotes: // value for 'campaignNotes'
 *      scenarioResults: // value for 'scenarioResults'
 *      chaosBag: // value for 'chaosBag'
 *      weaknessSet: // value for 'weaknessSet'
 *      guideVersion: // value for 'guideVersion'
 *      inputs: // value for 'inputs'
 *      achievements: // value for 'achievements'
 *      investigator_data: // value for 'investigator_data'
 *      investigators: // value for 'investigators'
 *   },
 * });
 */
export function useUploadNewCampaignMutation(baseOptions?: Apollo.MutationHookOptions<UploadNewCampaignMutation, UploadNewCampaignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadNewCampaignMutation, UploadNewCampaignMutationVariables>(UploadNewCampaignDocument, options);
      }
export type UploadNewCampaignMutationHookResult = ReturnType<typeof useUploadNewCampaignMutation>;
export type UploadNewCampaignMutationResult = Apollo.MutationResult<UploadNewCampaignMutation>;
export type UploadNewCampaignMutationOptions = Apollo.BaseMutationOptions<UploadNewCampaignMutation, UploadNewCampaignMutationVariables>;
export const InsertNewDeckDocument = gql`
    mutation insertNewDeck($arkhamdb_id: Int, $local_uuid: String, $arkhamdb_user: Int, $campaign_id: Int!, $investigator: String!, $content: jsonb!, $content_hash: String!, $userId: String!) {
  insert_campaign_deck_one(
    object: {arkhamdb_id: $arkhamdb_id, arkhamdb_user: $arkhamdb_user, local_uuid: $local_uuid, campaign_id: $campaign_id, investigator: $investigator, content: $content, content_hash: $content_hash, owner_id: $userId, base: true}
  ) {
    ...LatestDeck
  }
}
    ${LatestDeckFragmentDoc}`;
export type InsertNewDeckMutationFn = Apollo.MutationFunction<InsertNewDeckMutation, InsertNewDeckMutationVariables>;

/**
 * __useInsertNewDeckMutation__
 *
 * To run a mutation, you first call `useInsertNewDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertNewDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertNewDeckMutation, { data, loading, error }] = useInsertNewDeckMutation({
 *   variables: {
 *      arkhamdb_id: // value for 'arkhamdb_id'
 *      local_uuid: // value for 'local_uuid'
 *      arkhamdb_user: // value for 'arkhamdb_user'
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      content: // value for 'content'
 *      content_hash: // value for 'content_hash'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useInsertNewDeckMutation(baseOptions?: Apollo.MutationHookOptions<InsertNewDeckMutation, InsertNewDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertNewDeckMutation, InsertNewDeckMutationVariables>(InsertNewDeckDocument, options);
      }
export type InsertNewDeckMutationHookResult = ReturnType<typeof useInsertNewDeckMutation>;
export type InsertNewDeckMutationResult = Apollo.MutationResult<InsertNewDeckMutation>;
export type InsertNewDeckMutationOptions = Apollo.BaseMutationOptions<InsertNewDeckMutation, InsertNewDeckMutationVariables>;
export const InsertNextLocalDeckDocument = gql`
    mutation insertNextLocalDeck($previous_local_uuid: String, $local_uuid: String, $campaign_id: Int!, $investigator: String!, $content: jsonb!, $content_hash: String!, $userId: String!) {
  insert_campaign_deck_one(
    object: {local_uuid: $local_uuid, arkhamdb_id: null, campaign_id: $campaign_id, investigator: $investigator, content: $content, content_hash: $content_hash, owner_id: $userId, previous_decks: {data: {local_uuid: $previous_local_uuid, arkhamdb_id: null, investigator: $investigator, campaign_id: $campaign_id, owner_id: $userId}, on_conflict: {constraint: deck_local_uuid_campaign_id_key, update_columns: [next_deck_id]}}}
  ) {
    ...BasicDeck
    previous_deck {
      ...IdDeck
    }
  }
}
    ${BasicDeckFragmentDoc}
${IdDeckFragmentDoc}`;
export type InsertNextLocalDeckMutationFn = Apollo.MutationFunction<InsertNextLocalDeckMutation, InsertNextLocalDeckMutationVariables>;

/**
 * __useInsertNextLocalDeckMutation__
 *
 * To run a mutation, you first call `useInsertNextLocalDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertNextLocalDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertNextLocalDeckMutation, { data, loading, error }] = useInsertNextLocalDeckMutation({
 *   variables: {
 *      previous_local_uuid: // value for 'previous_local_uuid'
 *      local_uuid: // value for 'local_uuid'
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      content: // value for 'content'
 *      content_hash: // value for 'content_hash'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useInsertNextLocalDeckMutation(baseOptions?: Apollo.MutationHookOptions<InsertNextLocalDeckMutation, InsertNextLocalDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertNextLocalDeckMutation, InsertNextLocalDeckMutationVariables>(InsertNextLocalDeckDocument, options);
      }
export type InsertNextLocalDeckMutationHookResult = ReturnType<typeof useInsertNextLocalDeckMutation>;
export type InsertNextLocalDeckMutationResult = Apollo.MutationResult<InsertNextLocalDeckMutation>;
export type InsertNextLocalDeckMutationOptions = Apollo.BaseMutationOptions<InsertNextLocalDeckMutation, InsertNextLocalDeckMutationVariables>;
export const InsertNextArkhamDbDeckDocument = gql`
    mutation insertNextArkhamDbDeck($previous_arkhamdb_id: Int!, $arkhamdb_id: Int!, $arkhamdb_user: Int, $campaign_id: Int!, $investigator: String!, $content: jsonb!, $content_hash: String!, $userId: String!) {
  insert_campaign_deck_one(
    object: {arkhamdb_id: $arkhamdb_id, arkhamdb_user: $arkhamdb_user, local_uuid: null, investigator: $investigator, campaign_id: $campaign_id, owner_id: $userId, content: $content, content_hash: $content_hash, previous_decks: {data: {arkhamdb_id: $previous_arkhamdb_id, local_uuid: null, campaign_id: $campaign_id, investigator: $investigator, owner_id: $userId}, on_conflict: {constraint: deck_arkhamdb_id_campaign_id_key, update_columns: [next_deck_id]}}}
  ) {
    ...BasicDeck
    previous_deck {
      ...IdDeck
    }
  }
}
    ${BasicDeckFragmentDoc}
${IdDeckFragmentDoc}`;
export type InsertNextArkhamDbDeckMutationFn = Apollo.MutationFunction<InsertNextArkhamDbDeckMutation, InsertNextArkhamDbDeckMutationVariables>;

/**
 * __useInsertNextArkhamDbDeckMutation__
 *
 * To run a mutation, you first call `useInsertNextArkhamDbDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertNextArkhamDbDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertNextArkhamDbDeckMutation, { data, loading, error }] = useInsertNextArkhamDbDeckMutation({
 *   variables: {
 *      previous_arkhamdb_id: // value for 'previous_arkhamdb_id'
 *      arkhamdb_id: // value for 'arkhamdb_id'
 *      arkhamdb_user: // value for 'arkhamdb_user'
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      content: // value for 'content'
 *      content_hash: // value for 'content_hash'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useInsertNextArkhamDbDeckMutation(baseOptions?: Apollo.MutationHookOptions<InsertNextArkhamDbDeckMutation, InsertNextArkhamDbDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertNextArkhamDbDeckMutation, InsertNextArkhamDbDeckMutationVariables>(InsertNextArkhamDbDeckDocument, options);
      }
export type InsertNextArkhamDbDeckMutationHookResult = ReturnType<typeof useInsertNextArkhamDbDeckMutation>;
export type InsertNextArkhamDbDeckMutationResult = Apollo.MutationResult<InsertNextArkhamDbDeckMutation>;
export type InsertNextArkhamDbDeckMutationOptions = Apollo.BaseMutationOptions<InsertNextArkhamDbDeckMutation, InsertNextArkhamDbDeckMutationVariables>;
export const UpdateArkhamDbDeckDocument = gql`
    mutation updateArkhamDbDeck($arkhamdb_id: Int!, $campaign_id: Int!, $content: jsonb!, $content_hash: String!, $arkhamdb_user: Int) {
  update_campaign_deck(
    where: {arkhamdb_id: {_eq: $arkhamdb_id}, campaign_id: {_eq: $campaign_id}}
    _set: {content: $content, content_hash: $content_hash, arkhamdb_user: $arkhamdb_user}
  ) {
    affected_rows
    returning {
      ...IdDeck
      content
      content_hash
      arkhamdb_user
    }
  }
}
    ${IdDeckFragmentDoc}`;
export type UpdateArkhamDbDeckMutationFn = Apollo.MutationFunction<UpdateArkhamDbDeckMutation, UpdateArkhamDbDeckMutationVariables>;

/**
 * __useUpdateArkhamDbDeckMutation__
 *
 * To run a mutation, you first call `useUpdateArkhamDbDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateArkhamDbDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateArkhamDbDeckMutation, { data, loading, error }] = useUpdateArkhamDbDeckMutation({
 *   variables: {
 *      arkhamdb_id: // value for 'arkhamdb_id'
 *      campaign_id: // value for 'campaign_id'
 *      content: // value for 'content'
 *      content_hash: // value for 'content_hash'
 *      arkhamdb_user: // value for 'arkhamdb_user'
 *   },
 * });
 */
export function useUpdateArkhamDbDeckMutation(baseOptions?: Apollo.MutationHookOptions<UpdateArkhamDbDeckMutation, UpdateArkhamDbDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateArkhamDbDeckMutation, UpdateArkhamDbDeckMutationVariables>(UpdateArkhamDbDeckDocument, options);
      }
export type UpdateArkhamDbDeckMutationHookResult = ReturnType<typeof useUpdateArkhamDbDeckMutation>;
export type UpdateArkhamDbDeckMutationResult = Apollo.MutationResult<UpdateArkhamDbDeckMutation>;
export type UpdateArkhamDbDeckMutationOptions = Apollo.BaseMutationOptions<UpdateArkhamDbDeckMutation, UpdateArkhamDbDeckMutationVariables>;
export const UpdateLocalDeckDocument = gql`
    mutation updateLocalDeck($local_uuid: String!, $campaign_id: Int!, $content: jsonb!, $content_hash: String!) {
  update_campaign_deck(
    where: {local_uuid: {_eq: $local_uuid}, campaign_id: {_eq: $campaign_id}}
    _set: {content: $content, content_hash: $content_hash}
  ) {
    affected_rows
    returning {
      ...IdDeck
      content
      content_hash
    }
  }
}
    ${IdDeckFragmentDoc}`;
export type UpdateLocalDeckMutationFn = Apollo.MutationFunction<UpdateLocalDeckMutation, UpdateLocalDeckMutationVariables>;

/**
 * __useUpdateLocalDeckMutation__
 *
 * To run a mutation, you first call `useUpdateLocalDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocalDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocalDeckMutation, { data, loading, error }] = useUpdateLocalDeckMutation({
 *   variables: {
 *      local_uuid: // value for 'local_uuid'
 *      campaign_id: // value for 'campaign_id'
 *      content: // value for 'content'
 *      content_hash: // value for 'content_hash'
 *   },
 * });
 */
export function useUpdateLocalDeckMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLocalDeckMutation, UpdateLocalDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLocalDeckMutation, UpdateLocalDeckMutationVariables>(UpdateLocalDeckDocument, options);
      }
export type UpdateLocalDeckMutationHookResult = ReturnType<typeof useUpdateLocalDeckMutation>;
export type UpdateLocalDeckMutationResult = Apollo.MutationResult<UpdateLocalDeckMutation>;
export type UpdateLocalDeckMutationOptions = Apollo.BaseMutationOptions<UpdateLocalDeckMutation, UpdateLocalDeckMutationVariables>;
export const DeleteAllLocalDecksDocument = gql`
    mutation deleteAllLocalDecks($local_uuid: String!, $campaign_id: Int!) {
  delete_campaign_deck(
    where: {campaign_id: {_eq: $campaign_id}, other_decks: {local_uuid: {_eq: $local_uuid}}}
  ) {
    affected_rows
    returning {
      ...IdDeck
    }
  }
}
    ${IdDeckFragmentDoc}`;
export type DeleteAllLocalDecksMutationFn = Apollo.MutationFunction<DeleteAllLocalDecksMutation, DeleteAllLocalDecksMutationVariables>;

/**
 * __useDeleteAllLocalDecksMutation__
 *
 * To run a mutation, you first call `useDeleteAllLocalDecksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAllLocalDecksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAllLocalDecksMutation, { data, loading, error }] = useDeleteAllLocalDecksMutation({
 *   variables: {
 *      local_uuid: // value for 'local_uuid'
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useDeleteAllLocalDecksMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAllLocalDecksMutation, DeleteAllLocalDecksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAllLocalDecksMutation, DeleteAllLocalDecksMutationVariables>(DeleteAllLocalDecksDocument, options);
      }
export type DeleteAllLocalDecksMutationHookResult = ReturnType<typeof useDeleteAllLocalDecksMutation>;
export type DeleteAllLocalDecksMutationResult = Apollo.MutationResult<DeleteAllLocalDecksMutation>;
export type DeleteAllLocalDecksMutationOptions = Apollo.BaseMutationOptions<DeleteAllLocalDecksMutation, DeleteAllLocalDecksMutationVariables>;
export const DeleteAllArkhamDbDecksDocument = gql`
    mutation deleteAllArkhamDbDecks($arkhamdb_id: Int!, $campaign_id: Int!) {
  delete_campaign_deck(
    where: {campaign_id: {_eq: $campaign_id}, other_decks: {arkhamdb_id: {_eq: $arkhamdb_id}}}
  ) {
    affected_rows
    returning {
      ...IdDeck
    }
  }
}
    ${IdDeckFragmentDoc}`;
export type DeleteAllArkhamDbDecksMutationFn = Apollo.MutationFunction<DeleteAllArkhamDbDecksMutation, DeleteAllArkhamDbDecksMutationVariables>;

/**
 * __useDeleteAllArkhamDbDecksMutation__
 *
 * To run a mutation, you first call `useDeleteAllArkhamDbDecksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAllArkhamDbDecksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAllArkhamDbDecksMutation, { data, loading, error }] = useDeleteAllArkhamDbDecksMutation({
 *   variables: {
 *      arkhamdb_id: // value for 'arkhamdb_id'
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useDeleteAllArkhamDbDecksMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAllArkhamDbDecksMutation, DeleteAllArkhamDbDecksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAllArkhamDbDecksMutation, DeleteAllArkhamDbDecksMutationVariables>(DeleteAllArkhamDbDecksDocument, options);
      }
export type DeleteAllArkhamDbDecksMutationHookResult = ReturnType<typeof useDeleteAllArkhamDbDecksMutation>;
export type DeleteAllArkhamDbDecksMutationResult = Apollo.MutationResult<DeleteAllArkhamDbDecksMutation>;
export type DeleteAllArkhamDbDecksMutationOptions = Apollo.BaseMutationOptions<DeleteAllArkhamDbDecksMutation, DeleteAllArkhamDbDecksMutationVariables>;
export const DeleteLocalDeckDocument = gql`
    mutation deleteLocalDeck($local_uuid: String!, $campaign_id: Int!) {
  update_campaign_deck(
    where: {next_deck: {local_uuid: {_eq: $local_uuid}, campaign_id: {_eq: $campaign_id}}}
    _delete_key: {content: "nextDeckId"}
  ) {
    returning {
      ...LatestDeck
    }
  }
  delete_campaign_deck(
    where: {local_uuid: {_eq: $local_uuid}, campaign_id: {_eq: $campaign_id}}
  ) {
    affected_rows
    returning {
      ...IdDeck
      previous_deck {
        ...LatestDeck
      }
    }
  }
}
    ${LatestDeckFragmentDoc}
${IdDeckFragmentDoc}`;
export type DeleteLocalDeckMutationFn = Apollo.MutationFunction<DeleteLocalDeckMutation, DeleteLocalDeckMutationVariables>;

/**
 * __useDeleteLocalDeckMutation__
 *
 * To run a mutation, you first call `useDeleteLocalDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLocalDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLocalDeckMutation, { data, loading, error }] = useDeleteLocalDeckMutation({
 *   variables: {
 *      local_uuid: // value for 'local_uuid'
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useDeleteLocalDeckMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLocalDeckMutation, DeleteLocalDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLocalDeckMutation, DeleteLocalDeckMutationVariables>(DeleteLocalDeckDocument, options);
      }
export type DeleteLocalDeckMutationHookResult = ReturnType<typeof useDeleteLocalDeckMutation>;
export type DeleteLocalDeckMutationResult = Apollo.MutationResult<DeleteLocalDeckMutation>;
export type DeleteLocalDeckMutationOptions = Apollo.BaseMutationOptions<DeleteLocalDeckMutation, DeleteLocalDeckMutationVariables>;
export const DeleteArkhamDbDeckDocument = gql`
    mutation deleteArkhamDbDeck($arkhamdb_id: Int!, $campaign_id: Int!) {
  update_campaign_deck(
    where: {next_deck: {arkhamdb_id: {_eq: $arkhamdb_id}, campaign_id: {_eq: $campaign_id}}}
    _delete_key: {content: "nextDeckId"}
  ) {
    returning {
      ...LatestDeck
    }
  }
  delete_campaign_deck(
    where: {arkhamdb_id: {_eq: $arkhamdb_id}, campaign_id: {_eq: $campaign_id}}
  ) {
    affected_rows
    returning {
      ...IdDeck
      previous_deck {
        ...LatestDeck
      }
    }
  }
}
    ${LatestDeckFragmentDoc}
${IdDeckFragmentDoc}`;
export type DeleteArkhamDbDeckMutationFn = Apollo.MutationFunction<DeleteArkhamDbDeckMutation, DeleteArkhamDbDeckMutationVariables>;

/**
 * __useDeleteArkhamDbDeckMutation__
 *
 * To run a mutation, you first call `useDeleteArkhamDbDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteArkhamDbDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteArkhamDbDeckMutation, { data, loading, error }] = useDeleteArkhamDbDeckMutation({
 *   variables: {
 *      arkhamdb_id: // value for 'arkhamdb_id'
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useDeleteArkhamDbDeckMutation(baseOptions?: Apollo.MutationHookOptions<DeleteArkhamDbDeckMutation, DeleteArkhamDbDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteArkhamDbDeckMutation, DeleteArkhamDbDeckMutationVariables>(DeleteArkhamDbDeckDocument, options);
      }
export type DeleteArkhamDbDeckMutationHookResult = ReturnType<typeof useDeleteArkhamDbDeckMutation>;
export type DeleteArkhamDbDeckMutationResult = Apollo.MutationResult<DeleteArkhamDbDeckMutation>;
export type DeleteArkhamDbDeckMutationOptions = Apollo.BaseMutationOptions<DeleteArkhamDbDeckMutation, DeleteArkhamDbDeckMutationVariables>;
export const GetMyDecksDocument = gql`
    query getMyDecks($userId: String!) {
  users_by_pk(id: $userId) {
    id
    decks {
      deck {
        ...LatestDeck
      }
    }
    all_decks {
      ...AllDeck
    }
  }
}
    ${LatestDeckFragmentDoc}
${AllDeckFragmentDoc}`;

/**
 * __useGetMyDecksQuery__
 *
 * To run a query within a React component, call `useGetMyDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyDecksQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetMyDecksQuery(baseOptions: Apollo.QueryHookOptions<GetMyDecksQuery, GetMyDecksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyDecksQuery, GetMyDecksQueryVariables>(GetMyDecksDocument, options);
      }
export function useGetMyDecksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyDecksQuery, GetMyDecksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyDecksQuery, GetMyDecksQueryVariables>(GetMyDecksDocument, options);
        }
export type GetMyDecksQueryHookResult = ReturnType<typeof useGetMyDecksQuery>;
export type GetMyDecksLazyQueryHookResult = ReturnType<typeof useGetMyDecksLazyQuery>;
export type GetMyDecksQueryResult = Apollo.QueryResult<GetMyDecksQuery, GetMyDecksQueryVariables>;
export const GetLatestLocalDeckDocument = gql`
    query getLatestLocalDeck($campaign_id: Int!, $local_uuid: String!) {
  campaign_deck(
    where: {campaign_id: {_eq: $campaign_id}, local_uuid: {_eq: $local_uuid}}
  ) {
    ...LatestDeck
  }
}
    ${LatestDeckFragmentDoc}`;

/**
 * __useGetLatestLocalDeckQuery__
 *
 * To run a query within a React component, call `useGetLatestLocalDeckQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestLocalDeckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestLocalDeckQuery({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      local_uuid: // value for 'local_uuid'
 *   },
 * });
 */
export function useGetLatestLocalDeckQuery(baseOptions: Apollo.QueryHookOptions<GetLatestLocalDeckQuery, GetLatestLocalDeckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestLocalDeckQuery, GetLatestLocalDeckQueryVariables>(GetLatestLocalDeckDocument, options);
      }
export function useGetLatestLocalDeckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestLocalDeckQuery, GetLatestLocalDeckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestLocalDeckQuery, GetLatestLocalDeckQueryVariables>(GetLatestLocalDeckDocument, options);
        }
export type GetLatestLocalDeckQueryHookResult = ReturnType<typeof useGetLatestLocalDeckQuery>;
export type GetLatestLocalDeckLazyQueryHookResult = ReturnType<typeof useGetLatestLocalDeckLazyQuery>;
export type GetLatestLocalDeckQueryResult = Apollo.QueryResult<GetLatestLocalDeckQuery, GetLatestLocalDeckQueryVariables>;
export const GetLatestArkhamDbDeckDocument = gql`
    query getLatestArkhamDbDeck($campaign_id: Int!, $arkhamdb_id: Int!) {
  campaign_deck(
    where: {campaign_id: {_eq: $campaign_id}, arkhamdb_id: {_eq: $arkhamdb_id}}
  ) {
    ...LatestDeck
  }
}
    ${LatestDeckFragmentDoc}`;

/**
 * __useGetLatestArkhamDbDeckQuery__
 *
 * To run a query within a React component, call `useGetLatestArkhamDbDeckQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestArkhamDbDeckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestArkhamDbDeckQuery({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      arkhamdb_id: // value for 'arkhamdb_id'
 *   },
 * });
 */
export function useGetLatestArkhamDbDeckQuery(baseOptions: Apollo.QueryHookOptions<GetLatestArkhamDbDeckQuery, GetLatestArkhamDbDeckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestArkhamDbDeckQuery, GetLatestArkhamDbDeckQueryVariables>(GetLatestArkhamDbDeckDocument, options);
      }
export function useGetLatestArkhamDbDeckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestArkhamDbDeckQuery, GetLatestArkhamDbDeckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestArkhamDbDeckQuery, GetLatestArkhamDbDeckQueryVariables>(GetLatestArkhamDbDeckDocument, options);
        }
export type GetLatestArkhamDbDeckQueryHookResult = ReturnType<typeof useGetLatestArkhamDbDeckQuery>;
export type GetLatestArkhamDbDeckLazyQueryHookResult = ReturnType<typeof useGetLatestArkhamDbDeckLazyQuery>;
export type GetLatestArkhamDbDeckQueryResult = Apollo.QueryResult<GetLatestArkhamDbDeckQuery, GetLatestArkhamDbDeckQueryVariables>;
export const GetLatestDeckDocument = gql`
    query getLatestDeck($deckId: Int!) {
  campaign_deck_by_pk(id: $deckId) {
    ...LatestDeck
  }
}
    ${LatestDeckFragmentDoc}`;

/**
 * __useGetLatestDeckQuery__
 *
 * To run a query within a React component, call `useGetLatestDeckQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestDeckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestDeckQuery({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useGetLatestDeckQuery(baseOptions: Apollo.QueryHookOptions<GetLatestDeckQuery, GetLatestDeckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestDeckQuery, GetLatestDeckQueryVariables>(GetLatestDeckDocument, options);
      }
export function useGetLatestDeckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestDeckQuery, GetLatestDeckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestDeckQuery, GetLatestDeckQueryVariables>(GetLatestDeckDocument, options);
        }
export type GetLatestDeckQueryHookResult = ReturnType<typeof useGetLatestDeckQuery>;
export type GetLatestDeckLazyQueryHookResult = ReturnType<typeof useGetLatestDeckLazyQuery>;
export type GetLatestDeckQueryResult = Apollo.QueryResult<GetLatestDeckQuery, GetLatestDeckQueryVariables>;
export const GetDeckHistoryDocument = gql`
    query getDeckHistory($campaign_id: Int!, $investigator: String!) {
  campaign_deck(
    where: {campaign_id: {_eq: $campaign_id}, investigator: {_eq: $investigator}}
  ) {
    ...HistoryDeck
  }
}
    ${HistoryDeckFragmentDoc}`;

/**
 * __useGetDeckHistoryQuery__
 *
 * To run a query within a React component, call `useGetDeckHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeckHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeckHistoryQuery({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *   },
 * });
 */
export function useGetDeckHistoryQuery(baseOptions: Apollo.QueryHookOptions<GetDeckHistoryQuery, GetDeckHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeckHistoryQuery, GetDeckHistoryQueryVariables>(GetDeckHistoryDocument, options);
      }
export function useGetDeckHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeckHistoryQuery, GetDeckHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeckHistoryQuery, GetDeckHistoryQueryVariables>(GetDeckHistoryDocument, options);
        }
export type GetDeckHistoryQueryHookResult = ReturnType<typeof useGetDeckHistoryQuery>;
export type GetDeckHistoryLazyQueryHookResult = ReturnType<typeof useGetDeckHistoryLazyQuery>;
export type GetDeckHistoryQueryResult = Apollo.QueryResult<GetDeckHistoryQuery, GetDeckHistoryQueryVariables>;
export const GetMyCampaignsDocument = gql`
    query getMyCampaigns($userId: String!) {
  users_by_pk(id: $userId) {
    id
    campaigns {
      campaign {
        ...MiniCampaign
        link_a_campaign {
          ...MiniCampaign
        }
        link_b_campaign {
          ...MiniCampaign
        }
      }
    }
  }
}
    ${MiniCampaignFragmentDoc}`;

/**
 * __useGetMyCampaignsQuery__
 *
 * To run a query within a React component, call `useGetMyCampaignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCampaignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCampaignsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetMyCampaignsQuery(baseOptions: Apollo.QueryHookOptions<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>(GetMyCampaignsDocument, options);
      }
export function useGetMyCampaignsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>(GetMyCampaignsDocument, options);
        }
export type GetMyCampaignsQueryHookResult = ReturnType<typeof useGetMyCampaignsQuery>;
export type GetMyCampaignsLazyQueryHookResult = ReturnType<typeof useGetMyCampaignsLazyQuery>;
export type GetMyCampaignsQueryResult = Apollo.QueryResult<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>;
export const GetCampaignDocument = gql`
    query getCampaign($campaign_id: Int!) {
  campaign_by_pk(id: $campaign_id) {
    ...FullCampaign
  }
}
    ${FullCampaignFragmentDoc}`;

/**
 * __useGetCampaignQuery__
 *
 * To run a query within a React component, call `useGetCampaignQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCampaignQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCampaignQuery({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useGetCampaignQuery(baseOptions: Apollo.QueryHookOptions<GetCampaignQuery, GetCampaignQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCampaignQuery, GetCampaignQueryVariables>(GetCampaignDocument, options);
      }
export function useGetCampaignLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCampaignQuery, GetCampaignQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCampaignQuery, GetCampaignQueryVariables>(GetCampaignDocument, options);
        }
export type GetCampaignQueryHookResult = ReturnType<typeof useGetCampaignQuery>;
export type GetCampaignLazyQueryHookResult = ReturnType<typeof useGetCampaignLazyQuery>;
export type GetCampaignQueryResult = Apollo.QueryResult<GetCampaignQuery, GetCampaignQueryVariables>;
export const GetCampaignGuideDocument = gql`
    query getCampaignGuide($campaign_id: Int!) {
  campaign_guide(where: {id: {_eq: $campaign_id}}) {
    ...FullCampaignGuideState
  }
}
    ${FullCampaignGuideStateFragmentDoc}`;

/**
 * __useGetCampaignGuideQuery__
 *
 * To run a query within a React component, call `useGetCampaignGuideQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCampaignGuideQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCampaignGuideQuery({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useGetCampaignGuideQuery(baseOptions: Apollo.QueryHookOptions<GetCampaignGuideQuery, GetCampaignGuideQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCampaignGuideQuery, GetCampaignGuideQueryVariables>(GetCampaignGuideDocument, options);
      }
export function useGetCampaignGuideLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCampaignGuideQuery, GetCampaignGuideQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCampaignGuideQuery, GetCampaignGuideQueryVariables>(GetCampaignGuideDocument, options);
        }
export type GetCampaignGuideQueryHookResult = ReturnType<typeof useGetCampaignGuideQuery>;
export type GetCampaignGuideLazyQueryHookResult = ReturnType<typeof useGetCampaignGuideLazyQuery>;
export type GetCampaignGuideQueryResult = Apollo.QueryResult<GetCampaignGuideQuery, GetCampaignGuideQueryVariables>;
export const GetCampaignAccessDocument = gql`
    query getCampaignAccess($campaign_id: Int!) {
  campaign_by_pk(id: $campaign_id) {
    id
    uuid
    owner {
      ...UserInfo
    }
    access {
      user {
        ...UserInfo
      }
    }
  }
}
    ${UserInfoFragmentDoc}`;

/**
 * __useGetCampaignAccessQuery__
 *
 * To run a query within a React component, call `useGetCampaignAccessQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCampaignAccessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCampaignAccessQuery({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useGetCampaignAccessQuery(baseOptions: Apollo.QueryHookOptions<GetCampaignAccessQuery, GetCampaignAccessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCampaignAccessQuery, GetCampaignAccessQueryVariables>(GetCampaignAccessDocument, options);
      }
export function useGetCampaignAccessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCampaignAccessQuery, GetCampaignAccessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCampaignAccessQuery, GetCampaignAccessQueryVariables>(GetCampaignAccessDocument, options);
        }
export type GetCampaignAccessQueryHookResult = ReturnType<typeof useGetCampaignAccessQuery>;
export type GetCampaignAccessLazyQueryHookResult = ReturnType<typeof useGetCampaignAccessLazyQuery>;
export type GetCampaignAccessQueryResult = Apollo.QueryResult<GetCampaignAccessQuery, GetCampaignAccessQueryVariables>;
export const GetChaosBagResultsDocument = gql`
    query getChaosBagResults($campaign_id: Int!) {
  chaos_bag_result_by_pk(id: $campaign_id) {
    ...FullChaosBagResult
  }
}
    ${FullChaosBagResultFragmentDoc}`;

/**
 * __useGetChaosBagResultsQuery__
 *
 * To run a query within a React component, call `useGetChaosBagResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChaosBagResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChaosBagResultsQuery({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useGetChaosBagResultsQuery(baseOptions: Apollo.QueryHookOptions<GetChaosBagResultsQuery, GetChaosBagResultsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChaosBagResultsQuery, GetChaosBagResultsQueryVariables>(GetChaosBagResultsDocument, options);
      }
export function useGetChaosBagResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChaosBagResultsQuery, GetChaosBagResultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChaosBagResultsQuery, GetChaosBagResultsQueryVariables>(GetChaosBagResultsDocument, options);
        }
export type GetChaosBagResultsQueryHookResult = ReturnType<typeof useGetChaosBagResultsQuery>;
export type GetChaosBagResultsLazyQueryHookResult = ReturnType<typeof useGetChaosBagResultsLazyQuery>;
export type GetChaosBagResultsQueryResult = Apollo.QueryResult<GetChaosBagResultsQuery, GetChaosBagResultsQueryVariables>;
export const CampaignDocument = gql`
    subscription campaign($campaign_id: Int!) {
  campaign_by_pk(id: $campaign_id) {
    ...FullCampaign
  }
}
    ${FullCampaignFragmentDoc}`;

/**
 * __useCampaignSubscription__
 *
 * To run a query within a React component, call `useCampaignSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCampaignSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCampaignSubscription({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useCampaignSubscription(baseOptions: Apollo.SubscriptionHookOptions<CampaignSubscription, CampaignSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CampaignSubscription, CampaignSubscriptionVariables>(CampaignDocument, options);
      }
export type CampaignSubscriptionHookResult = ReturnType<typeof useCampaignSubscription>;
export type CampaignSubscriptionResult = Apollo.SubscriptionResult<CampaignSubscription>;
export const CampaignAccessDocument = gql`
    subscription campaignAccess($campaign_id: Int!) {
  campaign_by_pk(id: $campaign_id) {
    id
    uuid
    owner {
      ...UserInfo
    }
    access {
      user {
        ...UserInfo
      }
    }
  }
}
    ${UserInfoFragmentDoc}`;

/**
 * __useCampaignAccessSubscription__
 *
 * To run a query within a React component, call `useCampaignAccessSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCampaignAccessSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCampaignAccessSubscription({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useCampaignAccessSubscription(baseOptions: Apollo.SubscriptionHookOptions<CampaignAccessSubscription, CampaignAccessSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CampaignAccessSubscription, CampaignAccessSubscriptionVariables>(CampaignAccessDocument, options);
      }
export type CampaignAccessSubscriptionHookResult = ReturnType<typeof useCampaignAccessSubscription>;
export type CampaignAccessSubscriptionResult = Apollo.SubscriptionResult<CampaignAccessSubscription>;
export const CampaignGuideDocument = gql`
    subscription campaignGuide($campaign_id: Int!) {
  campaign_guide(where: {id: {_eq: $campaign_id}}) {
    ...FullCampaignGuideState
  }
}
    ${FullCampaignGuideStateFragmentDoc}`;

/**
 * __useCampaignGuideSubscription__
 *
 * To run a query within a React component, call `useCampaignGuideSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCampaignGuideSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCampaignGuideSubscription({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useCampaignGuideSubscription(baseOptions: Apollo.SubscriptionHookOptions<CampaignGuideSubscription, CampaignGuideSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CampaignGuideSubscription, CampaignGuideSubscriptionVariables>(CampaignGuideDocument, options);
      }
export type CampaignGuideSubscriptionHookResult = ReturnType<typeof useCampaignGuideSubscription>;
export type CampaignGuideSubscriptionResult = Apollo.SubscriptionResult<CampaignGuideSubscription>;
export const ChaosBagResultsDocument = gql`
    subscription chaosBagResults($campaign_id: Int!) {
  chaos_bag_result_by_pk(id: $campaign_id) {
    ...FullChaosBagResult
  }
}
    ${FullChaosBagResultFragmentDoc}`;

/**
 * __useChaosBagResultsSubscription__
 *
 * To run a query within a React component, call `useChaosBagResultsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChaosBagResultsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChaosBagResultsSubscription({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *   },
 * });
 */
export function useChaosBagResultsSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChaosBagResultsSubscription, ChaosBagResultsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChaosBagResultsSubscription, ChaosBagResultsSubscriptionVariables>(ChaosBagResultsDocument, options);
      }
export type ChaosBagResultsSubscriptionHookResult = ReturnType<typeof useChaosBagResultsSubscription>;
export type ChaosBagResultsSubscriptionResult = Apollo.SubscriptionResult<ChaosBagResultsSubscription>;
export const GetProfileDocument = gql`
    query getProfile($userId: String!) {
  users_by_pk(id: $userId) {
    id
    handle
    friends {
      user {
        ...UserInfo
      }
    }
    sent_requests {
      user {
        ...UserInfo
      }
    }
    received_requests {
      user {
        ...UserInfo
      }
    }
    flags {
      flag
    }
  }
}
    ${UserInfoFragmentDoc}`;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const DeleteInvestigatorDecksDocument = gql`
    mutation deleteInvestigatorDecks($campaign_id: Int!, $investigator: String!, $user_id: String!) {
  delete_campaign_deck(
    where: {campaign_id: {_eq: $campaign_id}, investigator: {_eq: $investigator}, owner_id: {_eq: $user_id}}
  ) {
    returning {
      id
      campaign_id
      arkhamdb_id
      local_uuid
      investigator
      owner_id
    }
  }
}
    `;
export type DeleteInvestigatorDecksMutationFn = Apollo.MutationFunction<DeleteInvestigatorDecksMutation, DeleteInvestigatorDecksMutationVariables>;

/**
 * __useDeleteInvestigatorDecksMutation__
 *
 * To run a mutation, you first call `useDeleteInvestigatorDecksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvestigatorDecksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvestigatorDecksMutation, { data, loading, error }] = useDeleteInvestigatorDecksMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useDeleteInvestigatorDecksMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvestigatorDecksMutation, DeleteInvestigatorDecksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvestigatorDecksMutation, DeleteInvestigatorDecksMutationVariables>(DeleteInvestigatorDecksDocument, options);
      }
export type DeleteInvestigatorDecksMutationHookResult = ReturnType<typeof useDeleteInvestigatorDecksMutation>;
export type DeleteInvestigatorDecksMutationResult = Apollo.MutationResult<DeleteInvestigatorDecksMutation>;
export type DeleteInvestigatorDecksMutationOptions = Apollo.BaseMutationOptions<DeleteInvestigatorDecksMutation, DeleteInvestigatorDecksMutationVariables>;
export const SetBinaryAchievementDocument = gql`
    mutation setBinaryAchievement($campaign_id: Int!, $id: String!, $value: Boolean!) {
  insert_guide_achievement_one(
    object: {campaign_id: $campaign_id, id: $id, type: "binary", bool_value: $value}
    on_conflict: {constraint: guide_achievement_pkey, update_columns: [bool_value]}
  ) {
    ...GuideAchievement
  }
}
    ${GuideAchievementFragmentDoc}`;
export type SetBinaryAchievementMutationFn = Apollo.MutationFunction<SetBinaryAchievementMutation, SetBinaryAchievementMutationVariables>;

/**
 * __useSetBinaryAchievementMutation__
 *
 * To run a mutation, you first call `useSetBinaryAchievementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetBinaryAchievementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setBinaryAchievementMutation, { data, loading, error }] = useSetBinaryAchievementMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      id: // value for 'id'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useSetBinaryAchievementMutation(baseOptions?: Apollo.MutationHookOptions<SetBinaryAchievementMutation, SetBinaryAchievementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetBinaryAchievementMutation, SetBinaryAchievementMutationVariables>(SetBinaryAchievementDocument, options);
      }
export type SetBinaryAchievementMutationHookResult = ReturnType<typeof useSetBinaryAchievementMutation>;
export type SetBinaryAchievementMutationResult = Apollo.MutationResult<SetBinaryAchievementMutation>;
export type SetBinaryAchievementMutationOptions = Apollo.BaseMutationOptions<SetBinaryAchievementMutation, SetBinaryAchievementMutationVariables>;
export const SetCountAchievementDocument = gql`
    mutation setCountAchievement($campaign_id: Int!, $id: String!, $value: Int!) {
  insert_guide_achievement_one(
    object: {campaign_id: $campaign_id, id: $id, type: "count", value: $value}
    on_conflict: {constraint: guide_achievement_pkey, update_columns: [value]}
  ) {
    ...GuideAchievement
  }
}
    ${GuideAchievementFragmentDoc}`;
export type SetCountAchievementMutationFn = Apollo.MutationFunction<SetCountAchievementMutation, SetCountAchievementMutationVariables>;

/**
 * __useSetCountAchievementMutation__
 *
 * To run a mutation, you first call `useSetCountAchievementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCountAchievementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCountAchievementMutation, { data, loading, error }] = useSetCountAchievementMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      id: // value for 'id'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useSetCountAchievementMutation(baseOptions?: Apollo.MutationHookOptions<SetCountAchievementMutation, SetCountAchievementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetCountAchievementMutation, SetCountAchievementMutationVariables>(SetCountAchievementDocument, options);
      }
export type SetCountAchievementMutationHookResult = ReturnType<typeof useSetCountAchievementMutation>;
export type SetCountAchievementMutationResult = Apollo.MutationResult<SetCountAchievementMutation>;
export type SetCountAchievementMutationOptions = Apollo.BaseMutationOptions<SetCountAchievementMutation, SetCountAchievementMutationVariables>;
export const AddGuideInputDocument = gql`
    mutation addGuideInput($id: String!, $campaign_id: Int!, $type: String!, $scenario: String, $step: String, $payload: jsonb) {
  insert_guide_input_one(
    object: {id: $id, campaign_id: $campaign_id, scenario: $scenario, step: $step, type: $type, payload: $payload}
    on_conflict: {constraint: guide_input_pkey, update_columns: [payload]}
  ) {
    ...GuideInput
  }
}
    ${GuideInputFragmentDoc}`;
export type AddGuideInputMutationFn = Apollo.MutationFunction<AddGuideInputMutation, AddGuideInputMutationVariables>;

/**
 * __useAddGuideInputMutation__
 *
 * To run a mutation, you first call `useAddGuideInputMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddGuideInputMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addGuideInputMutation, { data, loading, error }] = useAddGuideInputMutation({
 *   variables: {
 *      id: // value for 'id'
 *      campaign_id: // value for 'campaign_id'
 *      type: // value for 'type'
 *      scenario: // value for 'scenario'
 *      step: // value for 'step'
 *      payload: // value for 'payload'
 *   },
 * });
 */
export function useAddGuideInputMutation(baseOptions?: Apollo.MutationHookOptions<AddGuideInputMutation, AddGuideInputMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddGuideInputMutation, AddGuideInputMutationVariables>(AddGuideInputDocument, options);
      }
export type AddGuideInputMutationHookResult = ReturnType<typeof useAddGuideInputMutation>;
export type AddGuideInputMutationResult = Apollo.MutationResult<AddGuideInputMutation>;
export type AddGuideInputMutationOptions = Apollo.BaseMutationOptions<AddGuideInputMutation, AddGuideInputMutationVariables>;
export const RemoveGuideInputsDocument = gql`
    mutation removeGuideInputs($campaign_id: Int!, $ids: [String!]!) {
  delete_guide_input(where: {campaign_id: {_eq: $campaign_id}, id: {_in: $ids}}) {
    affected_rows
    returning {
      id
      campaign_id
    }
  }
}
    `;
export type RemoveGuideInputsMutationFn = Apollo.MutationFunction<RemoveGuideInputsMutation, RemoveGuideInputsMutationVariables>;

/**
 * __useRemoveGuideInputsMutation__
 *
 * To run a mutation, you first call `useRemoveGuideInputsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveGuideInputsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeGuideInputsMutation, { data, loading, error }] = useRemoveGuideInputsMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useRemoveGuideInputsMutation(baseOptions?: Apollo.MutationHookOptions<RemoveGuideInputsMutation, RemoveGuideInputsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveGuideInputsMutation, RemoveGuideInputsMutationVariables>(RemoveGuideInputsDocument, options);
      }
export type RemoveGuideInputsMutationHookResult = ReturnType<typeof useRemoveGuideInputsMutation>;
export type RemoveGuideInputsMutationResult = Apollo.MutationResult<RemoveGuideInputsMutation>;
export type RemoveGuideInputsMutationOptions = Apollo.BaseMutationOptions<RemoveGuideInputsMutation, RemoveGuideInputsMutationVariables>;
export const UpdateInvestigatorTraumaDocument = gql`
    mutation updateInvestigatorTrauma($campaign_id: Int!, $investigator: String!, $physical: Int, $mental: Int, $killed: Boolean, $insane: Boolean) {
  insert_investigator_data_one(
    object: {campaign_id: $campaign_id, investigator: $investigator, physical: $physical, mental: $mental, killed: $killed, insane: $insane}
    on_conflict: {constraint: investigator_data_pkey, update_columns: [physical, mental, killed, insane]}
  ) {
    ...MiniInvestigatorData
  }
}
    ${MiniInvestigatorDataFragmentDoc}`;
export type UpdateInvestigatorTraumaMutationFn = Apollo.MutationFunction<UpdateInvestigatorTraumaMutation, UpdateInvestigatorTraumaMutationVariables>;

/**
 * __useUpdateInvestigatorTraumaMutation__
 *
 * To run a mutation, you first call `useUpdateInvestigatorTraumaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInvestigatorTraumaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInvestigatorTraumaMutation, { data, loading, error }] = useUpdateInvestigatorTraumaMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      physical: // value for 'physical'
 *      mental: // value for 'mental'
 *      killed: // value for 'killed'
 *      insane: // value for 'insane'
 *   },
 * });
 */
export function useUpdateInvestigatorTraumaMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInvestigatorTraumaMutation, UpdateInvestigatorTraumaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInvestigatorTraumaMutation, UpdateInvestigatorTraumaMutationVariables>(UpdateInvestigatorTraumaDocument, options);
      }
export type UpdateInvestigatorTraumaMutationHookResult = ReturnType<typeof useUpdateInvestigatorTraumaMutation>;
export type UpdateInvestigatorTraumaMutationResult = Apollo.MutationResult<UpdateInvestigatorTraumaMutation>;
export type UpdateInvestigatorTraumaMutationOptions = Apollo.BaseMutationOptions<UpdateInvestigatorTraumaMutation, UpdateInvestigatorTraumaMutationVariables>;
export const UpdateInvestigatorDataDocument = gql`
    mutation updateInvestigatorData($campaign_id: Int!, $investigator: String!, $physical: Int, $mental: Int, $killed: Boolean, $insane: Boolean, $addedCards: jsonb, $availableXp: Int, $specialXp: jsonb, $storyAssets: jsonb, $ignoreStoryAssets: jsonb, $removedCards: jsonb, $cardCounts: jsonb) {
  insert_investigator_data_one(
    object: {campaign_id: $campaign_id, investigator: $investigator, physical: $physical, mental: $mental, killed: $killed, insane: $insane, cardCounts: $cardCounts, addedCards: $addedCards, storyAssets: $storyAssets, ignoreStoryAssets: $ignoreStoryAssets, removedCards: $removedCards, specialXp: $specialXp, availableXp: $availableXp}
    on_conflict: {constraint: investigator_data_pkey, update_columns: [physical, mental, killed, insane, addedCards, removedCards, storyAssets, ignoreStoryAssets, cardCounts, availableXp, specialXp]}
  ) {
    ...FullGuideInvestigatorData
  }
}
    ${FullGuideInvestigatorDataFragmentDoc}`;
export type UpdateInvestigatorDataMutationFn = Apollo.MutationFunction<UpdateInvestigatorDataMutation, UpdateInvestigatorDataMutationVariables>;

/**
 * __useUpdateInvestigatorDataMutation__
 *
 * To run a mutation, you first call `useUpdateInvestigatorDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInvestigatorDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInvestigatorDataMutation, { data, loading, error }] = useUpdateInvestigatorDataMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      physical: // value for 'physical'
 *      mental: // value for 'mental'
 *      killed: // value for 'killed'
 *      insane: // value for 'insane'
 *      addedCards: // value for 'addedCards'
 *      availableXp: // value for 'availableXp'
 *      specialXp: // value for 'specialXp'
 *      storyAssets: // value for 'storyAssets'
 *      ignoreStoryAssets: // value for 'ignoreStoryAssets'
 *      removedCards: // value for 'removedCards'
 *      cardCounts: // value for 'cardCounts'
 *   },
 * });
 */
export function useUpdateInvestigatorDataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInvestigatorDataMutation, UpdateInvestigatorDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInvestigatorDataMutation, UpdateInvestigatorDataMutationVariables>(UpdateInvestigatorDataDocument, options);
      }
export type UpdateInvestigatorDataMutationHookResult = ReturnType<typeof useUpdateInvestigatorDataMutation>;
export type UpdateInvestigatorDataMutationResult = Apollo.MutationResult<UpdateInvestigatorDataMutation>;
export type UpdateInvestigatorDataMutationOptions = Apollo.BaseMutationOptions<UpdateInvestigatorDataMutation, UpdateInvestigatorDataMutationVariables>;
export const UpdateSpentXpDocument = gql`
    mutation updateSpentXp($campaign_id: Int!, $investigator: String!, $spent_xp: Int!) {
  insert_investigator_data_one(
    object: {campaign_id: $campaign_id, investigator: $investigator, spentXp: $spent_xp}
    on_conflict: {constraint: investigator_data_pkey, update_columns: [spentXp]}
  ) {
    id
    campaign_id
    investigator
    spentXp
  }
}
    `;
export type UpdateSpentXpMutationFn = Apollo.MutationFunction<UpdateSpentXpMutation, UpdateSpentXpMutationVariables>;

/**
 * __useUpdateSpentXpMutation__
 *
 * To run a mutation, you first call `useUpdateSpentXpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSpentXpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSpentXpMutation, { data, loading, error }] = useUpdateSpentXpMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      spent_xp: // value for 'spent_xp'
 *   },
 * });
 */
export function useUpdateSpentXpMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSpentXpMutation, UpdateSpentXpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSpentXpMutation, UpdateSpentXpMutationVariables>(UpdateSpentXpDocument, options);
      }
export type UpdateSpentXpMutationHookResult = ReturnType<typeof useUpdateSpentXpMutation>;
export type UpdateSpentXpMutationResult = Apollo.MutationResult<UpdateSpentXpMutation>;
export type UpdateSpentXpMutationOptions = Apollo.BaseMutationOptions<UpdateSpentXpMutation, UpdateSpentXpMutationVariables>;
export const UpdateAvailableXpDocument = gql`
    mutation updateAvailableXp($campaign_id: Int!, $investigator: String!, $available_xp: Int!) {
  insert_investigator_data_one(
    object: {campaign_id: $campaign_id, investigator: $investigator, availableXp: $available_xp}
    on_conflict: {constraint: investigator_data_pkey, update_columns: [availableXp]}
  ) {
    id
    campaign_id
    investigator
    availableXp
  }
}
    `;
export type UpdateAvailableXpMutationFn = Apollo.MutationFunction<UpdateAvailableXpMutation, UpdateAvailableXpMutationVariables>;

/**
 * __useUpdateAvailableXpMutation__
 *
 * To run a mutation, you first call `useUpdateAvailableXpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAvailableXpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAvailableXpMutation, { data, loading, error }] = useUpdateAvailableXpMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *      available_xp: // value for 'available_xp'
 *   },
 * });
 */
export function useUpdateAvailableXpMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAvailableXpMutation, UpdateAvailableXpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAvailableXpMutation, UpdateAvailableXpMutationVariables>(UpdateAvailableXpDocument, options);
      }
export type UpdateAvailableXpMutationHookResult = ReturnType<typeof useUpdateAvailableXpMutation>;
export type UpdateAvailableXpMutationResult = Apollo.MutationResult<UpdateAvailableXpMutation>;
export type UpdateAvailableXpMutationOptions = Apollo.BaseMutationOptions<UpdateAvailableXpMutation, UpdateAvailableXpMutationVariables>;
export const UpdateCampaignArchivedDocument = gql`
    mutation updateCampaignArchived($campaign_id: Int!, $archived: Boolean!) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {archived: $archived}
  ) {
    id
    uuid
    archived
  }
}
    `;
export type UpdateCampaignArchivedMutationFn = Apollo.MutationFunction<UpdateCampaignArchivedMutation, UpdateCampaignArchivedMutationVariables>;

/**
 * __useUpdateCampaignArchivedMutation__
 *
 * To run a mutation, you first call `useUpdateCampaignArchivedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCampaignArchivedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCampaignArchivedMutation, { data, loading, error }] = useUpdateCampaignArchivedMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      archived: // value for 'archived'
 *   },
 * });
 */
export function useUpdateCampaignArchivedMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignArchivedMutation, UpdateCampaignArchivedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCampaignArchivedMutation, UpdateCampaignArchivedMutationVariables>(UpdateCampaignArchivedDocument, options);
      }
export type UpdateCampaignArchivedMutationHookResult = ReturnType<typeof useUpdateCampaignArchivedMutation>;
export type UpdateCampaignArchivedMutationResult = Apollo.MutationResult<UpdateCampaignArchivedMutation>;
export type UpdateCampaignArchivedMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignArchivedMutation, UpdateCampaignArchivedMutationVariables>;
export const UpdateWeaknessSetDocument = gql`
    mutation updateWeaknessSet($campaign_id: Int!, $weakness_set: jsonb!) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {weaknessSet: $weakness_set}
  ) {
    id
    uuid
    weaknessSet
  }
}
    `;
export type UpdateWeaknessSetMutationFn = Apollo.MutationFunction<UpdateWeaknessSetMutation, UpdateWeaknessSetMutationVariables>;

/**
 * __useUpdateWeaknessSetMutation__
 *
 * To run a mutation, you first call `useUpdateWeaknessSetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWeaknessSetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWeaknessSetMutation, { data, loading, error }] = useUpdateWeaknessSetMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      weakness_set: // value for 'weakness_set'
 *   },
 * });
 */
export function useUpdateWeaknessSetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWeaknessSetMutation, UpdateWeaknessSetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWeaknessSetMutation, UpdateWeaknessSetMutationVariables>(UpdateWeaknessSetDocument, options);
      }
export type UpdateWeaknessSetMutationHookResult = ReturnType<typeof useUpdateWeaknessSetMutation>;
export type UpdateWeaknessSetMutationResult = Apollo.MutationResult<UpdateWeaknessSetMutation>;
export type UpdateWeaknessSetMutationOptions = Apollo.BaseMutationOptions<UpdateWeaknessSetMutation, UpdateWeaknessSetMutationVariables>;
export const UpdateCampaignDifficultyDocument = gql`
    mutation updateCampaignDifficulty($campaign_id: Int!, $difficulty: String) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {difficulty: $difficulty}
  ) {
    id
    uuid
    difficulty
  }
}
    `;
export type UpdateCampaignDifficultyMutationFn = Apollo.MutationFunction<UpdateCampaignDifficultyMutation, UpdateCampaignDifficultyMutationVariables>;

/**
 * __useUpdateCampaignDifficultyMutation__
 *
 * To run a mutation, you first call `useUpdateCampaignDifficultyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCampaignDifficultyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCampaignDifficultyMutation, { data, loading, error }] = useUpdateCampaignDifficultyMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      difficulty: // value for 'difficulty'
 *   },
 * });
 */
export function useUpdateCampaignDifficultyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignDifficultyMutation, UpdateCampaignDifficultyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCampaignDifficultyMutation, UpdateCampaignDifficultyMutationVariables>(UpdateCampaignDifficultyDocument, options);
      }
export type UpdateCampaignDifficultyMutationHookResult = ReturnType<typeof useUpdateCampaignDifficultyMutation>;
export type UpdateCampaignDifficultyMutationResult = Apollo.MutationResult<UpdateCampaignDifficultyMutation>;
export type UpdateCampaignDifficultyMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignDifficultyMutation, UpdateCampaignDifficultyMutationVariables>;
export const UpdateCampaignScenarioResultsDocument = gql`
    mutation updateCampaignScenarioResults($campaign_id: Int!, $scenarioResults: jsonb!) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {scenarioResults: $scenarioResults}
  ) {
    id
    uuid
    scenarioResults
  }
}
    `;
export type UpdateCampaignScenarioResultsMutationFn = Apollo.MutationFunction<UpdateCampaignScenarioResultsMutation, UpdateCampaignScenarioResultsMutationVariables>;

/**
 * __useUpdateCampaignScenarioResultsMutation__
 *
 * To run a mutation, you first call `useUpdateCampaignScenarioResultsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCampaignScenarioResultsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCampaignScenarioResultsMutation, { data, loading, error }] = useUpdateCampaignScenarioResultsMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      scenarioResults: // value for 'scenarioResults'
 *   },
 * });
 */
export function useUpdateCampaignScenarioResultsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignScenarioResultsMutation, UpdateCampaignScenarioResultsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCampaignScenarioResultsMutation, UpdateCampaignScenarioResultsMutationVariables>(UpdateCampaignScenarioResultsDocument, options);
      }
export type UpdateCampaignScenarioResultsMutationHookResult = ReturnType<typeof useUpdateCampaignScenarioResultsMutation>;
export type UpdateCampaignScenarioResultsMutationResult = Apollo.MutationResult<UpdateCampaignScenarioResultsMutation>;
export type UpdateCampaignScenarioResultsMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignScenarioResultsMutation, UpdateCampaignScenarioResultsMutationVariables>;
export const UpdateCampaignGuideVersionDocument = gql`
    mutation updateCampaignGuideVersion($campaign_id: Int!, $guideVersion: Int!) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {guide_version: $guideVersion}
  ) {
    id
    uuid
    guide_version
  }
}
    `;
export type UpdateCampaignGuideVersionMutationFn = Apollo.MutationFunction<UpdateCampaignGuideVersionMutation, UpdateCampaignGuideVersionMutationVariables>;

/**
 * __useUpdateCampaignGuideVersionMutation__
 *
 * To run a mutation, you first call `useUpdateCampaignGuideVersionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCampaignGuideVersionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCampaignGuideVersionMutation, { data, loading, error }] = useUpdateCampaignGuideVersionMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      guideVersion: // value for 'guideVersion'
 *   },
 * });
 */
export function useUpdateCampaignGuideVersionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignGuideVersionMutation, UpdateCampaignGuideVersionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCampaignGuideVersionMutation, UpdateCampaignGuideVersionMutationVariables>(UpdateCampaignGuideVersionDocument, options);
      }
export type UpdateCampaignGuideVersionMutationHookResult = ReturnType<typeof useUpdateCampaignGuideVersionMutation>;
export type UpdateCampaignGuideVersionMutationResult = Apollo.MutationResult<UpdateCampaignGuideVersionMutation>;
export type UpdateCampaignGuideVersionMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignGuideVersionMutation, UpdateCampaignGuideVersionMutationVariables>;
export const UpdateCampaignNotesDocument = gql`
    mutation updateCampaignNotes($campaign_id: Int!, $campaign_notes: jsonb!) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {campaignNotes: $campaign_notes}
  ) {
    id
    uuid
    campaignNotes
  }
}
    `;
export type UpdateCampaignNotesMutationFn = Apollo.MutationFunction<UpdateCampaignNotesMutation, UpdateCampaignNotesMutationVariables>;

/**
 * __useUpdateCampaignNotesMutation__
 *
 * To run a mutation, you first call `useUpdateCampaignNotesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCampaignNotesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCampaignNotesMutation, { data, loading, error }] = useUpdateCampaignNotesMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      campaign_notes: // value for 'campaign_notes'
 *   },
 * });
 */
export function useUpdateCampaignNotesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignNotesMutation, UpdateCampaignNotesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCampaignNotesMutation, UpdateCampaignNotesMutationVariables>(UpdateCampaignNotesDocument, options);
      }
export type UpdateCampaignNotesMutationHookResult = ReturnType<typeof useUpdateCampaignNotesMutation>;
export type UpdateCampaignNotesMutationResult = Apollo.MutationResult<UpdateCampaignNotesMutation>;
export type UpdateCampaignNotesMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignNotesMutation, UpdateCampaignNotesMutationVariables>;
export const UpdateCampaignShowInterludesDocument = gql`
    mutation updateCampaignShowInterludes($campaign_id: Int!, $show_interludes: Boolean!) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {showInterludes: $show_interludes}
  ) {
    id
    uuid
    showInterludes
  }
}
    `;
export type UpdateCampaignShowInterludesMutationFn = Apollo.MutationFunction<UpdateCampaignShowInterludesMutation, UpdateCampaignShowInterludesMutationVariables>;

/**
 * __useUpdateCampaignShowInterludesMutation__
 *
 * To run a mutation, you first call `useUpdateCampaignShowInterludesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCampaignShowInterludesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCampaignShowInterludesMutation, { data, loading, error }] = useUpdateCampaignShowInterludesMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      show_interludes: // value for 'show_interludes'
 *   },
 * });
 */
export function useUpdateCampaignShowInterludesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignShowInterludesMutation, UpdateCampaignShowInterludesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCampaignShowInterludesMutation, UpdateCampaignShowInterludesMutationVariables>(UpdateCampaignShowInterludesDocument, options);
      }
export type UpdateCampaignShowInterludesMutationHookResult = ReturnType<typeof useUpdateCampaignShowInterludesMutation>;
export type UpdateCampaignShowInterludesMutationResult = Apollo.MutationResult<UpdateCampaignShowInterludesMutation>;
export type UpdateCampaignShowInterludesMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignShowInterludesMutation, UpdateCampaignShowInterludesMutationVariables>;
export const UpdateChaosBagDocument = gql`
    mutation updateChaosBag($campaign_id: Int!, $chaos_bag: jsonb!) {
  update_campaign_by_pk(
    pk_columns: {id: $campaign_id}
    _set: {chaosBag: $chaos_bag}
  ) {
    id
    uuid
    chaosBag
  }
}
    `;
export type UpdateChaosBagMutationFn = Apollo.MutationFunction<UpdateChaosBagMutation, UpdateChaosBagMutationVariables>;

/**
 * __useUpdateChaosBagMutation__
 *
 * To run a mutation, you first call `useUpdateChaosBagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChaosBagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChaosBagMutation, { data, loading, error }] = useUpdateChaosBagMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      chaos_bag: // value for 'chaos_bag'
 *   },
 * });
 */
export function useUpdateChaosBagMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChaosBagMutation, UpdateChaosBagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChaosBagMutation, UpdateChaosBagMutationVariables>(UpdateChaosBagDocument, options);
      }
export type UpdateChaosBagMutationHookResult = ReturnType<typeof useUpdateChaosBagMutation>;
export type UpdateChaosBagMutationResult = Apollo.MutationResult<UpdateChaosBagMutation>;
export type UpdateChaosBagMutationOptions = Apollo.BaseMutationOptions<UpdateChaosBagMutation, UpdateChaosBagMutationVariables>;
export const UpdateCampaignNameDocument = gql`
    mutation updateCampaignName($campaign_id: Int!, $name: String!) {
  update_campaign_by_pk(pk_columns: {id: $campaign_id}, _set: {name: $name}) {
    id
    uuid
    name
  }
}
    `;
export type UpdateCampaignNameMutationFn = Apollo.MutationFunction<UpdateCampaignNameMutation, UpdateCampaignNameMutationVariables>;

/**
 * __useUpdateCampaignNameMutation__
 *
 * To run a mutation, you first call `useUpdateCampaignNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCampaignNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCampaignNameMutation, { data, loading, error }] = useUpdateCampaignNameMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateCampaignNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignNameMutation, UpdateCampaignNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCampaignNameMutation, UpdateCampaignNameMutationVariables>(UpdateCampaignNameDocument, options);
      }
export type UpdateCampaignNameMutationHookResult = ReturnType<typeof useUpdateCampaignNameMutation>;
export type UpdateCampaignNameMutationResult = Apollo.MutationResult<UpdateCampaignNameMutation>;
export type UpdateCampaignNameMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignNameMutation, UpdateCampaignNameMutationVariables>;
export const AddCampaignInvestigatorDocument = gql`
    mutation addCampaignInvestigator($campaign_id: Int!, $investigator: String!) {
  insert_campaign_investigator_one(
    object: {campaign_id: $campaign_id, investigator: $investigator}
    on_conflict: {constraint: campaign_investigator_campaign_id_investigator_key, update_columns: [investigator]}
  ) {
    id
    investigator
    campaign_id
  }
}
    `;
export type AddCampaignInvestigatorMutationFn = Apollo.MutationFunction<AddCampaignInvestigatorMutation, AddCampaignInvestigatorMutationVariables>;

/**
 * __useAddCampaignInvestigatorMutation__
 *
 * To run a mutation, you first call `useAddCampaignInvestigatorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCampaignInvestigatorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCampaignInvestigatorMutation, { data, loading, error }] = useAddCampaignInvestigatorMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *   },
 * });
 */
export function useAddCampaignInvestigatorMutation(baseOptions?: Apollo.MutationHookOptions<AddCampaignInvestigatorMutation, AddCampaignInvestigatorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCampaignInvestigatorMutation, AddCampaignInvestigatorMutationVariables>(AddCampaignInvestigatorDocument, options);
      }
export type AddCampaignInvestigatorMutationHookResult = ReturnType<typeof useAddCampaignInvestigatorMutation>;
export type AddCampaignInvestigatorMutationResult = Apollo.MutationResult<AddCampaignInvestigatorMutation>;
export type AddCampaignInvestigatorMutationOptions = Apollo.BaseMutationOptions<AddCampaignInvestigatorMutation, AddCampaignInvestigatorMutationVariables>;
export const RemoveCampaignInvestigatorDocument = gql`
    mutation removeCampaignInvestigator($campaign_id: Int!, $investigator: String!) {
  delete_campaign_investigator(
    where: {campaign_id: {_eq: $campaign_id}, investigator: {_eq: $investigator}}
  ) {
    returning {
      id
      campaign_id
      investigator
    }
  }
}
    `;
export type RemoveCampaignInvestigatorMutationFn = Apollo.MutationFunction<RemoveCampaignInvestigatorMutation, RemoveCampaignInvestigatorMutationVariables>;

/**
 * __useRemoveCampaignInvestigatorMutation__
 *
 * To run a mutation, you first call `useRemoveCampaignInvestigatorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCampaignInvestigatorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCampaignInvestigatorMutation, { data, loading, error }] = useRemoveCampaignInvestigatorMutation({
 *   variables: {
 *      campaign_id: // value for 'campaign_id'
 *      investigator: // value for 'investigator'
 *   },
 * });
 */
export function useRemoveCampaignInvestigatorMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCampaignInvestigatorMutation, RemoveCampaignInvestigatorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCampaignInvestigatorMutation, RemoveCampaignInvestigatorMutationVariables>(RemoveCampaignInvestigatorDocument, options);
      }
export type RemoveCampaignInvestigatorMutationHookResult = ReturnType<typeof useRemoveCampaignInvestigatorMutation>;
export type RemoveCampaignInvestigatorMutationResult = Apollo.MutationResult<RemoveCampaignInvestigatorMutation>;
export type RemoveCampaignInvestigatorMutationOptions = Apollo.BaseMutationOptions<RemoveCampaignInvestigatorMutation, RemoveCampaignInvestigatorMutationVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    