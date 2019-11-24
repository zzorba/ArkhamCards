import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { FACTION_DARK_GRADIENTS } from '../../constants';
import Card from '../../data/Card';
import typography from '../../styles/typography';
import { m, s, xs, iconSizeScale } from '../../styles/space';

export interface CardSectionHeaderData {
  superTitle?: string;
  title?: string;
  subTitle?: string;
  placeholder?: boolean;
  onPress?: () => void;
}

interface Props {
  investigator: Card;
  fontScale: number;
  section: CardSectionHeaderData;
}

export default class CardSectionHeader extends React.Component<Props> {
  render() {
    const {
      investigator,
      section,
      fontScale,
    } = this.props;
    if (section.placeholder) {
      return (
        <View style={styles.placeholder} />
      );
    }
    if (section.superTitle) {
      const SMALL_EDIT_ICON_SIZE = 24 * iconSizeScale * fontScale;
      if (section.onPress) {
        return (
          <TouchableOpacity onPress={section.onPress} style={[
            styles.superHeaderRow,
            { backgroundColor: FACTION_DARK_GRADIENTS[investigator.factionCode()][0] },
          ]}>
            <View style={styles.superHeaderPadding}>
              <Text style={[typography.text, styles.superHeaderText]}>
                { section.superTitle }
              </Text>
            </View>
            <View style={{ width: SMALL_EDIT_ICON_SIZE, height: SMALL_EDIT_ICON_SIZE }}>
              <MaterialIcons
                name="keyboard-arrow-right"
                color="#FFF"
                size={SMALL_EDIT_ICON_SIZE}
              />
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <View style={[
          styles.superHeaderRow,
          styles.superHeaderPadding,
          { backgroundColor: FACTION_DARK_GRADIENTS[investigator.factionCode()][0] },
        ]}>
          <Text style={[typography.text, styles.superHeaderText]}>
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
  placeholder: {
    backgroundColor: '#FFF',
    height: m,
  },
  superHeaderPadding: {
    padding: s,
  },
  superHeaderRow: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
