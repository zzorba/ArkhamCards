import { cycleName, expandPackCode, getCardPoolSections, POOL_INVESTIGATOR_CH2_CYCLE, POOL_INVESTIGATOR_CH2_PACKS, POOL_INVESTIGATOR_CYCLE, POOL_INVESTIGATOR_PACKS, SPECIAL_PACKS } from '@app_constants';
import { useSettingValue } from '@components/core/hooks';
import LanguageContext from '@lib/i18n/LanguageContext';
import { getAllRealPacks, getPacksInCollection } from '@reducers/index';
import StyleContext from '@styles/StyleContext';
import { filter, forEach, map, sumBy, uniq } from 'lodash';
import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'ttag';
import { Item, useDialog, useMultiPickerDialog } from '../dialogs';
import EncounterIcon from '@icons/EncounterIcon';
import { Text, View } from 'react-native';
import DeckBubbleHeader from '../section/DeckBubbleHeader';
import NewDialog from '@components/core/NewDialog';
import LineItem from '@components/core/NewDialog/LineItem';
import DeckPickerStyleButton from './DeckPickerStyleButton';
import { CardPoolMode, DeckMeta } from '@actions/types';
import space from '@styles/space';

type Props = {
  first?: boolean;
  last?: boolean;
  selectedPacks: string[];
  setSelectedPacks: (packs: string[] | ((current: string[]) => string[])) => void;
  cardPool: CardPoolMode;
  setCardPool: (mode: CardPoolMode) => void;
  isArkhamDbDeck?: boolean;
}

const ALL_CARD_POOLS: CardPoolMode[] = ['current', 'legacy', 'limited', 'custom'];

function cardPoolModeLabel(mode: CardPoolMode): string {
  switch (mode) {
    case 'legacy': return t`Legacy`;
    case 'current': return t`Current`;
    case 'limited': return t`Limited`;
    case 'custom': return t`Custom`;
  }
}

function defaultCardPoolSet(
  mode: CardPoolMode,
  packInCollection: { [pack: string]: boolean }
): string[] {
  const defaultCore = packInCollection.core_2026 ? 'core_2026' : packInCollection.rcore ? 'rcore' : 'core';
  const investigatorCycle = defaultCore === 'core_2026' ? POOL_INVESTIGATOR_CH2_CYCLE : POOL_INVESTIGATOR_CYCLE;
  switch (mode) {
    case 'legacy':
      return [];
    case 'current':
      return ['core_2026', POOL_INVESTIGATOR_CH2_CYCLE];
    case 'limited':
      return [defaultCore, investigatorCycle];
    case 'custom':
      return [defaultCore];
  }
}

function cardPoolDescription(mode: CardPoolMode): string {
  switch (mode) {
    case 'legacy':
      return t`Use all cards from any product`;
    case 'current':
      return t`Use only cards from recent expansions`;
    case 'limited':
      return t`Use only cards from your choice of three expansions`;
    case 'custom':
      return t`Use a completely custom card pool`;
  }
}


function usePackNames(): { [code: string]: string } {
  const packs = useSelector(getAllRealPacks);
  const allSpecialPacks = useMemo(() => filter(SPECIAL_PACKS, sp => sp.player), []);
  return useMemo(() => {
    const result: { [code: string]: string } = {};
    forEach(allSpecialPacks, sp => {
      result[sp.code] = cycleName(`${sp.cyclePosition}`);
    })
    forEach(packs, pack => {
      if (pack.name) {
        if (pack.cycle_position < 50 && pack.cycle_position > 1) {
          result[pack.code] = cycleName(`${pack.cycle_position}`);
        } else {
          result[pack.code] = pack.name;
        }
      }
    });
    return result;
  }, [packs, allSpecialPacks]);

}

