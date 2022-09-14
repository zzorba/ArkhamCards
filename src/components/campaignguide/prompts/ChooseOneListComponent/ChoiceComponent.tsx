import React, { useCallback, useContext, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { DisplayChoice } from '@data/scenario';
import space, { m, s, xs, isTablet } from '@styles/space';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext from '@styles/StyleContext';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TouchableShrink } from '@components/core/Touchables';

interface Props {
  choice: DisplayChoice;
  index: number;
  selected: boolean;
  editable: boolean;
  onSelect: (index: number) => void;
  last?: boolean;
}

export default function ChoiceComponent({
  choice,
  index,
  selected,
  editable,
  onSelect,
  last,
}: Props) {
  const { borderStyle } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);
  const textContent = useMemo(() => {
    return (
      <>
        { choice.text && <CampaignGuideTextComponent text={choice.text} sizeScale={choice.large ? 1.2 : undefined} /> }
        { choice.description && <CampaignGuideTextComponent text={choice.description} /> }
      </>
    );
  }, [choice]);
  const showBorder = !last && isTablet;
  return (
    <View style={[
      styles.row,
      !editable ? space.paddingLeftS : undefined,
      showBorder ? borderStyle : undefined,
      showBorder ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
    ]}>
      <View style={styles.padding}>
        <View style={[styles.bullet, styles.radioButton]}>
          <ArkhamSwitch
            large
            value={selected}
            onValueChange={editable ? onPress : undefined}
            type="radio"
            color="dark"
          />
        </View>
        <TouchableShrink style={{ flex: 1 }} onPress={onPress} disabled={!editable}>
          <View style={styles.textBlock}>
            { textContent }
          </View>
        </TouchableShrink>
      </View>
    </View>
  );
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
