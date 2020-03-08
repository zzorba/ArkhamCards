import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { SelectCampagaignProps } from '../SelectCampaignDialog';
import LabeledTextBox from 'components/core/LabeledTextBox';
import { CUSTOM, CORE, CampaignCycleCode } from 'actions/types';
import { s } from 'styles/space';

interface Props {
  componentId: string;
  campaignChanged: (
    cycleCode: CampaignCycleCode,
    campaignName: string
  ) => void;
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
      selectedCampaign: t`The Night of the Zealot`,
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
    Navigation.push<SelectCampagaignProps>(componentId, {
      component: {
        name: 'Dialog.Campaign',
        passProps: {
          campaignChanged: this._campaignChanged,
        },
        options: {
          topBar: {
            backButton: {
              title: t`Back`,
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
          label={t`Campaign`}
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
    marginLeft: s,
    marginRight: s,
  },
});
