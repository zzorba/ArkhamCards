import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import withStyles, { StylesProps } from '@components/core/withStyles';
import Switch from '@components/core/Switch';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  code: string;
  name: string;
  color?: string;
  selected: boolean;
  onChoiceToggle: (code: string) => void;
  editable: boolean;
}

class CheckListItemComponent extends React.Component<Props & StylesProps> {
  _toggle = () => {
    const {
      onChoiceToggle,
      code,
    } = this.props;
    onChoiceToggle(code);
  };

  render() {
    const {
      name,
      editable,
      color,
      selected,
      gameFont,
    } = this.props;
    if (!editable && !selected) {
      return null;
    }
    return (
      <View style={[
        styles.row,
        space.paddingS,
        space.paddingSideM,
        color ? { backgroundColor: color } : {},
      ]}>
        <Text style={[
          typography.mediumGameFont,
          { fontFamily: gameFont },
          styles.nameText,
          color ? { color: 'white' } : {},
        ]}>
          { name }
        </Text>
        { editable ? (
          <Switch
            onValueChange={this._toggle}
            customColor="white"
            customTrackColor={color ? '#ccc' : undefined}
            value={selected}
          />
        ) : (
          <MaterialCommunityIcons
            name="check"
            size={18}
            color={color ? 'white' : COLORS.darkText}
          />
        ) }
      </View>
    );
  }
}

export default withStyles(CheckListItemComponent);

const styles = StyleSheet.create({
  nameText: {
    fontWeight: '600',
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
