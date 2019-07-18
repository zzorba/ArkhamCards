import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { FACTION_DARK_GRADIENTS } from '../../constants';
import Card from '../../data/Card';
import typography from '../../styles/typography';
import { l, s, xs, iconSizeScale } from '../../styles/space';

const SMALL_EDIT_ICON_SIZE = 18 * iconSizeScale * DeviceInfo.getFontScale();

export interface CardSectionHeaderData {
  superTitle?: string;
  title?: string;
  subTitle?: string;
  onPress?: () => void;
}

interface Props {
  investigator: Card;
  section: CardSectionHeaderData;
}

export default class CardSectionHeader extends React.Component<Props> {
  render() {
    const {
      investigator,
      section,
    } = this.props;
    if (section.superTitle) {
      if (section.onPress) {
        return (
          <TouchableOpacity onPress={section.onPress} style={[
            styles.superHeaderRow,
            { backgroundColor: FACTION_DARK_GRADIENTS[investigator.factionCode()][0] },
          ]}>
            <Text style={[typography.text, styles.superHeaderText]}>
              { section.superTitle }
            </Text>
            <View style={styles.editIcon}>
              <MaterialIcons name="edit" color="#FFF" size={SMALL_EDIT_ICON_SIZE} />
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <View style={[
          styles.superHeaderRow,
          { backgroundColor: FACTION_DARK_GRADIENTS[investigator.factionCode()][0] },
        ]}>
          <Text style={[typography.label, styles.superHeaderText]}>
            { section.superTitle }
          </Text>
        </View>
      );
    }
    if (section.subTitle) {
      return (
        <View style={styles.subHeaderRow}>
          <Text style={typography.text}>
            { section.subTitle }
          </Text>
        </View>
      );
    }

    if (section.title) {
      return (
        <View style={styles.headerRow}>
          <Text style={typography.text}>
            { section.title }
          </Text>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  superHeaderText: {
    color: '#FFF',
  },
  superHeaderRow: {
    marginTop: l,
    padding: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subHeaderRow: {
    backgroundColor: '#eee',
    paddingLeft: s,
    paddingRight: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  headerRow: {
    backgroundColor: '#ccc',
    paddingLeft: s,
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  editIcon: {
    width: SMALL_EDIT_ICON_SIZE,
    height: SMALL_EDIT_ICON_SIZE,
  },
});
