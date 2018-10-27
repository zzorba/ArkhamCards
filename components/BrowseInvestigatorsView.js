import React from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import L from '../app/i18n';
import InvestigatorsListComponent from './InvestigatorsListComponent';

export default class BrowseInvestigatorsView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('Investigators'),
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress(investigator) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'Card',
        passProps: {
          id: investigator.code,
          pack_code: investigator.pack_code,
        },
      },
    });
  }

  render() {
    const {
      componentId,
    } = this.props;
    return (
      <InvestigatorsListComponent componentId={componentId} onPress={this._onPress} />
    );
  }
}
