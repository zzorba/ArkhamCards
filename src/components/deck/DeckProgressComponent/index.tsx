import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import ChangesFromPreviousDeck from './ChangesFromPreviousDeck';
import CampaignSummaryComponent from '@components/campaign/CampaignSummaryComponent';
import { Campaign, Deck, ParsedDeck } from '@actions/types';
import { CardsMap } from '@data/Card';
import space, { l, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckSectionBlock from '../section/DeckSectionBlock';

interface Props {
  componentId: string;
  deck: Deck;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  isPrivate: boolean;
  editable: boolean;
  campaign?: Campaign;
  hideCampaign?: boolean;
  title?: string;
  onTitlePress?: (deck: ParsedDeck) => void;
  showDeckHistory?: () => void;
  showDeckUpgrade?: () => void;
  tabooSetId?: number;
  singleCardView?: boolean;
}

export default function DeckProgressComponent({
  componentId,
  deck,
  cards,
  parsedDeck,
  editable,
  campaign,
  hideCampaign,
  title,
  onTitlePress,
  showDeckHistory,
  showDeckUpgrade,
  tabooSetId,
  singleCardView,
}: Props) {
  const { typography } = useContext(StyleContext);
  const { investigator } = parsedDeck;
  const footerButton = useMemo(() => {
    if (!showDeckUpgrade) {
      return undefined;
    }
    return (
      <RoundedFooterButton
        title={t`Upgrade Deck with XP`}
        icon="up"
        onPress={showDeckUpgrade}
      />
    );
  }, [showDeckUpgrade]);
  const campaignSection = useMemo(() => {
    if (!editable) {
      return null;
    }
    return (
      <View style={space.paddingBottomS}>
        <DeckSectionBlock
          title={t`Campaign`}
          faction={investigator.factionCode()}
          footerButton={footerButton}
        >
          { !!campaign && !hideCampaign && (
            <View style={styles.campaign}>
              <View style={space.marginBottomM}>
                <CampaignSummaryComponent campaign={campaign} hideScenario />
              </View>
              <Text style={[typography.text, space.marginBottomS]}>
                { campaign.name }
              </Text>
            </View>
          ) }
        </DeckSectionBlock>
      </View>
    );
  }, [campaign, editable, hideCampaign, investigator, typography, footerButton]);

  if (!deck.previous_deck && !deck.next_deck && !campaign && !editable && !title) {
    return null;
  }

  // Actually compute the diffs.
  return (
    <View style={styles.container}>
      { campaignSection }
      { !!(!campaignSection || deck.previous_deck) && (
        <ChangesFromPreviousDeck
          componentId={componentId}
          title={title}
          cards={cards}
          parsedDeck={parsedDeck}
          tabooSetId={tabooSetId}
          singleCardView={singleCardView}
          editable={editable}
          onTitlePress={onTitlePress}
          footerButton={!!editable && !!deck.previous_deck && !!showDeckHistory && (
            <RoundedFooterButton
              icon="deck"
              title={t`Upgrade History`}
              onPress={showDeckHistory}
            />
          ) }
        />
      ) }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: xs,
    marginBottom: l,
  },
  campaign: {
    marginTop: s,
    marginLeft: s,
    marginRight: s,
  },
});
