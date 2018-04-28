import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last, sortBy, values } from 'lodash';
import {
  Alert,
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { iconsMap } from '../../app/NavIcons';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deleteCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    decks: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._delete = this.delete.bind(this);

    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.delete,
          id: 'delete',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  delete() {
    const {
      id,
      deleteCampaign,
      navigator,
    } = this.props;
    deleteCampaign(id);
    navigator.pop();
  }

  onNavigatorEvent(event) {
    const {
      navigator,
      campaign,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'delete') {
        Alert.alert(
          'Delete',
          `Are you sure you want to delete the campaign: ${campaign.title}?`,
          [
            { text: 'Delete', onPress: this._delete, style: 'destructive' },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
      }
    }
  }

  render() {
    const {
      campaign,
      decks,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView>
        { campaign.title }
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = state.campaigns.all[props.id];
  return {
    campaign,
    decks: state.decks.all,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailView);
