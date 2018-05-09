import React from 'react';
import PropTypes from 'prop-types';

import { queryForInvestigator } from '../lib/InvestigatorRequirements';
import CardSearchComponent from './CardSearchComponent';

export default function InvestigatorCardsView({ navigator, investigator }) {
  return (
    <CardSearchComponent
      navigator={navigator}
      baseQuery={investigator ? queryForInvestigator(investigator) : null}
    />
  );
}

InvestigatorCardsView.propTypes = {
  navigator: PropTypes.object.isRequired,
  investigator: PropTypes.object.isRequired,
};
