import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { map, find, repeat, flatMap, range, sumBy, forEach, uniq, filter, sortBy } from 'lodash';
import { msgid, ngettext, t } from 'ttag';

import Card from '@data/types/Card';
import CustomizationOption, { CustomizationChoice } from '@data/types/CustomizationOption';
import StyleContext from '@styles/StyleContext';
import CardTextComponent from '../CardTextComponent';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import space, { s } from '@styles/space';
import { DeckId, SORT_BY_TITLE } from '@actions/types';
import { useCounter, useEffectUpdate, useFlag } from '@components/core/hooks';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { useDialog, usePickerDialog } from '@components/deck/dialogs';
import SlotIcon from './TwoSidedCardComponent/SlotIcon';
import LoadingSpinner from '@components/core/LoadingSpinner';
import AppIcon from '@icons/AppIcon';
import useCardList from '../useCardList';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import { DeckOptionQueryBuilder } from '@data/types/DeckOption';
import { Navigation } from 'react-native-navigation';
import { CardSelectorProps } from '@components/campaignguide/CardSelectorView';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useDeckEdits, useSimpleDeckEdits } from '@components/deck/hooks';
import deckEdits from '@reducers/deckEdits';
import CardSearchResultsComponent from '@components/cardlist/CardSearchResultsComponent';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import ArkhamButton from '@components/core/ArkhamButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import CardSectionHeader from '@components/core/CardSectionHeader';

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

function ToggleCard({ card, selectedCodes, quantity, setSelectedCodes, last }: { card: Card; quantity: number; selectedCodes: string[]; setSelectedCodes: (codes: string[]) => void; last?: boolean }) {
  const onToggle = useCallback((value: boolean) => {
    if (value) {
      setSelectedCodes(uniq([...selectedCodes, card.code]))
    } else {
      setSelectedCodes(filter(selectedCodes, code => code !== card.code));
    }
  }, [card.code, selectedCodes, setSelectedCodes]);
  const selected = !!find(selectedCodes, code => code === card.code);
  return (
    <CardSearchResult
      card={card}
      noBorder={last}
      control={{
        type: 'toggle',
        value: selected,
        toggleValue: onToggle,
        disabled: !selected && selectedCodes.length >= quantity
      }}
    />
  );
}

