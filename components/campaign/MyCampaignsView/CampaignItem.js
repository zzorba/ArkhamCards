import React from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import EncounterIcon from '../../../assets/EncounterIcon';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import { CUSTOM } from '../constants';
import { CAMPAIGN_NAMES, CAMPAIGN_COLORS } from '../../../constants';
import typography from '../../../styles/typography';

class CampaignItem extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    latestScenario: PropTypes.object,
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

  renderCampaign() {
    const {
      campaign: {
        cycleCode,
      },
    } = this.props;
    if (cycleCode === CUSTOM) {
      return null;
    }
    return (
      <View style={styles.marginTop}>
        <Text style={typography.small}>
          CAMPAIGN
        </Text>
        <Text style={typography.text}>
          { CAMPAIGN_NAMES[cycleCode] }
        </Text>
      </View>
    );
  }

  renderLastScenario() {
    const {
      latestScenario,
    } = this.props;
    if (latestScenario && latestScenario.scenario) {
      return (
        <View style={styles.marginTop}>
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
      <View style={styles.marginTop}>
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
      investigators,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <LinearGradient
          colors={['#ffffff', '#dddddd']}
          style={styles.container}
        >
          <Text style={typography.text}>
            { campaign.name }
          </Text>
          <View style={styles.row}>
            { campaign.cycleCode !== CUSTOM && (
              <View style={styles.backgroundIcon}>
                <EncounterIcon
                  encounter_code={campaign.cycleCode}
                  size={84}
                  color={CAMPAIGN_COLORS[campaign.cycleCode]}
                />
              </View>
            ) }
            <View>
              { this.renderCampaign() }
              { this.renderLastScenario() }
            </View>
          </View>
          <CampaignInvestigatorRow
            campaign={campaign}
            investigators={investigators}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state, props) {
  const latestScenario = last(props.campaign.scenarioResults);
  return {
    latestScenario,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignItem);

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  marginTop: {
    marginTop: 4,
  },
  backgroundIcon: {
    position: 'absolute',
    right: 22,
    top: 0,
    width: 84,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
});
