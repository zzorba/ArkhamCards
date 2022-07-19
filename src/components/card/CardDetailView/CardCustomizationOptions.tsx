import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { map, find, repeat, flatMap, range, sumBy } from 'lodash';
import { msgid, ngettext, t } from 'ttag';

import Card from '@data/types/Card';
import CustomizationOption, { CustomizationChoice } from '@data/types/CustomizationOption';
import StyleContext from '@styles/StyleContext';
import CardTextComponent from '../CardTextComponent';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import space, { s } from '@styles/space';
import { DeckId } from '@actions/types';
import { useCounter, useFlag } from '@components/core/hooks';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { usePickerDialog } from '@components/deck/dialogs';
import SlotIcon from './TwoSidedCardComponent/SlotIcon';
import LoadingSpinner from '@components/core/LoadingSpinner';
import AppIcon from '@icons/AppIcon';

interface Props {
  componentId: string;
  card: Card;
  customizationOptions: CustomizationOption[];
  customizationChoices: CustomizationChoice[] | undefined;
  width: number;
  editable: boolean;
  deckId: DeckId | undefined;
  setChoice: (code: string, choice: CustomizationChoice) => void;
  mode?: 'edit' | 'upgrade' | 'view';
}

function XpBox({ small, checked, margin }: { small?: boolean; checked?: boolean; margin?: boolean }) {
  const { colors } = useContext(StyleContext);
  if (small) {
    return (
      <View style={[
        styles.smallXp,
        { borderColor: colors.L10 },
        margin ? { marginRight: 2 } : undefined,
      ]} >
        { !!checked && <View style={{ marginLeft: -15, marginTop: -2 }}><AppIcon name="check_on_check" size={28} color={colors.D10} /></View> }
      </View>
    );
  }
  return (
    <View style={[
      styles.largeXp,
      { borderColor: colors.L10 },
      margin ? { marginRight: 2 } : undefined,
    ]}>
      { !!checked && <View style={{ marginLeft: -5, marginTop: -2 }}><AppIcon name="check_on_check" size={28} color={colors.D10} /></View> }
    </View>
  );
}

function XpCheckbox({ xp, checked, onCheck }: { xp: number; checked: boolean; onCheck: (index: number) => void }) {
  const onPress = useCallback(() => {
    onCheck(checked ? (xp - 1) : xp);
  }, [onCheck, xp, checked]);

  return (
    <View style={{ marginRight: 4 }}>
      <TouchableOpacity onPress={onPress}>
        <XpBox checked={checked} />
      </TouchableOpacity>
    </View>
  );
}

function XpControl({ option, choice, xp, onInc, onDec, onSet } : {
  option: CustomizationOption;
  choice: CustomizationChoice | undefined;
  xp: number;
  onInc: () => void;
  onDec: () => void;
  onSet: (xp: number) => void;
}) {
  if (!option.xp) {
    return null;
  }
  if (option.xp <= 3) {
    return (
      <View style={[space.paddingVerticalXs, space.paddingLeftS, styles.row]}>
        { map(range(0, option.xp), (index) => (
          <XpCheckbox
            key={index}
            xp={index + 1}
            checked={xp > index}
            onCheck={onSet}
          />
        ))}
      </View>
    );
  }
  return (
    <View style={[space.paddingVerticalXs, space.paddingLeftXs, styles.row]}>
      { (xp > 0) && (
        <TouchableOpacity onPress={onDec}>
          <View style={styles.row}>
            { map(range(0, xp - 1), (index) => (<XpBox small checked margin key={`less_${index}`} />)) }
            <XpBox checked margin />
          </View>
        </TouchableOpacity>
      ) }
      { (xp < option.xp) && (
        <TouchableOpacity onPress={onInc}>
          <View style={styles.row}>
            <XpBox margin />
            { map(range(xp + 1, option.xp), (index) => (<XpBox small margin key={`more_${index}`} />)) }
          </View>
        </TouchableOpacity>
      ) }
    </View>
  );

  return (
    <PlusMinusButtons
      dialogStyle
      showZeroCount
      showMax
      onIncrement={onInc}
      onDecrement={onDec}
      count={xp}
      min={choice?.xp_locked || 0}
      max={option.xp}
    />
  );
}

function RemoveSlotAdvancedControl({ card, choice, editable, setChoice }: {
  card: Card;
  setChoice: (choice: string) => void;
  editable: boolean;
  choice: CustomizationChoice;
}) {
  const [selectedValue, setSelection] = useState(parseInt(choice.choice || '0', 10));
  const items = useMemo(() => {
    const real_slots = card.real_slot?.split('.') || [];
    return flatMap(card.slot?.split('.'), (slot, index) => {
      if (!slot) {
        return [];
      }
      const real_slot = real_slots[index]?.trim();
      return {
        title: slot.trim(),
        value: index,
        iconNode: <SlotIcon slot={real_slot} />,
      };
    });
  }, [card.real_slot, card.slot]);
  const onChange = useCallback((index: number) => {
    setSelection(index);
    setChoice(`${index}`);
  }, [setChoice, setSelection]);
  const [dialog, showDialog] = usePickerDialog({
    title: t`Choose slot to remove`,
    items,
    selectedValue,
    onValueChange: onChange,
  });
  return (
    <>
      <View style={space.paddingBottomS}>
        <DeckPickerStyleButton
          first
          last
          editable={editable}
          title={t`Slot`}
          valueLabel={items[selectedValue].title}
          onPress={showDialog}
        />
      </View>
      {dialog}
    </>
  );
}

