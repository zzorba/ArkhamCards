import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { forEach, map } from 'lodash';
import PanPinchView from 'react-native-pan-pinch-view';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from '@components/nav/types';
import { LocationSetupStep } from '@data/scenario/types';
import LocationCard from './LocationCard';
import { CARD_RATIO, NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { isTablet } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import CardImageView from '@components/card/CardImageView';

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
  verticalPadding: number;
}

export default function LocationSetupView({ step: { locations, vertical, horizontal, note, location_names, resource_dividers } }: Props) {
  const { width, height } = useContext(StyleContext);
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
      verticalPadding: TOP_PADDING + (resource_dividers ? 50 : 0),
    };
  }, [vertical, horizontal, resource_dividers, rowCount, height]);

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
      verticalPadding: TOP_PADDING + (resource_dividers ? 50 : 0),
    };
  }, [rowSize, horizontal, width, resource_dividers]);

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
    cardWidth,
    betweenPadding,
    verticalPadding,
  } = cardDimensions;

  const rowWidth = (cardWidth + betweenPadding) * ((rowSize + 1) / (horizontal === 'half' ? 2.0 : 1));
  const rowHeight = TOP_PADDING * 2 + (cardHeight + verticalPadding) * (rowCount + 4) / (vertical === 'half' ? 2.0 : 1) + GUTTER_SIZE;

  return (
    <PanPinchView
      minScale={0.5}
      maxScale={4}
      initialScale={1.0}
      containerDimensions={{ width, height: height - NOTCH_BOTTOM_PADDING }}
      contentDimensions={{
        width: rowWidth,
        height: rowHeight,
      }}
    >
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
    </PanPinchView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
});
