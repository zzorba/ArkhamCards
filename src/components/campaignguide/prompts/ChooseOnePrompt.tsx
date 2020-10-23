import React, { useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import ChooseOneListComponent from './ChooseOneListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { DisplayChoice } from '@data/scenario';
import space from '@styles/space';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  choices: DisplayChoice[];
  picker?: boolean;
}

interface State {
  selectedChoice?: number;
}

export default function ChooseOnePrompt({
  id,
  bulletType,
  text,
  choices,
  picker,
}: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const [currentSelectedChoice, setSelectedChoice] = useState<number | undefined>();

  const save = useCallback(() => {
    if (currentSelectedChoice !== undefined) {
      scenarioState.setChoice(id, currentSelectedChoice);
    }
  }, [id, currentSelectedChoice, scenarioState]);

  const decision = scenarioState.choice(id);
  const selectedChoice = decision !== undefined ? decision : currentSelectedChoice;
  return (
    <>
      { picker ? (
        <SinglePickerComponent
          title={selectedChoice === undefined ? (text || '') : ''}
          choices={choices}
          selectedIndex={selectedChoice}
          onChoiceChange={setSelectedChoice}
          editable={decision === undefined}
          topBorder
        />
      ) : (
        <>
          <SetupStepWrapper bulletType={bulletType}>
            <CampaignGuideTextComponent
              text={text || t`The investigators must decide (choose one):`}
            />
          </SetupStepWrapper>
          <View style={[space.paddingTopS, space.paddingBottomS]}>
            <ChooseOneListComponent
              choices={choices}
              selectedIndex={selectedChoice}
              onSelect={setSelectedChoice}
              editable={decision === undefined}
            />
          </View>
        </>
      ) }
      { decision === undefined && (
        <BasicButton
          title={t`Proceed`}
          onPress={save}
          disabled={selectedChoice === undefined}
        />
      ) }
    </>
  );
}
