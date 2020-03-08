import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { CampaignCycleCode } from 'actions/types';
import EncounterIcon from 'icons/EncounterIcon';
import { s, xs, iconSizeScale } from 'styles/space';
import typography from 'styles/typography';

interface Props {
  fontScale: number;
  packCode: CampaignCycleCode;
  text: string;
  onPress: (packCode: CampaignCycleCode, text: string) => void;
}

export default class CycleItem extends React.Component<Props> {
  _onPress = () => {
    this.props.onPress(this.props.packCode, this.props.text);
  };

  render() {
    const {
      packCode,
      text,
      fontScale,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress} key={packCode}>
        <View style={styles.campaignRow}>
          <View style={styles.campaignIcon}>
            <EncounterIcon
              encounter_code={packCode}
              size={18 * iconSizeScale * fontScale}
              color="#000000"
            />
          </View>
          <Text style={[typography.text, styles.campaignText]}>
            { text }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  campaignRow: {
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  campaignText: {
    marginLeft: s,
  },
  campaignIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s,
  },
});
