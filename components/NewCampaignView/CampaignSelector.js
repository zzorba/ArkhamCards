import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';

import LabeledTextBox from '../core/LabeledTextBox';
import { CUSTOM } from './constants';

export default class CampaignSelector extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedCampaign: 'The Night of the Zealot',
      selectedCampaignCode: 'core',
      customCampaign: '',
    };

    this._updateManagedCampaign = this.updateManagedCampaign.bind(this);
    this._campaignPressed = this.campaignPressed.bind(this);
    this._customCampaignTextChanged = this.customCampaignTextChanged.bind(this);
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

  customCampaignTextChanged(value) {
    this.setState({
      customCampaign: value,
    }, this._updateManagedCampaign);
  }

  campaignPressed() {
    const {
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Dialog.Campaign',
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
      selectedCampaignCode,
      customCampaign,
    } = this.state;

    return (
      <View>
        <LabeledTextBox
          label="Campaign"
          onPress={this._campaignPressed}
          value={selectedCampaign}
          style={styles.margin}
        />
        { selectedCampaignCode === CUSTOM && (
          <View style={styles.row}>
            <Input
              placeholder="Custom Campaign Name"
              onChangeText={this._customCampaignTextChanged}
              value={customCampaign}
            />
          </View>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
});
