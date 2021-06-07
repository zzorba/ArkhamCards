import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { DisplayChoice } from '@data/scenario';
import space, { m, s, xs } from '@styles/space';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

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
  const onPress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);
  const textContent = useMemo(() => {
    return (
      <>
        { choice.text && <CampaignGuideTextComponent text={choice.text} sizeScale={choice.large ? 1.2 : 1} /> }
        { choice.description && <CampaignGuideTextComponent text={choice.description} /> }
      </>
    );
  }, [choice]);

  const content = useMemo(() => {
    return (
      <View style={[styles.row, !editable ? space.paddingLeftS : undefined]}>
        <View style={styles.padding}>
          <View style={[styles.bullet, styles.radioButton]}>
            <ArkhamSwitch large value={selected} color="dark" />
          </View>
          <View style={styles.textBlock}>
            { textContent }
          </View>
        </View>
      </View>
    );
  }, [selected, editable, textContent]);

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
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: s,
  },
  row: {
    flexDirection: 'row',
  },
  padding: {
    paddingTop: xs,
    paddingBottom: xs,
    flexDirection: 'row',
    flex: 1,
  },
  bullet: {
    marginRight: s,
    minWidth: s + m,
  },
  radioButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
