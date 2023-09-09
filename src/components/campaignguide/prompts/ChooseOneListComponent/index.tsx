import React, { useCallback, useContext, useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { flatMap } from 'lodash';

import { DisplayChoice } from '@data/scenario';
import StyleContext from '@styles/StyleContext';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import space, { isTablet, m, s, xs } from '@styles/space';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { TouchableShrink } from '@components/core/Touchables';
import DeckButton from '@components/deck/controls/DeckButton';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import typography from '@styles/typography';
import CardTextComponent from '@components/card/CardTextComponent';
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
  const visibleChoices = flatMap(choices, (choice, idx) => {
    if (!editable && idx !== selectedIndex) {
      return [];
    }
    if (editable && choice.hidden) {
      return [];
    }
    return {
      choice,
      idx
    };
  });
  if (compact) {
    if (!editable) {
      return flatMap(visibleChoices, ({ choice, idx }) => {
        return (
          <CompactChoiceComponent
              key={idx}
              icon={icon ?? processedScenario.id.scenarioId}
              index={idx}
              onSelect={onSelect}
              choice={choice}
              selected={selectedIndex === idx}
              editable={editable}
              last={!editable || choices.length <= 2 || idx === choices.length - 1}
            />
        );
      });
    }
    return (
      <FlatGrid
        style={{ padding: 0 }}
        itemDimension={60}
        data={visibleChoices}
        renderItem={({ item: { choice, idx } }) => {
          return (
            <CompactChoiceComponent
              key={idx}
              icon={icon ?? processedScenario.id.scenarioId}
              index={idx}
              onSelect={onSelect}
              choice={choice}
              selected={selectedIndex === idx}
              editable={editable}
              last={!editable || choices.length <= 2 || idx === choices.length - 1}
            />
          );
        }}
      />
    );
  }
  return (
    <>
      { flatMap(visibleChoices, ({ choice, idx }) => {
        return (
          <ChoiceComponent
            key={idx}
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

interface ChoiceComponentProps {
  choice: DisplayChoice;
  index: number;
  selected: boolean;
  editable: boolean;
  onSelect: (index: number) => void;
  last?: boolean;
}

function ChoiceComponent({
  choice,
  index,
  selected,
  editable,
  onSelect,
  last,
}: ChoiceComponentProps) {
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

function CompactChoiceComponent({
  choice,
  index,
  selected,
  editable,
  onSelect,
  last,
  icon,
}: ChoiceComponentProps & { icon: string }) {
  const { colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);
  const textContent = useMemo(() => {
    return (
      <Text style={[typography.mediumGameFont, selected ? typography.inverted : undefined]}>{choice.text}</Text>
    );
  }, [choice, selected]);
  if (!editable) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <EncounterIcon encounter_code={icon} size={32} color={colors.D20} />
        <Text style={[space.marginLeftXs, typography.bigGameFont]}>{choice.description ?? choice.text}</Text>
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
