import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import ArkhamButton from '@components/core/ArkhamButton';
import ChangesFromPreviousDeck from './ChangesFromPreviousDeck';
import EditTraumaComponent from '@components/campaign/EditTraumaComponent';
import CampaignSummaryComponent from '@components/campaign/CampaignSummaryComponent';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { Campaign, Deck, ParsedDeck, Slots, Trauma } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import space, { l, m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

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
  xpAdjustment: number;
  showDeckUpgrade?: () => void;
  tabooSetId?: number;
  renderFooter?: (slots?: Slots) => React.ReactNode;
  onDeckCountChange?: (code: string, count: number) => void;
  singleCardView?: boolean;
}

interface ReduxActionProps {
  fetchPrivateDeck: (deckId: number) => void;
  fetchPublicDeck: (deckId: number, useDeckEndpoint: boolean) => void;
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
  xpAdjustment,
  showDeckUpgrade,
  tabooSetId,
  renderFooter,
  onDeckCountChange,
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
  const campaignSection = useMemo(() => {
    if (!editable) {
      return null;
    }
    return (
      <React.Fragment>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Campaign` }}
        />
        { !!campaign && !hideCampaign && (
          <View style={styles.campaign}>
            <Text style={[typography.text, space.marginBottomS]}>
              { campaign.name }
            </Text>
            <View style={space.marginBottomM}>
              <CampaignSummaryComponent campaign={campaign} hideScenario />
            </View>
            { !!showTraumaDialog && !campaign.guided && (
              <EditTraumaComponent
                investigator={investigator}
                investigatorData={investigatorData}
                showTraumaDialog={showTraumaDialog}
              />
            ) }
          </View>
        ) }
        { !!showDeckUpgrade && (
          <ArkhamButton
            icon="up"
            title={t`Upgrade Deck with XP`}
            onPress={showDeckUpgrade}
          />
        ) }
      </React.Fragment>
    );
  }, [
    campaign,
    investigatorData,
    investigator,
    showTraumaDialog,
    showDeckUpgrade,
    editable,
    hideCampaign,
    typography,
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
        xpAdjustment={xpAdjustment}
        tabooSetId={tabooSetId}
        renderFooter={renderFooter}
        onDeckCountChange={onDeckCountChange}
        singleCardView={singleCardView}
        editable={editable}
        onTitlePress={onTitlePress}
      />
      { !!editable && !!deck.previous_deck && !!showDeckHistory && (
        <ArkhamButton
          icon="deck"
          title={t`Upgrade History`}
          onPress={showDeckHistory}
        />
      ) }
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
