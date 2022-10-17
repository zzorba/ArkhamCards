import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type all_cardKeySpecifier = ('alt_art_investigator' | 'alternate_of_code' | 'alternate_required_code' | 'back_link_id' | 'backimagesrc' | 'backimageurl' | 'clues' | 'clues_fixed' | 'code' | 'cost' | 'customization_options' | 'deck_limit' | 'deck_options' | 'deck_requirements' | 'doom' | 'double_sided' | 'duplicate_of_code' | 'encounter_code' | 'encounter_position' | 'encounter_sets' | 'encounter_sets_aggregate' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'errata_date' | 'exceptional' | 'exile' | 'faction2_code' | 'faction3_code' | 'faction_code' | 'gender' | 'heals_damage' | 'heals_horror' | 'health' | 'health_per_investigator' | 'hidden' | 'id' | 'illustrator' | 'imagesrc' | 'imageurl' | 'is_unique' | 'linked' | 'linked_card' | 'myriad' | 'official' | 'pack' | 'pack_code' | 'pack_position' | 'packs' | 'packs_aggregate' | 'permanent' | 'position' | 'preview' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_customization_change' | 'real_customization_text' | 'real_encounter_set_name' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_taboo_text_change' | 'real_text' | 'real_traits' | 'restrictions' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'spoiler' | 'stage' | 'subtype_code' | 'taboo_placeholder' | 'taboo_set' | 'taboo_set_id' | 'taboo_xp' | 'tags' | 'translations' | 'translations_aggregate' | 'type' | 'type_code' | 'updated_at' | 'vengeance' | 'version' | 'victory' | 'xp' | all_cardKeySpecifier)[];
export type all_cardFieldPolicy = {
	alt_art_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	alternate_of_code?: FieldPolicy<any> | FieldReadFunction<any>,
	alternate_required_code?: FieldPolicy<any> | FieldReadFunction<any>,
	back_link_id?: FieldPolicy<any> | FieldReadFunction<any>,
	backimagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	backimageurl?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	clues_fixed?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	customization_options?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_options?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_requirements?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	double_sided?: FieldPolicy<any> | FieldReadFunction<any>,
	duplicate_of_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_sets?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_sets_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	errata_date?: FieldPolicy<any> | FieldReadFunction<any>,
	exceptional?: FieldPolicy<any> | FieldReadFunction<any>,
	exile?: FieldPolicy<any> | FieldReadFunction<any>,
	faction2_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction3_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	gender?: FieldPolicy<any> | FieldReadFunction<any>,
	heals_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	heals_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	health_per_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	hidden?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	imagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	imageurl?: FieldPolicy<any> | FieldReadFunction<any>,
	is_unique?: FieldPolicy<any> | FieldReadFunction<any>,
	linked?: FieldPolicy<any> | FieldReadFunction<any>,
	linked_card?: FieldPolicy<any> | FieldReadFunction<any>,
	myriad?: FieldPolicy<any> | FieldReadFunction<any>,
	official?: FieldPolicy<any> | FieldReadFunction<any>,
	pack?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	packs?: FieldPolicy<any> | FieldReadFunction<any>,
	packs_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	permanent?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	preview?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_customization_change?: FieldPolicy<any> | FieldReadFunction<any>,
	real_customization_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_encounter_set_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_taboo_text_change?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	restrictions?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	spoiler?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_placeholder?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	translations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_aggregateKeySpecifier = ('aggregate' | 'nodes' | all_card_aggregateKeySpecifier)[];
export type all_card_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | all_card_aggregate_fieldsKeySpecifier)[];
export type all_card_aggregate_fieldsFieldPolicy = {
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
export type all_card_avg_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_avg_fieldsKeySpecifier)[];
export type all_card_avg_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_max_fieldsKeySpecifier = ('alternate_of_code' | 'alternate_required_code' | 'back_link_id' | 'backimagesrc' | 'backimageurl' | 'clues' | 'code' | 'cost' | 'deck_limit' | 'doom' | 'duplicate_of_code' | 'encounter_code' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'errata_date' | 'faction2_code' | 'faction3_code' | 'faction_code' | 'health' | 'id' | 'illustrator' | 'imagesrc' | 'imageurl' | 'pack_code' | 'pack_position' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_customization_change' | 'real_customization_text' | 'real_encounter_set_name' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_taboo_text_change' | 'real_text' | 'real_traits' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'taboo_set_id' | 'taboo_xp' | 'updated_at' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_max_fieldsKeySpecifier)[];
export type all_card_max_fieldsFieldPolicy = {
	alternate_of_code?: FieldPolicy<any> | FieldReadFunction<any>,
	alternate_required_code?: FieldPolicy<any> | FieldReadFunction<any>,
	back_link_id?: FieldPolicy<any> | FieldReadFunction<any>,
	backimagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	backimageurl?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	duplicate_of_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	errata_date?: FieldPolicy<any> | FieldReadFunction<any>,
	faction2_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction3_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	imagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	imageurl?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_customization_change?: FieldPolicy<any> | FieldReadFunction<any>,
	real_customization_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_encounter_set_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_taboo_text_change?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_min_fieldsKeySpecifier = ('alternate_of_code' | 'alternate_required_code' | 'back_link_id' | 'backimagesrc' | 'backimageurl' | 'clues' | 'code' | 'cost' | 'deck_limit' | 'doom' | 'duplicate_of_code' | 'encounter_code' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'errata_date' | 'faction2_code' | 'faction3_code' | 'faction_code' | 'health' | 'id' | 'illustrator' | 'imagesrc' | 'imageurl' | 'pack_code' | 'pack_position' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_customization_change' | 'real_customization_text' | 'real_encounter_set_name' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_taboo_text_change' | 'real_text' | 'real_traits' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'taboo_set_id' | 'taboo_xp' | 'updated_at' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_min_fieldsKeySpecifier)[];
export type all_card_min_fieldsFieldPolicy = {
	alternate_of_code?: FieldPolicy<any> | FieldReadFunction<any>,
	alternate_required_code?: FieldPolicy<any> | FieldReadFunction<any>,
	back_link_id?: FieldPolicy<any> | FieldReadFunction<any>,
	backimagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	backimageurl?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	duplicate_of_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	errata_date?: FieldPolicy<any> | FieldReadFunction<any>,
	faction2_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction3_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	imagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	imageurl?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_customization_change?: FieldPolicy<any> | FieldReadFunction<any>,
	real_customization_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_encounter_set_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_taboo_text_change?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | all_card_mutation_responseKeySpecifier)[];
export type all_card_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_stddev_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_stddev_fieldsKeySpecifier)[];
export type all_card_stddev_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_stddev_pop_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_stddev_pop_fieldsKeySpecifier)[];
export type all_card_stddev_pop_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_stddev_samp_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_stddev_samp_fieldsKeySpecifier)[];
export type all_card_stddev_samp_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_sum_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_sum_fieldsKeySpecifier)[];
export type all_card_sum_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_textKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'customization_change' | 'customization_text' | 'encounter_name' | 'flavor' | 'id' | 'locale' | 'name' | 'slot' | 'subname' | 'taboo_text_change' | 'text' | 'traits' | 'updated_at' | all_card_textKeySpecifier)[];
export type all_card_textFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	customization_change?: FieldPolicy<any> | FieldReadFunction<any>,
	customization_text?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_text_change?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_text_aggregateKeySpecifier = ('aggregate' | 'nodes' | all_card_text_aggregateKeySpecifier)[];
export type all_card_text_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_text_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | all_card_text_aggregate_fieldsKeySpecifier)[];
export type all_card_text_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_text_max_fieldsKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'customization_change' | 'customization_text' | 'encounter_name' | 'flavor' | 'id' | 'locale' | 'name' | 'slot' | 'subname' | 'taboo_text_change' | 'text' | 'traits' | 'updated_at' | all_card_text_max_fieldsKeySpecifier)[];
export type all_card_text_max_fieldsFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	customization_change?: FieldPolicy<any> | FieldReadFunction<any>,
	customization_text?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_text_change?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_text_min_fieldsKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'customization_change' | 'customization_text' | 'encounter_name' | 'flavor' | 'id' | 'locale' | 'name' | 'slot' | 'subname' | 'taboo_text_change' | 'text' | 'traits' | 'updated_at' | all_card_text_min_fieldsKeySpecifier)[];
export type all_card_text_min_fieldsFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	customization_change?: FieldPolicy<any> | FieldReadFunction<any>,
	customization_text?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_text_change?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_text_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | all_card_text_mutation_responseKeySpecifier)[];
export type all_card_text_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updatedKeySpecifier = ('card_count' | 'cards_updated_at' | 'locale' | 'translation_updated_at' | all_card_updatedKeySpecifier)[];
export type all_card_updatedFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	cards_updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	translation_updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_aggregateKeySpecifier = ('aggregate' | 'nodes' | all_card_updated_aggregateKeySpecifier)[];
export type all_card_updated_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | all_card_updated_aggregate_fieldsKeySpecifier)[];
export type all_card_updated_aggregate_fieldsFieldPolicy = {
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
export type all_card_updated_avg_fieldsKeySpecifier = ('card_count' | all_card_updated_avg_fieldsKeySpecifier)[];
export type all_card_updated_avg_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_max_fieldsKeySpecifier = ('card_count' | 'cards_updated_at' | 'locale' | 'translation_updated_at' | all_card_updated_max_fieldsKeySpecifier)[];
export type all_card_updated_max_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	cards_updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	translation_updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_min_fieldsKeySpecifier = ('card_count' | 'cards_updated_at' | 'locale' | 'translation_updated_at' | all_card_updated_min_fieldsKeySpecifier)[];
export type all_card_updated_min_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	cards_updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	translation_updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | all_card_updated_mutation_responseKeySpecifier)[];
export type all_card_updated_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_stddev_fieldsKeySpecifier = ('card_count' | all_card_updated_stddev_fieldsKeySpecifier)[];
export type all_card_updated_stddev_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_stddev_pop_fieldsKeySpecifier = ('card_count' | all_card_updated_stddev_pop_fieldsKeySpecifier)[];
export type all_card_updated_stddev_pop_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_stddev_samp_fieldsKeySpecifier = ('card_count' | all_card_updated_stddev_samp_fieldsKeySpecifier)[];
export type all_card_updated_stddev_samp_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_sum_fieldsKeySpecifier = ('card_count' | all_card_updated_sum_fieldsKeySpecifier)[];
export type all_card_updated_sum_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_var_pop_fieldsKeySpecifier = ('card_count' | all_card_updated_var_pop_fieldsKeySpecifier)[];
export type all_card_updated_var_pop_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_var_samp_fieldsKeySpecifier = ('card_count' | all_card_updated_var_samp_fieldsKeySpecifier)[];
export type all_card_updated_var_samp_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_updated_variance_fieldsKeySpecifier = ('card_count' | all_card_updated_variance_fieldsKeySpecifier)[];
export type all_card_updated_variance_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_var_pop_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_var_pop_fieldsKeySpecifier)[];
export type all_card_var_pop_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_var_samp_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_var_samp_fieldsKeySpecifier)[];
export type all_card_var_samp_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type all_card_variance_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'taboo_set_id' | 'taboo_xp' | 'vengeance' | 'version' | 'victory' | 'xp' | all_card_variance_fieldsKeySpecifier)[];
export type all_card_variance_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_id?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_xp?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
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
export type campaignKeySpecifier = ('access' | 'access_aggregate' | 'archived' | 'base_decks' | 'base_decks_aggregate' | 'campaignNotes' | 'campaign_guide' | 'chaosBag' | 'chaos_bag_result' | 'chaos_bag_result_aggregate' | 'created_at' | 'cycleCode' | 'deleted' | 'difficulty' | 'guide_version' | 'guided' | 'id' | 'investigator_data' | 'investigator_data_aggregate' | 'investigators' | 'investigators_aggregate' | 'latest_decks' | 'latest_decks_aggregate' | 'link_a_campaign' | 'link_a_campaign_id' | 'link_b_campaign' | 'link_b_campaign_id' | 'link_campaign_id' | 'linked_campaign' | 'name' | 'owner' | 'owner_id' | 'scenarioResults' | 'showInterludes' | 'standaloneId' | 'tarot_reading' | 'updated_at' | 'uuid' | 'weaknessSet' | campaignKeySpecifier)[];
export type campaignFieldPolicy = {
	access?: FieldPolicy<any> | FieldReadFunction<any>,
	access_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	archived?: FieldPolicy<any> | FieldReadFunction<any>,
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
	tarot_reading?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type campaign_deckKeySpecifier = ('archived' | 'arkhamdb_id' | 'arkhamdb_user' | 'base' | 'campaign' | 'campaign_id' | 'content' | 'content_hash' | 'id' | 'investigator' | 'investigator_data' | 'local_uuid' | 'next_deck' | 'next_deck_id' | 'other_decks' | 'other_decks_aggregate' | 'owner' | 'owner_id' | 'previous_deck' | 'previous_decks' | 'previous_decks_aggregate' | 'updated_at' | campaign_deckKeySpecifier)[];
export type campaign_deckFieldPolicy = {
	archived?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type campaign_difficultyKeySpecifier = ('value' | campaign_difficultyKeySpecifier)[];
export type campaign_difficultyFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_difficulty_aggregateKeySpecifier = ('aggregate' | 'nodes' | campaign_difficulty_aggregateKeySpecifier)[];
export type campaign_difficulty_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_difficulty_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | campaign_difficulty_aggregate_fieldsKeySpecifier)[];
export type campaign_difficulty_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_difficulty_max_fieldsKeySpecifier = ('value' | campaign_difficulty_max_fieldsKeySpecifier)[];
export type campaign_difficulty_max_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_difficulty_min_fieldsKeySpecifier = ('value' | campaign_difficulty_min_fieldsKeySpecifier)[];
export type campaign_difficulty_min_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaign_difficulty_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | campaign_difficulty_mutation_responseKeySpecifier)[];
export type campaign_difficulty_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
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
export type campaigns_by_cycleKeySpecifier = ('count' | 'cyclecode' | campaigns_by_cycleKeySpecifier)[];
export type campaigns_by_cycleFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	cyclecode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_aggregateKeySpecifier = ('aggregate' | 'nodes' | campaigns_by_cycle_aggregateKeySpecifier)[];
export type campaigns_by_cycle_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | campaigns_by_cycle_aggregate_fieldsKeySpecifier)[];
export type campaigns_by_cycle_aggregate_fieldsFieldPolicy = {
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
export type campaigns_by_cycle_avg_fieldsKeySpecifier = ('count' | campaigns_by_cycle_avg_fieldsKeySpecifier)[];
export type campaigns_by_cycle_avg_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_max_fieldsKeySpecifier = ('count' | 'cyclecode' | campaigns_by_cycle_max_fieldsKeySpecifier)[];
export type campaigns_by_cycle_max_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	cyclecode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_min_fieldsKeySpecifier = ('count' | 'cyclecode' | campaigns_by_cycle_min_fieldsKeySpecifier)[];
export type campaigns_by_cycle_min_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	cyclecode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_stddev_fieldsKeySpecifier = ('count' | campaigns_by_cycle_stddev_fieldsKeySpecifier)[];
export type campaigns_by_cycle_stddev_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_stddev_pop_fieldsKeySpecifier = ('count' | campaigns_by_cycle_stddev_pop_fieldsKeySpecifier)[];
export type campaigns_by_cycle_stddev_pop_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_stddev_samp_fieldsKeySpecifier = ('count' | campaigns_by_cycle_stddev_samp_fieldsKeySpecifier)[];
export type campaigns_by_cycle_stddev_samp_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_sum_fieldsKeySpecifier = ('count' | campaigns_by_cycle_sum_fieldsKeySpecifier)[];
export type campaigns_by_cycle_sum_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_var_pop_fieldsKeySpecifier = ('count' | campaigns_by_cycle_var_pop_fieldsKeySpecifier)[];
export type campaigns_by_cycle_var_pop_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_var_samp_fieldsKeySpecifier = ('count' | campaigns_by_cycle_var_samp_fieldsKeySpecifier)[];
export type campaigns_by_cycle_var_samp_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type campaigns_by_cycle_variance_fieldsKeySpecifier = ('count' | campaigns_by_cycle_variance_fieldsKeySpecifier)[];
export type campaigns_by_cycle_variance_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cardKeySpecifier = ('back_link' | 'clues' | 'code' | 'cost' | 'deck_limit' | 'deck_options' | 'deck_requirements' | 'doom' | 'double_sided' | 'encounter_code' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'exceptional' | 'exile' | 'faction_code' | 'health' | 'hidden' | 'illustrator' | 'is_unique' | 'myriad' | 'pack_code' | 'pack_position' | 'packs' | 'packs_aggregate' | 'permanent' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_text' | 'real_traits' | 'restrictions' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'translations' | 'translations_aggregate' | 'type_code' | 'victory' | cardKeySpecifier)[];
export type cardFieldPolicy = {
	back_link?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_options?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_requirements?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	double_sided?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	exceptional?: FieldPolicy<any> | FieldReadFunction<any>,
	exile?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	hidden?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	is_unique?: FieldPolicy<any> | FieldReadFunction<any>,
	myriad?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	packs?: FieldPolicy<any> | FieldReadFunction<any>,
	packs_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	permanent?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	restrictions?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	translations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_aggregateKeySpecifier)[];
export type card_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | card_aggregate_fieldsKeySpecifier)[];
export type card_aggregate_fieldsFieldPolicy = {
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
export type card_avg_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_avg_fieldsKeySpecifier)[];
export type card_avg_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycleKeySpecifier = ('code' | 'locale' | 'name' | 'official' | 'packs' | 'packs_aggregate' | 'position' | card_cycleKeySpecifier)[];
export type card_cycleFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	official?: FieldPolicy<any> | FieldReadFunction<any>,
	packs?: FieldPolicy<any> | FieldReadFunction<any>,
	packs_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_cycle_aggregateKeySpecifier)[];
