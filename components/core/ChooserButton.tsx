import React from 'react';
import { Navigation } from 'react-native-navigation';
import L from '../../app/i18n';
import NavButton from './NavButton';
import { SearchSelectProps } from '../SearchMultiSelectView';
import { COLORS } from '../../styles/colors';

interface Props {
  componentId: string;
  title: string;
  values: string[];
  onChange: (selection: string[]) => void;
  selection?: string[];
  indent?: boolean;
}
export default class ChooserButton extends React.Component<Props> {
  _onPress = () => {
    const {
      componentId,
      title,
      values,
      onChange,
      selection,
    } = this.props;
    Navigation.push<SearchSelectProps>(componentId, {
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
              color: COLORS.navButton,
            },
            backButton: {
              title: L('Back'),
              color: COLORS.navButton,
            },
            rightButtons: selection && selection.length > 0 ?
              [{
                text: L('Clear'),
                id: 'clear',
                color: COLORS.navButton,
              }] : [],
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
        text={`${title}: ${selection && selection.length ? selection.join(', ') : L('All')}`}
        onPress={this._onPress}
        indent={indent}
      />
    );
  }
}
