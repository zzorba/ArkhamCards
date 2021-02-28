import React, { useCallback, useContext, useMemo, useState } from 'react';
import { forEach, keys, map, sortBy } from 'lodash';
import { ScrollView, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { EditDeckProps } from './DeckEditView';
import { CampaignDrawWeaknessProps } from '@components/campaign/CampaignDrawWeaknessDialog';
import { CardDetailProps } from '@components/card/CardDetailView';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { DrawWeaknessProps } from '@components/weakness/WeaknessDrawDialog';
import { NavigationProps } from '@components/nav/types';
import { RANDOM_BASIC_WEAKNESS, ACE_OF_RODS_CODE } from '@app_constants';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ArkhamButton from '@components/core/ArkhamButton';
import { useDeck, usePlayerCards } from '@components/core/hooks';
import { useDispatch } from 'react-redux';
import { setIgnoreDeckSlot } from './actions';
import { useDeckEdits } from './hooks';
import { useAlertDialog } from './dialogs';
import { CampaignId, DeckId } from '@actions/types';

export interface EditSpecialCardsProps {
  id: DeckId;
  campaignId?: CampaignId;
  assignedWeaknesses?: string[];
}

function EditSpecialDeckCardsView(props: EditSpecialCardsProps & NavigationProps) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { componentId, campaignId, assignedWeaknesses, id } = props;
  const [unsavedAssignedWeaknesses, setUnsavedAssignedWeaknesses] = useState<string[]>(assignedWeaknesses || []);
  const [deck] = useDeck(id);
  const dispatch = useDispatch();
  const [deckEdits, deckEditsRef] = useDeckEdits(id);

  const cardPressed = useCallback((card: Card) => {
    Navigation.push<CardDetailProps>(componentId, {
      component: {
        name: 'Card',
        passProps: {
          id: card.code,
          pack_code: card.pack_code,
          showSpoilers: true,
        },
      },
    });
  }, [componentId]);
  const cards = usePlayerCards();

  const editStoryPressed = useCallback(() => {
    const investigator = deck && cards && cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.EditAddCards',
        passProps: {
          id,
          storyOnly: true,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Edit Story Cards`,
              color: 'white',
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, deck, cards, colors, id]);

  const isSpecial = useCallback((card: Card) => {
    return !!(card.code === ACE_OF_RODS_CODE || (deckEditsRef.current && deckEditsRef.current.ignoreDeckLimitSlots[card.code] > 0));
  }, [deckEditsRef]);

  const saveWeakness = useCallback((code: string, replaceRandomBasicWeakness: boolean) => {
    if (!deckEditsRef.current) {
      return;
    }
    if (replaceRandomBasicWeakness && deckEditsRef.current.slots[RANDOM_BASIC_WEAKNESS] > 0) {
      dispatch({ type: 'UPDATE_DECK_EDIT_COUNTS', countType: 'slots', operation: 'dec', id, code: RANDOM_BASIC_WEAKNESS });
    }
    dispatch({ type: 'UPDATE_DECK_EDIT_COUNTS', countType: 'slots', operation: 'inc', id, code });
    setUnsavedAssignedWeaknesses([...unsavedAssignedWeaknesses, code]);
  }, [unsavedAssignedWeaknesses, id, deckEditsRef, dispatch, setUnsavedAssignedWeaknesses]);

  const editCollection = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  }, [componentId]);

  const showWeaknessDialog = useCallback(() => {
    if (!deckEditsRef.current) {
      return;
    }
    const investigator = deck && cards && cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<DrawWeaknessProps>(componentId, {
      component: {
        name: 'Weakness.Draw',
        passProps: {
          slots: deckEditsRef.current.slots,
          saveWeakness,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Draw Weaknesses`,
              color: COLORS.white,
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, cards, deck, colors, deckEditsRef, saveWeakness]);
  const [alertDialog, showAlert] = useAlertDialog();
  const drawWeakness = useCallback(() => {
    showAlert(
      t`Draw Basic Weakness`,
      t`This deck does not seem to be part of a campaign yet.\n\nIf you add this deck to a campaign, the app can keep track of the available weaknesses between multiple decks.\n\nOtherwise, you can draw random weaknesses from your entire collection.`,
      [
        { text: t`Draw From Collection`, icon: 'draw', style: 'default', onPress: showWeaknessDialog },
        { text: t`Edit Collection`, icon: 'edit', onPress: editCollection },
        { text: t`Cancel`, style: 'cancel' },
      ]);
  }, [showWeaknessDialog, editCollection, showAlert]);

  const showCampaignWeaknessDialog = useCallback(() => {
    if (!campaignId || !deckEditsRef.current) {
      return;
    }
    const investigator = deck && cards && cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<CampaignDrawWeaknessProps>(componentId, {
      component: {
        name: 'Dialog.CampaignDrawWeakness',
        passProps: {
          campaignId,
          deckSlots: deckEditsRef.current.slots,
          saveWeakness,
          unsavedAssignedCards: unsavedAssignedWeaknesses,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: t`Draw Weaknesses`,
              color: COLORS.white,
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, deck, cards, colors, deckEditsRef, unsavedAssignedWeaknesses, saveWeakness]);

  const drawWeaknessButton = useMemo(() => {
    return (
      <ArkhamButton
        icon="card"
        title={t`Draw Basic Weakness`}
        onPress={campaignId ? showCampaignWeaknessDialog : drawWeakness}
      />
    );
  }, [campaignId, showCampaignWeaknessDialog, drawWeakness]);

  const weaknesses = useMemo(() => {
    if (!deckEdits) {
      return [];
    }
    const weaknesses: Card[] = [];
    forEach(keys(deckEdits.slots), code => {
      const card = cards && cards[code];
      if (card && card.subtype_code === 'basicweakness') {
        weaknesses.push(card);
      }
    });
    return weaknesses;
  }, [deckEdits, cards]);

  const basicWeaknessSection = useMemo(() => {
    if (!deckEdits) {
      return null;
    }
    return (
      <>
        <CardSectionHeader section={{ title: t`Basic weakness` }} />
        { map(sortBy(weaknesses, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            onPress={cardPressed}
            control={{
              type: 'count',
              count: deckEdits.slots[card.code] || 0,
            }}
          />
        )) }
        { drawWeaknessButton }
      </>
    );
  }, [weaknesses, deckEdits, drawWeaknessButton, cardPressed]);


  const storyCards = useMemo(() => {
    if (!deckEdits) {
      return [];
    }
    const storyCards: Card[] = [];
    forEach(keys(deckEdits.slots), code => {
      const card = cards && cards[code];
      if (card && card.mythos_card) {
        storyCards.push(card);
      }
    });
    return storyCards;
  }, [deckEdits, cards]);
  const storySection = useMemo(() => {
    if (!deckEdits) {
      return null;
    }
    return (
      <>
        <CardSectionHeader section={{ title: t`Story` }} />
        { map(sortBy(storyCards, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            onPress={cardPressed}
            control={{
              type: 'count',
              count: deckEdits.slots[card.code],
            }}
          />
        )) }
        <ArkhamButton
          icon="edit"
          title={t`Edit Story Cards`}
          onPress={editStoryPressed}
        />
      </>
    );
  }, [deckEdits, storyCards, cardPressed, editStoryPressed]);
  const setIgnoreCardCount = useCallback((card: Card, count: number) => {
    dispatch(setIgnoreDeckSlot(id, card.code, count));
  }, [dispatch, id]);
  const ignoreCardsSection = useMemo(() => {
    if (!deckEdits) {
      return null;
    }
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={deckEdits.slots}
        counts={deckEdits.ignoreDeckLimitSlots}
        updateCount={setIgnoreCardCount}
        filterCard={isSpecial}
        header={<CardSectionHeader section={{ title: t`Do not count towards deck size` }} />}
      />
    );
  }, [componentId, setIgnoreCardCount, deckEdits, isSpecial]);

  return (
    <>
      <ScrollView style={[styles.wrapper, backgroundStyle]}>
        { ignoreCardsSection }
        { storySection }
        { basicWeaknessSection }
      </ScrollView>
      { alertDialog }
    </>
  );
}

EditSpecialDeckCardsView.options = () => {
  return {
    topBar: {
      backButton: {
        title: t`Back`,
      },
    },
  };
};

export default EditSpecialDeckCardsView;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
