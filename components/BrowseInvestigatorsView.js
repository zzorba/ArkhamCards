import React from 'react';
import PropTypes from 'prop-types';

import L from '../app/i18n';
import InvestigatorsListComponent from './InvestigatorsListComponent';

export default class BrowseInvestigatorsView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: L('Investigators'),
    });
  }

  onPress(investigator) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: investigator.code,
        pack_code: investigator.pack_code,
      },
    });
  }

  render() {
    const {
      navigator,
    } = this.props;
    return (
      <InvestigatorsListComponent navigator={navigator} onPress={this._onPress} />
    );
  }
}
