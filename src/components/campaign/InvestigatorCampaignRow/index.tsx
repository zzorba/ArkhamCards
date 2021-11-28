import React, { useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { find , map } from 'lodash';
import { t } from 'ttag';
import { useSelector } from 'react-redux';

import { showCard, showDeckModal } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { Deck, TraumaAndCardData } from '@actions/types';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import Card, { CardsMap } from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import useSingleCard from '@components/card/useSingleCard';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import space, { s } from '@styles/space';
import { useFlag } from '@components/core/hooks';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';
import TraumaSummary from '../TraumaSummary';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import useXpSection from './useXpSection';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import { AppState, makeUploadingDeckSelector } from '@reducers';
import { AnimatedCompactInvestigatorRow } from '@components/core/CompactInvestigatorRow';
import CampaignGuide from '@data/scenario/CampaignGuide';

interface Props {
  componentId: string;
  campaign: MiniCampaignT;
  investigator: Card;
  spentXp: number;
  totalXp: number;
  unspentXp: number;
  campaignGuide?: CampaignGuide;
  traumaAndCardData: TraumaAndCardData;
  playerCards: CardsMap;
  badge?: 'deck' | 'upgrade';
  chooseDeckForInvestigator?: (investigator: Card) => void;
  deck?: LatestDeckT;
  showXpDialog: (investigator: Card) => void;
  removeInvestigator?: (investigator: Card) => void;
  // For legacy system
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
  showTraumaDialog?: (investigator: Card, traumaData: TraumaAndCardData) => void;
  miniButtons?: React.ReactNode;

  children?: React.ReactNode;
}

function StoryAssetRow({ code, onCardPress, last, campaignGuide, count }: { code: string; campaignGuide?: CampaignGuide; last: boolean; count?: number; onCardPress: (card: Card) => void }) {
  const [card, loading] = useSingleCard(code, 'player');
  const description = useMemo(() => {
    return campaignGuide?.card(code)?.description;
  }, [campaignGuide, code]);
  if (loading || !card) {
    return <LoadingCardSearchResult />;
  }
  return (
    <CardSearchResult
      key={card.code}
      onPress={onCardPress}
      card={card}
      description={description}
      noBorder={last}
      control={count ? {
        type: 'count',
        count,
      } : undefined}
    />
  );
}

export default function InvestigatorCampaignRow({
  componentId,
  campaign,
  campaignGuide,
  investigator,
  spentXp,
  totalXp,
  unspentXp,
  traumaAndCardData,
  playerCards,
  deck,
  children,
  miniButtons,
  badge,
  showXpDialog,
  chooseDeckForInvestigator,
  removeInvestigator,
  showDeckUpgrade,
  showTraumaDialog,
}: Props) {
  const uploadingSelector = useMemo(makeUploadingDeckSelector, []);
  const uploading = useSelector((state: AppState) => uploadingSelector(state, campaign.id, investigator.code));
  const { colors, width, typography } = useContext(StyleContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);
  const eliminated = useMemo(() => investigator.eliminated(traumaAndCardData), [investigator, traumaAndCardData]);

  const editXpPressed = useCallback(() => {
    showXpDialog(investigator);
  }, [showXpDialog, investigator]);
  const canRemoveDeck = !deck?.owner || (userId && deck.owner.id === userId);

  const [xpButton, upgradeBadge] = useXpSection({
    deck,
    campaign,
    cards: playerCards,
    investigator,
    last: !miniButtons,
    totalXp,
    spentXp,
    unspentXp,
    uploading,
    isDeckOwner: !!canRemoveDeck,
    showDeckUpgrade,
    editXpPressed,
  });

  const onTraumaPress = useCallback(() => {
    if (showTraumaDialog) {
      showTraumaDialog(investigator, traumaAndCardData);
    }
  }, [traumaAndCardData, investigator, showTraumaDialog]);

  const storyAssetSection = useMemo(() => {
    const storyAssets = traumaAndCardData.storyAssets || [];
    if (!storyAssets.length) {
      return null;
    }
    return (
      <View style={space.paddingBottomS}>
        <DeckSlotHeader title={t`Campaign cards`} first />
        { map(storyAssets, (asset, idx) => (
          <StoryAssetRow
            key={asset}
            campaignGuide={campaignGuide}
            code={asset}
            onCardPress={onCardPress}
            last={idx === storyAssets.length - 1}
            count={traumaAndCardData.cardCounts?.[asset]}
          />
        )) }
      </View>
    );
  }, [traumaAndCardData, onCardPress, campaignGuide]);

  const removePressed = useCallback(() => {
    if (removeInvestigator) {
      removeInvestigator(investigator);
    }
  }, [investigator, removeInvestigator]);

  const viewDeck = useCallback(() => {
    if (deck) {
      showDeckModal(
        deck.id,
        deck.deck,
        campaign?.id,
        colors,
        investigator,
      );
    }
  }, [campaign, investigator, deck, colors]);

  const selectDeck = useCallback(() => {
    chooseDeckForInvestigator && chooseDeckForInvestigator(investigator);
  }, [investigator, chooseDeckForInvestigator]);

  const yithian = useMemo(() => !!find(traumaAndCardData.storyAssets || [], asset => asset === BODY_OF_A_YITHIAN), [traumaAndCardData.storyAssets]);
  const [open, toggleOpen] = useFlag(false);
  const footerButton = useMemo(() => {
    if (uploading) {
      return (
        <RoundedFooterButton
          icon="spinner"
          title={t`Uploading...`}
        />
      );
    }
    if (deck && !canRemoveDeck) {
      return (
        <RoundedFooterButton
          onPress={viewDeck}
          icon="deck"
          title={t`View deck`}
        />
      );
    }
    return (
      <RoundedFooterDoubleButton
        onPressA={deck ? viewDeck : selectDeck}
        iconA="deck"
        titleA={deck ? t`View deck` : t`Select deck`}
        onPressB={removePressed}
        iconB="dismiss"
        titleB={deck ? t`Remove deck` : t`Remove`}
      />
    )
  }, [uploading, deck, canRemoveDeck, viewDeck, selectDeck, removePressed]);
  return (
    <View style={space.marginBottomS}>
      <AnimatedCompactInvestigatorRow
        toggleOpen={toggleOpen}
        investigator={investigator}
        eliminated={eliminated}
        yithian={yithian}
        open={open}
        badge={badge || (upgradeBadge ? 'upgrade' : undefined)}
        width={width - s * 2}
        headerContent={!open && (
          <View style={styles.trauma}>
            <TraumaSummary trauma={traumaAndCardData} investigator={investigator} whiteText />
            { uploading && (
              <View style={[styles.trauma, space.marginLeftXs]}>
                <Text style={[typography.text, typography.white, space.marginRightXs]}>{t`Uploading`}</Text>
                <ActivityIndicator size="small" color="#FFFFFF" animating />
              </View>
            ) }
          </View>
        ) }
      >
        <View style={[space.paddingSideS]}>
          <View style={space.paddingBottomS}>
            <MiniPickerStyleButton
              title={t`Trauma`}
              valueLabel={<TraumaSummary trauma={traumaAndCardData} investigator={investigator} />}
              first
              last={!xpButton && !miniButtons}
              editable={!!showTraumaDialog}
              onPress={onTraumaPress}
            />
            { xpButton }
            { !!miniButtons && miniButtons }
          </View>
          { eliminated ? undefined : (
            <>
              { storyAssetSection }
              { children }
            </>
          ) }
        </View>
        { footerButton }
      </AnimatedCompactInvestigatorRow>
    </View>
  );
}

const styles = StyleSheet.create({
  trauma: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
