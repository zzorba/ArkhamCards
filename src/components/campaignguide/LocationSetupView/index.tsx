import React from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';
import PinchZoomView from 'react-native-pinch-zoom-view';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from '@components/nav/types';
import { LocationSetupStep } from '@data/scenario/types';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import LocationCard from './LocationCard';
import { CARD_RATIO } from '@styles/sizes';
import { isTablet } from '@styles/space';

export interface LocationSetupProps {
  step: LocationSetupStep;
}

type Props = LocationSetupProps & NavigationProps & DimensionsProps;

const TOP_PADDING = 8;
const SIDE_PADDING = 8;
const GUTTER_SIZE = 64;

interface CardSizes {
  cardWidth: number;
  cardHeight: number;
  betweenPadding: number;
}

class LocationSetupView extends React.Component<Props> {
  heightConstrained(rowCount: number): CardSizes {
    const {
      height,
      step: {
        vertical,
        horizontal,
      },
    } = this.props;
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
  }

  widthConstrained(rowSize: number): CardSizes {
    const {
      width,
      step: {
        horizontal,
      },
    } = this.props;
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
  }

  cardDimensions(
    rowCount: number,
    rowSize: number,
  ): CardSizes {
    const widthLimited = this.widthConstrained(rowSize);
    if (!isTablet) {
      return widthLimited;
    }
    const heightLimited = this.heightConstrained(rowCount);
    if (widthLimited.cardWidth < heightLimited.cardWidth) {
      return widthLimited;
    }
    return heightLimited;
  }

  _renderRow = (
    locationsRow: string[],
    rowNumber: number
  ) => {
    const {
      step: {
        vertical,
        horizontal,
        locations,
      },
    } = this.props;
    const rowSize = locationsRow.length;
    const {
      betweenPadding,
      cardWidth,
      cardHeight,
    } = this.cardDimensions(locations.length, rowSize);
    const top = vertical === 'half' ?
      ((cardHeight + TOP_PADDING) / 2) * rowNumber :
      (cardHeight + TOP_PADDING) * rowNumber;
    return map(locationsRow, (item, x) => {
      const left = horizontal === 'half' ?
        ((cardWidth + betweenPadding) / 2) * x :
        (cardWidth + betweenPadding) * x;
      return (
        <LocationCard
          key={`${rowNumber}x${x}`}
          code={item}
          top={TOP_PADDING + top}
          left={SIDE_PADDING + left}
          height={cardHeight}
          width={cardWidth}
        />
      );
    });
  }

  render() {
    const {
      step,
      width,
    } = this.props;
    if (!step) {
      return null;
    }
    const {
      locations,
      vertical,
      note,
    } = step;
    const {
      cardHeight,
    } = this.cardDimensions(locations.length, locations[0].length);

    const height = TOP_PADDING * 2 + cardHeight * (locations.length / (vertical === 'half' ? 2 : 1)) + GUTTER_SIZE;
    return (
      <PinchZoomView style={{ width: 500 }}>
        { !!note && (
          <View style={{ width: width }}>
            <SetupStepWrapper bulletType="none">
              <CampaignGuideTextComponent text={note} />
            </SetupStepWrapper>
          </View>
        ) }
        <View style={[styles.container, { height }]}>
          { map(locations, this._renderRow) }
        </View>
      </PinchZoomView>
    );
  }
}

export default withDimensions(LocationSetupView);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
});
