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
import { CampaignChaosBagProps } from '../CampaignChaosBagView';
import { ChaosBagResults } from '../../../actions/types';

interface Props {
  componentId: string;
  chaosBag: ChaosBag;
  updateChaosBag: (chaosBag: ChaosBag) => void;
  chaosBagResults: ChaosBagResults;
}

export default class ChaosBagSection extends React.Component<Props> {
  _showChaosBag = () => {
    const {
      componentId,
      updateChaosBag,
      chaosBag,
      chaosBagResults,
    } = this.props;
    Navigation.push<CampaignChaosBagProps>(componentId, {
      component: {
        name: 'Campaign.ChaosBag',
        passProps: {
          chaosBag,
          chaosBagResults,
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
  }

  render() {
    return (
      <NavButton onPress={this._showChaosBag}>
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
