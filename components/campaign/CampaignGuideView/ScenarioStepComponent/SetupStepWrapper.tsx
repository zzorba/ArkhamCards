import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from '../../../../assets/ArkhamIcon';

interface Props {
  children: React.ReactNode[];
}

export default function SetupStepWrapper({ children }: Props) {
  return (
    <View style={styles.step}>
      <View style={styles.bullet}>
        <ArkhamIcon name="guide_bullet" size={24} color="#2E5344" />
      </View>
      <View style={styles.mainText}>
        { children }
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 16,
  },
  bullet: {
    marginRight: 8,
  },
  mainText: {
    flex: 1,
  },
})
