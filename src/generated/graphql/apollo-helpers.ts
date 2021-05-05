import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type base_decksKeySpecifier = ('campaign' | 'campaign_id' | 'deck' | 'id' | base_decksKeySpecifier)[];
export type base_decksFieldPolicy = {
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deck?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_aggregateKeySpecifier = ('aggregate' | 'nodes' | base_decks_aggregateKeySpecifier)[];
export type base_decks_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | base_decks_aggregate_fieldsKeySpecifier)[];
export type base_decks_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_avg_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_avg_fieldsKeySpecifier)[];
export type base_decks_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_max_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_max_fieldsKeySpecifier)[];
export type base_decks_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_min_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_min_fieldsKeySpecifier)[];
export type base_decks_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | base_decks_mutation_responseKeySpecifier)[];
export type base_decks_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_stddev_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_stddev_fieldsKeySpecifier)[];
export type base_decks_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_stddev_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_stddev_pop_fieldsKeySpecifier)[];
export type base_decks_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_stddev_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_stddev_samp_fieldsKeySpecifier)[];
export type base_decks_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_sum_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_sum_fieldsKeySpecifier)[];
export type base_decks_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_var_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_var_pop_fieldsKeySpecifier)[];
export type base_decks_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_var_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_var_samp_fieldsKeySpecifier)[];
export type base_decks_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type base_decks_variance_fieldsKeySpecifier = ('campaign_id' | 'id' | base_decks_variance_fieldsKeySpecifier)[];
export type base_decks_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaignKeySpecifier = ('access' | 'access_aggregate' | 'base_decks' | 'base_decks_aggregate' | 'campaignNotes' | 'campaign_guide' | 'chaosBag' | 'chaos_bag_result' | 'chaos_bag_result_aggregate' | 'created_at' | 'cycleCode' | 'deleted' | 'difficulty' | 'guide_version' | 'guided' | 'id' | 'investigator_data' | 'investigator_data_aggregate' | 'investigators' | 'investigators_aggregate' | 'latest_decks' | 'latest_decks_aggregate' | 'link_a_campaign' | 'link_a_campaign_id' | 'link_b_campaign' | 'link_b_campaign_id' | 'link_campaign_id' | 'linked_campaign' | 'name' | 'owner' | 'owner_id' | 'scenarioResults' | 'showInterludes' | 'standaloneId' | 'updated_at' | 'uuid' | 'weaknessSet' | campaignKeySpecifier)[];
export type campaignFieldPolicy = {
	access?: FieldPolicy<any> | FieldReadFunction<any>,
	access_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	base_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaignNotes?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	chaosBag?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	cycleCode?: FieldPolicy<any> | FieldReadFunction<any>,
	deleted?: FieldPolicy<any> | FieldReadFunction<any>,
	difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	guided?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	investigators?: FieldPolicy<any> | FieldReadFunction<any>,
	investigators_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	linked_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	scenarioResults?: FieldPolicy<any> | FieldReadFunction<any>,
	showInterludes?: FieldPolicy<any> | FieldReadFunction<any>,
	standaloneId?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>,
	weaknessSet?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_accessKeySpecifier = ('campaign_id' | 'hidden' | 'id' | 'user' | 'user_id' | campaign_accessKeySpecifier)[];
export type campaign_accessFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	hidden?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_aggregateKeySpecifier = ('aggregate' | 'nodes' | campaign_access_aggregateKeySpecifier)[];
export type campaign_access_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | campaign_access_aggregate_fieldsKeySpecifier)[];
export type campaign_access_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_avg_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_avg_fieldsKeySpecifier)[];
export type campaign_access_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_max_fieldsKeySpecifier = ('campaign_id' | 'id' | 'user_id' | campaign_access_max_fieldsKeySpecifier)[];
export type campaign_access_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_min_fieldsKeySpecifier = ('campaign_id' | 'id' | 'user_id' | campaign_access_min_fieldsKeySpecifier)[];
export type campaign_access_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | campaign_access_mutation_responseKeySpecifier)[];
export type campaign_access_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_stddev_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_stddev_fieldsKeySpecifier)[];
export type campaign_access_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_stddev_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_stddev_pop_fieldsKeySpecifier)[];
export type campaign_access_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_stddev_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_stddev_samp_fieldsKeySpecifier)[];
export type campaign_access_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_sum_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_sum_fieldsKeySpecifier)[];
export type campaign_access_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_var_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_var_pop_fieldsKeySpecifier)[];
export type campaign_access_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_var_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_var_samp_fieldsKeySpecifier)[];
export type campaign_access_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_access_variance_fieldsKeySpecifier = ('campaign_id' | 'id' | campaign_access_variance_fieldsKeySpecifier)[];
export type campaign_access_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_aggregateKeySpecifier = ('aggregate' | 'nodes' | campaign_aggregateKeySpecifier)[];
export type campaign_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | campaign_aggregate_fieldsKeySpecifier)[];
export type campaign_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_avg_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_avg_fieldsKeySpecifier)[];
export type campaign_avg_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deckKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'base' | 'campaign' | 'campaign_id' | 'content' | 'content_hash' | 'id' | 'investigator' | 'investigator_data' | 'local_uuid' | 'next_deck' | 'next_deck_id' | 'other_decks' | 'other_decks_aggregate' | 'owner' | 'owner_id' | 'previous_deck' | 'previous_decks' | 'previous_decks_aggregate' | 'updated_at' | campaign_deckKeySpecifier)[];
export type campaign_deckFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	base?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	content_hash?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	local_uuid?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>,
	other_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	other_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	previous_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	previous_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	previous_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_aggregateKeySpecifier = ('aggregate' | 'nodes' | campaign_deck_aggregateKeySpecifier)[];
