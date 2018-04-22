import React from 'react';
import PropTypes from 'prop-types';
import { map, sortBy, values } from 'lodash';
import {
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import CampaignItem from './CampaignItem';

class CampaignsView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaigns: PropTypes.array,
  };

  render() {
    const {
      campaigns,
    } = this.props;
    return (
      <ScrollView>
        { map(campaigns, campaign => (
          <CampaignItem key={campaign.id} campaign={campaign} />))
        }
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  const campaigns = sortBy(
    values(state.campaigns.all),
    campaign => campaign.lastModified);
  return {
    campaigns,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignsView);
