import React from 'react';
import { Button } from 'react-native';
import { every, forEach, map } from 'lodash';
import { t } from 'ttag';

import ChoiceListItemComponent from './ChoiceListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { ListChoices } from 'actions/types';
import CardTextComponent from 'components/card/CardTextComponent';
import { BulletType, EffectsChoice, SimpleEffectsChoice } from 'data/scenario/types';

export interface ListItem {
  code: string;
  name: string;
  tintColor?: string;
  primaryColor?: string;
}
export interface ChoiceListComponentProps {
  id: string;
  bulletType?: BulletType;
  title?: string;
  text?: string;
  optional?: boolean;
  detailed?: boolean;
  choices: (EffectsChoice | SimpleEffectsChoice)[];
}
interface Props extends ChoiceListComponentProps {
  items: ListItem[];
}

interface State {
  selectedChoice: {
    [code: string]: number | undefined;
  };
}

export default class InvestigatorChoicePrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedChoice: {},
    };
  }

  _onChoiceChange = (
    code: string,
    choice: number
  ) => {
    this.setState({
      selectedChoice: {
        ...this.state.selectedChoice,
        [code]: choice === -1 ? undefined : choice,
      },
    });
  };

  _save = () => {
    const { id } = this.props;
    const { selectedChoice } = this.state;
    const choices: ListChoices = {};
    forEach(selectedChoice, (idx, code) => {
      if (idx !== undefined && idx !== -1) {
        choices[code] = [idx];
      }
    });
    this.context.scenarioState.setChoiceList(id, choices);
  };

  renderSaveButton(hasDecision: boolean) {
    const { items, detailed } = this.props;
    const { selectedChoice } = this.state;
    if (hasDecision) {
      return null;
    }
    return (
      <Button
        title={t`Save`}
        onPress={this._save}
        disabled={detailed && !every(
          items,
          item => selectedChoice[item.code] !== undefined)
        }
      />
    );

  }

  render() {
    const { id, items, bulletType, detailed, choices, text, optional } = this.props;
    const { selectedChoice } = this.state;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const hasDecision = scenarioState.hasChoiceList(id);
          const nonDetailedDefaultChoice = (optional ? -1 : 0);
          const defaultChoice = detailed ? undefined : nonDetailedDefaultChoice;
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              { map(items, (item, idx) => {
                const choice = selectedChoice[item.code];
                return (
                  <ChoiceListItemComponent
                    key={idx}
                    {...item}
                    choices={choices}
                    choice={choice === undefined ? defaultChoice : choice}
                    onChoiceChange={this._onChoiceChange}
                    optional={!!optional}
                    editable={!hasDecision}
                    detailed={detailed}
                  />
                );
              }) }
              { this.renderSaveButton(hasDecision) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