function AdvancedControl({ card, type, editable, choice, setChoice }: {
  card: Card;
  type: string;
  editable: boolean;
  choice: CustomizationChoice;
  setChoice: (index: number, xp: number, decision: string) => void;
}) {
  const { typography } = useContext(StyleContext);
  const onSetChoice = useCallback((decision: string) => {
    setChoice(choice.option.index, choice.option.xp || 0, decision);
  }, [setChoice, choice.option])
  switch (type) {
    case 'remove_slot':
      return <RemoveSlotAdvancedControl card={card} editable={editable} choice={choice} setChoice={onSetChoice} />
    default:
      return (
        <Text style={[typography.text, space.paddingS]}>
          {t`Sorry, the app cannot yet support customizable cards like this one, but we are working on it!\n\nPlease check for pending app updates and try again later.`}
        </Text>
      );
  }
}

interface LineProps {
  card: Card;
  option: CustomizationOption;
  showAll: boolean;
  mode?: 'edit' | 'upgrade' | 'view'
  editable: boolean;
  choices: CustomizationChoice[] | undefined;
  last?: boolean;
  setChoice: (code: string, choice: CustomizationChoice) => void;
}

function CustomizationLine({ card, option, editable, mode, choices, showAll, last, setChoice }: LineProps) {
  const { borderStyle } = useContext(StyleContext);
  const choice = find(choices, o => o.option.index === option.index);
  const onXpChange = useCallback((index: number, xp: number) => {
    const choice = card.customizationChoice(index, xp);
    if (choice) {
      setChoice(card.code, choice);
    }
  }, [setChoice, card]);
  const onChoiceChange = useCallback((index: number, xp: number, decision: string) => {
    const choice = card.customizationChoice(index, xp, decision);
    if (choice) {
      setChoice(card.code, choice);
    }
  }, [setChoice, card])

  const xpBoxes = editable ? undefined : (repeat('☒', choice?.xp_spent || 0) + repeat('☐', (option.xp || 0) - (choice?.xp_spent || 0)));
  const onChange = useCallback((xp: number) => {
    onXpChange(option.index, xp);
  }, [onXpChange, option.index]);
  const [count, onInc, onDec, setCount] = useCounter(choice?.xp_spent || 0, { min: choice?.xp_locked || 0, max: option.xp || 0 }, onChange);

  const showAdvanced = !!option.choice && option.xp === count;
  const text = useMemo(() => {
    if (!option.text) {
      return '';
    }
    if (!showAdvanced) {
      return option.text;
    }
    return `${option.text?.replace(/:.*$/, '')}:`;
  }, [option.text, showAdvanced]);

  if (mode === 'view' && (!choice || (option.xp && !count)) && !showAll) {
    // Drop the ones you didn't chose when not editing
    return null;
  }
  return (
    <View style={[
      styles.column,
      space.paddingTopXs,
      !last ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
      borderStyle,
    ]}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <CardTextComponent
            text={`${(option.xp && !editable) ? `${xpBoxes} ` : ''}<b>${option.title}</b> ${text}`}
          />
        </View>
        { editable && (
          <View style={styles.row}>
            <XpControl
              option={option}
              choice={choice}
              onInc={onInc}
              onDec={onDec}
              xp={count}
              onSet={setCount}
            />
          </View>
        ) }
      </View>
      { !!option.choice && !!choice?.unlocked && (
        <AdvancedControl
          type={option.choice}
          card={card}
          editable={editable}
          choice={choice}
          setChoice={onChoiceChange}
        />
      ) }
    </View>
  );
}

export default function CardCustomizationOptions({ setChoice, mode, deckId, customizationChoices, card, customizationOptions, width, editable }: Props) {
  const { typography, colors } = useContext(StyleContext);
  const [showAll, toggleShowAll] = useFlag(false);
  const xp = useMemo(() => sumBy(customizationChoices, c => c.xp_spent), [customizationChoices]);
  return (
    <View style={[{ width }, space.paddingSideS, space.marginBottomL]}>
      <RoundedFactionHeader faction={card.factionCode()} width={width - s * 2} dualFaction={!!card.faction2_code}>
        <View style={[styles.row, space.marginLeftS, space.paddingTopXs]}>
          <Text style={[typography.cardName, { color: '#FFFFFF', flex: 1 }]}>
            { t`Customizations`}
          </Text>
          { !!deckId && (
            <Text style={[typography.text, { color: '#FFFFFF' }]}>
              { ngettext(msgid`${xp} XP`, `${xp} XP`, xp) }
            </Text>
          ) }
        </View>
      </RoundedFactionHeader>
      <View style={[styles.main, { borderColor: colors.faction[card.factionCode()].border }]}>
        { (!deckId || customizationChoices) ? (
          <View style={space.paddingSideS}>
            { map(customizationOptions, (option, index) => (
              <CustomizationLine
                key={option.index}
                card={card}
                option={option}
                mode={mode}
                choices={customizationChoices}
                showAll={showAll}
                editable={editable}
                setChoice={setChoice}
                last={index === customizationOptions.length - 1}
              />
            )) }
          </View>
        ) : <LoadingSpinner arkham inline /> }
        { !!deckId && (!mode || mode === 'view') && (
          <RoundedFooterButton
            icon={showAll ? 'hide' : 'show'}
            title={showAll ? t`Show selected customizations` : t`Show all customizations`}
            onPress={toggleShowAll}
          />
        ) }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  main: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  column: {
    flexDirection: 'column',
  },
  smallXp: {
    borderRadius: 6,
    borderWidth: 2,
    width: 12,
    height: 24,
    overflow: 'hidden',
  },
  largeXp: {
    borderRadius: 6,
    borderWidth: 2,
    width: 24,
    height: 24,
  },
});
