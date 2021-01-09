import React, { useCallback, useContext, useMemo } from 'react';
import { Button, Text, View, Platform, StyleSheet } from 'react-native';
import { find , map } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import DeckXpSection from './DeckXpSection';
import BasicListRow from '@components/core/BasicListRow';
import { showCard, showDeckModal } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { Deck, TraumaAndCardData } from '@actions/types';
import CardSectionHeader from '@components/core/CardSectionHeader';
import InvestigatorRow from '@components/core/InvestigatorRow';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import Card, { CardsMap } from '@data/Card';
import COLORS from '@styles/colors';
import PickerStyleButton from '@components/core/PickerStyleButton';
import StyleContext from '@styles/StyleContext';
import useSingleCard from '@components/card/useSingleCard';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import ArkhamButton from '@components/core/ArkhamButton';

interface Props {
  componentId: string;
  campaignId: number;
  investigator: Card;
  spentXp: number;
  totalXp: number;
  incSpentXp: (code: string) => void;
  decSpentXp: (code: string) => void;
  traumaAndCardData: TraumaAndCardData;
  playerCards: CardsMap;
  chooseDeckForInvestigator?: (investigator: Card) => void;
  deck?: Deck;
  removeInvestigator?: (investigator: Card) => void;
  // For legacy system
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
  showTraumaDialog?: (investigator: Card, traumaData: TraumaAndCardData) => void;
}

function StoryAssetRow({ code, onCardPress }: { code: string, onCardPress: (card: Card) => void }) {
  const [card, loading] = useSingleCard(code, 'player');
  if (loading || !card) {
    return <LoadingCardSearchResult />;
  }
  return (
    <CardSearchResult
      key={card.code}
      onPress={onCardPress}
      card={card}
    />
  );
}

export default function InvestigatorCampaignRow({
  componentId,
  campaignId,
  investigator,
  spentXp,
  totalXp,
  incSpentXp,
  decSpentXp,
  traumaAndCardData,
  playerCards,
  chooseDeckForInvestigator,
  deck,
  removeInvestigator,
  showDeckUpgrade,
  showTraumaDialog,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const incXp = useCallback(() => {
    incSpentXp(investigator.code);
  }, [investigator, incSpentXp]);

  const decXp = useCallback(() => {
    decSpentXp(investigator.code);
  }, [investigator, decSpentXp]);

  const xpSection = useMemo(() => {
    if (deck) {
      return (
        <DeckXpSection
          componentId={componentId}
          deck={deck}
          cards={playerCards}
          investigator={investigator}
          showDeckUpgrade={showDeckUpgrade}
        />
      );
    }
    if (totalXp === 0) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Experience points` }}
        />
        <BasicListRow>
          <Text style={typography.text}>
            { t`${spentXp} of ${totalXp} spent` }
          </Text>
          <PlusMinusButtons
            count={spentXp}
            max={totalXp}
            onIncrement={incXp}
            onDecrement={decXp}
          />
        </BasicListRow>
      </>
    );
  }, [incXp, decXp, investigator, componentId, deck, playerCards, spentXp, totalXp, showDeckUpgrade, typography]);

  const onTraumaPress = useCallback(() => {
    if (showTraumaDialog) {
      showTraumaDialog(investigator, traumaAndCardData);
    }
  }, [traumaAndCardData, investigator, showTraumaDialog]);

  const traumaSection = useMemo(() => {
    return (
      <PickerStyleButton
        id="trauma"
        onPress={onTraumaPress}
        disabled={!showTraumaDialog}
        title={investigator.traumaString(traumaAndCardData)}
        widget="nav"
        noBorder
        settingsStyle
      />
    );
  }, [onTraumaPress, traumaAndCardData, investigator, showTraumaDialog]);

  const storyAssetSection = useMemo(() => {
    const storyAssets = traumaAndCardData.storyAssets || [];
    if (!storyAssets.length) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Campaign cards` }}
        />
        { map(storyAssets, asset => (
          <StoryAssetRow key={asset} code={asset} onCardPress={onCardPress} />
        )) }
      </>
    );
  }, [traumaAndCardData, investigator, onCardPress]);

  const removePressed = useCallback(() => {
    if (removeInvestigator) {
      removeInvestigator(investigator);
    }
  }, [investigator, removeInvestigator]);

  const details = useMemo(() => {
    if (removeInvestigator) {
      return (
        <BasicButton
          title={deck ? t`Remove deck` : t`Remove investigator`}
          onPress={removePressed}
          color={COLORS.red}
        />
      );
    }
    return (
      <>
        { xpSection }
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Trauma` }}
        />
        { traumaSection }
        { storyAssetSection }
      </>
    );
  }, [investigator, removeInvestigator, deck, removePressed, xpSection, traumaSection, storyAssetSection]);

  const viewDeck = useCallback(() => {
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        colors,
        investigator,
        { campaignId, hideCampaign: true }
      );
    }
  }, [campaignId, componentId, investigator, deck, colors]);

  const selectDeck = useCallback(() => {
    chooseDeckForInvestigator && chooseDeckForInvestigator(investigator);
  }, [investigator, chooseDeckForInvestigator]);
  const eliminated = useMemo(() => investigator.eliminated(traumaAndCardData), [investigator, traumaAndCardData]);

  const button = useMemo(() => {
    const traumaButton = (!!showTraumaDialog && eliminated) && (
      <ArkhamButton
        icon="edit"
        title={t`Edit Trauma`}
        onPress={onTraumaPress}
        grow
      />
    );

    if (deck) {
      return (
        <View style={styles.column}>
          <ArkhamButton
            title={t`View deck`}
            icon="deck"
            onPress={viewDeck}
            grow
          />
          { traumaButton }
        </View>
      );
    }
    if (!chooseDeckForInvestigator) {
      return traumaButton || <View />;
    }
    return (
      <View style={styles.column}>
        <ArkhamButton
          icon="deck"
          grow
          title={t`Select deck`}
          onPress={selectDeck}
        />
        { traumaButton }
      </View>
    );
  }, [eliminated, deck, chooseDeckForInvestigator, showTraumaDialog, onTraumaPress, viewDeck, selectDeck]);

  return (
    <InvestigatorRow
      investigator={investigator}
      description={eliminated ? investigator.traumaString(traumaAndCardData) : undefined}
      button={button}
      eliminated={eliminated}
      yithian={!!find(traumaAndCardData.storyAssets || [], asset => asset === BODY_OF_A_YITHIAN)}
    >
      { eliminated ? undefined : details }
    </InvestigatorRow>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
