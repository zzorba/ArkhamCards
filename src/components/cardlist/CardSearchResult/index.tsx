import React, { useCallback, useContext, useMemo } from 'react';
import { map, range, repeat } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import ArkhamIcon from '@icons/ArkhamIcon';
import EncounterIcon from '@icons/EncounterIcon';
import CardCostIcon, { costIconSize } from '@components/core/CardCostIcon';
import Card from '@data/types/Card';
import { SKILLS, SkillCodeType } from '@app_constants';
import { rowHeight, iconSize } from './constants';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { AppState } from '@reducers';
import { ControlComponent, ControlType } from './ControlComponent';
import { usePressCallback } from '@components/core/hooks';

interface Props {
  card: Card;
  id?: string;
  onPress?: (card: Card) => void;
  onPressId?: (code: string, card: Card) => void;
  backgroundColor?: string;
  invalid?: boolean;
  control?: ControlType;
  noBorder?: boolean;
  faded?: boolean;
  noSidePadding?: boolean;
}

function SkillIcons({ skill, count }: { skill: SkillCodeType; count: number }) {
  const { colors, fontScale } = useContext(StyleContext);
  if (count === 0) {
    return null;
  }
  const SKILL_ICON_SIZE = 16 * fontScale;
  return (
    <>
      { map(range(0, count), key => (
        <View key={`${skill}-${key}`} style={styles.skillIcon}>
          <ArkhamIcon
            name={skill}
            size={SKILL_ICON_SIZE}
            color={colors.lightText}
          />
        </View>
      )) }
    </>
  );
}

