import { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { map } from 'lodash';

import { CampaignId, Deck, DeckId, getDeckId } from '@actions/types';
import { addInvestigator } from '@components/campaign/actions';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import Card from '@data/types/Card';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { Platform } from 'react-native';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCreateDeckActions } from '@data/remote/decks';

export default function useChooseDeck() {
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const createDeckActions = useCreateDeckActions();
  const doAddInvestigator = useCallback((campaignId: CampaignId, code: string, deckId?: DeckId) => {
    dispatch(addInvestigator(user, createDeckActions, campaignId, code, deckId));
  }, [dispatch, user, createDeckActions]);

  const showChooseDeck = useCallback((
    campaignId: CampaignId,
    campaignInvestigators: Card[],
    singleInvestigator?: Card,
    callback?: (code: string) => void
  ) => {
    const onDeckSelect = (deck: Deck) => {
      doAddInvestigator(campaignId, deck.investigator_code, getDeckId(deck));
      callback && callback(deck.investigator_code);
    };
    const onInvestigatorSelect = (card: Card) => {
      doAddInvestigator(campaignId, card.code);
      callback && callback(card.code);
    };
    const passProps: MyDecksSelectorProps = singleInvestigator ? {
      campaignId: campaignId,
      singleInvestigator: singleInvestigator.code,
      onDeckSelect,
    } : {
      campaignId: campaignId,
      selectedInvestigatorIds: map(
        campaignInvestigators,
        investigator => investigator.code
      ),
      onDeckSelect,
      onInvestigatorSelect,
      simpleOptions: true,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps,
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.fullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }, [doAddInvestigator]);
  return showChooseDeck;
}