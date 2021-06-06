import React, { useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Ripple from '@lib/react-native-material-ripple';
import Card from '@data/types/Card';
import { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

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

export default function CardSectionHeader({ investigator, section }: Props) {
  const { colors, borderStyle, backgroundStyle, fontScale, typography } = useContext(StyleContext);

  const renderSuperTitle = useCallback((superTitle: string, noIcon?: boolean) => {
    const SMALL_EDIT_ICON_SIZE = 30 * fontScale;
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
  }, [fontScale, typography, section]);
  const height = cardSectionHeaderHeight(section, fontScale);
  if (section.placeholder) {
    return (
      <View style={[styles.placeholder, backgroundStyle, { height }]} />
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
              height,
              backgroundColor: colors.faction[investigator.factionCode()].background,
            },
          ]}
          rippleColor={colors.faction[investigator.factionCode()].text}
        >
          { renderSuperTitle(section.superTitle) }
        </Ripple>
      );
    }
    return (
      <View style={[
        styles.superHeaderRow,
        borderStyle,
        {
          height,
          backgroundColor: colors.faction[investigator.factionCode()].background,
        },
      ]}>
        { renderSuperTitle(section.superTitle, true) }
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
          height,
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
          height,
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
