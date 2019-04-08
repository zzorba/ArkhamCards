import React from 'react';

import ChooserButton from '../core/ChooserButton';

interface Props {
  componentId: string;
  title: string;
  values: string[];
  selection?: string[];
  setting: string;
  onFilterChange: (setting: string, selection: string[]) => void;
  indent?: boolean;
}

export default class FilterChooserButton extends React.Component<Props> {
  _onChange = (values: string[]) => {
    const {
      onFilterChange,
      setting,
    } = this.props;
    onFilterChange(setting, values);
  }

  render() {
    const {
      componentId,
      title,
      values,
      selection,
      indent,
    } = this.props;
    return (
      <ChooserButton
        componentId={componentId}
        title={title}
        values={values}
        selection={selection}
        onChange={this._onChange}
        indent={indent}
      />
    );
  }
}
