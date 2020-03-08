import React from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import NavButton from './NavButton';
import { SearchSelectProps } from '../cardlist/SearchMultiSelectView';
import { COLORS } from 'styles/colors';

interface Props {
  componentId: string;
  fontScale: number;
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
          placeholder: t`Search ${title}`,
          values,
          onChange,
          selection,
        },
        options: {
          topBar: {
            title: {
              text: t`Select ${title}`,
              color: COLORS.navButton,
            },
            backButton: {
              title: t`Back`,
              color: COLORS.navButton,
            },
            rightButtons: selection && selection.length > 0 ?
              [{
                text: t`Clear`,
                id: 'clear',
                color: COLORS.navButton,
                testID: t`Clear`,
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
      fontScale,
    } = this.props;
    return (
      <NavButton
        fontScale={fontScale}
        text={`${title}: ${selection && selection.length ? selection.join(', ') : t`All`}`}
        onPress={this._onPress}
        indent={indent}
      />
    );
  }
}
