import React from 'react';
import PropTypes from 'prop-types';

import NavButton from './NavButton';

export default class ChooserButton extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selection: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      navigator,
      title,
      values,
      onChange,
      selection,
    } = this.props;
    navigator.push({
      screen: 'SearchFilters.Chooser',
      title: `Select ${title}`,
      passProps: {
        placeholder: `Search ${title}`,
        values,
        onChange,
        selection,
      },
    });
  }

  render() {
    const {
      title,
      selection,
    } = this.props;
    return (
      <NavButton
        text={`${title}: ${selection.length ? selection.join(', ') : 'All'}`}
        onPress={this._onPress}
      />
    );
  }
}