function FactionIcon({ card }: { card: Card }) {
  const { fontScale, colors } = useContext(StyleContext);
  const size = iconSize(fontScale);
  const SMALL_ICON_SIZE = 26 * fontScale;

  if (!card.encounter_code && card.linked_card) {
    return <FactionIcon card={card.linked_card} />;
  }

  if (card.mythos_card && card.encounter_code) {
    return (
      <EncounterIcon
        encounter_code={card.encounter_code}
        size={size}
        color={colors.darkText}
      />
    );
  }
  if (card.subtype_code &&
    (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
  ) {
    return (
      <ArkhamIcon name="weakness" size={size} color={colors.faction.neutral.text} />
    );
  }
  const ICON_SIZE = iconSize(fontScale);
  if (card.type_code === 'scenario' || card.type_code === 'story') {
    return (
      <EncounterIcon
        encounter_code={card.pack_code}
        size={ICON_SIZE}
        color={colors.darkText}
      />
    );
  }
  const faction = card.factionCode();
  return (
    <View style={styles.investigatorFactionIcon}>
      <ArkhamIcon
        name={(card.faction2_code || faction === 'neutral') ? 'elder_sign' : faction}
        size={size === ICON_SIZE ? ICON_SIZE : SMALL_ICON_SIZE}
        color={colors.faction[faction].text}
      />
    </View>
  );
}

function CardIcon({ card }: { card: Card }) {
  const { fontScale } = useContext(StyleContext);
  if (card.hidden && card.linked_card) {
    return <CardIcon card={card.linked_card} />;
  }

  const showCost = card.type_code === 'asset' ||
    card.type_code === 'event' ||
    card.type_code === 'skill';

  if (showCost) {
    return (
      <View style={[styles.factionIcon, {
        width: costIconSize(fontScale),
        height: costIconSize(fontScale),
      }]}>
        <CardCostIcon card={card} />
      </View>
    );
  }
  return (
    <View style={[styles.factionIcon, {
      width: costIconSize(fontScale),
      height: costIconSize(fontScale),
    }]}>
      <FactionIcon card={card} />
    </View>
  );
}

function CardSearchResult(props: Props) {
  const {
    card,
    id,
    control,
    onPress,
    onPressId,
    backgroundColor,
    invalid,
    noBorder,
    faded,
    noSidePadding,
  } = props;
  const { borderStyle, colors, fontScale, typography } = useContext(StyleContext);
  const handleCardPressFunction = useCallback(() => {
    Keyboard.dismiss();
    if (id && onPressId) {
      onPressId(id, card);
    } else {
      onPress && onPress(card);
    }
  }, [onPress, onPressId, id, card]);
  const handleCardPress = usePressCallback(handleCardPressFunction);
  const colorblind = useSelector((state: AppState) => state.settings.colorblind);
  const dualFactionIcons = useMemo(() => {
    const faction_code = card.factionCode();
    if (!card.faction2_code && (!colorblind || faction_code === 'mythos' || card.type_code === 'investigator' || card.type_code === 'skill')) {
      return null;
    }
    const SKILL_ICON_SIZE = 16 * fontScale;
    return (
      <View style={styles.dualFactionIcons}>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name={faction_code}
            size={SKILL_ICON_SIZE}
            color={colors.faction[faction_code].text}
          />
        </View>
        { !!card.faction2_code && (
          <View style={styles.skillIcon}>
            <ArkhamIcon
              name={card.faction2_code}
              size={SKILL_ICON_SIZE}
              color={colors.faction[card.faction2_code].text}
            />
          </View>
        ) }
      </View>
    );
  }, [fontScale, colors, card, colorblind]);

  const skillIcons = useMemo(() => {
    if (card.type_code === 'investigator' || (
      card.skill_willpower === null &&
      card.skill_intellect === null &&
      card.skill_combat === null &&
      card.skill_agility === null &&
      card.skill_wild === null)) {
      return null;
    }
    return (
      <View style={styles.skillIcons}>
        { map(SKILLS, (skill: SkillCodeType) => <SkillIcons key={skill} skill={skill} count={card.skillCount(skill)} />) }
      </View>
    );
  }, [card]);

  const tabooBlock = useMemo(() => {
    if (!card.taboo_set_id || card.taboo_set_id === 0 || card.taboo_placeholder) {
      return null;
    }
    const TABOO_ICON_SIZE = 14 * fontScale;
    return (
      <View style={styles.tabooBlock}>
        { !!card.extra_xp && (
          <Text style={[typography.small, styles.extraXp, { color: colors.taboo }]} numberOfLines={1} ellipsizeMode="clip">
            { repeat(card.extra_xp > 0 ? '•' : '-', Math.abs(card.extra_xp)) }
          </Text>
        ) }
        { !!(card.taboo_set_id && card.taboo_set_id > 0) && (
          <ArkhamIcon name="tablet" size={TABOO_ICON_SIZE} color={colors.taboo} />
        ) }
      </View>
    );
  }, [colors, fontScale, typography, card]);
  const cardName = useMemo(() => {
    const color = (card.faction2_code ?
      colors.faction.dual :
      colors.faction[card.factionCode()]
    ).text;
    return (
      <View style={styles.cardNameBlock}>
        <View style={[styles.row, space.paddingTopXs, { backgroundColor: 'transparent' }]}>
          <Text style={[
            typography.cardName,
            { color },
            invalid ? { textDecorationLine: 'line-through' } : {},
          ]} numberOfLines={1} ellipsizeMode="clip">
            { card.renderName }
          </Text>
          { tabooBlock }
          { !!card.advanced && (
            <View style={styles.tabooBlock}>
              <ArkhamIcon name="parallel" size={18 * fontScale} color={colors.darkText} />
            </View>
          ) }
        </View>
        { true && (
          <View style={[styles.row, { backgroundColor: 'transparent' }]}>
            { dualFactionIcons }
            { skillIcons }
            { !!card.renderSubname && (
              <View style={[styles.row, styles.subname, space.marginRightS, space.paddingTopXs]}>
                <Text style={typography.cardTraits} numberOfLines={1} ellipsizeMode="clip">
                  { card.renderSubname }
                </Text>
              </View>
            ) }
          </View>
        ) }
      </View>
    );
  }, [colors, fontScale, typography, card, invalid, tabooBlock, skillIcons, dualFactionIcons]);

  if (!card) {
    return (
      <View style={[
        styles.rowContainer,
        noBorder ? {} : styles.rowBorder,
        borderStyle,
        {
          height: rowHeight(fontScale),
          backgroundColor: backgroundColor || colors.background,
        },
        (!control && !noSidePadding) ? styles.rowPadding : {},
      ]}>
        <View style={styles.cardNameBlock}>
          <View style={styles.row}>
            <Text style={typography.text}>
              Unknown Card
            </Text>
          </View>
        </View>
      </View>
    );
  }
  if (!card.name) {
    return (
      <View style={[
        styles.rowContainer,
        noBorder ? {} : styles.rowBorder,
        borderStyle,
        {
          height: rowHeight(fontScale),
          backgroundColor: backgroundColor || colors.background,
        },
        (!control && !noSidePadding) ? styles.rowPadding : {},
      ]}>
        <Text>No Text</Text>;
      </View>
    );
  }

  return (
    <View style={[
      styles.rowContainer,
      !noBorder ? styles.rowBorder : undefined,
      borderStyle,
      {
        height: rowHeight(fontScale),
        backgroundColor: backgroundColor || colors.background,
      },
      (!control && !noSidePadding) ? styles.rowPadding : undefined,
    ]}>
      <TouchableOpacity
        onPress={handleCardPress}
        disabled={!onPress && !onPressId}
        style={[styles.row, styles.fullHeight]}
        testID={`SearchCard-${card.code}`}
        delayPressIn={5}
        delayPressOut={5}
        delayLongPress={5}
      >
        <View opacity={faded ? 0.5 : 1.0} style={[
          styles.cardTextRow,
          !noSidePadding ? space.paddingLeftS : undefined,
        ]}>
          <CardIcon card={card} />
          { cardName }
        </View>
      </TouchableOpacity>
      { !!control && <ControlComponent control={control} card={card} /> }
    </View>
  );
}
export default React.memo(CardSearchResult);


const styles = StyleSheet.create({
  rowContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
  },
  rowPadding: {
    paddingLeft: s,
    paddingRight: s,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardNameBlock: {
    marginLeft: xs,
    marginTop: xs,
    marginBottom: xs,
    marginRight: xs / 2,
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fullHeight: {
  },
  skillIcons: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginRight: s,
  },
  dualFactionIcons: {
    flexDirection: 'row',
    marginRight: s,
  },
  skillIcon: {
    marginRight: xs / 2,
  },
  subname: {
    backgroundColor: 'transparent',
  },
  factionIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: xs,
  },
  cardTextRow: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabooBlock: {
    marginLeft: s,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  extraXp: {
    marginRight: xs,
  },
  investigatorFactionIcon: {
    marginBottom: 4,
  },
});
