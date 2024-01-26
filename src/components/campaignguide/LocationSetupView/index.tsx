import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, find, forEach, map, partition } from 'lodash';
import PanPinchView from 'react-native-pan-pinch-view';
import { Canvas, Paint, Circle, Line, vec, Path } from "@shopify/react-native-skia";

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from '@components/nav/types';
import { LocationAnnotation, LocationDecoration, LocationSetupCard, LocationSetupStep } from '@data/scenario/types';
import LocationCard, { cleanLocationCode } from './LocationCard';
import { CARD_RATIO, NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { isTablet, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ThemeColors } from '@styles/theme';

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

export default function LocationSetupView({ step: { locations, cards, annotations, decorations, vertical, horizontal, note, location_names, resource_dividers } }: Props) {
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
  const [placeholders, randoms, faded] = useMemo(() => {
    const p: { [code: string]: boolean | undefined } = {};
    const r: { [code: string]: boolean | undefined } = {};
    const f: { [code: string]: boolean | undefined } = {};
    forEach(location_names || [], entry => {
      if (entry.placeholder) {
        p[entry.code] = true;
      }
      if (entry.random) {
        r[entry.code] = true;
      }
      if (entry.faded) {
        f[entry.code] = true;
      }
    });
    return [p, r, f];
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

  const renderCard = useCallback(({ card, key, resourceDividers, annotations }: {
    card: LocationSetupCard;
    key: string;
    resourceDividers?: {
      right?: number;
      bottom?: number;
    };
    annotations: LocationAnnotation[];
    rowWidth: number;
    rowHeight: number;
   }) => {
    const {
      betweenPadding,
      cardWidth,
      cardHeight,
    } = cardDimensions;

    const cardHeightWithPadding = (cardHeight + TOP_PADDING);
    const verticalScale = vertical === 'half' ? 2.0 : 1.0;
    const top = cardHeightWithPadding / verticalScale * (card.y + verticalScale) + (
      resource_dividers ? 50 * card.y : 0
    );
    const cardWidthWithPadding = (cardWidth + betweenPadding);
    const horizontalScale = horizontal === 'half' ? 2.0 : 1.0;
    const left = cardWidthWithPadding / horizontalScale * (card.x + horizontalScale) + (
      resource_dividers ? 50 * card.x : 0
    );
    const item = card.code;
    return (
      <LocationCard
        key={key}
        keyProp={key}
        code={item}
        name={names[cleanLocationCode(item)]}
        placeholder={placeholders[cleanLocationCode(item)]}
        faded={faded[cleanLocationCode(item)]}
        random={randoms[cleanLocationCode(item)]}
        rotate={card.rotate}
        top={TOP_PADDING + top}
        left={SIDE_PADDING + left}
        height={cardHeight}
        width={cardWidth}
        annotations={annotations}
        resource_dividers={resourceDividers}
        rowWidth={rowWidth}
        rowHeight={rowHeight}
      />
    );
  }, [vertical, horizontal, resource_dividers, cardDimensions, names]);


  const renderRow = useCallback((locationsRow: string[], rowNumber: number, rowWidth: number, rowHeight: number) => {
    return map(locationsRow, (item, x) => {
      const currentAnnotations = filter(annotations, a => a.x === x && a.y === rowNumber);
      const resources = resource_dividers ? resource_dividers[rowNumber][x] : undefined;
      let rotate: 'left' | 'right' | 'invert' | undefined = undefined;
      if (item.indexOf('_rotate_left') !== -1) {
        rotate = 'left';
      } else if (item.indexOf('_rotate') !== -1) {
        rotate = 'right';
      } else if (item.indexOf('_invert') !== -1) {
        rotate = 'invert';
      }
      return renderCard({
        key: `${rowNumber}x${x}`,
        card: {
          code: item,
          x: x,
          y: rowNumber,
          rotate,
        },
        annotations: currentAnnotations,
        resourceDividers: resources,
        rowWidth,
        rowHeight,
      });
    });
  }, [vertical, annotations, horizontal, cardDimensions, names, resource_dividers]);

  const {
    cardHeight,
    cardWidth,
    betweenPadding,
    verticalPadding,
  } = cardDimensions;

  const horizontalScale = horizontal === 'half' ? 2.0 : 1.0;
  const verticalScale = vertical === 'half' ? 2.0 : 1.0;

  const unitWidth = (cardWidth + betweenPadding) / horizontalScale;
  const unitHeight = (cardHeight + verticalPadding) / verticalScale;
  const rowWidth = unitWidth * (rowSize + 3 * horizontalScale);
  const rowHeight = TOP_PADDING * 2 + unitHeight * (rowCount + 3 * verticalScale) + GUTTER_SIZE;
  const [bottomDecorations, topDecorations] = useMemo(() => partition(decorations ?? [], d => d.layer === 'bottom'), [decorations]);
  return (
    <PanPinchView
      minScale={0.25}
      maxScale={4}
      initialScale={1}
      containerDimensions={{ width: width, height: height - NOTCH_BOTTOM_PADDING }}
      contentDimensions={{
        width: rowWidth + m * 4,
        height: rowHeight + m * 4,
      }}
    >
      { !!note && (
        <View style={{ width: width }}>
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent text={note} />
          </SetupStepWrapper>
        </View>
      ) }
      <View style={{ position: 'relative', height: rowHeight, width: rowWidth }}>
        { !!bottomDecorations.length && (
          <Decorations
            decorations={bottomDecorations}
            unitWidth={unitWidth}
            unitHeight={unitHeight}
            width={rowWidth}
            height={rowHeight * rowCount}
            horizontalScale={horizontalScale}
            verticalScale={verticalScale}
          />
        ) }
        <View style={[styles.container, { height: rowHeight, margin: m * 2 }]}>
          { map(locations, (locs, row) => renderRow(locs, row, rowWidth, rowHeight)) }
          { map(cards, (card, idx) => renderCard({ card, key: `${idx}`, rowWidth, rowHeight, annotations: [] })) }
        </View>
        { !!topDecorations.length && (
          <Decorations
            decorations={bottomDecorations}
            unitWidth={unitWidth}
            unitHeight={unitHeight}
            width={width}
            height={rowHeight * rowCount}
            horizontalScale={horizontalScale}
            verticalScale={verticalScale}
          />
        ) }
      </View>
    </PanPinchView>
  );
}

function getColor(colors: ThemeColors, color?: 'blue' | 'red') {
  switch (color) {
    case 'blue': return colors.campaign.text.interlude;
    case 'red':
    default:
      return colors.campaign.text.resolution;
  }
}

function Decorations({ decorations, unitWidth, unitHeight, horizontalScale, verticalScale, width, height }: { decorations: LocationDecoration[]; unitWidth: number; unitHeight: number; width: number; height: number; horizontalScale: number; verticalScale: number }) {
  const { colors } = useContext(StyleContext);
  const toX = (x: number) => unitWidth * (x + horizontalScale + 3 / horizontalScale) + SIDE_PADDING;
  const toY = (y: number) => unitHeight * (y + verticalScale + 2 / verticalScale) + TOP_PADDING;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      { map(decorations, (d, idx) => {
        const startX = toX(d.start_x);
        const startY = toY(d.start_y);
        const endX = toX(d.end_x);
        const endY = toY(d.end_y);

        switch (d.type) {
          case 'circle': {
            const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            return (
              <Circle
                key={idx}
                cx={startX}
                cy={startY}
                r={radius}
                color="transparent"
              >
                <Paint color={getColor(colors, d.color)} style="stroke" strokeWidth={4} />
              </Circle>
            );
          }
          case 'arrow': {
            var posnALeft = {
              x: startX,
              y: startY,
            };
            var posnBLeft = {
              x: endX,
              y: endY,
            };
            var dStrLeft =
                "M" +
                (posnALeft.x      ) + "," + (posnALeft.y) + " " +
                "C" +
                (posnALeft.x - 100) + "," + (posnALeft.y) + " " +
                (posnBLeft.x - 100) + "," + (posnBLeft.y) + " " +
                (posnBLeft.x      ) + "," + (posnBLeft.y);
            return <Path key={idx} path={dStrLeft} color={getColor(colors, d.color)} />;
          }
          case 'line':
          default:
            return (
              <Line key={idx}
                p1={vec(startX, startY)}
                p2={vec(endX, endY)}
                color={getColor(colors, d.color)}
                style="stroke"
                strokeWidth={4}
              />
            );
        }
      }) }
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
});
