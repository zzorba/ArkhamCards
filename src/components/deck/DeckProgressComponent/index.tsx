import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import ChangesFromPreviousDeck from './ChangesFromPreviousDeck';
import CampaignSummaryComponent from '@components/campaign/CampaignSummaryComponent';
import { Campaign, CUSTOM, Deck, ParsedDeck } from '@actions/types';
import { CardsMap } from '@data/types/Card';
import space, { l, xs } from '@styles/space';
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
    if (!editable || campaign?.guided) {
      return null;
    }
    return (
      <View style={space.paddingBottomS}>
        <DeckSectionBlock
          title={t`Campaign`}
          faction={investigator.factionCode()}
          footerButton={footerButton}
          noSpace
        >
          { !!campaign && !hideCampaign && (
            <CampaignSummaryComponent campaign={campaign} hideScenario>
              { campaign.cycleCode !== CUSTOM && (
                <View style={[space.paddingTopS, space.paddingBottomS]}>
                  <Text style={typography.text}>
                    { campaign.name }
                  </Text>
                </View>
              ) }
            </CampaignSummaryComponent>
          ) }
        </DeckSectionBlock>
      </View>
    );
  }, [campaign, editable, hideCampaign, investigator, typography, footerButton]);

  if (!deck.previousDeckId && !deck.nextDeckId && !campaign && !editable && !title) {
    return null;
  }

  // Actually compute the diffs.
  return (
    <View style={styles.container}>
      { campaignSection }
      { !!(!campaignSection || deck.previousDeckId) && (
        <ChangesFromPreviousDeck
          componentId={componentId}
          title={title}
          cards={cards}
          parsedDeck={parsedDeck}
          tabooSetId={tabooSetId}
          singleCardView={singleCardView}
          editable={editable}
          onTitlePress={onTitlePress}
          footerButton={!!editable && !!deck.previousDeckId && !!showDeckHistory && (
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
});
