import React, { useCallback, useContext, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { map } from 'lodash';

import { TouchableShrink } from '@components/core/Touchables';
import TagChiclet from '@components/deck/TagChiclet';
import { Campaign, ParsedDeck } from '@actions/types';
import Card from '@data/types/Card';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import { parseBasicDeck } from '@lib/parseDeck';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useLatestDeckCards, usePressCallback } from '@components/core/hooks';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import InvestigatorImage from '@components/core/InvestigatorImage';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import LanguageContext from '@lib/i18n/LanguageContext';
import AppIcon from '@icons/AppIcon';
import EncounterIcon from '@icons/EncounterIcon';
import COLORS from '@styles/colors';
import TraumaPile from '@components/campaign/TraumaPile';
import Ripple from '@lib/react-native-material-ripple';
import { xpString } from '@components/deck/hooks';

interface Props {
  lang: string;
  deck: LatestDeckT;
  investigator?: Card;
  onPress?: (deck: LatestDeckT, investigator: Card | undefined) => void;
  width: number;
  editDeckTags?: (deck: LatestDeckT, investigator: Card | undefined) => void;
}

interface DetailProps {
  investigator?: Card;
  campaign?: Campaign;
  deck: LatestDeckT;
  parsedDeck: ParsedDeck | undefined;
  lang: string;
}

