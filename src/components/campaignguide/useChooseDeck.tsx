import { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { map } from 'lodash';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { Platform } from 'react-native';

import { CampaignCycleCode, CampaignId, Deck, DeckId, getDeckId, OZ } from '@actions/types';
import { addInvestigator } from '@components/campaign/actions';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import Card from '@data/types/Card';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions } from '@data/remote/decks';
import { UpdateCampaignActions } from '@data/remote/campaigns';
import { AppState } from '@reducers';

type AsyncDispatch = ThunkDispatch<AppState, unknown, Action>;

type ChooseDeckType = (
  campaignId: CampaignId,
  cycleCode: CampaignCycleCode | undefined,
  campaignInvestigators: Card[],
  singleInvestigator?: Card,
  callback?: (code: string) => Promise<void>,
) => void;

type AddInvestigatorType = (campaignId: CampaignId, code: string, deckId?: DeckId) => Promise<void>;

export default function useChooseDeck(createDeckActions: DeckActions, updateActions: UpdateCampaignActions): [
  ChooseDeckType,
  AddInvestigatorType,
] {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const dispatch: AsyncDispatch = useDispatch();
  const doAddInvestigator = useCallback(async(campaignId: CampaignId, code: string, deckId?: DeckId) => {
    await dispatch(addInvestigator(userId, createDeckActions, updateActions, campaignId, code, deckId));
  }, [dispatch, userId, createDeckActions, updateActions]);

  const showChooseDeck = useCallback((
    campaignId: CampaignId,
    cycleCode: CampaignCycleCode | undefined,
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
      singleInvestigator: singleInvestigator.alternate_of_code ?? singleInvestigator.code,
      onDeckSelect,
    } : {
      campaignId: campaignId,
      selectedInvestigatorIds: map(
        campaignInvestigators,
        investigator => investigator.alternate_of_code ?? investigator.code
      ),
      onDeckSelect,
      onInvestigatorSelect,
      simpleOptions: true,
      includeParallel: cycleCode === OZ,
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
  return [showChooseDeck, doAddInvestigator];
}