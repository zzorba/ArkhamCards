import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import L from '../../../app/i18n';
import LabeledTextBox from '../../core/LabeledTextBox';
import { CUSTOM } from '../constants';

export default class CampaignSelector extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedCampaign: L('The Night of the Zealot'),
      selectedCampaignCode: 'core',
    };

    this._updateManagedCampaign = this.updateManagedCampaign.bind(this);
    this._campaignPressed = this.campaignPressed.bind(this);
    this._campaignChanged = this.campaignChanged.bind(this);
  }

  componentDidMount() {
    this.updateManagedCampaign();
  }

  updateManagedCampaign() {
    const {
      selectedCampaign,
      selectedCampaignCode,
      customCampaign,
    } = this.state;
    this.props.campaignChanged(
      selectedCampaignCode,
      selectedCampaignCode === CUSTOM ? customCampaign : selectedCampaign,
    );
  }

  campaignChanged(code, text) {
    this.setState({
      selectedCampaign: text,
      selectedCampaignCode: code,
    }, this._updateManagedCampaign);
  }

  campaignPressed() {
    const {
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Dialog.Campaign',
      backButtonTitle: L('Back'),
      passProps: {
        campaignChanged: this._campaignChanged,
        selected: this.state.selectedCampaign,
      },
      style: {
        backgroundColor: 'rgba(128,128,128,.75)',
      },
    });
  }

  render() {
    const {
      selectedCampaign,
    } = this.state;

    return (
      <View>
        <LabeledTextBox
          column
          label={L('Campaign')}
          onPress={this._campaignPressed}
          value={selectedCampaign}
          style={styles.margin}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
});
