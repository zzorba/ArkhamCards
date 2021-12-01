import React, { useCallback, useContext } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import { Pack } from '@actions/types';
import EncounterIcon from '@icons/EncounterIcon';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { PackCardsProps } from '@components/settings/PackCardsView';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  pack: Pack;
  cycle: Pack[];
  setChecked?: (pack_code: string, checked: boolean) => void;
  setCycleChecked?: (cycle_code: string, checked: boolean) => void;
  checked?: boolean;
  baseQuery?: Brackets;
  compact?: boolean;
  nameOverride?: string;
}

export default function PackRow({ componentId, pack, cycle, setChecked, setCycleChecked, checked, baseQuery, compact, nameOverride }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const onPress = useCallback(() => {
    Navigation.push<PackCardsProps>(componentId, {
      component: {
        name: 'Pack',
        passProps: {
          pack_code: pack.code,
          baseQuery,
        },
        options: {
          topBar: {
            title: {
              text: pack.name,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [pack, componentId, baseQuery]);

  const onCheckPress = useCallback(() => {
    const value = !checked;
    setChecked && setChecked(pack.code, value);

    if (setCycleChecked &&
      pack.position === 1 &&
      pack.cycle_position < 50 &&
      pack.cycle_position > 1 &&
      cycle.length > 0
    ) {
      // This is the lead pack in a cycle.
      Alert.alert(
        value ? t`Mark entire cycle?` : t`Clear entire cycle?`,
        value ?
          t`Mark all packs in the ${pack.name} cycle?` :
          t`Clear all packs in the ${pack.name} cycle?`,
        [
          {
            text: t`No`,
          },
          { text: t`Yes`,
            onPress: () => {
              setCycleChecked(pack.code, value);
            },
          },
        ],
      );
    }
  }, [pack, cycle, checked, setCycleChecked, setChecked]);

  const backgroundColor = colors.background;
  const iconSize = 24;
  const fontSize = 16 * fontScale;
  const lineHeight = 20 * fontScale;
  const rowHeight = compact ? lineHeight * fontScale + 20 : 50;
  return (
    <View style={[styles.row,
      { backgroundColor, height: rowHeight },
      !compact ? {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.divider,
      } : undefined,
    ]}>
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <View style={styles.touchableContent}>
          <View style={styles.icon}>
            <EncounterIcon
              encounter_code={pack.code}
              size={iconSize}
              color={colors.darkText}
            />
          </View>
          <Text
            style={[typography.large, { color: colors.darkText, fontSize, lineHeight, flex: 1 }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            { nameOverride || pack.name }
          </Text>
        </View>
      </TouchableOpacity>
      { !!setChecked && (
        <View style={[styles.checkbox, { height: rowHeight }]}>
          <ArkhamSwitch
            value={!!checked}
            onValueChange={onCheckPress}
          />
        </View>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  touchable: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  touchableContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginLeft: s,
    width: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    marginRight: s,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
