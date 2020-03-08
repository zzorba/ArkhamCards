import React from 'react';

import CarcosaIcon from './CarcosaIcon';
import CircleIcon from './CircleIcon';
import CoreSetIcon from './CoreSetIcon';
import DreamEatersIcon from './DreamEatersIcon';
import DunwichIcon from './DunwichIcon';
import ForgottenIcon from './ForgottenIcon';
import StandaloneIcon from './StandaloneIcon';

interface Props {
  encounter_code: string;
  size: number;
  color: string;
}

export default class EncounterIcon extends React.PureComponent<Props> {
  coreIcon(name: string, size: number, color: string) {
    return (<CoreSetIcon name={name} size={size} color={color} />);
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

  render() {
    const {
      encounter_code,
      size,
      color,
    } = this.props;
    switch(encounter_code) {
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
      case 'ghouls_of_umôrdhoth':
      case 'the_devourers_cult':
        return this.coreIcon(encounter_code, size, color);
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

      case 'dwl': // THE DUNWICH LEGACY
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
      case 'return_to_extracurricular_activities':
      case 'return_to_the_house_always_wins':
      case 'return_to_the_miskatonic_museum':
      case 'return_to_the_essex_county_express':
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

      case 'ptc': // THE PATH TO CARCOSA
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
      case 'stranger':
        return this.carcosaIcon('the_stranger', size, color);
      case 'promo': // PROMO
      case 'books': // NOVELLAS
        return this.coreIcon('core', size, color);
      case 'coh':
        return this.standaloneIcon('carnevale', size, color);
      case 'venice':
        return this.standaloneIcon('carnevale', size, color);
      case 'cotr':
      case 'rougarou':
        return this.standaloneIcon('curse_of_the_rougarou', size, color);
      case 'bayou':
        return this.standaloneIcon('the_bayou', size, color);
      case 'lol':
      case 'in_the_labyrinths_of_lunacy':
      case 'epic_multiplayer':
      case 'single_group':
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
        return this.standaloneIcon(encounter_code, size, color);
      case 'the_eternal_slumber':
        return this.standaloneIcon('eternal_slumber', size, color);
      case 'the_nights_usurper':
        return this.standaloneIcon('nights_usurper', size, color);
      case 'hote':
        return this.forgottenIcon('heart_of_the_elders', size, color);
      case 'tcoa':
      case 'the_city_of_archives':
        return this.forgottenIcon('city_of_archives', size, color);
      case 'tfa':
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
        return this.forgottenIcon('deadly_traps', size, color);
      case 'flux':
        return this.forgottenIcon('temporal_flux', size, color);
      case 'ruins':
        return this.forgottenIcon('forgotten_ruins', size, color);
      case 'venom':
        return this.forgottenIcon('yigs_venom', size, color);
      case 'k\'n-yan':
        return this.forgottenIcon('knyan', size, color);
      case 'pillars_of_judgment':
        return this.forgottenIcon('pillars_of_judgement', size, color);
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
        return this.forgottenIcon(encounter_code, size, color);
      case 'tcu':
        return this.circleIcon('the_circle_undone', size, color);
      case 'tsn':
        return this.circleIcon('the_secret_name', size, color);
      case 'wos':
        return this.circleIcon('the_wages_of_sin', size, color);
      case 'fgg':
        return this.circleIcon('for_the_greater_good', size, color);
      case 'uad':
        return this.circleIcon('union_and_disillusion', size, color);
      case 'icc':
        return this.circleIcon('in_the_clutches_of_chaos', size, color);
      case 'bbt':
        return this.circleIcon('before_the_black_throne', size, color);
      case 'the_circle_undone':
      case 'agents_of_azathoth':
      case 'anettes_coven':
      case 'at_deaths_doorstep':
      case 'city_of_sins':
      case 'disappearance_at_the_twilight_estate':
      case 'inexorable_fate':
      case 'realm_of_death':
      case 'silver_twilight_lodge':
      case 'spectral_predators':
      case 'the_watcher':
      case 'the_witching_hour':
      case 'trapped_spirits':
      case 'witchcraft':
      case 'music_of_the_damned':
      case 'secrets_of_the_universe':
      case 'the_secret_name':
      case 'the_wages_of_sin':
      case 'for_the_greater_good':
      case 'union_and_disillusion':
      case 'in_the_clutches_of_chaos':
      case 'before_the_black_throne':
        return this.circleIcon(encounter_code, size, color);
      case 'tde':
      case 'tdea':
      case 'tdeb':
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
      default:
        return this.coreIcon('core', size, color);
    }
  }
}
