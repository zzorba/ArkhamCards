import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';
import { ChaosBag } from 'constants';
import NavButton from 'components/core/NavButton';
import ChaosBagLine from 'components/core/ChaosBagLine';
import typography from 'styles/typography';

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
        <View style={styles.padding}>
          <Text style={typography.text}>
            { t`Chaos Bag` }
          </Text>
          <View style={styles.marginTop}>
            <ChaosBagLine
              fontScale={fontScale}
              chaosBag={chaosBag}
            />
          </View>
        </View>
      </NavButton>
      <View style={[styles.button, styles.bottomBorder]}>
        <Button
          title={t`Odds Calculator`}
          onPress={showOddsCalculator}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  padding: {
    padding: 8,
  },
  marginTop: {
    marginTop: 8,
  },
  button: {
    padding: 8,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