function usePackCycles(mode: CardPoolMode, isArkhamDbDeck?: boolean): Item<string>[] {
  const { lang } = useContext(LanguageContext);
  const { colors } = useContext(StyleContext);
  const fanMadeContentSetting = useSettingValue('custom_content');
  const fanMadeContent = fanMadeContentSetting && !isArkhamDbDeck;
  const cycles = useMemo(() => getCardPoolSections(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  );
  const packsByName = usePackNames();

  return useMemo(() => {
    const result: Item<string>[] = [];
    if (mode === 'legacy') {
      return [];
    }
    if (mode === 'current') {
      // Current is a fixed pool — all items are display-only (disabled + selected)
      result.push({ type: 'header', title: t`Core set` });
      result.push({
        title: packsByName.core_2026,
        iconNode: <EncounterIcon encounter_code="core_2026" size={28} color={colors.D20} pack />,
        value: 'core_2026',
        selected: true,
        disabled: true,
      });
      result.push({ type: 'header', title: t`Investigator decks` });
      forEach(POOL_INVESTIGATOR_CH2_PACKS, pack => {
        result.push({
          title: packsByName[pack],
          iconNode: <EncounterIcon encounter_code={pack} size={28} color={colors.D20} pack />,
          value: pack,
          selected: true,
          disabled: true,
        });
      });
      result.push({ type: 'header', title: t`Recent releases` });
      result.push({ type: 'placeholder', title: t`None released yet` });
      return result;
    }
    forEach(cycles, cycle => {
      if (cycle.fanMade && !fanMadeContent) {
        return;
      }
      if (mode === 'limited' && cycle.custom) {
        // In limited mode, investigator packs are handled as selectable cycle items below
        return;
      }
      if (mode === 'limited' && cycle.fanMade) {
        // Fan-made cycles are folded into the main Cycles section (no separate header),
        // so the max: 3 limit applies to them too
        forEach(cycle.packs, pack => {
          result.push({
            title: packsByName[pack],
            iconNode: <EncounterIcon encounter_code={pack} size={28} color={colors.D20} pack />,
            value: pack,
          });
        });
        return;
      }
      result.push({
        type: 'header',
        title: cycle.type === 'limited' && mode === 'limited' ? t`Cycles (select 3)` : cycle.section,
        max: cycle.type === 'limited' && mode === 'limited' ? 3 : undefined,
      });
      forEach(cycle.packs, pack => {
        result.push({
          title: packsByName[pack],
          iconNode: <EncounterIcon encounter_code={pack} size={28} color={colors.D20} pack />,
          value: pack,
          selected: (cycle.custom && mode !== 'custom') ? true : undefined,
          disabled: (cycle.custom && mode !== 'custom') ? true : undefined,
        });
      });
    });
    if (mode === 'limited') {
      result.push({ type: 'header', title: t`Investigator decks` });
      result.push({
        title: t`Investigator Starter Decks`,
        description: t`Chapter 1`,
        iconNode: <EncounterIcon encounter_code="nat" size={28} color={colors.D20} pack />,
        value: POOL_INVESTIGATOR_CYCLE,
      });
      result.push({
        title: t`Investigator Decks`,
        description: t`Chapter 2`,
        iconNode: <EncounterIcon encounter_code="and" size={28} color={colors.D20} pack />,
        value: POOL_INVESTIGATOR_CH2_CYCLE,
      });
    }
    return result;
  }, [cycles, packsByName, fanMadeContent, mode, colors]);
}

type CardPoolButtonLabelResult = ({
  label: string;
  labelNode?: undefined;
} | {
  label?: undefined;
  labelNode: React.ReactNode;
}) & {
  error?: string;
}

function LabelWithEncounterIcons({ label, packs }: { label: string; packs: string[] }) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={[typography.large, { color: colors.D30 }, space.paddingRightS]}>{label}</Text>
      { map(packs, pack => (
        <View key={pack} style={space.paddingRightS}>
          <EncounterIcon encounter_code={pack} size={18} color={colors.D30} pack />
        </View>
      )) }
    </View>
  );
}

