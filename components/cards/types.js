import PropTypes from 'prop-types';

const CardShape = {
  pack_code: PropTypes.string.isRequired,
  pack_name: PropTypes.string.isRequired,
  type_code: PropTypes.string.isRequired,
  type_name: PropTypes.string.isRequired,
  subtype_code: PropTypes.string,
  subtype_name: PropTypes.string,
  faction_code: PropTypes.string,
  faction_name: PropTypes.string,
  position: PropTypes.number,
  exceptional: PropTypes.bool,
  xp: PropTypes.number,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  real_name: PropTypes.string.isRequired,
  text: PropTypes.string,
  real_text: PropTypes.string,
  quantity: PropTypes.number,
  clues_fixed: PropTypes.bool,
  health_per_investigator: PropTypes.bool,
  deck_limit: PropTypes.number,
  deck_requirements: PropTypes.object,
  deck_options: PropTypes.array,
  traits: PropTypes.string,
  real_traits: PropTypes.string,
  is_unique: PropTypes.bool,
  exile: PropTypes.bool,
  hidden: PropTypes.bool,
  permanent: PropTypes.bool,
  double_sided: PropTypes.bool.isRequired,
  url: PropTypes.string,
};

export const OptionalCardType = PropTypes.shape(CardShape);
export const CardType = PropTypes.shape(CardShape).isRequired;
