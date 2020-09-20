import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  ClipPath,
  Svg,
  Defs,
  Pattern,
  Path,
  Use,
  TransformObject,
  Rect,
} from 'react-native-svg';
import MysticPattern from '../../../../../assets/mystic_pattern.svg';
import SeekerPattern from '../../../../../assets/seeker_pattern.svg';
import MythosPattern from '../../../../../assets/mythos_pattern.svg';
import RoguePattern from '../../../../../assets/rogue_pattern.svg';
import GuardianPattern from '../../../../../assets/guardian_pattern.svg';
import SurvivorPattern from '../../../../../assets/survivor_pattern.svg';
import NeutralPattern from '../../../../../assets/neutral_pattern.svg';


interface Props {
  width: number;
  height: number;
  faction: string;
}

// flip horizontally: transform={`translate(${width},0) scale(-1,1)`}
function RepeatPattern({ patternWidth, children }: { patternWidth: number; children: React.ReactNode }) {
  return (
    <Pattern
      id="FactionPattern"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
      x="0"
      y="0"
      width={patternWidth}
      height={48}
      viewBox={`0 0 ${patternWidth} 48`}
    >
      { children }
    </Pattern>
  );
}

function StretchPattern({ patternWidth, width, children }: { patternWidth: number; width: number; children: React.ReactNode }) {
  if (width < patternWidth) {
    return (
      <RepeatPattern patternWidth={patternWidth}>
        { children }
      </RepeatPattern>
    );
  }
  return (
    <Pattern
      id="FactionPattern"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
      patternTransform={`scale(${width / patternWidth},1)`}
      x="0"
      y="0"
      width={width}
      height={48}
      viewBox={`0 0 ${width} 48`}
    >
      { children }
    </Pattern>
  );
}


function HeaderPattern({ faction, width }: { faction : string, width: number }) {
  switch (faction) {
    case 'guardian':
      return (
        <StretchPattern patternWidth={344} width={width}>
          <GuardianPattern />
        </StretchPattern>
      );
    case 'seeker':
      return (
        <RepeatPattern patternWidth={360}>
          <SeekerPattern />
        </RepeatPattern>
      );
    case 'rogue':
      return (
        <RepeatPattern patternWidth={360}>
          <RoguePattern />
        </RepeatPattern>
      );
    case 'mystic':
      return (
        <RepeatPattern patternWidth={360}>
         <MysticPattern />
        </RepeatPattern>
      );
    case 'survivor':
      return (
        <RepeatPattern patternWidth={360}>
          <SurvivorPattern />
        </RepeatPattern>
      );
    case 'mythos':
      return (
        <StretchPattern patternWidth={360} width={width}>
          <MythosPattern />
        </StretchPattern>
      );
    case 'neutral':
    default:
      return (
        <RepeatPattern patternWidth={360}>
          <NeutralPattern />
        </RepeatPattern>
      );
  }
}



function HeaderPath({ width, height }: { width: number; height: number}) {
  const topWidth = width - 16;
  const sideHeight = height - 8;

  return (
    <Path
      d={`M0,${height}
        v-${sideHeight}
        a8,8 0 0 1 8 -8
        h${topWidth}
        q8,0 8,8
        v${sideHeight}
        z
      `}
      fill="url(#FactionPattern)"
      fillOpacity={0.1}
    />
  );
}

export default function FactionPattern({ width, height, faction }: Props) {
  return (
    <View style={[styles.pattern, { width, height }, Platform.OS === 'android' ? { opacity: 0.1 } : {}]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <HeaderPattern faction={faction} width={width} />
        </Defs>
        <HeaderPath width={width} height={height} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