function CircleIcon({ background, name, color, size }: { background: string; name: string; color: string; size?: 'small' }) {
  return (
    <View style={{ borderRadius: size === 'small' ? 9 : 14, width: size === 'small' ? 18 : 28, height: size === 'small' ? 18 : 28, backgroundColor: background, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <AppIcon name={name} size={size === 'small' ? 17 : 24} color={color} />
    </View>
  );
}

function DeckListRowDetails({
  investigator,
  deck,
  parsedDeck,
}: DetailProps) {
  const { colors, typography } = useContext(StyleContext);
  const loadingAnimation = useCallback((props: any) => <Fade {...props} style={{ backgroundColor: colors.L20 }} />, [colors]);
  const xpString = useMemo(() => {
    if (!parsedDeck) {
      return undefined;
    }
    if (parsedDeck.experience === 0) {
      return t`0 XP`;
    }
    if (!parsedDeck.changes) {
      return `${parsedDeck.experience}`;
    }
    if (parsedDeck.changes.spentXp > parsedDeck.availableExperience) {
      return `${parsedDeck.experience} (${parsedDeck.availableExperience - parsedDeck.changes.spentXp})`;
    }
    return `${parsedDeck.experience} (+${parsedDeck.availableExperience - parsedDeck.changes.spentXp})`;
  }, [parsedDeck]);

  if (!parsedDeck || !xpString || !investigator) {
    return (
      <Placeholder Animation={loadingAnimation} style={[space.marginSideS, space.marginTopS]}>
        <PlaceholderLine color={colors.L10} height={12} width={80} />
      </Placeholder>
    );
  }
  return (
    <View style={[
      styles.row,
      styles.footer,
      { alignItems: 'flex-end' },
      styles.flex,
    ]}>
      { !deck.campaign ? (
        <Text style={[typography.text, typography.italic, space.paddingTopXs, { color: colors.D15 }, styles.flex]}>
          { t`No campaign` }
        </Text>
      ) : (
        <>
          <View style={[styles.row, { alignItems: 'center' }, styles.flex]}>
            <EncounterIcon color={colors.D20} size={20} encounter_code={deck.campaign.cycleCode || 'core'} />
            <Text
              style={[space.marginLeftXs, typography.text, { color: colors.D15 }, typography.italic, styles.flex]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              { deck.campaign.name }
            </Text>
            <TraumaPile
              investigator={investigator}
              trauma={deck.campaign.trauma}
            />
            { !!parsedDeck.changes && (
              <View style={[space.paddingLeftS, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                <AppIcon name="xp-bold" size={24} color={colors.faction.dual.background} />
                <Text style={[typography.text, typography.boldItalic, typography.dark]}>
                  { (parsedDeck.availableExperience - parsedDeck.changes.spentXp > 0) ? `${parsedDeck.availableExperience - parsedDeck.changes.spentXp}` : `+${parsedDeck.availableExperience - parsedDeck.changes.spentXp}` }
                </Text>
              </View>
            ) }
          </View>
          { !!parsedDeck.changes && parsedDeck.availableExperience > 0 && parsedDeck.changes.spentXp === 0 && (
            <View style={space.marginLeftS}>
              <CircleIcon background={colors.upgrade} color={colors.D30} name="upgrade" />
            </View>
          ) }
        </>
      ) }
    </View>
  );
}

export default function ThinDeckListRow({
  lang,
  deck,
  investigator,
  onPress,
  width,
  editDeckTags,
}: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const loadingAnimation = useCallback((props: any) => <Fade {...props} style={{ backgroundColor: colors.L20 }} />, [colors]);
  const onDeckPressFunction = useCallback(() => {
    onPress && onPress(deck, investigator);
  }, [deck, investigator, onPress]);
  const onDeckPress = usePressCallback(onDeckPressFunction);
  const onEditDeckTags = useCallback(() => {
    editDeckTags?.(deck, investigator);
  }, [editDeckTags, deck, investigator]);
  const yithian = useMemo(() => !!deck.deck.slots && (deck.deck.slots[BODY_OF_A_YITHIAN] || 0) > 0, [deck.deck.slots]);
  const eliminated = useMemo(() => {
    if (!investigator) {
      return false;
    }
    return investigator.eliminated(deck.campaign?.trauma);
  }, [investigator, deck]);
  const [cards] = useLatestDeckCards(deck);
  const { listSeperator } = useContext(LanguageContext);
  const parsedDeck = useMemo(() => {
    if (deck && cards) {
      return parseBasicDeck(deck.deck, cards, listSeperator, deck.previousDeck);
    }
    return undefined;
  }, [deck, cards, listSeperator]);
  const tags = useMemo(() => {
    if (deck?.tags?.length) {
      return deck.tags;
    }
    if (!investigator) {
      return undefined;
    }
    return [investigator.factionCode()];
  }, [deck, investigator])

  const contents = useMemo(() => {
    const faction = investigator?.factionCode();
    if (!deck) {
      return (
        <View style={styles.row}>
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color={colors.lightText}
          />
        </View>
      );
    }
    return (
      <View style={[space.paddingSideS, space.paddingBottomXs]}>
        <View style={{ position: 'relative' }}>
          <RoundedFactionBlock
            faction={faction || 'neutral'}
            noSpace
            header={(
              <RoundedFactionHeader faction={faction} width={width - s * 2}>
                <View style={[space.paddingLeftS, { marginLeft: 60 + s, flexDirection: 'column' }, styles.flex]}>
                  <Text style={[typography.large, typography.white]} numberOfLines={1} ellipsizeMode="tail">
                    { deck.deck.name }
                  </Text>
                  { investigator?.name ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[typography.smallLabel, typography.italic, typography.white, styles.flex]}>
                        { investigator?.name || '' }
                      </Text>
                      { !!parsedDeck && (
                        <>
                          { parsedDeck.experience > 0 && (
                            <>
                              <View style={[space.marginLeftS, { marginRight: 1 }]}>
                                <AppIcon name="xp-bold" size={18} color={COLORS.white} />
                              </View>
                              <Text style={[typography.smallLabel, typography.boldItalic, typography.white]}>
                                { xpString(parsedDeck.experience) }
                              </Text>
                            </>
                          ) }
                          <View style={[space.marginLeftS, { marginRight: 1 }]}>
                            <AppIcon name="card-outline-bold" size={18} color={COLORS.white} />
                          </View>
                          <Text style={[typography.smallLabel, typography.boldItalic, typography.white]}>
                            { t`×${parsedDeck.totalCardCount}` }
                          </Text>
                        </>
                      ) }
                      { !!deck.deck.problem && (
                        <View style={space.marginLeftXs}>
                          <CircleIcon
                            size="small"
                            background={investigator.faction_code === 'survivor' ? COLORS.white : colors.warn} color={colors.D30}
                            name="warning-bold"
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    <Placeholder Animation={loadingAnimation}>
                      <PlaceholderLine color={colors.M} height={10} width={40} style={{ marginTop: 4, marginBottom: 2 }} />
                    </Placeholder>
                  ) }

                </View>
              </RoundedFactionHeader>
            )}
            footer={(
              <DeckListRowDetails
                deck={deck}
                parsedDeck={parsedDeck}
                investigator={investigator}
                lang={lang}
              />
            )}
          >
            <View style={styles.deckRow}>
              <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, styles.flex]}>
                <View style={{ width: 56 + s * 2 }} />
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <AppIcon name="tag-bold" size={18 * fontScale} color={colors.M} />
                </View>
                { !!tags ? map(tags, tag => <TagChiclet key={tag} tag={tag} />) : (
                  <Placeholder style={styles.flex} Animation={loadingAnimation}>
                    <PlaceholderLine color={colors.L10} height={30} width={40} style={{ marginLeft: 4, marginTop: 4, marginBottom: 2, borderRadius: 16 }} />
                  </Placeholder>
                )}
              </View>
              { !!editDeckTags && (
                <View style={[space.marginLeftXs, space.marginRightXs, space.marginTopXs]}>
                  <Ripple onPress={onEditDeckTags} style={{ width: 32, height: 32, borderRadius: 16 }} rippleColor={colors.L10}>
                    <View style={{ minWidth: 32, minHeight: 32, borderRadius: 16, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <AppIcon name="extra" size={24} color={colors.D10} />
                    </View>
                  </Ripple>
                </View>
              ) }
            </View>
          </RoundedFactionBlock>
          <View style={styles.image}>
            <InvestigatorImage
              card={investigator}
              killedOrInsane={eliminated}
              yithian={yithian}
              border
              round
              size="small"
            />
          </View>
        </View>
      </View>
    );
  }, [parsedDeck, colors, yithian, eliminated, editDeckTags, onEditDeckTags, tags, loadingAnimation, deck, investigator, lang, fontScale, width, typography]);

  if (!deck) {
    return (
      <View style={styles.row}>
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={colors.lightText}
        />
      </View>
    );
  }
  if (!investigator) {
    return contents;
  }
  return (
    <TouchableShrink onPress={onDeckPress}>
      { contents }
    </TouchableShrink>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loading: {
    marginLeft: 10,
  },
  image: {
    position: 'absolute',
    top: s * 2,
    left: s,
  },
  deckRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  footer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingLeft: 6,
    paddingRight: 6,
    paddingBottom: 6,
  },
  flex: {
    flex: 1,
  },
});