export type campaign_deck_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | campaign_deck_aggregate_fieldsKeySpecifier)[];
export type campaign_deck_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_avg_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_avg_fieldsKeySpecifier)[];
export type campaign_deck_avg_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_max_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'content_hash' | 'id' | 'investigator' | 'local_uuid' | 'next_deck_id' | 'owner_id' | 'updated_at' | campaign_deck_max_fieldsKeySpecifier)[];
export type campaign_deck_max_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	content_hash?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	local_uuid?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_min_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'content_hash' | 'id' | 'investigator' | 'local_uuid' | 'next_deck_id' | 'owner_id' | 'updated_at' | campaign_deck_min_fieldsKeySpecifier)[];
export type campaign_deck_min_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	content_hash?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	local_uuid?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | campaign_deck_mutation_responseKeySpecifier)[];
export type campaign_deck_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_stddev_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_stddev_fieldsKeySpecifier)[];
export type campaign_deck_stddev_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_stddev_pop_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_stddev_pop_fieldsKeySpecifier)[];
export type campaign_deck_stddev_pop_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_stddev_samp_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_stddev_samp_fieldsKeySpecifier)[];
export type campaign_deck_stddev_samp_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_sum_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_sum_fieldsKeySpecifier)[];
export type campaign_deck_sum_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_var_pop_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_var_pop_fieldsKeySpecifier)[];
export type campaign_deck_var_pop_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_var_samp_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_var_samp_fieldsKeySpecifier)[];
export type campaign_deck_var_samp_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_deck_variance_fieldsKeySpecifier = ('arkhamdb_id' | 'arkhamdb_user' | 'campaign_id' | 'id' | 'next_deck_id' | campaign_deck_variance_fieldsKeySpecifier)[];
export type campaign_deck_variance_fieldsFieldPolicy = {
	arkhamdb_id?: FieldPolicy<any> | FieldReadFunction<any>,
	arkhamdb_user?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	next_deck_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guideKeySpecifier = ('access' | 'access_aggregate' | 'created_at' | 'guide_achievements' | 'guide_achievements_aggregate' | 'guide_inputs' | 'guide_inputs_aggregate' | 'id' | 'owner' | 'updated_at' | 'uuid' | campaign_guideKeySpecifier)[];
export type campaign_guideFieldPolicy = {
	access?: FieldPolicy<any> | FieldReadFunction<any>,
	access_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievements?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievements_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_inputs?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_inputs_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_aggregateKeySpecifier = ('aggregate' | 'nodes' | campaign_guide_aggregateKeySpecifier)[];
export type campaign_guide_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | campaign_guide_aggregate_fieldsKeySpecifier)[];
export type campaign_guide_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_avg_fieldsKeySpecifier = ('id' | campaign_guide_avg_fieldsKeySpecifier)[];
export type campaign_guide_avg_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_max_fieldsKeySpecifier = ('created_at' | 'id' | 'owner' | 'updated_at' | 'uuid' | campaign_guide_max_fieldsKeySpecifier)[];
export type campaign_guide_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_min_fieldsKeySpecifier = ('created_at' | 'id' | 'owner' | 'updated_at' | 'uuid' | campaign_guide_min_fieldsKeySpecifier)[];
export type campaign_guide_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | campaign_guide_mutation_responseKeySpecifier)[];
export type campaign_guide_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_stddev_fieldsKeySpecifier = ('id' | campaign_guide_stddev_fieldsKeySpecifier)[];
export type campaign_guide_stddev_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_stddev_pop_fieldsKeySpecifier = ('id' | campaign_guide_stddev_pop_fieldsKeySpecifier)[];
export type campaign_guide_stddev_pop_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_stddev_samp_fieldsKeySpecifier = ('id' | campaign_guide_stddev_samp_fieldsKeySpecifier)[];
export type campaign_guide_stddev_samp_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_sum_fieldsKeySpecifier = ('id' | campaign_guide_sum_fieldsKeySpecifier)[];
export type campaign_guide_sum_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_var_pop_fieldsKeySpecifier = ('id' | campaign_guide_var_pop_fieldsKeySpecifier)[];
export type campaign_guide_var_pop_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_var_samp_fieldsKeySpecifier = ('id' | campaign_guide_var_samp_fieldsKeySpecifier)[];
export type campaign_guide_var_samp_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_guide_variance_fieldsKeySpecifier = ('id' | campaign_guide_variance_fieldsKeySpecifier)[];
export type campaign_guide_variance_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigatorKeySpecifier = ('campaign' | 'campaign_id' | 'created_at' | 'id' | 'investigator' | 'updated_at' | campaign_investigatorKeySpecifier)[];
export type campaign_investigatorFieldPolicy = {
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_aggregateKeySpecifier = ('aggregate' | 'nodes' | campaign_investigator_aggregateKeySpecifier)[];
export type campaign_investigator_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | campaign_investigator_aggregate_fieldsKeySpecifier)[];
export type campaign_investigator_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_avg_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_avg_fieldsKeySpecifier)[];
export type campaign_investigator_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_max_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'investigator' | 'updated_at' | campaign_investigator_max_fieldsKeySpecifier)[];
export type campaign_investigator_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_min_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'investigator' | 'updated_at' | campaign_investigator_min_fieldsKeySpecifier)[];
export type campaign_investigator_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | campaign_investigator_mutation_responseKeySpecifier)[];
export type campaign_investigator_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_stddev_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_stddev_fieldsKeySpecifier)[];
export type campaign_investigator_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_stddev_pop_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_stddev_pop_fieldsKeySpecifier)[];
export type campaign_investigator_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_stddev_samp_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_stddev_samp_fieldsKeySpecifier)[];
export type campaign_investigator_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_sum_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_sum_fieldsKeySpecifier)[];
export type campaign_investigator_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_var_pop_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_var_pop_fieldsKeySpecifier)[];
export type campaign_investigator_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_var_samp_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_var_samp_fieldsKeySpecifier)[];
export type campaign_investigator_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_investigator_variance_fieldsKeySpecifier = ('campaign_id' | campaign_investigator_variance_fieldsKeySpecifier)[];
export type campaign_investigator_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_max_fieldsKeySpecifier = ('created_at' | 'cycleCode' | 'difficulty' | 'guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | 'name' | 'owner_id' | 'updated_at' | 'uuid' | campaign_max_fieldsKeySpecifier)[];
export type campaign_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	cycleCode?: FieldPolicy<any> | FieldReadFunction<any>,
	difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_min_fieldsKeySpecifier = ('created_at' | 'cycleCode' | 'difficulty' | 'guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | 'name' | 'owner_id' | 'updated_at' | 'uuid' | campaign_min_fieldsKeySpecifier)[];
export type campaign_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	cycleCode?: FieldPolicy<any> | FieldReadFunction<any>,
	difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | campaign_mutation_responseKeySpecifier)[];
export type campaign_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_stddev_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_stddev_fieldsKeySpecifier)[];
export type campaign_stddev_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_stddev_pop_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_stddev_pop_fieldsKeySpecifier)[];
export type campaign_stddev_pop_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_stddev_samp_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_stddev_samp_fieldsKeySpecifier)[];
export type campaign_stddev_samp_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_sum_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_sum_fieldsKeySpecifier)[];
export type campaign_sum_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_var_pop_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_var_pop_fieldsKeySpecifier)[];
export type campaign_var_pop_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_var_samp_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_var_samp_fieldsKeySpecifier)[];
export type campaign_var_samp_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_variance_fieldsKeySpecifier = ('guide_version' | 'id' | 'link_a_campaign_id' | 'link_b_campaign_id' | 'link_campaign_id' | campaign_variance_fieldsKeySpecifier)[];
export type campaign_variance_fieldsFieldPolicy = {
	guide_version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_a_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_b_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	link_campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_resultKeySpecifier = ('bless' | 'campaign' | 'created_at' | 'curse' | 'drawn' | 'id' | 'sealed' | 'totalDrawn' | 'updated_at' | chaos_bag_resultKeySpecifier)[];
export type chaos_bag_resultFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	drawn?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sealed?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_aggregateKeySpecifier = ('aggregate' | 'nodes' | chaos_bag_result_aggregateKeySpecifier)[];
export type chaos_bag_result_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | chaos_bag_result_aggregate_fieldsKeySpecifier)[];
export type chaos_bag_result_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_avg_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_avg_fieldsKeySpecifier)[];
export type chaos_bag_result_avg_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_max_fieldsKeySpecifier = ('bless' | 'created_at' | 'curse' | 'id' | 'totalDrawn' | 'updated_at' | chaos_bag_result_max_fieldsKeySpecifier)[];
export type chaos_bag_result_max_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_min_fieldsKeySpecifier = ('bless' | 'created_at' | 'curse' | 'id' | 'totalDrawn' | 'updated_at' | chaos_bag_result_min_fieldsKeySpecifier)[];
export type chaos_bag_result_min_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | chaos_bag_result_mutation_responseKeySpecifier)[];
export type chaos_bag_result_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_stddev_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_stddev_fieldsKeySpecifier)[];
export type chaos_bag_result_stddev_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_stddev_pop_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_stddev_pop_fieldsKeySpecifier)[];
export type chaos_bag_result_stddev_pop_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_stddev_samp_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_stddev_samp_fieldsKeySpecifier)[];
export type chaos_bag_result_stddev_samp_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_sum_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_sum_fieldsKeySpecifier)[];
export type chaos_bag_result_sum_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_var_pop_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_var_pop_fieldsKeySpecifier)[];
export type chaos_bag_result_var_pop_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_var_samp_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_var_samp_fieldsKeySpecifier)[];
export type chaos_bag_result_var_samp_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_result_variance_fieldsKeySpecifier = ('bless' | 'curse' | 'id' | 'totalDrawn' | chaos_bag_result_variance_fieldsKeySpecifier)[];
export type chaos_bag_result_variance_fieldsFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalDrawn?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_statusKeySpecifier = ('id' | 'status' | 'user_id_a' | 'user_id_b' | friend_statusKeySpecifier)[];
export type friend_statusFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_aggregateKeySpecifier = ('aggregate' | 'nodes' | friend_status_aggregateKeySpecifier)[];
export type friend_status_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | friend_status_aggregate_fieldsKeySpecifier)[];
export type friend_status_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_max_fieldsKeySpecifier = ('user_id_a' | 'user_id_b' | friend_status_max_fieldsKeySpecifier)[];
export type friend_status_max_fieldsFieldPolicy = {
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_min_fieldsKeySpecifier = ('user_id_a' | 'user_id_b' | friend_status_min_fieldsKeySpecifier)[];
export type friend_status_min_fieldsFieldPolicy = {
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | friend_status_mutation_responseKeySpecifier)[];
export type friend_status_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_typeKeySpecifier = ('value' | friend_status_typeKeySpecifier)[];
export type friend_status_typeFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_type_aggregateKeySpecifier = ('aggregate' | 'nodes' | friend_status_type_aggregateKeySpecifier)[];
export type friend_status_type_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_type_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | friend_status_type_aggregate_fieldsKeySpecifier)[];
export type friend_status_type_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_type_max_fieldsKeySpecifier = ('value' | friend_status_type_max_fieldsKeySpecifier)[];
export type friend_status_type_max_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_type_min_fieldsKeySpecifier = ('value' | friend_status_type_min_fieldsKeySpecifier)[];
export type friend_status_type_min_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type friend_status_type_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | friend_status_type_mutation_responseKeySpecifier)[];
export type friend_status_type_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievementKeySpecifier = ('bool_value' | 'campaign' | 'campaign_id' | 'created_at' | 'id' | 'type' | 'updated_at' | 'value' | guide_achievementKeySpecifier)[];
export type guide_achievementFieldPolicy = {
	bool_value?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_aggregateKeySpecifier = ('aggregate' | 'nodes' | guide_achievement_aggregateKeySpecifier)[];
export type guide_achievement_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | guide_achievement_aggregate_fieldsKeySpecifier)[];
export type guide_achievement_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_avg_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_avg_fieldsKeySpecifier)[];
export type guide_achievement_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_max_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'id' | 'type' | 'updated_at' | 'value' | guide_achievement_max_fieldsKeySpecifier)[];
export type guide_achievement_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_min_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'id' | 'type' | 'updated_at' | 'value' | guide_achievement_min_fieldsKeySpecifier)[];
export type guide_achievement_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | guide_achievement_mutation_responseKeySpecifier)[];
export type guide_achievement_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_stddev_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_stddev_fieldsKeySpecifier)[];
export type guide_achievement_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_stddev_pop_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_stddev_pop_fieldsKeySpecifier)[];
export type guide_achievement_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_stddev_samp_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_stddev_samp_fieldsKeySpecifier)[];
export type guide_achievement_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_sum_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_sum_fieldsKeySpecifier)[];
export type guide_achievement_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_var_pop_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_var_pop_fieldsKeySpecifier)[];
export type guide_achievement_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_var_samp_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_var_samp_fieldsKeySpecifier)[];
export type guide_achievement_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_achievement_variance_fieldsKeySpecifier = ('campaign_id' | 'value' | guide_achievement_variance_fieldsKeySpecifier)[];
export type guide_achievement_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_inputKeySpecifier = ('campaign' | 'campaign_id' | 'created_at' | 'id' | 'payload' | 'scenario' | 'step' | 'type' | guide_inputKeySpecifier)[];
export type guide_inputFieldPolicy = {
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	payload?: FieldPolicy<any> | FieldReadFunction<any>,
	scenario?: FieldPolicy<any> | FieldReadFunction<any>,
	step?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_aggregateKeySpecifier = ('aggregate' | 'nodes' | guide_input_aggregateKeySpecifier)[];
export type guide_input_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | guide_input_aggregate_fieldsKeySpecifier)[];
export type guide_input_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_avg_fieldsKeySpecifier = ('campaign_id' | guide_input_avg_fieldsKeySpecifier)[];
export type guide_input_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_max_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'id' | 'scenario' | 'step' | 'type' | guide_input_max_fieldsKeySpecifier)[];
export type guide_input_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	scenario?: FieldPolicy<any> | FieldReadFunction<any>,
	step?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_min_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'id' | 'scenario' | 'step' | 'type' | guide_input_min_fieldsKeySpecifier)[];
export type guide_input_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	scenario?: FieldPolicy<any> | FieldReadFunction<any>,
	step?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | guide_input_mutation_responseKeySpecifier)[];
