import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { CampaignCycleCode } from '../../../actions/types';
import EncounterIcon from '../../../assets/EncounterIcon';

interface Props {
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
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress} key={packCode}>
        <View style={styles.campaignRow}>
          <View style={styles.campaignIcon}>
            <EncounterIcon encounter_code={packCode} size={18} color="#000000" />
          </View>
          <Text style={styles.campaignText}>
            { text }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  campaignRow: {
    height: 40,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  campaignText: {
    fontFamily: 'System',
    fontSize: 18,
    marginLeft: 8,
  },
  campaignIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
