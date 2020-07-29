import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import Card from '@data/Card';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
import { m, s, xs, iconSizeScale } from '@styles/space';

export interface CardSectionHeaderData {
  superTitle?: string;
  superTitleIcon?: string;
  title?: string;
  subTitle?: string;
  placeholder?: boolean;
  onPress?: () => void;
}

interface Props {
  investigator?: Card;
  fontScale: number;
  section: CardSectionHeaderData;
}

export function cardSectionHeaderHeight(section: CardSectionHeaderData, fontScale: number) {
  if (section.placeholder) {
    return m;
  }
  return fontScale * 22 + (section.superTitle ? s : xs) * 2;
}

export default class CardSectionHeader extends React.Component<Props> {
  renderSuperTitle(investigator: Card, superTitle: string, noIcon?: boolean) {
    const {
      fontScale,
      section: {
        superTitleIcon,
      },
    } = this.props;
    const SMALL_EDIT_ICON_SIZE = 30 * iconSizeScale * fontScale;
    return (
      <View style={[
        styles.superHeaderRow,
        { backgroundColor: COLORS.faction[investigator.factionCode()].darkBackground },
      ]}>
        <View style={styles.superHeaderPadding}>
          <Text style={[typography.text, styles.superHeaderText]}>
            { superTitle }
          </Text>
        </View>
        { !noIcon && (
          <View style={[
            { width: SMALL_EDIT_ICON_SIZE, height: SMALL_EDIT_ICON_SIZE },
            superTitleIcon ? { marginRight: xs } : {},
          ]}>
            <MaterialIcons
              name={superTitleIcon || 'keyboard-arrow-right'}
              color="#FFF"
              size={SMALL_EDIT_ICON_SIZE}
            />
          </View>
        ) }
      </View>
    );
  }

  render() {
    const {
      investigator,
      section,
    } = this.props;
    if (section.placeholder) {
      return (
        <View style={styles.placeholder} />
      );
    }
    if (section.superTitle) {
      if (!investigator) {
        return null;
      }
      if (section.onPress) {
        if (Platform.OS === 'ios' || !TouchableNativeFeedback.canUseNativeForeground()) {
          return (
            <TouchableOpacity onPress={section.onPress}>
              { this.renderSuperTitle(investigator, section.superTitle) }
            </TouchableOpacity>
          );
        }
        return (
          <TouchableNativeFeedback
            onPress={section.onPress}
            useForeground
          >
            { this.renderSuperTitle(investigator, section.superTitle) }
          </TouchableNativeFeedback>
        );
      }
      return this.renderSuperTitle(investigator, section.superTitle, true);
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
    color: '#FFFFFF',
    fontWeight: '500',
  },
  placeholder: {
    backgroundColor: COLORS.background,
    height: m,
  },
  superHeaderPadding: {
    padding: s,
  },
  superHeaderRow: {
    borderBottomWidth: 1,
    paddingLeft: s,
    paddingRight: xs,
    borderColor: COLORS.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subHeaderRow: {
    backgroundColor: COLORS.veryLightBackground,
    paddingLeft: m,
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  headerRow: {
    backgroundColor: COLORS.lightBackground,
    paddingLeft: m,
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
