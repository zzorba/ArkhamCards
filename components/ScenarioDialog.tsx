import React from 'react';

import L from '../app/i18n';
import DialogPicker from './core/DialogPicker';

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
        header={L('Scenario')}
        options={scenarios}
        onSelectionChanged={scenarioChanged}
        selectedOption={selected}
        noCapitalize
      />
    );
  }
}
