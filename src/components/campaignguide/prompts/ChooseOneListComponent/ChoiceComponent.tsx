import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import BinaryResult from '../../BinaryResult';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { DisplayChoice } from '@data/scenario';
import { m, s } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  choice: DisplayChoice;
  index: number;
  selected: boolean;
  editable: boolean;
  onSelect: (index: number) => void;
  noBullet?: boolean;
  color?: string;
}

export default class ChoiceComponent extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _onPress = () => {
    const { onSelect, index } = this.props;
    onSelect(index);
  };

  renderTextContent() {
    const {
      choice,
    } = this.props;
    return (
      <>
        { choice.text && <CampaignGuideTextComponent text={choice.text} /> }
        { choice.description && <CampaignGuideTextComponent text={choice.description} /> }
      </>
    );
  }

  renderContent() {
    const {
      selected,
      editable,
      index,
      color,
      noBullet,
    } = this.props;
    const { borderStyle } = this.context;
    if (editable) {
      return (
        <View style={[
          styles.row,
          borderStyle,
          index === 0 ? { borderTopWidth: StyleSheet.hairlineWidth } : {},
        ]}>
          <View style={styles.padding}>
            <View style={[styles.bullet, styles.radioButton]}>
              <MaterialCommunityIcons
                name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                size={30}
                color={color ? color : 'rgb(0, 122,255)'}
              />
            </View>
            <View style={styles.textBlock}>
              { this.renderTextContent() }
            </View>
          </View>
        </View>
      );
    }
    if (noBullet) {
      return (
        <View style={[styles.bottomBorder, borderStyle]}>
          <BinaryResult
            result={selected}
            bulletType="none"
          >
            { this.renderTextContent() }
          </BinaryResult>
        </View>
      );
    }
    return (
      <BinaryResult
        result={selected}
        bulletType="small"
      >
        { this.renderTextContent() }
      </BinaryResult>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  padding: {
    paddingLeft: m,
    paddingRight: s + m,
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'row',
    flex: 1,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bullet: {
    marginRight: m,
    minWidth: s + m,
  },
  radioButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
