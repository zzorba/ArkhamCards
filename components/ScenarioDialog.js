import React from 'react';
import PropTypes from 'prop-types';

import L from '../app/i18n';
import DialogPicker from './core/DialogPicker';

export default class ScenarioDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    scenarioChanged: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired,
    scenarios: PropTypes.array.isRequired,
  };

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
