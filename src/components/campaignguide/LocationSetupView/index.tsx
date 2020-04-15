import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from 'components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from 'components/nav/types';
import { LocationSetupStep } from 'data/scenario/types';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import LocationCard from './LocationCard';
import { CARD_RATIO } from 'styles/sizes';

export interface LocationSetupProps {
  step: LocationSetupStep;
}

type Props = LocationSetupProps & NavigationProps & DimensionsProps;

const TOP_PADDING = 8;
const SIDE_PADDING = 8;
const GUTTER_SIZE = 64;
class LocationSetupView extends React.Component<Props> {
  cardDimensions(
    rowSize: number,
  ): {
    cardWidth: number,
    cardHeight: number,
    betweenPadding: number;
  } {
    const {
      width,
      step: {
        horizontal,
      },
    } = this.props;
    const cardsPerRow = rowSize / (horizontal === 'half' ? 2 : 1);
    const betweenPadding = horizontal === 'tight' ? 8 : 12;
    const effectiveScreenWidth = width - SIDE_PADDING * 2;
    const interCardSpacing = betweenPadding * (rowSize / (horizontal === 'half' ? 2 : 1) - 1);
    const cardWidth = (effectiveScreenWidth - interCardSpacing) / cardsPerRow;
    const cardHeight = cardWidth * CARD_RATIO;
    return {
      cardWidth,
      cardHeight,
      betweenPadding,
    };
  }
  _renderRow = (
    locationsRow: string[],
    rowNumber: number
  ) => {
    const {
      step: {
        vertical,
        horizontal,
      },
    } = this.props;
    const rowSize = locationsRow.length;
    const {
      betweenPadding,
      cardWidth,
      cardHeight,
    } = this.cardDimensions(rowSize);
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
      step: {
        locations,
        vertical,
        note,
      },
    } = this.props;
    const {
      cardHeight,
    } = this.cardDimensions(locations[0].length);

    const height = TOP_PADDING * 2 + cardHeight * (locations.length / (vertical === 'half' ? 2 : 1)) + GUTTER_SIZE;
    return (
      <ScrollView>
        { !!note && (
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent text={note} />
          </SetupStepWrapper>
        ) }
        <View style={[styles.container, { height }]}>
          { map(locations, this._renderRow) }
        </View>
      </ScrollView>
    );
  }
}

export default withDimensions(LocationSetupView);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
  },
  innerRow: {
    position: 'relative',
  },
});
