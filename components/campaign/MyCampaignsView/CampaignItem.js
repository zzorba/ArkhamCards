import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, forEach, map, last } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import InvestigatorImage from '../../core/InvestigatorImage';
import { getDecks } from '../../../reducers';
import typography from '../../../styles/typography';

class CampaignItem extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    latestScenario: PropTypes.object,
    decks: PropTypes.array,
    investigators: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      campaign,
      onPress,
    } = this.props;
    onPress(campaign.id);
  }

  renderLastScenario() {
    const {
      latestScenario,
    } = this.props;
    if (latestScenario && latestScenario.scenario) {
      return (
        <View>
          <Text style={typography.small}>
            LAST SCENARIO
          </Text>
          <Text style={typography.text}>
            { latestScenario.scenario }
          </Text>
        </View>
      );
    }
    return (
      <View>
        <Text style={typography.small}>
          LAST SCENARIO
        </Text>
        <Text style={typography.text}>
          ---
        </Text>
      </View>
    );
  }

  render() {
    const {
      campaign,
      latestScenario,
      investigators,
      decks,
    } = this.props;
    const latestInvestigators = flatMap(decks,
      deck => investigators[deck.investigator_code]);
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.container}>
          <Text style={typography.text}>
            { campaign.name }
          </Text>
          <View style={styles.row}>
            { map(latestInvestigators, card => (
              <View key={card.code} style={styles.investigator}>
                <InvestigatorImage card={card} />
              </View>
            )) }
          </View>
          { this.renderLastScenario() }
        </View>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state, props) {
  const latestScenario = last(props.campaign.scenarioResults);
  return {
    latestScenario,
    decks: getDecks(state, props.campaign.latestDeckIds),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  row: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  investigator: {
    marginRight: 8,
  },
});
