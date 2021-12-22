import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { filter, flatMap, forEach, keys, map } from 'lodash';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlipCard from 'react-native-flip-card';
import { t, c } from 'ttag';

import { drawWeakness, availableWeaknesses } from '@lib/weaknessHelper';
import { Slots, WeaknessSet } from '@actions/types';
import Card from '@data/types/Card';
import BasicButton from '@components/core/BasicButton';
import ChooserButton from '@components/core/ChooserButton';
import ToggleFilter from '@components/core/ToggleFilter';
import CardDetailComponent from '@components/card/CardDetailView/CardDetailComponent';
import { CARD_RATIO, HEADER_HEIGHT, TABBAR_HEIGHT } from '@styles/sizes';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useWeaknessCards } from '@components/core/hooks';

const PLAYER_BACK = require('../../../assets/player-back.png');

const PADDING = 32;

interface Props {
  componentId: string;
  weaknessSet: WeaknessSet;
  updateDrawnCard: (code: string, assignedCards: Slots) => void;
  playerCount?: number;
  campaignMode?: boolean;
  customHeader?: ReactNode;
  customFlippedHeader?: ReactNode;
  saving?: boolean;
}

function CardImage({ card, width }: { card: Card, width: number }) {
  if (card.imagesrc) {
    return (
      <FastImage
        style={styles.verticalCardImage}
        source={{
          uri: `https://arkhamdb.com/${card.imagesrc}`,
        }}
        resizeMode="contain"
      />
    );
  }
  return (
    <View style={styles.singleCardWrapper}>
      <CardDetailComponent
        card={card}
        width={width}
        showSpoilers
      />
    </View>
  );
}

