import React, { MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { filter, find, flatMap, flatten, forEach, map, sum, sumBy, uniqBy } from 'lodash';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { c, msgid, t } from 'ttag';

import {
  CampaignId,
  CardId,
  Deck,
  DeckId,
  DeckMeta,
  DeckProblem,
  EditDeckState,
  ParsedDeck,
  Slots,
  SplitCards,
} from '@actions/types';
import COLORS from '@styles/colors';
import { showCard, showCardSwipe } from '@components/nav/helper';
import DeckProgressComponent from '../DeckProgressComponent';
import { CardSectionHeaderData } from '@components/core/CardSectionHeader';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { BODY_OF_A_YITHIAN, ENABLE_SIDE_DECK, RANDOM_BASIC_WEAKNESS, TypeCodeType } from '@app_constants';
import DeckValidation from '@lib/DeckValidation';
import Card, { CardsMap } from '@data/types/Card';
import TabooSet from '@data/types/TabooSet';
import space, { isBig, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useSettingValue } from '@components/core/hooks';
import { setDeckTabooSet, updateDeckMeta } from '@components/deck/actions';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import DeckSectionBlock from '@components/deck/section/DeckSectionBlock';
import DeckMetadataComponent from './DeckMetadataComponent';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckPickerStyleButton from '../controls/DeckPickerStyleButton';
import { useDeckXpStrings } from '../hooks';
import DeckMetadataControls from '../controls/DeckMetadataControls';
import { FOOTER_HEIGHT } from '@components/deck/DeckNavFooter';
import { ControlType } from '@components/cardlist/CardSearchResult/ControlComponent';
import { getPacksInCollection } from '@reducers';
import InvestigatorSummaryBlock from '@components/card/InvestigatorSummaryBlock';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import ArkhamLoadingSpinner from '@components/core/ArkhamLoadingSpinner';
import { DeckOverlapComponentForCampaign } from './DeckOverlapComponent';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import useParsedDeckComponent from '../useParsedDeckComponent';

interface SectionCardId extends CardId {
  mode: 'special' | 'side' | 'bonded' | undefined;
  hasUpgrades: boolean;
  index: number;
}

interface CardSection extends CardSectionHeaderData {
  id: string;
  cards: SectionCardId[];
  first?: boolean;
  last?: boolean;
}

interface DeckSection {
  title: string;
  onTitlePress?: () => void;
  sections: CardSection[];
  toggleCollapsed?: () => void;
  collapsed?: boolean;
}


interface Props {
  componentId: string;
  suggestArkhamDbLogin: boolean;
  deck: Deck;
  deckId: DeckId;
  investigatorFront?: Card;
  investigatorBack?: Card;
  parsedDeck: ParsedDeck;
  hasPendingEdits?: boolean;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  bondedCardsByName: {
    [name: string]: Card[];
  };
  requiredCards?: CardId[];
  fromCampaign?: boolean;
  campaignId?: CampaignId;
  visible: boolean;
  editable: boolean;
  buttons?: ReactNode;
  showDrawWeakness: () => void;
  showEditSpecial?: () => void;
  showEditSide?: () => void;
  showXpAdjustmentDialog: () => void;
  showCardUpgradeDialog: (card: Card) => void;
  tabooSet?: TabooSet;
  tabooOpen: boolean;
  singleCardView: boolean;
  tabooSetId?: number;
  showTaboo: boolean;
  signedIn: boolean;
  login: () => void;
  problem?: DeckProblem;
  showEditCards: () => void;
  showDeckHistory: () => void;
  width: number;
  deckEdits?: EditDeckState;
  deckEditsRef: MutableRefObject<EditDeckState | undefined>;
  mode: 'view' | 'edit' | 'upgrade';
}

export default function DeckViewTab(props: Props) {
  const {
    componentId,
    suggestArkhamDbLogin,
    fromCampaign,
    tabooSetId,
    cards,
    deckId,
    investigatorFront,
    investigatorBack,
    deck,
    parsedDeck,
    singleCardView,
    requiredCards,
    showEditCards,
    showEditSpecial,
    showEditSide,
    cardsByName,
    bondedCardsByName,
    editable,
    showCardUpgradeDialog,
    problem,
    showXpAdjustmentDialog,
    showDrawWeakness,
    visible,
    tabooSet,
    showTaboo,
    tabooOpen,
    buttons,
    campaignId,
    showDeckHistory,
    deckEdits,
    deckEditsRef,
    mode,
  } = props;
  const { arkhamDb } = useContext(ArkhamCardsAuthContext);
  const { backgroundStyle, shadow, typography } = useContext(StyleContext);
  const investigator = useMemo(() => cards[deck.investigator_code], [cards, deck.investigator_code]);

  const showDeckUpgrades = useMemo(() => {
    return !!(deck.previousDeckId && !deck.nextDeckId);
  }, [deck.previousDeckId, deck.nextDeckId]);

  const dispatch = useDispatch();
  const setTabooSet = useCallback((tabooSetId: number | undefined) => {
    dispatch(setDeckTabooSet(deckId, tabooSetId || 0));
  }, [dispatch, deckId]);
  const setMeta = useCallback((key: keyof DeckMeta, value?: string) => {
    if (deckEditsRef.current) {
      dispatch(updateDeckMeta(deckId, deck.investigator_code, deckEditsRef.current, [{ key, value }]));
    }
  }, [dispatch, deckId, deck.investigator_code, deckEditsRef]);
  const setParallel = useCallback((front: string, back: string) => {
    if (deckEditsRef.current) {
      dispatch(updateDeckMeta(deckId, deck.investigator_code, deckEditsRef.current, [
        { key: 'alternate_front', value: front },
        { key: 'alternate_back', value: back },
      ]));
    }
  }, [dispatch, deckEditsRef, deckId, deck.investigator_code]);
  const [xpLabel, xpDetailLabel] = useDeckXpStrings(parsedDeck);

  const renderXpButton = useCallback((last: boolean) => {
    if (!xpLabel) {
      return null;
    }
    return (
      <DeckPickerStyleButton
        title={t`Upgrade experience`}
        valueLabel={xpLabel}
        valueLabelDescription={xpDetailLabel}
        editable={editable}
        onPress={showXpAdjustmentDialog}
        first
        last={last}
        icon="xp"
      />
    );
  }, [xpLabel, xpDetailLabel, showXpAdjustmentDialog, editable]);
  const investigatorOptions = useMemo(() => {
    if (!deckEdits?.meta || !investigator) {
      return null;
    }
    const hasTabooPicker = (tabooOpen || showTaboo || !!tabooSet);
    const changes = parsedDeck.changes;
    const hasXpButton = editable && !!(changes && deck.previousDeckId);
    return (
      <View style={[styles.optionsContainer, space.paddingS]}>
        <DeckMetadataControls
          tabooOpen={tabooOpen}
          editable={editable}
          tabooSetId={tabooSetId || 0}
          setTabooSet={hasTabooPicker ? setTabooSet : undefined}
          meta={deckEdits.meta}
          investigatorCode={deck?.investigator_code}
          setMeta={setMeta}
          setParallel={setParallel}
          firstElement={hasXpButton && !!changes && !!xpLabel ? renderXpButton : undefined}
          hasPreviousDeck={!!deck.previousDeckId}
        />
      </View>
    );
  }, [investigator, deck, tabooSetId, tabooSet, showTaboo, tabooOpen, editable, deckEdits?.meta, parsedDeck?.changes,
    setMeta, setParallel, setTabooSet, renderXpButton, xpLabel,
  ]);

  const investigatorBlock = useMemo(() => {
    const yithian = parsedDeck.slots && (parsedDeck.slots[BODY_OF_A_YITHIAN] || 0) > 0;
    const investigatorCard = (yithian ? cards[BODY_OF_A_YITHIAN] : undefined) || investigatorFront;

    if (!investigatorCard) {
      return null;
    }
    return (
      <InvestigatorSummaryBlock
        investigator={investigatorCard}
        investigatorBack={investigatorBack}
        yithian={yithian}
        componentId={componentId}
        tabooSetId={tabooSetId}
      />
    );
  }, [componentId, parsedDeck.slots, cards, investigatorFront, investigatorBack, tabooSetId]);
  const [parsedDeckComponent, bondedCardCount] = useParsedDeckComponent({
    componentId,
    parsedDeck,
    visible,
    cards,
    meta: deckEdits?.meta,
    tabooSetId,
    mode,

    editable,
    showEditCards,
    showEditSpecial,
    showEditSide,
    showDrawWeakness,
    showCardUpgradeDialog: showDeckUpgrades ? showCardUpgradeDialog : undefined,
    deckEditsRef,
    requiredCards,
    cardsByName,
    bondedCardsByName,
  });
  const header = useMemo(() => {
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.headerBlock}>
          <View style={styles.containerWrapper}>
            <View style={styles.container}>
              { investigatorBlock }
            </View>
            { deckEdits?.mode === 'view' && (
              <DeckMetadataComponent
                parsedDeck={parsedDeck}
                bondedCardCount={bondedCardCount}
                problem={problem}
              />
            ) }
            { investigatorOptions }
          </View>
          { buttons }
        </View>
      </View>
    );
  }, [investigatorBlock, investigatorOptions, buttons, parsedDeck, bondedCardCount, problem, deckEdits]);
  if (!deckEdits) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      { suggestArkhamDbLogin && (
        <View opacity={0.95} style={[
          styles.banner,
          shadow.large,
          space.paddingVerticalXs,
          space.paddingSideS,
          { backgroundColor: COLORS.red },
        ]}>
          <Text style={[space.paddingS, typography.small, typography.white]}>
            { arkhamDb ?
              t`This appears to be one of your decks from ArkhamDB, however you seem to be logged into a different ArkhamDB account? If you wish to make edits, please login through the app settings.` :
              t`This appears to be one of your decks from ArkhamDB, however you are not currently logged in. If you wish to make edits, please login through the app settings.` }
          </Text>
        </View>
      ) }
      { header }
      <View style={space.marginSideS}>
        { parsedDeckComponent }
        <DeckProgressComponent
          componentId={componentId}
          cards={cards}
          deckId={deckId}
          deck={deck}
          parsedDeck={parsedDeck}
          editable={editable}
          showDeckHistory={showDeckHistory}
          tabooSetId={tabooSetId}
          singleCardView={singleCardView}
        />

        { !!campaignId && !parsedDeck.deck?.nextDeckId && (
          <DeckOverlapComponentForCampaign
            campaignId={campaignId}
            componentId={componentId}
            parsedDeck={parsedDeck}
            live={!fromCampaign}
            cards={cards}
          />
        ) }
      </View>
      <View style={styles.footerPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
  },
  headerWrapper: {
    position: 'relative',
  },
  containerWrapper: {
    flexDirection: isBig ? 'row' : 'column',
  },
  container: {
    marginLeft: s,
    marginRight: s,
    flexDirection: 'row',
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  headerBlock: {
    paddingBottom: s,
    position: 'relative',
  },
  footerPadding: {
    height: FOOTER_HEIGHT,
  },
});
