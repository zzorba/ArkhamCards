import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import LabeledTextBox from '../../core/LabeledTextBox';
import { CUSTOM, CORE, Campaign, CampaignCycleCode } from '../../../actions/types';

interface Props {
  componentId: string;
  campaignChanged: (cycleCode: CampaignCycleCode, campaignName: string) => void;
}

interface State {
  selectedCampaign: string;
  selectedCampaignCode: CampaignCycleCode;
  customCampaign?: string;
}
export default class CampaignSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedCampaign: L('The Night of the Zealot'),
      selectedCampaignCode: CORE,
    };
  }

  componentDidMount() {
    this._updateManagedCampaign();
  }

  _updateManagedCampaign = () => {
    const {
      selectedCampaign,
      selectedCampaignCode,
      customCampaign,
    } = this.state;
    this.props.campaignChanged(
      selectedCampaignCode,
      selectedCampaignCode === CUSTOM ?
        (customCampaign || 'Custom Campaign') :
        selectedCampaign,
    );
  };

  _campaignChanged = (code: CampaignCycleCode, text: string) => {
    this.setState({
      selectedCampaign: text,
      selectedCampaignCode: code,
    }, this._updateManagedCampaign);
  };

  _campaignPressed = () => {
    const {
      componentId,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Dialog.Campaign',
        passProps: {
          campaignChanged: this._campaignChanged,
          selected: this.state.selectedCampaign,
        },
        options: {
          topBar: {
            backButton: {
              title: L('Back'),
            },
          },
        },
      },
    });
  };

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
