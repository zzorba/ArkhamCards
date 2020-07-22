import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { ChaosBag } from '@app_constants';
import NavButton from '@components/core/NavButton';
import ChaosBagLine from '@components/core/ChaosBagLine';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  fontScale: number;
  chaosBag: ChaosBag;
  showChaosBag: () => void;
  showOddsCalculator: () => void;
}

export default function ChaosBagSection(props: Props) {
  const {
    fontScale,
    showChaosBag,
    chaosBag,
    showOddsCalculator,
  } = props;
  return (
    <>
      <NavButton
        fontScale={fontScale}
        onPress={showChaosBag}
        noBorder
      >
        <View style={space.paddingS}>
          <Text style={typography.text}>
            { t`Chaos Bag` }
          </Text>
          <View style={space.marginTopS}>
            <ChaosBagLine
              fontScale={fontScale}
              chaosBag={chaosBag}
            />
          </View>
        </View>
      </NavButton>
      <View style={styles.bottomBorder}>
        <BasicButton
          title={t`Odds Calculator`}
          onPress={showOddsCalculator}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
