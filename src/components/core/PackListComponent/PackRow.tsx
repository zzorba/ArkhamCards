import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Pack } from 'actions/types';
import EncounterIcon from 'icons/EncounterIcon';
import Switch from 'components/core/Switch';
import { PackCardsProps } from 'components/settings/PackCardsView';

interface Props {
  componentId: string;
  pack: Pack;
  cycle: Pack[];
  setChecked?: (pack_code: string, checked: boolean) => void;
  setCycleChecked?: (cycle_position: number, checked: boolean) => void;
  checked?: boolean;
  whiteBackground?: boolean;
  baseQuery?: string;
  compact?: boolean;
  nameOverride?: string;
}

export default class PackRow extends React.Component<Props> {
  _onPress = () => {
    const {
      pack,
      componentId,
      baseQuery,
    } = this.props;
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
  };

  _onCheckPress = () => {
    const {
      pack,
      cycle,
      checked,
      setCycleChecked,
      setChecked,
    } = this.props;
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
              setCycleChecked(pack.cycle_position, value);
            },
          },
        ],
      );
    }
  };

  render() {
    const {
      pack,
      checked,
      setChecked,
      whiteBackground,
      compact,
      nameOverride,
    } = this.props;

    const mythosPack = (pack.position > 1 && pack.cycle_position < 70);
    const backgroundColor = (whiteBackground || mythosPack) ? '#FFFFFF' : '#f0f0f0';
    const textColor = '#222222';
    const iconSize = (mythosPack || compact) ? 24 : 28;
    const fontSize = (mythosPack || compact) ? 16 : 22;
    const rowHeight = mythosPack ? 50 : 60;
    return (
      <View style={[styles.row,
        { backgroundColor, height: rowHeight },
        compact ? { height: 40 } : styles.bottomBorder,
      ]}>
        <TouchableOpacity style={styles.touchable} onPress={this._onPress}>
          <View style={styles.touchableContent}>
            <View style={styles.icon}>
              <EncounterIcon
                encounter_code={pack.code}
                size={iconSize}
                color="#000000"
              />
            </View>
            <Text
              style={[styles.title, { color: textColor, fontSize }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              { nameOverride || pack.name }
            </Text>
          </View>
        </TouchableOpacity>
        { !!setChecked && (
          <View style={[styles.checkbox, { height: rowHeight }]}>
            <Switch
              value={checked}
              onValueChange={this._onCheckPress}
            />
          </View>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomBorder: {
    borderBottomWidth: 1,

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
    marginLeft: 8,
    width: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontFamily: 'System',
    flex: 1,
  },
  checkbox: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
