import React, { useCallback } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';
import { updateChaosBagDifficultyOverride } from './actions';

import { CampaignId } from '@actions/types';
import { Campaign_Difficulty_Enum } from '@generated/graphql/apollo-schema';
import { usePickerDialog } from '@components/deck/dialogs';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import { ChaosBagActions } from '@data/remote/chaosBag';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';
import { useAppDispatch } from '@app/store';

interface Props {
  campaignId: CampaignId;
  chaosBagResults: ChaosBagResultsT;
  actions: ChaosBagActions;
}

function getDifficultyString(difficulty: Campaign_Difficulty_Enum | undefined) {
  if (!difficulty) {
    return t`Difficulty override`;
  }
  const msg = {
    [Campaign_Difficulty_Enum.Easy]: t`Easy / Standard`,
    [Campaign_Difficulty_Enum.Standard]: t`Easy / Standard`,
    [Campaign_Difficulty_Enum.Hard]: t`Hard / Expert`,
    [Campaign_Difficulty_Enum.Expert]: t`Hard / Expert`,
  };

  return t`Difficulty override: ${msg[difficulty]}`;
}


export default function useDifficultyOverrideButton({ chaosBagResults, actions, campaignId }: Props) {
  const dispatch = useAppDispatch();
  const setDifficulty = useCallback((difficulty: Campaign_Difficulty_Enum | undefined) => {
    dispatch(updateChaosBagDifficultyOverride(actions, campaignId, difficulty, chaosBagResults));
  }, [dispatch, actions, campaignId, chaosBagResults]);
  const [dialog, showDifficultyDialog] = usePickerDialog({
    title: t`Select scenario effects difficulty`,
    description: t`In order to support custom modes like \"Stan-hard\", you may choose to use either side of the scenario reference card to show token effects and odds calculations in the app.`,
    selectedValue: chaosBagResults.difficulty,
    items: [
      {
        title: t`Disabled`,
        description: t`Use campaign setting`,
        value: undefined,
      },
      {
        title: t`Easy / Standard`,
        value: Campaign_Difficulty_Enum.Standard,
      },
      {
        title: t`Hard / Expert`,
        value: Campaign_Difficulty_Enum.Hard,
      },
    ],
    onValueChange: setDifficulty,
  });
  return [
    <View style={space.paddingBottomS} key="difficulty-button">
      <DeckButton
        icon="difficulty"
        title={getDifficultyString(chaosBagResults.difficulty)}
        color="dark_gray"
        onPress={showDifficultyDialog}
        noShadow
      />
    </View>,
    dialog,
  ];
}