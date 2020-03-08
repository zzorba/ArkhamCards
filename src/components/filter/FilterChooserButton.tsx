import React from 'react';

import ChooserButton from 'components/core/ChooserButton';

interface Props {
  componentId: string;
  fontScale: number;
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
      fontScale,
    } = this.props;
    return (
      <ChooserButton
        componentId={componentId}
        fontScale={fontScale}
        title={title}
        values={values}
        selection={selection}
        onChange={this._onChange}
        indent={indent}
      />
    );
  }
}
