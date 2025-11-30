import { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { map } from 'lodash';

import { CampaignCycleCode, CampaignId, Deck, DeckId, getDeckId, OZ } from '@actions/types';
import { addInvestigator } from '@components/campaign/actions';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import Card from '@data/types/Card';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions } from '@data/remote/decks';
import { UpdateCampaignActions } from '@data/remote/campaigns';
import { AppState } from '@reducers';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { useNavigation } from '@react-navigation/native';

type AsyncDispatch = ThunkDispatch<AppState, unknown, Action>;

type ChooseDeckType = (
  campaignId: CampaignId,
  cycleCode: CampaignCycleCode | undefined,
  campaignInvestigators: CampaignInvestigator[],
  singleInvestigator?: CampaignInvestigator,
  callback?: (code: string) => Promise<void>,
) => void;

type AddInvestigatorType = (campaignId: CampaignId, card: Card, deckId?: DeckId) => Promise<void>;

export default function useChooseDeck(createDeckActions: DeckActions, updateActions: UpdateCampaignActions): [
  ChooseDeckType,
  AddInvestigatorType,
] {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const navigation = useNavigation();
  const dispatch: AsyncDispatch = useDispatch();
  const doAddInvestigator = useCallback(async(campaignId: CampaignId, card: Card, deckId?: DeckId) => {
    await dispatch(addInvestigator(userId, createDeckActions, updateActions, campaignId, card, deckId));
  }, [dispatch, userId, createDeckActions, updateActions]);

  const showChooseDeck = useCallback((
    campaignId: CampaignId,
    cycleCode: CampaignCycleCode | undefined,
    campaignInvestigators: CampaignInvestigator[],
    singleInvestigator?: CampaignInvestigator,
    callback?: (code: string) => Promise<void>
  ) => {
    const includeParallel = cycleCode === OZ;
    const onDeckSelect = async(deck: Deck, investigator: Card) => {
      await doAddInvestigator(campaignId, investigator, getDeckId(deck));
      if (callback) {
        const investigatorCode = (includeParallel ? deck.meta?.alternate_front : singleInvestigator?.code) ?? deck.investigator_code;
        await callback(investigatorCode);
      }
    };
    const onInvestigatorSelect = async(card: Card) => {
      await doAddInvestigator(campaignId, card);
      if (callback) {
        await callback(card.code);
      }
    };
    const passProps: MyDecksSelectorProps = singleInvestigator ? {
      campaignId: campaignId,
      singleInvestigator: singleInvestigator.code,
      onDeckSelect,
      includeParallel,
    } : {
      campaignId: campaignId,
      selectedInvestigatorIds: map(
        campaignInvestigators,
        investigator => investigator.code
      ),
      onDeckSelect,
      onInvestigatorSelect,
      simpleOptions: true,
      includeParallel,
    };
    navigation.navigate('Dialog.DeckSelector', passProps);
  }, [doAddInvestigator, navigation]);
  return [showChooseDeck, doAddInvestigator];
}