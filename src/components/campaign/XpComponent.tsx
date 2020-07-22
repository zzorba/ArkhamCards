import React from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import EditCountComponent from './EditCountComponent';
import space from '@styles/space';

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
      <View style={isInvestigator ? space.marginRightXs : {}}>
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
