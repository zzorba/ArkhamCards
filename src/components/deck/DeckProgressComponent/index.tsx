import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import ChangesFromPreviousDeck from './ChangesFromPreviousDeck';
import EditTraumaComponent from '@components/campaign/EditTraumaComponent';
import CampaignSummaryComponent from '@components/campaign/CampaignSummaryComponent';
import { Campaign, Deck, ParsedDeck, Trauma } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import space, { l, m, s } from '@styles/space';
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
  showTraumaDialog?: (investigator: Card, traumaData: Trauma) => void;
  showDeckHistory?: () => void;
  investigatorDataUpdates?: any;
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
  showTraumaDialog,
  showDeckHistory,
  investigatorDataUpdates,
  showDeckUpgrade,
  tabooSetId,
  singleCardView,
}: Props) {
  const { typography } = useContext(StyleContext);
  const investigatorData = useMemo(() => {
    if (!campaign) {
      return null;
    }
    return {
      ...(campaign.investigatorData || {}),
      ...investigatorDataUpdates,
    };
  }, [campaign, investigatorDataUpdates]);
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
            { !!showTraumaDialog && !campaign.guided && (
              <EditTraumaComponent
                investigator={investigator}
                investigatorData={investigatorData}
                showTraumaDialog={showTraumaDialog}
              />
            ) }
          </View>
        ) }
      </DeckSectionBlock>
    );
  }, [
    campaign,
    editable,
    hideCampaign,
    investigatorData,
    investigator,
    showTraumaDialog,
    typography,
    footerButton,
  ]);

  if (!deck.previous_deck && !deck.next_deck && !campaign && !editable && !title) {
    return null;
  }

  // Actually compute the diffs.
  return (
    <View style={styles.container}>
      { campaignSection }
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
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: m,
    marginBottom: l,
  },
  campaign: {
    marginTop: s,
    marginLeft: s,
    marginRight: s,
  },
});
