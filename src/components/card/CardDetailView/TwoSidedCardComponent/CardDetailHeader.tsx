import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CORE_FACTION_CODES } from '@app_constants';
import AppIcon from '@icons/AppIcon';
import Card from '@data/Card';
import StyleContext from '@styles/StyleContext';
import CardCostIcon from '@components/core/CardCostIcon';
import space, { s, xs } from '@styles/space';
import typography from '@styles/typography';
import EncounterIcon from '@icons/EncounterIcon';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  card: Card;
  width: number;
  back?: boolean;
  linked: boolean;
}

const RATIO = 7.0;
const ICON_SIZE = 28;

function HeaderPattern({ card, width }: { card: Card, width: number }) {
  switch (card.factionCode()) {
    case 'guardian':
      return (
        <View style={styles.pattern}>
          <AppIcon size={width / RATIO} name="guardian_pattern" color="#FFFFFF22" />
        </View>
      );
    case 'seeker':
      return (
        <View style={styles.pattern}>
          <AppIcon size={width / 8} name="seeker_pattern" color="#00000022" />
        </View>
      );
    case 'rogue':
      return (
        <View style={styles.pattern}>
          <AppIcon size={width / RATIO} name="rogue_pattern" color="#FFFFFF11" />
        </View>
      );
    case 'mystic':
      return (
        <View style={styles.pattern}>
          <AppIcon size={width / RATIO} name="mystic_pattern" color="#FFFFFF22" />
        </View>
      );
    case 'survivor':
      return (
        <View style={styles.pattern}>
          <AppIcon size={width / RATIO} name="survivor_pattern" color="#00000022" />
        </View>
      );
    case 'neutral':
      return (
        <View style={styles.pattern}>
          <AppIcon size={width / RATIO} name="neutral_pattern" color="#FFFFFF11" />
        </View>
      );
    default:
      return null;
  }
}

function FactionIcon({ card }: { card: Card }) {
  const color = '#FFF';
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
      <View>
        { (!!card.faction_code && CORE_FACTION_CODES.indexOf(card.faction_code) !== -1) &&
          <ArkhamIcon name={card.faction_code} size={ICON_SIZE + 4} color={color} /> }
      </View>
    );
  }
  return null;
}

function HeaderContent({ card, linked, back }: { card: Card, linked: boolean, back: boolean}) {
  const name = (back ? card.back_name : card.name) || card.name;
  const subname = back ? undefined : card.subname;
  return (
    <>
      <View style={styles.titleRow} removeClippedSubviews>
        { (card.type_code === 'skill' || card.type_code === 'asset' || card.type_code === 'event') && (
          <View style={styles.costIcon}>
            <CardCostIcon
              card={card}
              inverted
              linked={linked}
            />
          </View>
        ) }
        <View style={styles.column}>
          <Text style={[typography.cardName, space.marginLeftS, { color: '#FFFFFF' }]}>
            { `${name}${card.is_unique ? ' ✷' : ''}` }
          </Text>
          { !!subname && (
            <Text style={[typography.cardSubName, space.marginLeftS, { color: '#FFFFFF' }]}>
              { card.subname }
            </Text>
          ) }
        </View>
      </View>
    </>
  );
}

export default function CardDetailHeader({ card, width, back, linked }: Props) {
  return (
    <StyleContext.Consumer>
      { ({ colors }) => {
        const color = colors.faction[card.factionCode()].background;
        if (back && (card.name === card.back_name || !card.back_name)) {
          return (
            <View style={[styles.placeholder, { borderColor: color }]} />
          );
        }

        return (
          <View style={[styles.cardTitle, {
            backgroundColor: color,
            borderColor: color,
          }]}>
            <HeaderPattern card={card} width={width} />
            <HeaderContent card={card} linked={linked} back={!!back} />
            <FactionIcon card={card} />
          </View>
        );
      } }
    </StyleContext.Consumer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    height: 12,
  },
  cardTitle: {
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    minHeight: 48,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
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
});
