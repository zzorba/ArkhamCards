import React, { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { forEach, map } from 'lodash';
import PinchZoomView from 'react-native-pinch-zoom-view';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from '@components/nav/types';
import { LocationSetupStep } from '@data/scenario/types';
import LocationCard from './LocationCard';
import { CARD_RATIO } from '@styles/sizes';
import { isTablet } from '@styles/space';

export interface LocationSetupProps {
  step: LocationSetupStep;
}

type Props = LocationSetupProps & NavigationProps;

const TOP_PADDING = 8;
const SIDE_PADDING = 8;
const GUTTER_SIZE = 64;

interface CardSizes {
  cardWidth: number;
  cardHeight: number;
  betweenPadding: number;
}

export default function LocationSetupView({ step: { locations, vertical, horizontal, note, location_names, resource_dividers } }: Props) {
  const { width, height } = useWindowDimensions();
  const rowCount = locations.length;
  const rowSize = locations[0].length;

  const names = useMemo(() => {
    const result: { [code: string]: string | undefined } = {};
    forEach(location_names || [], entry => {
      result[entry.code] = entry.name;
    });
    return result;
  }, [location_names]);

  const heightConstrained: CardSizes = useMemo(() => {
    const cardsPerColumn = rowCount / (vertical === 'half' ? 2 : 1);
    const betweenPadding = horizontal === 'tight' ? 8 : 12;
    const effectiveScreenHeight = height - TOP_PADDING * 2 - GUTTER_SIZE * 2;
    const interCardSpacing = TOP_PADDING * (cardsPerColumn - 1);
    const cardHeight = (effectiveScreenHeight - interCardSpacing) / cardsPerColumn;
    const cardWidth = cardHeight / CARD_RATIO;
    return {
      cardWidth,
      cardHeight,
      betweenPadding,
    };
  }, [vertical, horizontal, rowCount, height]);

  const widthConstrained: CardSizes = useMemo(() => {
    const realCardsPerRow = rowSize / (horizontal === 'half' ? 2 : 1);
    const cardsPerRow = (!isTablet && realCardsPerRow > 3) ? 3.5 : realCardsPerRow;
    const betweenPadding = horizontal === 'tight' ? 8 : 12;
    const effectiveScreenWidth = width - SIDE_PADDING * 2;
    const interCardSpacing = betweenPadding * (cardsPerRow - 1);
    const cardWidth = (effectiveScreenWidth - interCardSpacing) / cardsPerRow;
    const cardHeight = cardWidth * CARD_RATIO;
    return {
      cardWidth,
      cardHeight,
      betweenPadding,
    };
  }, [rowSize, horizontal, width]);

  const cardDimensions = useMemo(() => {
    if (!isTablet) {
      return widthConstrained;
    }
    if (widthConstrained.cardWidth < heightConstrained.cardWidth) {
      return widthConstrained;
    }
    return heightConstrained;
  }, [widthConstrained, heightConstrained]);

  const renderRow = useCallback((locationsRow: string[], rowNumber: number) => {
    const {
      betweenPadding,
      cardWidth,
      cardHeight,
    } = cardDimensions;

    const cardHeightWithPadding = (cardHeight + TOP_PADDING);
    const top = (vertical === 'half' ? (cardHeightWithPadding / 2) * rowNumber : cardHeightWithPadding * rowNumber) + (
      resource_dividers ? 50 * rowNumber : 0
    );
    return map(locationsRow, (item, x) => {
      const cardWidthWithPadding = (cardWidth + betweenPadding);
      const left = (horizontal === 'half' ? (cardWidthWithPadding / 2) * x : cardWidthWithPadding * x) + (
        resource_dividers ? 50 * x : 0
      );
      return (
        <LocationCard
          key={`${rowNumber}x${x}`}
          code={item}
          name={names[item]}
          top={TOP_PADDING + top}
          left={SIDE_PADDING + left}
          height={cardHeight}
          width={cardWidth}
          resource_dividers={resource_dividers ? resource_dividers[rowNumber][x] : undefined}
        />
      );
    });
  }, [vertical, horizontal, cardDimensions, names, resource_dividers]);

  const {
    cardHeight,
  } = cardDimensions;

  const rowHeight = TOP_PADDING * 2 + cardHeight * (locations.length / (vertical === 'half' ? 2 : 1)) + GUTTER_SIZE;
  return (
    <PinchZoomView style={{ width: 500 }}>
      { !!note && (
        <View style={{ width: width }}>
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent text={note} />
          </SetupStepWrapper>
        </View>
      ) }
      <View style={[styles.container, { height: rowHeight }]}>
        { map(locations, renderRow) }
      </View>
    </PinchZoomView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
});
