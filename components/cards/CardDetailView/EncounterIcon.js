import React from 'react';
import PropTypes from 'prop-types';

import CoreSetIcon from '../../../assets/CoreSetIcon';
import DunwichIcon from '../../../assets/DunwichIcon';
import CarcosaIcon from '../../../assets/CarcosaIcon';
import StandaloneIcon from '../../../assets/StandaloneIcon';

export default class EncounterIcon extends React.PureComponent {
  static propTypes = {
    encounter_code: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  };

  coreIcon(name, size, color) {
    return (<CoreSetIcon name={name} size={size} color={color} />);
  }

  dunwichIcon(name, size, color) {
    return (<DunwichIcon name={name} size={size} color={color} />);
  }

  carcosaIcon(name, size, color) {
    return (<CarcosaIcon name={name} size={size} color={color} />);
  }

  standaloneIcon(name, size, color) {
    return (<StandaloneIcon name={name} size={size} color={color} />);
  }

  render() {
    const {
      encounter_code,
      size,
      color,
    } = this.props;
    switch(encounter_code) {
      case 'core':
        return this.coreIcon('core', size, color);
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
        return this.dunwichIcon(encounter_code, size, color);

      case 'ptc': // THE PATH TO CARCOSA
        return this.carcosaIcon('carcosa', size, color);
      case 'eotp':
      case 'echoes_of_the_past':
        return this.carcosaIcon('echoes_of_the_past', size, color);
      case 'tuo':
      case 'the_unspeakable_oath':
        return this.carcosaIcon('the_unspeakable_oath', size, color);
      case 'apot':
      case 'a_phantom_of_truth':
        return this.carcosaIcon('a_phantom_of_truth', size, color);
      case 'tpm':
      case 'the_pallid_mask':
        return this.carcosaIcon('the_pallid_mask', size, color);
      case 'bsr':
      case 'black_stars_rise':
        return this.carcosaIcon('black_stars_rise', size, color);
      case 'dca':
      case 'dim_carcosa':
        return this.carcosaIcon('dim_carcosa', size, color);
      case 'byakhee':
      case 'cult_of_the_yellow_sign':
      case 'hauntings':
      case 'delusions':
      case 'evil_portents':
      case 'hasturs_gift':
      case 'inhabitants_of_carcosa':
      case 'the_last_king':
      case 'curtain_call':
        return this.carcosaIcon(encounter_code, size, color);
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
      case 'tfa': // THE FORGOTTEN AGE
      default:
        return this.coreIcon('core', size, color);
    }
  }
}
