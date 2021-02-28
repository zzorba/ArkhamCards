import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';
import { find , map } from 'lodash';
import Collapsible from 'react-native-collapsible';
import { t } from 'ttag';

import { showCard, showDeckModal } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { CampaignId, Deck, TraumaAndCardData } from '@actions/types';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import Card, { CardsMap } from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import useSingleCard from '@components/card/useSingleCard';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import InvestigatorImage from '@components/core/InvestigatorImage';
import space, { s } from '@styles/space';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useEffectUpdate, useFlag } from '@components/core/hooks';
import AppIcon from '@icons/AppIcon';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';
import TraumaSummary from '../TraumaSummary';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import useXpSection from './useXpSection';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  investigator: Card;
  spentXp: number;
  totalXp: number;
  traumaAndCardData: TraumaAndCardData;
  playerCards: CardsMap;
  chooseDeckForInvestigator?: (investigator: Card) => void;
  deck?: Deck;
  showXpDialog: (investigator: Card) => void;
  removeInvestigator?: (investigator: Card) => void;
  // For legacy system
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
  showTraumaDialog?: (investigator: Card, traumaData: TraumaAndCardData) => void;
  miniButtons?: React.ReactNode;

  children?: React.ReactNode;
}

function StoryAssetRow({ code, onCardPress, last }: { code: string; last: boolean; onCardPress: (card: Card) => void }) {
  const [card, loading] = useSingleCard(code, 'player');
  if (loading || !card) {
    return <LoadingCardSearchResult />;
  }
  return (
    <CardSearchResult
      key={card.code}
      onPress={onCardPress}
      card={card}
      noBorder={last}
    />
  );
}

export default function InvestigatorCampaignRow({
  componentId,
  campaignId,
  investigator,
  spentXp,
  totalXp,
  showXpDialog,
  traumaAndCardData,
  playerCards,
  chooseDeckForInvestigator,
  deck,
  removeInvestigator,
  showDeckUpgrade,
  showTraumaDialog,
  children,
  miniButtons,
}: Props) {
  const { colors, typography, width } = useContext(StyleContext);
  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);
  const eliminated = useMemo(() => investigator.eliminated(traumaAndCardData), [investigator, traumaAndCardData]);

  const editXpPressed = useCallback(() => {
    showXpDialog(investigator);
  }, [showXpDialog, investigator]);

  const [xpButton, upgradeBadge] = useXpSection({
    componentId,
    deck,
    cards: playerCards,
    investigator,
    showDeckUpgrade,
    last: !miniButtons,
    totalXp,
    spentXp,
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
          <StoryAssetRow key={asset} code={asset} onCardPress={onCardPress} last={idx === storyAssets.length - 1} />
        )) }
      </View>
    );
  }, [traumaAndCardData, onCardPress]);

  const removePressed = useCallback(() => {
    if (removeInvestigator) {
      removeInvestigator(investigator);
    }
  }, [investigator, removeInvestigator]);

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

  const yithian = useMemo(() => !!find(traumaAndCardData.storyAssets || [], asset => asset === BODY_OF_A_YITHIAN), [traumaAndCardData.storyAssets]);
  const [open, toggleOpen] = useFlag(false);
  const openAnim = useRef(new Animated.Value(0));
  useEffectUpdate(() => {
    Animated.timing(
      openAnim.current,
      {
        toValue: open ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }
    ).start();
  }, [open]);
  const iconRotate = openAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '-180deg'],
    extrapolate: 'clamp',
  });
  return (
    <View style={space.marginBottomS}>
      <TouchableWithoutFeedback onPress={toggleOpen}>
        <RoundedFactionHeader eliminated={eliminated} faction={investigator.factionCode()} width={width - s * 2} fullRound={!open}>
          <View style={[styles.row, space.paddingLeftXs]}>
            <InvestigatorImage
              card={investigator}
              size="tiny"
              border
              yithian={yithian}
              killedOrInsane={eliminated}
              badge={upgradeBadge ? 'upgrade' : undefined}
            />
            <View style={[space.paddingLeftXs, styles.textColumn]}>
              <Text style={[typography.cardName, typography.white, eliminated ? typography.strike : undefined]}>
                { investigator.name }
              </Text>
              <Text style={[typography.cardTraits, typography.white, eliminated ? typography.strike : undefined]}>
                { investigator.subname }
              </Text>
            </View>
            { !open && <View style={styles.trauma}><TraumaSummary trauma={traumaAndCardData} investigator={investigator} whiteText /></View> }
            <Animated.View style={{ width: 36, height: 36, transform: [{ rotate: iconRotate }] }}>
              <AppIcon name="expand_less" size={36} color="#FFF" />
            </Animated.View>
          </View>
        </RoundedFactionHeader>
      </TouchableWithoutFeedback>
      <Collapsible collapsed={!open}>
        <View style={[
          styles.block,
          {
            borderColor: colors.faction[investigator.factionCode()].background,
            backgroundColor: colors.background,
          },
          space.paddingTopS,
        ]}>
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
          <RoundedFooterDoubleButton
            onPressA={deck ? viewDeck : selectDeck}
            iconA="deck"
            titleA={deck ? t`View deck` : t`Select deck`}
            onPressB={removePressed}
            iconB="dismiss"
            titleB={deck ? t`Remove deck` : t`Remove`}
          />
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  textColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  trauma: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