function ChooseCardAdvancedControl({ componentId, deckId, choice, editable, setChoice }: {
  componentId: string;
  card: Card;
  deckId?: DeckId;
  setChoice: (choice: string) => void;
  editable: boolean;
  choice: CustomizationChoice;
}) {
  const { listSeperator } = useContext(LanguageContext);
  const deckEditState = useSimpleDeckEdits(deckId);
  const inDeckCodes = useMemo(() => {
    const codes: string[] = [];
    forEach(deckEditState?.slots || {}, (count, code) => {
      if (count > 0) {
        codes.push(code);
      }
    });
    return codes;
  }, [deckEditState]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>(choice.choice?.split('^') || []);
  useEffectUpdate(() => {
    setChoice(selectedCodes.join('^'));
  }, [selectedCodes]);
  const [selectedCards, loading] = useCardList(selectedCodes, 'player');
  const [inDeckCards, loadingDeck] = useCardList(inDeckCodes, 'player');
  const query = useMemo(() =>{
    if (!choice.option.card) {
      return undefined;
    }
    const builder = new DeckOptionQueryBuilder(choice.option.card, 0, 'custom');
    return builder.toQuery();
  }, [choice.option]);
  const setDialogVisibleRef = useRef<(visible: boolean) => void>();
  const showCardPicker = useCallback(() => {
    setDialogVisibleRef.current?.(false);
    Navigation.push<CardSelectorProps>(componentId, {
      component: {
        name: 'Guide.CardSelector',
        passProps: {
          query,
          selection: selectedCodes,
          onSelect: setSelectedCodes,
          includeStoryToggle: true,
          uniqueName: false,
          max: choice.option.quantity || 1,
        },
        options: {
          topBar: {
            title: {
              text: t`Select Cards`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [selectedCards, setSelectedCodes, componentId, query]);
  const selectedText = useMemo(() => map(selectedCards, c => c.name).join(listSeperator), [selectedCards])
  const quantity = choice.option.quantity || 1;
  const title = editable ?
    ngettext(msgid`Name ${quantity} card`, `Name ${quantity} cards`, quantity) :
    ngettext(msgid`Named card`, `Named cards`, quantity);

  const content = useMemo(() => {
    const eligibleCards = sortBy(filter(inDeckCards, card =>
      !!choice.option.card && card.matchesOption(choice.option.card)
    ), card => card.name);
    const canSelectMore = (choice.option.quantity || 1) > selectedCodes.length;
    const nonDeckSelected = filter(selectedCards, card => {
      return !find(inDeckCodes, code => card.code === code);
    });
    return (
      <View style={space.paddingBottomS}>
        { !!eligibleCards.length && <CardSectionHeader section={{ title: t`In deck` }} /> }
        <View style={space.paddingSideS}>
          { loadingDeck && <LoadingCardSearchResult /> }
          { map(eligibleCards, (card, idx) => (
            <ToggleCard
              key={card.code}
              card={card}
              quantity={choice.option.quantity || 1}
              selectedCodes={selectedCodes}
              setSelectedCodes={setSelectedCodes}
              last={idx === (eligibleCards.length - 1) && !canSelectMore && !nonDeckSelected.length}
            />
          )) }
        </View>
        { !!nonDeckSelected.length && <CardSectionHeader section={{ title: t`Other` }} /> }
        <View style={space.paddingSideS}>
          { map(nonDeckSelected, (card, idx) => (
            <ToggleCard
              key={card.code}
              card={card}
              quantity={choice.option.quantity || 1}
              selectedCodes={selectedCodes}
              setSelectedCodes={setSelectedCodes}
              last={idx === (nonDeckSelected.length - 1) && !canSelectMore}
            />
          )) }
        </View>
        { !!canSelectMore && (
          <ArkhamButton
            onPress={showCardPicker}
            title={t`Select additional cards`}
            icon="addcard"
          />
        ) }
      </View>
    );
  }, [choice.option.card, loadingDeck, selectedCards, selectedCodes, setSelectedCodes, inDeckCards, showCardPicker])
  const { dialog, showDialog, setVisible } = useDialog({
    title,
    content,
    noPadding: true,
    allowDismiss: true,
  });
  useEffect(() => {
    setDialogVisibleRef.current = setVisible;
  }, [setVisible]);
  return (
    <>
      <View style={space.paddingBottomS}>
        <DeckPickerStyleButton
          title={title}
          icon="card-outline"
          valueLabel={selectedText}
          editable={editable}
          onPress={showDialog}
          first
          last
        />
      </View>
      { dialog }
    </>
  );
}

function AdvancedControl({ componentId, deckId, card, type, editable, choice, setChoice }: {
  componentId: string;
  deckId?: DeckId;
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
      return (
        <RemoveSlotAdvancedControl
          card={card}
          editable={editable}
          choice={choice}
          setChoice={onSetChoice}
        />
      );
    case 'choose_card':
      return (
        <ChooseCardAdvancedControl
          componentId={componentId}
          card={card}
          editable={editable}
          choice={choice}
          setChoice={onSetChoice}
          deckId={deckId}
        />
      );
    default:
      return (
        <Text style={[typography.text, space.paddingS]}>
          {t`Sorry, the app cannot yet support customizable cards like this one, but we are working on it!\n\nPlease check for pending app updates and try again later.`}
        </Text>
      );
  }
}

interface LineProps {
  componentId: string;
  card: Card;
  deckId?: DeckId;
  option: CustomizationOption;
  showAll: boolean;
  mode?: 'edit' | 'upgrade' | 'view'
  editable: boolean;
  choices: CustomizationChoice[] | undefined;
  last?: boolean;
  setChoice: (code: string, choice: CustomizationChoice) => void;
}

function CustomizationLine({ componentId, card, option, deckId, editable, mode, choices, showAll, last, setChoice }: LineProps) {
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
            text={`${(option.xp && !editable) ? `${xpBoxes} ` : ''}${option.title ? `<b>${option.title}</b> ` : ''}${text}`}
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
          componentId={componentId}
          type={option.choice}
          card={card}
          editable={editable && choice.editable}
          deckId={deckId}
          choice={choice}
          setChoice={onChoiceChange}
        />
      ) }
    </View>
  );
}

export default function CardCustomizationOptions({ setChoice, mode, deckId, customizationChoices, card, customizationOptions, width, editable, componentId }: Props) {
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
                componentId={componentId}
                key={option.index}
                card={card}
                option={option}
                mode={mode}
                choices={customizationChoices}
                showAll={showAll}
                deckId={deckId}
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