export type card_cycle_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | card_cycle_aggregate_fieldsKeySpecifier)[];
export type card_cycle_aggregate_fieldsFieldPolicy = {
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
export type card_cycle_avg_fieldsKeySpecifier = ('position' | card_cycle_avg_fieldsKeySpecifier)[];
export type card_cycle_avg_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_max_fieldsKeySpecifier = ('code' | 'locale' | 'name' | 'position' | card_cycle_max_fieldsKeySpecifier)[];
export type card_cycle_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_min_fieldsKeySpecifier = ('code' | 'locale' | 'name' | 'position' | card_cycle_min_fieldsKeySpecifier)[];
export type card_cycle_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_cycle_mutation_responseKeySpecifier)[];
export type card_cycle_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_stddev_fieldsKeySpecifier = ('position' | card_cycle_stddev_fieldsKeySpecifier)[];
export type card_cycle_stddev_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_stddev_pop_fieldsKeySpecifier = ('position' | card_cycle_stddev_pop_fieldsKeySpecifier)[];
export type card_cycle_stddev_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_stddev_samp_fieldsKeySpecifier = ('position' | card_cycle_stddev_samp_fieldsKeySpecifier)[];
export type card_cycle_stddev_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_sum_fieldsKeySpecifier = ('position' | card_cycle_sum_fieldsKeySpecifier)[];
export type card_cycle_sum_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_var_pop_fieldsKeySpecifier = ('position' | card_cycle_var_pop_fieldsKeySpecifier)[];
export type card_cycle_var_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_var_samp_fieldsKeySpecifier = ('position' | card_cycle_var_samp_fieldsKeySpecifier)[];
export type card_cycle_var_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_cycle_variance_fieldsKeySpecifier = ('position' | card_cycle_variance_fieldsKeySpecifier)[];
export type card_cycle_variance_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_encounter_setKeySpecifier = ('code' | 'locale' | 'name' | 'official' | card_encounter_setKeySpecifier)[];
export type card_encounter_setFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	official?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_encounter_set_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_encounter_set_aggregateKeySpecifier)[];
export type card_encounter_set_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_encounter_set_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | card_encounter_set_aggregate_fieldsKeySpecifier)[];
export type card_encounter_set_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_encounter_set_max_fieldsKeySpecifier = ('code' | 'locale' | 'name' | card_encounter_set_max_fieldsKeySpecifier)[];
export type card_encounter_set_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_encounter_set_min_fieldsKeySpecifier = ('code' | 'locale' | 'name' | card_encounter_set_min_fieldsKeySpecifier)[];
export type card_encounter_set_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_encounter_set_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_encounter_set_mutation_responseKeySpecifier)[];
export type card_encounter_set_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_max_fieldsKeySpecifier = ('back_link' | 'clues' | 'code' | 'cost' | 'deck_limit' | 'doom' | 'encounter_code' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'faction_code' | 'health' | 'illustrator' | 'pack_code' | 'pack_position' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_text' | 'real_traits' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'type_code' | 'victory' | card_max_fieldsKeySpecifier)[];
export type card_max_fieldsFieldPolicy = {
	back_link?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_min_fieldsKeySpecifier = ('back_link' | 'clues' | 'code' | 'cost' | 'deck_limit' | 'doom' | 'encounter_code' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'faction_code' | 'health' | 'illustrator' | 'pack_code' | 'pack_position' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_text' | 'real_traits' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'type_code' | 'victory' | card_min_fieldsKeySpecifier)[];
export type card_min_fieldsFieldPolicy = {
	back_link?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_mutation_responseKeySpecifier)[];
export type card_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_packKeySpecifier = ('code' | 'cycle' | 'cycle_code' | 'locale' | 'name' | 'official' | 'position' | card_packKeySpecifier)[];
export type card_packFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	official?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_pack_aggregateKeySpecifier)[];
export type card_pack_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | card_pack_aggregate_fieldsKeySpecifier)[];
export type card_pack_aggregate_fieldsFieldPolicy = {
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
export type card_pack_avg_fieldsKeySpecifier = ('position' | card_pack_avg_fieldsKeySpecifier)[];
export type card_pack_avg_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_max_fieldsKeySpecifier = ('code' | 'cycle_code' | 'locale' | 'name' | 'position' | card_pack_max_fieldsKeySpecifier)[];
export type card_pack_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_min_fieldsKeySpecifier = ('code' | 'cycle_code' | 'locale' | 'name' | 'position' | card_pack_min_fieldsKeySpecifier)[];
export type card_pack_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_pack_mutation_responseKeySpecifier)[];
export type card_pack_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_stddev_fieldsKeySpecifier = ('position' | card_pack_stddev_fieldsKeySpecifier)[];
export type card_pack_stddev_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_stddev_pop_fieldsKeySpecifier = ('position' | card_pack_stddev_pop_fieldsKeySpecifier)[];
export type card_pack_stddev_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_stddev_samp_fieldsKeySpecifier = ('position' | card_pack_stddev_samp_fieldsKeySpecifier)[];
export type card_pack_stddev_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_sum_fieldsKeySpecifier = ('position' | card_pack_sum_fieldsKeySpecifier)[];
export type card_pack_sum_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_var_pop_fieldsKeySpecifier = ('position' | card_pack_var_pop_fieldsKeySpecifier)[];
export type card_pack_var_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_var_samp_fieldsKeySpecifier = ('position' | card_pack_var_samp_fieldsKeySpecifier)[];
export type card_pack_var_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_pack_variance_fieldsKeySpecifier = ('position' | card_pack_variance_fieldsKeySpecifier)[];
export type card_pack_variance_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_stddev_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_stddev_fieldsKeySpecifier)[];
export type card_stddev_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_stddev_pop_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_stddev_pop_fieldsKeySpecifier)[];
export type card_stddev_pop_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_stddev_samp_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_stddev_samp_fieldsKeySpecifier)[];
export type card_stddev_samp_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_subtype_nameKeySpecifier = ('code' | 'locale' | 'name' | card_subtype_nameKeySpecifier)[];
export type card_subtype_nameFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_subtype_name_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_subtype_name_aggregateKeySpecifier)[];
export type card_subtype_name_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_subtype_name_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | card_subtype_name_aggregate_fieldsKeySpecifier)[];
export type card_subtype_name_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_subtype_name_max_fieldsKeySpecifier = ('code' | 'locale' | 'name' | card_subtype_name_max_fieldsKeySpecifier)[];
export type card_subtype_name_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_subtype_name_min_fieldsKeySpecifier = ('code' | 'locale' | 'name' | card_subtype_name_min_fieldsKeySpecifier)[];
export type card_subtype_name_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_subtype_name_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_subtype_name_mutation_responseKeySpecifier)[];
export type card_subtype_name_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_sum_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_sum_fieldsKeySpecifier)[];
export type card_sum_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_textKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'code' | 'encounter_name' | 'flavor' | 'locale' | 'name' | 'slot' | 'subname' | 'text' | 'traits' | card_textKeySpecifier)[];
export type card_textFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_text_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_text_aggregateKeySpecifier)[];
export type card_text_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_text_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | card_text_aggregate_fieldsKeySpecifier)[];
export type card_text_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_text_max_fieldsKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'code' | 'encounter_name' | 'flavor' | 'locale' | 'name' | 'slot' | 'subname' | 'text' | 'traits' | card_text_max_fieldsKeySpecifier)[];
export type card_text_max_fieldsFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_text_min_fieldsKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'code' | 'encounter_name' | 'flavor' | 'locale' | 'name' | 'slot' | 'subname' | 'text' | 'traits' | card_text_min_fieldsKeySpecifier)[];
export type card_text_min_fieldsFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_text_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_text_mutation_responseKeySpecifier)[];
export type card_text_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_codeKeySpecifier = ('code' | card_type_codeKeySpecifier)[];
export type card_type_codeFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_code_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_type_code_aggregateKeySpecifier)[];
export type card_type_code_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_code_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | card_type_code_aggregate_fieldsKeySpecifier)[];
export type card_type_code_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_code_max_fieldsKeySpecifier = ('code' | card_type_code_max_fieldsKeySpecifier)[];
export type card_type_code_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_code_min_fieldsKeySpecifier = ('code' | card_type_code_min_fieldsKeySpecifier)[];
export type card_type_code_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_code_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_type_code_mutation_responseKeySpecifier)[];
export type card_type_code_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_nameKeySpecifier = ('code' | 'locale' | 'name' | card_type_nameKeySpecifier)[];
export type card_type_nameFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_name_aggregateKeySpecifier = ('aggregate' | 'nodes' | card_type_name_aggregateKeySpecifier)[];
export type card_type_name_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_name_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | card_type_name_aggregate_fieldsKeySpecifier)[];
export type card_type_name_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_name_max_fieldsKeySpecifier = ('locale' | 'name' | card_type_name_max_fieldsKeySpecifier)[];
export type card_type_name_max_fieldsFieldPolicy = {
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_name_min_fieldsKeySpecifier = ('locale' | 'name' | card_type_name_min_fieldsKeySpecifier)[];
export type card_type_name_min_fieldsFieldPolicy = {
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_type_name_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | card_type_name_mutation_responseKeySpecifier)[];
export type card_type_name_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_var_pop_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_var_pop_fieldsKeySpecifier)[];
export type card_var_pop_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_var_samp_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_var_samp_fieldsKeySpecifier)[];
export type card_var_samp_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type card_variance_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'victory' | card_variance_fieldsKeySpecifier)[];
export type card_variance_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_resultKeySpecifier = ('bless' | 'campaign' | 'created_at' | 'curse' | 'difficulty' | 'drawn' | 'id' | 'sealed' | 'tarot' | 'tarot_mode' | 'totalDrawn' | 'updated_at' | chaos_bag_resultKeySpecifier)[];
export type chaos_bag_resultFieldPolicy = {
	bless?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	curse?: FieldPolicy<any> | FieldReadFunction<any>,
	difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	drawn?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sealed?: FieldPolicy<any> | FieldReadFunction<any>,
	tarot?: FieldPolicy<any> | FieldReadFunction<any>,
	tarot_mode?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type chaos_bag_tarot_modeKeySpecifier = ('value' | chaos_bag_tarot_modeKeySpecifier)[];
export type chaos_bag_tarot_modeFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_tarot_mode_aggregateKeySpecifier = ('aggregate' | 'nodes' | chaos_bag_tarot_mode_aggregateKeySpecifier)[];
export type chaos_bag_tarot_mode_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_tarot_mode_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | chaos_bag_tarot_mode_aggregate_fieldsKeySpecifier)[];
export type chaos_bag_tarot_mode_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_tarot_mode_max_fieldsKeySpecifier = ('value' | chaos_bag_tarot_mode_max_fieldsKeySpecifier)[];
export type chaos_bag_tarot_mode_max_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_tarot_mode_min_fieldsKeySpecifier = ('value' | chaos_bag_tarot_mode_min_fieldsKeySpecifier)[];
export type chaos_bag_tarot_mode_min_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type chaos_bag_tarot_mode_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | chaos_bag_tarot_mode_mutation_responseKeySpecifier)[];
export type chaos_bag_tarot_mode_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycleKeySpecifier = ('code' | 'official' | 'packs' | 'packs_aggregate' | 'position' | 'real_name' | 'translations' | 'translations_aggregate' | cycleKeySpecifier)[];
export type cycleFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	official?: FieldPolicy<any> | FieldReadFunction<any>,
	packs?: FieldPolicy<any> | FieldReadFunction<any>,
	packs_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	translations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_aggregateKeySpecifier = ('aggregate' | 'nodes' | cycle_aggregateKeySpecifier)[];
