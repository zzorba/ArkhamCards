import React, { ReactNode, useCallback, useContext, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ngettext, msgid } from 'ttag';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import { Campaign, Deck, getDeckId } from '@actions/types';
import Card from '@data/types/Card';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import { getProblemMessage } from '@components/core/DeckProblemRow';
import { toRelativeDateString } from '@lib/datetime';
import { parseBasicDeck } from '@lib/parseDeck';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { usePlayerCards, usePressCallback } from '@components/core/hooks';
import { TINY_PHONE } from '@styles/sizes';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import InvestigatorImage from '@components/core/InvestigatorImage';
import ArkhamButtonIcon from '@icons/ArkhamButtonIcon';
import WarningIcon from '@icons/WarningIcon';
import { useDeckXpStrings } from '@components/deck/hooks';

interface Props {
  lang: string;
  deck: Deck;
  previousDeck?: Deck;
  deckToCampaign?: { [deck_id: string]: Campaign };
  investigator?: Card;
  onPress?: (deck: Deck, investigator?: Card) => void;
  details?: ReactNode;
  subDetails?: ReactNode;
  viewDeckButton?: boolean;
  killedOrInsane?: boolean;
  width: number;
}

interface DetailProps {
  investigator?: Card;
  campaign?: Campaign;
  deck: Deck;
  previousDeck?: Deck;
  details?: ReactNode;
  lang: string;
  eliminated: boolean;
}

function DetailLine({ text, icon, last }: { text: string; icon: React.ReactNode; last?: boolean }) {
  const { borderStyle, typography } = useContext(StyleContext);
  return (
    <View style={[
      styles.detailLine,
      space.paddingSideXs,
      space.paddingBottomS,
      space.marginBottomS,
      borderStyle,
      !last ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
    ]}>
      <View style={space.marginRightS}>
        { icon }
      </View>
      <Text style={[typography.smallLabel, typography.italic, typography.dark, styles.flex]}>
        { text }
      </Text>
    </View>
  );
}

function DeckListRowDetails({
  investigator,
  campaign,
  deck,
  details,
  previousDeck,
  eliminated,
}: DetailProps) {
  const { colors, typography } = useContext(StyleContext);
  const loadingAnimation = useCallback((props: any) => <Fade {...props} style={{ backgroundColor: colors.L20 }} />, [colors]);
  const cards = usePlayerCards(deck.taboo_id || 0);
  const parsedDeck = useMemo(() => deck && cards && parseBasicDeck(deck, cards, previousDeck), [deck, cards, previousDeck]);
  const [mainXpString, xpDetailString] = useDeckXpStrings(parsedDeck);
  if (details) {
    return (
      <>
        { details }
      </>
    );
  }
  if (!parsedDeck || !investigator) {
    return (
      <Placeholder Animation={loadingAnimation}>
        <PlaceholderLine color={colors.L10} height={11} width={80} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
        <PlaceholderLine color={colors.L10} height={11} width={40} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
        <PlaceholderLine color={colors.L10} height={11} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
        <PlaceholderLine color={colors.L10} height={11} width={60} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
      </Placeholder>
    );
  }
  const xpString = xpDetailString ? `${mainXpString} · ${xpDetailString}` : mainXpString;
  const scenarioCount = deck.scenarioCount || 0;
  const traumaData = campaign && campaign.investigatorData?.[investigator.code];
  const campaignLines: string[] = [];
  if (campaign) {
    campaignLines.push(campaign.name);
  }
  if (eliminated) {
    campaignLines.push(investigator.traumaString(traumaData));
  } else {
    campaignLines.push(
      ngettext(
        msgid`${scenarioCount} scenario completed`,
        `${scenarioCount} scenarios completed`,
        scenarioCount
      )
    );
  }
  return (
    <View style={styles.column}>
      <DetailLine
        icon={<ArkhamButtonIcon icon="campaign" color="dark" />}
        text={campaignLines.join('\n')}
        last={!xpString && !deck.problem}
      />
      { eliminated && (
        <Text style={typography.small}>
          { investigator.traumaString(traumaData) }
        </Text>
      ) }
      { !!xpString && (
        <DetailLine
          icon={<ArkhamButtonIcon icon="xp" color="dark" />}
          text={xpString}
          last={!deck.problem}
        />
      ) }
      { !!deck.problem && (
        <DetailLine
          icon={<WarningIcon size={20} />}
          text={getProblemMessage({ reason: deck.problem })}
          last
        />
      ) }
    </View>
  );
}

