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
import { map } from 'lodash';

import { Campaign } from '@actions/types';
import Card from '@data/types/Card';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import { getProblemMessage } from '@components/core/DeckProblemRow';
import { toRelativeDateString } from '@lib/datetime';
import { parseBasicDeck } from '@lib/parseDeck';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { usePlayerCards, usePressCallback } from '@components/core/hooks';
import { TINY_PHONE } from '@styles/sizes';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import InvestigatorImage from '@components/core/InvestigatorImage';
import ArkhamButtonIcon from '@icons/ArkhamButtonIcon';
import WarningIcon from '@icons/WarningIcon';
import { useDeckXpStrings } from '@components/deck/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  lang: string;
  deck: LatestDeckT;
  investigator?: Card;
  onPress?: (deck: LatestDeckT, investigator: Card | undefined) => void;
  details?: ReactNode;
  subDetails?: ReactNode;
  viewDeckButton?: boolean;
  killedOrInsane?: boolean;
  width: number;
}

interface DetailProps {
  investigator?: Card;
  campaign?: Campaign;
  deck: LatestDeckT;
  details?: ReactNode;
  lang: string;
  eliminated: boolean;
}

function DetailLine({ text, icon, last }: { text: string[]; icon: React.ReactNode; last?: boolean }) {
  const { borderStyle, typography } = useContext(StyleContext);
  return (
    <View style={[
      styles.detailLine,
      space.paddingRightXs,
      space.paddingBottomS,
      space.marginBottomS,
      borderStyle,
      !last ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
    ]}>
      <View style={space.marginRightS}>
        { icon }
      </View>
      <View style={[styles.column, { flex: 1 }]}>
        { map(text, (line, idx) => (
          <Text key={idx} style={[typography.smallLabel, typography.italic, typography.dark, styles.flex]} numberOfLines={1} ellipsizeMode="tail">
            { line }
          </Text>
        )) }
      </View>

    </View>
  );
}

function DeckListRowDetails({
  investigator,
  deck,
  details,
  eliminated,
}: DetailProps) {
  const { colors, typography } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);
  const loadingAnimation = useCallback((props: any) => <Fade {...props} style={{ backgroundColor: colors.L20 }} />, [colors]);
  const cards = usePlayerCards(deck.deck.taboo_id || 0);
  const parsedDeck = useMemo(() => (!details && deck && cards) ? parseBasicDeck(deck.deck, cards, deck.previousDeck) : undefined, [deck, cards, details]);
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
  const scenarioCount = deck.deck.scenarioCount || 0;
  const traumaData = deck.campaign?.trauma;
  const campaignLines: string[] = [];
  if (deck.campaign) {
    campaignLines.push(deck.campaign.name);
  }
  if (eliminated) {
    campaignLines.push(investigator.traumaString(listSeperator, traumaData));
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
        text={campaignLines}
        last={!xpString && !deck.deck.problem}
      />
      { eliminated && (
        <Text style={typography.small}>
          { investigator.traumaString(listSeperator, traumaData) }
        </Text>
      ) }
      { !!xpString && (
        <DetailLine
          icon={<ArkhamButtonIcon icon="xp" color="dark" />}
          text={[xpString]}
          last={!deck.deck.problem}
        />
      ) }
      { !!deck.deck.problem && (
        <DetailLine
          icon={<WarningIcon size={20} />}
          text={[getProblemMessage({ reason: deck.deck.problem })]}
          last
        />
      ) }
    </View>
  );
}

export default function NewDeckListRow({
  lang,
  deck,
  investigator,
  onPress,
  details,
  subDetails,
  viewDeckButton,
  killedOrInsane,
  width,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const loadingAnimation = useCallback((props: any) => <Fade {...props} style={{ backgroundColor: colors.L20 }} />, [colors]);
  const onDeckPressFunction = useCallback(() => {
    onPress && onPress(deck, investigator);
  }, [deck, investigator, onPress]);
  const onDeckPress = usePressCallback(onDeckPressFunction);
  const yithian = useMemo(() => !!deck.deck.slots && (deck.deck.slots[BODY_OF_A_YITHIAN] || 0) > 0, [deck.deck.slots]);
  const eliminated = useMemo(() => {
    if (killedOrInsane) {
      return true;
    }
    if (!investigator) {
      return false;
    }
    return investigator.eliminated(deck.campaign?.trauma);
  }, [killedOrInsane, investigator, deck]);

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

    const date: undefined | string = deck.deck.date_update || deck.deck.date_creation;
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
                  { deck.deck.name }
                </Text>
                { investigator?.name ? (
                  <Text style={[typography.smallLabel, typography.italic, typography.white]}>
                    { investigator?.name || '' }
                  </Text>
                ) : (
                  <Placeholder Animation={loadingAnimation}>
                    <PlaceholderLine color={colors.M} height={10} width={25} style={{ marginTop: 4, marginBottom: 2 }} />
                  </Placeholder>
                ) }
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
                    investigator={investigator}
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
  }, [colors, yithian, eliminated, loadingAnimation, deck, investigator, subDetails, lang, details, width, typography]);

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
    marginBottom: s,
    marginRight: s,
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
