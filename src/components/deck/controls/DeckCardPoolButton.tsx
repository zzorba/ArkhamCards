import { cycleName, getCardPoolSections, POOL_CURRENT_PACKS, POOL_INVESTIGATOR_CYCLE, POOL_INVESTIGATOR_PACKS, specialPacks } from '@app_constants';
import { useSettingValue } from '@components/core/hooks';
import LanguageContext from '@lib/i18n/LanguageContext';
import { getAllRealPacks, getPacksInCollection } from '@reducers/index';
import StyleContext from '@styles/StyleContext';
import { filter, forEach, map, sumBy, uniq } from 'lodash';
import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'ttag';
import { Item, useMultiPickerDialog } from '../dialogs';
import EncounterIcon from '@icons/EncounterIcon';
import { Text, View } from 'react-native';
import DeckBubbleHeader from '../section/DeckBubbleHeader';
import NewDialog from '@components/core/NewDialog';
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

function defaultCardPoolSet(mode: CardPoolMode, hasRevisedCore: boolean): string[] {
  switch (mode) {
    case 'legacy': return [];
    case 'current': return [hasRevisedCore ? 'rcore' : 'core', ...POOL_CURRENT_PACKS, POOL_INVESTIGATOR_CYCLE];
    case 'limited': return [hasRevisedCore ? 'rcore' : 'core', POOL_INVESTIGATOR_CYCLE];
    case 'custom': return [hasRevisedCore ? 'rcore' : 'core'];
  }
}

function cardPoolDescription(mode: CardPoolMode): string {
  switch (mode) {
    case 'legacy': return t`Use all cards from any product`;
    case 'current': return t`Use only cards from recent expansions`;
    case 'limited': return t`Use only cards from your choice of three expansions`;
    case 'custom': return t`Use a completely custom card pool`;
  }
}


function usePackNames(): { [code: string]: string } {
  const packs = useSelector(getAllRealPacks);
  const allSpecialPacks = useMemo(() => filter(specialPacks, sp => sp.player), []);
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

function usePackCycles(mode: CardPoolMode): Item<string>[] {
  const { lang } = useContext(LanguageContext);
  const { colors } = useContext(StyleContext);
  const fanMadeContent = useSettingValue('custom_content');
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
    forEach(cycles, cycle => {
      if (cycle.fanMade && !fanMadeContent) {
        return;
      }
      if (mode === 'current' && cycle.type !== 'core') {
        return;
      }
      result.push({
        type: 'header',
        title: cycle.type === 'limited' && mode === 'limited' ? t`Cycles (select 3)` : cycle.section,
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
      if (!limitedCycle) {
        return { label: t`Limited: ${selectedPacks.size} packs selected` };
      }
      const limitedPacks = filter(limitedCycle.packs, pack => selectedPacks.has(pack));
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
        labelNode: <LabelWithEncounterIcons label={t`Current:`} packs={POOL_CURRENT_PACKS} />,
      };
    }
    case 'legacy':
      return {
        label: cardPoolModeLabel(mode),
      };
  }
}


export default function DeckCardPoolButton({ first, last, selectedPacks, setSelectedPacks, cardPool, setCardPool }: Props) {
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
      setSelectedPacks(defaultCardPoolSet(newCardPool, !!packInCollection.rcore))
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
        const toRemove = pack === 'core' ? 'rcore' : 'core';
        const newPacks = uniq([...current, pack]);
        if (pack === 'core' || pack === 'rcore') {
          return filter(newPacks, p => p !== toRemove);
        }
        return newPacks;
      }
      const newPacks = current.filter(p => p !== pack);
      const toAdd = pack === 'core' ? 'rcore' : 'core';
      if (pack === 'core' || pack === 'rcore') {
        return uniq([...newPacks, toAdd])
      }
      return newPacks;
    });
  }, [setSelectedPacks]);
  const selectedPackSet = useMemo(() => new Set(selectedPacks), [selectedPacks]);
  const packItems = usePackCycles(cardPool);
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
    max: cardPool === 'limited' ? 4 : undefined,
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

export function useDerivedCardPool(meta: DeckMeta, setMeta: (key: keyof DeckMeta, value?: string) => void): {
  selectedPacks: string[];
  setSelectedPacks: (packs: string[] | ((current: string[]) => string[])) => void;
  cardPool: CardPoolMode;
  setCardPool: (mode: CardPoolMode) => void;
} {
  const setSelectedPacks = useCallback((arg: string[] | ((current: string[]) => string[])) => {
    const packs = (typeof arg === 'function') ? arg(meta.card_pool ? meta.card_pool.split(',') : []) : arg;
    setMeta('card_pool', packs.length ? packs.join(',') : undefined);
  }, [setMeta, meta.card_pool]);
  const selectedPacks = useMemo(() => {
    return meta.card_pool ? meta.card_pool.split(',') : [];
  }, [meta.card_pool]);

  const limitedItems = useMemo(() => getCardPoolSections(), []);
  const limitedPacks = useMemo(() => limitedItems.flatMap(section => section.type === 'limited' ? section.packs : []), [limitedItems]);
  const fanPacks = useMemo(() => limitedItems.flatMap(section => section.fanMade ? section.packs : []), [limitedItems]);

  // We derive the card pool mode from the selected packs.
  // This is done by checking for set-intersection with the default cardPool set, ignoring the core/rcore choice.
  const impliedCardPool = useMemo(() => {
    if (!selectedPacks.length) {
      // No packs means legacy, anything goes
      return 'legacy';
    }
    const set = new Set(selectedPacks);
    if (!set.has('core') && !set.has('rcore')) {
      // You need a core set unless you are playing custom
      return 'custom';
    }
    const hasAllInvestigatorPacks = POOL_INVESTIGATOR_PACKS.every(pack => set.has(pack)) || set.has(POOL_INVESTIGATOR_CYCLE);
    if (!hasAllInvestigatorPacks) {
      // To be limited, you need all the investigator packs
      return 'custom';
    }
    const limitedCount = sumBy(limitedPacks, p => set.has(p) ? 1 : 0);
    const fanCount = sumBy(fanPacks, p => set.has(p) ? 1 : 0);
    if (limitedCount === 3 && fanCount === 0 && POOL_CURRENT_PACKS.every(pack => set.has(pack))) {
      // All current packs, no fan packs, and all limited packs means current
      return 'current';
    }
    if (limitedCount === 3 && fanCount === 0) {
      // Exactly three limited packs and no fan packs means limited
      return 'limited';
    }
    // Anything else is custom
    return 'custom';
  }, [selectedPacks, limitedPacks, fanPacks]);

  const [cardPool, setCardPoolMode] = React.useState<CardPoolMode>(impliedCardPool);
  const setCardPool = useCallback((mode: CardPoolMode) => {
    setCardPoolMode(mode);
    setSelectedPacks(defaultCardPoolSet(mode, true));
  }, [setSelectedPacks]);
  return {
    cardPool,
    setCardPool,
    selectedPacks,
    setSelectedPacks,
  };
}