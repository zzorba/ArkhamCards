import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import coreSetIconFonfig from './core.json';
import dunwichIconFonfig from './dunwich.json';
import carcosaIconFonfig from './carcosa.json';

const CoreSetIcon createIconSetFromIcoMoon(coreSetIconFonfig);
const DunwichIcon createIconSetFromIcoMoon(dunwichIconFonfig);
const CarcosaIcon createIconSetFromIcoMoon(carcosaIconFonfig);

const function coreIcon(name, size, color) {
  return <CoreIcon name={name} size={size} color={color} />;
}

const function dunwichIcon(name, size, color) {
  return <DunwichIcon name={name} size={size} color={color} />;
}

const function carcosaIcon(name, size, color) {
  return <CarcosaIcon name={name} size={size} color={color} />;
}

const function packToIcon(code, size, color) {
  switch(code) {
    case 'core':
      return coreIcon('core', size, color);
    case 'agents_of_hastur':
    case 'agents_of_yog':
    case 'agents_of_shub':
    case 'agents_of_cthulu':
    case 'locked_doors':
    case 'chilling_cold':
    case 'striking_fear':
    case 'ancient_evils':
    case 'rats':
    case 'ghouls':
    case 'nightgaunts':
      return coreIcon(code, size, color);
    case 'pentagram':
      return coreIcon('dark_cult', size, color);
    case 'cultists':
      return coreIcon('cult_of_umordoth', size, color);
    case 'torch':
      return coreIcon('the_gathering', size, color);
    case 'arkham':
      return coreIcon('midnight_masks', size, color);
    case 'tentacles':
      return coreIcon('the_devourer_below', size, color);

    case 'dwl': // THE DUNWICH LEGACY
      return dunwichIcon('set', size, color);
    case 'tmm':
      return dunwichIcon('the_miskatonic_museum', size, color);
    case 'tece':
      return dunwichIcon('the_essex_county_express', size, color);
    case 'bota':
      return dunwichIcon('blood_on_the_altar', size, color);
    case 'uau':
      return dunwichIcon('undimensioned_and_unseen', size, color);
    case 'wda':
      return dunwichIcon('where_doom_awaits', size, color);
    case 'litas':
      return dunwichIcon('lost_in_time_and_space', size, color);
    case 'bad_luck':
    case 'beast_thralls':
    case 'bishops_thralls':
    case 'dunwich':
    case 'hideous_abominations':
    case 'naomis_crew':
    case 'sourcery':
    case 'the_beyond':
    case 'whippoorwills':
      return dunwichIcon(code, size, color);

    case 'ptc': // THE PATH TO CARCOSA
      return carcosaIcon('carcosa', size, color);
    case 'eotp':
    case 'echoes_of_the_past':
      return carcosaIcon('echoes_of_the_past', size, color);
    case 'tuo':
    case 'the_unspeakable_oath':
      return carcosaIcon('the_unspeakable_oath', size, color);
    case 'apot':
    case 'a_phantom_of_truth':
      return carcosaIcon('a_phantom_of_truth', size, color);
    case 'tpm':
    case 'the_pallid_mask':
      return carcosaIcon('the_pallid_mask', size, color);
    case 'bsr':
    case 'black_stars_rise':
      return carcosaIcon('black_stars_rise', size, color);
    case 'byakhee':
    case 'cult_of_the_yellow_sign':
    case 'hauntings':
    case 'delusions':
    case 'evil_portents':
    case 'hasturs_gift':
    case 'inhabitants_of_carcosa':
      return carcosaIcon(code, size, color);
    case 'decay':
      return carcosaIcon('decay_and_filth', size, color);
    case 'stranger':
      return carcosaIcon('the_stranger', size, color);
    case 'dca': // DIM CARCOSA
      return carcosaIcon('carcosa', size, color);
    case 'promo': // PROMO
    case 'books': // NOVELLAS
      return coreIcon('core', size, color);
    case 'coh': // CARNEVALE OF HORRORS
    case 'cotr': // CURSE OF THE ROUGAROU
    case 'tfa': // THE FORGOTTEN AGE
      return coreIcon('core', size, color);
      break;
  }
}

export default {
  CoreSetIcon,
  DunwichIcon,
  CarcosaIcon,
};
