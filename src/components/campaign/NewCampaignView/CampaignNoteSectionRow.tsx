import React from 'react';
import { t } from 'ttag';

import PickerStyleButton from '@components/core/PickerStyleButton';

interface Props {
  name: string;
  isCount?: boolean;
  perInvestigator?: boolean;
  onPress?: (name: string, isCount?: boolean, perInvestigator?: boolean) => void;
}

export default class CampaignNoteSectionRow extends React.Component<Props> {
  _onPress = () => {
    const {
      name,
      isCount,
      perInvestigator,
      onPress,
    } = this.props;
    onPress && onPress(name, isCount, perInvestigator);
  };

  text() {
    const {
      name,
      isCount,
      perInvestigator,
    } = this.props;

    let result = name;
    if (perInvestigator) {
      result += t` (Per Investigator)`;
    }
    if (isCount) {
      result += ': 0';
    }
    return result;
  }

  render() {
    const {
      onPress,
    } = this.props;
    return (
      <PickerStyleButton
        id="delete"
        onPress={this._onPress}
        disabled={!onPress}
        title={this.text()}
        widget="delete"
        settingsStyle
        noBorder
      />
    );
  }
}
