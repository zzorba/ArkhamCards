import React from 'react';
import { findIndex, map } from 'lodash';
import { SettingsPicker } from 'react-native-settings-components';
import { t } from 'ttag';

import SinglePickerComponent from 'components/core/SinglePickerComponent';
import { FactionCodeType, FACTION_COLORS } from 'constants';
import Card from 'data/Card';
import COLORS from 'styles/colors';

interface Props {
  investigator: Card;
  parallelInvestigators: Card[];
  selection?: Card;
  type: 'alternate_back' | 'alternate_front';
  onChange: (type: 'alternate_back' | 'alternate_front', code?: string) => void;
  disabled?: boolean;
  editWarning: boolean;
}

export default class ParallelInvestigatorPicker extends React.Component<Props> {
  ref?: SettingsPicker<FactionCodeType>;

  _captureRef = (ref: SettingsPicker<FactionCodeType>) => {
    this.ref = ref;
  };

  _onChange = (index: number) => {
    this.ref && this.ref.closeModal();
    const {
      onChange,
      parallelInvestigators,
      type,
    } = this.props;
    onChange(
      type,
      index === 0 ? undefined : parallelInvestigators[index - 1].code
    );
  };

  selectedIndex(): number {
    const {
      selection,
      parallelInvestigators,
    } = this.props;
    if (!selection) {
      return 0;
    }
    // Not found: -1 + 1 = 0
    return 1 + findIndex(parallelInvestigators, card => card.code === selection.code);
  }

  render() {
    const {
      investigator,
      parallelInvestigators,
      type,
      disabled,
      editWarning,
    } = this.props;
    const investigatorFaction = investigator.factionCode();
    return (
      <SinglePickerComponent
        settingsStyle
        title={type === 'alternate_front' ? t`Card Front` : t`Card Back`}
        editable={!disabled}
        description={editWarning ? t`Parallel investigator options should only be selected at deck creation time, not between scenarios.` : undefined}
        colors={{
          modalColor: investigatorFaction ?
            FACTION_COLORS[investigatorFaction] :
            COLORS.lightBlue,
          modalTextColor: 'white',
          backgroundColor: 'transparent',
          textColor: COLORS.darkTextColor,
        }}
        choices={[
          { text: t`Original` },
          ...map(parallelInvestigators, (card) => {
            return { text: card.pack_name };
          }),
        ]}
        selectedIndex={this.selectedIndex()}
        onChoiceChange={this._onChange}
        noBorder
      />
    );
  }
}
