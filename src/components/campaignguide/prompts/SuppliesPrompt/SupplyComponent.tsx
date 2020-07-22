import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { msgid, ngettext } from 'ttag';

import Card from '@data/Card';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { Supply } from '@data/scenario/types';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  investigator: Card;
  supply: Supply;
  count: number;
  remainingPoints: number;
  inc: (code: string, id: string) => void;
  dec: (code: string, id: string) => void;
  editable: boolean;
}

export default class SupplyComponent extends React.Component<Props> {
  _inc = () => {
    const {
      investigator,
      supply,
      inc,
    } = this.props;
    inc(investigator.code, supply.id);
  };

  _dec = () => {
    const {
      investigator,
      supply,
      dec,
    } = this.props;
    dec(investigator.code, supply.id);
  };

  render() {
    const {
      investigator,
      supply,
      count,
      remainingPoints,
      editable,
    } = this.props;
    const costString = supply.multiple ?
      ngettext(msgid`(${supply.cost} supply point each)`,
        `(${supply.cost} supply points each)`,
        supply.cost) :
      ngettext(msgid`(${supply.cost} supply point)`,
        `(${supply.cost} supply points)`,
        supply.cost);
    return (
      <View style={[
        styles.row,
        { backgroundColor: COLORS.faction[investigator.factionCode()].lightBackground },
      ]}>
        <View style={[styles.textBlock, space.paddingS, space.paddingSideM]}>
          <Text style={typography.text}>
            <Text style={[typography.bold, styles.blackText]}>
              { supply.name }
            </Text>
            { ' ' }
            { editable && <Text style={[styles.cost, styles.blackText]}>{ costString }</Text> }
          </Text>
          <Text
            numberOfLines={2}
            style={[typography.small, typography.italic, styles.blackText]}
          >
            { supply.description }
          </Text>
        </View>
        <View style={[styles.buttons, space.paddingS]}>
          { editable ? (
            <PlusMinusButtons
              count={count}
              onIncrement={this._inc}
              onDecrement={this._dec}
              max={supply.multiple ? undefined : 1}
              countRender={(
                <Text style={[styles.count, typography.text, typography.bold, typography.center]}>
                  { count }
                </Text>
              )}
              disablePlus={remainingPoints < supply.cost}
              hideDisabledMinus
              color="dark"
            />
          ) : (
            <Text style={[styles.count, typography.text, typography.bold, typography.center]}>
              +{ count }
            </Text>
          ) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  buttons: {
    justifyContent: 'center',
  },
  count: {
    minWidth: 24,
  },
  cost: {
    fontWeight: '300',
  },
  blackText: {
    color: COLORS.darkText,
  },
});
