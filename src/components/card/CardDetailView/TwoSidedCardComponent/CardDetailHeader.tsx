import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import { CORE_FACTION_CODES } from '@app_constants';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import CardCostIcon, { costIconSize } from '@components/core/CardCostIcon';
import space, { xs } from '@styles/space';
import EncounterIcon from '@icons/EncounterIcon';
import ArkhamIcon from '@icons/ArkhamIcon';
import { useSelector } from 'react-redux';
import { AppState } from '@reducers';

interface Props {
  card: Card;
  width: number;
  back?: boolean;
  linked: boolean;
}

const ICON_SIZE = 28;

const PADDING: { [key: string]: number } = {
  guardian: 2,
  mystic: 2,
  seeker: 2,
  neutral: 0,
  rogue: 2,
  dual: 0,
  survivor: 4,
};

function DualFactionIcons({ card }: { card: Card }) {
  const { colors, fontScale } = useContext(StyleContext);
  const faction_code = card.factionCode();
  const colorblind = useSelector((state: AppState) => !!state.settings.colorblind);
  if (!card.faction_code ||
    (!card.faction2_code && (!colorblind || faction_code === 'mythos' || card.type_code === 'investigator' || card.type_code === 'skill'))) {
    return null;
  }
  if (card.faction2_code) {
    const iconSize = costIconSize(fontScale);
    const scaleFactor = ((fontScale - 1) / 2 + 1);
    const ICON_SIZE = 31 * scaleFactor;
    return (
      <View style={styles.row}>
        <View style={styles.costIcon}>
          <View style={[styles.circle, { borderRadius: iconSize / 2, width: iconSize, height: iconSize, backgroundColor: colors.faction[card.faction_code].background }]}>
            <View style={{ height: iconSize - PADDING[card.faction_code] }}>
              <ArkhamIcon name={card.faction_code} size={card.faction_code === 'mystic' ? ICON_SIZE - 2 : ICON_SIZE} color="white" />
            </View>
          </View>
        </View>
        <View style={styles.costIcon}>
          <View style={[styles.circle, { borderRadius: iconSize / 2, width: iconSize, height: iconSize, backgroundColor: colors.faction[card.faction2_code].background }]}>
            <View style={{ height: iconSize - PADDING[card.faction2_code] }}>
              <ArkhamIcon name={card.faction2_code} size={card.faction2_code === 'mystic' ? ICON_SIZE - 2 : ICON_SIZE} color="white" />
            </View>
          </View>
        </View>
        { !!card.faction3_code && (
          <View style={styles.costIcon}>
            <View style={[styles.circle, { borderRadius: iconSize / 2, width: iconSize, height: iconSize, backgroundColor: colors.faction[card.faction3_code].background }]}>
              <View style={{ height: iconSize - PADDING[card.faction3_code] }}>
                <ArkhamIcon name={card.faction3_code} size={card.faction3_code === 'mystic' ? ICON_SIZE - 2 : ICON_SIZE} color="white" />
              </View>
            </View>
          </View>
        ) }
      </View>
    );

  }
  return (
    <View style={[space.paddingBottomS, styles.row]}>
      <ArkhamIcon name={card.faction_code} size={36} color="white" />
      { !!card.faction2_code && <ArkhamIcon name={card.faction2_code} size={36} color="white" /> }
      { !!card.faction3_code && <ArkhamIcon name={card.faction3_code} size={36} color="white" /> }
    </View>
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

  const encounter_code = card.encounter_code ||
    (card.linked_card && card.linked_card.encounter_code);
  if (encounter_code) {
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
          { !!card.faction3_code && (
            <View>
              { (CORE_FACTION_CODES.indexOf(card.faction3_code) !== -1) && (
                <ArkhamIcon
                  name={card.faction3_code}
                  size={ICON_SIZE + 4}
                  color="#FFF"
                />
              ) }
            </View>
          ) }
        </>
      );
    }
    return (
      <View style={styles.factionIcon}>
        { (!!card.faction_code && (CORE_FACTION_CODES.indexOf(card.faction_code) !== -1 || card.faction_code === 'neutral')) &&
          <ArkhamIcon name={card.faction_code} size={ICON_SIZE + 4} color={color} /> }
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
      <View style={styles.titleRow}>
        <View style={styles.column}>
          <View style={[styles.row, space.marginLeftS, space.paddingTopXs]}>
            <Text style={[typography.cardName, { color: '#FFFFFF' }]}>
              { `${name}${card.is_unique ? ' ✷' : ''}` }
            </Text>
          </View>
          { !!subname && (
            <Text style={[typography.cardTraits, space.marginLeftS, { color: '#FFFFFF' }]}>
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
    <RoundedFactionHeader faction={card.factionCode()} width={width} dualFaction={!!card.faction2_code}>
      <HeaderContent card={card} back={!!back} />
      <FactionIcon card={card} linked={linked} />
    </RoundedFactionHeader>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
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
  circle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
