import React, { useCallback, useContext, useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SimpleGrid } from 'react-native-super-grid';
import { flatMap } from 'lodash';

import { DisplayChoice } from '@data/scenario';
import StyleContext from '@styles/StyleContext';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import space, { isTablet, m, s, xs } from '@styles/space';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { TouchableShrink } from '@components/core/Touchables';
import DeckButton from '@components/deck/controls/DeckButton';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import EncounterIcon from '@icons/EncounterIcon';

interface Props {
  choices: DisplayChoice[];
  selectedIndex?: number;
  editable: boolean;
  onSelect: (index: number) => void;
  compact?: boolean;
  icon?: string;
}

export default function ChooseOneListComponent({
  choices,
  selectedIndex,
  editable,
  onSelect,
  compact,
  icon,
}: Props) {
  const { processedScenario } = useContext(ScenarioGuideContext);
  const visibleChoices = useMemo(() => {
    let idx: number = 0;
    return flatMap(choices, (choice, originalIndex) => {
      const currentIndex = idx;
      if (!choice.conditionHidden) {
        idx++;
      }
      if (!editable) {
        if(choice.conditionHidden || currentIndex !== selectedIndex) {
          return [];
        }
      } else {
        if (choice.hidden) {
          return [];
        }
      }
      if (compact && choice.conditionHidden) {
        return [];
      }
      return {
        choice,
        key: originalIndex,
        disabled: !!choice.conditionHidden,
        idx: currentIndex,
      };
    });
  }, [choices, compact, editable, selectedIndex]);
  const renderItem = useCallback(({ item: { choice, key, idx } }: { item: { choice: DisplayChoice; key: number; idx: number; disabled: boolean } }) => {
    return (
      <CompactChoiceComponent
        key={key}
        icon={icon ?? processedScenario.id.scenarioId}
        index={idx}
        onSelect={onSelect}
        choice={choice}
        selected={selectedIndex === idx}
        editable={editable}
        last={!editable || choices.length <= 2 || idx === choices.length - 1}
      />
    );
  }, [choices.length, editable, icon, onSelect, processedScenario.id.scenarioId, selectedIndex]);
  if (compact) {
    if (!editable) {
      return (
        <>
          { flatMap(visibleChoices, ({ choice, key, idx }) => {
            return (
              <CompactChoiceComponent
                key={key}
                icon={icon ?? processedScenario.id.scenarioId}
                index={idx}
                onSelect={onSelect}
                choice={choice}
                selected={selectedIndex === idx}
                editable={editable}
                last={!editable || choices.length <= 2 || idx === choices.length - 1}
              />
            );
          }) }
        </>
      );
    }
    return (
      <SimpleGrid
        listKey="choice"
        style={{ padding: 0 }}
        itemDimension={60}
        data={visibleChoices}
        renderItem={renderItem}
      />
    );
  }
  return (
    <>
      { flatMap(visibleChoices, ({ choice, disabled, key, idx }) => {
        return (
          <ChoiceComponent
            key={key}
            index={idx}
            onSelect={onSelect}
            choice={choice}
            disabled={disabled}
            selected={!disabled && selectedIndex === idx}
            editable={editable}
            last={!editable || choices.length <= 2 || idx === choices.length - 1}
          />
        );
      }) }
    </>
  );
}

interface ChoiceComponentProps {
  choice: DisplayChoice;
  index: number;
  selected: boolean;
  disabled?: boolean;
  editable: boolean;
  onSelect: (index: number) => void;
  last?: boolean;
}

function ChoiceComponent({
  choice,
  index,
  selected,
  disabled,
  editable,
  onSelect,
  last,
}: ChoiceComponentProps) {
  const { borderStyle, colors } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);
  const textContent = useMemo(() => {
    return (
      <>
        { choice.text && <CampaignGuideTextComponent text={disabled ? `<strike>${choice.text}</strike>` : choice.text} sizeScale={choice.large ? 1.2 : undefined} /> }
        { choice.description && <CampaignGuideTextComponent text={choice.description} /> }
      </>
    );
  }, [choice, disabled]);
  const showBorder = !last && isTablet;
  return (
    <View style={[
      styles.row,
      !editable ? space.paddingLeftS : undefined,
      showBorder ? borderStyle : undefined,
      showBorder ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
    ]}>
      <View style={[styles.padding, { alignItems: 'flex-start' }]}>
        <View style={[styles.bullet, styles.radioButton]}>
          <ArkhamSwitch
            large
            value={selected}
            onValueChange={editable ? onPress : undefined}
            disabled={disabled}
            type="radio"
            color="dark"
            disabledColor={colors.L10}
          />
        </View>
        <TouchableShrink style={{ flex: 1 }} onPress={onPress} disabled={!editable || disabled}>
          <View style={styles.textBlock}>
            { textContent }
          </View>
        </TouchableShrink>
      </View>
    </View>
  );
}

function CompactChoiceComponent({
  choice,
  index,
  selected,
  editable,
  onSelect,
  icon,
}: ChoiceComponentProps & { icon: string }) {
  const { colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);
  const textContent = useMemo(() => {
    return (
      <Text style={[typography.cardName, selected ? typography.inverted : undefined]}>{choice.text}</Text>
    );
  }, [choice, selected, typography]);
  if (!editable) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <EncounterIcon encounter_code={icon} size={32} color={colors.D20} />
        <Text style={[space.marginLeftXs, typography.cardName]}>{choice.description ?? choice.text}</Text>
      </View>
    );
  }

  return (
    <DeckButton
      encounterIcon={icon}
      color={selected ? 'default' : 'light_gray_outline'}
      textComponent={textContent}
      onPress={onPress}
      bigEncounterIcon
    />
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
