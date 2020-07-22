import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { BulletType } from '@data/scenario/types';
import typography from '@styles/typography';
import { m, s, xs } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  code: string;
  name: string;
  description?: string;
  color?: string;
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
    const { color } = this.props;
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center, color ? typography.white : {}]}>
          { this.props.value }
        </Text>
      </View>
    );
  }

  render() {
    const {
      name,
      description,
      limit,
      color,
      value,
      editable,
    } = this.props;
    return (
      <View style={[
        styles.promptRow,
        color ? { backgroundColor: color } : {},
      ]}>
        <View style={styles.column}>
          <Text style={[typography.mediumGameFont, color ? typography.white : {}]}>
            { name }
          </Text>
          { editable && !!description && (
            <Text style={[typography.text, color ? typography.white : {}]}>
              { description }
            </Text>
          ) }
        </View>
        { editable ? (
          <PlusMinusButtons
            count={value}
            max={limit}
            onIncrement={this._inc}
            onDecrement={this._dec}
            countRender={this.renderCount()}
            color="light"
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
    paddingLeft: xs,
    paddingRight: xs,
    minWidth: 40,
  },
  promptRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    padding: m,
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
});