export default function NewDeckListRow({
  lang,
  deck,
  previousDeck,
  deckToCampaign,
  investigator,
  onPress,
  details,
  subDetails,
  viewDeckButton,
  killedOrInsane,
  width,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const onDeckPressFunction = useCallback(() => {
    onPress && onPress(deck, investigator);
  }, [deck, investigator, onPress]);
  const onDeckPress = usePressCallback(onDeckPressFunction);
  const yithian = useMemo(() => !!deck.slots && (deck.slots[BODY_OF_A_YITHIAN] || 0) > 0, [deck.slots]);
  const campaign = deck && deckToCampaign && deckToCampaign[getDeckId(deck).uuid];
  const eliminated = useMemo(() => {
    if (killedOrInsane) {
      return true;
    }
    if (!investigator) {
      return false;
    }
    const traumaData = campaign && campaign.investigatorData?.[investigator.code];
    return investigator.eliminated(traumaData);
  }, [killedOrInsane, investigator, campaign]);

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

    const date: undefined | string = deck.date_update || deck.date_creation;
    const parsedDate: number | undefined = date ? Date.parse(date) : undefined;
    const dateStr = parsedDate ? toRelativeDateString(new Date(parsedDate), lang) : undefined;
    return (
      <View style={[space.paddingSideS, space.paddingTopS]}>
        <RoundedFactionBlock
          faction={faction || 'neutral'}
          header={(
            <RoundedFactionHeader faction={faction} width={width - s * 2}>
              <View style={space.paddingSideS}>
                <Text style={[typography.large, typography.white]} numberOfLines={1} ellipsizeMode="tail">
                  { deck.name }
                </Text>
                <Text style={[typography.smallLabel, typography.italic, typography.white]}>
                  { investigator?.name || '' }
                </Text>
              </View>
            </RoundedFactionHeader>
          )}
          footer={(
            <View style={[{ backgroundColor: colors.L10 }, styles.footer]}>
              <View style={space.marginRightS}>
                <ArkhamButtonIcon icon="deck" color="dark" />
              </View>
              <Text style={[typography.smallLabel, typography.italic, typography.dark]}>
                { dateStr || ''}
              </Text>
            </View>
          )}
        >
          <View style={styles.deckRow}>
            <View style={styles.image}>
              <InvestigatorImage
                card={investigator}
                killedOrInsane={eliminated}
                yithian={yithian}
                border
              />
            </View>
            <View style={styles.investigatorBlock}>
              <View style={styles.investigatorBlockRow}>
                <View style={[styles.column, styles.titleColumn]}>
                  <DeckListRowDetails
                    deck={deck}
                    previousDeck={previousDeck}
                    investigator={investigator}
                    campaign={campaign}
                    eliminated={eliminated}
                    lang={lang}
                    details={details}
                  />
                </View>
              </View>
              { subDetails }
            </View>
          </View>
        </RoundedFactionBlock>
      </View>
    );
  }, [colors, previousDeck, yithian, eliminated, deck, campaign, investigator, subDetails, lang, details, width, typography]);

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
  if (viewDeckButton || !investigator) {
    return contents;
  }
  return (
    <TouchableOpacity onPress={onDeckPress}>
      { contents }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  investigatorBlockRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  investigatorBlock: {
    paddingTop: s,
    paddingBottom: s,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  loading: {
    marginLeft: 10,
  },
  titleColumn: {
    flex: 1,
  },
  image: {
    marginTop: s,
    marginBottom: m,
    marginRight: m,
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
    padding: s,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailLine: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
});
