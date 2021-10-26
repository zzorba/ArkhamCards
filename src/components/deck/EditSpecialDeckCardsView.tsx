import React, { useCallback, useContext, useMemo } from 'react';
import { forEach, keys, map, sortBy } from 'lodash';
import { ScrollView, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { useDispatch } from 'react-redux';

import { EditDeckProps } from './DeckEditView';
import { CardDetailProps } from '@components/card/CardDetailView';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { NavigationProps } from '@components/nav/types';
import { ACE_OF_RODS_CODE } from '@app_constants';
import Card from '@data/types/Card';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ArkhamButton from '@components/core/ArkhamButton';
import { usePlayerCards } from '@components/core/hooks';
import { useCampaignDeck } from '@data/hooks';
import { setIgnoreDeckSlot } from './actions';
import { useDeckEdits, useShowDrawWeakness } from './hooks';
import { useAlertDialog } from './dialogs';
import { CampaignId, DeckId } from '@actions/types';
import StyleContext from '@styles/StyleContext';

export interface EditSpecialCardsProps {
  id: DeckId;
  campaignId?: CampaignId;
  assignedWeaknesses?: string[];
}

function EditSpecialDeckCardsView(props: EditSpecialCardsProps & NavigationProps) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { componentId, campaignId, assignedWeaknesses, id } = props;
  const deck = useCampaignDeck(id, campaignId);
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
  const [alertDialog, showAlert] = useAlertDialog();
  const showDrawWeakness = useShowDrawWeakness({
    componentId,
    deck,
    id,
    campaignId,
    showAlert,
    deckEditsRef,
    assignedWeaknesses,
    cards,
  });

  const editStoryPressed = useCallback(() => {
    const investigator = deck && cards && cards[deck.deck.investigator_code];
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


  const editWeaknessPressed = useCallback(() => {
    const investigator = deck && cards && cards[deck.deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.EditAddCards',
        passProps: {
          id,
          weaknessOnly: true,
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
        <ArkhamButton
          icon="edit"
          title={t`Edit Weakness Cards`}
          onPress={editWeaknessPressed}
        />
        <ArkhamButton
          icon="card"
          title={t`Draw Basic Weakness`}
          onPress={showDrawWeakness}
        />
      </>
    );
  }, [weaknesses, deckEdits, showDrawWeakness, editWeaknessPressed, cardPressed]);


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
