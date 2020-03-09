import React from 'react';
import { t } from 'ttag';

import DialogPicker from 'components/core/DialogPicker';

interface Props {
  componentId: string;
  scenarioChanged: (scenario: string) => void;
  selected: string;
  scenarios: string[];
}

export default class ScenarioDialog extends React.Component<Props> {
  render() {
    const {
      componentId,
      scenarioChanged,
      selected,
      scenarios,
    } = this.props;

    return (
      <DialogPicker
        componentId={componentId}
        header={t`Scenario`}
        options={scenarios}
        onSelectionChanged={scenarioChanged}
        selectedOption={selected}
        noCapitalize
      />
    );
  }
}
