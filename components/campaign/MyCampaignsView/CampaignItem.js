import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { CUSTOM } from '../constants';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import typography from '../../../styles/typography';

export default class CampaignItem extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
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
    onPress(campaign.id, campaign);
  }

  render() {
    const {
      campaign,
      investigators,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <LinearGradient
          colors={['#fbfaf6', '#ebe6d4']}
          style={styles.container}
        >
          { campaign.cycleCode !== CUSTOM && (
            <Text style={[typography.text, styles.bottomMargin]}>
              { campaign.name }
            </Text>
          ) }
          <CampaignSummaryComponent campaign={campaign} />
          <CampaignInvestigatorRow
            campaign={campaign}
            investigators={investigators}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

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
  bottomMargin: {
    marginBottom: 8,
  },
});
