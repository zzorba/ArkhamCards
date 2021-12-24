import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { c, t } from 'ttag';
import { updateChaosBagTarotMode } from './actions';

import { CampaignId } from '@actions/types';
import { Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';
import { usePickerDialog } from '@components/deck/dialogs';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import { ChaosBagActions } from '@data/remote/chaosBag';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';

interface Props {
  campaignId: CampaignId;
  chaosBagResults: ChaosBagResultsT;
  actions: ChaosBagActions;
}

function getTarotString(tarot: Chaos_Bag_Tarot_Mode_Enum | undefined) {
  if (!tarot) {
    return t`Tarot card`;
  }
  const cards = {
    [Chaos_Bag_Tarot_Mode_Enum.Judgement]: t`Judgement · XX`,
    [Chaos_Bag_Tarot_Mode_Enum.JudgementInverted]: t`Judgement · XX (Inverted)`,
  };
  const card = cards[tarot];
  return t`Tarot card: ${card}`;
}

export default function useTarotCardDialog({ chaosBagResults, actions, campaignId }: Props) {
  const dispatch = useDispatch();
  const setTarot = useCallback((tarot: Chaos_Bag_Tarot_Mode_Enum | undefined) => {
    dispatch(updateChaosBagTarotMode(actions, campaignId, tarot, chaosBagResults));
  }, [dispatch, actions, campaignId, chaosBagResults]);
  const [tarotDialog, showTarotDialog] = usePickerDialog({
    title: t`Select tarot card`,
    description: t`Which tarot card is impacting the chaos bag?`,
    selectedValue: chaosBagResults.tarot,
    items: [
      {
        title: c('Tarot Card').t`None`,
        value: undefined,
      },
      {
        title: c('Tarot Card').t`Judgement · XX`,
        description: t`Replace a skull with a 0 token.`,
        value: Chaos_Bag_Tarot_Mode_Enum.Judgement,
      },
      {
        title: c('Tarot Card').t`Judgement · XX (Inverted)`,
        description: t`Replace highest non-negative token with a skull.`,
        value: Chaos_Bag_Tarot_Mode_Enum.JudgementInverted,
      },
    ],
    onValueChange: setTarot,
  });
  return [
    <View style={space.paddingBottomS} key="tarot-button">
      <DeckButton
        icon="card-outline"
        title={getTarotString(chaosBagResults.tarot)}
        color="dark_gray"
        onPress={showTarotDialog}
      />
    </View>,
    tarotDialog,
  ];
}