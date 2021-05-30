import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Svg,
  Defs,
  Pattern,
  Path,
} from 'react-native-svg';
import MysticPattern from '../../../../assets/mystic_pattern.svg';
import SeekerPattern from '../../../../assets/seeker_pattern.svg';
import MythosPattern from '../../../../assets/mythos_pattern.svg';
import RoguePattern from '../../../../assets/rogue_pattern.svg';
import GuardianPattern from '../../../../assets/guardian_pattern.svg';
import SurvivorPattern from '../../../../assets/survivor_pattern.svg';
import NeutralPattern from '../../../../assets/neutral_pattern.svg';


interface Props {
  width: number;
  height: number;
  faction: string;
  transparent?: boolean;
  fullRound?: boolean;
}

// flip horizontally: transform={`translate(${width},0) scale(-1,1)`}
function RepeatPattern({ patternWidth, height, children }: { patternWidth: number; height: number; children: React.ReactNode }) {
  return (
    <Pattern
      id="FactionPattern"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
      patternTransform={`scale(1,${height / 48})`}
      x="0"
      y="0"
      width={patternWidth}
      height={height}
      viewBox={`0 0 ${patternWidth} ${height}`}
    >
      { children }
    </Pattern>
  );
}

function StretchPattern({
  patternWidth,
  width,
  height,
  children,
}: { patternWidth: number; width: number; height: number; children: React.ReactNode }) {
  if (width < patternWidth) {
    return (
      <RepeatPattern patternWidth={patternWidth} height={height}>
        { children }
      </RepeatPattern>
    );
  }
  return (
    <Pattern
      id="FactionPattern"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
      patternTransform={`scale(${width / patternWidth},${height / 48})`}
      x="0"
      y="0"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      { children }
    </Pattern>
  );
}


function HeaderPattern({ faction, width, height, transparent }: { faction : string; width: number; height: number; transparent?: boolean }) {
  switch (faction) {
    case 'guardian':
      return (
        <StretchPattern patternWidth={344} width={width} height={height}>
          <GuardianPattern color={transparent ? '#000' : '#FFF'} />
        </StretchPattern>
      );
    case 'seeker':
      return (
        <RepeatPattern patternWidth={360} height={height}>
          <SeekerPattern />
        </RepeatPattern>
      );
    case 'rogue':
      return (
        <RepeatPattern patternWidth={360} height={height}>
          <RoguePattern color={transparent ? '#000' : '#FFF'} />
        </RepeatPattern>
      );
    case 'mystic':
      return (
        <RepeatPattern patternWidth={360} height={height}>
          <MysticPattern color={transparent ? '#000' : '#FFF'} />
        </RepeatPattern>
      );
    case 'survivor':
      return (
        <RepeatPattern patternWidth={360} height={height}>
          <SurvivorPattern />
        </RepeatPattern>
      );
    case 'mythos':
      return (
        <StretchPattern patternWidth={360} width={width} height={height}>
          <MythosPattern color={transparent ? '#000' : '#FFF'} />
        </StretchPattern>
      );
    case 'neutral':
    default:
      return (
        <RepeatPattern patternWidth={360} height={height}>
          <NeutralPattern color={transparent ? '#000' : '#FFF'} />
        </RepeatPattern>
      );
  }
}

function HeaderPath({ width, height, opacity, fullRound }: { width: number; height: number; opacity: number; fullRound?: boolean }) {
  const topWidth = width - 16;
  const sideHeight = height - 8;
  return (
    <Path
      d={fullRound ? (
        `M0,${height}
          v-${sideHeight}
          a8,8 0 0 1 8,-8
          h${topWidth}
          a8,8 0 0 1 8,8
          v${sideHeight}
          a8,8 0 0 1 -8,8
          h-100
          a8,8 0 0 1 -8,-8
        `) : (
        `M0,${height}
          v-${sideHeight}
          a8,8 0 0 1 8,-8
          h${topWidth}
          a8,8 0 0 1 8,8
          v${sideHeight}
          z
        `
      )}
      fill="url(#FactionPattern)"
      fillOpacity={opacity}
    />
  );
}

const FactionPatternComponent = React.memo(function FactionPattern({ width, height, faction, transparent, fullRound }: Props) {
  const opacity = transparent || (faction === 'seeker' || faction === 'neutral') ? 0.07 : 0.1;
  return (
    <View style={[styles.pattern, { width, height }, Platform.OS === 'android' ? { opacity } : {}]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <HeaderPattern faction={faction} width={width} height={height} transparent={transparent} />
        </Defs>
        <HeaderPath fullRound={fullRound} width={width} height={height} opacity={opacity} />
      </Svg>
    </View>
  );
});

export default FactionPatternComponent;

const styles = StyleSheet.create({
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
