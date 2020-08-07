import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { Campaign, CUSTOM } from '@actions/types';
import { CardsMap } from '@data/Card';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import { getCampaign, AppState } from '@reducers';
import { m, s } from '@styles/space';
import COLORS from '@styles/colors';

interface OwnProps {
  campaign: Campaign;
  onPress: (id: number, campaign: Campaign) => void;
  investigators: CardsMap;
  fontScale: number;
}

interface ReduxProps {
  campaignA?: Campaign;
  campaignB?: Campaign;
}

type Props = OwnProps & ReduxProps;

class LinkedCampaignItem extends React.Component<Props> {
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
      campaignA,
      campaignB,
      investigators,
      fontScale,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.container}>
          <CampaignSummaryComponent
            campaign={campaign}
            hideScenario
            name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
          />
          { !!campaignA && !!campaignB && (
            <CampaignInvestigatorRow
              campaigns={[campaignA, campaignB]}
              investigators={investigators}
              fontScale={fontScale}
            />
          ) }
        </View>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  if (!props.campaign.link) {
    return {};
  }
  return {
    campaignA: getCampaign(state, props.campaign.link.campaignIdA),
    campaignB: getCampaign(state, props.campaign.link.campaignIdB),
  };
}

export default connect(mapStateToProps)(LinkedCampaignItem);

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
