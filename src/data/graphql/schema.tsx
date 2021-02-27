import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
};

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  _nlike?: Maybe<Scalars['String']>;
  _nsimilar?: Maybe<Scalars['String']>;
  _similar?: Maybe<Scalars['String']>;
};

/** columns and relationships of "campaign" */
export type Campaign = {
  __typename?: 'campaign';
  /** An array relationship */
  access: Array<Campaign_Access>;
  /** An aggregated array relationship */
  access_aggregate: Campaign_Access_Aggregate;
  campaignNotes?: Maybe<Scalars['jsonb']>;
  chaosBag?: Maybe<Scalars['jsonb']>;
  created_at: Scalars['timestamptz'];
  cycleCode?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  difficulty?: Maybe<Scalars['String']>;
  /** An array relationship */
  guide_achivements: Array<Guide_Achivement>;
  /** An aggregated array relationship */
  guide_achivements_aggregate: Guide_Achivement_Aggregate;
  /** An array relationship */
  guide_inputs: Array<Guide_Input>;
  /** An aggregated array relationship */
  guide_inputs_aggregate: Guide_Input_Aggregate;
  guided?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  /** An array relationship */
  investigator_data: Array<Investigator_Data>;
  /** An aggregated array relationship */
  investigator_data_aggregate: Investigator_Data_Aggregate;
  /** An object relationship */
  link_a_campaign?: Maybe<Campaign>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  /** An object relationship */
  link_b_campaign?: Maybe<Campaign>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  nonDeckInvestigators?: Maybe<Scalars['jsonb']>;
  owner: Scalars['String'];
  scenarioResults?: Maybe<Scalars['jsonb']>;
  showInterludes?: Maybe<Scalars['Boolean']>;
  standaloneId?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamptz'];
  uuid?: Maybe<Scalars['String']>;
  weaknessSet?: Maybe<Scalars['jsonb']>;
};


