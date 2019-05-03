import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { t } from 'ttag';
import EditCountComponent from './EditCountComponent';

interface Props {
  xp: number;
  onChange: (xp: number) => void;
  isInvestigator?: boolean;
}

export default class XpComponent extends React.Component<Props> {
  _countChanged = (index: number, count: number) => {
    this.props.onChange(count);
  };

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
          title={t`Experience`}
          count={xp || 0}
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
