import React from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import L from '../../app/i18n';
import NavButton from './NavButton';

export default class ChooserButton extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
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
      componentId,
      title,
      values,
      onChange,
      selection,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'SearchFilters.Chooser',
        passProps: {
          placeholder: L('Search {{searchType}}', { searchType: title }),
          values,
          onChange,
          selection,
        },
        options: {
          topBar: {
            title: {
              text: L('Select {{searchType}}', { searchType: title }),
            },
          },
        },
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
