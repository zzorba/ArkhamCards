import React from 'react';
import { keys, map, range, sortBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '@app_constants';
import space, { iconSizeScale } from '@styles/space';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props {
  chaosBag: ChaosBag;
}

export default function ChaosBagLine({ chaosBag }: Props) {
  const bagKeys = sortBy(
    keys(chaosBag),
    (token: ChaosTokenType) => CHAOS_TOKEN_ORDER[token]);
  return (
    <StyleContext.Consumer>
      { ({ fontScale }) => (
        <View style={[styles.row, space.marginBottomXs]}>
          { map(bagKeys, (token: ChaosTokenType, tokenIdx: number) => (
            map(range(0, chaosBag[token] || 0), idx => {
              const isLast = (idx === ((chaosBag[token] || 0) - 1)) &&
                (tokenIdx === (bagKeys.length - 1));
              return (
                <View key={`${token}-${idx}`} style={styles.commaView}>
                  <ChaosTokenIcon
                    icon={token}
                    size={24 * iconSizeScale * fontScale}
                    color={COLORS.darkText}
                  />
                  { !isLast && <Text style={typography.header}>, </Text> }
                </View>
              );
            })
          )) }
        </View>
      ) }
    </StyleContext.Consumer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  commaView: {
    flexDirection: 'row',
  },
});