function useCardPoolButtonLabel(mode: CardPoolMode, selectedPacks: Set<string>): CardPoolButtonLabelResult {
  const { lang } = useContext(LanguageContext);
  const cycles = useMemo(() => getCardPoolSections(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  );
  switch (mode) {
    case 'limited':
      const limitedCycle = cycles.find(cycle => cycle.type === 'limited');
      const allLimitedPacks = [
        ...(limitedCycle?.packs ?? []),
        ...cycles.filter(cycle => cycle.fanMade).flatMap(c => c.packs),
      ];
      const limitedPacks = filter(allLimitedPacks, pack => selectedPacks.has(pack));
      const error = limitedPacks.length === 3 ? undefined : limitedPacks.length < 3 ? t`Limited: Not enough cycles selected` : t`Limited: Too many cycles selected`;
      return {
        labelNode: <LabelWithEncounterIcons label={t`Limited:`} packs={limitedPacks} />,
        error,
      };
    case 'custom':
      return {
        label: t`Custom: ${selectedPacks.size} packs selected`,
      };
    case 'current': {
      return {
        label: cardPoolModeLabel('current'),
      };
    }
    case 'legacy':
      return {
        label: cardPoolModeLabel(mode),
      };
  }
}


const INVESTIGATOR_PACK_SET = new Set([...POOL_INVESTIGATOR_PACKS, ...POOL_INVESTIGATOR_CH2_PACKS]);

export function useCardPoolViewDialog(selectedPacks: string[]): [React.ReactNode, () => void] {
  // Always use 'custom' mode so all cycle sections are visible for filtering
  const allItems = usePackCycles('custom');
  const packsByName = usePackNames();
  const { colors } = useContext(StyleContext);

  // Expand virtual cycle codes (e.g. cycle:investigator → individual pack codes)
  const expandedSelectedPackSet = useMemo(() => {
    const result = new Set<string>();
    for (const pack of selectedPacks) {
      result.add(pack);
      for (const expanded of expandPackCode(pack)) {
        result.add(expanded);
      }
    }
    return result;
  }, [selectedPacks]);

  const selectedItems = useMemo(() => {
    const result: Item<string>[] = [];

    // Sections (cycles etc.), skipping investigator packs handled separately below
    // and skipping section headers with no selected packs
    let pendingHeader: Item<string> | undefined;
    for (const item of allItems) {
      if (item.type === 'header') {
        pendingHeader = item;
      } else if (item.type === 'placeholder' || (!INVESTIGATOR_PACK_SET.has(item.value) && expandedSelectedPackSet.has(item.value))) {
        if (pendingHeader) {
          result.push(pendingHeader);
          pendingHeader = undefined;
        }
        result.push(item);
      }
    }

    // Investigator decks section (ch1 + ch2) at the bottom, handled separately since ch2 isn't in getCardPoolSections
    const hasInvestigatorPacks = POOL_INVESTIGATOR_PACKS.some(p => expandedSelectedPackSet.has(p));
    const hasCh2InvestigatorPacks = POOL_INVESTIGATOR_CH2_PACKS.some(p => expandedSelectedPackSet.has(p));
    if (hasInvestigatorPacks || hasCh2InvestigatorPacks) {
      result.push({ type: 'header', title: t`Investigator decks` });
      const investigatorPacks = [
        ...(hasInvestigatorPacks ? POOL_INVESTIGATOR_PACKS : []),
        ...(hasCh2InvestigatorPacks ? POOL_INVESTIGATOR_CH2_PACKS : []),
      ];
      for (const pack of investigatorPacks) {
        result.push({
          title: packsByName[pack] ?? pack,
          iconNode: <EncounterIcon encounter_code={pack} size={28} color={colors.D20} pack />,
          value: pack,
        });
      }
    }
    return result;
  }, [allItems, expandedSelectedPackSet, packsByName, colors]);

  const content = useMemo(() => (
    <View>
      {map(selectedItems, (item, idx) => item.type === 'header' ? (
        <DeckBubbleHeader title={item.title} key={idx} />
      ) : (
        <LineItem
          key={idx}
          iconNode={item.type === 'placeholder' ? undefined : item.iconNode}
          text={item.title}
          showDisabledIcons
          last={idx === selectedItems.length - 1 || selectedItems[idx + 1]?.type === 'header'}
        />
      ))}
    </View>
  ), [selectedItems]);

  const { dialog, showDialog } = useDialog({
    title: t`Card pool`,
    description: t`This draft uses the deck's selected card pool.`,
    allowDismiss: true,
    content,
    alignment: 'bottom',
  });
  return [dialog, showDialog];
}

export default function DeckCardPoolButton({ first, last, selectedPacks, setSelectedPacks, cardPool, setCardPool, isArkhamDbDeck }: Props) {
  const { typography } = useContext(StyleContext);
  const packInCollection = useSelector(getPacksInCollection);
  const cardPoolItems: Item<CardPoolMode>[] = useMemo(() => {
    return ALL_CARD_POOLS.map(cardPool => ({
      title: cardPoolModeLabel(cardPool),
      description: cardPoolDescription(cardPool),
      value: cardPool,
    }));
  }, []);
  const onCardPoolChange = useCallback((newCardPool: CardPoolMode) => {
    if (cardPool !== newCardPool) {
      setSelectedPacks(defaultCardPoolSet(newCardPool, packInCollection))
    };
    setCardPool(newCardPool);
  }, [cardPool, setCardPool, setSelectedPacks, packInCollection])
  const cardPoolHeader = useMemo(() => {
    return (
      <>
        <Text style={typography.text}>
          {t`This is an optional variant that push players to build their decks creatively using a smaller cardpool.`}
        </Text>
        { map(cardPoolItems, (item, idx) => item.type === 'header' ? (
          <DeckBubbleHeader title={item.title} key={idx} />
        ) : item.type === 'placeholder' ? (
          <NewDialog.PickerItem
            key={idx}
            text={item.title}
            selected={cardPool === item.value}
            last={idx === cardPoolItems.length - 1 || cardPoolItems[idx + 1].type === 'header'}
          />
        ) : (
          <NewDialog.PickerItem
            key={idx}
            iconName={item.icon}
            iconNode={item.iconNode}
            text={item.title}
            description={item.description}
            value={item.value}
            disabled={item.disabled}
            rightNode={item.rightNode}
            onValueChange={onCardPoolChange}
            selected={cardPool === item.value}
            last={idx === cardPoolItems.length - 1 || cardPoolItems[idx + 1].type === 'header'}
          />
        )) }
      </>
    )
  }, [cardPool, cardPoolItems, onCardPoolChange, typography]);

  const onPackChanged = useCallback((pack: string, selected: boolean) => {
    setSelectedPacks(current => {
      if (selected) {
        let toRemove: Set<string> = new Set();
        switch (pack) {
          case 'core':
            toRemove = new Set(['rcore', 'core_2026']);
            break;
          case 'rcore':
            toRemove = new Set(['core', 'core_2026']);
            break;
          case 'core_2026':
            toRemove = new Set(['core', 'rcore']);
            break;
        }
        const newPacks = uniq([...current, pack]);
        if (toRemove.size) {
          return filter(newPacks, p => !toRemove.has(p));
        }
        return newPacks;
      }
      if (pack === 'core' || pack === 'rcore' || pack === 'core_2026') {
        return current;
      }
      // When deselecting an investigator cycle, ensure the other is selected
      if (pack === POOL_INVESTIGATOR_CYCLE) {
        const without = current.filter(p => p !== pack);
        return without.includes(POOL_INVESTIGATOR_CH2_CYCLE) ? without : [...without, POOL_INVESTIGATOR_CH2_CYCLE];
      }
      if (pack === POOL_INVESTIGATOR_CH2_CYCLE) {
        const without = current.filter(p => p !== pack);
        return without.includes(POOL_INVESTIGATOR_CYCLE) ? without : [...without, POOL_INVESTIGATOR_CYCLE];
      }
      return current.filter(p => p !== pack);
    });
  }, [setSelectedPacks]);
  const selectedPackSet = useMemo(() => new Set(selectedPacks), [selectedPacks]);
  const packItems = usePackCycles(cardPool, isArkhamDbDeck);
  const { label: packsButtonLabel, labelNode: packsButtonLabelNode, error: packsButtonError } = useCardPoolButtonLabel(cardPool, selectedPackSet);
  const [packDialog, showPackDialog] = useMultiPickerDialog({
    title: t`Select packs`,
    description:
      cardPool === 'limited' ?
        t`Choose a core set and three expansions to use for this limited pool.` :
        cardPool === 'custom' ?
          t`Choose any number of packs to use for this custom pool.` :
          undefined,
    header: cardPoolHeader,
    // error: packsButtonError,
    selectedValues: selectedPackSet,
    items: packItems,
    onValueChange: onPackChanged,
    max: undefined,
  });

  return (
    <>
      <DeckPickerStyleButton
        icon="deck"
        title={t`Card pool`}
        first={first}
        last={last}
        valueLabel={packsButtonError ?? packsButtonLabelNode ?? packsButtonLabel}
        onPress={showPackDialog}
        editable
      />
      {packDialog}
    </>
  );
}

// We derive the card pool mode from the selected packs.
// This is done by checking for set-intersection with the default cardPool set, ignoring the core/rcore choice.
export function useImpliedCardPool(selectedPacks: string[]): CardPoolMode {
  const limitedItems = useMemo(() => getCardPoolSections(), []);
  const limitedPacks = useMemo(() => limitedItems.flatMap(section => section.type === 'limited' ? section.packs : []), [limitedItems]);
  const fanPacks = useMemo(() => limitedItems.flatMap(section => section.fanMade ? section.packs : []), [limitedItems]);

  return useMemo(() => {
    if (!selectedPacks.length) {
      // No packs means legacy, anything goes
      return 'legacy';
    }
    const set = new Set(selectedPacks);
    if (!set.has('core') && !set.has('rcore') && !set.has('core_2026')) {
      // You need a core set unless you are playing custom
      return 'custom';
    }
    const hasAllInvestigatorPacks = POOL_INVESTIGATOR_PACKS.every(pack => set.has(pack)) || set.has(POOL_INVESTIGATOR_CYCLE);
    const hasAllCh2InvestigatorPacks = POOL_INVESTIGATOR_CH2_PACKS.every(pack => set.has(pack)) || set.has(POOL_INVESTIGATOR_CH2_CYCLE);
    if (!hasAllInvestigatorPacks && !hasAllCh2InvestigatorPacks) {
      // To be limited, you need at least one set of investigator packs
      return 'custom';
    }
    const limitedCount = sumBy(limitedPacks, p => set.has(p) ? 1 : 0);
    const fanCount = sumBy(fanPacks, p => set.has(p) ? 1 : 0);
    if (set.has('core_2026') && hasAllCh2InvestigatorPacks && limitedCount === 0 && fanCount === 0) {
      // Right now there are no cycles in the 'current'
      return 'current';
    }
    // if (limitedCount === 3 && fanCount === 0 && POOL_CURRENT_PACKS.every(pack => set.has(pack))) {
    //   // All current packs, no fan packs, and all limited packs means current
    //   return 'current';
    // }
    if (limitedCount + fanCount === 3) {
      // Exactly three cycle packs (limited or fan-made) means limited
      return 'limited';
    }
    // Anything else is custom
    return 'custom';
  }, [selectedPacks, limitedPacks, fanPacks]);
}

export function useDerivedCardPool(meta: DeckMeta, setMeta: (key: keyof DeckMeta, value?: string) => void): {
  selectedPacks: string[];
  setSelectedPacks: (packs: string[] | ((current: string[]) => string[])) => void;
  cardPool: CardPoolMode;
  setCardPool: (mode: CardPoolMode) => void;
} {
  const packInCollection = useSelector(getPacksInCollection);
  const setSelectedPacks = useCallback((arg: string[] | ((current: string[]) => string[])) => {
    const packs = (typeof arg === 'function') ? arg(meta.card_pool ? meta.card_pool.split(',') : []) : arg;
    setMeta('card_pool', packs.length ? packs.join(',') : undefined);
  }, [setMeta, meta.card_pool]);
  const selectedPacks = useMemo(() => {
    return meta.card_pool ? meta.card_pool.split(',') : [];
  }, [meta.card_pool]);

  const impliedCardPool = useImpliedCardPool(selectedPacks);

  const [cardPool, setCardPoolMode] = React.useState<CardPoolMode>(impliedCardPool);
  const setCardPool = useCallback((mode: CardPoolMode) => {
    setCardPoolMode(mode);
    setSelectedPacks(defaultCardPoolSet(mode, packInCollection));
  }, [setSelectedPacks, packInCollection]);
  return {
    cardPool,
    setCardPool,
    selectedPacks,
    setSelectedPacks,
  };
}