/** columns and relationships of "campaign" */
export type CampaignAccessArgs = {
  distinct_on?: Maybe<Array<Campaign_Access_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Access_Order_By>>;
  where?: Maybe<Campaign_Access_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignAccess_AggregateArgs = {
  distinct_on?: Maybe<Array<Campaign_Access_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Access_Order_By>>;
  where?: Maybe<Campaign_Access_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignCampaignNotesArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignChaosBagArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignGuide_AchivementsArgs = {
  distinct_on?: Maybe<Array<Guide_Achivement_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Achivement_Order_By>>;
  where?: Maybe<Guide_Achivement_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignGuide_Achivements_AggregateArgs = {
  distinct_on?: Maybe<Array<Guide_Achivement_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Achivement_Order_By>>;
  where?: Maybe<Guide_Achivement_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignGuide_InputsArgs = {
  distinct_on?: Maybe<Array<Guide_Input_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Input_Order_By>>;
  where?: Maybe<Guide_Input_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignGuide_Inputs_AggregateArgs = {
  distinct_on?: Maybe<Array<Guide_Input_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Input_Order_By>>;
  where?: Maybe<Guide_Input_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignInvestigator_DataArgs = {
  distinct_on?: Maybe<Array<Investigator_Data_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Investigator_Data_Order_By>>;
  where?: Maybe<Investigator_Data_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignInvestigator_Data_AggregateArgs = {
  distinct_on?: Maybe<Array<Investigator_Data_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Investigator_Data_Order_By>>;
  where?: Maybe<Investigator_Data_Bool_Exp>;
};


/** columns and relationships of "campaign" */
export type CampaignNonDeckInvestigatorsArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignScenarioResultsArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignStandaloneIdArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "campaign" */
export type CampaignWeaknessSetArgs = {
  path?: Maybe<Scalars['String']>;
};

/** columns and relationships of "campaign_access" */
export type Campaign_Access = {
  __typename?: 'campaign_access';
  campaign_id: Scalars['Int'];
  hidden?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
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
  count?: Maybe<Scalars['Int']>;
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
  columns?: Maybe<Array<Campaign_Access_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "campaign_access" */
export type Campaign_Access_Aggregate_Order_By = {
  avg?: Maybe<Campaign_Access_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Campaign_Access_Max_Order_By>;
  min?: Maybe<Campaign_Access_Min_Order_By>;
  stddev?: Maybe<Campaign_Access_Stddev_Order_By>;
  stddev_pop?: Maybe<Campaign_Access_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Campaign_Access_Stddev_Samp_Order_By>;
  sum?: Maybe<Campaign_Access_Sum_Order_By>;
  var_pop?: Maybe<Campaign_Access_Var_Pop_Order_By>;
  var_samp?: Maybe<Campaign_Access_Var_Samp_Order_By>;
  variance?: Maybe<Campaign_Access_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "campaign_access" */
export type Campaign_Access_Arr_Rel_Insert_Input = {
  data: Array<Campaign_Access_Insert_Input>;
  on_conflict?: Maybe<Campaign_Access_On_Conflict>;
};

/** aggregate avg on columns */
export type Campaign_Access_Avg_Fields = {
  __typename?: 'campaign_access_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "campaign_access" */
export type Campaign_Access_Avg_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "campaign_access". All fields are combined with a logical 'AND'. */
export type Campaign_Access_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Campaign_Access_Bool_Exp>>>;
  _not?: Maybe<Campaign_Access_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Campaign_Access_Bool_Exp>>>;
  campaign_id?: Maybe<Int_Comparison_Exp>;
  hidden?: Maybe<Boolean_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  user_id?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "campaign_access" */
export enum Campaign_Access_Constraint {
  /** unique or primary key constraint */
  CampaignAccessPkey = 'campaign_access_pkey',
  /** unique or primary key constraint */
  CampaignAccessUserIdCampaignIdKey = 'campaign_access_user_id_campaign_id_key'
}

/** input type for incrementing integer column in table "campaign_access" */
export type Campaign_Access_Inc_Input = {
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "campaign_access" */
export type Campaign_Access_Insert_Input = {
  campaign_id?: Maybe<Scalars['Int']>;
  hidden?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
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
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
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
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "campaign_access" */
export type Campaign_Access_Mutation_Response = {
  __typename?: 'campaign_access_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Campaign_Access>;
};

/** input type for inserting object relation for remote table "campaign_access" */
export type Campaign_Access_Obj_Rel_Insert_Input = {
  data: Campaign_Access_Insert_Input;
  on_conflict?: Maybe<Campaign_Access_On_Conflict>;
};

/** on conflict condition type for table "campaign_access" */
export type Campaign_Access_On_Conflict = {
  constraint: Campaign_Access_Constraint;
  update_columns: Array<Campaign_Access_Update_Column>;
  where?: Maybe<Campaign_Access_Bool_Exp>;
};

/** ordering options when selecting data from "campaign_access" */
export type Campaign_Access_Order_By = {
  campaign_id?: Maybe<Order_By>;
  hidden?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "campaign_access" */
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
  campaign_id?: Maybe<Scalars['Int']>;
  hidden?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Campaign_Access_Stddev_Fields = {
  __typename?: 'campaign_access_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "campaign_access" */
export type Campaign_Access_Stddev_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Campaign_Access_Stddev_Pop_Fields = {
  __typename?: 'campaign_access_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "campaign_access" */
export type Campaign_Access_Stddev_Pop_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Campaign_Access_Stddev_Samp_Fields = {
  __typename?: 'campaign_access_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "campaign_access" */
export type Campaign_Access_Stddev_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Campaign_Access_Sum_Fields = {
  __typename?: 'campaign_access_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "campaign_access" */
export type Campaign_Access_Sum_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
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
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Campaign_Access_Var_Samp_Fields = {
  __typename?: 'campaign_access_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "campaign_access" */
export type Campaign_Access_Var_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Campaign_Access_Variance_Fields = {
  __typename?: 'campaign_access_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "campaign_access" */
export type Campaign_Access_Variance_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
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
  count?: Maybe<Scalars['Int']>;
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
  columns?: Maybe<Array<Campaign_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "campaign" */
export type Campaign_Aggregate_Order_By = {
  avg?: Maybe<Campaign_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Campaign_Max_Order_By>;
  min?: Maybe<Campaign_Min_Order_By>;
  stddev?: Maybe<Campaign_Stddev_Order_By>;
  stddev_pop?: Maybe<Campaign_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Campaign_Stddev_Samp_Order_By>;
  sum?: Maybe<Campaign_Sum_Order_By>;
  var_pop?: Maybe<Campaign_Var_Pop_Order_By>;
  var_samp?: Maybe<Campaign_Var_Samp_Order_By>;
  variance?: Maybe<Campaign_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Campaign_Append_Input = {
  campaignNotes?: Maybe<Scalars['jsonb']>;
  chaosBag?: Maybe<Scalars['jsonb']>;
  nonDeckInvestigators?: Maybe<Scalars['jsonb']>;
  scenarioResults?: Maybe<Scalars['jsonb']>;
  standaloneId?: Maybe<Scalars['jsonb']>;
  weaknessSet?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "campaign" */
export type Campaign_Arr_Rel_Insert_Input = {
  data: Array<Campaign_Insert_Input>;
  on_conflict?: Maybe<Campaign_On_Conflict>;
};

/** aggregate avg on columns */
export type Campaign_Avg_Fields = {
  __typename?: 'campaign_avg_fields';
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "campaign" */
export type Campaign_Avg_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "campaign". All fields are combined with a logical 'AND'. */
export type Campaign_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Campaign_Bool_Exp>>>;
  _not?: Maybe<Campaign_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Campaign_Bool_Exp>>>;
  access?: Maybe<Campaign_Access_Bool_Exp>;
  campaignNotes?: Maybe<Jsonb_Comparison_Exp>;
  chaosBag?: Maybe<Jsonb_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  cycleCode?: Maybe<String_Comparison_Exp>;
  deleted?: Maybe<Boolean_Comparison_Exp>;
  difficulty?: Maybe<String_Comparison_Exp>;
  guide_achivements?: Maybe<Guide_Achivement_Bool_Exp>;
  guide_inputs?: Maybe<Guide_Input_Bool_Exp>;
  guided?: Maybe<Boolean_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  investigator_data?: Maybe<Investigator_Data_Bool_Exp>;
  link_a_campaign?: Maybe<Campaign_Bool_Exp>;
  link_a_campaign_id?: Maybe<Int_Comparison_Exp>;
  link_b_campaign?: Maybe<Campaign_Bool_Exp>;
  link_b_campaign_id?: Maybe<Int_Comparison_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  nonDeckInvestigators?: Maybe<Jsonb_Comparison_Exp>;
  owner?: Maybe<String_Comparison_Exp>;
  scenarioResults?: Maybe<Jsonb_Comparison_Exp>;
  showInterludes?: Maybe<Boolean_Comparison_Exp>;
  standaloneId?: Maybe<Jsonb_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
  uuid?: Maybe<String_Comparison_Exp>;
  weaknessSet?: Maybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "campaign" */
export enum Campaign_Constraint {
  /** unique or primary key constraint */
  CampaignDataPkey = 'campaign_data_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Campaign_Delete_At_Path_Input = {
  campaignNotes?: Maybe<Array<Maybe<Scalars['String']>>>;
  chaosBag?: Maybe<Array<Maybe<Scalars['String']>>>;
  nonDeckInvestigators?: Maybe<Array<Maybe<Scalars['String']>>>;
  scenarioResults?: Maybe<Array<Maybe<Scalars['String']>>>;
  standaloneId?: Maybe<Array<Maybe<Scalars['String']>>>;
  weaknessSet?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Campaign_Delete_Elem_Input = {
  campaignNotes?: Maybe<Scalars['Int']>;
  chaosBag?: Maybe<Scalars['Int']>;
  nonDeckInvestigators?: Maybe<Scalars['Int']>;
  scenarioResults?: Maybe<Scalars['Int']>;
  standaloneId?: Maybe<Scalars['Int']>;
  weaknessSet?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Campaign_Delete_Key_Input = {
  campaignNotes?: Maybe<Scalars['String']>;
  chaosBag?: Maybe<Scalars['String']>;
  nonDeckInvestigators?: Maybe<Scalars['String']>;
  scenarioResults?: Maybe<Scalars['String']>;
  standaloneId?: Maybe<Scalars['String']>;
  weaknessSet?: Maybe<Scalars['String']>;
};

/** input type for incrementing integer column in table "campaign" */
export type Campaign_Inc_Input = {
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "campaign" */
export type Campaign_Insert_Input = {
  access?: Maybe<Campaign_Access_Arr_Rel_Insert_Input>;
  campaignNotes?: Maybe<Scalars['jsonb']>;
  chaosBag?: Maybe<Scalars['jsonb']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  cycleCode?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  difficulty?: Maybe<Scalars['String']>;
  guide_achivements?: Maybe<Guide_Achivement_Arr_Rel_Insert_Input>;
  guide_inputs?: Maybe<Guide_Input_Arr_Rel_Insert_Input>;
  guided?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Int']>;
  investigator_data?: Maybe<Investigator_Data_Arr_Rel_Insert_Input>;
  link_a_campaign?: Maybe<Campaign_Obj_Rel_Insert_Input>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign?: Maybe<Campaign_Obj_Rel_Insert_Input>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  nonDeckInvestigators?: Maybe<Scalars['jsonb']>;
  owner?: Maybe<Scalars['String']>;
  scenarioResults?: Maybe<Scalars['jsonb']>;
  showInterludes?: Maybe<Scalars['Boolean']>;
  standaloneId?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
  weaknessSet?: Maybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type Campaign_Max_Fields = {
  __typename?: 'campaign_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  cycleCode?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "campaign" */
export type Campaign_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  cycleCode?: Maybe<Order_By>;
  difficulty?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  uuid?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Campaign_Min_Fields = {
  __typename?: 'campaign_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  cycleCode?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "campaign" */
export type Campaign_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  cycleCode?: Maybe<Order_By>;
  difficulty?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  uuid?: Maybe<Order_By>;
};

/** response of any mutation on the table "campaign" */
export type Campaign_Mutation_Response = {
  __typename?: 'campaign_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Campaign>;
};

/** input type for inserting object relation for remote table "campaign" */
export type Campaign_Obj_Rel_Insert_Input = {
  data: Campaign_Insert_Input;
  on_conflict?: Maybe<Campaign_On_Conflict>;
};

/** on conflict condition type for table "campaign" */
export type Campaign_On_Conflict = {
  constraint: Campaign_Constraint;
  update_columns: Array<Campaign_Update_Column>;
  where?: Maybe<Campaign_Bool_Exp>;
};

/** ordering options when selecting data from "campaign" */
export type Campaign_Order_By = {
  access_aggregate?: Maybe<Campaign_Access_Aggregate_Order_By>;
  campaignNotes?: Maybe<Order_By>;
  chaosBag?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  cycleCode?: Maybe<Order_By>;
  deleted?: Maybe<Order_By>;
  difficulty?: Maybe<Order_By>;
  guide_achivements_aggregate?: Maybe<Guide_Achivement_Aggregate_Order_By>;
  guide_inputs_aggregate?: Maybe<Guide_Input_Aggregate_Order_By>;
  guided?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  investigator_data_aggregate?: Maybe<Investigator_Data_Aggregate_Order_By>;
  link_a_campaign?: Maybe<Campaign_Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign?: Maybe<Campaign_Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  nonDeckInvestigators?: Maybe<Order_By>;
  owner?: Maybe<Order_By>;
  scenarioResults?: Maybe<Order_By>;
  showInterludes?: Maybe<Order_By>;
  standaloneId?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  uuid?: Maybe<Order_By>;
  weaknessSet?: Maybe<Order_By>;
};

/** primary key columns input for table: "campaign" */
export type Campaign_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Campaign_Prepend_Input = {
  campaignNotes?: Maybe<Scalars['jsonb']>;
  chaosBag?: Maybe<Scalars['jsonb']>;
  nonDeckInvestigators?: Maybe<Scalars['jsonb']>;
  scenarioResults?: Maybe<Scalars['jsonb']>;
  standaloneId?: Maybe<Scalars['jsonb']>;
  weaknessSet?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "campaign" */
export enum Campaign_Select_Column {
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
  Guided = 'guided',
  /** column name */
  Id = 'id',
  /** column name */
  LinkACampaignId = 'link_a_campaign_id',
  /** column name */
  LinkBCampaignId = 'link_b_campaign_id',
  /** column name */
  Name = 'name',
  /** column name */
  NonDeckInvestigators = 'nonDeckInvestigators',
  /** column name */
  Owner = 'owner',
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
  campaignNotes?: Maybe<Scalars['jsonb']>;
  chaosBag?: Maybe<Scalars['jsonb']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  cycleCode?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  difficulty?: Maybe<Scalars['String']>;
  guided?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  nonDeckInvestigators?: Maybe<Scalars['jsonb']>;
  owner?: Maybe<Scalars['String']>;
  scenarioResults?: Maybe<Scalars['jsonb']>;
  showInterludes?: Maybe<Scalars['Boolean']>;
  standaloneId?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uuid?: Maybe<Scalars['String']>;
  weaknessSet?: Maybe<Scalars['jsonb']>;
};

/** aggregate stddev on columns */
export type Campaign_Stddev_Fields = {
  __typename?: 'campaign_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "campaign" */
export type Campaign_Stddev_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Campaign_Stddev_Pop_Fields = {
  __typename?: 'campaign_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "campaign" */
export type Campaign_Stddev_Pop_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Campaign_Stddev_Samp_Fields = {
  __typename?: 'campaign_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "campaign" */
export type Campaign_Stddev_Samp_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Campaign_Sum_Fields = {
  __typename?: 'campaign_sum_fields';
  id?: Maybe<Scalars['Int']>;
  link_a_campaign_id?: Maybe<Scalars['Int']>;
  link_b_campaign_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "campaign" */
export type Campaign_Sum_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** update columns of table "campaign" */
export enum Campaign_Update_Column {
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
  Guided = 'guided',
  /** column name */
  Id = 'id',
  /** column name */
  LinkACampaignId = 'link_a_campaign_id',
  /** column name */
  LinkBCampaignId = 'link_b_campaign_id',
  /** column name */
  Name = 'name',
  /** column name */
  NonDeckInvestigators = 'nonDeckInvestigators',
  /** column name */
  Owner = 'owner',
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
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "campaign" */
export type Campaign_Var_Pop_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Campaign_Var_Samp_Fields = {
  __typename?: 'campaign_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "campaign" */
export type Campaign_Var_Samp_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Campaign_Variance_Fields = {
  __typename?: 'campaign_variance_fields';
  id?: Maybe<Scalars['Float']>;
  link_a_campaign_id?: Maybe<Scalars['Float']>;
  link_b_campaign_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "campaign" */
export type Campaign_Variance_Order_By = {
  id?: Maybe<Order_By>;
  link_a_campaign_id?: Maybe<Order_By>;
  link_b_campaign_id?: Maybe<Order_By>;
};

/** columns and relationships of "friend_status" */
export type Friend_Status = {
  __typename?: 'friend_status';
  status: Scalars['String'];
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
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Friend_Status_Max_Fields>;
  min?: Maybe<Friend_Status_Min_Fields>;
};


/** aggregate fields of "friend_status" */
export type Friend_Status_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Friend_Status_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "friend_status" */
export type Friend_Status_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Friend_Status_Max_Order_By>;
  min?: Maybe<Friend_Status_Min_Order_By>;
};

/** input type for inserting array relation for remote table "friend_status" */
export type Friend_Status_Arr_Rel_Insert_Input = {
  data: Array<Friend_Status_Insert_Input>;
  on_conflict?: Maybe<Friend_Status_On_Conflict>;
};

/** Boolean expression to filter rows from the table "friend_status". All fields are combined with a logical 'AND'. */
export type Friend_Status_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Friend_Status_Bool_Exp>>>;
  _not?: Maybe<Friend_Status_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Friend_Status_Bool_Exp>>>;
  status?: Maybe<String_Comparison_Exp>;
  user_id_a?: Maybe<String_Comparison_Exp>;
  user_id_b?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "friend_status" */
export enum Friend_Status_Constraint {
  /** unique or primary key constraint */
  FriendStatusPkey = 'friend_status_pkey'
}

/** input type for inserting data into table "friend_status" */
export type Friend_Status_Insert_Input = {
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Friend_Status_Max_Fields = {
  __typename?: 'friend_status_max_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "friend_status" */
export type Friend_Status_Max_Order_By = {
  status?: Maybe<Order_By>;
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Friend_Status_Min_Fields = {
  __typename?: 'friend_status_min_fields';
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "friend_status" */
export type Friend_Status_Min_Order_By = {
  status?: Maybe<Order_By>;
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** response of any mutation on the table "friend_status" */
export type Friend_Status_Mutation_Response = {
  __typename?: 'friend_status_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Friend_Status>;
};

/** input type for inserting object relation for remote table "friend_status" */
export type Friend_Status_Obj_Rel_Insert_Input = {
  data: Friend_Status_Insert_Input;
  on_conflict?: Maybe<Friend_Status_On_Conflict>;
};

/** on conflict condition type for table "friend_status" */
export type Friend_Status_On_Conflict = {
  constraint: Friend_Status_Constraint;
  update_columns: Array<Friend_Status_Update_Column>;
  where?: Maybe<Friend_Status_Bool_Exp>;
};

/** ordering options when selecting data from "friend_status" */
export type Friend_Status_Order_By = {
  status?: Maybe<Order_By>;
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** primary key columns input for table: "friend_status" */
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
  status?: Maybe<Scalars['String']>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** update columns of table "friend_status" */
export enum Friend_Status_Update_Column {
  /** column name */
  Status = 'status',
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** columns and relationships of "guide_achivement" */
export type Guide_Achivement = {
  __typename?: 'guide_achivement';
  achievement_id: Scalars['String'];
  bool_value?: Maybe<Scalars['Boolean']>;
  /** An object relationship */
  campaign: Campaign;
  campaign_id: Scalars['Int'];
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
  type: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  value?: Maybe<Scalars['Int']>;
};

/** aggregated selection of "guide_achivement" */
export type Guide_Achivement_Aggregate = {
  __typename?: 'guide_achivement_aggregate';
  aggregate?: Maybe<Guide_Achivement_Aggregate_Fields>;
  nodes: Array<Guide_Achivement>;
};

/** aggregate fields of "guide_achivement" */
export type Guide_Achivement_Aggregate_Fields = {
  __typename?: 'guide_achivement_aggregate_fields';
  avg?: Maybe<Guide_Achivement_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Guide_Achivement_Max_Fields>;
  min?: Maybe<Guide_Achivement_Min_Fields>;
  stddev?: Maybe<Guide_Achivement_Stddev_Fields>;
  stddev_pop?: Maybe<Guide_Achivement_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Guide_Achivement_Stddev_Samp_Fields>;
  sum?: Maybe<Guide_Achivement_Sum_Fields>;
  var_pop?: Maybe<Guide_Achivement_Var_Pop_Fields>;
  var_samp?: Maybe<Guide_Achivement_Var_Samp_Fields>;
  variance?: Maybe<Guide_Achivement_Variance_Fields>;
};


/** aggregate fields of "guide_achivement" */
export type Guide_Achivement_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Guide_Achivement_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "guide_achivement" */
export type Guide_Achivement_Aggregate_Order_By = {
  avg?: Maybe<Guide_Achivement_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Guide_Achivement_Max_Order_By>;
  min?: Maybe<Guide_Achivement_Min_Order_By>;
  stddev?: Maybe<Guide_Achivement_Stddev_Order_By>;
  stddev_pop?: Maybe<Guide_Achivement_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Guide_Achivement_Stddev_Samp_Order_By>;
  sum?: Maybe<Guide_Achivement_Sum_Order_By>;
  var_pop?: Maybe<Guide_Achivement_Var_Pop_Order_By>;
  var_samp?: Maybe<Guide_Achivement_Var_Samp_Order_By>;
  variance?: Maybe<Guide_Achivement_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "guide_achivement" */
export type Guide_Achivement_Arr_Rel_Insert_Input = {
  data: Array<Guide_Achivement_Insert_Input>;
  on_conflict?: Maybe<Guide_Achivement_On_Conflict>;
};

/** aggregate avg on columns */
export type Guide_Achivement_Avg_Fields = {
  __typename?: 'guide_achivement_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "guide_achivement" */
export type Guide_Achivement_Avg_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "guide_achivement". All fields are combined with a logical 'AND'. */
export type Guide_Achivement_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Guide_Achivement_Bool_Exp>>>;
  _not?: Maybe<Guide_Achivement_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Guide_Achivement_Bool_Exp>>>;
  achievement_id?: Maybe<String_Comparison_Exp>;
  bool_value?: Maybe<Boolean_Comparison_Exp>;
  campaign?: Maybe<Campaign_Bool_Exp>;
  campaign_id?: Maybe<Int_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  type?: Maybe<String_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
  value?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "guide_achivement" */
export enum Guide_Achivement_Constraint {
  /** unique or primary key constraint */
  CampaignGuideAchivementPkey = 'campaign_guide_achivement_pkey',
  /** unique or primary key constraint */
  GuideAchivementCampaignIdAchievementIdKey = 'guide_achivement_campaign_id_achievement_id_key'
}

/** input type for incrementing integer column in table "guide_achivement" */
export type Guide_Achivement_Inc_Input = {
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "guide_achivement" */
export type Guide_Achivement_Insert_Input = {
  achievement_id?: Maybe<Scalars['String']>;
  bool_value?: Maybe<Scalars['Boolean']>;
  campaign?: Maybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  value?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Guide_Achivement_Max_Fields = {
  __typename?: 'guide_achivement_max_fields';
  achievement_id?: Maybe<Scalars['String']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  value?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "guide_achivement" */
export type Guide_Achivement_Max_Order_By = {
  achievement_id?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Guide_Achivement_Min_Fields = {
  __typename?: 'guide_achivement_min_fields';
  achievement_id?: Maybe<Scalars['String']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  value?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "guide_achivement" */
export type Guide_Achivement_Min_Order_By = {
  achievement_id?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "guide_achivement" */
export type Guide_Achivement_Mutation_Response = {
  __typename?: 'guide_achivement_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Guide_Achivement>;
};

/** input type for inserting object relation for remote table "guide_achivement" */
export type Guide_Achivement_Obj_Rel_Insert_Input = {
  data: Guide_Achivement_Insert_Input;
  on_conflict?: Maybe<Guide_Achivement_On_Conflict>;
};

/** on conflict condition type for table "guide_achivement" */
export type Guide_Achivement_On_Conflict = {
  constraint: Guide_Achivement_Constraint;
  update_columns: Array<Guide_Achivement_Update_Column>;
  where?: Maybe<Guide_Achivement_Bool_Exp>;
};

/** ordering options when selecting data from "guide_achivement" */
export type Guide_Achivement_Order_By = {
  achievement_id?: Maybe<Order_By>;
  bool_value?: Maybe<Order_By>;
  campaign?: Maybe<Campaign_Order_By>;
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "guide_achivement" */
export type Guide_Achivement_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "guide_achivement" */
export enum Guide_Achivement_Select_Column {
  /** column name */
  AchievementId = 'achievement_id',
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

/** input type for updating data in table "guide_achivement" */
export type Guide_Achivement_Set_Input = {
  achievement_id?: Maybe<Scalars['String']>;
  bool_value?: Maybe<Scalars['Boolean']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  value?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Guide_Achivement_Stddev_Fields = {
  __typename?: 'guide_achivement_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "guide_achivement" */
export type Guide_Achivement_Stddev_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Guide_Achivement_Stddev_Pop_Fields = {
  __typename?: 'guide_achivement_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "guide_achivement" */
export type Guide_Achivement_Stddev_Pop_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Guide_Achivement_Stddev_Samp_Fields = {
  __typename?: 'guide_achivement_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "guide_achivement" */
export type Guide_Achivement_Stddev_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Guide_Achivement_Sum_Fields = {
  __typename?: 'guide_achivement_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "guide_achivement" */
export type Guide_Achivement_Sum_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** update columns of table "guide_achivement" */
export enum Guide_Achivement_Update_Column {
  /** column name */
  AchievementId = 'achievement_id',
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
export type Guide_Achivement_Var_Pop_Fields = {
  __typename?: 'guide_achivement_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "guide_achivement" */
export type Guide_Achivement_Var_Pop_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Guide_Achivement_Var_Samp_Fields = {
  __typename?: 'guide_achivement_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "guide_achivement" */
export type Guide_Achivement_Var_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Guide_Achivement_Variance_Fields = {
  __typename?: 'guide_achivement_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "guide_achivement" */
export type Guide_Achivement_Variance_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** columns and relationships of "guide_input" */
export type Guide_Input = {
  __typename?: 'guide_input';
  /** An object relationship */
  campaign: Campaign;
  campaign_id: Scalars['Int'];
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
  payload?: Maybe<Scalars['jsonb']>;
  scenario?: Maybe<Scalars['String']>;
  step: Scalars['String'];
};


/** columns and relationships of "guide_input" */
export type Guide_InputPayloadArgs = {
  path?: Maybe<Scalars['String']>;
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
  count?: Maybe<Scalars['Int']>;
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
  columns?: Maybe<Array<Guide_Input_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "guide_input" */
export type Guide_Input_Aggregate_Order_By = {
  avg?: Maybe<Guide_Input_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Guide_Input_Max_Order_By>;
  min?: Maybe<Guide_Input_Min_Order_By>;
  stddev?: Maybe<Guide_Input_Stddev_Order_By>;
  stddev_pop?: Maybe<Guide_Input_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Guide_Input_Stddev_Samp_Order_By>;
  sum?: Maybe<Guide_Input_Sum_Order_By>;
  var_pop?: Maybe<Guide_Input_Var_Pop_Order_By>;
  var_samp?: Maybe<Guide_Input_Var_Samp_Order_By>;
  variance?: Maybe<Guide_Input_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Guide_Input_Append_Input = {
  payload?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "guide_input" */
export type Guide_Input_Arr_Rel_Insert_Input = {
  data: Array<Guide_Input_Insert_Input>;
  on_conflict?: Maybe<Guide_Input_On_Conflict>;
};

/** aggregate avg on columns */
export type Guide_Input_Avg_Fields = {
  __typename?: 'guide_input_avg_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "guide_input" */
export type Guide_Input_Avg_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "guide_input". All fields are combined with a logical 'AND'. */
export type Guide_Input_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Guide_Input_Bool_Exp>>>;
  _not?: Maybe<Guide_Input_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Guide_Input_Bool_Exp>>>;
  campaign?: Maybe<Campaign_Bool_Exp>;
  campaign_id?: Maybe<Int_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  payload?: Maybe<Jsonb_Comparison_Exp>;
  scenario?: Maybe<String_Comparison_Exp>;
  step?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "guide_input" */
export enum Guide_Input_Constraint {
  /** unique or primary key constraint */
  CampaignGuideInputCampaignGuideIdScenarioStepKey = 'campaign_guide_input_campaign_guide_id_scenario_step_key',
  /** unique or primary key constraint */
  CampaignGuideInputPkey = 'campaign_guide_input_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Guide_Input_Delete_At_Path_Input = {
  payload?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Guide_Input_Delete_Elem_Input = {
  payload?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Guide_Input_Delete_Key_Input = {
  payload?: Maybe<Scalars['String']>;
};

/** input type for incrementing integer column in table "guide_input" */
export type Guide_Input_Inc_Input = {
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "guide_input" */
export type Guide_Input_Insert_Input = {
  campaign?: Maybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  payload?: Maybe<Scalars['jsonb']>;
  scenario?: Maybe<Scalars['String']>;
  step?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Guide_Input_Max_Fields = {
  __typename?: 'guide_input_max_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  scenario?: Maybe<Scalars['String']>;
  step?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "guide_input" */
export type Guide_Input_Max_Order_By = {
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  scenario?: Maybe<Order_By>;
  step?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Guide_Input_Min_Fields = {
  __typename?: 'guide_input_min_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  scenario?: Maybe<Scalars['String']>;
  step?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "guide_input" */
export type Guide_Input_Min_Order_By = {
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  scenario?: Maybe<Order_By>;
  step?: Maybe<Order_By>;
};

/** response of any mutation on the table "guide_input" */
export type Guide_Input_Mutation_Response = {
  __typename?: 'guide_input_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Guide_Input>;
};

/** input type for inserting object relation for remote table "guide_input" */
export type Guide_Input_Obj_Rel_Insert_Input = {
  data: Guide_Input_Insert_Input;
  on_conflict?: Maybe<Guide_Input_On_Conflict>;
};

/** on conflict condition type for table "guide_input" */
export type Guide_Input_On_Conflict = {
  constraint: Guide_Input_Constraint;
  update_columns: Array<Guide_Input_Update_Column>;
  where?: Maybe<Guide_Input_Bool_Exp>;
};

/** ordering options when selecting data from "guide_input" */
export type Guide_Input_Order_By = {
  campaign?: Maybe<Campaign_Order_By>;
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  payload?: Maybe<Order_By>;
  scenario?: Maybe<Order_By>;
  step?: Maybe<Order_By>;
};

/** primary key columns input for table: "guide_input" */
export type Guide_Input_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Guide_Input_Prepend_Input = {
  payload?: Maybe<Scalars['jsonb']>;
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
  Step = 'step'
}

/** input type for updating data in table "guide_input" */
export type Guide_Input_Set_Input = {
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  payload?: Maybe<Scalars['jsonb']>;
  scenario?: Maybe<Scalars['String']>;
  step?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Guide_Input_Stddev_Fields = {
  __typename?: 'guide_input_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "guide_input" */
export type Guide_Input_Stddev_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Guide_Input_Stddev_Pop_Fields = {
  __typename?: 'guide_input_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "guide_input" */
export type Guide_Input_Stddev_Pop_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Guide_Input_Stddev_Samp_Fields = {
  __typename?: 'guide_input_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "guide_input" */
export type Guide_Input_Stddev_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Guide_Input_Sum_Fields = {
  __typename?: 'guide_input_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "guide_input" */
export type Guide_Input_Sum_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
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
  Step = 'step'
}

/** aggregate var_pop on columns */
export type Guide_Input_Var_Pop_Fields = {
  __typename?: 'guide_input_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "guide_input" */
export type Guide_Input_Var_Pop_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Guide_Input_Var_Samp_Fields = {
  __typename?: 'guide_input_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "guide_input" */
export type Guide_Input_Var_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Guide_Input_Variance_Fields = {
  __typename?: 'guide_input_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "guide_input" */
export type Guide_Input_Variance_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** columns and relationships of "investigator_data" */
export type Investigator_Data = {
  __typename?: 'investigator_data';
  addedCards?: Maybe<Scalars['jsonb']>;
  availableXp?: Maybe<Scalars['Int']>;
  /** An object relationship */
  campaign_data: Campaign;
  campaign_id: Scalars['Int'];
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
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
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataIgnoreStoryAssetsArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataRemovedCardsArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataSpecialXpArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "investigator_data" */
export type Investigator_DataStoryAssetsArgs = {
  path?: Maybe<Scalars['String']>;
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
  count?: Maybe<Scalars['Int']>;
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
  columns?: Maybe<Array<Investigator_Data_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "investigator_data" */
export type Investigator_Data_Aggregate_Order_By = {
  avg?: Maybe<Investigator_Data_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Investigator_Data_Max_Order_By>;
  min?: Maybe<Investigator_Data_Min_Order_By>;
  stddev?: Maybe<Investigator_Data_Stddev_Order_By>;
  stddev_pop?: Maybe<Investigator_Data_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Investigator_Data_Stddev_Samp_Order_By>;
  sum?: Maybe<Investigator_Data_Sum_Order_By>;
  var_pop?: Maybe<Investigator_Data_Var_Pop_Order_By>;
  var_samp?: Maybe<Investigator_Data_Var_Samp_Order_By>;
  variance?: Maybe<Investigator_Data_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Investigator_Data_Append_Input = {
  addedCards?: Maybe<Scalars['jsonb']>;
  ignoreStoryAssets?: Maybe<Scalars['jsonb']>;
  removedCards?: Maybe<Scalars['jsonb']>;
  specialXp?: Maybe<Scalars['jsonb']>;
  storyAssets?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "investigator_data" */
export type Investigator_Data_Arr_Rel_Insert_Input = {
  data: Array<Investigator_Data_Insert_Input>;
  on_conflict?: Maybe<Investigator_Data_On_Conflict>;
};

/** aggregate avg on columns */
export type Investigator_Data_Avg_Fields = {
  __typename?: 'investigator_data_avg_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "investigator_data" */
export type Investigator_Data_Avg_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "investigator_data". All fields are combined with a logical 'AND'. */
export type Investigator_Data_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Investigator_Data_Bool_Exp>>>;
  _not?: Maybe<Investigator_Data_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Investigator_Data_Bool_Exp>>>;
  addedCards?: Maybe<Jsonb_Comparison_Exp>;
  availableXp?: Maybe<Int_Comparison_Exp>;
  campaign_data?: Maybe<Campaign_Bool_Exp>;
  campaign_id?: Maybe<Int_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  ignoreStoryAssets?: Maybe<Jsonb_Comparison_Exp>;
  insane?: Maybe<Boolean_Comparison_Exp>;
  investigator?: Maybe<String_Comparison_Exp>;
  killed?: Maybe<Boolean_Comparison_Exp>;
  mental?: Maybe<Int_Comparison_Exp>;
  physical?: Maybe<Int_Comparison_Exp>;
  removedCards?: Maybe<Jsonb_Comparison_Exp>;
  specialXp?: Maybe<Jsonb_Comparison_Exp>;
  spentXp?: Maybe<Int_Comparison_Exp>;
  storyAssets?: Maybe<Jsonb_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "investigator_data" */
export enum Investigator_Data_Constraint {
  /** unique or primary key constraint */
  InvestigatorDataPkey = 'investigator_data_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Investigator_Data_Delete_At_Path_Input = {
  addedCards?: Maybe<Array<Maybe<Scalars['String']>>>;
  ignoreStoryAssets?: Maybe<Array<Maybe<Scalars['String']>>>;
  removedCards?: Maybe<Array<Maybe<Scalars['String']>>>;
  specialXp?: Maybe<Array<Maybe<Scalars['String']>>>;
  storyAssets?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Investigator_Data_Delete_Elem_Input = {
  addedCards?: Maybe<Scalars['Int']>;
  ignoreStoryAssets?: Maybe<Scalars['Int']>;
  removedCards?: Maybe<Scalars['Int']>;
  specialXp?: Maybe<Scalars['Int']>;
  storyAssets?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Investigator_Data_Delete_Key_Input = {
  addedCards?: Maybe<Scalars['String']>;
  ignoreStoryAssets?: Maybe<Scalars['String']>;
  removedCards?: Maybe<Scalars['String']>;
  specialXp?: Maybe<Scalars['String']>;
  storyAssets?: Maybe<Scalars['String']>;
};

/** input type for incrementing integer column in table "investigator_data" */
export type Investigator_Data_Inc_Input = {
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  spentXp?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "investigator_data" */
export type Investigator_Data_Insert_Input = {
  addedCards?: Maybe<Scalars['jsonb']>;
  availableXp?: Maybe<Scalars['Int']>;
  campaign_data?: Maybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  ignoreStoryAssets?: Maybe<Scalars['jsonb']>;
  insane?: Maybe<Scalars['Boolean']>;
  investigator?: Maybe<Scalars['String']>;
  killed?: Maybe<Scalars['Boolean']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  removedCards?: Maybe<Scalars['jsonb']>;
  specialXp?: Maybe<Scalars['jsonb']>;
  spentXp?: Maybe<Scalars['Int']>;
  storyAssets?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Investigator_Data_Max_Fields = {
  __typename?: 'investigator_data_max_fields';
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  investigator?: Maybe<Scalars['String']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  spentXp?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "investigator_data" */
export type Investigator_Data_Max_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  investigator?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Investigator_Data_Min_Fields = {
  __typename?: 'investigator_data_min_fields';
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  investigator?: Maybe<Scalars['String']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  spentXp?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "investigator_data" */
export type Investigator_Data_Min_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  investigator?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "investigator_data" */
export type Investigator_Data_Mutation_Response = {
  __typename?: 'investigator_data_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Investigator_Data>;
};

/** input type for inserting object relation for remote table "investigator_data" */
export type Investigator_Data_Obj_Rel_Insert_Input = {
  data: Investigator_Data_Insert_Input;
  on_conflict?: Maybe<Investigator_Data_On_Conflict>;
};

/** on conflict condition type for table "investigator_data" */
export type Investigator_Data_On_Conflict = {
  constraint: Investigator_Data_Constraint;
  update_columns: Array<Investigator_Data_Update_Column>;
  where?: Maybe<Investigator_Data_Bool_Exp>;
};

/** ordering options when selecting data from "investigator_data" */
export type Investigator_Data_Order_By = {
  addedCards?: Maybe<Order_By>;
  availableXp?: Maybe<Order_By>;
  campaign_data?: Maybe<Campaign_Order_By>;
  campaign_id?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  ignoreStoryAssets?: Maybe<Order_By>;
  insane?: Maybe<Order_By>;
  investigator?: Maybe<Order_By>;
  killed?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  removedCards?: Maybe<Order_By>;
  specialXp?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
  storyAssets?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "investigator_data" */
export type Investigator_Data_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Investigator_Data_Prepend_Input = {
  addedCards?: Maybe<Scalars['jsonb']>;
  ignoreStoryAssets?: Maybe<Scalars['jsonb']>;
  removedCards?: Maybe<Scalars['jsonb']>;
  specialXp?: Maybe<Scalars['jsonb']>;
  storyAssets?: Maybe<Scalars['jsonb']>;
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
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
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
  addedCards?: Maybe<Scalars['jsonb']>;
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  ignoreStoryAssets?: Maybe<Scalars['jsonb']>;
  insane?: Maybe<Scalars['Boolean']>;
  investigator?: Maybe<Scalars['String']>;
  killed?: Maybe<Scalars['Boolean']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  removedCards?: Maybe<Scalars['jsonb']>;
  specialXp?: Maybe<Scalars['jsonb']>;
  spentXp?: Maybe<Scalars['Int']>;
  storyAssets?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Investigator_Data_Stddev_Fields = {
  __typename?: 'investigator_data_stddev_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "investigator_data" */
export type Investigator_Data_Stddev_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Investigator_Data_Stddev_Pop_Fields = {
  __typename?: 'investigator_data_stddev_pop_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "investigator_data" */
export type Investigator_Data_Stddev_Pop_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Investigator_Data_Stddev_Samp_Fields = {
  __typename?: 'investigator_data_stddev_samp_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "investigator_data" */
export type Investigator_Data_Stddev_Samp_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Investigator_Data_Sum_Fields = {
  __typename?: 'investigator_data_sum_fields';
  availableXp?: Maybe<Scalars['Int']>;
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  mental?: Maybe<Scalars['Int']>;
  physical?: Maybe<Scalars['Int']>;
  spentXp?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "investigator_data" */
export type Investigator_Data_Sum_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
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
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
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
  id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "investigator_data" */
export type Investigator_Data_Var_Pop_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Investigator_Data_Var_Samp_Fields = {
  __typename?: 'investigator_data_var_samp_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "investigator_data" */
export type Investigator_Data_Var_Samp_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Investigator_Data_Variance_Fields = {
  __typename?: 'investigator_data_variance_fields';
  availableXp?: Maybe<Scalars['Float']>;
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  mental?: Maybe<Scalars['Float']>;
  physical?: Maybe<Scalars['Float']>;
  spentXp?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "investigator_data" */
export type Investigator_Data_Variance_Order_By = {
  availableXp?: Maybe<Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mental?: Maybe<Order_By>;
  physical?: Maybe<Order_By>;
  spentXp?: Maybe<Order_By>;
};


/** expression to compare columns of type jsonb. All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: Maybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: Maybe<Scalars['jsonb']>;
  _eq?: Maybe<Scalars['jsonb']>;
  _gt?: Maybe<Scalars['jsonb']>;
  _gte?: Maybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: Maybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Maybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Maybe<Array<Scalars['String']>>;
  _in?: Maybe<Array<Scalars['jsonb']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['jsonb']>;
  _lte?: Maybe<Scalars['jsonb']>;
  _neq?: Maybe<Scalars['jsonb']>;
  _nin?: Maybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "campaign" */
  delete_campaign?: Maybe<Campaign_Mutation_Response>;
  /** delete data from the table: "campaign_access" */
  delete_campaign_access?: Maybe<Campaign_Access_Mutation_Response>;
  /** delete single row from the table: "campaign_access" */
  delete_campaign_access_by_pk?: Maybe<Campaign_Access>;
  /** delete single row from the table: "campaign" */
  delete_campaign_by_pk?: Maybe<Campaign>;
  /** delete data from the table: "friend_status" */
  delete_friend_status?: Maybe<Friend_Status_Mutation_Response>;
  /** delete single row from the table: "friend_status" */
  delete_friend_status_by_pk?: Maybe<Friend_Status>;
  /** delete data from the table: "guide_achivement" */
  delete_guide_achivement?: Maybe<Guide_Achivement_Mutation_Response>;
  /** delete single row from the table: "guide_achivement" */
  delete_guide_achivement_by_pk?: Maybe<Guide_Achivement>;
  /** delete data from the table: "guide_input" */
  delete_guide_input?: Maybe<Guide_Input_Mutation_Response>;
  /** delete single row from the table: "guide_input" */
  delete_guide_input_by_pk?: Maybe<Guide_Input>;
  /** delete data from the table: "investigator_data" */
  delete_investigator_data?: Maybe<Investigator_Data_Mutation_Response>;
  /** delete single row from the table: "investigator_data" */
  delete_investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** delete data from the table: "user_campaigns" */
  delete_user_campaigns?: Maybe<User_Campaigns_Mutation_Response>;
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
  /** insert data into the table: "campaign" */
  insert_campaign?: Maybe<Campaign_Mutation_Response>;
  /** insert data into the table: "campaign_access" */
  insert_campaign_access?: Maybe<Campaign_Access_Mutation_Response>;
  /** insert a single row into the table: "campaign_access" */
  insert_campaign_access_one?: Maybe<Campaign_Access>;
  /** insert a single row into the table: "campaign" */
  insert_campaign_one?: Maybe<Campaign>;
  /** insert data into the table: "friend_status" */
  insert_friend_status?: Maybe<Friend_Status_Mutation_Response>;
  /** insert a single row into the table: "friend_status" */
  insert_friend_status_one?: Maybe<Friend_Status>;
  /** insert data into the table: "guide_achivement" */
  insert_guide_achivement?: Maybe<Guide_Achivement_Mutation_Response>;
  /** insert a single row into the table: "guide_achivement" */
  insert_guide_achivement_one?: Maybe<Guide_Achivement>;
  /** insert data into the table: "guide_input" */
  insert_guide_input?: Maybe<Guide_Input_Mutation_Response>;
  /** insert a single row into the table: "guide_input" */
  insert_guide_input_one?: Maybe<Guide_Input>;
  /** insert data into the table: "investigator_data" */
  insert_investigator_data?: Maybe<Investigator_Data_Mutation_Response>;
  /** insert a single row into the table: "investigator_data" */
  insert_investigator_data_one?: Maybe<Investigator_Data>;
  /** insert data into the table: "user_campaigns" */
  insert_user_campaigns?: Maybe<User_Campaigns_Mutation_Response>;
  /** insert a single row into the table: "user_campaigns" */
  insert_user_campaigns_one?: Maybe<User_Campaigns>;
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
  /** update data of the table: "campaign" */
  update_campaign?: Maybe<Campaign_Mutation_Response>;
  /** update data of the table: "campaign_access" */
  update_campaign_access?: Maybe<Campaign_Access_Mutation_Response>;
  /** update single row of the table: "campaign_access" */
  update_campaign_access_by_pk?: Maybe<Campaign_Access>;
  /** update single row of the table: "campaign" */
  update_campaign_by_pk?: Maybe<Campaign>;
  /** update data of the table: "friend_status" */
  update_friend_status?: Maybe<Friend_Status_Mutation_Response>;
  /** update single row of the table: "friend_status" */
  update_friend_status_by_pk?: Maybe<Friend_Status>;
  /** update data of the table: "guide_achivement" */
  update_guide_achivement?: Maybe<Guide_Achivement_Mutation_Response>;
  /** update single row of the table: "guide_achivement" */
  update_guide_achivement_by_pk?: Maybe<Guide_Achivement>;
  /** update data of the table: "guide_input" */
  update_guide_input?: Maybe<Guide_Input_Mutation_Response>;
  /** update single row of the table: "guide_input" */
  update_guide_input_by_pk?: Maybe<Guide_Input>;
  /** update data of the table: "investigator_data" */
  update_investigator_data?: Maybe<Investigator_Data_Mutation_Response>;
  /** update single row of the table: "investigator_data" */
  update_investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** update data of the table: "user_campaigns" */
  update_user_campaigns?: Maybe<User_Campaigns_Mutation_Response>;
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
export type Mutation_RootDelete_Friend_StatusArgs = {
  where: Friend_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Friend_Status_By_PkArgs = {
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Guide_AchivementArgs = {
  where: Guide_Achivement_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Guide_Achivement_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Guide_InputArgs = {
  where: Guide_Input_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Guide_Input_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Investigator_DataArgs = {
  where: Investigator_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Investigator_Data_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_User_CampaignsArgs = {
  where: User_Campaigns_Bool_Exp;
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
export type Mutation_RootInsert_CampaignArgs = {
  objects: Array<Campaign_Insert_Input>;
  on_conflict?: Maybe<Campaign_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_AccessArgs = {
  objects: Array<Campaign_Access_Insert_Input>;
  on_conflict?: Maybe<Campaign_Access_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_Access_OneArgs = {
  object: Campaign_Access_Insert_Input;
  on_conflict?: Maybe<Campaign_Access_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Campaign_OneArgs = {
  object: Campaign_Insert_Input;
  on_conflict?: Maybe<Campaign_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Friend_StatusArgs = {
  objects: Array<Friend_Status_Insert_Input>;
  on_conflict?: Maybe<Friend_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Friend_Status_OneArgs = {
  object: Friend_Status_Insert_Input;
  on_conflict?: Maybe<Friend_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_AchivementArgs = {
  objects: Array<Guide_Achivement_Insert_Input>;
  on_conflict?: Maybe<Guide_Achivement_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_Achivement_OneArgs = {
  object: Guide_Achivement_Insert_Input;
  on_conflict?: Maybe<Guide_Achivement_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_InputArgs = {
  objects: Array<Guide_Input_Insert_Input>;
  on_conflict?: Maybe<Guide_Input_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Guide_Input_OneArgs = {
  object: Guide_Input_Insert_Input;
  on_conflict?: Maybe<Guide_Input_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Investigator_DataArgs = {
  objects: Array<Investigator_Data_Insert_Input>;
  on_conflict?: Maybe<Investigator_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Investigator_Data_OneArgs = {
  object: Investigator_Data_Insert_Input;
  on_conflict?: Maybe<Investigator_Data_On_Conflict>;
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
  on_conflict?: Maybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: Maybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_CampaignArgs = {
  _append?: Maybe<Campaign_Append_Input>;
  _delete_at_path?: Maybe<Campaign_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Campaign_Delete_Elem_Input>;
  _delete_key?: Maybe<Campaign_Delete_Key_Input>;
  _inc?: Maybe<Campaign_Inc_Input>;
  _prepend?: Maybe<Campaign_Prepend_Input>;
  _set?: Maybe<Campaign_Set_Input>;
  where: Campaign_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_AccessArgs = {
  _inc?: Maybe<Campaign_Access_Inc_Input>;
  _set?: Maybe<Campaign_Access_Set_Input>;
  where: Campaign_Access_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_Access_By_PkArgs = {
  _inc?: Maybe<Campaign_Access_Inc_Input>;
  _set?: Maybe<Campaign_Access_Set_Input>;
  pk_columns: Campaign_Access_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Campaign_By_PkArgs = {
  _append?: Maybe<Campaign_Append_Input>;
  _delete_at_path?: Maybe<Campaign_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Campaign_Delete_Elem_Input>;
  _delete_key?: Maybe<Campaign_Delete_Key_Input>;
  _inc?: Maybe<Campaign_Inc_Input>;
  _prepend?: Maybe<Campaign_Prepend_Input>;
  _set?: Maybe<Campaign_Set_Input>;
  pk_columns: Campaign_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Friend_StatusArgs = {
  _set?: Maybe<Friend_Status_Set_Input>;
  where: Friend_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Friend_Status_By_PkArgs = {
  _set?: Maybe<Friend_Status_Set_Input>;
  pk_columns: Friend_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_AchivementArgs = {
  _inc?: Maybe<Guide_Achivement_Inc_Input>;
  _set?: Maybe<Guide_Achivement_Set_Input>;
  where: Guide_Achivement_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_Achivement_By_PkArgs = {
  _inc?: Maybe<Guide_Achivement_Inc_Input>;
  _set?: Maybe<Guide_Achivement_Set_Input>;
  pk_columns: Guide_Achivement_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_InputArgs = {
  _append?: Maybe<Guide_Input_Append_Input>;
  _delete_at_path?: Maybe<Guide_Input_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Guide_Input_Delete_Elem_Input>;
  _delete_key?: Maybe<Guide_Input_Delete_Key_Input>;
  _inc?: Maybe<Guide_Input_Inc_Input>;
  _prepend?: Maybe<Guide_Input_Prepend_Input>;
  _set?: Maybe<Guide_Input_Set_Input>;
  where: Guide_Input_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Guide_Input_By_PkArgs = {
  _append?: Maybe<Guide_Input_Append_Input>;
  _delete_at_path?: Maybe<Guide_Input_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Guide_Input_Delete_Elem_Input>;
  _delete_key?: Maybe<Guide_Input_Delete_Key_Input>;
  _inc?: Maybe<Guide_Input_Inc_Input>;
  _prepend?: Maybe<Guide_Input_Prepend_Input>;
  _set?: Maybe<Guide_Input_Set_Input>;
  pk_columns: Guide_Input_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Investigator_DataArgs = {
  _append?: Maybe<Investigator_Data_Append_Input>;
  _delete_at_path?: Maybe<Investigator_Data_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Investigator_Data_Delete_Elem_Input>;
  _delete_key?: Maybe<Investigator_Data_Delete_Key_Input>;
  _inc?: Maybe<Investigator_Data_Inc_Input>;
  _prepend?: Maybe<Investigator_Data_Prepend_Input>;
  _set?: Maybe<Investigator_Data_Set_Input>;
  where: Investigator_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Investigator_Data_By_PkArgs = {
  _append?: Maybe<Investigator_Data_Append_Input>;
  _delete_at_path?: Maybe<Investigator_Data_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Investigator_Data_Delete_Elem_Input>;
  _delete_key?: Maybe<Investigator_Data_Delete_Key_Input>;
  _inc?: Maybe<Investigator_Data_Inc_Input>;
  _prepend?: Maybe<Investigator_Data_Prepend_Input>;
  _set?: Maybe<Investigator_Data_Set_Input>;
  pk_columns: Investigator_Data_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_CampaignsArgs = {
  _inc?: Maybe<User_Campaigns_Inc_Input>;
  _set?: Maybe<User_Campaigns_Set_Input>;
  where: User_Campaigns_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_FriendsArgs = {
  _set?: Maybe<User_Friends_Set_Input>;
  where: User_Friends_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Received_Friend_RequestsArgs = {
  _set?: Maybe<User_Received_Friend_Requests_Set_Input>;
  where: User_Received_Friend_Requests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Sent_Friend_RequestsArgs = {
  _set?: Maybe<User_Sent_Friend_Requests_Set_Input>;
  where: User_Sent_Friend_Requests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: Maybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: Maybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** query root */
export type Query_Root = {
  __typename?: 'query_root';
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
  /** fetch data from the table: "friend_status" */
  friend_status: Array<Friend_Status>;
  /** fetch aggregated fields from the table: "friend_status" */
  friend_status_aggregate: Friend_Status_Aggregate;
  /** fetch data from the table: "friend_status" using primary key columns */
  friend_status_by_pk?: Maybe<Friend_Status>;
  /** fetch data from the table: "guide_achivement" */
  guide_achivement: Array<Guide_Achivement>;
  /** fetch aggregated fields from the table: "guide_achivement" */
  guide_achivement_aggregate: Guide_Achivement_Aggregate;
  /** fetch data from the table: "guide_achivement" using primary key columns */
  guide_achivement_by_pk?: Maybe<Guide_Achivement>;
  /** fetch data from the table: "guide_input" */
  guide_input: Array<Guide_Input>;
  /** fetch aggregated fields from the table: "guide_input" */
  guide_input_aggregate: Guide_Input_Aggregate;
  /** fetch data from the table: "guide_input" using primary key columns */
  guide_input_by_pk?: Maybe<Guide_Input>;
  /** fetch data from the table: "investigator_data" */
  investigator_data: Array<Investigator_Data>;
  /** fetch aggregated fields from the table: "investigator_data" */
  investigator_data_aggregate: Investigator_Data_Aggregate;
  /** fetch data from the table: "investigator_data" using primary key columns */
  investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** fetch data from the table: "user_campaigns" */
  user_campaigns: Array<User_Campaigns>;
  /** fetch aggregated fields from the table: "user_campaigns" */
  user_campaigns_aggregate: User_Campaigns_Aggregate;
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


/** query root */
export type Query_RootCampaignArgs = {
  distinct_on?: Maybe<Array<Campaign_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Order_By>>;
  where?: Maybe<Campaign_Bool_Exp>;
};


/** query root */
export type Query_RootCampaign_AccessArgs = {
  distinct_on?: Maybe<Array<Campaign_Access_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Access_Order_By>>;
  where?: Maybe<Campaign_Access_Bool_Exp>;
};


/** query root */
export type Query_RootCampaign_Access_AggregateArgs = {
  distinct_on?: Maybe<Array<Campaign_Access_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Access_Order_By>>;
  where?: Maybe<Campaign_Access_Bool_Exp>;
};


/** query root */
export type Query_RootCampaign_Access_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootCampaign_AggregateArgs = {
  distinct_on?: Maybe<Array<Campaign_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Order_By>>;
  where?: Maybe<Campaign_Bool_Exp>;
};


/** query root */
export type Query_RootCampaign_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootFriend_StatusArgs = {
  distinct_on?: Maybe<Array<Friend_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Friend_Status_Order_By>>;
  where?: Maybe<Friend_Status_Bool_Exp>;
};


/** query root */
export type Query_RootFriend_Status_AggregateArgs = {
  distinct_on?: Maybe<Array<Friend_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Friend_Status_Order_By>>;
  where?: Maybe<Friend_Status_Bool_Exp>;
};


/** query root */
export type Query_RootFriend_Status_By_PkArgs = {
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};


/** query root */
export type Query_RootGuide_AchivementArgs = {
  distinct_on?: Maybe<Array<Guide_Achivement_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Achivement_Order_By>>;
  where?: Maybe<Guide_Achivement_Bool_Exp>;
};


/** query root */
export type Query_RootGuide_Achivement_AggregateArgs = {
  distinct_on?: Maybe<Array<Guide_Achivement_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Achivement_Order_By>>;
  where?: Maybe<Guide_Achivement_Bool_Exp>;
};


/** query root */
export type Query_RootGuide_Achivement_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootGuide_InputArgs = {
  distinct_on?: Maybe<Array<Guide_Input_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Input_Order_By>>;
  where?: Maybe<Guide_Input_Bool_Exp>;
};


/** query root */
export type Query_RootGuide_Input_AggregateArgs = {
  distinct_on?: Maybe<Array<Guide_Input_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Input_Order_By>>;
  where?: Maybe<Guide_Input_Bool_Exp>;
};


/** query root */
export type Query_RootGuide_Input_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootInvestigator_DataArgs = {
  distinct_on?: Maybe<Array<Investigator_Data_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Investigator_Data_Order_By>>;
  where?: Maybe<Investigator_Data_Bool_Exp>;
};


/** query root */
export type Query_RootInvestigator_Data_AggregateArgs = {
  distinct_on?: Maybe<Array<Investigator_Data_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Investigator_Data_Order_By>>;
  where?: Maybe<Investigator_Data_Bool_Exp>;
};


/** query root */
export type Query_RootInvestigator_Data_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootUser_CampaignsArgs = {
  distinct_on?: Maybe<Array<User_Campaigns_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Campaigns_Order_By>>;
  where?: Maybe<User_Campaigns_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Campaigns_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Campaigns_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Campaigns_Order_By>>;
  where?: Maybe<User_Campaigns_Bool_Exp>;
};


/** query root */
export type Query_RootUser_FriendsArgs = {
  distinct_on?: Maybe<Array<User_Friends_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Friends_Order_By>>;
  where?: Maybe<User_Friends_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Friends_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Friends_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Friends_Order_By>>;
  where?: Maybe<User_Friends_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Received_Friend_RequestsArgs = {
  distinct_on?: Maybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Received_Friend_Requests_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Sent_Friend_RequestsArgs = {
  distinct_on?: Maybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Sent_Friend_Requests_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
};


/** query root */
export type Query_RootUsersArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** query root */
export type Query_RootUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** query root */
export type Query_RootUsers_By_PkArgs = {
  id: Scalars['String'];
};

/** subscription root */
export type Subscription_Root = {
  __typename?: 'subscription_root';
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
  /** fetch data from the table: "friend_status" */
  friend_status: Array<Friend_Status>;
  /** fetch aggregated fields from the table: "friend_status" */
  friend_status_aggregate: Friend_Status_Aggregate;
  /** fetch data from the table: "friend_status" using primary key columns */
  friend_status_by_pk?: Maybe<Friend_Status>;
  /** fetch data from the table: "guide_achivement" */
  guide_achivement: Array<Guide_Achivement>;
  /** fetch aggregated fields from the table: "guide_achivement" */
  guide_achivement_aggregate: Guide_Achivement_Aggregate;
  /** fetch data from the table: "guide_achivement" using primary key columns */
  guide_achivement_by_pk?: Maybe<Guide_Achivement>;
  /** fetch data from the table: "guide_input" */
  guide_input: Array<Guide_Input>;
  /** fetch aggregated fields from the table: "guide_input" */
  guide_input_aggregate: Guide_Input_Aggregate;
  /** fetch data from the table: "guide_input" using primary key columns */
  guide_input_by_pk?: Maybe<Guide_Input>;
  /** fetch data from the table: "investigator_data" */
  investigator_data: Array<Investigator_Data>;
  /** fetch aggregated fields from the table: "investigator_data" */
  investigator_data_aggregate: Investigator_Data_Aggregate;
  /** fetch data from the table: "investigator_data" using primary key columns */
  investigator_data_by_pk?: Maybe<Investigator_Data>;
  /** fetch data from the table: "user_campaigns" */
  user_campaigns: Array<User_Campaigns>;
  /** fetch aggregated fields from the table: "user_campaigns" */
  user_campaigns_aggregate: User_Campaigns_Aggregate;
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


/** subscription root */
export type Subscription_RootCampaignArgs = {
  distinct_on?: Maybe<Array<Campaign_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Order_By>>;
  where?: Maybe<Campaign_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCampaign_AccessArgs = {
  distinct_on?: Maybe<Array<Campaign_Access_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Access_Order_By>>;
  where?: Maybe<Campaign_Access_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCampaign_Access_AggregateArgs = {
  distinct_on?: Maybe<Array<Campaign_Access_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Access_Order_By>>;
  where?: Maybe<Campaign_Access_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCampaign_Access_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootCampaign_AggregateArgs = {
  distinct_on?: Maybe<Array<Campaign_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Campaign_Order_By>>;
  where?: Maybe<Campaign_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCampaign_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootFriend_StatusArgs = {
  distinct_on?: Maybe<Array<Friend_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Friend_Status_Order_By>>;
  where?: Maybe<Friend_Status_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootFriend_Status_AggregateArgs = {
  distinct_on?: Maybe<Array<Friend_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Friend_Status_Order_By>>;
  where?: Maybe<Friend_Status_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootFriend_Status_By_PkArgs = {
  user_id_a: Scalars['String'];
  user_id_b: Scalars['String'];
};


/** subscription root */
export type Subscription_RootGuide_AchivementArgs = {
  distinct_on?: Maybe<Array<Guide_Achivement_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Achivement_Order_By>>;
  where?: Maybe<Guide_Achivement_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootGuide_Achivement_AggregateArgs = {
  distinct_on?: Maybe<Array<Guide_Achivement_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Achivement_Order_By>>;
  where?: Maybe<Guide_Achivement_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootGuide_Achivement_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootGuide_InputArgs = {
  distinct_on?: Maybe<Array<Guide_Input_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Input_Order_By>>;
  where?: Maybe<Guide_Input_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootGuide_Input_AggregateArgs = {
  distinct_on?: Maybe<Array<Guide_Input_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Guide_Input_Order_By>>;
  where?: Maybe<Guide_Input_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootGuide_Input_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootInvestigator_DataArgs = {
  distinct_on?: Maybe<Array<Investigator_Data_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Investigator_Data_Order_By>>;
  where?: Maybe<Investigator_Data_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvestigator_Data_AggregateArgs = {
  distinct_on?: Maybe<Array<Investigator_Data_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Investigator_Data_Order_By>>;
  where?: Maybe<Investigator_Data_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvestigator_Data_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootUser_CampaignsArgs = {
  distinct_on?: Maybe<Array<User_Campaigns_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Campaigns_Order_By>>;
  where?: Maybe<User_Campaigns_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Campaigns_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Campaigns_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Campaigns_Order_By>>;
  where?: Maybe<User_Campaigns_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_FriendsArgs = {
  distinct_on?: Maybe<Array<User_Friends_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Friends_Order_By>>;
  where?: Maybe<User_Friends_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Friends_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Friends_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Friends_Order_By>>;
  where?: Maybe<User_Friends_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Received_Friend_RequestsArgs = {
  distinct_on?: Maybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Received_Friend_Requests_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Sent_Friend_RequestsArgs = {
  distinct_on?: Maybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Sent_Friend_Requests_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsersArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['String'];
};


/** expression to compare columns of type timestamp. All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamp']>;
  _gt?: Maybe<Scalars['timestamp']>;
  _gte?: Maybe<Scalars['timestamp']>;
  _in?: Maybe<Array<Scalars['timestamp']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamp']>;
  _lte?: Maybe<Scalars['timestamp']>;
  _neq?: Maybe<Scalars['timestamp']>;
  _nin?: Maybe<Array<Scalars['timestamp']>>;
};


/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamptz']>;
  _gt?: Maybe<Scalars['timestamptz']>;
  _gte?: Maybe<Scalars['timestamptz']>;
  _in?: Maybe<Array<Scalars['timestamptz']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamptz']>;
  _lte?: Maybe<Scalars['timestamptz']>;
  _neq?: Maybe<Scalars['timestamptz']>;
  _nin?: Maybe<Array<Scalars['timestamptz']>>;
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
  count?: Maybe<Scalars['Int']>;
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
  columns?: Maybe<Array<User_Campaigns_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_campaigns" */
export type User_Campaigns_Aggregate_Order_By = {
  avg?: Maybe<User_Campaigns_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<User_Campaigns_Max_Order_By>;
  min?: Maybe<User_Campaigns_Min_Order_By>;
  stddev?: Maybe<User_Campaigns_Stddev_Order_By>;
  stddev_pop?: Maybe<User_Campaigns_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<User_Campaigns_Stddev_Samp_Order_By>;
  sum?: Maybe<User_Campaigns_Sum_Order_By>;
  var_pop?: Maybe<User_Campaigns_Var_Pop_Order_By>;
  var_samp?: Maybe<User_Campaigns_Var_Samp_Order_By>;
  variance?: Maybe<User_Campaigns_Variance_Order_By>;
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
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "user_campaigns". All fields are combined with a logical 'AND'. */
export type User_Campaigns_Bool_Exp = {
  _and?: Maybe<Array<Maybe<User_Campaigns_Bool_Exp>>>;
  _not?: Maybe<User_Campaigns_Bool_Exp>;
  _or?: Maybe<Array<Maybe<User_Campaigns_Bool_Exp>>>;
  campaign?: Maybe<Campaign_Bool_Exp>;
  campaign_id?: Maybe<Int_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  user_id?: Maybe<String_Comparison_Exp>;
};

/** input type for incrementing integer column in table "user_campaigns" */
export type User_Campaigns_Inc_Input = {
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "user_campaigns" */
export type User_Campaigns_Insert_Input = {
  campaign?: Maybe<Campaign_Obj_Rel_Insert_Input>;
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
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
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
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
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "user_campaigns" */
export type User_Campaigns_Mutation_Response = {
  __typename?: 'user_campaigns_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<User_Campaigns>;
};

/** input type for inserting object relation for remote table "user_campaigns" */
export type User_Campaigns_Obj_Rel_Insert_Input = {
  data: User_Campaigns_Insert_Input;
};

/** ordering options when selecting data from "user_campaigns" */
export type User_Campaigns_Order_By = {
  campaign?: Maybe<Campaign_Order_By>;
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
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
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type User_Campaigns_Stddev_Fields = {
  __typename?: 'user_campaigns_stddev_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "user_campaigns" */
export type User_Campaigns_Stddev_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type User_Campaigns_Stddev_Pop_Fields = {
  __typename?: 'user_campaigns_stddev_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "user_campaigns" */
export type User_Campaigns_Stddev_Pop_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type User_Campaigns_Stddev_Samp_Fields = {
  __typename?: 'user_campaigns_stddev_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "user_campaigns" */
export type User_Campaigns_Stddev_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type User_Campaigns_Sum_Fields = {
  __typename?: 'user_campaigns_sum_fields';
  campaign_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "user_campaigns" */
export type User_Campaigns_Sum_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate var_pop on columns */
export type User_Campaigns_Var_Pop_Fields = {
  __typename?: 'user_campaigns_var_pop_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "user_campaigns" */
export type User_Campaigns_Var_Pop_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type User_Campaigns_Var_Samp_Fields = {
  __typename?: 'user_campaigns_var_samp_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "user_campaigns" */
export type User_Campaigns_Var_Samp_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type User_Campaigns_Variance_Fields = {
  __typename?: 'user_campaigns_variance_fields';
  campaign_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "user_campaigns" */
export type User_Campaigns_Variance_Order_By = {
  campaign_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** columns and relationships of "user_friends" */
export type User_Friends = {
  __typename?: 'user_friends';
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
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<User_Friends_Max_Fields>;
  min?: Maybe<User_Friends_Min_Fields>;
};


/** aggregate fields of "user_friends" */
export type User_Friends_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<User_Friends_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_friends" */
export type User_Friends_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<User_Friends_Max_Order_By>;
  min?: Maybe<User_Friends_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_friends" */
export type User_Friends_Arr_Rel_Insert_Input = {
  data: Array<User_Friends_Insert_Input>;
};

/** Boolean expression to filter rows from the table "user_friends". All fields are combined with a logical 'AND'. */
export type User_Friends_Bool_Exp = {
  _and?: Maybe<Array<Maybe<User_Friends_Bool_Exp>>>;
  _not?: Maybe<User_Friends_Bool_Exp>;
  _or?: Maybe<Array<Maybe<User_Friends_Bool_Exp>>>;
  user?: Maybe<Users_Bool_Exp>;
  user_id_a?: Maybe<String_Comparison_Exp>;
  user_id_b?: Maybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "user_friends" */
export type User_Friends_Insert_Input = {
  user?: Maybe<Users_Obj_Rel_Insert_Input>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Friends_Max_Fields = {
  __typename?: 'user_friends_max_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_friends" */
export type User_Friends_Max_Order_By = {
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type User_Friends_Min_Fields = {
  __typename?: 'user_friends_min_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_friends" */
export type User_Friends_Min_Order_By = {
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** response of any mutation on the table "user_friends" */
export type User_Friends_Mutation_Response = {
  __typename?: 'user_friends_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<User_Friends>;
};

/** input type for inserting object relation for remote table "user_friends" */
export type User_Friends_Obj_Rel_Insert_Input = {
  data: User_Friends_Insert_Input;
};

/** ordering options when selecting data from "user_friends" */
export type User_Friends_Order_By = {
  user?: Maybe<Users_Order_By>;
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** select columns of table "user_friends" */
export enum User_Friends_Select_Column {
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** input type for updating data in table "user_friends" */
export type User_Friends_Set_Input = {
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** columns and relationships of "user_received_friend_requests" */
export type User_Received_Friend_Requests = {
  __typename?: 'user_received_friend_requests';
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
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<User_Received_Friend_Requests_Max_Fields>;
  min?: Maybe<User_Received_Friend_Requests_Min_Fields>;
};


/** aggregate fields of "user_received_friend_requests" */
export type User_Received_Friend_Requests_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<User_Received_Friend_Requests_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<User_Received_Friend_Requests_Max_Order_By>;
  min?: Maybe<User_Received_Friend_Requests_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Arr_Rel_Insert_Input = {
  data: Array<User_Received_Friend_Requests_Insert_Input>;
};

/** Boolean expression to filter rows from the table "user_received_friend_requests". All fields are combined with a logical 'AND'. */
export type User_Received_Friend_Requests_Bool_Exp = {
  _and?: Maybe<Array<Maybe<User_Received_Friend_Requests_Bool_Exp>>>;
  _not?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
  _or?: Maybe<Array<Maybe<User_Received_Friend_Requests_Bool_Exp>>>;
  user?: Maybe<Users_Bool_Exp>;
  user_id_a?: Maybe<String_Comparison_Exp>;
  user_id_b?: Maybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Insert_Input = {
  user?: Maybe<Users_Obj_Rel_Insert_Input>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Received_Friend_Requests_Max_Fields = {
  __typename?: 'user_received_friend_requests_max_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Max_Order_By = {
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type User_Received_Friend_Requests_Min_Fields = {
  __typename?: 'user_received_friend_requests_min_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Min_Order_By = {
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** response of any mutation on the table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Mutation_Response = {
  __typename?: 'user_received_friend_requests_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<User_Received_Friend_Requests>;
};

/** input type for inserting object relation for remote table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Obj_Rel_Insert_Input = {
  data: User_Received_Friend_Requests_Insert_Input;
};

/** ordering options when selecting data from "user_received_friend_requests" */
export type User_Received_Friend_Requests_Order_By = {
  user?: Maybe<Users_Order_By>;
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** select columns of table "user_received_friend_requests" */
export enum User_Received_Friend_Requests_Select_Column {
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** input type for updating data in table "user_received_friend_requests" */
export type User_Received_Friend_Requests_Set_Input = {
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** columns and relationships of "user_sent_friend_requests" */
export type User_Sent_Friend_Requests = {
  __typename?: 'user_sent_friend_requests';
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
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<User_Sent_Friend_Requests_Max_Fields>;
  min?: Maybe<User_Sent_Friend_Requests_Min_Fields>;
};


/** aggregate fields of "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<User_Sent_Friend_Requests_Max_Order_By>;
  min?: Maybe<User_Sent_Friend_Requests_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Arr_Rel_Insert_Input = {
  data: Array<User_Sent_Friend_Requests_Insert_Input>;
};

/** Boolean expression to filter rows from the table "user_sent_friend_requests". All fields are combined with a logical 'AND'. */
export type User_Sent_Friend_Requests_Bool_Exp = {
  _and?: Maybe<Array<Maybe<User_Sent_Friend_Requests_Bool_Exp>>>;
  _not?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
  _or?: Maybe<Array<Maybe<User_Sent_Friend_Requests_Bool_Exp>>>;
  user?: Maybe<Users_Bool_Exp>;
  user_id_a?: Maybe<String_Comparison_Exp>;
  user_id_b?: Maybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Insert_Input = {
  user?: Maybe<Users_Obj_Rel_Insert_Input>;
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Sent_Friend_Requests_Max_Fields = {
  __typename?: 'user_sent_friend_requests_max_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Max_Order_By = {
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type User_Sent_Friend_Requests_Min_Fields = {
  __typename?: 'user_sent_friend_requests_min_fields';
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Min_Order_By = {
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** response of any mutation on the table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Mutation_Response = {
  __typename?: 'user_sent_friend_requests_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<User_Sent_Friend_Requests>;
};

/** input type for inserting object relation for remote table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Obj_Rel_Insert_Input = {
  data: User_Sent_Friend_Requests_Insert_Input;
};

/** ordering options when selecting data from "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Order_By = {
  user?: Maybe<Users_Order_By>;
  user_id_a?: Maybe<Order_By>;
  user_id_b?: Maybe<Order_By>;
};

/** select columns of table "user_sent_friend_requests" */
export enum User_Sent_Friend_Requests_Select_Column {
  /** column name */
  UserIdA = 'user_id_a',
  /** column name */
  UserIdB = 'user_id_b'
}

/** input type for updating data in table "user_sent_friend_requests" */
export type User_Sent_Friend_Requests_Set_Input = {
  user_id_a?: Maybe<Scalars['String']>;
  user_id_b?: Maybe<Scalars['String']>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  friends: Array<User_Friends>;
  /** An aggregated array relationship */
  friends_aggregate: User_Friends_Aggregate;
  handle?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  /** An array relationship */
  received_requests: Array<User_Received_Friend_Requests>;
  /** An aggregated array relationship */
  received_requests_aggregate: User_Received_Friend_Requests_Aggregate;
  /** An array relationship */
  sent_requests: Array<User_Sent_Friend_Requests>;
  /** An aggregated array relationship */
  sent_requests_aggregate: User_Sent_Friend_Requests_Aggregate;
  updated_at: Scalars['timestamp'];
};


/** columns and relationships of "users" */
export type UsersFriendsArgs = {
  distinct_on?: Maybe<Array<User_Friends_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Friends_Order_By>>;
  where?: Maybe<User_Friends_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersFriends_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Friends_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Friends_Order_By>>;
  where?: Maybe<User_Friends_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersReceived_RequestsArgs = {
  distinct_on?: Maybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersReceived_Requests_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Received_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Received_Friend_Requests_Order_By>>;
  where?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersSent_RequestsArgs = {
  distinct_on?: Maybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersSent_Requests_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Sent_Friend_Requests_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Sent_Friend_Requests_Order_By>>;
  where?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
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
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Users_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users" */
export type Users_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Users_Max_Order_By>;
  min?: Maybe<Users_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  on_conflict?: Maybe<Users_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Users_Bool_Exp>>>;
  _not?: Maybe<Users_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Users_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  friends?: Maybe<User_Friends_Bool_Exp>;
  handle?: Maybe<String_Comparison_Exp>;
  id?: Maybe<String_Comparison_Exp>;
  received_requests?: Maybe<User_Received_Friend_Requests_Bool_Exp>;
  sent_requests?: Maybe<User_Sent_Friend_Requests_Bool_Exp>;
  updated_at?: Maybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  friends?: Maybe<User_Friends_Arr_Rel_Insert_Input>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  received_requests?: Maybe<User_Received_Friend_Requests_Arr_Rel_Insert_Input>;
  sent_requests?: Maybe<User_Sent_Friend_Requests_Arr_Rel_Insert_Input>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "users" */
export type Users_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  handle?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "users" */
export type Users_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  handle?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  on_conflict?: Maybe<Users_On_Conflict>;
};

/** on conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns: Array<Users_Update_Column>;
  where?: Maybe<Users_Bool_Exp>;
};

/** ordering options when selecting data from "users" */
export type Users_Order_By = {
  created_at?: Maybe<Order_By>;
  friends_aggregate?: Maybe<User_Friends_Aggregate_Order_By>;
  handle?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  received_requests_aggregate?: Maybe<User_Received_Friend_Requests_Aggregate_Order_By>;
  sent_requests_aggregate?: Maybe<User_Sent_Friend_Requests_Aggregate_Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "users" */
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
  created_at?: Maybe<Scalars['timestamptz']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
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

export type UpdateCampaignNameMutationVariables = Exact<{
  campaignId: Scalars['Int'];
  name: Scalars['String'];
}>;


export type UpdateCampaignNameMutation = (
  { __typename?: 'mutation_root' }
  & { update_campaign_by_pk?: Maybe<(
    { __typename?: 'campaign' }
    & Pick<Campaign, 'id' | 'name'>
  )> }
);

export type GetProfileQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetProfileQuery = (
  { __typename?: 'query_root' }
  & { users_by_pk?: Maybe<(
    { __typename?: 'users' }
    & Pick<Users, 'id' | 'handle'>
    & { friends: Array<(
      { __typename?: 'user_friends' }
      & { user?: Maybe<(
        { __typename?: 'users' }
        & Pick<Users, 'id' | 'handle'>
      )> }
    )>, sent_requests: Array<(
      { __typename?: 'user_sent_friend_requests' }
      & { user?: Maybe<(
        { __typename?: 'users' }
        & Pick<Users, 'id' | 'handle'>
      )> }
    )>, received_requests: Array<(
      { __typename?: 'user_received_friend_requests' }
      & { user?: Maybe<(
        { __typename?: 'users' }
        & Pick<Users, 'id' | 'handle'>
      )> }
    )> }
  )> }
);


export const UpdateCampaignNameDocument = gql`
    mutation updateCampaignName($campaignId: Int!, $name: String!) {
  update_campaign_by_pk(pk_columns: {id: $campaignId}, _set: {name: $name}) {
    id
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
 *      campaignId: // value for 'campaignId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateCampaignNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCampaignNameMutation, UpdateCampaignNameMutationVariables>) {
        return Apollo.useMutation<UpdateCampaignNameMutation, UpdateCampaignNameMutationVariables>(UpdateCampaignNameDocument, baseOptions);
      }
export type UpdateCampaignNameMutationHookResult = ReturnType<typeof useUpdateCampaignNameMutation>;
export type UpdateCampaignNameMutationResult = Apollo.MutationResult<UpdateCampaignNameMutation>;
export type UpdateCampaignNameMutationOptions = Apollo.BaseMutationOptions<UpdateCampaignNameMutation, UpdateCampaignNameMutationVariables>;
export const GetProfileDocument = gql`
    query getProfile($userId: String!) {
  users_by_pk(id: $userId) {
    id
    handle
    friends {
      user {
        id
        handle
      }
    }
    sent_requests {
      user {
        id
        handle
      }
    }
    received_requests {
      user {
        id
        handle
      }
    }
  }
}
    `;

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
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, baseOptions);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, baseOptions);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    