export type cycle_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | cycle_aggregate_fieldsKeySpecifier)[];
export type cycle_aggregate_fieldsFieldPolicy = {
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
export type cycle_avg_fieldsKeySpecifier = ('position' | cycle_avg_fieldsKeySpecifier)[];
export type cycle_avg_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_max_fieldsKeySpecifier = ('code' | 'position' | 'real_name' | cycle_max_fieldsKeySpecifier)[];
export type cycle_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_min_fieldsKeySpecifier = ('code' | 'position' | 'real_name' | cycle_min_fieldsKeySpecifier)[];
export type cycle_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | cycle_mutation_responseKeySpecifier)[];
export type cycle_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_nameKeySpecifier = ('code' | 'locale' | 'name' | cycle_nameKeySpecifier)[];
export type cycle_nameFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_name_aggregateKeySpecifier = ('aggregate' | 'nodes' | cycle_name_aggregateKeySpecifier)[];
export type cycle_name_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_name_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | cycle_name_aggregate_fieldsKeySpecifier)[];
export type cycle_name_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_name_max_fieldsKeySpecifier = ('code' | 'locale' | 'name' | cycle_name_max_fieldsKeySpecifier)[];
export type cycle_name_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_name_min_fieldsKeySpecifier = ('code' | 'locale' | 'name' | cycle_name_min_fieldsKeySpecifier)[];
export type cycle_name_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_name_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | cycle_name_mutation_responseKeySpecifier)[];
export type cycle_name_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_stddev_fieldsKeySpecifier = ('position' | cycle_stddev_fieldsKeySpecifier)[];
export type cycle_stddev_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_stddev_pop_fieldsKeySpecifier = ('position' | cycle_stddev_pop_fieldsKeySpecifier)[];
export type cycle_stddev_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_stddev_samp_fieldsKeySpecifier = ('position' | cycle_stddev_samp_fieldsKeySpecifier)[];
export type cycle_stddev_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_sum_fieldsKeySpecifier = ('position' | cycle_sum_fieldsKeySpecifier)[];
export type cycle_sum_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_var_pop_fieldsKeySpecifier = ('position' | cycle_var_pop_fieldsKeySpecifier)[];
export type cycle_var_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_var_samp_fieldsKeySpecifier = ('position' | cycle_var_samp_fieldsKeySpecifier)[];
export type cycle_var_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type cycle_variance_fieldsKeySpecifier = ('position' | cycle_variance_fieldsKeySpecifier)[];
export type cycle_variance_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faction_nameKeySpecifier = ('code' | 'locale' | 'name' | faction_nameKeySpecifier)[];
export type faction_nameFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faction_name_aggregateKeySpecifier = ('aggregate' | 'nodes' | faction_name_aggregateKeySpecifier)[];
export type faction_name_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faction_name_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | faction_name_aggregate_fieldsKeySpecifier)[];
export type faction_name_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faction_name_max_fieldsKeySpecifier = ('code' | 'locale' | 'name' | faction_name_max_fieldsKeySpecifier)[];
export type faction_name_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faction_name_min_fieldsKeySpecifier = ('code' | 'locale' | 'name' | faction_name_min_fieldsKeySpecifier)[];
export type faction_name_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faction_name_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | faction_name_mutation_responseKeySpecifier)[];
export type faction_name_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faqKeySpecifier = ('code' | 'faq_texts' | 'faq_texts_aggregate' | 'text' | faqKeySpecifier)[];
export type faqFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_texts?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_texts_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_aggregateKeySpecifier = ('aggregate' | 'nodes' | faq_aggregateKeySpecifier)[];
export type faq_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | faq_aggregate_fieldsKeySpecifier)[];
export type faq_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_max_fieldsKeySpecifier = ('code' | 'text' | faq_max_fieldsKeySpecifier)[];
export type faq_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_min_fieldsKeySpecifier = ('code' | 'text' | faq_min_fieldsKeySpecifier)[];
export type faq_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | faq_mutation_responseKeySpecifier)[];
export type faq_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_textKeySpecifier = ('code' | 'locale' | 'text' | faq_textKeySpecifier)[];
export type faq_textFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_text_aggregateKeySpecifier = ('aggregate' | 'nodes' | faq_text_aggregateKeySpecifier)[];
export type faq_text_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_text_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | faq_text_aggregate_fieldsKeySpecifier)[];
export type faq_text_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_text_max_fieldsKeySpecifier = ('code' | 'locale' | 'text' | faq_text_max_fieldsKeySpecifier)[];
export type faq_text_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_text_min_fieldsKeySpecifier = ('code' | 'locale' | 'text' | faq_text_min_fieldsKeySpecifier)[];
export type faq_text_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type faq_text_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | faq_text_mutation_responseKeySpecifier)[];
export type faq_text_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
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
export type full_cardKeySpecifier = ('alternate_required_code' | 'back_link' | 'backimagesrc' | 'clues' | 'clues_fixed' | 'code' | 'cost' | 'deck_limit' | 'deck_options' | 'deck_requirements' | 'doom' | 'double_sided' | 'encounter_code' | 'encounter_position' | 'encounter_sets' | 'encounter_sets_aggregate' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'exceptional' | 'exile' | 'faction2_code' | 'faction3_code' | 'faction_code' | 'health' | 'health_per_investigator' | 'hidden' | 'illustrator' | 'imagesrc' | 'is_unique' | 'linked_card' | 'myriad' | 'pack_code' | 'pack_position' | 'packs' | 'packs_aggregate' | 'permanent' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_encounter_set_name' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_text' | 'real_traits' | 'restrictions' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'translations' | 'translations_aggregate' | 'type_code' | 'updated_at' | 'vengeance' | 'version' | 'victory' | 'xp' | full_cardKeySpecifier)[];
export type full_cardFieldPolicy = {
	alternate_required_code?: FieldPolicy<any> | FieldReadFunction<any>,
	back_link?: FieldPolicy<any> | FieldReadFunction<any>,
	backimagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	clues_fixed?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_options?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_requirements?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	double_sided?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_sets?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_sets_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	exceptional?: FieldPolicy<any> | FieldReadFunction<any>,
	exile?: FieldPolicy<any> | FieldReadFunction<any>,
	faction2_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction3_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	health_per_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	hidden?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	imagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	is_unique?: FieldPolicy<any> | FieldReadFunction<any>,
	linked_card?: FieldPolicy<any> | FieldReadFunction<any>,
	myriad?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	packs?: FieldPolicy<any> | FieldReadFunction<any>,
	packs_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	permanent?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_encounter_set_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	restrictions?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	translations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_aggregateKeySpecifier = ('aggregate' | 'nodes' | full_card_aggregateKeySpecifier)[];
export type full_card_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | full_card_aggregate_fieldsKeySpecifier)[];
export type full_card_aggregate_fieldsFieldPolicy = {
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
export type full_card_avg_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_avg_fieldsKeySpecifier)[];
export type full_card_avg_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_max_fieldsKeySpecifier = ('alternate_required_code' | 'back_link' | 'backimagesrc' | 'clues' | 'code' | 'cost' | 'deck_limit' | 'doom' | 'encounter_code' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'faction2_code' | 'faction3_code' | 'faction_code' | 'health' | 'illustrator' | 'imagesrc' | 'pack_code' | 'pack_position' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_encounter_set_name' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_text' | 'real_traits' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'updated_at' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_max_fieldsKeySpecifier)[];
export type full_card_max_fieldsFieldPolicy = {
	alternate_required_code?: FieldPolicy<any> | FieldReadFunction<any>,
	back_link?: FieldPolicy<any> | FieldReadFunction<any>,
	backimagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	faction2_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction3_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	imagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_encounter_set_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_min_fieldsKeySpecifier = ('alternate_required_code' | 'back_link' | 'backimagesrc' | 'clues' | 'code' | 'cost' | 'deck_limit' | 'doom' | 'encounter_code' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'faction2_code' | 'faction3_code' | 'faction_code' | 'health' | 'illustrator' | 'imagesrc' | 'pack_code' | 'pack_position' | 'position' | 'quantity' | 'real_back_flavor' | 'real_back_name' | 'real_back_text' | 'real_encounter_set_name' | 'real_flavor' | 'real_name' | 'real_pack_name' | 'real_slot' | 'real_subname' | 'real_text' | 'real_traits' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'subtype_code' | 'updated_at' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_min_fieldsKeySpecifier)[];
export type full_card_min_fieldsFieldPolicy = {
	alternate_required_code?: FieldPolicy<any> | FieldReadFunction<any>,
	back_link?: FieldPolicy<any> | FieldReadFunction<any>,
	backimagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	faction2_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction3_code?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_code?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	illustrator?: FieldPolicy<any> | FieldReadFunction<any>,
	imagesrc?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_code?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_encounter_set_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	real_slot?: FieldPolicy<any> | FieldReadFunction<any>,
	real_subname?: FieldPolicy<any> | FieldReadFunction<any>,
	real_text?: FieldPolicy<any> | FieldReadFunction<any>,
	real_traits?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	subtype_code?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | full_card_mutation_responseKeySpecifier)[];
export type full_card_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_stddev_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_stddev_fieldsKeySpecifier)[];
export type full_card_stddev_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_stddev_pop_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_stddev_pop_fieldsKeySpecifier)[];
export type full_card_stddev_pop_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_stddev_samp_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_stddev_samp_fieldsKeySpecifier)[];
export type full_card_stddev_samp_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_sum_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_sum_fieldsKeySpecifier)[];
export type full_card_sum_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_textKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'code' | 'encounter_name' | 'flavor' | 'locale' | 'name' | 'slot' | 'subname' | 'text' | 'traits' | full_card_textKeySpecifier)[];
export type full_card_textFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_text_aggregateKeySpecifier = ('aggregate' | 'nodes' | full_card_text_aggregateKeySpecifier)[];
export type full_card_text_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_text_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | full_card_text_aggregate_fieldsKeySpecifier)[];
export type full_card_text_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_text_max_fieldsKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'code' | 'encounter_name' | 'flavor' | 'locale' | 'name' | 'slot' | 'subname' | 'text' | 'traits' | full_card_text_max_fieldsKeySpecifier)[];
export type full_card_text_max_fieldsFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_text_min_fieldsKeySpecifier = ('back_flavor' | 'back_name' | 'back_text' | 'code' | 'encounter_name' | 'flavor' | 'locale' | 'name' | 'slot' | 'subname' | 'text' | 'traits' | full_card_text_min_fieldsKeySpecifier)[];
export type full_card_text_min_fieldsFieldPolicy = {
	back_flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	back_name?: FieldPolicy<any> | FieldReadFunction<any>,
	back_text?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	flavor?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slot?: FieldPolicy<any> | FieldReadFunction<any>,
	subname?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	traits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_text_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | full_card_text_mutation_responseKeySpecifier)[];
export type full_card_text_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_var_pop_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_var_pop_fieldsKeySpecifier)[];
export type full_card_var_pop_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_var_samp_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_var_samp_fieldsKeySpecifier)[];
export type full_card_var_samp_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_card_variance_fieldsKeySpecifier = ('clues' | 'cost' | 'deck_limit' | 'doom' | 'encounter_position' | 'enemy_damage' | 'enemy_evade' | 'enemy_fight' | 'enemy_horror' | 'health' | 'pack_position' | 'position' | 'quantity' | 'sanity' | 'shroud' | 'skill_agility' | 'skill_combat' | 'skill_intellect' | 'skill_wild' | 'skill_willpower' | 'stage' | 'vengeance' | 'version' | 'victory' | 'xp' | full_card_variance_fieldsKeySpecifier)[];
export type full_card_variance_fieldsFieldPolicy = {
	clues?: FieldPolicy<any> | FieldReadFunction<any>,
	cost?: FieldPolicy<any> | FieldReadFunction<any>,
	deck_limit?: FieldPolicy<any> | FieldReadFunction<any>,
	doom?: FieldPolicy<any> | FieldReadFunction<any>,
	encounter_position?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_damage?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_evade?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_fight?: FieldPolicy<any> | FieldReadFunction<any>,
	enemy_horror?: FieldPolicy<any> | FieldReadFunction<any>,
	health?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_position?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sanity?: FieldPolicy<any> | FieldReadFunction<any>,
	shroud?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_agility?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_combat?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_intellect?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_wild?: FieldPolicy<any> | FieldReadFunction<any>,
	skill_willpower?: FieldPolicy<any> | FieldReadFunction<any>,
	stage?: FieldPolicy<any> | FieldReadFunction<any>,
	vengeance?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	victory?: FieldPolicy<any> | FieldReadFunction<any>,
	xp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type genderKeySpecifier = ('code' | genderKeySpecifier)[];
export type genderFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type gender_aggregateKeySpecifier = ('aggregate' | 'nodes' | gender_aggregateKeySpecifier)[];
export type gender_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type gender_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | gender_aggregate_fieldsKeySpecifier)[];
export type gender_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type gender_max_fieldsKeySpecifier = ('code' | gender_max_fieldsKeySpecifier)[];
export type gender_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type gender_min_fieldsKeySpecifier = ('code' | gender_min_fieldsKeySpecifier)[];
export type gender_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type gender_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | gender_mutation_responseKeySpecifier)[];
export type gender_mutation_responseFieldPolicy = {
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
export type guide_inputKeySpecifier = ('campaign' | 'campaign_id' | 'created_at' | 'id' | 'inserted_idx' | 'payload' | 'scenario' | 'step' | 'type' | guide_inputKeySpecifier)[];
export type guide_inputFieldPolicy = {
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type guide_input_avg_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_avg_fieldsKeySpecifier)[];
export type guide_input_avg_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_max_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'id' | 'inserted_idx' | 'scenario' | 'step' | 'type' | guide_input_max_fieldsKeySpecifier)[];
export type guide_input_max_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>,
	scenario?: FieldPolicy<any> | FieldReadFunction<any>,
	step?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_min_fieldsKeySpecifier = ('campaign_id' | 'created_at' | 'id' | 'inserted_idx' | 'scenario' | 'step' | 'type' | guide_input_min_fieldsKeySpecifier)[];
export type guide_input_min_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>,
	scenario?: FieldPolicy<any> | FieldReadFunction<any>,
	step?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | guide_input_mutation_responseKeySpecifier)[];
