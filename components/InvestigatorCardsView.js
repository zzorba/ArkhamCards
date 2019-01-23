import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import { connectRealm } from 'react-native-realm';

import { queryForInvestigator } from '../lib/InvestigatorRequirements';
import CardSearchComponent from './CardSearchComponent';

class InvestigatorCardsView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    investigatorCode: PropTypes.string.isRequired,
    investigator: PropTypes.object.isRequired,
  };

  render() {
    const {
      componentId,
      investigator,
    } = this.props;
    return (
      <CardSearchComponent
        componentId={componentId}
        baseQuery={investigator ? queryForInvestigator(investigator) : null}
      />
    );
  }
}

export default connectRealm(InvestigatorCardsView, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const investigator =
      head(results.cards.filtered(`code == "${props.investigatorCode}"`));
    return {
      investigator,
    };
  },
});
