import { useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSharedValue } from 'react-native-reanimated';
import { find, flatMap, forEach, omit } from 'lodash';
import { t } from 'ttag';

import { DeckMeta, Slots } from '@actions/types';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import useSingleCard from '@components/card/useSingleCard';
import { combineQueries, NO_BARKHAM_CARDS_QUERY, NO_CUSTOM_CARDS_QUERY, NO_DUPLICATES_QUERY, where } from '@data/sqlite/query';
import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import randomDeck from '@lib/randomDeck';
import Card, { CardsMap, cardInCollection } from '@data/types/Card';
import specialCards from '@data/deck/specialCards';
import { usePlayerCards, useSettingValue } from '@components/core/hooks';
import { getPacksInCollection } from '@reducers';
import { PARALLEL_JIM_CODE } from '@data/deck/specialMetaSlots';
import { encodeExtraDeckSlots } from '@lib/parseDeck';
import deepEqual from 'deep-equal';

interface Props {
  investigatorCode: string;
  meta: DeckMeta;
  tabooSetId: number | undefined;
  enabled: boolean;
  setMeta: (key: keyof DeckMeta, value: string) => void;
  setError: (error: string) => void;
  setSlots: (slots: Slots | undefined) => void;
}

interface DraftableCardsProps {
  investigatorCode?: string;
  meta?: DeckMeta;
  tabooSetId: number;
  disabled?: boolean;
  in_collection: {
    [pack: string]: boolean;
  };
  ignore_collection: boolean;
  mode?: 'extra';
}

export function useDraftableCards({
  investigatorCode,
  meta,
  tabooSetId,
  disabled,
  in_collection,
  ignore_collection,
  mode,
}: DraftableCardsProps): [
  Card | undefined,
  string[] | undefined,
  CardsMap
] {
  const [investigator] = useSingleCard(investigatorCode, 'player', tabooSetId);
  const [investigatorBack] = useSingleCard(meta?.alternate_back || investigatorCode, 'player', tabooSetId);
  const alternate_front = meta?.alternate_front;
  const alternate_back = meta?.alternate_back;
  const specialCodes = useMemo(() => {
    if (!investigatorCode) {
      return [];
    }
    return [
      ...(specialCards[alternate_front || investigatorCode]?.front?.codes || []),
      ...(specialCards[alternate_back || investigatorCode]?.back?.codes || []),
    ];
  }, [alternate_front, alternate_back, investigatorCode]);
  const [investigatorSpecialCards] = usePlayerCards(specialCodes, tabooSetId);
  const metaRef = useRef<DeckMeta>();
  const cleanMeta = useMemo(() => {
    const partialMeta = omit(meta, 'extra_deck');
    if (!metaRef.current || !deepEqual(metaRef.current, partialMeta)) {
      metaRef.current = partialMeta;
    }
    return metaRef.current;
  }, [meta]);
  const query = useMemo(() => {
    if (!investigatorBack || disabled) {
      return undefined;
    }
    return combineQueries(
      queryForInvestigator(investigatorBack, cleanMeta, undefined, { extraDeck: mode === 'extra'}),
      [
        where('c.xp = 0 OR c.xp is null'),
        where('c.extra_xp is null OR c.extra_xp = 0'),
        NO_DUPLICATES_QUERY,
        ...(investigatorBack.custom() ? [] : [NO_CUSTOM_CARDS_QUERY]),
        ...(investigatorBack.pack_code !== 'zbh' ? [NO_BARKHAM_CARDS_QUERY] : []),
      ],
      'and'
    );
  }, [investigatorBack, mode, cleanMeta, disabled]);
  const [playerCards, loading] = useCardsFromQuery({ query, tabooSetOverride: tabooSetId, guaranteeResults: true });
  const filteredPlayerCodes = useMemo(() => {
    return flatMap(playerCards, c => {
      return !c.has_restrictions && (
        ignore_collection ||
        (c.pack_code === 'core' && !in_collection.no_core) ||
        cardInCollection(c, in_collection)
      ) ? c.code : [];
    });
  }, [playerCards, ignore_collection, in_collection]);
  const cards = useMemo(() => {
    const r: CardsMap = {
      ...investigatorSpecialCards,
    };
    if (investigator) {
      r[investigator.code] = investigator;
    }
    if (investigatorBack) {
      r[investigatorBack.code] = investigatorBack;
    }
    forEach(playerCards, c => {
      r[c.code] = c;
    });
    return r;
  }, [playerCards, investigatorSpecialCards, investigator, investigatorBack]);

  return [investigatorBack, loading ? undefined : filteredPlayerCodes, cards];
}

export default function useChaosDeckGenerator({ investigatorCode, meta, enabled, tabooSetId, setMeta, setSlots, setError }: Props): [() => void, boolean, CardsMap] {
  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');

  const [investigatorBack, possibleCodes, cards] = useDraftableCards({
    investigatorCode,
    meta,
    tabooSetId: tabooSetId || 0,
    disabled: !enabled,
    in_collection,
    ignore_collection,
  });
  const [_, extraPossibleCodes, extraCards] = useDraftableCards({
    investigatorCode,
    meta,
    tabooSetId: tabooSetId || 0,
    disabled: !enabled || meta?.alternate_back !== PARALLEL_JIM_CODE,
    in_collection,
    ignore_collection,
    mode: 'extra',
  });

  const progress = useSharedValue(0);
  const onPress = useCallback(() => {
    if (investigatorBack && possibleCodes?.length) {
      if (meta?.alternate_back === PARALLEL_JIM_CODE && extraPossibleCodes?.length) {
        const [extraSlots, extraSuccess] = randomDeck(
          investigatorCode,
          investigatorBack,
          meta,
          extraPossibleCodes,
          extraCards,
          progress,
          in_collection,
          ignore_collection,
          'extra'
        );
        if (extraSuccess) {
          setMeta('extra_deck', encodeExtraDeckSlots(extraSlots));
        }
      }
      setSlots(undefined);
      const [slots, success] = randomDeck(
        investigatorCode,
        investigatorBack,
        meta,
        possibleCodes,
        cards,
        progress,
        in_collection,
        ignore_collection
      );
      setSlots(success ? slots : undefined);
      if (!success) {
        const remedies: string[] = [
          t`- Adjust your card collection in the app settings.`,
        ];
        if (
          (meta.alternate_front && meta.alternate_front !== investigatorCode) ||
          (meta.alternate_back && meta.alternate_back !== investigatorCode)
        ) {
          remedies.push(t`- Remove the parallel investigator choice, which might require a larger card collection.`);
        }
        if (tabooSetId) {
          remedies.push(t`- Remove the taboo list, which removes some card options.`);
        }
        const remedy = remedies.join('\n');
        setError(t`Unable to build a random deck for this investigator:\n${remedy}`);
      }
    } else {
      setError('Got no investigator or no cards, giving up');
    }
  }, [possibleCodes, cards, progress, investigatorBack,
    in_collection, ignore_collection,
    setError, setSlots, setMeta, extraPossibleCodes,
    meta, tabooSetId, investigatorCode]);
  const allCards = useMemo(() => {
    return {
      ...cards,
      ...extraCards,
    }
  }, [cards, extraCards]);
  return [
    onPress,
    !possibleCodes,
    allCards,
  ];
}