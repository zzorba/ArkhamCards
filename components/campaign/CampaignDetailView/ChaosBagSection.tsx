import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { ChaosBag } from '../../../constants';
import NavButton from '../../core/NavButton';
import ChaosBagLine from '../../core/ChaosBagLine';
import typography from '../../../styles/typography';
import { EditChaosBagProps } from '../EditChaosBagDialog';

interface Props {
  componentId: string;
  chaosBag: ChaosBag;
  updateChaosBag: (chaosBag: ChaosBag) => void;
}
export default class ChaosBagSection extends React.Component<Props> {
  _showChaosBagDialog = () => {
    const {
      componentId,
      updateChaosBag,
      chaosBag,
    } = this.props;
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag: updateChaosBag,
          trackDeltas: true,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    });
  };

  render() {
    return (
      <NavButton onPress={this._showChaosBagDialog}>
        <View style={styles.padding}>
          <Text style={typography.text}>
            { t`Chaos Bag` }
          </Text>
          <View style={styles.marginTop}>
            <ChaosBagLine chaosBag={this.props.chaosBag} />
          </View>
        </View>
      </NavButton>
    );
  }
}

const styles = StyleSheet.create({
  padding: {
    padding: 8,
  },
  marginTop: {
    marginTop: 8,
  },
});
