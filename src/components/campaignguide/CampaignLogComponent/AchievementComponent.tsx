import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';

import space from '@styles/space';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import CardTextComponent from '@components/card/CardTextComponent';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { Achievement } from '@data/scenario/types';
import StyleContext from '@styles/StyleContext';
import CampaignGuideContext from '../CampaignGuideContext';
import { useCounter } from '@components/core/hooks';

interface Props {
  achievement: Achievement;
}

interface ItemProps {
  id: string;
  text: string;
  value: boolean;
  onToggle: (value: boolean, id: string) => void;
}

function AchievementListItem({ id, text, value, onToggle }: ItemProps) {
  const onValueChange = useCallback((value: boolean) => onToggle(value, id), [onToggle, id]);
  return (
    <View style={[styles.row, space.paddingBottomS]}>
      <ArkhamSwitch value={value} onValueChange={onValueChange} />
      <View style={[space.paddingLeftS, styles.column]}>
        <CardTextComponent text={text} />
      </View>
    </View>
  );
}

export default function AchievementComponent({ achievement }: Props) {
  const { typography } = useContext(StyleContext);
  const { campaignState } = useContext(CampaignGuideContext);
  const onBinaryToggle = useCallback((value: boolean, listId?: string) => {
    const id = listId ? `${achievement.id}#${listId}` : achievement.id;
    campaignState.setBinaryAchievement(id, value);
  }, [campaignState, achievement.id]);
  const binaryValue = useMemo(() => campaignState.binaryAchievement(achievement.id), [achievement.id, campaignState]);
  const syncCounterValue = useCallback((value: number) => {
    campaignState.setCountAchievement(achievement.id, value);
  }, [campaignState, achievement.id]);
  const [count, onInc, onDec] = useCounter(campaignState.countAchievement(achievement.id), { min: 0, max: achievement.max }, achievement.type === 'count' ? syncCounterValue : undefined);
  switch (achievement.type) {
    case 'binary':
      return (
        <View style={[styles.row, space.paddingTopS, space.paddingBottomS, space.paddingRightM]}>
          <View style={styles.control}>
            <ArkhamSwitch value={binaryValue} onValueChange={onBinaryToggle} />
          </View>
          <View style={[space.paddingLeftM, styles.column]}>
            <Text style={[typography.text, typography.bold]}>{ achievement.title }</Text>
            <CardTextComponent text={achievement.text} />
          </View>
        </View>
      );
    case 'count':
      return (
        <View style={[styles.row, space.paddingTopS, space.paddingBottomS, space.paddingRightM]}>
          <View style={styles.control}>
            <Text style={typography.mediumGameFont}>{ count }</Text>
          </View>
          <View style={[space.paddingLeftM, styles.column]}>
            <Text style={[typography.text, typography.bold]}>{ achievement.title }</Text>
            <CardTextComponent text={achievement.text} />
            <PlusMinusButtons
              count={count}
              onIncrement={onInc}
              onDecrement={onDec}
              max={achievement.max}
            />
          </View>
        </View>
      );
    case 'list':
      return (
        <View style={[styles.row, space.paddingTopS, space.paddingBottomS, space.paddingRightM]}>
          <View style={styles.control} />
          <View style={[space.paddingLeftM, styles.column]}>
            <Text style={[typography.text, typography.bold]}>{ achievement.title }</Text>
            <CardTextComponent text={achievement.text} />
            { map(achievement.items || [], item => {
              const value = campaignState.binaryAchievement(`${achievement.id}#${item.id}`);
              return (
                <AchievementListItem
                  id={item.id}
                  key={item.id}
                  text={item.text}
                  value={value}
                  onToggle={onBinaryToggle}
                />
              );
            }) }
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  control: {
    width: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
