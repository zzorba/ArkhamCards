import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import ResultIndicatorIcon from '../../ResultIndicatorIcon';
import ArkhamIcon from 'icons/ArkhamIcon';
import CampaignGuideTextComponent from 'components/campaignguide/CampaignGuideTextComponent';
import { DisplayChoice } from 'data/scenario';
import { COLORS } from 'styles/colors';

interface Props {
  choice: DisplayChoice;
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
          backgroundColor: tintColor,
        } : {},
      ]}>
        <View style={styles.padding}>
          { editable ? (
            <View style={[styles.bullet, styles.radioButton]}>
              <MaterialCommunityIcons
                name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                size={30}
                color={buttonColor || 'rgb(0, 122,255)'}
              />
            </View>
          ) : (!noBullet && (
            <View style={styles.bullet}>
              <ArkhamIcon name="bullet" color={COLORS.scenarioGreen} size={24} />
            </View>
          )) }
          <View style={styles.textBlock}>
            { choice.flavor && <CampaignGuideTextComponent flavor text={choice.flavor} /> }
            { choice.text && <CampaignGuideTextComponent text={choice.text} /> }
            { choice.description && <CampaignGuideTextComponent text={choice.description} /> }
          </View>
        </View>
        { !editable && (
          <ResultIndicatorIcon
            result={selected}
            noBorder
          />
        ) }
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
    borderColor: '#888',
    flexDirection: 'row',
  },
  padding: {
    paddingLeft: 16,
    paddingRight: 24,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    flex: 1,
  },
  bullet: {
    marginRight: 16,
    minWidth: 24,
  },
  radioButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
