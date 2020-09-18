import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { msgid, ngettext } from 'ttag';

import Card from '@data/Card';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { Supply } from '@data/scenario/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  investigator: Card;
  supply: Supply;
  count: number;
  remainingPoints: number;
  inc: (code: string, id: string) => void;
  dec: (code: string, id: string) => void;
  editable: boolean;
}

export default function SupplyComponent({
  investigator,
  supply,
  count,
  remainingPoints,
  editable,
  inc,
  dec,
}: Props) {
  const { typography, colors, borderStyle } = useContext(StyleContext);
  const _inc = () => {
    inc(investigator.code, supply.id);
  };

  const _dec = () => {
    dec(investigator.code, supply.id);
  };

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
      borderStyle,
      { backgroundColor: colors.faction[investigator.factionCode()].lightBackground },
    ]}>
      <View style={[styles.textBlock, space.paddingS, space.paddingSideM]}>
        <Text style={typography.text}>
          <Text style={[typography.bold, typography.black]}>
            { supply.name }
          </Text>
          { ' ' }
          { editable && <Text style={[styles.cost, typography.black]}>{ costString }</Text> }
        </Text>
        <Text
          numberOfLines={2}
          style={[typography.small, typography.italic, typography.black]}
        >
          { supply.description }
        </Text>
      </View>
      <View style={[styles.buttons, space.paddingS]}>
        { editable ? (
          <PlusMinusButtons
            count={count}
            onIncrement={_inc}
            onDecrement={_dec}
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
});
