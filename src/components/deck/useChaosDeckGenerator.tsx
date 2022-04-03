import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSharedValue } from 'react-native-reanimated';
import { filter, find, forEach } from 'lodash';
import { t } from 'ttag';

import { DeckMeta, Slots } from '@actions/types';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import useSingleCard from '@components/card/useSingleCard';
import { combineQueries, NO_CUSTOM_CARDS_QUERY, NO_DUPLICATES_QUERY, where } from '@data/sqlite/query';
import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import randomDeck from '@lib/randomDeck';
import { CardsMap } from '@data/types/Card';
import specialCards from '@data/deck/specialCards';
import { usePlayerCards, useSettingValue } from '@components/core/hooks';
import { getPacksInCollection } from '@reducers';

interface Props {
  investigatorCode: string;
  meta: DeckMeta;
  tabooSetId: number | undefined;
  enabled: boolean;
  setError: (error: string) => void;
  setSlots: (slots: Slots | undefined) => void;
}

export default function useChaosDeckGenerator({ investigatorCode, meta, enabled, tabooSetId, setSlots, setError }: Props): [() => void, boolean, CardsMap] {
  const [investigator] = useSingleCard(investigatorCode, 'player', tabooSetId);
  const [investigatorBack] = useSingleCard(meta.alternate_back || investigatorCode, 'player', tabooSetId);
  const specialCodes = useMemo(() => {
    return [
      ...(specialCards[meta.alternate_front || investigatorCode]?.front?.codes || []),
      ...(specialCards[meta.alternate_back || investigatorCode]?.back?.codes || []),
    ];
  }, [meta.alternate_back, meta.alternate_front, investigatorCode]);
  const [investigatorSpecialCards] = usePlayerCards(specialCodes, tabooSetId);
  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');

  const query = useMemo(() => {
    if (!investigatorBack || !enabled) {
      return undefined;
    }
    return combineQueries(
      queryForInvestigator(investigatorBack, meta),
      [
        where('c.xp = 0 OR c.xp is null'),
        where('c.extra_xp is null OR c.extra_xp = 0'),
        NO_DUPLICATES_QUERY,
        NO_CUSTOM_CARDS_QUERY,
      ],
      'and'
    );
  }, [investigatorBack, meta, enabled]);
  const [playerCards, loading] = useCardsFromQuery({ query, tabooSetOverride: tabooSetId, guaranteeResults: true });
  const filteredPlayerCards = useMemo(() => {
    return filter(playerCards, c => {
      return !c.has_restrictions && (
        ignore_collection ||
        c.pack_code === 'core' ||
        in_collection[c.pack_code] ||
        !!find(c.reprint_pack_codes, pc => in_collection[pc])
      );
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
  const progress = useSharedValue(0);
  const onPress = useCallback(() => {
    if (investigatorBack && filteredPlayerCards.length) {
      setSlots(undefined);
      const [slots, success] = randomDeck(
        investigatorCode,
        investigatorBack,
        meta,
        filteredPlayerCards,
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
  }, [filteredPlayerCards, progress, investigatorBack,
    in_collection, ignore_collection,
    setError, setSlots,
    meta, tabooSetId, investigatorCode]);

  return [onPress, loading, cards];
}