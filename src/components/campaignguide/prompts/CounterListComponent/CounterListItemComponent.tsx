import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import PlusMinusButtons from 'components/core/PlusMinusButtons';
import { BulletType } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  code: string;
  name: string;
  tintColor?: string;
  bulletType?: BulletType;
  value: number;
  limit?: number;
  onInc: (code: string, limit?: number) => void;
  onDec: (code: string) => void;
  editable: boolean;
}

export default class InvestigatorCountComponent extends React.Component<Props> {
  _inc = () => {
    const {
      onInc,
      code,
      limit,
    } = this.props;
    onInc(code, limit);
  };

  _dec = () => {
    const {
      onDec,
      code,
    } = this.props;
    onDec(code);
  };

  renderCount() {
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center]}>
          { this.props.value }
        </Text>
      </View>
    );
  }

  render() {
    const {
      name,
      limit,
      tintColor,
      value,
      editable,
    } = this.props;
    return (
      <View style={[
        styles.promptRow,
        tintColor ? { backgroundColor: tintColor } : {},
      ]}>
        <Text>{ name }</Text>
        { editable ? (
          <PlusMinusButtons
            count={value}
            limit={limit}
            onIncrement={this._inc}
            onDecrement={this._dec}
            countRender={this.renderCount()}
            color="dark"
          />
        ) : (
          this.renderCount()
        ) }
      </View>
    );

  }
}

const styles = StyleSheet.create({
  count: {
    paddingLeft: 4,
    paddingRight: 4,
    minWidth: 40,
  },
  promptRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
