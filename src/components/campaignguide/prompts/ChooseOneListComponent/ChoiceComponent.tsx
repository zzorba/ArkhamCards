import React, { useCallback, useContext, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import BinaryResult from '../../BinaryResult';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { DisplayChoice } from '@data/scenario';
import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  choice: DisplayChoice;
  index: number;
  selected: boolean;
  editable: boolean;
  onSelect: (index: number) => void;
  noBullet?: boolean;
  color?: string;
}

export default function ChoiceComponent({
  choice,
  index,
  selected,
  editable,
  onSelect,
  noBullet,
  color,
}: Props) {
  const { borderStyle } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);

  const textContent = useMemo(() => {
    return (
      <>
        { choice.text && <CampaignGuideTextComponent text={choice.text} /> }
        { choice.description && <CampaignGuideTextComponent text={choice.description} /> }
      </>
    );
  }, [choice]);

  const content = useMemo(() => {
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
              { textContent }
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
            { textContent }
          </BinaryResult>
        </View>
      );
    }
    return (
      <BinaryResult
        result={selected}
        bulletType="small"
      >
        { textContent }
      </BinaryResult>
    );
  }, [selected, editable, index, color, noBullet, textContent, borderStyle]);

  if (editable) {
    return (
      <TouchableOpacity onPress={onPress}>
        { content }
      </TouchableOpacity>
    );
  }
  return content;
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
