import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';
import { ChaosBag } from '../../../constants';
import NavButton from '../../core/NavButton';
import ChaosBagLine from '../../core/ChaosBagLine';
import typography from '../../../styles/typography';

interface Props {
  fontScale: number;
  chaosBag: ChaosBag;
  showChaosBag: () => void;
}

export default function ChaosBagSection(props: Props) {
  const {
    fontScale,
    showChaosBag,
    chaosBag,
  } = props;
  return (
    <NavButton
      fontScale={fontScale}
      onPress={showChaosBag}
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
  );
}

const styles = StyleSheet.create({
  padding: {
    padding: 8,
  },
  marginTop: {
    marginTop: 8,
  },
});
