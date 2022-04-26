import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Text, ScrollView, View, Platform } from 'react-native';
import { find, filter, map, shuffle, take, values, sumBy, findIndex, forEach } from 'lodash';
import Carousel from 'react-native-snap-carousel';
import { c, t } from 'ttag';

import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import { Item, useDialog, usePickerDialog } from '@components/deck/dialogs';
import space, { l, m, s } from '@styles/space';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { getTarotCards, TarotCard } from '@app_constants';
import { useSettingValue, useToggles } from '@components/core/hooks';
import TarotCardComponent from '@components/card/TarotCardComponent';
import DeckButton from '@components/deck/controls/DeckButton';
import Animated, { SlideInDown, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { Navigation, OptionsModalPresentationStyle, OptionsTopBar, OptionsTopBarButton } from 'react-native-navigation';
import TarotOverlay, { TarotProps } from '@components/core/TarotOverlay';
import ListToggleButton from '@components/deck/ListToggleButton';
import FastImage from 'react-native-fast-image';
import { TAROT_CARD_RATIO } from '@styles/sizes';
import ArkhamIcon from '@icons/ArkhamIcon';
import AppIcon from '@icons/AppIcon';
import EncounterIcon from '@icons/EncounterIcon';
import { useScenarioNames } from '@data/scenario';
import { useSetCampaignTarotReading } from '@data/remote/campaigns';
import { useDispatch } from 'react-redux';
import { updateTarotReading } from './actions';
import { CampaignId, TarotReading } from '@actions/types';

export type TarotReadingType = 'chaos' | 'balance' | 'choice' | 'observed' | 'damned' | 'custom' | 'destiny';

export interface TarotCardReadingProps {
  id: CampaignId;
  originalReading: TarotReading | undefined;
  scenarios: string[] | undefined;
  readingType: TarotReadingType;
}


export function getTarotReadingLabel(value: TarotReadingType) {
  switch (value) {
    case 'chaos': return c('tarot-reading').t`Chaos`;
    case 'balance': return c('tarot-reading').t`Balance`;
    case 'choice': return c('tarot-reading').t`Choice`;
    case 'destiny': return c('tarot-reading').t`Destiny`;
    case 'observed': return c('tarot-reading').t`Observed`;
    case 'damned': return c('tarot-reading').t`Damned`;
    case 'custom': return c('tarot-reading').t`Custom`;
  }
}

function getTarotReadingDescription(value: TarotReadingType) {
  switch (value) {
    case 'chaos': return t`Reveal the top card in a random orientation. It's effects are active throughout the scenario, and could be positive or negative, depending on its orientation. This reading is ideal if you want to add a splash of chaos to a scenario.`;
    case 'balance': return t`Reveal the top two cards, one in the upright position and one in the reversed position. Their effects are active throughout the scenario. One card has a positive effect, the other has a negative effect. This reading is ideal if you want to add a touch of randomness or replay value to a scenario, but desire a more balanced effect.`;
    case 'choice': return t`Reveal three cards in the upright position. Then, choose and reverse 2 of them. The effects of all 3 cards are active throughout the scenario. One card has a positive effect and the other two negative, but the investigators decide which is which. This reading is ideal if you want to add an element of strategic decision-making during your reading.`;
    case 'destiny': return t`Before starting a campaign, reveal one card for each scenarion in the campaign, ignoring side stories and counting scenarios with multiple parts as separate scenarios. Place each card in a line, in the upright position. Each of these cards applies to one scenario in the campaign. Then, choose and reverse half of the cards (rounded up). This reading is ideal if you want your readings to have long-term consequences and force you to plan ahead.`;
    case 'observed': return t`Draw 3 random cards from the tarot deck and choose 1. Place the chosen card in front of you, in the upright position. Each other investigator ignores its effects.`;
    case 'damned': return t`Draw a random card from the tarot deck and place the chosen card in front of you, in the reverse position. Each other investigator ignores its effects.`;
    case 'custom': return t`There are endless possible readings that you could perform using the Tarot Deck. Feel free to create your own!`;
  }
}

function getTarotReadingInstruction(value: TarotReadingType): string | undefined {
  switch (value) {
    case 'chaos': return undefined;
    case 'balance': return undefined;
    case 'choice': return t`Choose two cards to reverse.`;
    case 'destiny': return t`Reverse half of the cards (rounded up).`;
    case 'observed': return t`Choose one card.`;
    case 'damned': return undefined;
    case 'custom': return t`Draw and reverse cards however you like!`;
  }
}

function navigationOptions(
  {
    lightButton,
  }: {
    lightButton?: boolean;
  }
){
  const rightButtons: OptionsTopBarButton[] = [{
    id: 'grid',
    component: {
      name: 'ListToggleButton',
      passProps: {
        setting: 'card_grid',
        lightButton,
      },
      width: ListToggleButton.WIDTH,
      height: ListToggleButton.HEIGHT,
    },
    accessibilityLabel: t`Grid`,
    enabled: true,
  }];
  const topBarOptions: OptionsTopBar = {
    rightButtons,
  };

  return {
    topBar: topBarOptions,
  };
}

function TarotCardButton({
  card,
  flipped,
  inverted,
  onFlip,
  scenario,
  scenarioName,
  onInvert,
  first,
  last,
  showTarotCard,
}: {
  first: boolean;
  last: boolean;
  card: TarotCard;
  scenario?: string;
  scenarioName?: string;
  flipped: boolean;
  showTarotCard: (id: string) => void;
  onFlip: (id: string) => void;
  inverted: boolean;
  onInvert?: (id: string, inverted: boolean) => void;
}) {
  const { colors } = useContext(StyleContext);
  const onPress = useCallback(() => {
    showTarotCard(card.id);
  }, [card.id, flipped, onFlip, showTarotCard]);
  const [icon, title, valueLabel] = useMemo(() => {
    const scenarioIcon = scenario ? <EncounterIcon encounter_code={scenario} size={24} color={colors.M} /> : undefined;
    if (!flipped) {
      return [
        scenarioIcon || 'special_cards',
        scenario ? (scenarioName || scenario) : t`Reveal`,
        scenario ? t`Reveal` : undefined,
      ];
    }
    if (scenarioIcon) {
      return [
        scenarioIcon,
        scenarioName || scenario || 'scenario',
        inverted ? t`${card.title} - Inverted` : card.title,
      ]
    }
    return [
      <View style={{ transform: [{ rotate: inverted ? '-180deg' : '0deg' }]}}><AppIcon size={24} color={colors.M} name="upgrade" /></View>,
      inverted ? t`Inverted` : t`Upright`,
      card.title
    ];
  }, [inverted, scenarioName, flipped, scenario, inverted, card.title]);
  return (
    <>
      <DeckPickerStyleButton
        first={first}
        last={last}
        theme={inverted ? 'dark' : 'light'}
        editIcon="show"
        icon={icon}
        title={title}
        valueLabel={valueLabel}
        onPress={onPress}
        editable
      />
    </>
  )
}

export function useTarotCardReadingPicker({ value, onValueChange } : {
  value: undefined | TarotReadingType;
  onValueChange: (value: TarotReadingType) => void;
}) {
  const items: Item<TarotReadingType>[] = useMemo(() => {
    return [
      {
        title: getTarotReadingLabel('chaos'),
        icon: 'log',
        description: t`A single card in a random position.`,
        value: 'chaos',
      },
      {
        title: getTarotReadingLabel('balance'),
        icon: 'log',
        description: t`Two cards, one upright and one reversed.`,
        value: 'balance',
      },
      {
        title: getTarotReadingLabel('choice'),
        icon: 'log',
        description: t`Reveal three upright cards, choose two to reverse.`,
        value: 'choice',
      },
      {
        title: getTarotReadingLabel('destiny'),
        icon: 'book',
        description: t`A reading for the full campaign.`,
        value: 'destiny',
      },
      {
        title: getTarotReadingLabel('observed'),
        icon: 'card-outline',
        description: t`Choose from three upright cards.`,
        value: 'observed',
      },
      {
        title: getTarotReadingLabel('damned'),
        icon: 'weakness',
        description: t`A single reversed card.`,
        value: 'damned',
      },
      {
        title: getTarotReadingLabel('custom'),
        icon: 'wild',
        description: t`Draw cards in random positions.`,
        value: 'custom',
      },
    ];
  }, []);
  return usePickerDialog({
    title: t`Choose reading type`,
    items,
    selectedValue: value,
    onValueChange: onValueChange,
  });
}

function TarotCardReadingView({
  componentId,
  scenarios,
  readingType,
  id,
  originalReading,
}: NavigationProps & TarotCardReadingProps) {
  const [savedReading, setSavedReading] = useState(originalReading);
  const [saving, setSaving] = useState(false);
  const { backgroundStyle, colors, height, typography, width } = useContext(StyleContext);
  useEffect(() => {
    Navigation.mergeOptions(componentId, navigationOptions({ lightButton: false }));
  }, [componentId]);
  const cardGrid = useSettingValue('card_grid');

  const [tarotCards, setTarotCards] = useState<TarotCard[]>([]);
  const [reversed, , setReversed, resetReversed] = useToggles({});
  const [flipped, toggleFlipped, , resetFlipped] = useToggles({})

  useEffect(() => {
    const allTarotCards = getTarotCards();
    if (originalReading && readingType === 'destiny') {
      const cards: TarotCard[] = [];
      const flipped: { [code: string]: boolean | undefined } = {};
      const reversed: { [code: string]: boolean | undefined } = {};      forEach(scenarios, scenario => {
        const id = originalReading.cards[scenario];
        if (id) {
          const card = allTarotCards[id];
          if (card) {
            cards.push(card);
            flipped[card.id] = true;
            if (originalReading.inverted[card.id]) {
              reversed[card.id] = true;
            }
          }
        }
      });
      setTarotCards(cards);
      resetFlipped(flipped);
      resetReversed(reversed);
    }
  }, [originalReading, readingType]);

  const doTarotDraw = useCallback(() => {
    const allTarotCards = shuffle(values(getTarotCards()));
    resetFlipped({})
    switch (readingType) {
      case 'chaos': {
        const cards = take(allTarotCards, 1);
        setReversed(cards[0].id, Math.random() < 0.5);
        setTarotCards(cards);
        break;
      }
      case 'balance': {
        const cards = take(allTarotCards, 2);
        setReversed(cards[0].id, false);
        setReversed(cards[1].id, true);
        setTarotCards(cards);
        break;
      }
      case 'choice': {
        const cards = take(allTarotCards, 3);
        resetReversed({});
        setTarotCards(cards);
        break;
      }
      case 'observed': {
        const cards = take(allTarotCards, 3);
        resetReversed({});
        setTarotCards(cards);
        break;
      }
      case 'damned': {
        const cards = take(allTarotCards, 1);
        setReversed(cards[0].id, true);
        setTarotCards(cards);
        break;
      }
      case 'custom': {
        const cards = take(allTarotCards, 1);
        resetReversed({});
        setReversed(cards[0].id, Math.random() < 0.5);
        setTarotCards(cards);
        break;
      }
      case 'destiny': {
        const cards = take(allTarotCards, scenarios?.length || 0);
        resetReversed({});
        setTarotCards(cards);
        break;
      }
    }
  }, [scenarios, readingType, resetReversed, setTarotCards, setReversed, setTarotCards, resetFlipped]);
  const cardWidth = useMemo(() => {
    if (!tarotCards || !tarotCards.length) {
      return 100;
    }
    return Math.max(
      Math.min(width / (readingType === 'custom' ? 3 : tarotCards.length), 300),
      200
    );
  }, [width, tarotCards, readingType]);
  const onDrawCustom = useCallback(() => {
    const alreadyDrawn = new Set(map(tarotCards, tc => tc.id));
    const allTarotCards = filter(shuffle(values(getTarotCards())), tc => !alreadyDrawn.has(tc.id));
    const cards = take(allTarotCards, 1)
    setTarotCards([
      ...(tarotCards || []),
      ...cards,
    ]);
    setReversed(cards[0].id, Math.random() < 0.5);
  }, [setTarotCards, tarotCards]);
  const scenarioNames = useScenarioNames();
  const onInvert = readingType === 'custom' || readingType === 'choice' || readingType === 'destiny' ? setReversed : undefined;


  const [correctNumberReversed, correctReversedMessage] = useMemo(() => {
    if (!!find(tarotCards, card => !flipped[card.id])) {
      return [
        false,
        t`You must flip all cards to reveal your fate.`,
      ];
    }
    const requiredReversedCount = Math.ceil((scenarios?.length || 0) / 2.0);
    const currentReversedCount = sumBy(tarotCards, card => reversed[card.id] ? 1 : 0);
    return [
      readingType === 'destiny' && currentReversedCount === requiredReversedCount,
      currentReversedCount > requiredReversedCount ?
      t`Too many card reversed (${currentReversedCount} / ${requiredReversedCount})` :
      t`Not enough cards reversed (${currentReversedCount} / ${requiredReversedCount})`,
    ];
  }, [readingType, tarotCards, flipped, reversed, scenarios]);

  const dialogCardWidth = useMemo(() => {
    return ((width - s * 4) * TAROT_CARD_RATIO > height * 0.7) ? (
      (height * 0.7) / TAROT_CARD_RATIO
    ) : (width - s * 4);
  }, [width, height]);
  const renderSwipeCard = useCallback(({ item, index, dataIndex }: {
    item: TarotCard;
    index: number;
    dataIndex: number;
  }) => {
    return (
      <View key={item.id} style={[
        space.paddingSideS,
        space.paddingTopM,
        space.paddingBottomM,
        { width: width - s * 2, height: dialogCardWidth * TAROT_CARD_RATIO + m * 2 },
      ]}>
        <TarotCardComponent
          card={item}
          width={dialogCardWidth}
          flipped={!!flipped[item.id]}
          inverted={!!reversed[item.id]}
          onFlip={toggleFlipped}
          onInvert={onInvert}
        />
      </View>
    );
  }, [dialogCardWidth, flipped, reversed, toggleFlipped, onInvert]);
  const [jumpIndex, setJumpIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const content = useMemo(() => {
    if (!tarotCards) {
      return null;
    }
    return (
      <View style={{ width: width - s * 2, height: height * 0.7 + m * 2 }}>
        <Carousel
          itemWidth={dialogCardWidth}
          sliderWidth={width - s * 2}
          itemHeight={dialogCardWidth * TAROT_CARD_RATIO}
          sliderHeight={height * 0.7 + m * 2}
          firstItem={jumpIndex}
          onScrollIndexChanged={setIndex}
          contentContainerCustomStyle={space.paddingSideS}
          useExperimentalSnap={Platform.OS === 'android'}
          renderItem={renderSwipeCard}
          loop
          useScrollView
          disableIntervalMomentum
          data={tarotCards}
        />
      </View>
    );
  }, [tarotCards, dialogCardWidth, renderSwipeCard, jumpIndex, setIndex]);
  const dialogTitle = useMemo(() => {
    if (!tarotCards || index >= tarotCards.length) {
      return t`Loading`;
    }
    const card = tarotCards[index];
    if (readingType === 'destiny' && scenarios) {
      if (index < scenarios.length) {
        return scenarioNames[scenarios[index]] || card?.title;
      }
    }
    return card.title;
  }, [tarotCards, index, readingType, scenarios, scenarioNames]);
  const { dialog, showDialog } = useDialog({
    title: dialogTitle,
    content,
    alignment: 'bottom',
    allowDismiss: true,
    maxHeightPercent: 0.8,
    noPadding: true,
  });

  const showTarotCard = useCallback((id: string) => {
    const index = findIndex(tarotCards, card => card.id === id);
    if (index !== -1) {
      setJumpIndex(index);
      setIndex(index);
      showDialog();
    }
  }, [tarotCards, setIndex, setJumpIndex, showDialog]);
  const instruction = getTarotReadingInstruction(readingType);

  const setCampaignTaroReading = useSetCampaignTarotReading();
  const dispatch = useDispatch();
  const dirty = useMemo(() => {
    if (!savedReading || !tarotCards || !scenarios) {
      return true;
    }

    return !!find(tarotCards, (card, idx) => {
      const scenario = idx < scenarios.length ? scenarios[idx] : undefined;
      return !scenario ||
        !flipped[card.id] ||
        savedReading.cards[scenario] !== card.id ||
        (!!savedReading.inverted[card.id] !== !! reversed[card.id]);
    });
  }, [reversed, flipped, tarotCards, savedReading, scenarios]);
  const onSaveCampaignReading = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      const reading: TarotReading = {
        cards: {},
        inverted: {},
      };
      forEach(scenarios, (scenario, index) => {
        if (tarotCards.length > index) {
          const card = tarotCards[index].id;
          reading.cards[scenario] = card;
          if (reversed[card]) {
            reading.inverted[card] = true;
          }
        }
      });
      dispatch(updateTarotReading(setCampaignTaroReading, id, reading));
      setSavedReading(reading);
      setSaving(false);
    }, 50);
  }, [setCampaignTaroReading, setSaving, setSavedReading,  id, reversed, tarotCards, scenarios, dispatch]);

  return (
    <View style={[{ flex: 1, position: 'relative', flexDirection: 'column', justifyContent: 'flex-start' }, backgroundStyle]}>
      <View style={[space.paddingS, { flexDirection: 'row' }]}>
        <DeckButton
          icon='draft'
          title={tarotCards?.length ? t`Reject fate (redraw)` : t`Draw`}
          onPress={doTarotDraw}
          color={tarotCards?.length ? 'red_outline' : 'red'}
        />
        { (readingType === 'custom' && !!tarotCards.length) && (
          <View style={[space.paddingLeftS, { flex: 1 }]}>
            <DeckButton
              icon="addcard"
              title={t`Draw`}
              onPress={onDrawCustom}
            />
          </View>
        )}
      </View>
      { readingType === 'destiny' && !!tarotCards.length && (
        <View style={space.paddingS}>
          <DeckButton
            shrink
            icon={correctNumberReversed ? 'check-thin' : 'dismiss'}
            title={dirty ? t`Save` : t`Saved`}
            loading={saving}
            color={correctNumberReversed ? 'default' : 'light_gray' }
            detail={!correctNumberReversed ? correctReversedMessage : undefined}
            disabled={!correctNumberReversed}
            onPress={onSaveCampaignReading}
          />
        </View>
      ) }
      { !!instruction && !!tarotCards?.length && (
        <View style={space.paddingS}>
          <Text style={typography.text}>
            { instruction }
          </Text>
        </View>
      ) }
      { cardGrid ? (
        <ScrollView
          horizontal
          style={{ flex: 1 }}
          contentContainerStyle={[
            backgroundStyle,
            { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', minWidth: width },
          ]}>
          { map(tarotCards, (card, idx) => {
            const scenarioCode = readingType === 'destiny' && scenarios && scenarios.length > idx ? scenarios[idx] : undefined;
            return (
              <Animated.View
                key={`grid_${card.id}_${idx}`}
                entering={SlideInLeft}
                exiting={SlideOutRight}
              >
                { !!scenarioCode && (
                  <View style={[space.paddingSideM, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', maxWidth: cardWidth }]}>
                    <View style={space.paddingRightXs}>
                      <EncounterIcon encounter_code={scenarioCode} size={32} color={colors.D20} />
                      </View>
                    <Text style={[typography.gameFont, { flex: 1 }]} numberOfLines={2} ellipsizeMode="tail">
                      { scenarioNames[scenarioCode] || scenarioCode }
                    </Text>
                  </View>
                ) }
                <View style={[space.paddingLeftS, space.paddingTopS]}>
                  <TarotCardComponent
                    width={cardWidth}
                    card={card}
                    flipped={!!flipped[card.id]}
                    onFlip={toggleFlipped}
                    inverted={!!reversed[card.id]}
                    onInvert={onInvert}
                  />
                </View>
              </Animated.View>
            );
          }) }
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            backgroundStyle,
            space.paddingS,
            { flexDirection: 'column' }
          ]}>
            { map(tarotCards, (card, idx) => {
              const scenario = readingType === 'destiny' && scenarios && scenarios.length > idx ? scenarios[idx] : undefined;
              return (
                <Animated.View key={card.id} entering={SlideInLeft} exiting={SlideOutRight}>
                  <TarotCardButton
                    card={card}
                    flipped={!!flipped[card.id]}
                    onFlip={toggleFlipped}
                    showTarotCard={showTarotCard}
                    inverted={!!reversed[card.id]}
                    scenario={scenario}
                    scenarioName={scenario ? scenarioNames[scenario] : undefined}
                    onInvert={onInvert}
                    first={idx === 0}
                    last={idx === tarotCards.length - 1}
                  />
                </Animated.View>
              );
            }) }
          </ScrollView>
      ) }

      { dialog }
    </View>
  )
}

export default TarotCardReadingView;