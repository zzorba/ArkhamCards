import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import L from '../../app/i18n';
import EditCountComponent from './EditCountComponent';

export default class XpComponent extends React.Component {
  static propTypes = {
    xp: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    isInvestigator: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._countChanged = this.countChanged.bind(this);
  }

  countChanged(index, count) {
    this.props.onChange(count);
  }

  render() {
    const {
      xp,
      isInvestigator,
    } = this.props;
    return (
      <View style={isInvestigator ? styles.rightMargin : {}}>
        <EditCountComponent
          countChanged={this._countChanged}
          index={0}
          title={L('Experience')}
          count={xp}
          isInvestigator={isInvestigator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rightMargin: {
    marginRight: 4,
  },
});
