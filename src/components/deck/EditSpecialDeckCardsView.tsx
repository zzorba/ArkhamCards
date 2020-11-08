import React, { useCallback, useContext, useMemo, useState } from 'react';
import { forEach, keys, map, sortBy } from 'lodash';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { EditDeckProps } from './DeckEditView';
import { CampaignDrawWeaknessProps } from '@components/campaign/CampaignDrawWeaknessDialog';
import { CardDetailProps } from '@components/card/CardDetailView';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { DrawWeaknessProps } from '@components/weakness/WeaknessDrawDialog';
import { NavigationProps } from '@components/nav/types';
import { Deck, DeckMeta, Slots } from '@actions/types';
import { RANDOM_BASIC_WEAKNESS, ACE_OF_RODS_CODE } from '@app_constants';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ArkhamButton from '@components/core/ArkhamButton';
import { usePlayerCards, useSlots } from '@components/core/hooks';

export interface EditSpecialCardsProps {
  deck: Deck;
  meta: DeckMeta;
  previousDeck?: Deck;
  xpAdjustment?: number;
  campaignId?: number;
  updateSlots: (slots: Slots) => void;
  updateIgnoreDeckLimitSlots: (slots: Slots) => void;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  assignedWeaknesses?: string[];
}

function EditSpecialDeckCardsView(props: EditSpecialCardsProps & NavigationProps) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { componentId, deck, meta, previousDeck, xpAdjustment, campaignId, assignedWeaknesses } = props;
  const [slots, updateSlotsState] = useSlots(props.slots, props.updateSlots);
  const [ignoreDeckLimitSlots, updateIgnoreDeckLimitSlotsState] = useSlots(props.ignoreDeckLimitSlots, props.updateIgnoreDeckLimitSlots);
  const [unsavedAssignedWeaknesses, setUnsavedAssignedWeaknesses] = useState<string[]>(assignedWeaknesses || []);

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

  const updateSlots = useCallback((newSlots: Slots) => {
    updateSlotsState({ type: 'sync', slots: newSlots });
  }, [updateSlotsState]);

  const editStoryPressed = useCallback(() => {
    const investigator = cards && cards[deck.investigator_code];
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.Edit',
        passProps: {
          deck,
          meta,
          previousDeck,
          slots,
          ignoreDeckLimitSlots,
          updateSlots,
          xpAdjustment: xpAdjustment,
          tabooSetOverride: deck.taboo_id || 0,
          storyOnly: true,
        },
        options: {
          statusBar: {
            style: 'light',
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
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  }, [componentId, deck, meta, previousDeck, cards, xpAdjustment, slots, ignoreDeckLimitSlots, colors, updateSlots]);

  const isSpecial = useCallback((card: Card) => {
    return card.code === ACE_OF_RODS_CODE || ignoreDeckLimitSlots[card.code] > 0;
  }, [ignoreDeckLimitSlots]);

  const saveWeakness = useCallback((code: string, replaceRandomBasicWeakness: boolean) => {
    const newSlots = { ...slots };
    if (replaceRandomBasicWeakness && slots[RANDOM_BASIC_WEAKNESS] > 0) {
      newSlots[RANDOM_BASIC_WEAKNESS]--;
      if (!newSlots[RANDOM_BASIC_WEAKNESS]) {
        delete newSlots[RANDOM_BASIC_WEAKNESS];
      }
    }
    updateSlots(newSlots);
    setUnsavedAssignedWeaknesses([...unsavedAssignedWeaknesses, code]);
  }, [slots, unsavedAssignedWeaknesses, updateSlots, setUnsavedAssignedWeaknesses]);

  const editCollection = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  }, [componentId]);

  const showWeaknessDialog = useCallback(() => {
    const investigator = cards && cards[deck.investigator_code];
    Navigation.push<DrawWeaknessProps>(componentId, {
      component: {
        name: 'Weakness.Draw',
        passProps: {
          slots,
          saveWeakness,
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
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  }, [componentId, cards, deck, colors, slots, saveWeakness]);
  const drawWeakness = useCallback(() => {
    Alert.alert(
      t`Draw Basic Weakness`,
      t`This deck does not seem to be part of a campaign yet.\n\nIf you add this deck to a campaign, the app can keep track of the available weaknesses between multiple decks.\n\nOtherwise, you can draw random weaknesses from your entire collection.`,
      [
        { text: t`Draw From Collection`, style: 'default', onPress: showWeaknessDialog },
        { text: t`Edit Collection`, onPress: editCollection },
        { text: t`Cancel`, style: 'cancel' },
      ]);
  }, [showWeaknessDialog, editCollection]);

  const showCampaignWeaknessDialog = useCallback(() => {
    if (!campaignId) {
      return;
    }
    const investigator = cards && cards[deck.investigator_code];
    Navigation.push<CampaignDrawWeaknessProps>(componentId, {
      component: {
        name: 'Dialog.CampaignDrawWeakness',
        passProps: {
          campaignId,
          deckSlots: slots,
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
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, deck, cards, colors, slots, unsavedAssignedWeaknesses, saveWeakness]);

  const onIgnoreDeckLimitSlotsChange = useCallback((ignoreDeckLimitSlots: Slots) => {
    updateIgnoreDeckLimitSlotsState({ type: 'sync', slots: ignoreDeckLimitSlots });
  }, [updateIgnoreDeckLimitSlotsState]);

  const drawWeaknessButton = useMemo(() => {
    return (
      <ArkhamButton
        icon="card"
        title={t`Draw Basic Weakness`}
        onPress={campaignId ? showCampaignWeaknessDialog : drawWeakness}
      />
    );
  }, [campaignId, showCampaignWeaknessDialog, drawWeakness]);

  const basicWeaknessSection = useMemo(() => {
    const weaknesses: Card[] = [];
    forEach(keys(slots), code => {
      const card = cards && cards[code];
      if (card && card.subtype_code === 'basicweakness') {
        weaknesses.push(card);
      }
    });

    return (
      <>
        <CardSectionHeader section={{ title: t`Basic weakness` }} />
        { map(sortBy(weaknesses, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            count={slots[card.code]}
            onPress={cardPressed}
          />
        )) }
        { drawWeaknessButton }
      </>
    );
  }, [cards, slots, drawWeaknessButton, cardPressed]);

  const storySection = useMemo(() => {
    const storyCards: Card[] = [];
    forEach(keys(slots), code => {
      const card = cards && cards[code];
      if (card && card.mythos_card) {
        storyCards.push(card);
      }
    });

    return (
      <>
        <CardSectionHeader section={{ title: t`Story` }} />
        { map(sortBy(storyCards, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            count={slots[card.code]}
            onPress={cardPressed}
          />
        )) }
        <ArkhamButton
          icon="edit"
          title={t`Edit Story Cards`}
          onPress={editStoryPressed}
        />
      </>
    );
  }, [cards, slots, cardPressed, editStoryPressed]);

  const ignoreCardsSection = useMemo(() => {
    const header = (
      <CardSectionHeader section={{ title: t`Do not count towards deck size` }} />
    );
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={slots}
        counts={ignoreDeckLimitSlots}
        updateCounts={onIgnoreDeckLimitSlotsChange}
        filterCard={isSpecial}
        header={header}
      />
    );
  }, [componentId, ignoreDeckLimitSlots, slots, onIgnoreDeckLimitSlotsChange, isSpecial]);

  return (
    <ScrollView style={[styles.wrapper, backgroundStyle]}>
      { ignoreCardsSection }
      { storySection }
      { basicWeaknessSection }
    </ScrollView>
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
