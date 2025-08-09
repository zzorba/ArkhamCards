import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter, find, flatMap, forEach, map, mapValues, sumBy, throttle, uniq, uniqBy } from 'lodash';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t, useLocale } from 'ttag';

import { TouchableOpacity } from '@components/core/Touchables';
import RequiredCardSwitch from './RequiredCardSwitch';
import { showCard, showCardSwipe, showDeckModal } from '@components/nav/helper';
import useNetworkStatus from '@components/core/useNetworkStatus';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import { saveNewDeck } from '@components/deck/actions';
import { NavigationProps } from '@components/nav/types';
import { CampaignId, Deck, DeckMeta, EditDeckState, getDeckId, ParsedDeck, Slots } from '@actions/types';
import { BASIC_WEAKNESS_CHOICE, CUSTOM_INVESTIGATOR, getCardPoolSections, getSpecialPackNames, RANDOM_BASIC_WEAKNESS } from '@app_constants';
import Card, { CardsMap } from '@data/types/Card';
import { AppState, getAllRealPacks, getPacksInCollection } from '@reducers';
import space, { m, s } from '@styles/space';
import COLORS from '@styles/colors';
import starterDecks from '@data/deck/starterDecks';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationButtonPressed, useParallelInvestigator, useSettingValue, useTabooSetId } from '@components/core/hooks';
import { ThunkDispatch } from 'redux-thunk';
import DeckMetadataControls from '../controls/DeckMetadataControls';
import DeckPickerStyleButton from '../controls/DeckPickerStyleButton';
import DeckSectionBlock from '../section/DeckSectionBlock';
import DeckCheckboxButton from '../controls/DeckCheckboxButton';
import DeckButton from '../controls/DeckButton';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { Item, useAlertDialog, useMultiPickerDialog, usePickerDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import InvestigatorSummaryBlock from '@components/card/InvestigatorSummaryBlock';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { useDeckActions } from '@data/remote/decks';
import useSingleCard from '@components/card/useSingleCard';
import { useCardMap } from '@components/card/useCardList';
import specialMetaSlots, { ensureConsistentMeta } from '@data/deck/specialMetaSlots';
import useChaosDeckGenerator from '../useChaosDeckGenerator';
import { parseDeck } from '@lib/parseDeck';
import useParsedDeckComponent from '../useParsedDeckComponent';
import LanguageContext from '@lib/i18n/LanguageContext';
import { DeckEditContextProvider } from '../DeckEditContext';
import EncounterIcon from '@icons/EncounterIcon';

export interface NewDeckOptionsProps {
  investigatorId: string;
  campaignId: CampaignId | undefined;
  onCreateDeck?: (deck: Deck) => void;
  isModal?: boolean;
  alternateInvestigatorId?: string;
}

type Props = NavigationProps &
  NewDeckOptionsProps &
  LoginStateProps;

type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

type SpecialDeckMode = 'none' | 'starter' | 'chaos';
type CardPoolMode = 'legacy' | 'current' | 'limited' | 'custom';

function specialDeckModeLabel(mode: SpecialDeckMode): string {
  switch (mode) {
    case 'none': return t`None`;
    case 'starter': return t`Starter deck`;
    case 'chaos': return t`Ultimatum of Chaos`;
  }
}

function cardPoolModeLabel(mode: CardPoolMode): string {
  switch (mode) {
    case 'legacy': return t`Legacy`;
    case 'current': return t`Current`;
    case 'limited': return t`Limited`;
    case 'custom': return t`Custom`;
  }
}

function cardPoolSet(mode: CardPoolMode, hasRevisedCore: boolean): string[] {
  switch (mode) {
    case 'legacy': return [];
    case 'current': return [hasRevisedCore ? 'rcore' : 'core','tdcp','fhvp','tskp','nat','har','win','jac','ste'];
    case 'limited': return [hasRevisedCore ? 'rcore' : 'core', 'nat', 'har', 'win', 'jac', 'ste'];
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

function ChaosDeckPreview({ componentId, parsedDeck, meta, cards, tabooSetId }: {
  componentId: string; meta: DeckMeta; parsedDeck: ParsedDeck; cards: CardsMap; tabooSetId: number | undefined }) {
  const [parsedDeckComponent] = useParsedDeckComponent({
    componentId,
    meta,
    parsedDeck,
    mode: 'view',
    cards,
    tabooSetId,
    visible: true,
  });
  return <>{parsedDeckComponent}</>;
}

function usePackNames(): { [code: string]: string } {
  const { lang } = useContext(LanguageContext);
  const packs = useSelector(getAllRealPacks);
  const specialPackNames = useMemo(
    () => getSpecialPackNames(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );
  return useMemo(() => {
    const result: { [code: string]: string } = {
      ...specialPackNames,
    };
    forEach(packs, pack => {
      if (pack.name) {
        result[pack.code] = pack.name;
      }
    });
    return mapValues(result, name => name.replace(t`Investigator Expansion`, ''));
  }, [packs, specialPackNames]);

}

function usePackCycles(mode: CardPoolMode): Item<string>[] {
  const { lang } = useContext(LanguageContext);
  const { colors } = useContext(StyleContext);
  const fanMadeContent = useSettingValue('custom_content');
  const cycles = useMemo(() => getCardPoolSections(lang), [lang]);
  const packsByName = usePackNames();

  return useMemo(() => {
    const result: Item<string>[] = [];
    forEach(cycles, cycle => {
      if (cycle.fanMade && !fanMadeContent) {
        return;
      }
      if (cycle.custom && mode !== 'custom') {
        return;
      }
      result.push({
        type: 'header',
        title: cycle.section,
      });
      forEach(cycle.packs, pack => {
        result.push({
          title: packsByName[pack],
          iconNode: <EncounterIcon encounter_code={pack} size={28} color={colors.D10} />,
          value: pack,
        });
      });
    });
    return result;
  }, [cycles, packsByName, fanMadeContent, mode, colors]);
}


function useCardPoolButtonLabel(mode: CardPoolMode, selectedPacks: Set<string>): [string, string | undefined] {
  const { lang, listSeperator } = useContext(LanguageContext);
  const cycles = useMemo(() => getCardPoolSections(lang), [lang]);
  const packNames = usePackNames();
  switch (mode) {
    case 'limited':
      const coreSet = selectedPacks.has('rcore') ? 'Revised Core' : 'Core';
      const limitedCycle = cycles.find(cycle => cycle.type === 'limited');
      if (!limitedCycle) {
        return [t`Limited: ${selectedPacks.size} packs selected`, undefined];
      }
      const limitedPacks = [
        coreSet,
        ...flatMap(filter(limitedCycle.packs, pack => selectedPacks.has(pack)), pack => packNames[pack] ?? []),
      ];
      const error = limitedPacks.length === 4 ? undefined : limitedPacks.length < 4 ? t`Not enough cycles selected` : t`Too many cycles selected`;
      const limitedPacksStr = limitedPacks.join(listSeperator);
      return [t`Limited: ${limitedPacksStr}`, error];
    case 'custom':
      return [t`Custom: ${selectedPacks.size} packs selected`, undefined];
    default:
      return ['', undefined];
  }
}

function NewDeckOptionsDialog({
  investigatorId,
  onCreateDeck,
  campaignId,
  componentId,
  signedIn,
  login,
  isModal,
  alternateInvestigatorId,
}: Props) {
  const deckActions = useDeckActions();
  const defaultTabooSetId = useTabooSetId();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected, networkType }, refreshNetworkStatus] = useNetworkStatus();
  const singleCardView = useSettingValue('single_card');
  const packInCollection = useSelector(getPacksInCollection);
  const { backgroundStyle, colors, fontScale, typography, width, shadow } = useContext(StyleContext);
  const [saving, setSaving] = useState(false);
  const [deckNameChange, setDeckNameChange] = useState<string | undefined>();
  const [offlineDeck, toggleOfflineDeck] = useFlag(
    investigatorId === CUSTOM_INVESTIGATOR ||
    investigatorId.startsWith('z') ||
    !signedIn ||
    !isConnected ||
    networkType === NetInfoStateType.none);
  const [optionSelected, setOptionSelected] = useState<boolean[]>([true]);
  const [tabooSetIdChoice, actuallySetTabooSetId] = useState<number>(defaultTabooSetId);
  const [specialDeckMode, setSpecialDeckMode] = useState<SpecialDeckMode>('none');
  const [cardPool, setCardPool] = useState<CardPoolMode>('current');
  const [selectedPacks, setSelectedPacks] = useState<string[]>(() => cardPoolSet(cardPool, !!packInCollection.rcore));
  const tabooSetId = useMemo(() => {
    if (specialDeckMode === 'starter') {
      return undefined;
    }
    return tabooSetIdChoice;
  }, [specialDeckMode, tabooSetIdChoice]);
  const [chaosSlots, setSlots] = useState<Slots | undefined>(undefined);
  const [metaState, setMetaField] = useReducer((meta: DeckMeta, { key, value }: { key: keyof DeckMeta; value?: string }) => {
    const newMeta = { ...meta, [key]: value };
    if (!newMeta[key]) {
      delete newMeta[key];
    }
    return newMeta;
  }, {
    alternate_back: alternateInvestigatorId,
    alternate_front: alternateInvestigatorId,
  });
  const setTabooSetId = useCallback((tabooSetId: number) => {
    actuallySetTabooSetId(tabooSetId);
    setSlots(undefined);
  }, [actuallySetTabooSetId, setSlots]);
  const setMeta = useCallback((key: keyof DeckMeta, value?: string) => {
    setMetaField({ key, value });
  }, [setMetaField]);
  const updateMeta = useCallback((key: keyof DeckMeta, value?: string) => {
    setMetaField({ key, value });
    setSlots(undefined);
  }, [setMetaField, setSlots]);
  const setParallel = useCallback((front: string, back: string) => {
    if (metaState.alternate_front === front && metaState.alternate_back === back) {
      return;
    }
    setMetaField({ key: 'alternate_front', value: front });
    setMetaField({ key: 'alternate_back', value: back });
    setSlots(undefined);
  }, [setMetaField, setSlots, metaState]);
  const [investigator] = useSingleCard(investigatorId, 'player', tabooSetId);
  const isCustomContent = useMemo(() =>!!(
    investigatorId === CUSTOM_INVESTIGATOR ||
    investigatorId.startsWith('z') ||
    !!investigator?.custom()
  ), [investigator, investigatorId]);
  const [parallelInvestigators] = useParallelInvestigator(investigatorId, tabooSetId);

  const [investigatorFront, investigatorBack] = useMemo(() => [
    metaState.alternate_front && metaState.alternate_back !== investigatorId ? find(parallelInvestigators, c => c.code === metaState.alternate_front) : investigator,
    metaState.alternate_back && metaState.alternate_back !== investigatorId ? find(parallelInvestigators, c => c.code === metaState.alternate_back) : investigator,
  ], [investigator, parallelInvestigators, investigatorId, metaState]);

  useEffect(() => {
    if (investigatorBack?.deck_options) {
      forEach(investigatorBack.deck_options, option => {
        if (option.deck_size_select?.length) {
          if (option.id) {
            if (!metaState[option.id]) {
              updateMeta(option.id, option.deck_size_select[0]);
            }
          } else {
            if (!metaState.deck_size_selected) {
              updateMeta('deck_size_selected', option.deck_size_select[0]);
            }
          }
        }
        if (option.faction_select?.length) {
          if (option.id) {
            if (!metaState[option.id]) {
              updateMeta(option.id, option.faction_select[0]);
            }
          } else {
            if (!metaState.faction_selected) {
              updateMeta('faction_selected', option.faction_select[0]);
            }
          }
        }
        if (option.option_select?.length) {
          if (option.id) {
            if (!metaState[option.id]) {
              updateMeta(option.id, option.option_select[0].id);
            }
          } else {
            if (!metaState.option_selected) {
              updateMeta('option_selected', option.option_select[0].id);
            }
          }
        }
      });
    }
  }, [investigatorBack, metaState, updateMeta]);
  const defaultDeckName = useMemo(() => {
    if (!investigator || !investigator.name) {
      return t`New Deck`;
    }
    switch (investigator.factionCode()) {
      case 'guardian':
        return t`The Adventures of ${investigator.name}`;
      case 'seeker':
        return t`${investigator.name} Investigates`;
      case 'mystic':
        return t`The ${investigator.name} Mysteries`;
      case 'rogue':
        return t`The ${investigator.name} Job`;
      case 'survivor':
        return t`${investigator.name} on the Road`;
      default:
        return t`${investigator.name} Does It All`;
    }
  }, [investigator]);

  const requiredCardCodes = useMemo(() => {
    return [
      RANDOM_BASIC_WEAKNESS,
      ...(investigator?.deck_requirements?.choice?.find(choice => choice.target === 'subtype' && choice.value === 'basicweakness') ? [BASIC_WEAKNESS_CHOICE] : []),
      ...flatMap(investigator?.deck_requirements?.card || [], cardRequirement => {
        return [
          ...(cardRequirement.code ? [cardRequirement.code] : []),
          ...(cardRequirement.alternates || []),
        ];
      }),
    ];
  }, [investigator]);
  const [cards] = useCardMap(requiredCardCodes, 'player', false, tabooSetId);
  const requiredCardOptions = useMemo(() => {
    if (!cards || !investigator) {
      return [];
    }
    const result: Card[][] = [[]];
    forEach(
      investigator.deck_requirements ? investigator.deck_requirements.card : [],
      cardRequirement => {
        const code = cardRequirement.code;
        if (code) {
          const card = cards[code];
          if (card) {
            result[0].push(card);
          }
        }
        if (cardRequirement.alternates && cardRequirement.alternates.length) {
          forEach(cardRequirement.alternates, (altCode, index) => {
            while (result.length <= index + 1) {
              result.push([]);
            }
            const card = cards[altCode];
            if (card) {
              result[index + 1].push(card);
            }
          });
        }
      }
    );
    if (investigator.deck_requirements?.choice) {
      const choiceCard = cards[BASIC_WEAKNESS_CHOICE];
      if (choiceCard) {
        forEach(result, r => r.push(choiceCard));
      }
    }
    return map(result, r => uniqBy(r, x => x.code));
  }, [cards, investigator]);
  const randomWeaknessCount = useMemo(
    () => sumBy(investigator?.deck_requirements?.random, t => t.target === 'subtype' && t.value === 'basicweakness' ? 1 : 0) ?? 0,
    [investigator]
  );

  const meta = useMemo((): DeckMeta =>{
    if (specialDeckMode === 'starter') {
      const starterDeckMeta = investigator && starterDecks.meta[investigator.code];
      if (starterDeckMeta) {
        return starterDeckMeta;
      }
      return {};
    }
    return metaState || {};
  }, [specialDeckMode, metaState, investigator]);

  const requiredSlots: Slots = useMemo(() => {
    if (specialDeckMode === 'starter' && investigator && starterDecks.cards[investigator.code]) {
      return starterDecks.cards[investigator.code] || {};
    }
    const result: Slots = {};
    forEach(investigator?.deck_requirements?.random, random => {
      if (random.target === 'subtype' && random.value === 'basicweakness') {
        result[RANDOM_BASIC_WEAKNESS] = 1 + (result[RANDOM_BASIC_WEAKNESS] ?? 0);
      }
    });
    forEach(investigator?.deck_requirements?.choice, choice => {
      if (choice.target === 'subtype' && choice.value === 'basicweakness') {
        result[BASIC_WEAKNESS_CHOICE] = 1 + (result[BASIC_WEAKNESS_CHOICE] ?? 0);
      }
    });

    // Seed all the 'basic' requirements from the investigator.
    if (cards && investigatorBack && investigatorBack.deck_requirements) {
      forEach(investigatorBack.deck_requirements.card, cardRequirement => {
        const card = cardRequirement.code && cards[cardRequirement.code];
        if (!card) {
          return;
        }
        result[card.code] = card.deck_limit || card.quantity || 0;
      });
    }
    forEach(meta, (value, key) => {
      if (!investigatorBack?.deck_options?.find(option => {
        switch (key) {
          case 'deck_size_selected': return !!option?.deck_size_select?.length;
          case 'faction_selected': return !!option?.faction_select?.length;
          case 'option_selected': return !!option?.option_select?.length;
          case 'alternate_back': return true;
          case 'alternate_front': return true;
          default: return option.id === key;
        }
      })) {
        // Skip it if we don't find a matching option on the current gator.
        return;
      }
      const specialSlots = specialMetaSlots(investigatorId, { key: key as keyof DeckMeta, value });
      if (specialSlots) {
        forEach(specialSlots, (count, code) => {
          if (count > 0) {
            result[code] = count;
          }
        });
      }
    });


    if (optionSelected[0] !== true ||
      sumBy(optionSelected, x => x ? 1 : 0) !== 1) {
      // Now sub in the options that were asked for if we aren't going
      // with the defaults.
      forEach(optionSelected, (include, index) => {
        const cards = requiredCardOptions[index];
        forEach(cards, card => {
          if (include) {
            result[card.code] = card.deck_limit || card.quantity || 0;
          } else if (result[card.code]) {
            delete result[card.code];
          }
        });
      });
    }
    return result;
  }, [cards, meta, investigatorId, optionSelected, requiredCardOptions, investigator, investigatorBack, specialDeckMode]);
  const dispatch: DeckDispatch = useDispatch();
  const showNewDeck = useCallback((deck: Deck) => {
    // Change the deck options for required cards, if present.
    onCreateDeck && onCreateDeck(deck);
    showDeckModal(getDeckId(deck), deck, campaignId, colors, investigator);
    setSaving(false);
  }, [campaignId, onCreateDeck, colors, investigator, setSaving]);
  const createDeck = useCallback((isRetry?: boolean) => {
    const deckName = deckNameChange || defaultDeckName;
    if (investigator && (!saving || isRetry)) {
      const local = (offlineDeck || !signedIn || !isConnected || isCustomContent || networkType === NetInfoStateType.none);
      const slots = {
        ...(specialDeckMode === 'chaos' ? chaosSlots : {}),
        ...requiredSlots,
      };
      setSaving(true);
      setTimeout(() => {
        dispatch(saveNewDeck(userId, deckActions, {
          local,
          meta: ensureConsistentMeta(investigator.code, meta),
          deckName: deckName || t`New Deck`,
          investigatorCode: investigator.code,
          slots,
          tabooSetId,
          problem: specialDeckMode === 'none' ? 'too_few_cards' : undefined,
          tags: investigator.factionCode(),
        })).then(
          showNewDeck,
          () => {
            setSaving(false);
          }
        );
      }, 0);
    }
  }, [signedIn, dispatch, showNewDeck, deckActions, userId, isCustomContent,
    chaosSlots,
    requiredSlots, meta, networkType, isConnected, offlineDeck, saving, specialDeckMode, tabooSetId, deckNameChange, investigator, defaultDeckName]);

  const onOkayPress = useMemo(() => throttle(() => createDeck(), 200), [createDeck]);
  const toggleOptionsSelected = useCallback((index: number, value: boolean) => {
    const updatedOptionSelected = [...optionSelected];
    updatedOptionSelected[index] = value;
    setOptionSelected(updatedOptionSelected);
  }, [optionSelected, setOptionSelected]);

  const [nameDialog, showNameDialog] = useSimpleTextDialog({
    title: t`Name`,
    onValueChange: setDeckNameChange,
    value: deckNameChange || '',
    placeholder: t`Enter a name for this deck.`,
  });
  const [errorDialog, showErrorDialog] = useAlertDialog();
  const setError = useCallback((error: string) => {
    showErrorDialog(t`Unable to generate deck`, error);
  }, [showErrorDialog])

  const specialDeckItems: Item<SpecialDeckMode>[] = useMemo(() => {
    const hasStarterDeck = !!investigatorId && starterDecks.cards[investigatorId] !== undefined;
    const starterDeckItem: Item<SpecialDeckMode>[] = hasStarterDeck ? [{
      title: specialDeckModeLabel('starter'),
      description: t`Suggested starter deck for this investigator from FFG.`,
      value: 'starter',
    }] : [];
    const noUltimatum = false;
    return [
      {
        title: specialDeckModeLabel('none'),
        description: t`An empty deck.`,
        value: 'none',
      },
      ...starterDeckItem,
      {
        title: specialDeckModeLabel('chaos'),
        description: noUltimatum ? t`Sorry, the app cannot generate random decks for this investigator yet.` : t`A fully randomized deck.`,
        disabled: noUltimatum,
        value: 'chaos',
      },
    ];
  }, [investigatorId]);
  const [specialDeckDialog, showSpecialDeckDialog] = usePickerDialog({
    title: t`Special deck`,
    items: specialDeckItems,
    selectedValue: specialDeckMode,
    onValueChange: setSpecialDeckMode,
  });

  const cardPoolItems: Item<CardPoolMode>[] = useMemo(() => {
    const allCardPools: CardPoolMode[] = ['current', 'legacy', 'limited', 'custom'];
    return allCardPools.map(cardPool => ({
      title: cardPoolModeLabel(cardPool),
      description: cardPoolDescription(cardPool),
      value: cardPool,
    }));
  }, []);
  const onCardPoolChange = useCallback((newCardPool: CardPoolMode) => {
    if (cardPool !== newCardPool) {
      setSelectedPacks(cardPoolSet(newCardPool, !!packInCollection.rcore))
    };
    setCardPool(newCardPool);
  }, [cardPool, setCardPool, setSelectedPacks, packInCollection])
  const [cardPoolDialog, showCardPoolDialog] = usePickerDialog({
    title: t`Card pool`,
    description: t`This is an optional variant that push players to build their decks creatively using a smaller cardpool.`,
    items: cardPoolItems,
    selectedValue: cardPool,
    onValueChange: onCardPoolChange,
  });

  const onPackChanged = useCallback((pack: string, selected: boolean) => {
    setSelectedPacks(current => {
      if (selected) {
        const newPacks = uniq([...current, pack]);
        if (pack === 'core' || pack === 'rcore') {
          return filter(newPacks, p => p !== (pack === 'core' ? 'rcore' : 'core'));
        }
        return newPacks;
      }
      const newPacks = current.filter(p => p !== pack);
      if (pack === 'core' || pack === 'rcore') {
        return uniq([...newPacks, pack === 'core' ? 'rcore' : 'core'])
      }
      return newPacks;
    });
  }, [setSelectedPacks]);
  const selectedPackSet = useMemo(() => new Set(selectedPacks), [selectedPacks]);
  const packItems = usePackCycles(cardPool);
  const [packsButtonLabel, packsButtonError] = useCardPoolButtonLabel(cardPool, selectedPackSet);
  const [packDialog, showPackDialog] = useMultiPickerDialog({
    title: t`Select packs`,
    description:
      cardPool === 'limited' ?
        t`Choose a core set and three expansions to use for this limited pool.` :
        t`Choose any number of packs to use for this custom pool.`,
    error: packsButtonError,
    selectedValues: selectedPackSet,
    items: packItems,
    onValueChange: onPackChanged,
  });
  const renderNamePicker = useCallback((last: boolean) => {
    return (
      <>
        <DeckPickerStyleButton
          icon="name"
          title={t`Name`}
          valueLabel={deckNameChange || defaultDeckName}
          onPress={showNameDialog}
          first
          editable
        />
        <DeckPickerStyleButton
          icon="deck"
          title={t`Card pool`}
          valueLabel={cardPoolModeLabel(cardPool)}
          onPress={showCardPoolDialog}
          editable
        />
        { (cardPool === 'limited' || cardPool === 'custom') && (
          <DeckPickerStyleButton
            icon="deck"
            title={t`Packs`}
            valueLabel={packsButtonError ?? packsButtonLabel}
            onPress={showPackDialog}
            editable
          />
        )}
        <DeckPickerStyleButton
          last={last}
          icon="card-outline"
          title={t`Special deck`}
          valueLabel={specialDeckModeLabel(specialDeckMode)}
          onPress={showSpecialDeckDialog}
          editable
        />
      </>
    );
  }, [
    deckNameChange, defaultDeckName, cardPool, specialDeckMode, packsButtonLabel,
    showNameDialog, showSpecialDeckDialog, showCardPoolDialog, showPackDialog,
  ]);

  const onCardPress = useCallback((card: Card) => {
    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        colors,
        { showSpoilers: true, tabooSetId }
      );
      return;
    }
    let index = 0;
    const visibleCards: Card[] = [];
    forEach(requiredCardOptions, requiredCards => {
      forEach(requiredCards, requiredCard => {
        if (card.code === requiredCard.code) {
          index = visibleCards.length;
        }
        if (requiredCard) {
          visibleCards.push(requiredCard);
        }
      });
    });
    showCardSwipe(
      componentId,
      map(visibleCards, card => card.code),
      undefined,
      index,
      colors,
      visibleCards,
      false,
      tabooSetId,
      undefined,
      investigator,
      false
    );
  }, [componentId, requiredCardOptions, colors, investigator, singleCardView, tabooSetId]);
  const [generateChaosDeck, chaosDeckLoading, chaosCards] = useChaosDeckGenerator({
    investigatorCode: investigatorId,
    meta, tabooSetId,
    enabled: specialDeckMode === 'chaos',
    setSlots,
    setError,
    setMeta,
  });
  const { listSeperator } = useContext(LanguageContext);
  const parsedChaosDeck = useMemo(() => {
    if (specialDeckMode !== 'chaos' || !chaosSlots || !investigatorBack) {
      return undefined;
    }
    const slots = {
      ...chaosSlots,
      ...requiredSlots,
    };
    return parseDeck(investigatorBack.code, meta, slots, {}, {}, chaosCards, listSeperator);
  }, [investigatorBack, meta, chaosSlots, requiredSlots, chaosCards, specialDeckMode, listSeperator]);
  const chaosEditState = useMemo(() => {
    if (!parsedChaosDeck) {
      return undefined;
    }
    const edits: EditDeckState = {
      xpAdjustment: 0,
      slots: parsedChaosDeck.slots,
      ignoreDeckLimitSlots: parsedChaosDeck.ignoreDeckLimitSlots,
      side: {},
      meta,
      mode: 'view',
      editable: false,
    };
    return edits;
  }, [parsedChaosDeck, meta]);

  const formContent = useMemo(() => {
    return (
      <>
        <View style={space.paddingS}>
          <DeckMetadataControls
            editable={specialDeckMode !== 'starter'}
            tabooSetId={tabooSetId || 0}
            setTabooSet={setTabooSetId}
            meta={meta}
            showTaboo
            investigatorCode={investigatorId}
            setMeta={updateMeta}
            setParallel={setParallel}
            firstElement={renderNamePicker}
          />
        </View>
        { !(investigatorId === CUSTOM_INVESTIGATOR || investigatorId.startsWith('z')) && (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            { signedIn ? (
              <DeckCheckboxButton
                icon="world"
                title={t`Create on ArkhamDB`}
                description={!!isCustomContent ? t`Note: this deck cannot be uploaded to ArkhamDB because it contains fan-made/preview content.` : undefined}
                value={!isCustomContent && !offlineDeck}
                disabled={!signedIn || isCustomContent || !isConnected || networkType === NetInfoStateType.none}
                onValueChange={toggleOfflineDeck}
                last
              />
            ) : (
              <DeckCheckboxButton
                icon="world"
                title={t`Sign in to ArkhamDB`}
                value={false}
                onValueChange={login}
                last
              />
            ) }
            { (!isConnected || networkType === NetInfoStateType.none) && (
              <TouchableOpacity onPress={refreshNetworkStatus}>
                <View style={[space.paddingS, space.paddingLeftM]}>
                  <Text style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
                    { t`You seem to be offline. Refresh Network?` }
                  </Text>
                </View>
              </TouchableOpacity>
            ) }
          </View>
        ) }
        { !!find(requiredCardOptions, option => option.length > 0) && (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            { specialDeckMode === 'chaos' && !!chaosSlots && !!parsedChaosDeck && !!chaosEditState && (
              <DeckEditContextProvider deckEdits={chaosEditState} investigator={investigatorId} deckId={undefined}>
                <ChaosDeckPreview componentId={componentId} parsedDeck={parsedChaosDeck} meta={meta} cards={chaosCards} tabooSetId={tabooSetId} />
              </DeckEditContextProvider>
            )}
            { specialDeckMode !== 'starter' && (
              <DeckSectionBlock title={t`Required Cards`} faction="neutral">
                { map(requiredCardOptions, (requiredCards, index) => {
                  return (
                    <RequiredCardSwitch
                      key={`${investigatorId}-${index}`}
                      index={index}
                      onPress={onCardPress}
                      disabled={(index === 0 && requiredCardOptions.length === 1)}
                      cards={requiredCards}
                      value={optionSelected[index] || false}
                      onValueChange={toggleOptionsSelected}
                      last={index === (requiredCardOptions.length - 1)}
                      randomBasicWeakness={cards[RANDOM_BASIC_WEAKNESS]}
                      randomBasicWeaknessCount={randomWeaknessCount}
                    />
                  );
                }) }
              </DeckSectionBlock>
            ) }
          </View>
        ) }
      </>
    );
  }, [investigatorId, signedIn, isCustomContent, randomWeaknessCount, cards,
    networkType, isConnected, chaosSlots, specialDeckMode, chaosEditState, chaosCards,
    componentId, parsedChaosDeck,
    offlineDeck, optionSelected, tabooSetId, requiredCardOptions, meta, typography,
    setTabooSetId, onCardPress, toggleOptionsSelected,toggleOfflineDeck,
    login, refreshNetworkStatus, renderNamePicker, setParallel, updateMeta]);

  const cancelPressed = useCallback(() => {
    if (isModal) {
      Navigation.dismissAllModals();
    } else {
      Navigation.pop(componentId);
    }
  }, [isModal, componentId]);
  useNavigationButtonPressed(({ buttonId }) => {
    if ((buttonId === 'back' || buttonId === 'androidBack') && isModal) {
      Navigation.dismissAllModals();
    }
  }, componentId, [isModal]);

  if (!investigator) {
    return null;
  }
  const okDisabled = saving || !(specialDeckDialog === 'starter' || !!find(optionSelected, selected => selected));
  const showRegenerateButton = specialDeckMode === 'chaos' && chaosSlots !== undefined;
  const footerSize = m + NOTCH_BOTTOM_PADDING + (s + 54 * fontScale) * (showRegenerateButton ? 2 : 1);


  if (saving) {
    return (
      <LoadingSpinner large />
    );
  }
  return (
    <SafeAreaView style={[styles.column, { flex: 1 }, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle} keyboardShouldPersistTaps="always">
        <View style={space.paddingS}>
          <InvestigatorSummaryBlock
            investigator={investigatorFront || investigator}
            tabooSetId={tabooSetId}
            investigatorBack={investigatorBack}
          />
        </View>
        { formContent }
        <View style={{ height: footerSize }} />
      </ScrollView>
      <View style={[styles.footer, { height: footerSize, width, backgroundColor: colors.L10 }, shadow.large]}>
        <View style={[styles.column, { position: 'absolute', top: s, left: 0 }]}>
          { showRegenerateButton && (
            <View style={[styles.row, space.paddingBottomS]}>
              <View style={[space.marginLeftS, styles.flex, space.marginRightS]}>
                <DeckButton
                  title={t`Re-generate deck`}
                  icon="card-outline"
                  color="red_outline"
                  loading={chaosDeckLoading}
                  onPress={generateChaosDeck}
                />
              </View>
            </View>
          ) }
          <View style={styles.row}>
            <View style={[space.marginLeftS, styles.flex, space.marginRightS]}>
              <DeckButton
                title={t`Cancel`}
                color="red"
                icon="dismiss"
                onPress={cancelPressed}
              />
            </View>
            <View style={[styles.flex, space.marginRightS]}>
              { specialDeckMode === 'chaos' && chaosSlots === undefined ? (
                <DeckButton
                  title={t`Generate deck`}
                  icon="card-outline"
                  loading={chaosDeckLoading}
                  onPress={generateChaosDeck}
                />
              ) : (
                <DeckButton
                  title={t`Create deck`}
                  icon="plus-button"
                  loading={saving}
                  onPress={okDisabled ? undefined : onOkayPress}
                />
              ) }
            </View>
          </View>
        </View>
      </View>
      { errorDialog }
      { nameDialog }
      { specialDeckDialog }
      { cardPoolDialog }
      { packDialog }
    </SafeAreaView>
  );
}

export default withLoginState<NavigationProps & NewDeckOptionsProps>(
  NewDeckOptionsDialog,
  { noWrapper: true }
);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    paddingTop: s,
    paddingBottom: m + NOTCH_BOTTOM_PADDING,
    left: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
  },
});
