import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import Button from '../../core/Button';
import typography from '../../../styles/typography';

export default class CampaignNoteSectionRow extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    isCount: PropTypes.bool,
    perInvestigator: PropTypes.bool,
    onPress: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      name,
      isCount,
      perInvestigator,
      onPress,
    } = this.props;
    onPress(name, isCount, perInvestigator);
  }

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
              <MaterialIcons name="close" size={14} color="#FFFFFF" />
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
