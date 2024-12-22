import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, forEach, map, partition } from 'lodash';
import PanPinchView from 'react-native-pan-pinch-view';
import { Canvas, Paint, Circle, Line, vec } from '@shopify/react-native-skia';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from '@components/nav/types';
import { LocationAnnotation, LocationArrow, LocationDecoration, LocationSetupCard, LocationSetupStep } from '@data/scenario/types';
import LocationCard, { cleanLocationCode } from './LocationCard';
import { CARD_RATIO, NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { isTablet, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ThemeColors } from '@styles/theme';
import AppIcon from '@icons/AppIcon';

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

type ParsedLocationStepData = {
  names: { [code: string]: string | undefined };
  placeholders: { [code: string]: boolean | undefined };
  randoms: { [code: string]: boolean | undefined };
  faded: { [code: string]: boolean | undefined };
}
function useParsedLocationStepData(location_names: LocationSetupStep['location_names']): ParsedLocationStepData {
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
  return { names, placeholders, randoms, faded };
}

function DecoratedLocationCard({
  keyProp,
  cardDimensions,
  card, resourceDividers, annotations, rowWidth, rowHeight,
  step: { resource_dividers, vertical, horizontal },
  parsed: { names, placeholders, randoms, faded },
}: {
  keyProp: string;
  step: LocationSetupStep;
  parsed: ParsedLocationStepData;
  cardDimensions: {
    betweenPadding: number;
    cardWidth: number;
    cardHeight: number;
  }
  card: LocationSetupCard;
  resourceDividers?: {
    right?: number;
    bottom?: number;
  };
  annotations: LocationAnnotation[];
  rowWidth: number;
  rowHeight: number;
 }) {
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
  const cleanCode = cleanLocationCode(item);
  return (
    <LocationCard
      keyProp={keyProp}
      code={item}
      name={names[cleanCode]}
      placeholder={placeholders[cleanCode]}
      faded={faded[cleanCode]}
      random={randoms[cleanCode]}
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
}

export default function LocationSetupView({ step }: Props) {
  const { locations, cards, annotations, arrows, decorations, vertical, horizontal, note, location_names, resource_dividers } = step;
  const { width, height } = useContext(StyleContext);
  const rowCount = locations.length;
  const rowSize = locations[0].length;
  const parsed = useParsedLocationStepData(location_names);

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
      const key = `${rowNumber}x${x}`;
      return (
        <DecoratedLocationCard
          key={key}
          keyProp={key}
          card={{
            code: item,
            x: x,
            y: rowNumber,
            rotate,
          }}
          cardDimensions={cardDimensions}
          annotations={currentAnnotations}
          step={step}
          parsed={parsed}
          resourceDividers={resources}
          rowWidth={rowWidth}
          rowHeight={rowHeight}
        />
      );
    });
  }, [annotations, cardDimensions, step, parsed, resource_dividers]);

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
            horizontalScale={horizontalScale}
            verticalScale={verticalScale}
          />
        ) }
        <View style={[styles.container, { height: rowHeight, margin: m * 2 }]}>
          { map(locations, (locs, row) => renderRow(locs, row, rowWidth, rowHeight)) }
          { map(cards, (card, idx) => {
            const key = `${idx}`;
            return (
              <DecoratedLocationCard
                key={key}
                keyProp={key}
                card={card}
                cardDimensions={cardDimensions}
                annotations={[]}
                step={step}
                parsed={parsed}
                resourceDividers={undefined}
                rowWidth={rowWidth}
                rowHeight={rowHeight}
              />
            );
          }) }
          { !!arrows?.length && (
            <Arrows
              arrows={arrows}
              unitWidth={cardWidth + betweenPadding}
              unitHeight={cardHeight + verticalPadding}
            />
          ) }

        </View>
        { !!topDecorations.length && (
          <Decorations
            decorations={bottomDecorations}
            unitWidth={unitWidth}
            unitHeight={unitHeight}
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

function Decorations({ decorations, unitWidth, unitHeight, horizontalScale, verticalScale }: {
  decorations: LocationDecoration[];
  unitWidth: number;
  unitHeight: number;
  horizontalScale: number;
  verticalScale: number;
}) {
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
                { /* eslint-disable-next-line react/style-prop-object */ }
                <Paint color={getColor(colors, d.color)} style="stroke" strokeWidth={4} />
              </Circle>
            );
          }
          case 'line':
          default:
            return (
              <Line key={idx}
                p1={vec(startX, startY)}
                p2={vec(endX, endY)}
                color={getColor(colors, d.color)}
                // eslint-disable-next-line react/style-prop-object
                style="stroke"
                strokeWidth={4}
              />
            );
        }
      }) }
    </Canvas>
  );
}

function Arrows({ arrows, unitWidth, unitHeight }: {
  arrows: LocationArrow[];
  unitWidth: number;
  unitHeight: number;
}) {
  const { colors } = useContext(StyleContext);
  const toX = (x: number) => unitWidth * x + SIDE_PADDING / 2;
  const toY = (y: number) => unitHeight * y + TOP_PADDING / 2;
  const toIconName = (name: string):
    ['long_arrow' | 'short_arrow' | 'long_single_arrow' | 'swoop_arrow' | 'swoop_arrow_right', number] => {
    switch (name) {
      case 'long': return ['long_arrow', 1.5];
      case 'long_single': return ['long_single_arrow', 2];
      case 'swoop': return ['swoop_arrow', 2];
      case 'swoop_right': return ['swoop_arrow_right', 2];
      case 'short':
      default:
        return ['short_arrow', 0.5];
    }
  };
  return (
    <>
      { map(arrows, (a, idx) => {
        const x = toX(a.x + 1);
        const y = toY(a.y + 1);
        const [icon, defaultScale] = toIconName(a.type);
        const scale = a.size ?? defaultScale;
        return (
          <View
            key={idx}
            style={[styles.arrow, {
              top: y, left: x,
              width: unitWidth * (a.width ?? scale),
              height: unitHeight * (a.height ?? scale),
              opacity: (a.opacity ?? 1),
            }]}>
            <AppIcon
              name={icon}
              size={Math.min(unitHeight * scale, unitWidth * scale)}
              color={getColor(colors, a.color)}
              style={a.rotation ? { transform: [{ rotate: a.rotation }] } : undefined}
            />
          </View>
        );
      }) }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  arrow: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
