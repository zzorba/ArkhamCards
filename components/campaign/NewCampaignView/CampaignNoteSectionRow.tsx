import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import DeviceInfo from 'react-native-device-info';

import Button from '../../core/Button';
import typography from '../../../styles/typography';

interface Props {
  name: string;
  isCount?: boolean;
  perInvestigator?: boolean;
  onPress?: (name: string, isCount?: boolean, perInvestigator?: boolean) => void;
}
export default class CampaignNoteSectionRow extends React.Component<Props> {
  _onPress = () => {
    const {
      name,
      isCount,
      perInvestigator,
      onPress,
    } = this.props;
    onPress && onPress(name, isCount, perInvestigator);
  };

  text() {
    const {
      name,
      isCount,
      perInvestigator,
    } = this.props;

    let result = name;
    if (perInvestigator) {
      result += ' (Per Investigator)';
    }
    if (isCount) {
      result += ': 0';
    }
    return result;
  }

  render() {
    const {
      onPress,
    } = this.props;
    if (onPress) {
      return (
        <View style={styles.row}>
          <Button
            style={styles.button}
            color="red"
            size="small"
            onPress={this._onPress}
            icon={
              <MaterialIcons name="close" size={14 * DeviceInfo.getFontScale()} color="#FFFFFF" />
            }
          />
          <Text style={typography.text}>
            { this.text() }
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <Text style={typography.text}>
          { this.text() }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  button: {
    marginRight: 4,
  },
});
