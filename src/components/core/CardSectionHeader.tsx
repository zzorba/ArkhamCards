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
import { m, s, xs, iconSizeScale } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
  section: CardSectionHeaderData;
}

export function cardSectionHeaderHeight(section: CardSectionHeaderData, fontScale: number) {
  if (section.placeholder) {
    return m;
  }
  if (section.subTitle) {
    return fontScale * 20 + 6 * 2;
  }
  return fontScale * 22 + (section.superTitle ? s : xs) * 2;
}

export default class CardSectionHeader extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  renderSuperTitle(investigator: Card, superTitle: string, noIcon?: boolean) {
    const { colors, borderStyle, fontScale, typography } = this.context;
    const {
      section: {
        superTitleIcon,
      },
    } = this.props;
    const SMALL_EDIT_ICON_SIZE = 30 * iconSizeScale * fontScale;
    return (
      <View style={[
        styles.superHeaderRow,
        borderStyle,
        {
          backgroundColor: colors.faction[investigator.factionCode()].darkBackground,
        },
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
    const { colors, borderStyle, backgroundStyle, fontScale, typography } = this.context;
    const {
      investigator,
      section,
    } = this.props;
    if (section.placeholder) {
      return (
        <View style={[styles.placeholder, backgroundStyle]} />
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
        <View style={[
          styles.subHeaderRow,
          borderStyle,
          {
            backgroundColor: colors.L10,
            height: cardSectionHeaderHeight(section, fontScale),
          },
        ]}>
          <Text style={[typography.subHeaderText, styles.subHeaderText]}>
            { section.subTitle }
          </Text>
        </View>
      );
    }

    if (section.title) {
      return (
        <View style={[styles.headerRow, borderStyle, {
          backgroundColor: colors.L20,
        }]}>
          <Text style={[typography.subHeaderText, styles.subHeaderText]}>
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
    height: m,
  },
  superHeaderPadding: {
    padding: s,
  },
  superHeaderRow: {
    borderBottomWidth: 1,
    paddingLeft: s,
    paddingRight: xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subHeaderRow: {
    paddingLeft: m,
    paddingRight: s,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  subHeaderText: {
    marginTop: 6,
  },
  headerRow: {
    paddingLeft: m,
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