export type guide_input_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_stddev_fieldsKeySpecifier = ('campaign_id' | guide_input_stddev_fieldsKeySpecifier)[];
export type guide_input_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_stddev_pop_fieldsKeySpecifier = ('campaign_id' | guide_input_stddev_pop_fieldsKeySpecifier)[];
export type guide_input_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_stddev_samp_fieldsKeySpecifier = ('campaign_id' | guide_input_stddev_samp_fieldsKeySpecifier)[];
export type guide_input_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_sum_fieldsKeySpecifier = ('campaign_id' | guide_input_sum_fieldsKeySpecifier)[];
export type guide_input_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_var_pop_fieldsKeySpecifier = ('campaign_id' | guide_input_var_pop_fieldsKeySpecifier)[];
export type guide_input_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_var_samp_fieldsKeySpecifier = ('campaign_id' | guide_input_var_samp_fieldsKeySpecifier)[];
export type guide_input_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_variance_fieldsKeySpecifier = ('campaign_id' | guide_input_variance_fieldsKeySpecifier)[];
export type guide_input_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_dataKeySpecifier = ('addedCards' | 'availableXp' | 'campaign_data' | 'campaign_id' | 'created_at' | 'id' | 'ignoreStoryAssets' | 'insane' | 'investigator' | 'killed' | 'mental' | 'physical' | 'removedCards' | 'specialXp' | 'spentXp' | 'storyAssets' | 'updated_at' | investigator_dataKeySpecifier)[];
export type investigator_dataFieldPolicy = {
	addedCards?: FieldPolicy<any> | FieldReadFunction<any>,
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_data?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ignoreStoryAssets?: FieldPolicy<any> | FieldReadFunction<any>,
	insane?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	killed?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	removedCards?: FieldPolicy<any> | FieldReadFunction<any>,
	specialXp?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>,
	storyAssets?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_aggregateKeySpecifier = ('aggregate' | 'nodes' | investigator_data_aggregateKeySpecifier)[];
export type investigator_data_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | investigator_data_aggregate_fieldsKeySpecifier)[];
export type investigator_data_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_avg_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_avg_fieldsKeySpecifier)[];
export type investigator_data_avg_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_max_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'created_at' | 'investigator' | 'mental' | 'physical' | 'spentXp' | 'updated_at' | investigator_data_max_fieldsKeySpecifier)[];
export type investigator_data_max_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_min_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'created_at' | 'investigator' | 'mental' | 'physical' | 'spentXp' | 'updated_at' | investigator_data_min_fieldsKeySpecifier)[];
export type investigator_data_min_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | investigator_data_mutation_responseKeySpecifier)[];
export type investigator_data_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_stddev_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_stddev_fieldsKeySpecifier)[];
export type investigator_data_stddev_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_stddev_pop_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_stddev_pop_fieldsKeySpecifier)[];
export type investigator_data_stddev_pop_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_stddev_samp_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_stddev_samp_fieldsKeySpecifier)[];
export type investigator_data_stddev_samp_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_sum_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_sum_fieldsKeySpecifier)[];
export type investigator_data_sum_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_var_pop_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_var_pop_fieldsKeySpecifier)[];
export type investigator_data_var_pop_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_var_samp_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_var_samp_fieldsKeySpecifier)[];
export type investigator_data_var_samp_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_data_variance_fieldsKeySpecifier = ('availableXp' | 'campaign_id' | 'mental' | 'physical' | 'spentXp' | investigator_data_variance_fieldsKeySpecifier)[];
export type investigator_data_variance_fieldsFieldPolicy = {
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mental?: FieldPolicy<any> | FieldReadFunction<any>,
	physical?: FieldPolicy<any> | FieldReadFunction<any>,
	spentXp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decksKeySpecifier = ('campaign' | 'campaign_id' | 'deck' | 'id' | 'owner_id' | latest_decksKeySpecifier)[];
export type latest_decksFieldPolicy = {
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deck?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_aggregateKeySpecifier = ('aggregate' | 'nodes' | latest_decks_aggregateKeySpecifier)[];
export type latest_decks_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | latest_decks_aggregate_fieldsKeySpecifier)[];
export type latest_decks_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_avg_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_avg_fieldsKeySpecifier)[];
export type latest_decks_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_max_fieldsKeySpecifier = ('campaign_id' | 'id' | 'owner_id' | latest_decks_max_fieldsKeySpecifier)[];
export type latest_decks_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_min_fieldsKeySpecifier = ('campaign_id' | 'id' | 'owner_id' | latest_decks_min_fieldsKeySpecifier)[];
export type latest_decks_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | latest_decks_mutation_responseKeySpecifier)[];
export type latest_decks_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_stddev_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_stddev_fieldsKeySpecifier)[];
export type latest_decks_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_stddev_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_stddev_pop_fieldsKeySpecifier)[];
export type latest_decks_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_stddev_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_stddev_samp_fieldsKeySpecifier)[];
export type latest_decks_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_sum_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_sum_fieldsKeySpecifier)[];
export type latest_decks_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_var_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_var_pop_fieldsKeySpecifier)[];
export type latest_decks_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_var_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_var_samp_fieldsKeySpecifier)[];
export type latest_decks_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type latest_decks_variance_fieldsKeySpecifier = ('campaign_id' | 'id' | latest_decks_variance_fieldsKeySpecifier)[];
export type latest_decks_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decksKeySpecifier = ('campaign' | 'campaign_id' | 'deck' | 'id' | 'owner_id' | local_decksKeySpecifier)[];
export type local_decksFieldPolicy = {
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deck?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_aggregateKeySpecifier = ('aggregate' | 'nodes' | local_decks_aggregateKeySpecifier)[];
export type local_decks_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | local_decks_aggregate_fieldsKeySpecifier)[];
export type local_decks_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_avg_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_avg_fieldsKeySpecifier)[];
export type local_decks_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_max_fieldsKeySpecifier = ('campaign_id' | 'id' | 'owner_id' | local_decks_max_fieldsKeySpecifier)[];
export type local_decks_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_min_fieldsKeySpecifier = ('campaign_id' | 'id' | 'owner_id' | local_decks_min_fieldsKeySpecifier)[];
export type local_decks_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | local_decks_mutation_responseKeySpecifier)[];
export type local_decks_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_stddev_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_stddev_fieldsKeySpecifier)[];
export type local_decks_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_stddev_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_stddev_pop_fieldsKeySpecifier)[];
export type local_decks_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_stddev_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_stddev_samp_fieldsKeySpecifier)[];
export type local_decks_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_sum_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_sum_fieldsKeySpecifier)[];
export type local_decks_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_var_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_var_pop_fieldsKeySpecifier)[];
export type local_decks_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_var_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_var_samp_fieldsKeySpecifier)[];
export type local_decks_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type local_decks_variance_fieldsKeySpecifier = ('campaign_id' | 'id' | local_decks_variance_fieldsKeySpecifier)[];
export type local_decks_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type mutation_rootKeySpecifier = ('delete_base_decks' | 'delete_campaign' | 'delete_campaign_access' | 'delete_campaign_access_by_pk' | 'delete_campaign_by_pk' | 'delete_campaign_deck' | 'delete_campaign_deck_by_pk' | 'delete_campaign_guide' | 'delete_campaign_investigator' | 'delete_campaign_investigator_by_pk' | 'delete_chaos_bag_result' | 'delete_chaos_bag_result_by_pk' | 'delete_friend_status' | 'delete_friend_status_by_pk' | 'delete_friend_status_type' | 'delete_friend_status_type_by_pk' | 'delete_guide_achievement' | 'delete_guide_achievement_by_pk' | 'delete_guide_input' | 'delete_guide_input_by_pk' | 'delete_investigator_data' | 'delete_investigator_data_by_pk' | 'delete_latest_decks' | 'delete_local_decks' | 'delete_user_campaigns' | 'delete_user_friends' | 'delete_user_received_friend_requests' | 'delete_user_sent_friend_requests' | 'delete_users' | 'delete_users_by_pk' | 'insert_base_decks' | 'insert_base_decks_one' | 'insert_campaign' | 'insert_campaign_access' | 'insert_campaign_access_one' | 'insert_campaign_deck' | 'insert_campaign_deck_one' | 'insert_campaign_guide' | 'insert_campaign_guide_one' | 'insert_campaign_investigator' | 'insert_campaign_investigator_one' | 'insert_campaign_one' | 'insert_chaos_bag_result' | 'insert_chaos_bag_result_one' | 'insert_friend_status' | 'insert_friend_status_one' | 'insert_friend_status_type' | 'insert_friend_status_type_one' | 'insert_guide_achievement' | 'insert_guide_achievement_one' | 'insert_guide_input' | 'insert_guide_input_one' | 'insert_investigator_data' | 'insert_investigator_data_one' | 'insert_latest_decks' | 'insert_latest_decks_one' | 'insert_local_decks' | 'insert_local_decks_one' | 'insert_user_campaigns' | 'insert_user_campaigns_one' | 'insert_user_friends' | 'insert_user_friends_one' | 'insert_user_received_friend_requests' | 'insert_user_received_friend_requests_one' | 'insert_user_sent_friend_requests' | 'insert_user_sent_friend_requests_one' | 'insert_users' | 'insert_users_one' | 'update_base_decks' | 'update_campaign' | 'update_campaign_access' | 'update_campaign_access_by_pk' | 'update_campaign_by_pk' | 'update_campaign_deck' | 'update_campaign_deck_by_pk' | 'update_campaign_guide' | 'update_campaign_investigator' | 'update_campaign_investigator_by_pk' | 'update_chaos_bag_result' | 'update_chaos_bag_result_by_pk' | 'update_friend_status' | 'update_friend_status_by_pk' | 'update_friend_status_type' | 'update_friend_status_type_by_pk' | 'update_guide_achievement' | 'update_guide_achievement_by_pk' | 'update_guide_input' | 'update_guide_input_by_pk' | 'update_investigator_data' | 'update_investigator_data_by_pk' | 'update_latest_decks' | 'update_local_decks' | 'update_user_campaigns' | 'update_user_friends' | 'update_user_received_friend_requests' | 'update_user_sent_friend_requests' | 'update_users' | 'update_users_by_pk' | mutation_rootKeySpecifier)[];
export type mutation_rootFieldPolicy = {
	delete_base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_access_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_deck_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_achievement_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_input_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_investigator_data_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_users?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_base_decks_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_access_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_deck_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_guide_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_investigator_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_chaos_bag_result_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status_type_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_guide_achievement_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_guide_input_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_investigator_data_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_latest_decks_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_local_decks_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_campaigns_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_friends_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_received_friend_requests_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_sent_friend_requests_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_users?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_users_one?: FieldPolicy<any> | FieldReadFunction<any>,
	update_base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_access_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_deck_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_achievement_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_input_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	update_investigator_data_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type query_rootKeySpecifier = ('base_decks' | 'base_decks_aggregate' | 'campaign' | 'campaign_access' | 'campaign_access_aggregate' | 'campaign_access_by_pk' | 'campaign_aggregate' | 'campaign_by_pk' | 'campaign_deck' | 'campaign_deck_aggregate' | 'campaign_deck_by_pk' | 'campaign_guide' | 'campaign_guide_aggregate' | 'campaign_investigator' | 'campaign_investigator_aggregate' | 'campaign_investigator_by_pk' | 'chaos_bag_result' | 'chaos_bag_result_aggregate' | 'chaos_bag_result_by_pk' | 'friend_status' | 'friend_status_aggregate' | 'friend_status_by_pk' | 'friend_status_type' | 'friend_status_type_aggregate' | 'friend_status_type_by_pk' | 'guide_achievement' | 'guide_achievement_aggregate' | 'guide_achievement_by_pk' | 'guide_input' | 'guide_input_aggregate' | 'guide_input_by_pk' | 'investigator_data' | 'investigator_data_aggregate' | 'investigator_data_by_pk' | 'latest_decks' | 'latest_decks_aggregate' | 'local_decks' | 'local_decks_aggregate' | 'user_campaigns' | 'user_campaigns_aggregate' | 'user_friends' | 'user_friends_aggregate' | 'user_received_friend_requests' | 'user_received_friend_requests_aggregate' | 'user_sent_friend_requests' | 'user_sent_friend_requests_aggregate' | 'users' | 'users_aggregate' | 'users_by_pk' | query_rootKeySpecifier)[];
export type query_rootFieldPolicy = {
	base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	base_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	users_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type subscription_rootKeySpecifier = ('base_decks' | 'base_decks_aggregate' | 'campaign' | 'campaign_access' | 'campaign_access_aggregate' | 'campaign_access_by_pk' | 'campaign_aggregate' | 'campaign_by_pk' | 'campaign_deck' | 'campaign_deck_aggregate' | 'campaign_deck_by_pk' | 'campaign_guide' | 'campaign_guide_aggregate' | 'campaign_investigator' | 'campaign_investigator_aggregate' | 'campaign_investigator_by_pk' | 'chaos_bag_result' | 'chaos_bag_result_aggregate' | 'chaos_bag_result_by_pk' | 'friend_status' | 'friend_status_aggregate' | 'friend_status_by_pk' | 'friend_status_type' | 'friend_status_type_aggregate' | 'friend_status_type_by_pk' | 'guide_achievement' | 'guide_achievement_aggregate' | 'guide_achievement_by_pk' | 'guide_input' | 'guide_input_aggregate' | 'guide_input_by_pk' | 'investigator_data' | 'investigator_data_aggregate' | 'investigator_data_by_pk' | 'latest_decks' | 'latest_decks_aggregate' | 'local_decks' | 'local_decks_aggregate' | 'user_campaigns' | 'user_campaigns_aggregate' | 'user_friends' | 'user_friends_aggregate' | 'user_received_friend_requests' | 'user_received_friend_requests_aggregate' | 'user_sent_friend_requests' | 'user_sent_friend_requests_aggregate' | 'users' | 'users_aggregate' | 'users_by_pk' | subscription_rootKeySpecifier)[];
export type subscription_rootFieldPolicy = {
	base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	base_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	users_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaignsKeySpecifier = ('campaign' | 'campaign_id' | 'id' | 'user_id' | user_campaignsKeySpecifier)[];
export type user_campaignsFieldPolicy = {
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_campaigns_aggregateKeySpecifier)[];
export type user_campaigns_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | user_campaigns_aggregate_fieldsKeySpecifier)[];
export type user_campaigns_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_avg_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_avg_fieldsKeySpecifier)[];
export type user_campaigns_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_max_fieldsKeySpecifier = ('campaign_id' | 'id' | 'user_id' | user_campaigns_max_fieldsKeySpecifier)[];
export type user_campaigns_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_min_fieldsKeySpecifier = ('campaign_id' | 'id' | 'user_id' | user_campaigns_min_fieldsKeySpecifier)[];
export type user_campaigns_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_campaigns_mutation_responseKeySpecifier)[];
export type user_campaigns_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_stddev_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_stddev_fieldsKeySpecifier)[];
export type user_campaigns_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_stddev_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_stddev_pop_fieldsKeySpecifier)[];
export type user_campaigns_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_stddev_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_stddev_samp_fieldsKeySpecifier)[];
export type user_campaigns_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_sum_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_sum_fieldsKeySpecifier)[];
export type user_campaigns_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_var_pop_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_var_pop_fieldsKeySpecifier)[];
export type user_campaigns_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_var_samp_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_var_samp_fieldsKeySpecifier)[];
export type user_campaigns_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_campaigns_variance_fieldsKeySpecifier = ('campaign_id' | 'id' | user_campaigns_variance_fieldsKeySpecifier)[];
export type user_campaigns_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_friendsKeySpecifier = ('status' | 'user' | 'user_id_a' | 'user_id_b' | user_friendsKeySpecifier)[];
export type user_friendsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_friends_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_friends_aggregateKeySpecifier)[];
export type user_friends_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_friends_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | user_friends_aggregate_fieldsKeySpecifier)[];
export type user_friends_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_friends_max_fieldsKeySpecifier = ('status' | 'user_id_a' | 'user_id_b' | user_friends_max_fieldsKeySpecifier)[];
export type user_friends_max_fieldsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_friends_min_fieldsKeySpecifier = ('status' | 'user_id_a' | 'user_id_b' | user_friends_min_fieldsKeySpecifier)[];
export type user_friends_min_fieldsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_friends_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_friends_mutation_responseKeySpecifier)[];
export type user_friends_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_received_friend_requestsKeySpecifier = ('status' | 'user' | 'user_id_a' | 'user_id_b' | user_received_friend_requestsKeySpecifier)[];
export type user_received_friend_requestsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_received_friend_requests_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_received_friend_requests_aggregateKeySpecifier)[];
export type user_received_friend_requests_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_received_friend_requests_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | user_received_friend_requests_aggregate_fieldsKeySpecifier)[];
export type user_received_friend_requests_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_received_friend_requests_max_fieldsKeySpecifier = ('status' | 'user_id_a' | 'user_id_b' | user_received_friend_requests_max_fieldsKeySpecifier)[];
export type user_received_friend_requests_max_fieldsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_received_friend_requests_min_fieldsKeySpecifier = ('status' | 'user_id_a' | 'user_id_b' | user_received_friend_requests_min_fieldsKeySpecifier)[];
export type user_received_friend_requests_min_fieldsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_received_friend_requests_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_received_friend_requests_mutation_responseKeySpecifier)[];
export type user_received_friend_requests_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_sent_friend_requestsKeySpecifier = ('status' | 'user' | 'user_id_a' | 'user_id_b' | user_sent_friend_requestsKeySpecifier)[];
export type user_sent_friend_requestsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_sent_friend_requests_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_sent_friend_requests_aggregateKeySpecifier)[];
export type user_sent_friend_requests_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_sent_friend_requests_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | user_sent_friend_requests_aggregate_fieldsKeySpecifier)[];
export type user_sent_friend_requests_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_sent_friend_requests_max_fieldsKeySpecifier = ('status' | 'user_id_a' | 'user_id_b' | user_sent_friend_requests_max_fieldsKeySpecifier)[];
export type user_sent_friend_requests_max_fieldsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_sent_friend_requests_min_fieldsKeySpecifier = ('status' | 'user_id_a' | 'user_id_b' | user_sent_friend_requests_min_fieldsKeySpecifier)[];
export type user_sent_friend_requests_min_fieldsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_a?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id_b?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_sent_friend_requests_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_sent_friend_requests_mutation_responseKeySpecifier)[];
export type user_sent_friend_requests_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type usersKeySpecifier = ('all_decks' | 'all_decks_aggregate' | 'campaigns' | 'campaigns_aggregate' | 'created_at' | 'decks' | 'decks_aggregate' | 'friends' | 'friends_aggregate' | 'handle' | 'id' | 'local_decks' | 'local_decks_aggregate' | 'received_requests' | 'received_requests_aggregate' | 'sent_requests' | 'sent_requests_aggregate' | 'updated_at' | usersKeySpecifier)[];
export type usersFieldPolicy = {
	all_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	all_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	decks?: FieldPolicy<any> | FieldReadFunction<any>,
	decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friends?: FieldPolicy<any> | FieldReadFunction<any>,
	friends_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	handle?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	received_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	received_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	sent_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	sent_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_aggregateKeySpecifier = ('aggregate' | 'nodes' | users_aggregateKeySpecifier)[];
export type users_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | users_aggregate_fieldsKeySpecifier)[];
export type users_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_max_fieldsKeySpecifier = ('created_at' | 'handle' | 'id' | 'updated_at' | users_max_fieldsKeySpecifier)[];
export type users_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	handle?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_min_fieldsKeySpecifier = ('created_at' | 'handle' | 'id' | 'updated_at' | users_min_fieldsKeySpecifier)[];
export type users_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	handle?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | users_mutation_responseKeySpecifier)[];
export type users_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	base_decks?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decksKeySpecifier | (() => undefined | base_decksKeySpecifier),
		fields?: base_decksFieldPolicy,
	},
	base_decks_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_aggregateKeySpecifier | (() => undefined | base_decks_aggregateKeySpecifier),
		fields?: base_decks_aggregateFieldPolicy,
	},
	base_decks_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_aggregate_fieldsKeySpecifier | (() => undefined | base_decks_aggregate_fieldsKeySpecifier),
		fields?: base_decks_aggregate_fieldsFieldPolicy,
	},
	base_decks_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_avg_fieldsKeySpecifier | (() => undefined | base_decks_avg_fieldsKeySpecifier),
		fields?: base_decks_avg_fieldsFieldPolicy,
	},
	base_decks_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_max_fieldsKeySpecifier | (() => undefined | base_decks_max_fieldsKeySpecifier),
		fields?: base_decks_max_fieldsFieldPolicy,
	},
	base_decks_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_min_fieldsKeySpecifier | (() => undefined | base_decks_min_fieldsKeySpecifier),
		fields?: base_decks_min_fieldsFieldPolicy,
	},
	base_decks_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_mutation_responseKeySpecifier | (() => undefined | base_decks_mutation_responseKeySpecifier),
		fields?: base_decks_mutation_responseFieldPolicy,
	},
	base_decks_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_stddev_fieldsKeySpecifier | (() => undefined | base_decks_stddev_fieldsKeySpecifier),
		fields?: base_decks_stddev_fieldsFieldPolicy,
	},
	base_decks_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_stddev_pop_fieldsKeySpecifier | (() => undefined | base_decks_stddev_pop_fieldsKeySpecifier),
		fields?: base_decks_stddev_pop_fieldsFieldPolicy,
	},
	base_decks_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_stddev_samp_fieldsKeySpecifier | (() => undefined | base_decks_stddev_samp_fieldsKeySpecifier),
		fields?: base_decks_stddev_samp_fieldsFieldPolicy,
	},
	base_decks_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_sum_fieldsKeySpecifier | (() => undefined | base_decks_sum_fieldsKeySpecifier),
		fields?: base_decks_sum_fieldsFieldPolicy,
	},
	base_decks_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_var_pop_fieldsKeySpecifier | (() => undefined | base_decks_var_pop_fieldsKeySpecifier),
		fields?: base_decks_var_pop_fieldsFieldPolicy,
	},
	base_decks_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_var_samp_fieldsKeySpecifier | (() => undefined | base_decks_var_samp_fieldsKeySpecifier),
		fields?: base_decks_var_samp_fieldsFieldPolicy,
	},
	base_decks_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | base_decks_variance_fieldsKeySpecifier | (() => undefined | base_decks_variance_fieldsKeySpecifier),
		fields?: base_decks_variance_fieldsFieldPolicy,
	},
	campaign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaignKeySpecifier | (() => undefined | campaignKeySpecifier),
		fields?: campaignFieldPolicy,
	},
	campaign_access?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_accessKeySpecifier | (() => undefined | campaign_accessKeySpecifier),
		fields?: campaign_accessFieldPolicy,
	},
	campaign_access_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_aggregateKeySpecifier | (() => undefined | campaign_access_aggregateKeySpecifier),
		fields?: campaign_access_aggregateFieldPolicy,
	},
	campaign_access_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_aggregate_fieldsKeySpecifier | (() => undefined | campaign_access_aggregate_fieldsKeySpecifier),
		fields?: campaign_access_aggregate_fieldsFieldPolicy,
	},
	campaign_access_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_avg_fieldsKeySpecifier | (() => undefined | campaign_access_avg_fieldsKeySpecifier),
		fields?: campaign_access_avg_fieldsFieldPolicy,
	},
	campaign_access_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_max_fieldsKeySpecifier | (() => undefined | campaign_access_max_fieldsKeySpecifier),
		fields?: campaign_access_max_fieldsFieldPolicy,
	},
	campaign_access_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_min_fieldsKeySpecifier | (() => undefined | campaign_access_min_fieldsKeySpecifier),
		fields?: campaign_access_min_fieldsFieldPolicy,
	},
	campaign_access_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_mutation_responseKeySpecifier | (() => undefined | campaign_access_mutation_responseKeySpecifier),
		fields?: campaign_access_mutation_responseFieldPolicy,
	},
	campaign_access_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_stddev_fieldsKeySpecifier | (() => undefined | campaign_access_stddev_fieldsKeySpecifier),
		fields?: campaign_access_stddev_fieldsFieldPolicy,
	},
	campaign_access_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_stddev_pop_fieldsKeySpecifier | (() => undefined | campaign_access_stddev_pop_fieldsKeySpecifier),
		fields?: campaign_access_stddev_pop_fieldsFieldPolicy,
	},
	campaign_access_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_stddev_samp_fieldsKeySpecifier | (() => undefined | campaign_access_stddev_samp_fieldsKeySpecifier),
		fields?: campaign_access_stddev_samp_fieldsFieldPolicy,
	},
	campaign_access_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_sum_fieldsKeySpecifier | (() => undefined | campaign_access_sum_fieldsKeySpecifier),
		fields?: campaign_access_sum_fieldsFieldPolicy,
	},
	campaign_access_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_var_pop_fieldsKeySpecifier | (() => undefined | campaign_access_var_pop_fieldsKeySpecifier),
		fields?: campaign_access_var_pop_fieldsFieldPolicy,
	},
	campaign_access_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_var_samp_fieldsKeySpecifier | (() => undefined | campaign_access_var_samp_fieldsKeySpecifier),
		fields?: campaign_access_var_samp_fieldsFieldPolicy,
	},
	campaign_access_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_access_variance_fieldsKeySpecifier | (() => undefined | campaign_access_variance_fieldsKeySpecifier),
		fields?: campaign_access_variance_fieldsFieldPolicy,
	},
	campaign_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_aggregateKeySpecifier | (() => undefined | campaign_aggregateKeySpecifier),
		fields?: campaign_aggregateFieldPolicy,
	},
	campaign_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_aggregate_fieldsKeySpecifier | (() => undefined | campaign_aggregate_fieldsKeySpecifier),
		fields?: campaign_aggregate_fieldsFieldPolicy,
	},
	campaign_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_avg_fieldsKeySpecifier | (() => undefined | campaign_avg_fieldsKeySpecifier),
		fields?: campaign_avg_fieldsFieldPolicy,
	},
	campaign_deck?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deckKeySpecifier | (() => undefined | campaign_deckKeySpecifier),
		fields?: campaign_deckFieldPolicy,
	},
	campaign_deck_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_aggregateKeySpecifier | (() => undefined | campaign_deck_aggregateKeySpecifier),
		fields?: campaign_deck_aggregateFieldPolicy,
	},
	campaign_deck_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_aggregate_fieldsKeySpecifier | (() => undefined | campaign_deck_aggregate_fieldsKeySpecifier),
		fields?: campaign_deck_aggregate_fieldsFieldPolicy,
	},
	campaign_deck_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_avg_fieldsKeySpecifier | (() => undefined | campaign_deck_avg_fieldsKeySpecifier),
		fields?: campaign_deck_avg_fieldsFieldPolicy,
	},
	campaign_deck_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_max_fieldsKeySpecifier | (() => undefined | campaign_deck_max_fieldsKeySpecifier),
		fields?: campaign_deck_max_fieldsFieldPolicy,
	},
	campaign_deck_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_min_fieldsKeySpecifier | (() => undefined | campaign_deck_min_fieldsKeySpecifier),
		fields?: campaign_deck_min_fieldsFieldPolicy,
	},
	campaign_deck_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_mutation_responseKeySpecifier | (() => undefined | campaign_deck_mutation_responseKeySpecifier),
		fields?: campaign_deck_mutation_responseFieldPolicy,
	},
	campaign_deck_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_stddev_fieldsKeySpecifier | (() => undefined | campaign_deck_stddev_fieldsKeySpecifier),
		fields?: campaign_deck_stddev_fieldsFieldPolicy,
	},
	campaign_deck_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_stddev_pop_fieldsKeySpecifier | (() => undefined | campaign_deck_stddev_pop_fieldsKeySpecifier),
		fields?: campaign_deck_stddev_pop_fieldsFieldPolicy,
	},
	campaign_deck_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_stddev_samp_fieldsKeySpecifier | (() => undefined | campaign_deck_stddev_samp_fieldsKeySpecifier),
		fields?: campaign_deck_stddev_samp_fieldsFieldPolicy,
	},
	campaign_deck_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_sum_fieldsKeySpecifier | (() => undefined | campaign_deck_sum_fieldsKeySpecifier),
		fields?: campaign_deck_sum_fieldsFieldPolicy,
	},
	campaign_deck_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_var_pop_fieldsKeySpecifier | (() => undefined | campaign_deck_var_pop_fieldsKeySpecifier),
		fields?: campaign_deck_var_pop_fieldsFieldPolicy,
	},
	campaign_deck_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_var_samp_fieldsKeySpecifier | (() => undefined | campaign_deck_var_samp_fieldsKeySpecifier),
		fields?: campaign_deck_var_samp_fieldsFieldPolicy,
	},
	campaign_deck_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_deck_variance_fieldsKeySpecifier | (() => undefined | campaign_deck_variance_fieldsKeySpecifier),
		fields?: campaign_deck_variance_fieldsFieldPolicy,
	},
	campaign_guide?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guideKeySpecifier | (() => undefined | campaign_guideKeySpecifier),
		fields?: campaign_guideFieldPolicy,
	},
	campaign_guide_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_aggregateKeySpecifier | (() => undefined | campaign_guide_aggregateKeySpecifier),
		fields?: campaign_guide_aggregateFieldPolicy,
	},
	campaign_guide_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_aggregate_fieldsKeySpecifier | (() => undefined | campaign_guide_aggregate_fieldsKeySpecifier),
		fields?: campaign_guide_aggregate_fieldsFieldPolicy,
	},
	campaign_guide_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_avg_fieldsKeySpecifier | (() => undefined | campaign_guide_avg_fieldsKeySpecifier),
		fields?: campaign_guide_avg_fieldsFieldPolicy,
	},
	campaign_guide_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_max_fieldsKeySpecifier | (() => undefined | campaign_guide_max_fieldsKeySpecifier),
		fields?: campaign_guide_max_fieldsFieldPolicy,
	},
	campaign_guide_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_min_fieldsKeySpecifier | (() => undefined | campaign_guide_min_fieldsKeySpecifier),
		fields?: campaign_guide_min_fieldsFieldPolicy,
	},
	campaign_guide_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_mutation_responseKeySpecifier | (() => undefined | campaign_guide_mutation_responseKeySpecifier),
		fields?: campaign_guide_mutation_responseFieldPolicy,
	},
	campaign_guide_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_stddev_fieldsKeySpecifier | (() => undefined | campaign_guide_stddev_fieldsKeySpecifier),
		fields?: campaign_guide_stddev_fieldsFieldPolicy,
	},
	campaign_guide_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_stddev_pop_fieldsKeySpecifier | (() => undefined | campaign_guide_stddev_pop_fieldsKeySpecifier),
		fields?: campaign_guide_stddev_pop_fieldsFieldPolicy,
	},
	campaign_guide_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_stddev_samp_fieldsKeySpecifier | (() => undefined | campaign_guide_stddev_samp_fieldsKeySpecifier),
		fields?: campaign_guide_stddev_samp_fieldsFieldPolicy,
	},
	campaign_guide_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_sum_fieldsKeySpecifier | (() => undefined | campaign_guide_sum_fieldsKeySpecifier),
		fields?: campaign_guide_sum_fieldsFieldPolicy,
	},
	campaign_guide_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_var_pop_fieldsKeySpecifier | (() => undefined | campaign_guide_var_pop_fieldsKeySpecifier),
		fields?: campaign_guide_var_pop_fieldsFieldPolicy,
	},
	campaign_guide_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_var_samp_fieldsKeySpecifier | (() => undefined | campaign_guide_var_samp_fieldsKeySpecifier),
		fields?: campaign_guide_var_samp_fieldsFieldPolicy,
	},
	campaign_guide_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_guide_variance_fieldsKeySpecifier | (() => undefined | campaign_guide_variance_fieldsKeySpecifier),
		fields?: campaign_guide_variance_fieldsFieldPolicy,
	},
	campaign_investigator?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigatorKeySpecifier | (() => undefined | campaign_investigatorKeySpecifier),
		fields?: campaign_investigatorFieldPolicy,
	},
	campaign_investigator_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_aggregateKeySpecifier | (() => undefined | campaign_investigator_aggregateKeySpecifier),
		fields?: campaign_investigator_aggregateFieldPolicy,
	},
	campaign_investigator_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_aggregate_fieldsKeySpecifier | (() => undefined | campaign_investigator_aggregate_fieldsKeySpecifier),
		fields?: campaign_investigator_aggregate_fieldsFieldPolicy,
	},
	campaign_investigator_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_avg_fieldsKeySpecifier | (() => undefined | campaign_investigator_avg_fieldsKeySpecifier),
		fields?: campaign_investigator_avg_fieldsFieldPolicy,
	},
	campaign_investigator_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_max_fieldsKeySpecifier | (() => undefined | campaign_investigator_max_fieldsKeySpecifier),
		fields?: campaign_investigator_max_fieldsFieldPolicy,
	},
	campaign_investigator_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_min_fieldsKeySpecifier | (() => undefined | campaign_investigator_min_fieldsKeySpecifier),
		fields?: campaign_investigator_min_fieldsFieldPolicy,
	},
	campaign_investigator_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_mutation_responseKeySpecifier | (() => undefined | campaign_investigator_mutation_responseKeySpecifier),
		fields?: campaign_investigator_mutation_responseFieldPolicy,
	},
	campaign_investigator_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_stddev_fieldsKeySpecifier | (() => undefined | campaign_investigator_stddev_fieldsKeySpecifier),
		fields?: campaign_investigator_stddev_fieldsFieldPolicy,
	},
	campaign_investigator_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_stddev_pop_fieldsKeySpecifier | (() => undefined | campaign_investigator_stddev_pop_fieldsKeySpecifier),
		fields?: campaign_investigator_stddev_pop_fieldsFieldPolicy,
	},
	campaign_investigator_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_stddev_samp_fieldsKeySpecifier | (() => undefined | campaign_investigator_stddev_samp_fieldsKeySpecifier),
		fields?: campaign_investigator_stddev_samp_fieldsFieldPolicy,
	},
	campaign_investigator_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_sum_fieldsKeySpecifier | (() => undefined | campaign_investigator_sum_fieldsKeySpecifier),
		fields?: campaign_investigator_sum_fieldsFieldPolicy,
	},
	campaign_investigator_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_var_pop_fieldsKeySpecifier | (() => undefined | campaign_investigator_var_pop_fieldsKeySpecifier),
		fields?: campaign_investigator_var_pop_fieldsFieldPolicy,
	},
	campaign_investigator_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_var_samp_fieldsKeySpecifier | (() => undefined | campaign_investigator_var_samp_fieldsKeySpecifier),
		fields?: campaign_investigator_var_samp_fieldsFieldPolicy,
	},
	campaign_investigator_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_investigator_variance_fieldsKeySpecifier | (() => undefined | campaign_investigator_variance_fieldsKeySpecifier),
		fields?: campaign_investigator_variance_fieldsFieldPolicy,
	},
	campaign_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_max_fieldsKeySpecifier | (() => undefined | campaign_max_fieldsKeySpecifier),
		fields?: campaign_max_fieldsFieldPolicy,
	},
	campaign_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_min_fieldsKeySpecifier | (() => undefined | campaign_min_fieldsKeySpecifier),
		fields?: campaign_min_fieldsFieldPolicy,
	},
	campaign_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_mutation_responseKeySpecifier | (() => undefined | campaign_mutation_responseKeySpecifier),
		fields?: campaign_mutation_responseFieldPolicy,
	},
	campaign_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_stddev_fieldsKeySpecifier | (() => undefined | campaign_stddev_fieldsKeySpecifier),
		fields?: campaign_stddev_fieldsFieldPolicy,
	},
	campaign_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_stddev_pop_fieldsKeySpecifier | (() => undefined | campaign_stddev_pop_fieldsKeySpecifier),
		fields?: campaign_stddev_pop_fieldsFieldPolicy,
	},
	campaign_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_stddev_samp_fieldsKeySpecifier | (() => undefined | campaign_stddev_samp_fieldsKeySpecifier),
		fields?: campaign_stddev_samp_fieldsFieldPolicy,
	},
	campaign_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_sum_fieldsKeySpecifier | (() => undefined | campaign_sum_fieldsKeySpecifier),
		fields?: campaign_sum_fieldsFieldPolicy,
	},
	campaign_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_var_pop_fieldsKeySpecifier | (() => undefined | campaign_var_pop_fieldsKeySpecifier),
		fields?: campaign_var_pop_fieldsFieldPolicy,
	},
	campaign_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_var_samp_fieldsKeySpecifier | (() => undefined | campaign_var_samp_fieldsKeySpecifier),
		fields?: campaign_var_samp_fieldsFieldPolicy,
	},
	campaign_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_variance_fieldsKeySpecifier | (() => undefined | campaign_variance_fieldsKeySpecifier),
		fields?: campaign_variance_fieldsFieldPolicy,
	},
	chaos_bag_result?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_resultKeySpecifier | (() => undefined | chaos_bag_resultKeySpecifier),
		fields?: chaos_bag_resultFieldPolicy,
	},
	chaos_bag_result_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_aggregateKeySpecifier | (() => undefined | chaos_bag_result_aggregateKeySpecifier),
		fields?: chaos_bag_result_aggregateFieldPolicy,
	},
	chaos_bag_result_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_aggregate_fieldsKeySpecifier | (() => undefined | chaos_bag_result_aggregate_fieldsKeySpecifier),
		fields?: chaos_bag_result_aggregate_fieldsFieldPolicy,
	},
	chaos_bag_result_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_avg_fieldsKeySpecifier | (() => undefined | chaos_bag_result_avg_fieldsKeySpecifier),
		fields?: chaos_bag_result_avg_fieldsFieldPolicy,
	},
	chaos_bag_result_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_max_fieldsKeySpecifier | (() => undefined | chaos_bag_result_max_fieldsKeySpecifier),
		fields?: chaos_bag_result_max_fieldsFieldPolicy,
	},
	chaos_bag_result_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_min_fieldsKeySpecifier | (() => undefined | chaos_bag_result_min_fieldsKeySpecifier),
		fields?: chaos_bag_result_min_fieldsFieldPolicy,
	},
	chaos_bag_result_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_mutation_responseKeySpecifier | (() => undefined | chaos_bag_result_mutation_responseKeySpecifier),
		fields?: chaos_bag_result_mutation_responseFieldPolicy,
	},
	chaos_bag_result_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_stddev_fieldsKeySpecifier | (() => undefined | chaos_bag_result_stddev_fieldsKeySpecifier),
		fields?: chaos_bag_result_stddev_fieldsFieldPolicy,
	},
	chaos_bag_result_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_stddev_pop_fieldsKeySpecifier | (() => undefined | chaos_bag_result_stddev_pop_fieldsKeySpecifier),
		fields?: chaos_bag_result_stddev_pop_fieldsFieldPolicy,
	},
	chaos_bag_result_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_stddev_samp_fieldsKeySpecifier | (() => undefined | chaos_bag_result_stddev_samp_fieldsKeySpecifier),
		fields?: chaos_bag_result_stddev_samp_fieldsFieldPolicy,
	},
	chaos_bag_result_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_sum_fieldsKeySpecifier | (() => undefined | chaos_bag_result_sum_fieldsKeySpecifier),
		fields?: chaos_bag_result_sum_fieldsFieldPolicy,
	},
	chaos_bag_result_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_var_pop_fieldsKeySpecifier | (() => undefined | chaos_bag_result_var_pop_fieldsKeySpecifier),
		fields?: chaos_bag_result_var_pop_fieldsFieldPolicy,
	},
	chaos_bag_result_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_var_samp_fieldsKeySpecifier | (() => undefined | chaos_bag_result_var_samp_fieldsKeySpecifier),
		fields?: chaos_bag_result_var_samp_fieldsFieldPolicy,
	},
	chaos_bag_result_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_result_variance_fieldsKeySpecifier | (() => undefined | chaos_bag_result_variance_fieldsKeySpecifier),
		fields?: chaos_bag_result_variance_fieldsFieldPolicy,
	},
	friend_status?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_statusKeySpecifier | (() => undefined | friend_statusKeySpecifier),
		fields?: friend_statusFieldPolicy,
	},
	friend_status_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_aggregateKeySpecifier | (() => undefined | friend_status_aggregateKeySpecifier),
		fields?: friend_status_aggregateFieldPolicy,
	},
	friend_status_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_aggregate_fieldsKeySpecifier | (() => undefined | friend_status_aggregate_fieldsKeySpecifier),
		fields?: friend_status_aggregate_fieldsFieldPolicy,
	},
	friend_status_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_max_fieldsKeySpecifier | (() => undefined | friend_status_max_fieldsKeySpecifier),
		fields?: friend_status_max_fieldsFieldPolicy,
	},
	friend_status_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_min_fieldsKeySpecifier | (() => undefined | friend_status_min_fieldsKeySpecifier),
		fields?: friend_status_min_fieldsFieldPolicy,
	},
	friend_status_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_mutation_responseKeySpecifier | (() => undefined | friend_status_mutation_responseKeySpecifier),
		fields?: friend_status_mutation_responseFieldPolicy,
	},
	friend_status_type?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_typeKeySpecifier | (() => undefined | friend_status_typeKeySpecifier),
		fields?: friend_status_typeFieldPolicy,
	},
	friend_status_type_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_type_aggregateKeySpecifier | (() => undefined | friend_status_type_aggregateKeySpecifier),
		fields?: friend_status_type_aggregateFieldPolicy,
	},
	friend_status_type_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_type_aggregate_fieldsKeySpecifier | (() => undefined | friend_status_type_aggregate_fieldsKeySpecifier),
		fields?: friend_status_type_aggregate_fieldsFieldPolicy,
	},
	friend_status_type_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_type_max_fieldsKeySpecifier | (() => undefined | friend_status_type_max_fieldsKeySpecifier),
		fields?: friend_status_type_max_fieldsFieldPolicy,
	},
	friend_status_type_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_type_min_fieldsKeySpecifier | (() => undefined | friend_status_type_min_fieldsKeySpecifier),
		fields?: friend_status_type_min_fieldsFieldPolicy,
	},
	friend_status_type_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | friend_status_type_mutation_responseKeySpecifier | (() => undefined | friend_status_type_mutation_responseKeySpecifier),
		fields?: friend_status_type_mutation_responseFieldPolicy,
	},
	guide_achievement?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievementKeySpecifier | (() => undefined | guide_achievementKeySpecifier),
		fields?: guide_achievementFieldPolicy,
	},
	guide_achievement_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_aggregateKeySpecifier | (() => undefined | guide_achievement_aggregateKeySpecifier),
		fields?: guide_achievement_aggregateFieldPolicy,
	},
	guide_achievement_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_aggregate_fieldsKeySpecifier | (() => undefined | guide_achievement_aggregate_fieldsKeySpecifier),
		fields?: guide_achievement_aggregate_fieldsFieldPolicy,
	},
	guide_achievement_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_avg_fieldsKeySpecifier | (() => undefined | guide_achievement_avg_fieldsKeySpecifier),
		fields?: guide_achievement_avg_fieldsFieldPolicy,
	},
	guide_achievement_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_max_fieldsKeySpecifier | (() => undefined | guide_achievement_max_fieldsKeySpecifier),
		fields?: guide_achievement_max_fieldsFieldPolicy,
	},
	guide_achievement_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_min_fieldsKeySpecifier | (() => undefined | guide_achievement_min_fieldsKeySpecifier),
		fields?: guide_achievement_min_fieldsFieldPolicy,
	},
	guide_achievement_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_mutation_responseKeySpecifier | (() => undefined | guide_achievement_mutation_responseKeySpecifier),
		fields?: guide_achievement_mutation_responseFieldPolicy,
	},
	guide_achievement_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_stddev_fieldsKeySpecifier | (() => undefined | guide_achievement_stddev_fieldsKeySpecifier),
		fields?: guide_achievement_stddev_fieldsFieldPolicy,
	},
	guide_achievement_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_stddev_pop_fieldsKeySpecifier | (() => undefined | guide_achievement_stddev_pop_fieldsKeySpecifier),
		fields?: guide_achievement_stddev_pop_fieldsFieldPolicy,
	},
	guide_achievement_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_stddev_samp_fieldsKeySpecifier | (() => undefined | guide_achievement_stddev_samp_fieldsKeySpecifier),
		fields?: guide_achievement_stddev_samp_fieldsFieldPolicy,
	},
	guide_achievement_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_sum_fieldsKeySpecifier | (() => undefined | guide_achievement_sum_fieldsKeySpecifier),
		fields?: guide_achievement_sum_fieldsFieldPolicy,
	},
	guide_achievement_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_var_pop_fieldsKeySpecifier | (() => undefined | guide_achievement_var_pop_fieldsKeySpecifier),
		fields?: guide_achievement_var_pop_fieldsFieldPolicy,
	},
	guide_achievement_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_var_samp_fieldsKeySpecifier | (() => undefined | guide_achievement_var_samp_fieldsKeySpecifier),
		fields?: guide_achievement_var_samp_fieldsFieldPolicy,
	},
	guide_achievement_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_achievement_variance_fieldsKeySpecifier | (() => undefined | guide_achievement_variance_fieldsKeySpecifier),
		fields?: guide_achievement_variance_fieldsFieldPolicy,
	},
	guide_input?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_inputKeySpecifier | (() => undefined | guide_inputKeySpecifier),
		fields?: guide_inputFieldPolicy,
	},
	guide_input_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_aggregateKeySpecifier | (() => undefined | guide_input_aggregateKeySpecifier),
		fields?: guide_input_aggregateFieldPolicy,
	},
	guide_input_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_aggregate_fieldsKeySpecifier | (() => undefined | guide_input_aggregate_fieldsKeySpecifier),
		fields?: guide_input_aggregate_fieldsFieldPolicy,
	},
	guide_input_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_avg_fieldsKeySpecifier | (() => undefined | guide_input_avg_fieldsKeySpecifier),
		fields?: guide_input_avg_fieldsFieldPolicy,
	},
	guide_input_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_max_fieldsKeySpecifier | (() => undefined | guide_input_max_fieldsKeySpecifier),
		fields?: guide_input_max_fieldsFieldPolicy,
	},
	guide_input_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_min_fieldsKeySpecifier | (() => undefined | guide_input_min_fieldsKeySpecifier),
		fields?: guide_input_min_fieldsFieldPolicy,
	},
	guide_input_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_mutation_responseKeySpecifier | (() => undefined | guide_input_mutation_responseKeySpecifier),
		fields?: guide_input_mutation_responseFieldPolicy,
	},
	guide_input_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_stddev_fieldsKeySpecifier | (() => undefined | guide_input_stddev_fieldsKeySpecifier),
		fields?: guide_input_stddev_fieldsFieldPolicy,
	},
	guide_input_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_stddev_pop_fieldsKeySpecifier | (() => undefined | guide_input_stddev_pop_fieldsKeySpecifier),
		fields?: guide_input_stddev_pop_fieldsFieldPolicy,
	},
	guide_input_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_stddev_samp_fieldsKeySpecifier | (() => undefined | guide_input_stddev_samp_fieldsKeySpecifier),
		fields?: guide_input_stddev_samp_fieldsFieldPolicy,
	},
	guide_input_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_sum_fieldsKeySpecifier | (() => undefined | guide_input_sum_fieldsKeySpecifier),
		fields?: guide_input_sum_fieldsFieldPolicy,
	},
	guide_input_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_var_pop_fieldsKeySpecifier | (() => undefined | guide_input_var_pop_fieldsKeySpecifier),
		fields?: guide_input_var_pop_fieldsFieldPolicy,
	},
	guide_input_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_var_samp_fieldsKeySpecifier | (() => undefined | guide_input_var_samp_fieldsKeySpecifier),
		fields?: guide_input_var_samp_fieldsFieldPolicy,
	},
	guide_input_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | guide_input_variance_fieldsKeySpecifier | (() => undefined | guide_input_variance_fieldsKeySpecifier),
		fields?: guide_input_variance_fieldsFieldPolicy,
	},
	investigator_data?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_dataKeySpecifier | (() => undefined | investigator_dataKeySpecifier),
		fields?: investigator_dataFieldPolicy,
	},
	investigator_data_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_aggregateKeySpecifier | (() => undefined | investigator_data_aggregateKeySpecifier),
		fields?: investigator_data_aggregateFieldPolicy,
	},
	investigator_data_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_aggregate_fieldsKeySpecifier | (() => undefined | investigator_data_aggregate_fieldsKeySpecifier),
		fields?: investigator_data_aggregate_fieldsFieldPolicy,
	},
	investigator_data_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_avg_fieldsKeySpecifier | (() => undefined | investigator_data_avg_fieldsKeySpecifier),
		fields?: investigator_data_avg_fieldsFieldPolicy,
	},
	investigator_data_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_max_fieldsKeySpecifier | (() => undefined | investigator_data_max_fieldsKeySpecifier),
		fields?: investigator_data_max_fieldsFieldPolicy,
	},
	investigator_data_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_min_fieldsKeySpecifier | (() => undefined | investigator_data_min_fieldsKeySpecifier),
		fields?: investigator_data_min_fieldsFieldPolicy,
	},
	investigator_data_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_mutation_responseKeySpecifier | (() => undefined | investigator_data_mutation_responseKeySpecifier),
		fields?: investigator_data_mutation_responseFieldPolicy,
	},
	investigator_data_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_stddev_fieldsKeySpecifier | (() => undefined | investigator_data_stddev_fieldsKeySpecifier),
		fields?: investigator_data_stddev_fieldsFieldPolicy,
	},
	investigator_data_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_stddev_pop_fieldsKeySpecifier | (() => undefined | investigator_data_stddev_pop_fieldsKeySpecifier),
		fields?: investigator_data_stddev_pop_fieldsFieldPolicy,
	},
	investigator_data_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_stddev_samp_fieldsKeySpecifier | (() => undefined | investigator_data_stddev_samp_fieldsKeySpecifier),
		fields?: investigator_data_stddev_samp_fieldsFieldPolicy,
	},
	investigator_data_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_sum_fieldsKeySpecifier | (() => undefined | investigator_data_sum_fieldsKeySpecifier),
		fields?: investigator_data_sum_fieldsFieldPolicy,
	},
	investigator_data_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_var_pop_fieldsKeySpecifier | (() => undefined | investigator_data_var_pop_fieldsKeySpecifier),
		fields?: investigator_data_var_pop_fieldsFieldPolicy,
	},
	investigator_data_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_var_samp_fieldsKeySpecifier | (() => undefined | investigator_data_var_samp_fieldsKeySpecifier),
		fields?: investigator_data_var_samp_fieldsFieldPolicy,
	},
	investigator_data_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | investigator_data_variance_fieldsKeySpecifier | (() => undefined | investigator_data_variance_fieldsKeySpecifier),
		fields?: investigator_data_variance_fieldsFieldPolicy,
	},
	latest_decks?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decksKeySpecifier | (() => undefined | latest_decksKeySpecifier),
		fields?: latest_decksFieldPolicy,
	},
	latest_decks_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_aggregateKeySpecifier | (() => undefined | latest_decks_aggregateKeySpecifier),
		fields?: latest_decks_aggregateFieldPolicy,
	},
	latest_decks_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_aggregate_fieldsKeySpecifier | (() => undefined | latest_decks_aggregate_fieldsKeySpecifier),
		fields?: latest_decks_aggregate_fieldsFieldPolicy,
	},
	latest_decks_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_avg_fieldsKeySpecifier | (() => undefined | latest_decks_avg_fieldsKeySpecifier),
		fields?: latest_decks_avg_fieldsFieldPolicy,
	},
	latest_decks_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_max_fieldsKeySpecifier | (() => undefined | latest_decks_max_fieldsKeySpecifier),
		fields?: latest_decks_max_fieldsFieldPolicy,
	},
	latest_decks_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_min_fieldsKeySpecifier | (() => undefined | latest_decks_min_fieldsKeySpecifier),
		fields?: latest_decks_min_fieldsFieldPolicy,
	},
	latest_decks_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_mutation_responseKeySpecifier | (() => undefined | latest_decks_mutation_responseKeySpecifier),
		fields?: latest_decks_mutation_responseFieldPolicy,
	},
	latest_decks_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_stddev_fieldsKeySpecifier | (() => undefined | latest_decks_stddev_fieldsKeySpecifier),
		fields?: latest_decks_stddev_fieldsFieldPolicy,
	},
	latest_decks_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_stddev_pop_fieldsKeySpecifier | (() => undefined | latest_decks_stddev_pop_fieldsKeySpecifier),
		fields?: latest_decks_stddev_pop_fieldsFieldPolicy,
	},
	latest_decks_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_stddev_samp_fieldsKeySpecifier | (() => undefined | latest_decks_stddev_samp_fieldsKeySpecifier),
		fields?: latest_decks_stddev_samp_fieldsFieldPolicy,
	},
	latest_decks_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_sum_fieldsKeySpecifier | (() => undefined | latest_decks_sum_fieldsKeySpecifier),
		fields?: latest_decks_sum_fieldsFieldPolicy,
	},
	latest_decks_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_var_pop_fieldsKeySpecifier | (() => undefined | latest_decks_var_pop_fieldsKeySpecifier),
		fields?: latest_decks_var_pop_fieldsFieldPolicy,
	},
	latest_decks_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_var_samp_fieldsKeySpecifier | (() => undefined | latest_decks_var_samp_fieldsKeySpecifier),
		fields?: latest_decks_var_samp_fieldsFieldPolicy,
	},
	latest_decks_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | latest_decks_variance_fieldsKeySpecifier | (() => undefined | latest_decks_variance_fieldsKeySpecifier),
		fields?: latest_decks_variance_fieldsFieldPolicy,
	},
	local_decks?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decksKeySpecifier | (() => undefined | local_decksKeySpecifier),
		fields?: local_decksFieldPolicy,
	},
	local_decks_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_aggregateKeySpecifier | (() => undefined | local_decks_aggregateKeySpecifier),
		fields?: local_decks_aggregateFieldPolicy,
	},
	local_decks_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_aggregate_fieldsKeySpecifier | (() => undefined | local_decks_aggregate_fieldsKeySpecifier),
		fields?: local_decks_aggregate_fieldsFieldPolicy,
	},
	local_decks_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_avg_fieldsKeySpecifier | (() => undefined | local_decks_avg_fieldsKeySpecifier),
		fields?: local_decks_avg_fieldsFieldPolicy,
	},
	local_decks_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_max_fieldsKeySpecifier | (() => undefined | local_decks_max_fieldsKeySpecifier),
		fields?: local_decks_max_fieldsFieldPolicy,
	},
	local_decks_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_min_fieldsKeySpecifier | (() => undefined | local_decks_min_fieldsKeySpecifier),
		fields?: local_decks_min_fieldsFieldPolicy,
	},
	local_decks_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_mutation_responseKeySpecifier | (() => undefined | local_decks_mutation_responseKeySpecifier),
		fields?: local_decks_mutation_responseFieldPolicy,
	},
	local_decks_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_stddev_fieldsKeySpecifier | (() => undefined | local_decks_stddev_fieldsKeySpecifier),
		fields?: local_decks_stddev_fieldsFieldPolicy,
	},
	local_decks_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_stddev_pop_fieldsKeySpecifier | (() => undefined | local_decks_stddev_pop_fieldsKeySpecifier),
		fields?: local_decks_stddev_pop_fieldsFieldPolicy,
	},
	local_decks_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_stddev_samp_fieldsKeySpecifier | (() => undefined | local_decks_stddev_samp_fieldsKeySpecifier),
		fields?: local_decks_stddev_samp_fieldsFieldPolicy,
	},
	local_decks_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_sum_fieldsKeySpecifier | (() => undefined | local_decks_sum_fieldsKeySpecifier),
		fields?: local_decks_sum_fieldsFieldPolicy,
	},
	local_decks_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_var_pop_fieldsKeySpecifier | (() => undefined | local_decks_var_pop_fieldsKeySpecifier),
		fields?: local_decks_var_pop_fieldsFieldPolicy,
	},
	local_decks_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_var_samp_fieldsKeySpecifier | (() => undefined | local_decks_var_samp_fieldsKeySpecifier),
		fields?: local_decks_var_samp_fieldsFieldPolicy,
	},
	local_decks_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | local_decks_variance_fieldsKeySpecifier | (() => undefined | local_decks_variance_fieldsKeySpecifier),
		fields?: local_decks_variance_fieldsFieldPolicy,
	},
	mutation_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | mutation_rootKeySpecifier | (() => undefined | mutation_rootKeySpecifier),
		fields?: mutation_rootFieldPolicy,
	},
	query_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | query_rootKeySpecifier | (() => undefined | query_rootKeySpecifier),
		fields?: query_rootFieldPolicy,
	},
	subscription_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | subscription_rootKeySpecifier | (() => undefined | subscription_rootKeySpecifier),
		fields?: subscription_rootFieldPolicy,
	},
	user_campaigns?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaignsKeySpecifier | (() => undefined | user_campaignsKeySpecifier),
		fields?: user_campaignsFieldPolicy,
	},
	user_campaigns_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_aggregateKeySpecifier | (() => undefined | user_campaigns_aggregateKeySpecifier),
		fields?: user_campaigns_aggregateFieldPolicy,
	},
	user_campaigns_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_aggregate_fieldsKeySpecifier | (() => undefined | user_campaigns_aggregate_fieldsKeySpecifier),
		fields?: user_campaigns_aggregate_fieldsFieldPolicy,
	},
	user_campaigns_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_avg_fieldsKeySpecifier | (() => undefined | user_campaigns_avg_fieldsKeySpecifier),
		fields?: user_campaigns_avg_fieldsFieldPolicy,
	},
	user_campaigns_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_max_fieldsKeySpecifier | (() => undefined | user_campaigns_max_fieldsKeySpecifier),
		fields?: user_campaigns_max_fieldsFieldPolicy,
	},
	user_campaigns_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_min_fieldsKeySpecifier | (() => undefined | user_campaigns_min_fieldsKeySpecifier),
		fields?: user_campaigns_min_fieldsFieldPolicy,
	},
	user_campaigns_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_mutation_responseKeySpecifier | (() => undefined | user_campaigns_mutation_responseKeySpecifier),
		fields?: user_campaigns_mutation_responseFieldPolicy,
	},
	user_campaigns_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_stddev_fieldsKeySpecifier | (() => undefined | user_campaigns_stddev_fieldsKeySpecifier),
		fields?: user_campaigns_stddev_fieldsFieldPolicy,
	},
	user_campaigns_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_stddev_pop_fieldsKeySpecifier | (() => undefined | user_campaigns_stddev_pop_fieldsKeySpecifier),
		fields?: user_campaigns_stddev_pop_fieldsFieldPolicy,
	},
	user_campaigns_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_stddev_samp_fieldsKeySpecifier | (() => undefined | user_campaigns_stddev_samp_fieldsKeySpecifier),
		fields?: user_campaigns_stddev_samp_fieldsFieldPolicy,
	},
	user_campaigns_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_sum_fieldsKeySpecifier | (() => undefined | user_campaigns_sum_fieldsKeySpecifier),
		fields?: user_campaigns_sum_fieldsFieldPolicy,
	},
	user_campaigns_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_var_pop_fieldsKeySpecifier | (() => undefined | user_campaigns_var_pop_fieldsKeySpecifier),
		fields?: user_campaigns_var_pop_fieldsFieldPolicy,
	},
	user_campaigns_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_var_samp_fieldsKeySpecifier | (() => undefined | user_campaigns_var_samp_fieldsKeySpecifier),
		fields?: user_campaigns_var_samp_fieldsFieldPolicy,
	},
	user_campaigns_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_campaigns_variance_fieldsKeySpecifier | (() => undefined | user_campaigns_variance_fieldsKeySpecifier),
		fields?: user_campaigns_variance_fieldsFieldPolicy,
	},
	user_friends?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_friendsKeySpecifier | (() => undefined | user_friendsKeySpecifier),
		fields?: user_friendsFieldPolicy,
	},
	user_friends_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_friends_aggregateKeySpecifier | (() => undefined | user_friends_aggregateKeySpecifier),
		fields?: user_friends_aggregateFieldPolicy,
	},
	user_friends_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_friends_aggregate_fieldsKeySpecifier | (() => undefined | user_friends_aggregate_fieldsKeySpecifier),
		fields?: user_friends_aggregate_fieldsFieldPolicy,
	},
	user_friends_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_friends_max_fieldsKeySpecifier | (() => undefined | user_friends_max_fieldsKeySpecifier),
		fields?: user_friends_max_fieldsFieldPolicy,
	},
	user_friends_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_friends_min_fieldsKeySpecifier | (() => undefined | user_friends_min_fieldsKeySpecifier),
		fields?: user_friends_min_fieldsFieldPolicy,
	},
	user_friends_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_friends_mutation_responseKeySpecifier | (() => undefined | user_friends_mutation_responseKeySpecifier),
		fields?: user_friends_mutation_responseFieldPolicy,
	},
	user_received_friend_requests?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_received_friend_requestsKeySpecifier | (() => undefined | user_received_friend_requestsKeySpecifier),
		fields?: user_received_friend_requestsFieldPolicy,
	},
	user_received_friend_requests_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_received_friend_requests_aggregateKeySpecifier | (() => undefined | user_received_friend_requests_aggregateKeySpecifier),
		fields?: user_received_friend_requests_aggregateFieldPolicy,
	},
	user_received_friend_requests_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_received_friend_requests_aggregate_fieldsKeySpecifier | (() => undefined | user_received_friend_requests_aggregate_fieldsKeySpecifier),
		fields?: user_received_friend_requests_aggregate_fieldsFieldPolicy,
	},
	user_received_friend_requests_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_received_friend_requests_max_fieldsKeySpecifier | (() => undefined | user_received_friend_requests_max_fieldsKeySpecifier),
		fields?: user_received_friend_requests_max_fieldsFieldPolicy,
	},
	user_received_friend_requests_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_received_friend_requests_min_fieldsKeySpecifier | (() => undefined | user_received_friend_requests_min_fieldsKeySpecifier),
		fields?: user_received_friend_requests_min_fieldsFieldPolicy,
	},
	user_received_friend_requests_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_received_friend_requests_mutation_responseKeySpecifier | (() => undefined | user_received_friend_requests_mutation_responseKeySpecifier),
		fields?: user_received_friend_requests_mutation_responseFieldPolicy,
	},
	user_sent_friend_requests?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_sent_friend_requestsKeySpecifier | (() => undefined | user_sent_friend_requestsKeySpecifier),
		fields?: user_sent_friend_requestsFieldPolicy,
	},
	user_sent_friend_requests_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_sent_friend_requests_aggregateKeySpecifier | (() => undefined | user_sent_friend_requests_aggregateKeySpecifier),
		fields?: user_sent_friend_requests_aggregateFieldPolicy,
	},
	user_sent_friend_requests_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_sent_friend_requests_aggregate_fieldsKeySpecifier | (() => undefined | user_sent_friend_requests_aggregate_fieldsKeySpecifier),
		fields?: user_sent_friend_requests_aggregate_fieldsFieldPolicy,
	},
	user_sent_friend_requests_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_sent_friend_requests_max_fieldsKeySpecifier | (() => undefined | user_sent_friend_requests_max_fieldsKeySpecifier),
		fields?: user_sent_friend_requests_max_fieldsFieldPolicy,
	},
	user_sent_friend_requests_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_sent_friend_requests_min_fieldsKeySpecifier | (() => undefined | user_sent_friend_requests_min_fieldsKeySpecifier),
		fields?: user_sent_friend_requests_min_fieldsFieldPolicy,
	},
	user_sent_friend_requests_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_sent_friend_requests_mutation_responseKeySpecifier | (() => undefined | user_sent_friend_requests_mutation_responseKeySpecifier),
		fields?: user_sent_friend_requests_mutation_responseFieldPolicy,
	},
	users?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | usersKeySpecifier | (() => undefined | usersKeySpecifier),
		fields?: usersFieldPolicy,
	},
	users_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_aggregateKeySpecifier | (() => undefined | users_aggregateKeySpecifier),
		fields?: users_aggregateFieldPolicy,
	},
	users_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_aggregate_fieldsKeySpecifier | (() => undefined | users_aggregate_fieldsKeySpecifier),
		fields?: users_aggregate_fieldsFieldPolicy,
	},
	users_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_max_fieldsKeySpecifier | (() => undefined | users_max_fieldsKeySpecifier),
		fields?: users_max_fieldsFieldPolicy,
	},
	users_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_min_fieldsKeySpecifier | (() => undefined | users_min_fieldsKeySpecifier),
		fields?: users_min_fieldsFieldPolicy,
	},
	users_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_mutation_responseKeySpecifier | (() => undefined | users_mutation_responseKeySpecifier),
		fields?: users_mutation_responseFieldPolicy,
	}
};