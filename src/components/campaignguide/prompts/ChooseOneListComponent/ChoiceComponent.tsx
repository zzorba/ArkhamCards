import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import ArkhamIcon from 'icons/ArkhamIcon';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import { Choice, SimpleEffectsChoice } from 'data/scenario/types';
import { COLORS } from 'styles/colors';

interface Props {
  choice: Choice | SimpleEffectsChoice;
  index: number;
  selected: boolean;
  editable: boolean;
  onSelect: (index: number) => void;
  noBullet?: boolean;
  tintColor?: string;
  buttonColor?: string;
}

export default class ChoiceComponent extends React.Component<Props> {
  _onPress = () => {
    const { onSelect, index } = this.props;
    onSelect(index);
  };

  renderContent() {
    const {
      choice,
      selected,
      editable,
      index,
      tintColor,
      buttonColor,
      noBullet,
    } = this.props;
    return (
      <View style={[
        styles.row,
        (index === 0 || !editable) ? { borderTopWidth: 1 } : {},
        selected && editable ? {
          backgroundColor: tintColor || COLORS.veryLightBlue,
        } : {},
      ]}>
        { !noBullet && (
          <View style={styles.bullet}>
            <ArkhamIcon name="bullet" color="#2E5344" size={24} />
          </View>
        ) }
        <View style={styles.textBlock}>
          { choice.flavor && <CardFlavorTextComponent text={choice.flavor} color="#222" /> }
          { choice.text && <CardTextComponent text={choice.text} /> }
          { choice.description && <CardTextComponent text={choice.description} /> }
        </View>
        <View style={styles.arrow}>
          { !selected && editable && (
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color={buttonColor || 'rgb(0, 122,255)'}
            />
          ) }
        </View>
      </View>
    );
  }
  render() {
    const {
      editable,
    } = this.props;
    if (editable) {
      return (
        <TouchableOpacity onPress={this._onPress}>
          { this.renderContent() }
        </TouchableOpacity>
      );
    }
    return this.renderContent();
  }
}

const styles = StyleSheet.create({
  textBlock: {
    flex: 1,
  },
  row: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  bullet: {
    marginRight: 4,
  },
  arrow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 30,
    minHeight: 30,
  },
});