export type guide_input_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_stddev_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_stddev_fieldsKeySpecifier)[];
export type guide_input_stddev_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_stddev_pop_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_stddev_pop_fieldsKeySpecifier)[];
export type guide_input_stddev_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_stddev_samp_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_stddev_samp_fieldsKeySpecifier)[];
export type guide_input_stddev_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_sum_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_sum_fieldsKeySpecifier)[];
export type guide_input_sum_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_var_pop_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_var_pop_fieldsKeySpecifier)[];
export type guide_input_var_pop_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_var_samp_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_var_samp_fieldsKeySpecifier)[];
export type guide_input_var_samp_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type guide_input_variance_fieldsKeySpecifier = ('campaign_id' | 'inserted_idx' | guide_input_variance_fieldsKeySpecifier)[];
export type guide_input_variance_fieldsFieldPolicy = {
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	inserted_idx?: FieldPolicy<any> | FieldReadFunction<any>
};
export type investigator_dataKeySpecifier = ('addedCards' | 'availableXp' | 'campaign_data' | 'campaign_id' | 'cardCounts' | 'created_at' | 'id' | 'ignoreStoryAssets' | 'insane' | 'investigator' | 'killed' | 'mental' | 'physical' | 'removedCards' | 'specialXp' | 'spentXp' | 'storyAssets' | 'updated_at' | investigator_dataKeySpecifier)[];
export type investigator_dataFieldPolicy = {
	addedCards?: FieldPolicy<any> | FieldReadFunction<any>,
	availableXp?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_data?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_id?: FieldPolicy<any> | FieldReadFunction<any>,
	cardCounts?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type mutation_rootKeySpecifier = ('delete_all_card' | 'delete_all_card_by_pk' | 'delete_all_card_text' | 'delete_all_card_text_by_pk' | 'delete_all_card_updated' | 'delete_all_card_updated_by_pk' | 'delete_base_decks' | 'delete_campaign' | 'delete_campaign_access' | 'delete_campaign_access_by_pk' | 'delete_campaign_by_pk' | 'delete_campaign_deck' | 'delete_campaign_deck_by_pk' | 'delete_campaign_difficulty' | 'delete_campaign_difficulty_by_pk' | 'delete_campaign_guide' | 'delete_campaign_investigator' | 'delete_campaign_investigator_by_pk' | 'delete_card' | 'delete_card_by_pk' | 'delete_card_cycle' | 'delete_card_cycle_by_pk' | 'delete_card_encounter_set' | 'delete_card_encounter_set_by_pk' | 'delete_card_pack' | 'delete_card_pack_by_pk' | 'delete_card_subtype_name' | 'delete_card_subtype_name_by_pk' | 'delete_card_text' | 'delete_card_text_by_pk' | 'delete_card_type_code' | 'delete_card_type_code_by_pk' | 'delete_card_type_name' | 'delete_card_type_name_by_pk' | 'delete_chaos_bag_result' | 'delete_chaos_bag_result_by_pk' | 'delete_chaos_bag_tarot_mode' | 'delete_chaos_bag_tarot_mode_by_pk' | 'delete_cycle' | 'delete_cycle_by_pk' | 'delete_cycle_name' | 'delete_cycle_name_by_pk' | 'delete_faction_name' | 'delete_faction_name_by_pk' | 'delete_faq' | 'delete_faq_by_pk' | 'delete_faq_text' | 'delete_faq_text_by_pk' | 'delete_friend_status' | 'delete_friend_status_by_pk' | 'delete_friend_status_type' | 'delete_friend_status_type_by_pk' | 'delete_full_card' | 'delete_full_card_by_pk' | 'delete_full_card_text' | 'delete_full_card_text_by_pk' | 'delete_gender' | 'delete_gender_by_pk' | 'delete_guide_achievement' | 'delete_guide_achievement_by_pk' | 'delete_guide_input' | 'delete_guide_input_by_pk' | 'delete_investigator_data' | 'delete_investigator_data_by_pk' | 'delete_latest_decks' | 'delete_local_decks' | 'delete_pack' | 'delete_pack_by_pk' | 'delete_pack_name' | 'delete_pack_name_by_pk' | 'delete_taboo_set' | 'delete_taboo_set_by_pk' | 'delete_user_campaigns' | 'delete_user_flag' | 'delete_user_flag_by_pk' | 'delete_user_flag_type' | 'delete_user_flag_type_by_pk' | 'delete_user_friends' | 'delete_user_received_friend_requests' | 'delete_user_sent_friend_requests' | 'delete_user_settings' | 'delete_user_settings_by_pk' | 'delete_users' | 'delete_users_by_pk' | 'insert_all_card' | 'insert_all_card_one' | 'insert_all_card_text' | 'insert_all_card_text_one' | 'insert_all_card_updated' | 'insert_all_card_updated_one' | 'insert_base_decks' | 'insert_base_decks_one' | 'insert_campaign' | 'insert_campaign_access' | 'insert_campaign_access_one' | 'insert_campaign_deck' | 'insert_campaign_deck_one' | 'insert_campaign_difficulty' | 'insert_campaign_difficulty_one' | 'insert_campaign_guide' | 'insert_campaign_guide_one' | 'insert_campaign_investigator' | 'insert_campaign_investigator_one' | 'insert_campaign_one' | 'insert_card' | 'insert_card_cycle' | 'insert_card_cycle_one' | 'insert_card_encounter_set' | 'insert_card_encounter_set_one' | 'insert_card_one' | 'insert_card_pack' | 'insert_card_pack_one' | 'insert_card_subtype_name' | 'insert_card_subtype_name_one' | 'insert_card_text' | 'insert_card_text_one' | 'insert_card_type_code' | 'insert_card_type_code_one' | 'insert_card_type_name' | 'insert_card_type_name_one' | 'insert_chaos_bag_result' | 'insert_chaos_bag_result_one' | 'insert_chaos_bag_tarot_mode' | 'insert_chaos_bag_tarot_mode_one' | 'insert_cycle' | 'insert_cycle_name' | 'insert_cycle_name_one' | 'insert_cycle_one' | 'insert_faction_name' | 'insert_faction_name_one' | 'insert_faq' | 'insert_faq_one' | 'insert_faq_text' | 'insert_faq_text_one' | 'insert_friend_status' | 'insert_friend_status_one' | 'insert_friend_status_type' | 'insert_friend_status_type_one' | 'insert_full_card' | 'insert_full_card_one' | 'insert_full_card_text' | 'insert_full_card_text_one' | 'insert_gender' | 'insert_gender_one' | 'insert_guide_achievement' | 'insert_guide_achievement_one' | 'insert_guide_input' | 'insert_guide_input_one' | 'insert_investigator_data' | 'insert_investigator_data_one' | 'insert_latest_decks' | 'insert_latest_decks_one' | 'insert_local_decks' | 'insert_local_decks_one' | 'insert_pack' | 'insert_pack_name' | 'insert_pack_name_one' | 'insert_pack_one' | 'insert_taboo_set' | 'insert_taboo_set_one' | 'insert_user_campaigns' | 'insert_user_campaigns_one' | 'insert_user_flag' | 'insert_user_flag_one' | 'insert_user_flag_type' | 'insert_user_flag_type_one' | 'insert_user_friends' | 'insert_user_friends_one' | 'insert_user_received_friend_requests' | 'insert_user_received_friend_requests_one' | 'insert_user_sent_friend_requests' | 'insert_user_sent_friend_requests_one' | 'insert_user_settings' | 'insert_user_settings_one' | 'insert_users' | 'insert_users_one' | 'update_all_card' | 'update_all_card_by_pk' | 'update_all_card_many' | 'update_all_card_text' | 'update_all_card_text_by_pk' | 'update_all_card_text_many' | 'update_all_card_updated' | 'update_all_card_updated_by_pk' | 'update_all_card_updated_many' | 'update_base_decks' | 'update_base_decks_many' | 'update_campaign' | 'update_campaign_access' | 'update_campaign_access_by_pk' | 'update_campaign_access_many' | 'update_campaign_by_pk' | 'update_campaign_deck' | 'update_campaign_deck_by_pk' | 'update_campaign_deck_many' | 'update_campaign_difficulty' | 'update_campaign_difficulty_by_pk' | 'update_campaign_difficulty_many' | 'update_campaign_guide' | 'update_campaign_guide_many' | 'update_campaign_investigator' | 'update_campaign_investigator_by_pk' | 'update_campaign_investigator_many' | 'update_campaign_many' | 'update_card' | 'update_card_by_pk' | 'update_card_cycle' | 'update_card_cycle_by_pk' | 'update_card_cycle_many' | 'update_card_encounter_set' | 'update_card_encounter_set_by_pk' | 'update_card_encounter_set_many' | 'update_card_many' | 'update_card_pack' | 'update_card_pack_by_pk' | 'update_card_pack_many' | 'update_card_subtype_name' | 'update_card_subtype_name_by_pk' | 'update_card_subtype_name_many' | 'update_card_text' | 'update_card_text_by_pk' | 'update_card_text_many' | 'update_card_type_code' | 'update_card_type_code_by_pk' | 'update_card_type_code_many' | 'update_card_type_name' | 'update_card_type_name_by_pk' | 'update_card_type_name_many' | 'update_chaos_bag_result' | 'update_chaos_bag_result_by_pk' | 'update_chaos_bag_result_many' | 'update_chaos_bag_tarot_mode' | 'update_chaos_bag_tarot_mode_by_pk' | 'update_chaos_bag_tarot_mode_many' | 'update_cycle' | 'update_cycle_by_pk' | 'update_cycle_many' | 'update_cycle_name' | 'update_cycle_name_by_pk' | 'update_cycle_name_many' | 'update_faction_name' | 'update_faction_name_by_pk' | 'update_faction_name_many' | 'update_faq' | 'update_faq_by_pk' | 'update_faq_many' | 'update_faq_text' | 'update_faq_text_by_pk' | 'update_faq_text_many' | 'update_friend_status' | 'update_friend_status_by_pk' | 'update_friend_status_many' | 'update_friend_status_type' | 'update_friend_status_type_by_pk' | 'update_friend_status_type_many' | 'update_full_card' | 'update_full_card_by_pk' | 'update_full_card_many' | 'update_full_card_text' | 'update_full_card_text_by_pk' | 'update_full_card_text_many' | 'update_gender' | 'update_gender_by_pk' | 'update_gender_many' | 'update_guide_achievement' | 'update_guide_achievement_by_pk' | 'update_guide_achievement_many' | 'update_guide_input' | 'update_guide_input_by_pk' | 'update_guide_input_many' | 'update_investigator_data' | 'update_investigator_data_by_pk' | 'update_investigator_data_many' | 'update_latest_decks' | 'update_latest_decks_many' | 'update_local_decks' | 'update_local_decks_many' | 'update_pack' | 'update_pack_by_pk' | 'update_pack_many' | 'update_pack_name' | 'update_pack_name_by_pk' | 'update_pack_name_many' | 'update_taboo_set' | 'update_taboo_set_by_pk' | 'update_taboo_set_many' | 'update_user_campaigns' | 'update_user_campaigns_many' | 'update_user_flag' | 'update_user_flag_by_pk' | 'update_user_flag_many' | 'update_user_flag_type' | 'update_user_flag_type_by_pk' | 'update_user_flag_type_many' | 'update_user_friends' | 'update_user_friends_many' | 'update_user_received_friend_requests' | 'update_user_received_friend_requests_many' | 'update_user_sent_friend_requests' | 'update_user_sent_friend_requests_many' | 'update_user_settings' | 'update_user_settings_by_pk' | 'update_user_settings_many' | 'update_users' | 'update_users_by_pk' | 'update_users_many' | mutation_rootKeySpecifier)[];
export type mutation_rootFieldPolicy = {
	delete_all_card?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_all_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_all_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_all_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_all_card_updated?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_all_card_updated_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_access_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_deck_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_difficulty_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_encounter_set?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_encounter_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_subtype_name?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_subtype_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_type_code_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_type_name?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_card_type_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_chaos_bag_tarot_mode?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_chaos_bag_tarot_mode_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_cycle_name?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_cycle_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_faction_name?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_faction_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_faq?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_faq_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_faq_text?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_faq_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_full_card?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_full_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_full_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_full_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_gender?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_gender_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_achievement_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_guide_input_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_investigator_data_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_pack_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_taboo_set?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_taboo_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_flag?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_flag_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_flag_type?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_flag_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_settings?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_settings_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_users?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_all_card?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_all_card_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_all_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_all_card_text_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_all_card_updated?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_all_card_updated_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_base_decks_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_access_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_deck_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_difficulty_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_guide_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_investigator_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_campaign_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_cycle_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_encounter_set?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_encounter_set_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_pack_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_subtype_name?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_subtype_name_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_text_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_type_code_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_type_name?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_card_type_name_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_chaos_bag_result_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_chaos_bag_tarot_mode?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_chaos_bag_tarot_mode_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_cycle_name?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_cycle_name_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_cycle_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_faction_name?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_faction_name_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_faq?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_faq_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_faq_text?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_faq_text_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_friend_status_type_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_full_card?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_full_card_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_full_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_full_card_text_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_gender?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_gender_one?: FieldPolicy<any> | FieldReadFunction<any>,
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
	insert_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_pack_name_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_pack_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_taboo_set?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_taboo_set_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_campaigns_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_flag?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_flag_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_flag_type?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_flag_type_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_friends_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_received_friend_requests_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_sent_friend_requests_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_settings?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_settings_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_users?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_users_one?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_text_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_updated?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_updated_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_all_card_updated_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_base_decks_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_access_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_access_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_deck_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_deck_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_difficulty_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_difficulty_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_guide_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_investigator_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_campaign_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_cycle_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_encounter_set?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_encounter_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_encounter_set_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_pack_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_subtype_name?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_subtype_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_subtype_name_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_text_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_type_code_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_type_code_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_type_name?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_type_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_card_type_name_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_result_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_tarot_mode?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_tarot_mode_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_chaos_bag_tarot_mode_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	update_cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_cycle_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_cycle_name?: FieldPolicy<any> | FieldReadFunction<any>,
	update_cycle_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_cycle_name_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faction_name?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faction_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faction_name_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faq?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faq_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faq_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faq_text?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faq_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_faq_text_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_friend_status_type_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_full_card?: FieldPolicy<any> | FieldReadFunction<any>,
	update_full_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_full_card_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_full_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	update_full_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_full_card_text_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_gender?: FieldPolicy<any> | FieldReadFunction<any>,
	update_gender_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_gender_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_achievement_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_achievement_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_input_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_guide_input_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	update_investigator_data_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_investigator_data_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_latest_decks_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_local_decks_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	update_pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_pack_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	update_pack_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_pack_name_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_taboo_set?: FieldPolicy<any> | FieldReadFunction<any>,
	update_taboo_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_taboo_set_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_campaigns_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_flag?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_flag_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_flag_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_flag_type?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_flag_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_flag_type_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_friends_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_received_friend_requests_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_sent_friend_requests_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_settings?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_settings_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_settings_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users_many?: FieldPolicy<any> | FieldReadFunction<any>
};
export type packKeySpecifier = ('cards' | 'cards_aggregate' | 'code' | 'cycle' | 'cycle_code' | 'official' | 'position' | 'real_name' | 'translations' | 'translations_aggregate' | packKeySpecifier)[];
export type packFieldPolicy = {
	cards?: FieldPolicy<any> | FieldReadFunction<any>,
	cards_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_code?: FieldPolicy<any> | FieldReadFunction<any>,
	official?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	translations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_aggregateKeySpecifier = ('aggregate' | 'nodes' | pack_aggregateKeySpecifier)[];
export type pack_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | pack_aggregate_fieldsKeySpecifier)[];
export type pack_aggregate_fieldsFieldPolicy = {
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
export type pack_avg_fieldsKeySpecifier = ('position' | pack_avg_fieldsKeySpecifier)[];
export type pack_avg_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_max_fieldsKeySpecifier = ('code' | 'cycle_code' | 'position' | 'real_name' | pack_max_fieldsKeySpecifier)[];
export type pack_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_code?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_min_fieldsKeySpecifier = ('code' | 'cycle_code' | 'position' | 'real_name' | pack_min_fieldsKeySpecifier)[];
export type pack_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_code?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	real_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | pack_mutation_responseKeySpecifier)[];
export type pack_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_nameKeySpecifier = ('code' | 'locale' | 'name' | pack_nameKeySpecifier)[];
export type pack_nameFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_name_aggregateKeySpecifier = ('aggregate' | 'nodes' | pack_name_aggregateKeySpecifier)[];
export type pack_name_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_name_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | pack_name_aggregate_fieldsKeySpecifier)[];
export type pack_name_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_name_max_fieldsKeySpecifier = ('code' | 'locale' | 'name' | pack_name_max_fieldsKeySpecifier)[];
export type pack_name_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_name_min_fieldsKeySpecifier = ('code' | 'locale' | 'name' | pack_name_min_fieldsKeySpecifier)[];
export type pack_name_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	locale?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_name_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | pack_name_mutation_responseKeySpecifier)[];
export type pack_name_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_stddev_fieldsKeySpecifier = ('position' | pack_stddev_fieldsKeySpecifier)[];
export type pack_stddev_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_stddev_pop_fieldsKeySpecifier = ('position' | pack_stddev_pop_fieldsKeySpecifier)[];
export type pack_stddev_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_stddev_samp_fieldsKeySpecifier = ('position' | pack_stddev_samp_fieldsKeySpecifier)[];
export type pack_stddev_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_sum_fieldsKeySpecifier = ('position' | pack_sum_fieldsKeySpecifier)[];
export type pack_sum_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_var_pop_fieldsKeySpecifier = ('position' | pack_var_pop_fieldsKeySpecifier)[];
export type pack_var_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_var_samp_fieldsKeySpecifier = ('position' | pack_var_samp_fieldsKeySpecifier)[];
export type pack_var_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type pack_variance_fieldsKeySpecifier = ('position' | pack_variance_fieldsKeySpecifier)[];
export type pack_variance_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type query_rootKeySpecifier = ('all_card' | 'all_card_aggregate' | 'all_card_by_pk' | 'all_card_text' | 'all_card_text_aggregate' | 'all_card_text_by_pk' | 'all_card_updated' | 'all_card_updated_aggregate' | 'all_card_updated_by_pk' | 'base_decks' | 'base_decks_aggregate' | 'campaign' | 'campaign_access' | 'campaign_access_aggregate' | 'campaign_access_by_pk' | 'campaign_aggregate' | 'campaign_by_pk' | 'campaign_deck' | 'campaign_deck_aggregate' | 'campaign_deck_by_pk' | 'campaign_difficulty' | 'campaign_difficulty_aggregate' | 'campaign_difficulty_by_pk' | 'campaign_guide' | 'campaign_guide_aggregate' | 'campaign_investigator' | 'campaign_investigator_aggregate' | 'campaign_investigator_by_pk' | 'campaigns_by_cycle' | 'campaigns_by_cycle_aggregate' | 'card' | 'card_aggregate' | 'card_by_pk' | 'card_cycle' | 'card_cycle_aggregate' | 'card_cycle_by_pk' | 'card_encounter_set' | 'card_encounter_set_aggregate' | 'card_encounter_set_by_pk' | 'card_pack' | 'card_pack_aggregate' | 'card_pack_by_pk' | 'card_subtype_name' | 'card_subtype_name_aggregate' | 'card_subtype_name_by_pk' | 'card_text' | 'card_text_aggregate' | 'card_text_by_pk' | 'card_type_code' | 'card_type_code_aggregate' | 'card_type_code_by_pk' | 'card_type_name' | 'card_type_name_aggregate' | 'card_type_name_by_pk' | 'chaos_bag_result' | 'chaos_bag_result_aggregate' | 'chaos_bag_result_by_pk' | 'chaos_bag_tarot_mode' | 'chaos_bag_tarot_mode_aggregate' | 'chaos_bag_tarot_mode_by_pk' | 'cycle' | 'cycle_aggregate' | 'cycle_by_pk' | 'cycle_name' | 'cycle_name_aggregate' | 'cycle_name_by_pk' | 'faction_name' | 'faction_name_aggregate' | 'faction_name_by_pk' | 'faq' | 'faq_aggregate' | 'faq_by_pk' | 'faq_text' | 'faq_text_aggregate' | 'faq_text_by_pk' | 'friend_status' | 'friend_status_aggregate' | 'friend_status_by_pk' | 'friend_status_type' | 'friend_status_type_aggregate' | 'friend_status_type_by_pk' | 'full_card' | 'full_card_aggregate' | 'full_card_by_pk' | 'full_card_text' | 'full_card_text_aggregate' | 'full_card_text_by_pk' | 'gender' | 'gender_aggregate' | 'gender_by_pk' | 'guide_achievement' | 'guide_achievement_aggregate' | 'guide_achievement_by_pk' | 'guide_input' | 'guide_input_aggregate' | 'guide_input_by_pk' | 'investigator_data' | 'investigator_data_aggregate' | 'investigator_data_by_pk' | 'latest_decks' | 'latest_decks_aggregate' | 'local_decks' | 'local_decks_aggregate' | 'pack' | 'pack_aggregate' | 'pack_by_pk' | 'pack_name' | 'pack_name_aggregate' | 'pack_name_by_pk' | 'taboo_set' | 'taboo_set_aggregate' | 'taboo_set_by_pk' | 'user_campaigns' | 'user_campaigns_aggregate' | 'user_flag' | 'user_flag_aggregate' | 'user_flag_by_pk' | 'user_flag_type' | 'user_flag_type_aggregate' | 'user_flag_type_by_pk' | 'user_friends' | 'user_friends_aggregate' | 'user_received_friend_requests' | 'user_received_friend_requests_aggregate' | 'user_sent_friend_requests' | 'user_sent_friend_requests_aggregate' | 'user_settings' | 'user_settings_aggregate' | 'user_settings_by_pk' | 'users' | 'users_aggregate' | 'users_by_pk' | query_rootKeySpecifier)[];
export type query_rootFieldPolicy = {
	all_card?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_updated?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_updated_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_updated_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
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
	campaign_difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_difficulty_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_difficulty_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns_by_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns_by_cycle_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card?: FieldPolicy<any> | FieldReadFunction<any>,
	card_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	card_cycle_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_encounter_set?: FieldPolicy<any> | FieldReadFunction<any>,
	card_encounter_set_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_encounter_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	card_pack_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_subtype_name?: FieldPolicy<any> | FieldReadFunction<any>,
	card_subtype_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_subtype_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	card_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_code_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_code_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_name?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_tarot_mode?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_tarot_mode_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_tarot_mode_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_name?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_name?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	faq?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_text?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	gender?: FieldPolicy<any> | FieldReadFunction<any>,
	gender_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	gender_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
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
	pack?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_settings?: FieldPolicy<any> | FieldReadFunction<any>,
	user_settings_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_settings_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	users_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type subscription_rootKeySpecifier = ('all_card' | 'all_card_aggregate' | 'all_card_by_pk' | 'all_card_stream' | 'all_card_text' | 'all_card_text_aggregate' | 'all_card_text_by_pk' | 'all_card_text_stream' | 'all_card_updated' | 'all_card_updated_aggregate' | 'all_card_updated_by_pk' | 'all_card_updated_stream' | 'base_decks' | 'base_decks_aggregate' | 'base_decks_stream' | 'campaign' | 'campaign_access' | 'campaign_access_aggregate' | 'campaign_access_by_pk' | 'campaign_access_stream' | 'campaign_aggregate' | 'campaign_by_pk' | 'campaign_deck' | 'campaign_deck_aggregate' | 'campaign_deck_by_pk' | 'campaign_deck_stream' | 'campaign_difficulty' | 'campaign_difficulty_aggregate' | 'campaign_difficulty_by_pk' | 'campaign_difficulty_stream' | 'campaign_guide' | 'campaign_guide_aggregate' | 'campaign_guide_stream' | 'campaign_investigator' | 'campaign_investigator_aggregate' | 'campaign_investigator_by_pk' | 'campaign_investigator_stream' | 'campaign_stream' | 'campaigns_by_cycle' | 'campaigns_by_cycle_aggregate' | 'campaigns_by_cycle_stream' | 'card' | 'card_aggregate' | 'card_by_pk' | 'card_cycle' | 'card_cycle_aggregate' | 'card_cycle_by_pk' | 'card_cycle_stream' | 'card_encounter_set' | 'card_encounter_set_aggregate' | 'card_encounter_set_by_pk' | 'card_encounter_set_stream' | 'card_pack' | 'card_pack_aggregate' | 'card_pack_by_pk' | 'card_pack_stream' | 'card_stream' | 'card_subtype_name' | 'card_subtype_name_aggregate' | 'card_subtype_name_by_pk' | 'card_subtype_name_stream' | 'card_text' | 'card_text_aggregate' | 'card_text_by_pk' | 'card_text_stream' | 'card_type_code' | 'card_type_code_aggregate' | 'card_type_code_by_pk' | 'card_type_code_stream' | 'card_type_name' | 'card_type_name_aggregate' | 'card_type_name_by_pk' | 'card_type_name_stream' | 'chaos_bag_result' | 'chaos_bag_result_aggregate' | 'chaos_bag_result_by_pk' | 'chaos_bag_result_stream' | 'chaos_bag_tarot_mode' | 'chaos_bag_tarot_mode_aggregate' | 'chaos_bag_tarot_mode_by_pk' | 'chaos_bag_tarot_mode_stream' | 'cycle' | 'cycle_aggregate' | 'cycle_by_pk' | 'cycle_name' | 'cycle_name_aggregate' | 'cycle_name_by_pk' | 'cycle_name_stream' | 'cycle_stream' | 'faction_name' | 'faction_name_aggregate' | 'faction_name_by_pk' | 'faction_name_stream' | 'faq' | 'faq_aggregate' | 'faq_by_pk' | 'faq_stream' | 'faq_text' | 'faq_text_aggregate' | 'faq_text_by_pk' | 'faq_text_stream' | 'friend_status' | 'friend_status_aggregate' | 'friend_status_by_pk' | 'friend_status_stream' | 'friend_status_type' | 'friend_status_type_aggregate' | 'friend_status_type_by_pk' | 'friend_status_type_stream' | 'full_card' | 'full_card_aggregate' | 'full_card_by_pk' | 'full_card_stream' | 'full_card_text' | 'full_card_text_aggregate' | 'full_card_text_by_pk' | 'full_card_text_stream' | 'gender' | 'gender_aggregate' | 'gender_by_pk' | 'gender_stream' | 'guide_achievement' | 'guide_achievement_aggregate' | 'guide_achievement_by_pk' | 'guide_achievement_stream' | 'guide_input' | 'guide_input_aggregate' | 'guide_input_by_pk' | 'guide_input_stream' | 'investigator_data' | 'investigator_data_aggregate' | 'investigator_data_by_pk' | 'investigator_data_stream' | 'latest_decks' | 'latest_decks_aggregate' | 'latest_decks_stream' | 'local_decks' | 'local_decks_aggregate' | 'local_decks_stream' | 'pack' | 'pack_aggregate' | 'pack_by_pk' | 'pack_name' | 'pack_name_aggregate' | 'pack_name_by_pk' | 'pack_name_stream' | 'pack_stream' | 'taboo_set' | 'taboo_set_aggregate' | 'taboo_set_by_pk' | 'taboo_set_stream' | 'user_campaigns' | 'user_campaigns_aggregate' | 'user_campaigns_stream' | 'user_flag' | 'user_flag_aggregate' | 'user_flag_by_pk' | 'user_flag_stream' | 'user_flag_type' | 'user_flag_type_aggregate' | 'user_flag_type_by_pk' | 'user_flag_type_stream' | 'user_friends' | 'user_friends_aggregate' | 'user_friends_stream' | 'user_received_friend_requests' | 'user_received_friend_requests_aggregate' | 'user_received_friend_requests_stream' | 'user_sent_friend_requests' | 'user_sent_friend_requests_aggregate' | 'user_sent_friend_requests_stream' | 'user_settings' | 'user_settings_aggregate' | 'user_settings_by_pk' | 'user_settings_stream' | 'users' | 'users_aggregate' | 'users_by_pk' | 'users_stream' | subscription_rootKeySpecifier)[];
export type subscription_rootFieldPolicy = {
	all_card?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_text_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_updated?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_updated_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_updated_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	all_card_updated_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	base_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	base_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	base_decks_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_access_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_deck_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_difficulty?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_difficulty_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_difficulty_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_difficulty_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_guide_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_investigator_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns_by_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns_by_cycle_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns_by_cycle_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card?: FieldPolicy<any> | FieldReadFunction<any>,
	card_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	card_cycle_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_cycle_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card_encounter_set?: FieldPolicy<any> | FieldReadFunction<any>,
	card_encounter_set_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_encounter_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_encounter_set_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card_pack?: FieldPolicy<any> | FieldReadFunction<any>,
	card_pack_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_pack_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card_subtype_name?: FieldPolicy<any> | FieldReadFunction<any>,
	card_subtype_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_subtype_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_subtype_name_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	card_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_text_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_code?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_code_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_code_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_code_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_name?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	card_type_name_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_result_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_tarot_mode?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_tarot_mode_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_tarot_mode_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	chaos_bag_tarot_mode_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_name?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_name_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	cycle_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_name?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	faction_name_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	faq?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_text?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	faq_text_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	friend_status_type_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_text?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_text_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	full_card_text_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	gender?: FieldPolicy<any> | FieldReadFunction<any>,
	gender_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	gender_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	gender_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_achievement_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	guide_input_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	investigator_data_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	latest_decks_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	local_decks_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	pack?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_name?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_name_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_name_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_name_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	pack_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	taboo_set_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_campaigns_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user_flag_type_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_friends_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_received_friend_requests_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_sent_friend_requests_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	user_settings?: FieldPolicy<any> | FieldReadFunction<any>,
	user_settings_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_settings_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user_settings_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	users_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	users_stream?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_setKeySpecifier = ('active' | 'card_count' | 'cards' | 'cards_aggregate' | 'code' | 'current' | 'date' | 'id' | 'name' | taboo_setKeySpecifier)[];
export type taboo_setFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	cards?: FieldPolicy<any> | FieldReadFunction<any>,
	cards_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	current?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_aggregateKeySpecifier = ('aggregate' | 'nodes' | taboo_set_aggregateKeySpecifier)[];
export type taboo_set_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | taboo_set_aggregate_fieldsKeySpecifier)[];
export type taboo_set_aggregate_fieldsFieldPolicy = {
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
export type taboo_set_avg_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_avg_fieldsKeySpecifier)[];
export type taboo_set_avg_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_max_fieldsKeySpecifier = ('card_count' | 'code' | 'date' | 'id' | 'name' | taboo_set_max_fieldsKeySpecifier)[];
export type taboo_set_max_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_min_fieldsKeySpecifier = ('card_count' | 'code' | 'date' | 'id' | 'name' | taboo_set_min_fieldsKeySpecifier)[];
export type taboo_set_min_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | taboo_set_mutation_responseKeySpecifier)[];
export type taboo_set_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_stddev_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_stddev_fieldsKeySpecifier)[];
export type taboo_set_stddev_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_stddev_pop_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_stddev_pop_fieldsKeySpecifier)[];
export type taboo_set_stddev_pop_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_stddev_samp_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_stddev_samp_fieldsKeySpecifier)[];
export type taboo_set_stddev_samp_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_sum_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_sum_fieldsKeySpecifier)[];
export type taboo_set_sum_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_var_pop_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_var_pop_fieldsKeySpecifier)[];
export type taboo_set_var_pop_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_var_samp_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_var_samp_fieldsKeySpecifier)[];
export type taboo_set_var_samp_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taboo_set_variance_fieldsKeySpecifier = ('card_count' | 'id' | taboo_set_variance_fieldsKeySpecifier)[];
export type taboo_set_variance_fieldsFieldPolicy = {
	card_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
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
export type user_flagKeySpecifier = ('flag' | 'user' | 'user_id' | user_flagKeySpecifier)[];
export type user_flagFieldPolicy = {
	flag?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_flag_aggregateKeySpecifier)[];
export type user_flag_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | user_flag_aggregate_fieldsKeySpecifier)[];
export type user_flag_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_max_fieldsKeySpecifier = ('user_id' | user_flag_max_fieldsKeySpecifier)[];
export type user_flag_max_fieldsFieldPolicy = {
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_min_fieldsKeySpecifier = ('user_id' | user_flag_min_fieldsKeySpecifier)[];
export type user_flag_min_fieldsFieldPolicy = {
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_flag_mutation_responseKeySpecifier)[];
export type user_flag_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_typeKeySpecifier = ('value' | user_flag_typeKeySpecifier)[];
export type user_flag_typeFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_type_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_flag_type_aggregateKeySpecifier)[];
export type user_flag_type_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_type_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | user_flag_type_aggregate_fieldsKeySpecifier)[];
export type user_flag_type_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_type_max_fieldsKeySpecifier = ('value' | user_flag_type_max_fieldsKeySpecifier)[];
export type user_flag_type_max_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_type_min_fieldsKeySpecifier = ('value' | user_flag_type_min_fieldsKeySpecifier)[];
export type user_flag_type_min_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_flag_type_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_flag_type_mutation_responseKeySpecifier)[];
export type user_flag_type_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
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
export type user_settingsKeySpecifier = ('alphabetize' | 'campaign_show_deck_id' | 'colorblind' | 'custom_content' | 'ignore_collection' | 'in_collection' | 'onboarding' | 'show_spoilers' | 'single_card' | 'sort_quotes' | 'user_id' | user_settingsKeySpecifier)[];
export type user_settingsFieldPolicy = {
	alphabetize?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign_show_deck_id?: FieldPolicy<any> | FieldReadFunction<any>,
	colorblind?: FieldPolicy<any> | FieldReadFunction<any>,
	custom_content?: FieldPolicy<any> | FieldReadFunction<any>,
	ignore_collection?: FieldPolicy<any> | FieldReadFunction<any>,
	in_collection?: FieldPolicy<any> | FieldReadFunction<any>,
	onboarding?: FieldPolicy<any> | FieldReadFunction<any>,
	show_spoilers?: FieldPolicy<any> | FieldReadFunction<any>,
	single_card?: FieldPolicy<any> | FieldReadFunction<any>,
	sort_quotes?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_settings_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_settings_aggregateKeySpecifier)[];
