import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { map } from 'lodash';

import { Deck } from '@actions/types';
import { addInvestigator } from '@components/campaign/actions';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import Card from '@data/Card';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { Platform } from 'react-native';

export default function useChooseDeck() {
  const dispatch = useDispatch();
  const doAddInvestigator = useCallback((campaignId: number, code: string, deckId?: number) => {
    dispatch(addInvestigator(campaignId, code, deckId));
  }, [dispatch]);

  const showChooseDeck = useCallback((
    campaignId: number,
    campaignInvestigators: Card[],
    singleInvestigator?: Card,
    callback?: (code: string) => void
  ) => {
    const onDeckSelect = (deck: Deck) => {
      doAddInvestigator(campaignId, deck.investigator_code, deck.id);
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
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }, [doAddInvestigator]);
  return showChooseDeck;
}