import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import Ripple from '@lib/react-native-material-ripple';
import Card from '@data/Card';
import { m, s, xs, iconSizeScale } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export interface CardSectionHeaderData {
  superTitle?: string;
  superTitleIcon?: string;
  title?: string;
  subTitle?: string;
  subTitleDetail?: string;
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
  if (section.subTitle || section.title) {
    return fontScale * 20 + 8 * 2;
  }
  return fontScale * 24 + s * 2;
}

export default class CardSectionHeader extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  renderSuperTitle(investigator: Card, superTitle: string, noIcon?: boolean) {
    const { fontScale, typography } = this.context;
    const {
      section,
    } = this.props;
    const SMALL_EDIT_ICON_SIZE = 30 * iconSizeScale * fontScale;
    return (
      <>
        <View style={styles.superHeaderPadding}>
          <Text style={[typography.large, styles.superHeaderText]}>
            { superTitle }
          </Text>
        </View>
        { !noIcon && (
          <View style={[
            { width: SMALL_EDIT_ICON_SIZE, height: SMALL_EDIT_ICON_SIZE },
            section.superTitleIcon ? { marginRight: xs } : {},
          ]}>
            <MaterialIcons
              name={section.superTitleIcon || 'keyboard-arrow-right'}
              color="#FFF"
              size={SMALL_EDIT_ICON_SIZE}
            />
          </View>
        ) }
      </>
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
        <View style={[styles.placeholder, backgroundStyle, { height: cardSectionHeaderHeight(section, fontScale) }]} />
      );
    }
    if (section.superTitle) {
      if (!investigator) {
        return null;
      }
      if (section.onPress) {
        return (
          <Ripple
            onPress={section.onPress}
            style={[
              styles.superHeaderRow,
              borderStyle,
              {
                height: cardSectionHeaderHeight(section, fontScale),
                backgroundColor: colors.faction[investigator.factionCode()].darkBackground,
              },
            ]}
            rippleColor={colors.faction[investigator.factionCode()].text}
          >
            { this.renderSuperTitle(investigator, section.superTitle) }
          </Ripple>
        );
      }
      return (
        <View style={[
          styles.superHeaderRow,
          borderStyle,
          {
            height: cardSectionHeaderHeight(section, fontScale),
            backgroundColor: colors.faction[investigator.factionCode()].darkBackground,
          },
        ]}>
          { this.renderSuperTitle(investigator, section.superTitle, true) }
        </View>
      );
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
          { !!section.subTitleDetail && (
            <Text style={[typography.subHeaderText, styles.subHeaderText]}>
              { section.subTitleDetail }
            </Text>
          )}
        </View>
      );
    }

    if (section.title) {
      return (
        <View style={[
          styles.subHeaderRow,
          borderStyle,
          {
            backgroundColor: colors.L20,
            height: cardSectionHeaderHeight(section, fontScale),
          },
        ]}>
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
    textAlignVertical: 'center',
  },
  placeholder: {
    height: m,
  },
  superHeaderPadding: {
    padding: s,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  subHeaderText: {
    marginTop: 2,
  },
});
