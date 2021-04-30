import { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { map } from 'lodash';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { Platform } from 'react-native';

import { CampaignId, Deck, DeckId, getDeckId } from '@actions/types';
import { addInvestigator } from '@components/campaign/actions';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import Card from '@data/types/Card';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions } from '@data/remote/decks';
import { UpdateCampaignActions } from '@data/remote/campaigns';
import { AppState } from '@reducers';

type AsyncDispatch = ThunkDispatch<AppState, unknown, Action>;

export default function useChooseDeck(createDeckActions: DeckActions, updateActions: UpdateCampaignActions) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch: AsyncDispatch = useDispatch();
  const doAddInvestigator = useCallback(async(campaignId: CampaignId, code: string, deckId?: DeckId) => {
    await dispatch(addInvestigator(user, createDeckActions, updateActions, campaignId, code, deckId));
  }, [dispatch, user, createDeckActions, updateActions]);

  const showChooseDeck = useCallback((
    campaignId: CampaignId,
    campaignInvestigators: Card[],
    singleInvestigator?: Card,
    callback?: (code: string) => Promise<void>
  ) => {
    const onDeckSelect = async(deck: Deck) => {
      await doAddInvestigator(campaignId, deck.investigator_code, getDeckId(deck));
      if (callback) {
        await callback(deck.investigator_code);
      }
    };
    const onInvestigatorSelect = async(card: Card) => {
      await doAddInvestigator(campaignId, card.code);
      if (callback) {
        await callback(card.code);
      }
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