export type user_settings_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_settings_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | user_settings_aggregate_fieldsKeySpecifier)[];
export type user_settings_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_settings_max_fieldsKeySpecifier = ('user_id' | user_settings_max_fieldsKeySpecifier)[];
export type user_settings_max_fieldsFieldPolicy = {
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_settings_min_fieldsKeySpecifier = ('user_id' | user_settings_min_fieldsKeySpecifier)[];
export type user_settings_min_fieldsFieldPolicy = {
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_settings_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_settings_mutation_responseKeySpecifier)[];
export type user_settings_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type usersKeySpecifier = ('all_decks' | 'all_decks_aggregate' | 'campaigns' | 'campaigns_aggregate' | 'created_at' | 'decks' | 'decks_aggregate' | 'flags' | 'flags_aggregate' | 'friends' | 'friends_aggregate' | 'handle' | 'id' | 'local_decks' | 'local_decks_aggregate' | 'received_requests' | 'received_requests_aggregate' | 'sent_requests' | 'sent_requests_aggregate' | 'updated_at' | usersKeySpecifier)[];
export type usersFieldPolicy = {
	all_decks?: FieldPolicy<any> | FieldReadFunction<any>,
	all_decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	campaigns_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	decks?: FieldPolicy<any> | FieldReadFunction<any>,
	decks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	flags?: FieldPolicy<any> | FieldReadFunction<any>,
	flags_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type StrictTypedTypePolicies = {
	all_card?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_cardKeySpecifier | (() => undefined | all_cardKeySpecifier),
		fields?: all_cardFieldPolicy,
	},
	all_card_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_aggregateKeySpecifier | (() => undefined | all_card_aggregateKeySpecifier),
		fields?: all_card_aggregateFieldPolicy,
	},
	all_card_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_aggregate_fieldsKeySpecifier | (() => undefined | all_card_aggregate_fieldsKeySpecifier),
		fields?: all_card_aggregate_fieldsFieldPolicy,
	},
	all_card_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_avg_fieldsKeySpecifier | (() => undefined | all_card_avg_fieldsKeySpecifier),
		fields?: all_card_avg_fieldsFieldPolicy,
	},
	all_card_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_max_fieldsKeySpecifier | (() => undefined | all_card_max_fieldsKeySpecifier),
		fields?: all_card_max_fieldsFieldPolicy,
	},
	all_card_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_min_fieldsKeySpecifier | (() => undefined | all_card_min_fieldsKeySpecifier),
		fields?: all_card_min_fieldsFieldPolicy,
	},
	all_card_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_mutation_responseKeySpecifier | (() => undefined | all_card_mutation_responseKeySpecifier),
		fields?: all_card_mutation_responseFieldPolicy,
	},
	all_card_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_stddev_fieldsKeySpecifier | (() => undefined | all_card_stddev_fieldsKeySpecifier),
		fields?: all_card_stddev_fieldsFieldPolicy,
	},
	all_card_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_stddev_pop_fieldsKeySpecifier | (() => undefined | all_card_stddev_pop_fieldsKeySpecifier),
		fields?: all_card_stddev_pop_fieldsFieldPolicy,
	},
	all_card_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_stddev_samp_fieldsKeySpecifier | (() => undefined | all_card_stddev_samp_fieldsKeySpecifier),
		fields?: all_card_stddev_samp_fieldsFieldPolicy,
	},
	all_card_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_sum_fieldsKeySpecifier | (() => undefined | all_card_sum_fieldsKeySpecifier),
		fields?: all_card_sum_fieldsFieldPolicy,
	},
	all_card_text?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_textKeySpecifier | (() => undefined | all_card_textKeySpecifier),
		fields?: all_card_textFieldPolicy,
	},
	all_card_text_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_text_aggregateKeySpecifier | (() => undefined | all_card_text_aggregateKeySpecifier),
		fields?: all_card_text_aggregateFieldPolicy,
	},
	all_card_text_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_text_aggregate_fieldsKeySpecifier | (() => undefined | all_card_text_aggregate_fieldsKeySpecifier),
		fields?: all_card_text_aggregate_fieldsFieldPolicy,
	},
	all_card_text_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_text_max_fieldsKeySpecifier | (() => undefined | all_card_text_max_fieldsKeySpecifier),
		fields?: all_card_text_max_fieldsFieldPolicy,
	},
	all_card_text_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_text_min_fieldsKeySpecifier | (() => undefined | all_card_text_min_fieldsKeySpecifier),
		fields?: all_card_text_min_fieldsFieldPolicy,
	},
	all_card_text_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_text_mutation_responseKeySpecifier | (() => undefined | all_card_text_mutation_responseKeySpecifier),
		fields?: all_card_text_mutation_responseFieldPolicy,
	},
	all_card_updated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updatedKeySpecifier | (() => undefined | all_card_updatedKeySpecifier),
		fields?: all_card_updatedFieldPolicy,
	},
	all_card_updated_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_aggregateKeySpecifier | (() => undefined | all_card_updated_aggregateKeySpecifier),
		fields?: all_card_updated_aggregateFieldPolicy,
	},
	all_card_updated_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_aggregate_fieldsKeySpecifier | (() => undefined | all_card_updated_aggregate_fieldsKeySpecifier),
		fields?: all_card_updated_aggregate_fieldsFieldPolicy,
	},
	all_card_updated_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_avg_fieldsKeySpecifier | (() => undefined | all_card_updated_avg_fieldsKeySpecifier),
		fields?: all_card_updated_avg_fieldsFieldPolicy,
	},
	all_card_updated_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_max_fieldsKeySpecifier | (() => undefined | all_card_updated_max_fieldsKeySpecifier),
		fields?: all_card_updated_max_fieldsFieldPolicy,
	},
	all_card_updated_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_min_fieldsKeySpecifier | (() => undefined | all_card_updated_min_fieldsKeySpecifier),
		fields?: all_card_updated_min_fieldsFieldPolicy,
	},
	all_card_updated_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_mutation_responseKeySpecifier | (() => undefined | all_card_updated_mutation_responseKeySpecifier),
		fields?: all_card_updated_mutation_responseFieldPolicy,
	},
	all_card_updated_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_stddev_fieldsKeySpecifier | (() => undefined | all_card_updated_stddev_fieldsKeySpecifier),
		fields?: all_card_updated_stddev_fieldsFieldPolicy,
	},
	all_card_updated_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_stddev_pop_fieldsKeySpecifier | (() => undefined | all_card_updated_stddev_pop_fieldsKeySpecifier),
		fields?: all_card_updated_stddev_pop_fieldsFieldPolicy,
	},
	all_card_updated_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_stddev_samp_fieldsKeySpecifier | (() => undefined | all_card_updated_stddev_samp_fieldsKeySpecifier),
		fields?: all_card_updated_stddev_samp_fieldsFieldPolicy,
	},
	all_card_updated_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_sum_fieldsKeySpecifier | (() => undefined | all_card_updated_sum_fieldsKeySpecifier),
		fields?: all_card_updated_sum_fieldsFieldPolicy,
	},
	all_card_updated_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_var_pop_fieldsKeySpecifier | (() => undefined | all_card_updated_var_pop_fieldsKeySpecifier),
		fields?: all_card_updated_var_pop_fieldsFieldPolicy,
	},
	all_card_updated_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_var_samp_fieldsKeySpecifier | (() => undefined | all_card_updated_var_samp_fieldsKeySpecifier),
		fields?: all_card_updated_var_samp_fieldsFieldPolicy,
	},
	all_card_updated_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_updated_variance_fieldsKeySpecifier | (() => undefined | all_card_updated_variance_fieldsKeySpecifier),
		fields?: all_card_updated_variance_fieldsFieldPolicy,
	},
	all_card_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_var_pop_fieldsKeySpecifier | (() => undefined | all_card_var_pop_fieldsKeySpecifier),
		fields?: all_card_var_pop_fieldsFieldPolicy,
	},
	all_card_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_var_samp_fieldsKeySpecifier | (() => undefined | all_card_var_samp_fieldsKeySpecifier),
		fields?: all_card_var_samp_fieldsFieldPolicy,
	},
	all_card_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | all_card_variance_fieldsKeySpecifier | (() => undefined | all_card_variance_fieldsKeySpecifier),
		fields?: all_card_variance_fieldsFieldPolicy,
	},
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
	campaign_difficulty?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_difficultyKeySpecifier | (() => undefined | campaign_difficultyKeySpecifier),
		fields?: campaign_difficultyFieldPolicy,
	},
	campaign_difficulty_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_difficulty_aggregateKeySpecifier | (() => undefined | campaign_difficulty_aggregateKeySpecifier),
		fields?: campaign_difficulty_aggregateFieldPolicy,
	},
	campaign_difficulty_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_difficulty_aggregate_fieldsKeySpecifier | (() => undefined | campaign_difficulty_aggregate_fieldsKeySpecifier),
		fields?: campaign_difficulty_aggregate_fieldsFieldPolicy,
	},
	campaign_difficulty_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_difficulty_max_fieldsKeySpecifier | (() => undefined | campaign_difficulty_max_fieldsKeySpecifier),
		fields?: campaign_difficulty_max_fieldsFieldPolicy,
	},
	campaign_difficulty_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_difficulty_min_fieldsKeySpecifier | (() => undefined | campaign_difficulty_min_fieldsKeySpecifier),
		fields?: campaign_difficulty_min_fieldsFieldPolicy,
	},
	campaign_difficulty_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaign_difficulty_mutation_responseKeySpecifier | (() => undefined | campaign_difficulty_mutation_responseKeySpecifier),
		fields?: campaign_difficulty_mutation_responseFieldPolicy,
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
	campaigns_by_cycle?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycleKeySpecifier | (() => undefined | campaigns_by_cycleKeySpecifier),
		fields?: campaigns_by_cycleFieldPolicy,
	},
	campaigns_by_cycle_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_aggregateKeySpecifier | (() => undefined | campaigns_by_cycle_aggregateKeySpecifier),
		fields?: campaigns_by_cycle_aggregateFieldPolicy,
	},
	campaigns_by_cycle_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_aggregate_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_aggregate_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_aggregate_fieldsFieldPolicy,
	},
	campaigns_by_cycle_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_avg_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_avg_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_avg_fieldsFieldPolicy,
	},
	campaigns_by_cycle_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_max_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_max_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_max_fieldsFieldPolicy,
	},
	campaigns_by_cycle_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_min_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_min_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_min_fieldsFieldPolicy,
	},
	campaigns_by_cycle_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_stddev_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_stddev_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_stddev_fieldsFieldPolicy,
	},
	campaigns_by_cycle_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_stddev_pop_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_stddev_pop_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_stddev_pop_fieldsFieldPolicy,
	},
	campaigns_by_cycle_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_stddev_samp_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_stddev_samp_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_stddev_samp_fieldsFieldPolicy,
	},
	campaigns_by_cycle_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_sum_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_sum_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_sum_fieldsFieldPolicy,
	},
	campaigns_by_cycle_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_var_pop_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_var_pop_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_var_pop_fieldsFieldPolicy,
	},
	campaigns_by_cycle_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_var_samp_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_var_samp_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_var_samp_fieldsFieldPolicy,
	},
	campaigns_by_cycle_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | campaigns_by_cycle_variance_fieldsKeySpecifier | (() => undefined | campaigns_by_cycle_variance_fieldsKeySpecifier),
		fields?: campaigns_by_cycle_variance_fieldsFieldPolicy,
	},
	card?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cardKeySpecifier | (() => undefined | cardKeySpecifier),
		fields?: cardFieldPolicy,
	},
	card_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_aggregateKeySpecifier | (() => undefined | card_aggregateKeySpecifier),
		fields?: card_aggregateFieldPolicy,
	},
	card_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_aggregate_fieldsKeySpecifier | (() => undefined | card_aggregate_fieldsKeySpecifier),
		fields?: card_aggregate_fieldsFieldPolicy,
	},
	card_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_avg_fieldsKeySpecifier | (() => undefined | card_avg_fieldsKeySpecifier),
		fields?: card_avg_fieldsFieldPolicy,
	},
	card_cycle?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycleKeySpecifier | (() => undefined | card_cycleKeySpecifier),
		fields?: card_cycleFieldPolicy,
	},
	card_cycle_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_aggregateKeySpecifier | (() => undefined | card_cycle_aggregateKeySpecifier),
		fields?: card_cycle_aggregateFieldPolicy,
	},
	card_cycle_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_aggregate_fieldsKeySpecifier | (() => undefined | card_cycle_aggregate_fieldsKeySpecifier),
		fields?: card_cycle_aggregate_fieldsFieldPolicy,
	},
	card_cycle_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_avg_fieldsKeySpecifier | (() => undefined | card_cycle_avg_fieldsKeySpecifier),
		fields?: card_cycle_avg_fieldsFieldPolicy,
	},
	card_cycle_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_max_fieldsKeySpecifier | (() => undefined | card_cycle_max_fieldsKeySpecifier),
		fields?: card_cycle_max_fieldsFieldPolicy,
	},
	card_cycle_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_min_fieldsKeySpecifier | (() => undefined | card_cycle_min_fieldsKeySpecifier),
		fields?: card_cycle_min_fieldsFieldPolicy,
	},
	card_cycle_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_mutation_responseKeySpecifier | (() => undefined | card_cycle_mutation_responseKeySpecifier),
		fields?: card_cycle_mutation_responseFieldPolicy,
	},
	card_cycle_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_stddev_fieldsKeySpecifier | (() => undefined | card_cycle_stddev_fieldsKeySpecifier),
		fields?: card_cycle_stddev_fieldsFieldPolicy,
	},
	card_cycle_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_stddev_pop_fieldsKeySpecifier | (() => undefined | card_cycle_stddev_pop_fieldsKeySpecifier),
		fields?: card_cycle_stddev_pop_fieldsFieldPolicy,
	},
	card_cycle_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_stddev_samp_fieldsKeySpecifier | (() => undefined | card_cycle_stddev_samp_fieldsKeySpecifier),
		fields?: card_cycle_stddev_samp_fieldsFieldPolicy,
	},
	card_cycle_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_sum_fieldsKeySpecifier | (() => undefined | card_cycle_sum_fieldsKeySpecifier),
		fields?: card_cycle_sum_fieldsFieldPolicy,
	},
	card_cycle_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_var_pop_fieldsKeySpecifier | (() => undefined | card_cycle_var_pop_fieldsKeySpecifier),
		fields?: card_cycle_var_pop_fieldsFieldPolicy,
	},
	card_cycle_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_var_samp_fieldsKeySpecifier | (() => undefined | card_cycle_var_samp_fieldsKeySpecifier),
		fields?: card_cycle_var_samp_fieldsFieldPolicy,
	},
	card_cycle_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_cycle_variance_fieldsKeySpecifier | (() => undefined | card_cycle_variance_fieldsKeySpecifier),
		fields?: card_cycle_variance_fieldsFieldPolicy,
	},
	card_encounter_set?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_encounter_setKeySpecifier | (() => undefined | card_encounter_setKeySpecifier),
		fields?: card_encounter_setFieldPolicy,
	},
	card_encounter_set_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_encounter_set_aggregateKeySpecifier | (() => undefined | card_encounter_set_aggregateKeySpecifier),
		fields?: card_encounter_set_aggregateFieldPolicy,
	},
	card_encounter_set_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_encounter_set_aggregate_fieldsKeySpecifier | (() => undefined | card_encounter_set_aggregate_fieldsKeySpecifier),
		fields?: card_encounter_set_aggregate_fieldsFieldPolicy,
	},
	card_encounter_set_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_encounter_set_max_fieldsKeySpecifier | (() => undefined | card_encounter_set_max_fieldsKeySpecifier),
		fields?: card_encounter_set_max_fieldsFieldPolicy,
	},
	card_encounter_set_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_encounter_set_min_fieldsKeySpecifier | (() => undefined | card_encounter_set_min_fieldsKeySpecifier),
		fields?: card_encounter_set_min_fieldsFieldPolicy,
	},
	card_encounter_set_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_encounter_set_mutation_responseKeySpecifier | (() => undefined | card_encounter_set_mutation_responseKeySpecifier),
		fields?: card_encounter_set_mutation_responseFieldPolicy,
	},
	card_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_max_fieldsKeySpecifier | (() => undefined | card_max_fieldsKeySpecifier),
		fields?: card_max_fieldsFieldPolicy,
	},
	card_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_min_fieldsKeySpecifier | (() => undefined | card_min_fieldsKeySpecifier),
		fields?: card_min_fieldsFieldPolicy,
	},
	card_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_mutation_responseKeySpecifier | (() => undefined | card_mutation_responseKeySpecifier),
		fields?: card_mutation_responseFieldPolicy,
	},
	card_pack?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_packKeySpecifier | (() => undefined | card_packKeySpecifier),
		fields?: card_packFieldPolicy,
	},
	card_pack_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_aggregateKeySpecifier | (() => undefined | card_pack_aggregateKeySpecifier),
		fields?: card_pack_aggregateFieldPolicy,
	},
	card_pack_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_aggregate_fieldsKeySpecifier | (() => undefined | card_pack_aggregate_fieldsKeySpecifier),
		fields?: card_pack_aggregate_fieldsFieldPolicy,
	},
	card_pack_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_avg_fieldsKeySpecifier | (() => undefined | card_pack_avg_fieldsKeySpecifier),
		fields?: card_pack_avg_fieldsFieldPolicy,
	},
	card_pack_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_max_fieldsKeySpecifier | (() => undefined | card_pack_max_fieldsKeySpecifier),
		fields?: card_pack_max_fieldsFieldPolicy,
	},
	card_pack_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_min_fieldsKeySpecifier | (() => undefined | card_pack_min_fieldsKeySpecifier),
		fields?: card_pack_min_fieldsFieldPolicy,
	},
	card_pack_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_mutation_responseKeySpecifier | (() => undefined | card_pack_mutation_responseKeySpecifier),
		fields?: card_pack_mutation_responseFieldPolicy,
	},
	card_pack_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_stddev_fieldsKeySpecifier | (() => undefined | card_pack_stddev_fieldsKeySpecifier),
		fields?: card_pack_stddev_fieldsFieldPolicy,
	},
	card_pack_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_stddev_pop_fieldsKeySpecifier | (() => undefined | card_pack_stddev_pop_fieldsKeySpecifier),
		fields?: card_pack_stddev_pop_fieldsFieldPolicy,
	},
	card_pack_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_stddev_samp_fieldsKeySpecifier | (() => undefined | card_pack_stddev_samp_fieldsKeySpecifier),
		fields?: card_pack_stddev_samp_fieldsFieldPolicy,
	},
	card_pack_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_sum_fieldsKeySpecifier | (() => undefined | card_pack_sum_fieldsKeySpecifier),
		fields?: card_pack_sum_fieldsFieldPolicy,
	},
	card_pack_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_var_pop_fieldsKeySpecifier | (() => undefined | card_pack_var_pop_fieldsKeySpecifier),
		fields?: card_pack_var_pop_fieldsFieldPolicy,
	},
	card_pack_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_var_samp_fieldsKeySpecifier | (() => undefined | card_pack_var_samp_fieldsKeySpecifier),
		fields?: card_pack_var_samp_fieldsFieldPolicy,
	},
	card_pack_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_pack_variance_fieldsKeySpecifier | (() => undefined | card_pack_variance_fieldsKeySpecifier),
		fields?: card_pack_variance_fieldsFieldPolicy,
	},
	card_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_stddev_fieldsKeySpecifier | (() => undefined | card_stddev_fieldsKeySpecifier),
		fields?: card_stddev_fieldsFieldPolicy,
	},
	card_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_stddev_pop_fieldsKeySpecifier | (() => undefined | card_stddev_pop_fieldsKeySpecifier),
		fields?: card_stddev_pop_fieldsFieldPolicy,
	},
	card_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_stddev_samp_fieldsKeySpecifier | (() => undefined | card_stddev_samp_fieldsKeySpecifier),
		fields?: card_stddev_samp_fieldsFieldPolicy,
	},
	card_subtype_name?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_subtype_nameKeySpecifier | (() => undefined | card_subtype_nameKeySpecifier),
		fields?: card_subtype_nameFieldPolicy,
	},
	card_subtype_name_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_subtype_name_aggregateKeySpecifier | (() => undefined | card_subtype_name_aggregateKeySpecifier),
		fields?: card_subtype_name_aggregateFieldPolicy,
	},
	card_subtype_name_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_subtype_name_aggregate_fieldsKeySpecifier | (() => undefined | card_subtype_name_aggregate_fieldsKeySpecifier),
		fields?: card_subtype_name_aggregate_fieldsFieldPolicy,
	},
	card_subtype_name_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_subtype_name_max_fieldsKeySpecifier | (() => undefined | card_subtype_name_max_fieldsKeySpecifier),
		fields?: card_subtype_name_max_fieldsFieldPolicy,
	},
	card_subtype_name_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_subtype_name_min_fieldsKeySpecifier | (() => undefined | card_subtype_name_min_fieldsKeySpecifier),
		fields?: card_subtype_name_min_fieldsFieldPolicy,
	},
	card_subtype_name_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_subtype_name_mutation_responseKeySpecifier | (() => undefined | card_subtype_name_mutation_responseKeySpecifier),
		fields?: card_subtype_name_mutation_responseFieldPolicy,
	},
	card_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_sum_fieldsKeySpecifier | (() => undefined | card_sum_fieldsKeySpecifier),
		fields?: card_sum_fieldsFieldPolicy,
	},
	card_text?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_textKeySpecifier | (() => undefined | card_textKeySpecifier),
		fields?: card_textFieldPolicy,
	},
	card_text_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_text_aggregateKeySpecifier | (() => undefined | card_text_aggregateKeySpecifier),
		fields?: card_text_aggregateFieldPolicy,
	},
	card_text_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_text_aggregate_fieldsKeySpecifier | (() => undefined | card_text_aggregate_fieldsKeySpecifier),
		fields?: card_text_aggregate_fieldsFieldPolicy,
	},
	card_text_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_text_max_fieldsKeySpecifier | (() => undefined | card_text_max_fieldsKeySpecifier),
		fields?: card_text_max_fieldsFieldPolicy,
	},
	card_text_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_text_min_fieldsKeySpecifier | (() => undefined | card_text_min_fieldsKeySpecifier),
		fields?: card_text_min_fieldsFieldPolicy,
	},
	card_text_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_text_mutation_responseKeySpecifier | (() => undefined | card_text_mutation_responseKeySpecifier),
		fields?: card_text_mutation_responseFieldPolicy,
	},
	card_type_code?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_codeKeySpecifier | (() => undefined | card_type_codeKeySpecifier),
		fields?: card_type_codeFieldPolicy,
	},
	card_type_code_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_code_aggregateKeySpecifier | (() => undefined | card_type_code_aggregateKeySpecifier),
		fields?: card_type_code_aggregateFieldPolicy,
	},
	card_type_code_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_code_aggregate_fieldsKeySpecifier | (() => undefined | card_type_code_aggregate_fieldsKeySpecifier),
		fields?: card_type_code_aggregate_fieldsFieldPolicy,
	},
	card_type_code_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_code_max_fieldsKeySpecifier | (() => undefined | card_type_code_max_fieldsKeySpecifier),
		fields?: card_type_code_max_fieldsFieldPolicy,
	},
	card_type_code_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_code_min_fieldsKeySpecifier | (() => undefined | card_type_code_min_fieldsKeySpecifier),
		fields?: card_type_code_min_fieldsFieldPolicy,
	},
	card_type_code_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_code_mutation_responseKeySpecifier | (() => undefined | card_type_code_mutation_responseKeySpecifier),
		fields?: card_type_code_mutation_responseFieldPolicy,
	},
	card_type_name?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_nameKeySpecifier | (() => undefined | card_type_nameKeySpecifier),
		fields?: card_type_nameFieldPolicy,
	},
	card_type_name_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_name_aggregateKeySpecifier | (() => undefined | card_type_name_aggregateKeySpecifier),
		fields?: card_type_name_aggregateFieldPolicy,
	},
	card_type_name_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_name_aggregate_fieldsKeySpecifier | (() => undefined | card_type_name_aggregate_fieldsKeySpecifier),
		fields?: card_type_name_aggregate_fieldsFieldPolicy,
	},
	card_type_name_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_name_max_fieldsKeySpecifier | (() => undefined | card_type_name_max_fieldsKeySpecifier),
		fields?: card_type_name_max_fieldsFieldPolicy,
	},
	card_type_name_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_name_min_fieldsKeySpecifier | (() => undefined | card_type_name_min_fieldsKeySpecifier),
		fields?: card_type_name_min_fieldsFieldPolicy,
	},
	card_type_name_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_type_name_mutation_responseKeySpecifier | (() => undefined | card_type_name_mutation_responseKeySpecifier),
		fields?: card_type_name_mutation_responseFieldPolicy,
	},
	card_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_var_pop_fieldsKeySpecifier | (() => undefined | card_var_pop_fieldsKeySpecifier),
		fields?: card_var_pop_fieldsFieldPolicy,
	},
	card_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_var_samp_fieldsKeySpecifier | (() => undefined | card_var_samp_fieldsKeySpecifier),
		fields?: card_var_samp_fieldsFieldPolicy,
	},
	card_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | card_variance_fieldsKeySpecifier | (() => undefined | card_variance_fieldsKeySpecifier),
		fields?: card_variance_fieldsFieldPolicy,
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
	chaos_bag_tarot_mode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_tarot_modeKeySpecifier | (() => undefined | chaos_bag_tarot_modeKeySpecifier),
		fields?: chaos_bag_tarot_modeFieldPolicy,
	},
	chaos_bag_tarot_mode_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_tarot_mode_aggregateKeySpecifier | (() => undefined | chaos_bag_tarot_mode_aggregateKeySpecifier),
		fields?: chaos_bag_tarot_mode_aggregateFieldPolicy,
	},
	chaos_bag_tarot_mode_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_tarot_mode_aggregate_fieldsKeySpecifier | (() => undefined | chaos_bag_tarot_mode_aggregate_fieldsKeySpecifier),
		fields?: chaos_bag_tarot_mode_aggregate_fieldsFieldPolicy,
	},
	chaos_bag_tarot_mode_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_tarot_mode_max_fieldsKeySpecifier | (() => undefined | chaos_bag_tarot_mode_max_fieldsKeySpecifier),
		fields?: chaos_bag_tarot_mode_max_fieldsFieldPolicy,
	},
	chaos_bag_tarot_mode_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_tarot_mode_min_fieldsKeySpecifier | (() => undefined | chaos_bag_tarot_mode_min_fieldsKeySpecifier),
		fields?: chaos_bag_tarot_mode_min_fieldsFieldPolicy,
	},
	chaos_bag_tarot_mode_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | chaos_bag_tarot_mode_mutation_responseKeySpecifier | (() => undefined | chaos_bag_tarot_mode_mutation_responseKeySpecifier),
		fields?: chaos_bag_tarot_mode_mutation_responseFieldPolicy,
	},
	cycle?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycleKeySpecifier | (() => undefined | cycleKeySpecifier),
		fields?: cycleFieldPolicy,
	},
	cycle_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_aggregateKeySpecifier | (() => undefined | cycle_aggregateKeySpecifier),
		fields?: cycle_aggregateFieldPolicy,
	},
	cycle_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_aggregate_fieldsKeySpecifier | (() => undefined | cycle_aggregate_fieldsKeySpecifier),
		fields?: cycle_aggregate_fieldsFieldPolicy,
	},
	cycle_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_avg_fieldsKeySpecifier | (() => undefined | cycle_avg_fieldsKeySpecifier),
		fields?: cycle_avg_fieldsFieldPolicy,
	},
	cycle_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_max_fieldsKeySpecifier | (() => undefined | cycle_max_fieldsKeySpecifier),
		fields?: cycle_max_fieldsFieldPolicy,
	},
	cycle_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_min_fieldsKeySpecifier | (() => undefined | cycle_min_fieldsKeySpecifier),
		fields?: cycle_min_fieldsFieldPolicy,
	},
	cycle_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_mutation_responseKeySpecifier | (() => undefined | cycle_mutation_responseKeySpecifier),
		fields?: cycle_mutation_responseFieldPolicy,
	},
	cycle_name?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_nameKeySpecifier | (() => undefined | cycle_nameKeySpecifier),
		fields?: cycle_nameFieldPolicy,
	},
	cycle_name_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_name_aggregateKeySpecifier | (() => undefined | cycle_name_aggregateKeySpecifier),
		fields?: cycle_name_aggregateFieldPolicy,
	},
	cycle_name_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_name_aggregate_fieldsKeySpecifier | (() => undefined | cycle_name_aggregate_fieldsKeySpecifier),
		fields?: cycle_name_aggregate_fieldsFieldPolicy,
	},
	cycle_name_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_name_max_fieldsKeySpecifier | (() => undefined | cycle_name_max_fieldsKeySpecifier),
		fields?: cycle_name_max_fieldsFieldPolicy,
	},
	cycle_name_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_name_min_fieldsKeySpecifier | (() => undefined | cycle_name_min_fieldsKeySpecifier),
		fields?: cycle_name_min_fieldsFieldPolicy,
	},
	cycle_name_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_name_mutation_responseKeySpecifier | (() => undefined | cycle_name_mutation_responseKeySpecifier),
		fields?: cycle_name_mutation_responseFieldPolicy,
	},
	cycle_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_stddev_fieldsKeySpecifier | (() => undefined | cycle_stddev_fieldsKeySpecifier),
		fields?: cycle_stddev_fieldsFieldPolicy,
	},
	cycle_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_stddev_pop_fieldsKeySpecifier | (() => undefined | cycle_stddev_pop_fieldsKeySpecifier),
		fields?: cycle_stddev_pop_fieldsFieldPolicy,
	},
	cycle_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_stddev_samp_fieldsKeySpecifier | (() => undefined | cycle_stddev_samp_fieldsKeySpecifier),
		fields?: cycle_stddev_samp_fieldsFieldPolicy,
	},
	cycle_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_sum_fieldsKeySpecifier | (() => undefined | cycle_sum_fieldsKeySpecifier),
		fields?: cycle_sum_fieldsFieldPolicy,
	},
	cycle_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_var_pop_fieldsKeySpecifier | (() => undefined | cycle_var_pop_fieldsKeySpecifier),
		fields?: cycle_var_pop_fieldsFieldPolicy,
	},
	cycle_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_var_samp_fieldsKeySpecifier | (() => undefined | cycle_var_samp_fieldsKeySpecifier),
		fields?: cycle_var_samp_fieldsFieldPolicy,
	},
	cycle_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | cycle_variance_fieldsKeySpecifier | (() => undefined | cycle_variance_fieldsKeySpecifier),
		fields?: cycle_variance_fieldsFieldPolicy,
	},
	faction_name?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faction_nameKeySpecifier | (() => undefined | faction_nameKeySpecifier),
		fields?: faction_nameFieldPolicy,
	},
	faction_name_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faction_name_aggregateKeySpecifier | (() => undefined | faction_name_aggregateKeySpecifier),
		fields?: faction_name_aggregateFieldPolicy,
	},
	faction_name_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faction_name_aggregate_fieldsKeySpecifier | (() => undefined | faction_name_aggregate_fieldsKeySpecifier),
		fields?: faction_name_aggregate_fieldsFieldPolicy,
	},
	faction_name_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faction_name_max_fieldsKeySpecifier | (() => undefined | faction_name_max_fieldsKeySpecifier),
		fields?: faction_name_max_fieldsFieldPolicy,
	},
	faction_name_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faction_name_min_fieldsKeySpecifier | (() => undefined | faction_name_min_fieldsKeySpecifier),
		fields?: faction_name_min_fieldsFieldPolicy,
	},
	faction_name_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faction_name_mutation_responseKeySpecifier | (() => undefined | faction_name_mutation_responseKeySpecifier),
		fields?: faction_name_mutation_responseFieldPolicy,
	},
	faq?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faqKeySpecifier | (() => undefined | faqKeySpecifier),
		fields?: faqFieldPolicy,
	},
	faq_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_aggregateKeySpecifier | (() => undefined | faq_aggregateKeySpecifier),
		fields?: faq_aggregateFieldPolicy,
	},
	faq_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_aggregate_fieldsKeySpecifier | (() => undefined | faq_aggregate_fieldsKeySpecifier),
		fields?: faq_aggregate_fieldsFieldPolicy,
	},
	faq_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_max_fieldsKeySpecifier | (() => undefined | faq_max_fieldsKeySpecifier),
		fields?: faq_max_fieldsFieldPolicy,
	},
	faq_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_min_fieldsKeySpecifier | (() => undefined | faq_min_fieldsKeySpecifier),
		fields?: faq_min_fieldsFieldPolicy,
	},
	faq_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_mutation_responseKeySpecifier | (() => undefined | faq_mutation_responseKeySpecifier),
		fields?: faq_mutation_responseFieldPolicy,
	},
	faq_text?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_textKeySpecifier | (() => undefined | faq_textKeySpecifier),
		fields?: faq_textFieldPolicy,
	},
	faq_text_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_text_aggregateKeySpecifier | (() => undefined | faq_text_aggregateKeySpecifier),
		fields?: faq_text_aggregateFieldPolicy,
	},
	faq_text_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_text_aggregate_fieldsKeySpecifier | (() => undefined | faq_text_aggregate_fieldsKeySpecifier),
		fields?: faq_text_aggregate_fieldsFieldPolicy,
	},
	faq_text_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_text_max_fieldsKeySpecifier | (() => undefined | faq_text_max_fieldsKeySpecifier),
		fields?: faq_text_max_fieldsFieldPolicy,
	},
	faq_text_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_text_min_fieldsKeySpecifier | (() => undefined | faq_text_min_fieldsKeySpecifier),
		fields?: faq_text_min_fieldsFieldPolicy,
	},
	faq_text_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | faq_text_mutation_responseKeySpecifier | (() => undefined | faq_text_mutation_responseKeySpecifier),
		fields?: faq_text_mutation_responseFieldPolicy,
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
	full_card?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_cardKeySpecifier | (() => undefined | full_cardKeySpecifier),
		fields?: full_cardFieldPolicy,
	},
	full_card_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_aggregateKeySpecifier | (() => undefined | full_card_aggregateKeySpecifier),
		fields?: full_card_aggregateFieldPolicy,
	},
	full_card_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_aggregate_fieldsKeySpecifier | (() => undefined | full_card_aggregate_fieldsKeySpecifier),
		fields?: full_card_aggregate_fieldsFieldPolicy,
	},
	full_card_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_avg_fieldsKeySpecifier | (() => undefined | full_card_avg_fieldsKeySpecifier),
		fields?: full_card_avg_fieldsFieldPolicy,
	},
	full_card_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_max_fieldsKeySpecifier | (() => undefined | full_card_max_fieldsKeySpecifier),
		fields?: full_card_max_fieldsFieldPolicy,
	},
	full_card_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_min_fieldsKeySpecifier | (() => undefined | full_card_min_fieldsKeySpecifier),
		fields?: full_card_min_fieldsFieldPolicy,
	},
	full_card_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_mutation_responseKeySpecifier | (() => undefined | full_card_mutation_responseKeySpecifier),
		fields?: full_card_mutation_responseFieldPolicy,
	},
	full_card_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_stddev_fieldsKeySpecifier | (() => undefined | full_card_stddev_fieldsKeySpecifier),
		fields?: full_card_stddev_fieldsFieldPolicy,
	},
	full_card_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_stddev_pop_fieldsKeySpecifier | (() => undefined | full_card_stddev_pop_fieldsKeySpecifier),
		fields?: full_card_stddev_pop_fieldsFieldPolicy,
	},
	full_card_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_stddev_samp_fieldsKeySpecifier | (() => undefined | full_card_stddev_samp_fieldsKeySpecifier),
		fields?: full_card_stddev_samp_fieldsFieldPolicy,
	},
	full_card_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_sum_fieldsKeySpecifier | (() => undefined | full_card_sum_fieldsKeySpecifier),
		fields?: full_card_sum_fieldsFieldPolicy,
	},
	full_card_text?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_textKeySpecifier | (() => undefined | full_card_textKeySpecifier),
		fields?: full_card_textFieldPolicy,
	},
	full_card_text_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_text_aggregateKeySpecifier | (() => undefined | full_card_text_aggregateKeySpecifier),
		fields?: full_card_text_aggregateFieldPolicy,
	},
	full_card_text_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_text_aggregate_fieldsKeySpecifier | (() => undefined | full_card_text_aggregate_fieldsKeySpecifier),
		fields?: full_card_text_aggregate_fieldsFieldPolicy,
	},
	full_card_text_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_text_max_fieldsKeySpecifier | (() => undefined | full_card_text_max_fieldsKeySpecifier),
		fields?: full_card_text_max_fieldsFieldPolicy,
	},
	full_card_text_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_text_min_fieldsKeySpecifier | (() => undefined | full_card_text_min_fieldsKeySpecifier),
		fields?: full_card_text_min_fieldsFieldPolicy,
	},
	full_card_text_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_text_mutation_responseKeySpecifier | (() => undefined | full_card_text_mutation_responseKeySpecifier),
		fields?: full_card_text_mutation_responseFieldPolicy,
	},
	full_card_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_var_pop_fieldsKeySpecifier | (() => undefined | full_card_var_pop_fieldsKeySpecifier),
		fields?: full_card_var_pop_fieldsFieldPolicy,
	},
	full_card_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_var_samp_fieldsKeySpecifier | (() => undefined | full_card_var_samp_fieldsKeySpecifier),
		fields?: full_card_var_samp_fieldsFieldPolicy,
	},
	full_card_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_card_variance_fieldsKeySpecifier | (() => undefined | full_card_variance_fieldsKeySpecifier),
		fields?: full_card_variance_fieldsFieldPolicy,
	},
	gender?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | genderKeySpecifier | (() => undefined | genderKeySpecifier),
		fields?: genderFieldPolicy,
	},
	gender_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | gender_aggregateKeySpecifier | (() => undefined | gender_aggregateKeySpecifier),
		fields?: gender_aggregateFieldPolicy,
	},
	gender_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | gender_aggregate_fieldsKeySpecifier | (() => undefined | gender_aggregate_fieldsKeySpecifier),
		fields?: gender_aggregate_fieldsFieldPolicy,
	},
	gender_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | gender_max_fieldsKeySpecifier | (() => undefined | gender_max_fieldsKeySpecifier),
		fields?: gender_max_fieldsFieldPolicy,
	},
	gender_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | gender_min_fieldsKeySpecifier | (() => undefined | gender_min_fieldsKeySpecifier),
		fields?: gender_min_fieldsFieldPolicy,
	},
	gender_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | gender_mutation_responseKeySpecifier | (() => undefined | gender_mutation_responseKeySpecifier),
		fields?: gender_mutation_responseFieldPolicy,
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
	pack?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | packKeySpecifier | (() => undefined | packKeySpecifier),
		fields?: packFieldPolicy,
	},
	pack_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_aggregateKeySpecifier | (() => undefined | pack_aggregateKeySpecifier),
		fields?: pack_aggregateFieldPolicy,
	},
	pack_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_aggregate_fieldsKeySpecifier | (() => undefined | pack_aggregate_fieldsKeySpecifier),
		fields?: pack_aggregate_fieldsFieldPolicy,
	},
	pack_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_avg_fieldsKeySpecifier | (() => undefined | pack_avg_fieldsKeySpecifier),
		fields?: pack_avg_fieldsFieldPolicy,
	},
	pack_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_max_fieldsKeySpecifier | (() => undefined | pack_max_fieldsKeySpecifier),
		fields?: pack_max_fieldsFieldPolicy,
	},
	pack_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_min_fieldsKeySpecifier | (() => undefined | pack_min_fieldsKeySpecifier),
		fields?: pack_min_fieldsFieldPolicy,
	},
	pack_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_mutation_responseKeySpecifier | (() => undefined | pack_mutation_responseKeySpecifier),
		fields?: pack_mutation_responseFieldPolicy,
	},
	pack_name?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_nameKeySpecifier | (() => undefined | pack_nameKeySpecifier),
		fields?: pack_nameFieldPolicy,
	},
	pack_name_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_name_aggregateKeySpecifier | (() => undefined | pack_name_aggregateKeySpecifier),
		fields?: pack_name_aggregateFieldPolicy,
	},
	pack_name_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_name_aggregate_fieldsKeySpecifier | (() => undefined | pack_name_aggregate_fieldsKeySpecifier),
		fields?: pack_name_aggregate_fieldsFieldPolicy,
	},
	pack_name_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_name_max_fieldsKeySpecifier | (() => undefined | pack_name_max_fieldsKeySpecifier),
		fields?: pack_name_max_fieldsFieldPolicy,
	},
	pack_name_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_name_min_fieldsKeySpecifier | (() => undefined | pack_name_min_fieldsKeySpecifier),
		fields?: pack_name_min_fieldsFieldPolicy,
	},
	pack_name_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_name_mutation_responseKeySpecifier | (() => undefined | pack_name_mutation_responseKeySpecifier),
		fields?: pack_name_mutation_responseFieldPolicy,
	},
	pack_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_stddev_fieldsKeySpecifier | (() => undefined | pack_stddev_fieldsKeySpecifier),
		fields?: pack_stddev_fieldsFieldPolicy,
	},
	pack_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_stddev_pop_fieldsKeySpecifier | (() => undefined | pack_stddev_pop_fieldsKeySpecifier),
		fields?: pack_stddev_pop_fieldsFieldPolicy,
	},
	pack_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_stddev_samp_fieldsKeySpecifier | (() => undefined | pack_stddev_samp_fieldsKeySpecifier),
		fields?: pack_stddev_samp_fieldsFieldPolicy,
	},
	pack_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_sum_fieldsKeySpecifier | (() => undefined | pack_sum_fieldsKeySpecifier),
		fields?: pack_sum_fieldsFieldPolicy,
	},
	pack_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_var_pop_fieldsKeySpecifier | (() => undefined | pack_var_pop_fieldsKeySpecifier),
		fields?: pack_var_pop_fieldsFieldPolicy,
	},
	pack_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_var_samp_fieldsKeySpecifier | (() => undefined | pack_var_samp_fieldsKeySpecifier),
		fields?: pack_var_samp_fieldsFieldPolicy,
	},
	pack_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | pack_variance_fieldsKeySpecifier | (() => undefined | pack_variance_fieldsKeySpecifier),
		fields?: pack_variance_fieldsFieldPolicy,
	},
	query_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | query_rootKeySpecifier | (() => undefined | query_rootKeySpecifier),
		fields?: query_rootFieldPolicy,
	},
	subscription_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | subscription_rootKeySpecifier | (() => undefined | subscription_rootKeySpecifier),
		fields?: subscription_rootFieldPolicy,
	},
	taboo_set?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_setKeySpecifier | (() => undefined | taboo_setKeySpecifier),
		fields?: taboo_setFieldPolicy,
	},
	taboo_set_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_aggregateKeySpecifier | (() => undefined | taboo_set_aggregateKeySpecifier),
		fields?: taboo_set_aggregateFieldPolicy,
	},
	taboo_set_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_aggregate_fieldsKeySpecifier | (() => undefined | taboo_set_aggregate_fieldsKeySpecifier),
		fields?: taboo_set_aggregate_fieldsFieldPolicy,
	},
	taboo_set_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_avg_fieldsKeySpecifier | (() => undefined | taboo_set_avg_fieldsKeySpecifier),
		fields?: taboo_set_avg_fieldsFieldPolicy,
	},
	taboo_set_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_max_fieldsKeySpecifier | (() => undefined | taboo_set_max_fieldsKeySpecifier),
		fields?: taboo_set_max_fieldsFieldPolicy,
	},
	taboo_set_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_min_fieldsKeySpecifier | (() => undefined | taboo_set_min_fieldsKeySpecifier),
		fields?: taboo_set_min_fieldsFieldPolicy,
	},
	taboo_set_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_mutation_responseKeySpecifier | (() => undefined | taboo_set_mutation_responseKeySpecifier),
		fields?: taboo_set_mutation_responseFieldPolicy,
	},
	taboo_set_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_stddev_fieldsKeySpecifier | (() => undefined | taboo_set_stddev_fieldsKeySpecifier),
		fields?: taboo_set_stddev_fieldsFieldPolicy,
	},
	taboo_set_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_stddev_pop_fieldsKeySpecifier | (() => undefined | taboo_set_stddev_pop_fieldsKeySpecifier),
		fields?: taboo_set_stddev_pop_fieldsFieldPolicy,
	},
	taboo_set_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_stddev_samp_fieldsKeySpecifier | (() => undefined | taboo_set_stddev_samp_fieldsKeySpecifier),
		fields?: taboo_set_stddev_samp_fieldsFieldPolicy,
	},
	taboo_set_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_sum_fieldsKeySpecifier | (() => undefined | taboo_set_sum_fieldsKeySpecifier),
		fields?: taboo_set_sum_fieldsFieldPolicy,
	},
	taboo_set_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_var_pop_fieldsKeySpecifier | (() => undefined | taboo_set_var_pop_fieldsKeySpecifier),
		fields?: taboo_set_var_pop_fieldsFieldPolicy,
	},
	taboo_set_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_var_samp_fieldsKeySpecifier | (() => undefined | taboo_set_var_samp_fieldsKeySpecifier),
		fields?: taboo_set_var_samp_fieldsFieldPolicy,
	},
	taboo_set_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taboo_set_variance_fieldsKeySpecifier | (() => undefined | taboo_set_variance_fieldsKeySpecifier),
		fields?: taboo_set_variance_fieldsFieldPolicy,
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
	user_flag?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flagKeySpecifier | (() => undefined | user_flagKeySpecifier),
		fields?: user_flagFieldPolicy,
	},
	user_flag_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_aggregateKeySpecifier | (() => undefined | user_flag_aggregateKeySpecifier),
		fields?: user_flag_aggregateFieldPolicy,
	},
	user_flag_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_aggregate_fieldsKeySpecifier | (() => undefined | user_flag_aggregate_fieldsKeySpecifier),
		fields?: user_flag_aggregate_fieldsFieldPolicy,
	},
	user_flag_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_max_fieldsKeySpecifier | (() => undefined | user_flag_max_fieldsKeySpecifier),
		fields?: user_flag_max_fieldsFieldPolicy,
	},
	user_flag_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_min_fieldsKeySpecifier | (() => undefined | user_flag_min_fieldsKeySpecifier),
		fields?: user_flag_min_fieldsFieldPolicy,
	},
	user_flag_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_mutation_responseKeySpecifier | (() => undefined | user_flag_mutation_responseKeySpecifier),
		fields?: user_flag_mutation_responseFieldPolicy,
	},
	user_flag_type?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_typeKeySpecifier | (() => undefined | user_flag_typeKeySpecifier),
		fields?: user_flag_typeFieldPolicy,
	},
	user_flag_type_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_type_aggregateKeySpecifier | (() => undefined | user_flag_type_aggregateKeySpecifier),
		fields?: user_flag_type_aggregateFieldPolicy,
	},
	user_flag_type_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_type_aggregate_fieldsKeySpecifier | (() => undefined | user_flag_type_aggregate_fieldsKeySpecifier),
		fields?: user_flag_type_aggregate_fieldsFieldPolicy,
	},
	user_flag_type_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_type_max_fieldsKeySpecifier | (() => undefined | user_flag_type_max_fieldsKeySpecifier),
		fields?: user_flag_type_max_fieldsFieldPolicy,
	},
	user_flag_type_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_type_min_fieldsKeySpecifier | (() => undefined | user_flag_type_min_fieldsKeySpecifier),
		fields?: user_flag_type_min_fieldsFieldPolicy,
	},
	user_flag_type_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_flag_type_mutation_responseKeySpecifier | (() => undefined | user_flag_type_mutation_responseKeySpecifier),
		fields?: user_flag_type_mutation_responseFieldPolicy,
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
	user_settings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_settingsKeySpecifier | (() => undefined | user_settingsKeySpecifier),
		fields?: user_settingsFieldPolicy,
	},
	user_settings_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_settings_aggregateKeySpecifier | (() => undefined | user_settings_aggregateKeySpecifier),
		fields?: user_settings_aggregateFieldPolicy,
	},
	user_settings_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_settings_aggregate_fieldsKeySpecifier | (() => undefined | user_settings_aggregate_fieldsKeySpecifier),
		fields?: user_settings_aggregate_fieldsFieldPolicy,
	},
	user_settings_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_settings_max_fieldsKeySpecifier | (() => undefined | user_settings_max_fieldsKeySpecifier),
		fields?: user_settings_max_fieldsFieldPolicy,
	},
	user_settings_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_settings_min_fieldsKeySpecifier | (() => undefined | user_settings_min_fieldsKeySpecifier),
		fields?: user_settings_min_fieldsFieldPolicy,
	},
	user_settings_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_settings_mutation_responseKeySpecifier | (() => undefined | user_settings_mutation_responseKeySpecifier),
		fields?: user_settings_mutation_responseFieldPolicy,
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
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;