import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { find, map, range } from 'lodash';

import Card from '@data/types/Card';
import CardDetailComponent from './CardDetailView/CardDetailComponent';
import StyleContext from '@styles/StyleContext';
import { CARD_RATIO } from '@styles/sizes';
import space, { s, xs } from '@styles/space';
import { RANDOM_BASIC_WEAKNESS, SkillCodeType, SKILLS } from '@app_constants';
import ArkhamIcon from '@icons/ArkhamIcon';
import EncounterIcon from '@icons/EncounterIcon';
import SlotIcon from './CardDetailView/TwoSidedCardComponent/SlotIcon';
import CardCostIcon from '@components/core/CardCostIcon';


function SkillIcons({ skill, count }: { skill: SkillCodeType; count: number }) {
  const { fontScale } = useContext(StyleContext);
  if (count === 0) {
    return null;
  }
  const SKILL_ICON_SIZE = 16 * fontScale;
  return (
    <>
      { map(range(0, count), key => (
        <View key={`${skill}-${key}`} style={{ paddingBottom: xs }}>
          <ArkhamIcon
            name={skill}
            size={SKILL_ICON_SIZE}
            color="#FFF"
          />
        </View>
      )) }
    </>
  );
}

export default function CardImage({ card, width, superCompact }: { card: Card, width: number; superCompact?: boolean }) {
  const { colors, shadow, typography } = useContext(StyleContext);
  const uri = card.imageUri();
  if (uri) {
    return (
      <FastImage
        style={{ width, height: CARD_RATIO * width }}
        source={{
          uri,
        }}
        resizeMode="contain"
      />
    );
  }
  if (superCompact) {
    if (card.code === RANDOM_BASIC_WEAKNESS) {
      return (
        <View style={[
          styles.simpleCard,
          shadow.medium,
          { width, height: CARD_RATIO * width, backgroundColor: colors.faction[card.faction2_code ? 'dual' : card.factionCode()].background }]}
        >
          <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ArkhamIcon
              name="weakness"
              color="#FFF"
              size={width / 1.4 }
            />
          </View>
        </View>
      );
    }
    return (
      <View style={[
        styles.simpleCard,
        shadow.medium,
        { width, height: CARD_RATIO * width, backgroundColor: colors.faction[card.faction2_code ? 'dual' : card.factionCode()].background }]}
      >
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', padding: xs }}>
            { card.type_code === 'asset' || card.type_code === 'skill' || card.type_code === 'event' && <CardCostIcon card={card} inverted /> }
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              { card.subtype_code !== 'weakness' ? (
                <>
                  { !!card.faction_code && <ArkhamIcon name={card.faction_code} size={24} color="white" /> }
                  { !!card.faction2_code && <ArkhamIcon name={card.faction2_code} size={24} color="white" /> }
                  { !!card.faction3_code && <ArkhamIcon name={card.faction3_code} size={24} color="white" /> }
                </>
              ) : <ArkhamIcon name="weakness" size={24} color="#FFF" />}
            </View>
          </View>
          <Text style={[
            space.paddingXs,
            typography.subHeaderText,
            typography.white,
          ]} numberOfLines={2} ellipsizeMode="tail">
            {card.renderName}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          { !!card.encounter_code && (
            <EncounterIcon
              encounter_code={card.encounter_code}
              color="#FFF"
              size={width / 2 }
            />
          ) }
        </View>
        { !!find(SKILLS, skill => card.skillCount(skill) > 0) && (
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', position: 'absolute', bottom: xs, left: xs }}>
            { map(SKILLS, (skill: SkillCodeType) => <SkillIcons key={skill} skill={skill} count={card.skillCount(skill)} />) }
          </View>
        ) }
        { !!card.real_slot && (
          <View style={{ position: 'absolute', bottom: xs, right: xs, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            { map(card.real_slot.split('.'), slot => <SlotIcon key={slot} size="small" slot={slot.trim()} />) }
          </View>
        ) }
      </View>
    )
  }
  return (
    <View style={styles.singleCardWrapper}>
      <CardDetailComponent
        card={card}
        width={width}
        showSpoilers
        simple
        noImage
      />
    </View>
  );
}

const styles = StyleSheet.create({
  simpleCard: {
    borderRadius: 8,
    paddding: s,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  singleCardWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
