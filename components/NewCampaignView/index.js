import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { getPacksInCollection } from '../../reducers';
import CampaignSelector from './CampaignSelector';

class NewCampaignView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    newCampaign: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    props.navigator.setTitle({
      title: 'New Campaign',
    });

    this.state = {
      campaign: null,
      campaignCode: null,
    };

    this._campaignChanged = this.campaignChanged.bind(this);
  }

  campaignChanged({ campaign, campaignCode }) {
    this.setState({
      campaign,
      campaignCode,
    });
  }

  render() {
    const {
      navigator,
    } = this.props;

    return (
      <View>
        <CampaignSelector
          navigator={navigator}
          campaignChanged={this._campaignChanged}
        />
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCampaignView);
