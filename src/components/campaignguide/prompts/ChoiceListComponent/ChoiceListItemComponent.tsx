import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ChooseOneListComponent from '../ChooseOneListComponent';
import PickerComponent from '../PickerComponent';
import { BulletType, EffectsChoice, SimpleEffectsChoice } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  code: string;
  name: string;
  primaryColor?: string;
  tintColor?: string;
  bulletType?: BulletType;
  choices: (EffectsChoice | SimpleEffectsChoice)[];
  choice?: number;
  optional: boolean;
  onChoiceChange: (code: string, index: number) => void;
  editable: boolean;
  detailed?: boolean;
}

export default class ChoiceListItemComponent extends React.Component<Props> {
  _onChoiceChange = (idx: number) => {
    const {
      onChoiceChange,
      code,
    } = this.props;
    onChoiceChange(code, idx);
  };

  render() {
    const {
      name,
      tintColor,
      primaryColor,
      detailed,
      choices,
      choice,
      editable,
      optional,
    } = this.props;
    if (detailed) {
      return (
        <>
          <View style={[
            styles.headerRow,
            primaryColor ? { backgroundColor: primaryColor } : {},
          ]}>
            <View>
              <Text style={[
                typography.text,
                styles.nameText,
                primaryColor ? { color: '#FFF' } : { color: '#222' },
              ]}>
                { name }
              </Text>
            </View>
            <View />
          </View>
          <ChooseOneListComponent
            choices={choices}
            selectedIndex={choice}
            editable={editable}
            onSelect={this._onChoiceChange}
            tintColor={tintColor}
            buttonColor={primaryColor}
            noBullet
          />
        </>
      );
    }
    return (
      <PickerComponent
        choices={choices}
        selectedIndex={choice === undefined ? -1 : choice}
        editable={editable}
        optional={optional}
        title={name}
        onChoiceChange={this._onChoiceChange}
        colors={primaryColor ? {
          backgroundColor: primaryColor,
          textColor: '#FFF',
        } : undefined}
      />
    );
  }
}

const styles = StyleSheet.create({
  nameText: {
    fontWeight: '700',
  },
  headerRow: {
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
