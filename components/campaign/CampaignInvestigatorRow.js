import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import InvestigatorImage from '../core/InvestigatorImage';
import { getDecks } from '../../reducers';

class CampaignInvestigatorRow extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    campaign: PropTypes.object.isRequired,
    investigators: PropTypes.object.isRequired,
    // From redux
    decks: PropTypes.array,
  };

  render() {
    const {
      investigators,
      decks,
    } = this.props;
    const latestInvestigators = flatMap(decks,
      deck => deck && deck.investigator_code && investigators[deck.investigator_code]);
    return (
      <View style={styles.row}>
        { map(latestInvestigators, card => (
          <View key={card.code} style={styles.investigator}>
            <InvestigatorImage card={card} small />
          </View>
        )) }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    decks: getDecks(state, props.campaign.latestDeckIds || []),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignInvestigatorRow);

const styles = StyleSheet.create({
  row: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  investigator: {
    marginRight: 8,
    marginBottom: 8,
  },
});
