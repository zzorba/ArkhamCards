import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { Campaign, CUSTOM } from 'actions/types';
import { CardsMap } from 'data/Card';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import { getCampaign, AppState } from 'reducers';
import typography from 'styles/typography';
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
        <LinearGradient
          colors={['#fbfaf6', '#ebe6d4']}
          style={styles.container}
        >
          { campaign.cycleCode !== CUSTOM && (
            <Text style={[typography.text, styles.bottomMargin]}>
              { campaign.name }
            </Text>
          ) }
          <CampaignSummaryComponent
            campaign={campaign}
            hideScenario
          />
          { !!campaignA && !!campaignB && (
            <CampaignInvestigatorRow
              campaigns={[campaignA, campaignB]}
              investigators={investigators}
            />
          ) }
        </LinearGradient>
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
  bottomMargin: {
    marginBottom: s,
  },
});
