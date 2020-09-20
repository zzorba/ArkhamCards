import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ClipPath, Defs, LinearGradient, Circle, Svg, Rect, Mask, Use, Stop } from 'react-native-svg';


import FactionPattern from './FactionPattern';
import { CORE_FACTION_CODES } from '@app_constants';
import AppIcon from '@icons/AppIcon';
import Card from '@data/Card';
import StyleContext from '@styles/StyleContext';
import CardCostIcon from '@components/core/CardCostIcon';
import space, { s, xs } from '@styles/space';
import EncounterIcon from '@icons/EncounterIcon';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  card: Card;
  width: number;
  back?: boolean;
  linked: boolean;
}

const ICON_SIZE = 28;
const HEIGHT = 48;

function DualFactionIcons({ card }: { card: Card }) {
  if (!card.faction2_code || !card.faction_code) {
    return null;
  }
  return (
    <>
      <ArkhamIcon name={card.faction_code} size={36} color="white" />
      <ArkhamIcon name={card.faction2_code} size={36} color="white" />
    </>
  );
}
function FactionIcon({ card, linked }: { card: Card, linked: boolean }) {
  const color = '#FFF';
  if (card.type_code === 'skill' || card.type_code === 'asset' || card.type_code === 'event') {
    return (
      <>
        <DualFactionIcons card={card} />
        <View style={styles.costIcon}>
          <CardCostIcon
            card={card}
            inverted
            linked={linked}
          />
        </View>
      </>
    );
  }

  if (card.spoiler) {
    const encounter_code = card.encounter_code ||
      (card.linked_card && card.linked_card.encounter_code);
    return (
      <View>
        { !!encounter_code && (
          <EncounterIcon
            encounter_code={encounter_code}
            size={ICON_SIZE}
            color={color}
          />
        ) }
      </View>
    );
  }
  if (card.subtype_code &&
    (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
  ) {
    return (
      <View>
        <ArkhamIcon
          name="weakness"
          size={ICON_SIZE}
          color={color}
        />
      </View>
    );
  }

  if (card.type_code !== 'scenario' && card.type_code !== 'location' &&
    card.type_code !== 'act' && card.type_code !== 'agenda') {
    if (card.faction2_code) {
      return (
        <>
          <View>
            { !!card.faction_code &&
              (CORE_FACTION_CODES.indexOf(card.faction_code) !== -1) && (
              <ArkhamIcon
                name={card.faction_code}
                size={ICON_SIZE + 4}
                color="#FFF"
              />
            ) }
          </View>
          <View>
            { !!card.faction2_code &&
              (CORE_FACTION_CODES.indexOf(card.faction2_code) !== -1) && (
              <ArkhamIcon
                name={card.faction2_code}
                size={ICON_SIZE + 4}
                color="#FFF"
              />
            ) }
          </View>
        </>
      );
    }
    return (
      <View style={styles.factionIcon}>
        { (!!card.faction_code && (CORE_FACTION_CODES.indexOf(card.faction_code) !== -1 || card.faction_code === 'neutral')) &&
          <ArkhamIcon name={card.faction_code === 'neutral' ? 'elder_sign' : card.faction_code} size={ICON_SIZE + 4} color={color} /> }
      </View>
    );
  }
  return null;
}

function HeaderContent({ card, back }: { card: Card, back: boolean}) {
  const { typography } = useContext(StyleContext);
  const name = (back ? card.back_name : card.name) || card.name;
  const subname = (card.type_code !== 'location' && back) ? undefined : card.subname;
  return (
    <>
      <View style={styles.titleRow} removeClippedSubviews>
        <View style={styles.column}>
          <Text style={[typography.large, space.marginLeftS, { color: '#FFFFFF' }]}>
            { `${name}${card.is_unique ? ' ✷' : ''}` }
          </Text>
          { !!subname && (
            <Text style={[typography.small, typography.italic, typography.light, space.marginLeftS, { color: '#FFFFFF' }]}>
              { card.subname }
            </Text>
          ) }
        </View>
      </View>
    </>
  );
}

export default function CardDetailHeader({ card, width, back, linked }: Props) {
  const { colors } = useContext(StyleContext);
  const color = colors.faction[card.faction2_code ? 'dual' : card.factionCode()].background;

  return (
    <View style={[styles.cardTitle, {
      backgroundColor: color,
      borderColor: color,
    }]} removeClippedSubviews>
      <FactionPattern faction={card.factionCode()} width={width} height={48} />
      <HeaderContent card={card} back={!!back} />
      <FactionIcon card={card} linked={linked} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    minHeight: HEIGHT,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  titleRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  costIcon: {
    marginLeft: xs,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  factionIcon: {
    marginBottom: 4,
  },
});
