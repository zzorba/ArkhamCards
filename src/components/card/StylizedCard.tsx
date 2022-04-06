import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { flatMap, map, range, countBy, sumBy } from 'lodash';

import { FactionCodeType, SkillCodeType, SKILLS, TypeCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import AssetCard from '../../../assets/asset.svg';
import EventCard from '../../../assets/event.svg';
import SkillCard from '../../../assets/skill.svg';
import Card from '@data/types/Card';
import { CARD_COLORS, dark15, dark20, dualLightText, light10, light20, light30, medium, mythosLightText, neutralLightText } from '@styles/theme';
import CardCostIcon from '@components/core/CardCostIcon';
import AppIcon from '@icons/AppIcon';
import ArkhamIconNode from './CardTextComponent/ArkhamIconNode';
import ArkhamIcon from '@icons/ArkhamIcon';
import CardIcon from '@icons/CardIcon';

interface Props {
  card: Card
  width: number;
}

function CardBackground({ type, dual, faction, width, height }: { type: TypeCodeType; dual: boolean; faction: FactionCodeType; width: number; height: number }) {
  const { background, border } = dual ? { background: dualLightText, border: medium } : (CARD_COLORS[faction] || {});
  switch (type) {
    case 'skill':
      return <SkillCard width={width} height={height} faction={background} border={border} />;
    case 'event':
      return <EventCard width={width} height={height} faction={background} border={border} />;
    case 'asset':
      return <AssetCard width={width} height={height} faction={background} border={border} />;
    default:
      return null;
  }
}

const FACTION_ICON_SCALE: {
  [key in FactionCodeType]: number | undefined;
} = {
  guardian: 1.05,
  rogue: 0.95,
  survivor: 0.92,
  neutral: 0.80,
  mystic: 0.95,
}

const CARD_WIDTH = 96.0;
const CARD_HEIGHT = 128.0;
export default function StylizedCard({ card, width }: Props) {
  const { shadow, typography } = useContext(StyleContext);
  const height = width * 128 / 96.0;

  const cardTypeBlockHeight = 11 / CARD_HEIGHT * height;
  const cardTypeSize = 10 / CARD_HEIGHT * height;
  const insetS = 4 / CARD_WIDTH * width;
  const skillLevelLeftInset = 3 / CARD_WIDTH * width;
  const skillLevelInset = 2 / CARD_WIDTH * width;
  const skillLevelRadius = 11 / CARD_WIDTH * width;

  const costIconRadius = 12 / CARD_WIDTH * width;
  const factionCircleRadius = (8 / CARD_WIDTH * width) * (card.faction2_code ? 0.75 : 1.0) * (card.faction3_code ? 0.80 : 1.0);
  const skillCircleRadius = 7 / CARD_WIDTH * width;
  const multiSlot = !!(card.real_slots_normalized && sumBy(card.real_slots_normalized, c => c === '#' ? 1 : 0) > 2);
  const slotCircleRadius = 10 / CARD_WIDTH * width * (multiSlot ? 0.70 : 1);
  const faction = card.factionCode();
  const { background, border } = CARD_COLORS[faction] || {};
  const level = (card.xp === null || card.xp === undefined) ? 'null' : `${card.xp}`;
  return (
    <View style={[styles.wrapper, { width, height }, shadow.medium]}>
      <CardBackground type={card.type_code} dual={!!card.faction2_code} faction={faction} width={width} height={height} />
      <View style={{ position: 'absolute', top: 1 / CARD_HEIGHT * height, left: 0, width, height: cardTypeBlockHeight }}>
        <Text style={[typography.cardName, typography.center, { flex: 1, fontSize: cardTypeSize, lineHeight: cardTypeBlockHeight, textTransform: 'uppercase' }]}>
          { card.type_name }
        </Text>
      </View>

      { !!card.traits && (
        <View style={{ position: 'absolute', top: (card.type_code === 'skill' ? 0.65 : 0.6) * height, left: 0.1 * width, width: width * 0.8, height: height * 0.3, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text numberOfLines={3} ellipsizeMode="tail" style={[typography.boldItalic, typography.center, { textAlignVertical: 'center', fontSize: height * 0.3 / 4, lineHeight: height * 0.3 / 3 }]}>
            { card.traits }
          </Text>

      </View>
      ) }
      { (card.type_code === 'asset' || card.type_code === 'event') ? (
        <>
          <View style={{ position: 'absolute', top: insetS, left: insetS }}>
            { level !== '0' && (
              <View style={{ position: 'absolute', top: costIconRadius * 0.0125, left: costIconRadius * 0.025 }}>
                <AppIcon
                  name={`ae_level_${level}`}
                  size={costIconRadius * 1.95}
                  color={dark15}
                />
              </View>
            ) }
            <View style={{ position: 'absolute', top: costIconRadius * 0.0125, left: costIconRadius * 0.025, width: costIconRadius * 2, height: costIconRadius * 1.7, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                fontFamily: 'cost',
                fontSize: ((card.cost || 0) >= 10 ? 0.85 : 1.0) * costIconRadius * 0.9,
                color: light30,
              }}>{card.realCost()}</Text>

            </View>
          </View>
          <View style={{ position: 'absolute', top: insetS, right: insetS * (card.faction2_code ? 0.5 : 1.0), flexDirection: 'row-reverse', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            <View style={[
              shadow.medium,
              { marginLeft: insetS * (card.faction3_code ? 0.25 : 0.5), width: factionCircleRadius * 2, height: factionCircleRadius * 2, borderRadius: factionCircleRadius, backgroundColor: background },
              { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
            ]}>
              <AppIcon
                name={`class_${faction}`}
                size={factionCircleRadius * 2 * (FACTION_ICON_SCALE[faction] || 1)}
                color={light30}
              />
            </View>
            { !!card.faction2_code && (
              <View style={[
                shadow.medium,
                { marginLeft: insetS * (card.faction3_code ? 0.25 : 0.5), width: factionCircleRadius * 2, height: factionCircleRadius * 2, borderRadius: factionCircleRadius, backgroundColor: CARD_COLORS[card.faction2_code].background },
                { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
              ]}>
                <AppIcon
                  name={`class_${card.faction2_code}`}
                  size={factionCircleRadius * 2 * (FACTION_ICON_SCALE[faction] || 1)}
                  color={light30}
                />
              </View>
            ) }
            { !!card.faction3_code && (
              <View style={[
                shadow.medium,
                { width: factionCircleRadius * 2, height: factionCircleRadius * 2, borderRadius: factionCircleRadius, backgroundColor: CARD_COLORS[card.faction3_code].background },
                { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
              ]}>
                <AppIcon
                  name={`class_${card.faction3_code}`}
                  size={factionCircleRadius * 2 * (FACTION_ICON_SCALE[faction] || 1)}
                  color={light30}
                />
              </View>
            ) }
          </View>
        </>
      ) : (
        <>
          <View style={{ position: 'absolute', top: insetS, left: insetS * 1.75, flexDirection: 'row-reverse', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            <AppIcon
              name={`class_${faction}`}
              size={factionCircleRadius * 1.75 * (FACTION_ICON_SCALE[faction] || 1)}
              color={light30}
            />
          </View>
          <View style={{ position: 'absolute', top: skillLevelInset, left: skillLevelLeftInset }}>
            <AppIcon
              name="s_frame_background"
              size={skillLevelRadius * 2}
              color={light30}
            />
          </View>
          <View style={{ position: 'absolute', top: skillLevelInset, left: skillLevelLeftInset }}>
            <AppIcon
              name={`s_level_${level}`}
              size={skillLevelRadius * 2}
              color={neutralLightText}
            />
          </View>
        </>
      ) }
      <View style={{ position: 'absolute', left: insetS, top: 0.22 * height, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        { flatMap(SKILLS, (skill: SkillCodeType) => {
          const count = card.skillCount(skill);
          if (count <= 0) {
            return null;
          }
          return map(range(0, count), (idx) => {
            return (
              <View key={`${skill}_${idx}`} style={[
                { backgroundColor: light30, borderRadius: skillCircleRadius, width: skillCircleRadius * 2, height: skillCircleRadius * 2, marginBottom: 2 / CARD_HEIGHT * height },
                { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
              ]}>
                <ArkhamIcon
                  name={skill}
                  size={skillCircleRadius * 1.80}
                  color={dark15}
                />
              </View>
            );
          });
        }) }
      </View>
      { !!card.real_slot && (
        <View style={{ position: 'absolute', right: insetS * (multiSlot ? 0.5 : 1), bottom: insetS * (multiSlot ? 0.5 : 1), flexDirection: 'row', justifyContent: 'flex-end' }}>
          { map(card.real_slot.split('.'), slot => {
            return (
              <View key={slot} style={[
                { marginLeft: insetS * (multiSlot ? 0.5 : 1), width: slotCircleRadius * 2, height: slotCircleRadius * 2, borderRadius: slotCircleRadius, backgroundColor: light20 },
                { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
              ]}>
                <CardIcon
                  name={`${slot.trim().replace(' ', '_').toLowerCase()}_solid`}
                  color={dark20}
                  size={slotCircleRadius * 2}
                />
              </View>
            );
          }) }
        </View>
      ) }
      <View style={{ position: 'absolute', top: 0.1 * height, left: 0.2 * width, width: width * 0.65, height: height * 0.45, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Text numberOfLines={3} ellipsizeMode="tail" style={[typography.cardName, typography.center, { textAlignVertical: 'center', fontSize: height * 0.35 / 4, lineHeight: height * 0.35 / 3.5 }]}>
          { card.name }
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 4,
    position: 'relative',
  },
  fixed: {
    position: 'absolute',
  },
});
