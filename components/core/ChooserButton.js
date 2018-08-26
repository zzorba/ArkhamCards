import React from 'react';
import PropTypes from 'prop-types';

import L from '../../app/i18n';
import NavButton from './NavButton';

export default class ChooserButton extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selection: PropTypes.array,
    indent: PropTypes.bool,
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
      title: L('Select {{searchType}}', { searchType: title }),
      passProps: {
        placeholder: L('Search {{searchType}}', { searchType: title }),
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
      indent,
    } = this.props;
    return (
      <NavButton
        text={`${title}: ${selection.length ? selection.join(', ') : L('All')}`}
        onPress={this._onPress}
        indent={indent}
      />
    );
  }
}
