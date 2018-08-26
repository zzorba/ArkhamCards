import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../../app/i18n';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaign } from './actions';
import { getCampaign } from '../../reducers';

class CampaignEditWeaknessDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    // From redux
    weaknessSet: PropTypes.object.isRequired,
    updateCampaign: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateAssignedCards = this.updateAssignedCards.bind(this);

    props.navigator.setTitle({
      title: L('Available weaknesses'),
    });
  }

  updateAssignedCards(assignedCards) {
    const {
      campaignId,
      weaknessSet,
      updateCampaign,
    } = this.props;
    updateCampaign(
      campaignId,
      { weaknessSet: Object.assign({}, weaknessSet, { assignedCards }) }
    );
  }

  render() {
    const {
      navigator,
      weaknessSet,
    } = this.props;
    if (!weaknessSet) {
      return null;
    }
    return (
      <EditAssignedWeaknessComponent
        navigator={navigator}
        weaknessSet={weaknessSet}
        updateAssignedCards={this._updateAssignedCards}
      />
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.campaignId);
  return {
    weaknessSet: campaign.weaknessSet,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignEditWeaknessDialog);
