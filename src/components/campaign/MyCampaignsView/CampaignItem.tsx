import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Campaign, CUSTOM } from 'actions/types';
import { CardsMap } from '@data/Card';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import { m, s } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  campaign: Campaign;
  onPress: (id: number, campaign: Campaign) => void;
  investigators: CardsMap;
}

export default class CampaignItem extends React.Component<Props> {
  _onPress = () => {
    const {
      campaign,
      onPress,
    } = this.props;
    onPress(campaign.id, campaign);
  };

  render() {
    const {
      campaign,
      investigators,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.container}>
          <CampaignSummaryComponent
            campaign={campaign}
            name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
          />
          <CampaignInvestigatorRow
            campaigns={[campaign]}
            investigators={investigators}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: m,
    paddingRight: s,
    paddingTop: s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  },
});
