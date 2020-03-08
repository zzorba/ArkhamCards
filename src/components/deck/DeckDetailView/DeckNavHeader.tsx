import React from 'react';
import {
  Platform,
  View,
  ViewStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';

import AppIcon from 'icons/AppIcon';
import { COLORS } from 'styles/colors';

interface Props {
  componentId: string;
  hasEdits?: boolean;
  saving?: boolean;
  clearEdits: () => void;
  saveEdits: () => void;
}
export default class DeckNavHeader extends React.Component<Props> {
  _backPressed = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    const {
      saving,
    } = this.props;
    return (
      <View style={styles.container}>
        { this.props.hasEdits ?
          <View style={styles.row}>
            <Button
              loading={saving}
              loadingStyle={{ width: 88 }}
              loadingProps={{ size: 'small', color: COLORS.green }}
              icon={<AppIcon name="check_circle" size={18} color={COLORS.green} />}
              iconContainerStyle={styles.icon}
              titleStyle={[styles.text, styles.saveText]}
              buttonStyle={[styles.button, styles.saveEditsButton]}
              onPress={this.props.saveEdits}
              title="Save"
            />
            { !saving &&
              <Button
                icon={<AppIcon name="cancel" size={18} color={COLORS.red} />}
                iconContainerStyle={styles.icon}
                titleStyle={[styles.text, styles.cancelText]}
                buttonStyle={[styles.button, styles.cancelEditsButton]}
                onPress={this.props.clearEdits}
                title="Discard Changes"
              />
            }
          </View>
          :
          <TouchableOpacity onPress={this._backPressed}>
            <View style={styles.row}>
              <View style={styles.backArrow}>
                <AppIcon name="arrow_back" size={24} color={COLORS.lightBlue} />
              </View>
              <Text style={styles.backButton}>
                Back
              </Text>
            </View>
          </TouchableOpacity>
        }
      </View>
    );
  }
}
interface Styles {
  container: ViewStyle;
  row: ViewStyle;
  icon: ViewStyle;
  backArrow: ViewStyle;
  backButton: TextStyle;
  cancelText: TextStyle;
  saveText: TextStyle;
  text: TextStyle;
  button: TextStyle;
  cancelEditsButton: TextStyle;
  saveEditsButton: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 8,
  },
  row: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    margin: 0,
  },
  backArrow: {
    width: 18,
  },
  backButton: {
    marginLeft: 4,
    color: COLORS.lightBlue,
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '700',
  },
  cancelText: {
    color: COLORS.red,
  },
  saveText: {
    color: COLORS.green,
  },
  text: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '700',
  },
  button: {
    marginLeft: 8,
    height: 32,
    borderRadius: 4,
  },
  cancelEditsButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.red,
    borderWidth: 1,
  },
  saveEditsButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.green,
    borderWidth: 1,
  },
});
