import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Campaign, CUSTOM } from 'actions/types';
import { CardsMap } from 'data/Card';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import typography from 'styles/typography';
import { s } from 'styles/space';

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
    paddingLeft: s,
    paddingRight: s,
    paddingTop: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  bottomMargin: {
    marginBottom: s,
  },
});
