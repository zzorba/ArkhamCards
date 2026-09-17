import React from 'react';
import { View, StyleSheet } from 'react-native';
import CampaignPattern from '../../../../assets/campaign_pattern.svg';
import DualPattern from '../../../../assets/dual_pattern.svg';
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

const PATTERN_HEIGHT = 48;

function getPatternConfig(faction: string, transparent?: boolean): {
  Component: React.ComponentType<any>;
  patternWidth: number;
  color?: string;
} {
  const color = transparent ? '#000' : '#FFF';
  switch (faction) {
    case 'campaign': return { Component: CampaignPattern, patternWidth: 344, color: 'black' };
    case 'guardian': return { Component: GuardianPattern, patternWidth: 344, color };
    case 'seeker': return { Component: SeekerPattern, patternWidth: 360 };
    case 'rogue': return { Component: RoguePattern, patternWidth: 360, color };
    case 'mystic': return { Component: MysticPattern, patternWidth: 360, color };
    case 'survivor': return { Component: SurvivorPattern, patternWidth: 360 };
    case 'mythos': return { Component: MythosPattern, patternWidth: 360, color };
    case 'dual': return { Component: DualPattern, patternWidth: 360, color };
    case 'neutral':
    default: return { Component: NeutralPattern, patternWidth: 360, color };
  }
}

function getOpacity(faction: string, transparent?: boolean) {
  if (faction === 'campaign') {
    return 0.15;
  }
  return transparent || (faction === 'seeker' || faction === 'neutral') ? 0.07 : 0.1;
}

const FactionPattern = ({ width, height, faction, transparent, fullRound }: Props) => {
  const opacity = getOpacity(faction, transparent);
  const { Component, patternWidth, color } = getPatternConfig(faction, transparent);
  const scaleX = width / patternWidth;
  const scaleY = height / PATTERN_HEIGHT;
  return (
    <View
      style={[
        styles.pattern,
        {
          overflow: 'hidden',
          opacity,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: fullRound ? 8 : 0,
          borderBottomRightRadius: fullRound ? 8 : 0,
        },
      ]}
    >
      <View style={{
        width: patternWidth,
        height: PATTERN_HEIGHT,
        transform: [{ scaleX }, { scaleY }],
        transformOrigin: '0% 0%',
      }}>
        <Component {...(color !== undefined ? { color } : {})} />
      </View>
    </View>
  );
};

export default FactionPattern;

const styles = StyleSheet.create({
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
