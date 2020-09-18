import React, { useContext } from 'react';
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
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  chaosBag: ChaosBag;
  showChaosBag: () => void;
  showOddsCalculator: () => void;
}

export default function ChaosBagSection({
  showChaosBag,
  chaosBag,
  showOddsCalculator,
}: Props) {
  const { borderStyle, typography } = useContext(StyleContext);
  return (
    <>
      <NavButton
        onPress={showChaosBag}
        noBorder
      >
        <View style={space.paddingS}>
          <Text style={typography.text}>
            { t`Chaos Bag` }
          </Text>
          <View style={space.marginTopS}>
            <ChaosBagLine
              chaosBag={chaosBag}
            />
          </View>
        </View>
      </NavButton>
      <View style={[styles.bottomBorder, borderStyle]}>
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
  },
});