export default function WeaknessDrawComponent({ componentId, weaknessSet, updateDrawnCard, playerCount, campaignMode, customHeader, customFlippedHeader, saving }: Props) {
  const { colors, typography, width, height } = useContext(StyleContext);
  const [headerHeight, setHeaderHeight] = useState(32);
  const [flippedHeaderHeight, setFlippedHeaderHeight] = useState(32);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [standalone, setStandalone] = useState(false);
  const [multiplayer, setMultiplayer] = useState(playerCount !== 1);
  const [flipped, setFlipped] = useState(false);
  const flippedRef = useRef(flipped);
  flippedRef.current = flipped;
  const [drawNewCard, setDrawNewCard] = useState(false);
  const weaknessCards = useWeaknessCards();
  const [nextCard, setNextCard] = useState<Card | undefined>();
  useEffect(() => {
    FastImage.preload(
      flatMap(weaknessCards, c => {
        if (!c.imagesrc) {
          return [];
        }
        return {
          uri: `https://arkhamdb.com/${c.imagesrc}`,
        };
      })
    );
  }, [weaknessCards]);

  const [cardWidth, cardHeight] = useMemo(() => {
    const wBasedWidth = width - PADDING * 2;
    const wBasedHeight = Math.round(wBasedWidth * CARD_RATIO);

    const hBasedHeight = height - HEADER_HEIGHT - TABBAR_HEIGHT - PADDING * 2 - headerHeight;
    const hBasedWidth = Math.round(hBasedHeight / CARD_RATIO);

    if (hBasedHeight < wBasedHeight) {
      return [hBasedWidth, hBasedHeight];
    }
    return [wBasedWidth, wBasedHeight];
  }, [width, height, headerHeight]);

  const onFlippedHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setFlippedHeaderHeight(event.nativeEvent.layout.height);
  }, [setFlippedHeaderHeight]);
  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, [setHeaderHeight]);

  const drawAnother = useCallback(() => {
    setFlipped(false);
  }, [setFlipped]);

  const getNextCard = useCallback(() => {
    if (!weaknessCards) {
      return undefined;
    }
    const card = drawWeakness(
      weaknessSet,
      weaknessCards,
      {
        traits: selectedTraits,
        multiplayer,
        standalone,
      },
      false
    );
    return card;
  }, [weaknessCards, selectedTraits, multiplayer, standalone, weaknessSet]);

  const hasWeakness = useMemo(() => getNextCard() !== undefined, [getNextCard]);

  const flipCard = useCallback(() => {
    if (!flipped && !drawNewCard) {
      const theNextCard = getNextCard();
      if (theNextCard) {
        const newAssignedCards = { ...weaknessSet.assignedCards };
        if (!newAssignedCards[theNextCard.code]) {
          newAssignedCards[theNextCard.code] = 0;
        }
        newAssignedCards[theNextCard.code]++;

        setNextCard(theNextCard);
        setFlipped(true);
        updateDrawnCard(theNextCard.code, newAssignedCards);
      }
    }
  }, [flipped, drawNewCard, updateDrawnCard, weaknessSet.assignedCards, getNextCard, setFlipped]);


  const selectNextCard = useCallback(() => {
    setDrawNewCard(false);
  }, [setDrawNewCard]);

  const onFlipEnd = useCallback(() => {
    if (!flippedRef.current) {
      setTimeout(selectNextCard, 0);
    }
  }, [selectNextCard]);

  const allTraits = useMemo(() => {
    const traitsMap: { [trait: string]: number } = {};
    if (!weaknessCards) {
      return [];
    }
    forEach(
      availableWeaknesses(weaknessSet, weaknessCards),
      card => {
        if (card.traits) {
          forEach(
            filter<string>(map(card.traits.split('.'), t => t.trim()), t => !!t),
            t => {
              traitsMap[t] = 1;
            });
        }
      }
    );
    forEach(selectedTraits, trait => {
      traitsMap[trait] = 1;
    });
    return keys(traitsMap).sort();
  }, [weaknessSet, weaknessCards, selectedTraits]);

  const onToggleChange = useCallback((key: string, value: boolean) => {
    if (key === 'multiplayer') {
      setMultiplayer(value);
    } else if (key === 'standalone') {
      setStandalone(value);
    }
  }, [setMultiplayer, setStandalone]);

  const headerContent = useMemo(() => {
    if (saving) {
      return (
        <View style={[styles.buttonWrapper, { height: headerHeight }]}>
          <Text style={typography.text}>{ t`Saving` }</Text>
          <ActivityIndicator
            style={[{ height: 80 }]}
            color={colors.lightText}
            size="small"
            animating
          />
        </View>
      );
    }
    if (flipped) {
      const buttonText = customFlippedHeader ?
        t`Draw a Different Weakness` :
        t`Draw Another`;
      return (
        <View
          onLayout={onFlippedHeaderLayout}
          style={[styles.buttonWrapper, { minHeight: flippedHeaderHeight }]}
        >
          <BasicButton
            title={buttonText}
            onPress={drawAnother}
          />
          { customFlippedHeader }
        </View>
      );
    }
    return (
      <View onLayout={onHeaderLayout}>
        { customHeader }
        <ChooserButton
          componentId={componentId}
          title={t`Traits`}
          all={c('Traits').t`All`}
          values={allTraits}
          selection={selectedTraits}
          onChange={setSelectedTraits}
        />
        <View style={styles.toggleRow}>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label={t`Multiplayer`}
              setting="multiplayer"
              value={multiplayer}
              onChange={onToggleChange}
            />
          </View>
          <View style={styles.toggleColumn}>
            { !campaignMode && (
              <ToggleFilter
                label={t`Standalone`}
                setting="standalone"
                value={standalone}
                onChange={onToggleChange}
              />
            ) }
          </View>
        </View>
      </View>
    );
  }, [componentId, customHeader, customFlippedHeader, saving, campaignMode, onToggleChange,
    allTraits, colors, drawAnother, onFlippedHeaderLayout, onHeaderLayout, typography,
    selectedTraits, flipped, headerHeight, flippedHeaderHeight, standalone, multiplayer]);

  const cardSection = useMemo(() => {
    if (hasWeakness) {
      return (
        <View style={styles.singleCardWrapper}>
          <TouchableWithoutFeedback onPress={flipCard} delayPressIn={0}>
            <FlipCard
              style={[styles.flipCard, {
                width: cardWidth,
                height: cardHeight,
              }]}
              friction={6}
              perspective={1000}
              flipHorizontal
              flipVertical={false}
              flip={flipped}
              clickable={false}
              onFlipEnd={onFlipEnd}
            >
              <FastImage
                style={styles.verticalCardImage}
                source={PLAYER_BACK}
                resizeMode="contain"
              />
              { nextCard && <CardImage card={nextCard} width={cardWidth} /> }
            </FlipCard>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    if (selectedTraits.length) {
      return (
        <Text style={[typography.text, space.marginTopS]}>
          { t`There are no weaknesses that match these trait filters left in the set.\n\nPlease adjust the trait filter.` }
        </Text>
      );
    }
    return (
      <Text style={[typography.text, space.marginTopS]}>
        { t`All weaknesses have been drawn.` }
      </Text>
    );
  }, [cardWidth, cardHeight, flipped, nextCard, typography, selectedTraits, hasWeakness, flipCard, onFlipEnd]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        { headerContent }
      </View>
      { cardSection }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toggleRow: {
    marginTop: xs,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  toggleColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  buttonWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: s,
  },
  verticalCardImage: {
    width: '100%',
    height: '100%',
  },
  singleCardWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipCard: {
    borderWidth: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
