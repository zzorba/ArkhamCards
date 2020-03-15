import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';

interface Props {
  noBullet?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export default function SetupStepWrapper({ noBullet, children }: Props) {
  return (
    <View style={styles.step}>
      <View style={styles.bullet}>
        { !noBullet && (
          <ArkhamIcon
            name="guide_bullet"
            size={24}
            color="#2E5344"
          />
        ) }
      </View>
      <View style={styles.mainText}>
        { children }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  bullet: {
    marginRight: 8,
    marginTop: 4,
  },
  mainText: {
    flex: 1,
  },
});
