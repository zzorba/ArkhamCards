import React, { useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import ChooseOneListComponent from './ChooseOneListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { BulletType, ChecklistInput } from '@data/scenario/types';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import space from '@styles/space';
import CheckListComponent from './CheckListComponent';
import ScenarioStepContext from '../ScenarioStepContext';
import { map } from 'lodash';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  input: ChecklistInput;
}

export default function CheckListPrompt({ id, bulletType, text, input }: Props) {
  const [selection, setSelection] = useState([]);
  const { scenarioState, campaignLog } = useContext(ScenarioStepContext);
  const choices = chooseOneInputChoices(input.choices, campaignLog);
  return (
    <CheckListComponent
      id={id}
      choiceId="checked"
      text={text}
      bulletType={bulletType}
      items={map(choices, choice => {
        return {
          code: choice.id,
          name: choice.text || '',
        };
      })}
      checkText={input.text}
    />
  );
}

interface State {
  selectedChoice?: number;
}

export class ChooseOnePrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;
  state: State = {};

  _onChoiceChange = (choice: number) => {
    this.setState({
      selectedChoice: choice,
    });
  };

  _save = () => {
    const { id } = this.props;
    const { selectedChoice } = this.state;
    if (selectedChoice !== undefined) {
      this.context.scenarioState.setChoice(id, selectedChoice);
    }
  };

  render() {
    const { id, choices, text, bulletType } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const decision = scenarioState.choice(id);
          const selectedChoice = decision !== undefined ? decision : this.state.selectedChoice;
          return (
            <>
              { picker ? (
                <SinglePickerComponent
                  title={selectedChoice === undefined ? (text || '') : ''}
                  choices={choices}
                  selectedIndex={selectedChoice}
                  onChoiceChange={this._onChoiceChange}
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
                      onSelect={this._onChoiceChange}
                      editable={decision === undefined}
                    />
                  </View>
                </>
              ) }
              { decision === undefined && (
                <BasicButton
                  title={t`Proceed`}
                  onPress={this._save}
                  disabled={selectedChoice === undefined}
                />
              ) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
