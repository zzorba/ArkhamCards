import React from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { SelectCampagaignProps } from '../SelectCampaignDialog';
import PickerStyleButton from '@components/core/PickerStyleButton';
import { CUSTOM, CORE, CampaignCycleCode } from 'actions/types';

interface Props {
  componentId: string;
  campaignChanged: (
    cycleCode: CampaignCycleCode,
    campaignName: string,
    hasGuide: boolean
  ) => void;
}

interface State {
  selectedCampaign: string;
  selectedCampaignCode: CampaignCycleCode;
  customCampaign?: string;
  hasGuide: boolean;
}
export default class CampaignSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasGuide: true,
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
      hasGuide,
    } = this.state;
    this.props.campaignChanged(
      selectedCampaignCode,
      selectedCampaignCode === CUSTOM ?
        (customCampaign || 'Custom Campaign') :
        selectedCampaign,
      hasGuide
    );
  };

  _campaignChanged = (code: CampaignCycleCode, text: string, hasGuide: boolean) => {
    this.setState({
      selectedCampaign: text,
      selectedCampaignCode: code,
      hasGuide,
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
      <PickerStyleButton
        title={t`Campaign`}
        value={selectedCampaign}
        id="campaign"
        onPress={this._campaignPressed}
        widget="nav"
      />
    );
  }
}
