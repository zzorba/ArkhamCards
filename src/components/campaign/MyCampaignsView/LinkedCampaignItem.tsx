import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { Campaign, CUSTOM } from 'actions/types';
import { CardsMap } from 'data/Card';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import { getCampaign, AppState } from 'reducers';
import { s } from 'styles/space';

interface OwnProps {
  campaign: Campaign;
  onPress: (id: number, campaign: Campaign) => void;
  investigators: CardsMap;
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
    paddingLeft: s,
    paddingRight: s,
    paddingTop: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  },
});
