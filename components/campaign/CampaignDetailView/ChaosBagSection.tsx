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
import { EditChaosBagProps } from '../EditChaosBagDialog';

const DRAW_CHAOS_TOKENS_ENABLED = true;

interface Props {
  componentId: string;
  campaignId: number;
  chaosBag: ChaosBag;
  updateChaosBag: (chaosBag: ChaosBag) => void;
}

export default class ChaosBagSection extends React.Component<Props> {
  _showChaosBag = () => {
    const {
      componentId,
      campaignId,
      chaosBag,
      updateChaosBag,
    } = this.props;
    if (DRAW_CHAOS_TOKENS_ENABLED) {
      Navigation.push<CampaignChaosBagProps>(componentId, {
        component: {
          name: 'Campaign.ChaosBag',
          passProps: {
            componentId,
            campaignId,
            updateChaosBag: updateChaosBag,
            trackDeltas: true,
          },
          options: {
            topBar: {
              title: {
                text: t`Chaos Bag`,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    } else {
      Navigation.push<EditChaosBagProps>(componentId, {
        component: {
          name: 'Dialog.EditChaosBag',
          passProps: {
            chaosBag,
            updateChaosBag: updateChaosBag,
            trackDeltas: true,
          },
        },
      });
    }
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
