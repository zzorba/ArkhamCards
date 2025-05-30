import React from 'react';
import Animated, { interpolateColor, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import ArkhamIcon from './ArkhamIcon';
import AgesIcon from './AgesIcon';
import AppIcon from './AppIcon';
import CarcosaIcon from './CarcosaIcon';
import CyclopeanIcon from './CyclopeanIcon';
import CircleIcon from './CircleIcon';
import CoreSetIcon from './CoreSetIcon';
import DarkMatterIcon from './DarkMatterIcon';
import DreamEatersIcon from './DreamEatersIcon';
import DrownedIcon from './DrownedIcon';
import DunwichIcon from './DunwichIcon';
import EdgeIcon from './EdgeIcon';
import ForgottenIcon from './ForgottenIcon';
import HemlockIcon from './HemlockIcon';
import OzIcon from './OzIcon';
import StandaloneIcon from './StandaloneIcon';
import InnsmouthIcon from './InnsmouthIcon';
import AliceIcon from './AliceIcon';
import ScarletIcon from './ScarletIcon';

interface Props {
  encounter_code: string;
  size: number;
  color: string;
}

const AnimatedOzIcon = Animated.createAnimatedComponent(OzIcon);

const TheColourItself = ({ size }: { size: number }) => {
  const color = useSharedValue(1);
  const animatedProps = useAnimatedProps(() => {
    const purpleColor = interpolateColor(
      color.value,
      [0, 1, 2],
      ['#B405F6', '#c025fb', '#a004db']
    );
    return {
      color: purpleColor,
    };
  });
  React.useEffect(() => {
    color.value = withRepeat(
      withTiming(2, { duration: 1200 }),
      -1,
      true
    );
  }, [color]);
  return <AnimatedOzIcon size={size} name="the_colour_itself" animatedProps={animatedProps} />;
}

export default class EncounterIcon extends React.PureComponent<Props> {
  aliceIcon(name: string, size: number, color: string) {
    return (<AliceIcon name={name} size={size} color={color} />);
  }
  ozIcon(name: string, size: number, color: string) {
    return (<OzIcon name={name} size={size} color={color} />);
  }
  arkhamIcon(name: string, size: number, color: string) {
    return (<ArkhamIcon name={name} size={size} color={color} />);
  }
  agesIcon(name: string, size: number, color: string) {
    return (<AgesIcon name={name} size={size} color={color} />);
  }
  appIcon(name: string, size: number, color: string) {
    return (<AppIcon name={name} size={size} color={color} />);
  }
  coreIcon(name: string, size: number, color: string) {
    return (<CoreSetIcon name={name} size={size} color={color} />);
  }
  cardIcon(name: string, size: number, color: string) {
    return (<AppIcon name={name} size={size} color={color} />);
  }
  innsmouthIcon(name: string, size: number, color: string) {
    return (<InnsmouthIcon name={name} size={size} color={color} />);
  }
  darkMatterIcon(name: string, size: number, color: string) {
    return (<DarkMatterIcon name={name} size={size} color={color} />);
  }
  drownedIcon(name: string, size: number, color: string) {
    return (<DrownedIcon name={name} size={size} color={color} />);
  }

  cyclopeanIcon(name: string, size: number, color: string) {
    return (<CyclopeanIcon name={name} size={size} color={color} />);
  }

  dunwichIcon(name: string, size: number, color: string) {
    return (<DunwichIcon name={name} size={size} color={color} />);
  }

  carcosaIcon(name: string, size: number, color: string) {
    return (<CarcosaIcon name={name} size={size} color={color} />);
  }

  forgottenIcon(name: string, size: number, color: string) {
    return (<ForgottenIcon name={name} size={size} color={color} />);
  }

  circleIcon(name: string, size: number, color: string) {
    return (<CircleIcon name={name} size={size} color={color} />);
  }

  dreamIcon(name: string, size: number, color: string) {
    return (<DreamEatersIcon name={name} size={size} color={color} />);
  }

  standaloneIcon(name: string, size: number, color: string) {
    return (<StandaloneIcon name={name} size={size} color={color} />);
  }

  edgeIcon(name: string, size: number, color: string) {
    return (<EdgeIcon name={name} size={size} color={color} />);
  }

  scarletIcon(name: string, size: number, color: string) {
    return (<ScarletIcon name={name} size={size} color={color} />);
  }

  hemlockIcon(name: string, size: number, color: string) {
    return (<HemlockIcon name={name} size={size} color={color} />);
  }

  render() {
    const {
      encounter_code,
      size,
      color,
    } = this.props;
    switch (encounter_code) {
      case 'nat':
        return this.standaloneIcon('nate', size, color);
      case 'har':
        return this.standaloneIcon('harvey', size, color);
      case 'win':
        return this.standaloneIcon('winifred', size, color);
      case 'jac':
        return this.standaloneIcon('jacqueline', size, color);
      case 'ste':
        return this.standaloneIcon('stella', size, color);
      case 'meddling_of_meowlathotep':
        return this.standaloneIcon('meddling', size, color);
      case 'zbh':
      case 'barkham_horror':
        return this.standaloneIcon('barkham_horror', size, color);
      case 'rtnotz':
      case 'core':
      case 'agents_of_hastur':
      case 'agents_of_yog':
      case 'agents_of_shub':
      case 'agents_of_cthulhu':
      case 'locked_doors':
      case 'chilling_cold':
      case 'striking_fear':
      case 'ancient_evils':
      case 'rats':
      case 'ghouls':
      case 'nightgaunts':
      case 'return_to_the_gathering':
      case 'return_to_the_midnight_masks':
      case 'return_to_the_devourer_below':
      case 'return_cult':
      case 'the_devourers_cult':
        return this.coreIcon(encounter_code, size, color);
      case 'ghouls_of_umôrdhoth':
      case 'ghouls_of_umordhoth':
        return this.coreIcon('ghouls_of_umrdhoth', size, color);
      case 'pentagram':
        return this.coreIcon('dark_cult', size, color);
      case 'cultists':
        return this.coreIcon('cult_of_umordoth', size, color);
      case 'torch':
        return this.coreIcon('the_gathering', size, color);
      case 'arkham':
        return this.coreIcon('midnight_masks', size, color);
      case 'tentacles':
        return this.coreIcon('the_devourer_below', size, color);
      case 'dwl':
      case 'dwlp':
      case 'dwlc': // THE DUNWICH LEGACY
        return this.dunwichIcon('set', size, color);
      case 'rtdwl':
        return this.dunwichIcon('return_to_the_dunwich_legacy', size, color);
      case 'tmm':
        return this.dunwichIcon('the_miskatonic_museum', size, color);
      case 'tece':
      case 'essex_county_express':
        return this.dunwichIcon('the_essex_county_express', size, color);
      case 'bota':
        return this.dunwichIcon('blood_on_the_altar', size, color);
      case 'uau':
        return this.dunwichIcon('undimensioned_and_unseen', size, color);
      case 'wda':
        return this.dunwichIcon('where_doom_awaits', size, color);
      case 'litas':
        return this.dunwichIcon('lost_in_time_and_space', size, color);
      case 'extracurricular_activity':
      case 'the_house_always_wins':
      case 'armitages_fate':
      case 'the_miskatonic_museum':
      case 'blood_on_the_altar':
      case 'undimensioned_and_unseen':
      case 'where_doom_awaits':
      case 'lost_in_time_and_space':
      case 'bad_luck':
      case 'beast_thralls':
      case 'bishops_thralls':
      case 'dunwich':
      case 'hideous_abominations':
      case 'naomis_crew':
      case 'sorcery':
      case 'the_beyond':
      case 'whippoorwills':
      case 'return_to_the_house_always_wins':
      case 'return_to_the_miskatonic_museum':
      case 'return_to_blood_on_the_altar':
      case 'return_to_undimensioned_and_unseen':
      case 'return_to_where_doom_awaits':
      case 'return_to_lost_in_time_and_space':
      case 'resurgent_evils':
      case 'erratic_fear':
      case 'creeping_cold':
      case 'secret_doors':
      case 'yog_sothoths_emissaries':
      case 'beyond_the_threshold':
        return this.dunwichIcon(encounter_code, size, color);
      case 'return_to_the_essex_county_express':
      case 'return_to_essex_county_express':
        return this.dunwichIcon('return_to_the_essex_county_express', size, color);
      case 'return_to_extracurricular_activities':
      case 'return_to_extracurricular_activity':
        return this.dunwichIcon('return_to_extracurricular_activities', size, color);

      case 'ptc':
      case 'ptcp':
      case 'ptcc': // THE PATH TO CARCOSA
        return this.carcosaIcon('carcosa', size, color);
      case 'rtptc':
        return this.carcosaIcon('return_to_the_path_to_carcosa', size, color);
      case 'eotp':
        return this.carcosaIcon('echoes_of_the_past', size, color);
      case 'tuo':
        return this.carcosaIcon('the_unspeakable_oath', size, color);
      case 'apot':
        return this.carcosaIcon('a_phantom_of_truth', size, color);
      case 'tpm':
        return this.carcosaIcon('the_pallid_mask', size, color);
      case 'bsr':
        return this.carcosaIcon('black_stars_rise', size, color);
      case 'flood':
        return this.carcosaIcon('the_flood_below', size, color);
      case 'vortex':
        return this.carcosaIcon('the_vortex_above', size, color);
      case 'dca':
        return this.carcosaIcon('dim_carcosa', size, color);
      case 'byakhee':
      case 'cult_of_the_yellow_sign':
      case 'hauntings':
      case 'delusions':
      case 'evil_portents':
      case 'hasturs_gift':
      case 'inhabitants_of_carcosa':
      case 'return_to_the_path_to_carcosa':
      case 'curtain_call':
      case 'the_last_king':
      case 'echoes_of_the_past':
      case 'the_unspeakable_oath':
      case 'a_phantom_of_truth':
      case 'the_pallid_mask':
      case 'black_stars_rise':
      case 'dim_carcosa':
      case 'return_to_curtain_call':
      case 'return_to_the_last_king':
      case 'return_to_echoes_of_the_past':
      case 'return_to_the_unspeakable_oath':
      case 'return_to_the_pallid_mask':
      case 'return_to_black_stars_rise':
      case 'return_to_dim_carcosa':
      case 'decaying_reality':
      case 'maddening_delusions':
      case 'hasturs_envoys':
      case 'neurotic_fear':
      case 'delusory_evils':
        return this.carcosaIcon(encounter_code, size, color);
      case 'return_to_a_phantom_of_truth':
        return this.carcosaIcon('return_to_the_phantom_of_truth', size, color);
      case 'decay':
        return this.carcosaIcon('decay_and_filth', size, color);
      case 'the_stranger':
      case 'stranger':
        return this.carcosaIcon('the_stranger', size, color);
      case 'tmg':
      case 'the_midwinter_gala':
        return this.standaloneIcon('gala', size, color);
      case 'iotv':
      case 'tdor':
      case 'tdg':
      case 'tftbw':
      case 'hoth':
      case 'bob':
      case 'dre':
      case 'promo': // PROMO
      case 'promotional':
      case 'books': // NOVELLAS
        return this.standaloneIcon('novella', size, color);
      case 'coh':
      case 'venice':
      case 'carnevale_of_horrors':
        return this.standaloneIcon('carnevale', size, color);
      case 'rod':
      case 'read_or_die':
        return this.standaloneIcon('read_or_die', size, color);
      case 'aon':
      case 'all_or_nothing':
        return this.standaloneIcon('all_or_nothing', size, color);
      case 'bad':
      case 'bad_blood':
        return this.standaloneIcon('bad_blood', size, color);
      case 'btb':
      case 'by_the_book':
        return this.standaloneIcon('by_the_book', size, color);
      case 'ltr':
      case 'laid_to_rest':
        return this.standaloneIcon('laid_to_rest', size, color);
      case 'rtr':
      case 'red_tide_rising':
        return this.standaloneIcon('red_tide_rising', size, color);
      case 'parallel':
      case 'otr':
      case 'on_the_road_again':
      case 'ptr':
      case 'path_of_the_righteous':
      case 'pap':
      case 'pistols_and_pearls':
      case 'hfa':
      case 'hunting_for_answers':
        return this.cardIcon('parallel', size, color);
      case 'cotr':
      case 'curse_of_the_rougarou':
      case 'rougarou':
        return this.standaloneIcon('curse_of_the_rougarou', size, color);
      case 'bayou':
        return this.standaloneIcon('the_bayou', size, color);
      case 'blob':
      case 'blob_that_ate_everything':
        return this.standaloneIcon('the_blob_that_ate_everything', size, color);
      case 'blbe':
      case 'blob_that_ate_everything_else':
        return this.standaloneIcon('blob_that_ate_everything_else', size, color);
      case 'migo_incursion':
        return this.standaloneIcon('migo', size, color);
      case 'migo_incursion_2':
        return this.standaloneIcon('migo_incursion_2', size, color);
      case 'machinations_epic_multiplayer':
      case 'blob_epic_multiplayer':
      case 'epic_multiplayer':
        return this.standaloneIcon('epic_multiplayer', size, color);
      case 'single_group':
      case 'blob_single_group':
      case 'machinations_single_group':
        return this.standaloneIcon('single_group', size, color);
      case 'gob':
        return this.standaloneIcon('guardians', size, color);
      case 'mtt':
      case 'machinations_through_time':
      case 'lol':
      case 'in_the_labyrinths_of_lunacy':
      case 'guardians':
      case 'abyssal_gifts':
      case 'abyssal_tribute':
      case 'brotherhood_of_the_beast':
      case 'sands_of_egypt':
      case 'murder_at_the_excelsior_hotel':
      case 'alien_interference':
      case 'dark_rituals':
      case 'excelsior_management':
      case 'sins_of_the_past':
      case 'vile_experiments':
      case 'meteoric_phenomenon':
      case 'unnatural_disturbances':
      case 'inhospitable_locality':
      case 'made_flesh':
        return this.standaloneIcon(encounter_code, size, color);
      case 'hotel':
        return this.standaloneIcon('excelsior', size, color);
      case 'the_eternal_slumber':
        return this.standaloneIcon('eternal_slumber', size, color);
      case 'the_nights_usurper':
        return this.standaloneIcon('nights_usurper', size, color);
      case 'hote':
        return this.forgottenIcon('heart_of_the_elders', size, color);
      case 'tcoa':
      case 'the_city_of_archives':
        return this.forgottenIcon('city_of_archives', size, color);
      case 'return_to_the_city_of_archives':
      case 'return_to_city_of_archives':
        return this.forgottenIcon('return_to_city_of_archives', size, color);
      case 'tfa':
      case 'tfap':
      case 'tfac':
        return this.forgottenIcon('the_forgotten_age', size, color);
      case 'sha':
      case 'shattered_aeons':
        return this.forgottenIcon('shattered_aeons', size, color);
      case 'tdoy':
      case 'depths_of_yoth':
        return this.forgottenIcon('the_depths_of_yoth', size, color);
      case 'tof':
      case 'threads_of_fate':
        return this.forgottenIcon('threads_of_fate', size, color);
      case 'tbb':
      case 'the_boundary_beyond':
        return this.forgottenIcon('the_boundary_beyond', size, color);
      case 'wilds':
        return this.forgottenIcon('the_untamed_wilds', size, color);
      case 'eztli':
        return this.forgottenIcon('the_doom_of_eztli', size, color);
      case 'traps':
      case 'deadly_traps':
        return this.forgottenIcon('deadly_traps', size, color);
      case 'flux':
      case 'temporal_flux':
        return this.forgottenIcon('temporal_flux', size, color);
      case 'ruins':
        return this.forgottenIcon('forgotten_ruins', size, color);
      case 'venom':
        return this.forgottenIcon('yigs_venom', size, color);
      case 'k\'n-yan':
      case 'heart_of_the_elders_part_2':
        return this.forgottenIcon('knyan', size, color);
      case 'heart_of_the_elders_part_1':
      case 'pillars_of_judgment':
        return this.forgottenIcon('pillars_of_judgement', size, color);
      case 'rttfa':
        return this.forgottenIcon('return_to_the_forgotten_age', size, color);
      case 'turn_back_time':
      case 'rainforest':
      case 'serpents':
      case 'expedition':
      case 'agents_of_yig':
      case 'guardians_of_time':
      case 'pnakotic_brotherhood':
      case 'heart_of_the_elders':
      case 'pillars_of_judgement':
      case 'the_depths_of_yoth':
      case 'city_of_archives':
      case 'knyan':
      case 'poison':
      case 'return_to_the_rainforest':
      case 'venomous_hate':
      case 'temporal_hunters':
      case 'doomed_expedition':
      case 'cult_of_pnakotus':
      case 'return_to_the_untamed_wilds':
      case 'return_to_the_doom_of_eztli':
      case 'return_to_threads_of_fate':
      case 'return_to_the_boundary_beyond':
      case 'return_to_the_depths_of_yoth':
      case 'return_to_shattered_aeons':
      case 'return_to_turn_back_time':
      case 'return_to_the_forgotten_age':
        return this.forgottenIcon(encounter_code, size, color);
      case 'return_to_heart_of_the_elders_part_1':
      case 'return_to_pillars_of_judgement':
      case 'return_to_pillars_of_judgment':
        return this.forgottenIcon('return_to_pillars_of_judgement', size, color);
      case 'return_to_heart_of_the_elders_part_2':
      case 'return_to_knyan':
        return this.forgottenIcon('return_to_knyan', size, color);
      case 'return_to_heart_of_the_elders':
      case 'return_to_the_heart_of_the_elders':
        return this.forgottenIcon('return_to_the_heart_of_the_elders', size, color);
      case 'wog':
      case 'war_of_the_outer_gods':
        return this.standaloneIcon('war_of_the_outer_gods', size, color);
      case 'children_of_paradise':
        return this.standaloneIcon('children_of_paradise', size, color);
      case 'swarm_of_assimilation':
      case 'assimilating_swarm':
        return this.standaloneIcon('assimilating_swarm', size, color);
      case 'death_of_stars':
      case 'death_of_the_stars':
        return this.standaloneIcon('death_of_the_stars', size, color);
      case 'tcu':
      case 'tcup':
      case 'tcuc':
        return this.circleIcon('the_circle_undone', size, color);
      case 'rttcu':
        return this.circleIcon('rttcu', size, color);
      case 'tsn':
      case 'the_secret_name':
        return this.circleIcon('the_secret_name', size, color);
      case 'wos':
      case 'the_wages_of_sin':
        return this.circleIcon('the_wages_of_sin', size, color);
      case 'fgg':
      case 'for_the_greater_good':
        return this.circleIcon('for_the_greater_good', size, color);
      case 'uad':
      case 'union_and_disillusion':
        return this.circleIcon('union_and_disillusion', size, color);
      case 'icc':
      case 'in_the_clutches_of_chaos':
        return this.circleIcon('in_the_clutches_of_chaos', size, color);
      case 'bbt':
      case 'before_the_black_throne':
        return this.circleIcon('before_the_black_throne', size, color);
      case 'disappearance_at_the_twilight_estate':
      case 'return_to_disappearance_at_the_twilight_estate':
      case 'the_witching_hour':
      case 'return_to_the_witching_hour':
      case 'at_deaths_doorstep':
      case 'return_to_at_deaths_doorstep':
      case 'return_to_the_secret_name':
      case 'return_to_the_wages_of_sin':
      case 'return_to_for_the_greater_good':
      case 'return_to_union_and_disillusion':
      case 'return_to_in_the_clutches_of_chaos':
      case 'return_to_before_the_black_throne':
      case 'the_circle_undone':
      case 'agents_of_azathoth':
      case 'anettes_coven':
      case 'city_of_sins':
      case 'inexorable_fate':
      case 'realm_of_death':
      case 'silver_twilight_lodge':
      case 'spectral_predators':
      case 'the_watcher':
      case 'trapped_spirits':
      case 'witchcraft':
      case 'music_of_the_damned':
      case 'secrets_of_the_universe':
      case 'city_of_the_damned':
      case 'bloodthirsty_spirits':
        return this.circleIcon(encounter_code, size, color);
      case 'unspeakable_fate':
      case 'unavoidable_demise':
        return this.circleIcon('unspeakable_fate', size, color);
      case 'witchwork':
      case 'hexcraft':
        return this.circleIcon('witchwork', size, color);
      case 'spectral_realm':
      case 'unstable_realm':
        return this.circleIcon('spectral_realm', size, color);
      case 'chilling_mists':
      case 'cold_fog':
        return this.circleIcon('cold_fog', size, color);
      case 'threatening_evils':
      case 'threatening_evil':
      case 'impending_evils':
        return this.circleIcon('threatening_evil', size, color);
      case 'tdeb':
        return this.dreamIcon('agents_of_atlach_nacha', size, color);
      case 'tdea':
        return this.dreamIcon('dreamers_curse', size, color);
      case 'tde':
      case 'tdep':
      case 'tdec':
      case 'the_dream_eaters':
        return this.dreamIcon('dream', size, color);
      case 'agents_of_atlach_nacha':
      case 'agents_of_nyarlathotep':
      case 'beyond_the_gates_of_sleep':
      case 'corsairs':
      case 'creatures_of_the_underworld':
      case 'dreamers_curse':
      case 'dreamlands':
      case 'merging_realities':
      case 'spiders':
      case 'waking_nightmare':
      case 'whispers_of_hypnos':
      case 'zoogs':
      case 'descent_into_the_pitch':
      case 'terror_of_the_vale':
        return this.dreamIcon(encounter_code, size, color);
      case 'sfk':
      case 'the_search_for_kadath':
        return this.dreamIcon('the_search_for_kadath', size, color);
      case 'wgd':
      case 'where_the_gods_dwell':
      case 'where_gods_dwell':
        return this.dreamIcon('where_gods_dwell', size, color);
      case 'woc':
      case 'weaver_of_the_cosmos':
        return this.dreamIcon('weaver_of_the_cosmos', size, color);
      case 'dsm':
      case 'dark_side_of_the_moon':
        return this.dreamIcon('dark_side_of_the_moon', size, color);
      case 'tsh':
      case 'a_thousand_shapes_of_horror':
        return this.dreamIcon('a_thousand_shapes_of_horror', size, color);
      case 'pnr':
      case 'point_of_no_return':
        return this.dreamIcon('point_of_no_return', size, color);
      case 'in_too_deep':
      case 'itd':
        return this.innsmouthIcon('in_too_deep', size, color);
      case 'devil_reef':
      case 'def':
        return this.innsmouthIcon('devil_reef', size, color);
      case 'horror_in_high_gear':
      case 'hhg':
        return this.innsmouthIcon('horror_in_high_gear', size, color);
      case 'itm':
      case 'into_the_maelstrom':
        return this.innsmouthIcon('into_the_maelstrom', size, color);
      case 'tic':
      case 'ticp':
      case 'ticc':
      case 'the_innsmouth_conspiracy':
        return this.innsmouthIcon('tic', size, color);
      case 'tdcp':
        return this.drownedIcon('tdcp', size, color);
      case 'tdc':
      case 'tdcc':
        return this.drownedIcon('tdcc', size, color);
      case 'the_grand_vault':
      case 'one_last_job':
      case 'the_drowned_quarter':
      case 'the_apiary':
      case 'tasks':
      case 'the_inescapable':
      case 'elder_mist':
      case 'dreams':
      case 'domination':
      case 'deep_ones':
      case 'cosmic_legacy':
      case 'alien_machinery':
      case 'court_of_the_ancients':
      case 'tdc_flood':
      case 'tdc_expedition':
      case 'pilgrims':
      case 'rlyeh':
      case 'obsidian_canyons':
      case 'sepulchre_of_the_sleeper':
      case 'star_spawn':
      case 'stowaways':
      case 'the_doom_of_arkham_part_1':
      case 'the_doom_of_arkham_part_2':
      case 'the_western_wall':
      case 'undersea_creatures':
        return this.drownedIcon(encounter_code, size, color);
      case 'creatures_of_the_deep':
        return this.innsmouthIcon('creatures_from_below', size, color);
      case 'the_locals':
      case 'locals':
        return this.innsmouthIcon('locals', size, color);
      case 'the_vanishing_of_elina_harper':
        return this.innsmouthIcon('disappearance_of_elina_harper', size, color);
      case 'the_pit_of_despair':
        return this.innsmouthIcon('grotto_of_despair', size, color);
      case 'flooded_caverns':
        return this.innsmouthIcon('flooded_caves', size, color);
      case 'a_light_in_the_fog':
      case 'lif':
        return this.innsmouthIcon('a_light_in_the_fog', size, color);
      case 'the_lair_of_dagon':
      case 'lair_of_dagon':
      case 'lod':
        return this.innsmouthIcon('lair_of_dagon', size, color);
      case 'agents_of_dagon':
      case 'agents_of_hydra':
      case 'rising_tide':
      case 'fog_over_innsmouth':
      case 'shattered_memories':
      case 'syzygy':
      case 'malfunction':
        return this.innsmouthIcon(encounter_code, size, color);
      case 'the_tatterdemalion':
      case 'electric_nightmare':
      case 'lost_quantum':
      case 'in_the_shadow_of_earth':
      case 'strange_moons':
      case 'the_machine_in_yellow':
      case 'fragment_of_carcosa':
      case 'starfall':
      case 'deep_space':
      case 'anachronism':
      case 'dark_past':
      case 'artificial_intelligence':
      case 'endtimes':
      case 'the_boogeyman':
      case 'interstellar_predators':
      case 'hasturs_gaze':
        return this.darkMatterIcon(encounter_code, size, color);
      case 'dark_matter':
      case 'zdm':
        return this.darkMatterIcon('the_tatterdemalion', size, color);
      case 'zez':
      case 'the_symphony_of_erich_zann':
      case 'the_symphony_of_erich_zahn':
        return this.standaloneIcon('zez', size, color);
      case 'zcos':
      case 'the_colour_out_of_space':
        return this.standaloneIcon('meteoric_phenomenon', size, color);
      case 'a_sea_of_troubles':
      case 'gurathnakas_shadows':
      case 'arkham_in_wonderland':
      case 'warped_reality':
      case 'bleeding_hearts':
      case 'card_guards':
      case 'riddles_and_games':
      case 'wonderland_boons':
      case 'wonderland_banes':
      case 'fools_mate':
      case 'chessmen':
      case 'lucid_nightmare':
      case 'alice_in_arkham':
      case 'sibling_rivalry':
      case 'tempest_in_a_teapot':
      case 'walrus_and_carpenter':
      case 'wild_snark_chase':
      case 'dodo':
      case 'caterpillar':
      case 'white_queen':
      case 'gryphon_and_mock_turtle':
      case 'duchess':
      case 'humpty_dumpty':
      case 'lion_and_unicorn':
        return this.aliceIcon(encounter_code, size, color);
      case 'zce':
      case 'crown_of_egil':
        return this.aliceIcon('zce', size, color);
      case 'golden_circle':
      case 'the_golden_circle':
        return this.aliceIcon('golden_circle', size, color);
      case 'berserkers':
      case 'draugar':
      case 'glacial_mists':
      case 'hudulfolk':
      case 'lacuna':
      case 'runic_oaths':
      case 'the_crown':
      case 'the_fallen':
      case 'the_warning':
        return this.aliceIcon(encounter_code, size, color);
      case 'chesire_cat':
      case 'cheshire_cat':
        return this.aliceIcon('cheshire_cat', size, color);
      case 'jabberwocky':
        return this.aliceIcon('jabberwock', size, color);
      case 'zbt':
        return this.standaloneIcon('beta', size, color);
      case 'alice_in_wonderland':
      case 'zaw':
        return this.aliceIcon('alice_in_wonderland', size, color);
      case 'coc_deep_ones':
      case 'sinking_ship':
      case 'the_black_stone':
      case 'occultism':
      case 'magyar':
      case 'natural_hazards':
      case 'wild_beasts':
      case 'ancient_hunger':
      case 'witch_cult':
      case 'tomes':
        return this.standaloneIcon(encounter_code, size, color);
      case 'legendry':
        return this.standaloneIcon('legendary', size, color);
      case 'zbs':
        return this.standaloneIcon('the_black_stone', size, color);
      case 'consternation_on_the_constellation':
      case 'zcc':
        return this.standaloneIcon('consternation_on_the_constellation', size, color);
      case 'eoep':
        return this.edgeIcon('eoe', size, color);
      case 'eoe':
      case 'eoec':
      case 'edge_of_the_earth':
        return this.edgeIcon('eoe_campaign', size, color);
      case 'to_the_forbidden_peaks':
      case 'the_great_seal':
      case 'city_of_the_elder_things':
      case 'silence_and_mystery':
      case 'nameless_horrors':
      case 'memorials_of_the_lost':
      case 'ice_and_death':
      case 'elder_things':
      case 'creatures_in_the_ice':
      case 'the_crash':
      case 'stirring_in_the_deep':
      case 'penguins':
      case 'miasma':
      case 'lost_in_the_night':
      case 'left_behind':
      case 'hazards_of_antarctica':
      case 'expedition_team':
      case 'deadly_weather':
      case 'shoggoths':
      case 'agents_of_the_unknown':
        return this.edgeIcon(encounter_code, size, color);
      case 'fatal_mirage':
      case 'fatal_mirage_2':
      case 'fatal_mirage_3':
        return this.edgeIcon('fatal_mirage', size, color);
      case 'the_heart_of_madness_part_1':
      case 'the_heart_of_madness_part_2':
      case 'the_heart_of_madness':
        return this.edgeIcon('the_heart_of_madness', size, color);
      case 'tekeli_li':
      case 'tekelili':
        return this.edgeIcon('tekeli_li', size, color);
      case 'ice_and_death_part_1':
      case 'ice_and_death_part_2':
      case 'ice_and_death_part_3':
        return this.edgeIcon('ice_and_death', size, color);
      case 'sleeping_nightmares':
      case 'seeping_nightmares':
        return this.edgeIcon('sleeping_nightmares', size, color);
      case 'tsk':
      case 'tskp':
        return this.scarletIcon('tsk', size, color);
      case 'tskc':
      case 'riddles_and_rain':
      case 'mysteries_abound':
      case 'agents_of_the_outside':
      case 'beyond_the_beyond':
      case 'congress_of_the_keys':
      case 'dancing_mad':
      case 'dead_heat':
      case 'dogs_of_war':
      case 'outsiders':
      case 'scarlet_sorcery':
      case 'spatial_anomaly':
      case 'strange_happening':
      case 'secret_war':
      case 'shadow_of_a_doubt':
      case 'without_a_trace':
      case 'agents_of_yuggoth':
      case 'cleanup_crew':
      case 'crimson_conspiracy':
      case 'dark_veiling':
      case 'dealings_in_the_dark':
      case 'globetrotting':
      case 'on_thin_ice':
      case 'strange_happenings':
      case 'red_coterie':
      case 'sanguine_shadows':
      case 'spreading_corruption':
        return this.scarletIcon(encounter_code, size, color);
      case 'shades_of_suffering':
      case 'shades_of_sorrow':
        return this.scarletIcon('shades_of_sorrow', size, color);
      case 'arkham_ma':
        return this.scarletIcon('arkham', size, color);
      case 'constantinople':
      case 'istanbul':
        return this.scarletIcon('constantinople', size, color);
      case 'bermuda':
        return this.scarletIcon('bermuda_2', size, color);
      case 'bermuda_triangle':
        return this.scarletIcon('bermuda', size, color);
      case 'alexandria':
      case 'anchorage':
      case 'bombay':
      case 'buenos_aires':
      case 'cairo':
      case 'havana':
      case 'hong_kong':
      case 'kabul':
      case 'kathmandu':
      case 'kuala_lampur':
      case 'lagos':
      case 'london':
      case 'manokwari':
      case 'marrakesh':
      case 'monte_carlo':
      case 'moscow':
      case 'nairobi':
      case 'new_orleans':
      case 'perth':
      case 'quito':
      case 'reykjavik':
      case 'rio_de_janiero':
      case 'rome':
      case 'san_francisco':
      case 'san_juan':
      case 'shanghai':
      case 'stockholm':
      case 'sydney':
      case 'tokyo':
      case 'tunguska':
      case 'ybor_city':
        return this.scarletIcon(encounter_code, size, color);
      case 'venice_it':
        return this.scarletIcon('venice', size, color);
      case 'agents_of_cthugha':
        return this.darkMatterIcon('agents_of_cthugua', size, color);
      case 'agency_survivors':
      case 'gifts_of_the_plaguebearer':
      case 'haze_of_miasma':
      case 'life_and_death':
      case 'the_plaguebearers_commands':
      case 'tenuous_allies':
      case 'fallen_arkham':
      case 'unbound_power':
      case 'late_risers':
      case 'night_on_the_town':
      case 'dead_by_dawn':
      case 'high_noon_descent':
      case 'the_afternoon_war':
      case 'death_at_sundown':
      case 'the_midnight_hour':
        return this.darkMatterIcon(encounter_code, size, color);
      case 'zcf':
      case 'across_dreadful_waters':
      case 'archaic_evils':
      case 'architects_of_chaos':
      case 'awakened_madness':
      case 'blood_from_stones':
      case 'countermeasures':
      case 'crumbling_masonry':
      case 'cult_of_cthulhu':
      case 'deep_dreams':
      case 'going_twice':
      case 'grand_compass':
      case 'lost_moorings':
      case 'private_lives':
      case 'pyroclastic_flow':
      case 'shadowy_agents':
      case 'storm_and_sea':
      case 'tomb_of_dead_dreams':
      case 'unfriendly_ports':
      case 'unnatural_stone':
        return this.cyclopeanIcon(encounter_code, size, color);

      case 'spawn_of_rlyeh':
      case 'spawn_of_ryleh':
        return this.cyclopeanIcon('spawn_of_ryleh', size, color);

      case 'zhu':
      case 'the_fall_of_the_house_of_usher':
        return this.standaloneIcon('the_fall_of_the_house_of_usher', size, color);
      case 'zatw':
      case 'against_the_wendigo':
        return this.standaloneIcon('wendigo', size, color);
      case 'hanninah_valley':
      case 'hannihah_valley':
        return this.standaloneIcon('hannihah_valley', size, color);
      case 'wendigos_myth':
        return this.standaloneIcon('wendigos_myth', size, color);
      case 'zjc':
      case 'jennys_choice':
      case 'lost_cathedral':
        return this.standaloneIcon('lost_cathedral', size, color);

      case 'fof':
      case 'fortune_and_folly_part_1':
      case 'fortune_and_folly_part_2':
        return this.standaloneIcon('roulette', size, color);
      case 'fortune_and_folly':
      case 'fortunes_chosen':
      case 'plan_in_shambles':
        return this.standaloneIcon(encounter_code, size, color);
      case 'mourning_chorus':
        return this.darkMatterIcon('mourning_stroll', size, color);
      case 'zcp':
      case 'call_of_the_plaguebearer':
        return this.darkMatterIcon('call_of_the_plaguebearer', size, color);
      case 'zcu':
        return this.appIcon('logo', size, color)
      case 'zsti':
        return this.appIcon('investigator', size, color);

      case 'zhod':
      case 'heart_of_darkness':
        return this.cyclopeanIcon('heart_of_darkness', size, color);
      case 'zhod_africa_is_watching':
      case 'africa_is_watching':
        return this.cyclopeanIcon('africa_is_watching', size, color);
      case 'zhod_to_the_heart_of_the_congo':
      case 'to_the_heart_of_the_congo':
        return this.cyclopeanIcon('to_the_heart_of_the_congo', size, color);
      case 'zhod_the_avatar_of_darkness':
      case 'the_avatar_of_darkness':
        return this.cyclopeanIcon('the_avatar_of_darkness', size, color);
      case 'zhod_the_darkness':
        return this.cyclopeanIcon('the_darkness', size, color);
      case 'zhod_african_wildlife':
        return this.cyclopeanIcon('african_wildlife', size, color);
      case 'zhod_lands_of_the_congo':
        return this.cyclopeanIcon('lands_of_the_congo', size, color);
      case 'zhod_cult_of_darkness':
        return this.cyclopeanIcon('cult_of_darkness', size, color);
      case 'zrttic':
      case 'rttic':
        return this.innsmouthIcon('rttic', size, color);
      case 'return_to_the_pit_of_despair':
      case 'zreturn_to_the_pit_of_despair':
        return this.innsmouthIcon('return_to_the_pit_of_despair', size, color);
      case 'return_to_the_vanishing_of_elina_harper':
      case 'zreturn_to_the_vanishing_of_elina_harper':
        return this.innsmouthIcon('return_to_the_vanishing_of_elina_harper', size, color);
      case 'return_to_in_too_deep':
      case 'zreturn_to_in_too_deep':
        return this.innsmouthIcon('return_to_in_too_deep', size, color);
      case 'return_to_devil_reef':
      case 'zreturn_to_devil_reef':
        return this.innsmouthIcon('return_to_devil_reef', size, color);
      case 'return_to_horror_in_high_gear':
      case 'zreturn_to_horror_in_high_gear':
        return this.innsmouthIcon('return_to_horror_in_high_gear', size, color);
      case 'return_to_horror_in_high_gear':
      case 'zreturn_to_horror_in_high_gear':
        return this.innsmouthIcon('return_to_horror_in_high_gear', size, color);
      case 'return_to_a_light_in_the_fog':
      case 'zreturn_to_a_light_in_the_fog':
        return this.innsmouthIcon('return_to_a_light_in_the_fog', size, color);
      case 'return_to_the_lair_of_dagon':
      case 'zreturn_to_the_lair_of_dagon':
        return this.innsmouthIcon('return_to_the_lair_of_dagon', size, color);
      case 'return_to_into_the_maelstrom':
      case 'zreturn_to_into_the_maelstrom':
        return this.innsmouthIcon('return_to_into_the_maelstrom', size, color);
      case 'zstalkers_of_cthulhu':
        return this.innsmouthIcon('stalkers_of_cthulhu', size, color);
      case 'zrolling_tide':
        return this.innsmouthIcon('rolling_tide', size, color);
      case 'zinnsmouth_haze':
        return this.innsmouthIcon('innsmouth_haze', size, color);
      case 'zbarricaded_doors':
        return this.innsmouthIcon('barricaded_doors', size, color);
      case 'zoccultation':
        return this.innsmouthIcon('occultation', size, color);
      case 'zreturn_to_flooded_caverns':
        return this.innsmouthIcon('return_to_flooded_caverns', size, color);
      case 'zoc':
        return this.standaloneIcon('zoc', size, color);
      case 'rop':
      case 'relics_of_the_past':
        return this.standaloneIcon('rop', size, color);
      case 'arkham_incidents':
      case 'zai':
        return this.standaloneIcon('arkham_incidents', size, color);
      case 'too_noble':
      case 'something_big':
      case 'unscrupulous_investments':
      case 'anything_once':
      case 'mysterious_benefits':
        return this.standaloneIcon(encounter_code, size, color);
      case 'fhvp':
        return this.hemlockIcon('fhvp', size, color);
      case 'fhv':
      case 'fhvc':
        return this.hemlockIcon('fhvc', size, color);
      case 'codex':
        return this.arkhamIcon('codex', size, color);
      case 'the_first_day':
      case 'the_second_day':
      case 'the_final_day':
      case 'agents_of_the_colour':
      case 'blight':
      case 'day_of_rain':
      case 'day_of_rest':
      case 'day_of_the_feast':
      case 'fate_of_the_vale':
      case 'fire':
      case 'heirlooms':
      case 'hemlock_house':
      case 'horrors_in_the_rock':
      case 'mutations':
      case 'myconids':
      case 'refractions':
      case 'residents':
      case 'the_forest':
      case 'the_longest_night':
      case 'the_silent_heath':
      case 'the_thing_in_the_depths':
      case 'the_twisted_hollow':
      case 'the_vale':
      case 'transfiguration':
      case 'written_in_rock':
      case 'the_lost_sister':
        return this.hemlockIcon(encounter_code, size, color);

      case 'depraved_legions':
      case 'spiraling_inferno':
      case 'scorched_wasteland':
      case 'malevolent_ritual':
      case 'final_annihilation':
        return this.standaloneIcon(encounter_code, size, color);
      case 'zlf':
      case 'legions_of_fire':
        return this.standaloneIcon('legions_of_fire', size, color);

      case 'zoz_the_road_to_oz': return this.ozIcon('the_road_to_oz', size, color);
      case 'zoz_ferocious_beasts': return this.ozIcon('ferocious_beasts', size, color);
      case 'zoz_wicked_witches': return this.ozIcon('wicked_witches', size, color);
      case 'zoz_prismatic_evils': return this.ozIcon('prismatic_evils', size, color);
      case 'zoz_terror_out_of_space': return this.ozIcon('terror_out_of_space', size, color);
      case 'zoz_princess_of_oz': return this.ozIcon('princess_of_oz', size, color);
      case 'zoz_chromatic_infection': return this.ozIcon('chromatic_infection', size, color);
      case 'zoz_deep_impact': return this.ozIcon('deep_impact', size, color);
      case 'zoz_emerald_city': return this.ozIcon('emerald_city', size, color);
      case 'zoz_alien_vibrance': return this.ozIcon('alien_vibrance', size, color);
      case 'zoz_horrid_infection': return this.ozIcon('horrid_infection', size, color);
      case 'zoz_companions_of_oz': return this.ozIcon('companions_of_oz', size, color);
      case 'zoz_spiraling_decay': return this.ozIcon('spiraling_decay', size, color);
      case 'zoz_double_whammy': return this.ozIcon('double_whammy', size, color);
      case 'zoz_chasing_rainbows': return this.ozIcon('chasing_rainbows', size, color);
      case 'zoz_blighted_land': return this.ozIcon('blighted_land', size, color);
      case 'zoz_misery_loves_company': return this.ozIcon('misery_loves_company', size, color);
      case 'zoz_nomes': return this.ozIcon('nomes', size, color);
      case 'zoz_violent_invasion': return this.ozIcon('violent_invasion', size, color);
      case 'zoz_hall_of_the_mountain_king': return this.ozIcon('hall_of_the_mountain_king', size, color);
      case 'zoz_defense_of_the_realm': return this.ozIcon('defense_of_the_realm', size, color);
      case 'zoz_true_colours': return this.ozIcon('true_colours', size, color);
      case 'zoz_the_colour_itself':
        return <TheColourItself size={size} />
      case 'zoz_munchkin': return this.ozIcon('munchkin_country', size, color);
      case 'zoz_winkie': return this.ozIcon('winkie_country', size, color);
      case 'zoz_quadling': return this.ozIcon('quadling_country', size, color);
      case 'zoz_gillikin': return this.ozIcon('gillikin_country', size, color);
      case 'zoz':
      case 'the_colour_out_of_oz':
        return this.ozIcon('zoz', size, color);
      case 'zau_night_of_fire':
      case 'a_night_of_fire':
        return this.agesIcon('a_night_of_fire', size, color);
      case 'zau_myriad_gentleman':
      case 'the_myriad_gentleman':
        return this.agesIcon('the_myriad_gentleman', size, color);
      case 'zau_world_torn_down':
      case 'a_world_torn_down':
        return this.agesIcon('a_world_torn_down', size, color);
      case 'zau_unstuck':
      case 'unstuck':
        return this.agesIcon('unstuck', size, color);
      case 'zau_year_to_plan':
      case 'a_year_to_plan':
        return this.agesIcon('a_year_to_plan', size, color);
      case 'zau_world_torn_down_again':
      case 'a_world_torn_down_again':
        return this.agesIcon('a_world_torn_down_again', size, color);
      case 'zau_time_runs_out':
      case 'time_runs_out':
        return this.agesIcon('time_runs_out', size, color);
      case 'zau_agents_of_aforgomon': return this.agesIcon('agents_of_aforgomon', size, color);
      case 'zau_missions': return this.agesIcon('missions', size, color);
      case 'zau_myriad': return this.agesIcon('myriad', size, color);
      case 'zau_night_of_the_ritual': return this.agesIcon('night_of_the_ritual', size, color);
      case 'zau_nyctophobia': return this.agesIcon('nyctophobia', size, color);
      case 'zau_paradox': return this.agesIcon('paradox', size, color);
      case 'zau_shifting_reality': return this.agesIcon('shifting_reality', size, color);
      case 'zau_thugs': return this.agesIcon('thugs', size, color);
      case 'zau_unleashed_chaos': return this.agesIcon('unleashed_chaos', size, color);
      case 'zau_unravelling_years': return this.agesIcon('unravelling_years', size, color);
      case 'zau':
      case 'zau_ages_unwound': return this.agesIcon('ages_unwound', size, color);
      case 'tablet':
        return this.arkhamIcon('tablet', size, color);
      case 'rcore':
      default:
        return this.coreIcon('core', size, color);

    }
  }
}
