import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { find, filter, map, shuffle, take, fill } from 'lodash';
import { t } from 'ttag';

import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import { Item, usePickerDialog } from '@components/deck/dialogs';
import space from '@styles/space';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { getTarotCards, TarotCard } from './constants';
import { useToggles } from '@components/core/hooks';
import TarotCardComponent from '@components/card/TarotCardComponent';
import DeckButton from '@components/deck/controls/DeckButton';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import TarotOverlay, { TarotProps } from '@components/core/TarotOverlay';

interface Props {

}

type CardReadingType = 'chaos' | 'balance' | 'choice' | 'observed' | 'damned' | 'custom' | 'fate';

function getLabel(value: CardReadingType) {
  switch (value) {
    case 'chaos': return t`Chaos`;
    case 'balance': return t`Balance`;
    case 'choice': return t`Choice`;
    case 'observed': return t`Observed`;
    case 'damned': return t`Damned`;
    case 'custom': return t`Custom`;
    case 'fate': return t`Fate`;
  }
}

export default function TarotCardReadingView({
  componentId,
}: NavigationProps & Props) {
  const { backgroundStyle, width } = useContext(StyleContext);
  const [selectedValue, setSelectedValue] = useState<CardReadingType>('chaos');
  const items: Item<CardReadingType>[] = useMemo(() => {
    return [
      {
        title: getLabel('chaos'),
        icon: 'log',
        description: t`A single card in a random position.`,
        value: 'chaos',
      },
      {
        title: getLabel('balance'),
        icon: 'log',
        description: t`Two cards, one upright and one reversed.`,
        value: 'balance',
      },
      {
        title: getLabel('choice'),
        icon: 'log',
        description: t`Reveal three upright cards, choose two to reverse.`,
        value: 'choice',
      },
      {
        title: getLabel('fate'),
        icon: 'book',
        description: t`A reading for the full campaign.`,
        value: 'fate',
      },
      {
        title: getLabel('observed'),
        icon: 'card-outline',
        description: t`Choose from three upright cards.`,
        value: 'observed',
      },
      {
        title: getLabel('damned'),
        icon: 'weakness',
        description: t`A single reversed card.`,
        value: 'damned',
      },
      {
        title: getLabel('custom'),
        icon: 'wild',
        description: t`Draw cards in random positions.`,
        value: 'custom',
      },
    ];
  }, []);
  const [tarotCards, setTarotCards] = useState<TarotCard[]>([]);
  const [reversed, , setReversed, resetReversed] = useToggles({});
  const [flipped, toggleFlipped, , resetFlipped] = useToggles({})

  const doTarotDraw = useCallback(() => {
    const allTarotCards = shuffle(getTarotCards());
    resetFlipped({})
    switch (selectedValue) {
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
    }
  }, [selectedValue, resetReversed, setTarotCards, setReversed, setTarotCards, resetFlipped]);
  useEffect(() => {
    setTarotCards([]);
  }, [selectedValue]);
  const [dialog, showDialog] = usePickerDialog({
    title: t`Choose reading type`,
    items,
    selectedValue,
    onValueChange: setSelectedValue,
  });
  const cardWidth = useMemo(() => {
    if (!tarotCards || !tarotCards.length) {
      return 100;
    }
    return 100;
    return Math.max(
      Math.min(width / (selectedValue === 'custom' ? 3 : tarotCards.length), 300),
      200
    );
  }, [width, tarotCards, selectedValue]);

  const showCard = useCallback((id: string) => {
    const card = find(tarotCards, c => c.id === id);
    if (card) {
      const isFlipped = !!flipped[id];
      Navigation.showModal<TarotProps>({
        component: {
          name: 'Tarot',
          passProps: {
            tarot: card,
            flipped: isFlipped,
            inverted: !!reversed[id],
            onFlip: toggleFlipped,
            onInvert: setReversed,
          },
          options: {
            waitForRender: true,
            modalPresentationStyle: Platform.OS === 'ios' ?
              OptionsModalPresentationStyle.fullScreen :
              OptionsModalPresentationStyle.overCurrentContext,
            layout: {
              componentBackgroundColor: 'transparent',
            },
            overlay: {
              interceptTouchOutside: false,
            },
            animations: {
              showModal: {
                sharedElementTransitions: [
                  {
                    fromId: `tarot_${id}_${isFlipped ? 'front' : 'back'}`,
                    toId: `tarot_${id}_${isFlipped ? 'front' : 'back'}_MODAL`,
                    duration: 2000,
                    interpolation: { type: 'accelerate' }
                  },
                ],
              },
              dismissModal: {
                sharedElementTransitions: [
                  {
                    fromId: `tarot_${id}_${isFlipped ? 'front' : 'back'}_MODAL`,
                    toId: `tarot_${id}_${isFlipped ? 'front' : 'back'}`,
                    interpolation: { type: 'accelerate' },
                    duration: 1000,
                  },
                ],
              }
            },
          },
        },
      });
    }
  }, [tarotCards, toggleFlipped, setReversed, flipped, reversed]);

  const onDrawCustom = useCallback(() => {
    const alreadyDrawn = new Set(map(tarotCards, tc => tc.id));
    const allTarotCards = filter(shuffle(getTarotCards()), tc => !alreadyDrawn.has(tc.id));
    const cards = take(allTarotCards, 1)
    setTarotCards([
      ...(tarotCards || []),
      ...cards,
    ]);
    setReversed(cards[0].id, Math.random() < 0.5);
  }, [setTarotCards, tarotCards]);
  return (
    <View style={[{ flex: 1 }, backgroundStyle]}>
      <View style={space.paddingS}>
        <DeckPickerStyleButton
          icon="special_cards"
          title={t`Card Reading`}
          onPress={showDialog}
          first
          last
          editable
          valueLabel={selectedValue ? getLabel(selectedValue) : undefined}
        />
      </View>
      <View style={[space.paddingS, { flexDirection: 'row' }]}>
        <DeckButton
          icon='draft'
          title={tarotCards?.length ? t`Redraw` : t`Draw`}
          onPress={doTarotDraw}
          color={tarotCards?.length ? 'red_outline' : 'red'}
        />
        { (selectedValue === 'custom' && !!tarotCards.length) && (
          <View style={[space.paddingLeftS, { flex: 1 }]}>
            <DeckButton
              icon="addcard"
              title={t`Draw`}
              onPress={onDrawCustom}
            />

          </View>
        )}

      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          backgroundStyle,
          { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', minWidth: width },
        ]}>
        { map(tarotCards, card => (
          <Animated.View key={card.id} entering={SlideInLeft}>
            <TarotCardComponent
              width={cardWidth}
              card={card}
              flipped={!!flipped[card.id]}
              onFlip={showCard}
              inverted={!!reversed[card.id]}
              onInvert={showCard}
            />
          </Animated.View>
        )) }
      </ScrollView>
      { dialog }
    </View>
  )
}
