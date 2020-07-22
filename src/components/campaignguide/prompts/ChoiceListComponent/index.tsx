import React from 'react';
import { View } from 'react-native';
import { every, findIndex, forEach, flatMap, map } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import ChoiceListItemComponent from './ChoiceListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { StringChoices } from '@actions/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { Choices, DisplayChoiceWithId } from '@data/scenario';
import space from '@styles/space';

export interface ListItem {
  code: string;
  name: string;
  color?: string;
}

export interface ChoiceListComponentProps {
  id: string;
  bulletType?: BulletType;
  title?: string;
  text?: string;
  optional?: boolean;
  detailed?: boolean;
  options: Choices;
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

    const selectedChoice: {
      [code: string]: number | undefined;
    } = {};
    if (!props.optional) {
      forEach(props.items, item => {
        if (props.options.type === 'universal') {
          selectedChoice[item.code] = 0;
        } else {
          const personalized = props.options.perCode[item.code];
          if (personalized && personalized.length) {
            selectedChoice[item.code] = 0;
          }
        }
      });
    }
    this.state = {
      selectedChoice,
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
    const { id, options } = this.props;
    const { selectedChoice } = this.state;
    const choices: StringChoices = {};
    forEach(selectedChoice, (idx, code) => {
      if (idx !== undefined && idx !== -1) {
        if (options.type === 'universal') {
          choices[code] = [options.choices[idx].id];
        } else {
          const realIdx = options.perCode[code][idx];
          choices[code] = [options.choices[realIdx].id];
        }
      }
    });
    this.context.scenarioState.setStringChoices(
      id,
      choices
    );
  };

  renderSaveButton(hasDecision: boolean) {
    const { items, detailed } = this.props;
    const { selectedChoice } = this.state;
    if (hasDecision) {
      return <View style={space.marginBottomM} />;
    }
    return (
      <BasicButton
        title={t`Proceed`}
        onPress={this._save}
        disabled={detailed && !every(
          items,
          item => selectedChoice[item.code] !== undefined)
        }
      />
    );

  }

  getChoice(
    code: string,
    choices: DisplayChoiceWithId[],
    inputChoices?: StringChoices
  ): number | undefined {
    const { detailed } = this.props;
    if (inputChoices === undefined) {
      const choice = this.state.selectedChoice[code];
      if (choice !== undefined) {
        return choice;
      }
    } else {
      const investigatorChoice = inputChoices[code];
      if (investigatorChoice && investigatorChoice.length) {
        return findIndex(choices, option => option.id === investigatorChoice[0]);
      }
    }
    return detailed ? undefined : -1;
  }

  renderChoices(inputChoiceList?: StringChoices) {
    const { items, detailed, options, optional } = this.props;
    const results = flatMap(items, (item, idx) => {
      const choices = options.type === 'universal' ?
        options.choices :
        map(options.perCode[item.code] || [], index => options.choices[index]);
      if (choices.length === 0) {
        return null;
      }
      return (
        <ChoiceListItemComponent
          key={idx}
          {...item}
          choices={choices}
          choice={this.getChoice(item.code, choices, inputChoiceList)}
          onChoiceChange={this._onChoiceChange}
          optional={!!optional}
          editable={inputChoiceList === undefined}
          detailed={detailed}
          firstItem={idx === 0}
        />
      );
    });

    if (results.length === 0) {
      return (
        <ChoiceListItemComponent
          code="dummy"
          name={t`None`}
          choices={[]}
          editable={false}
          optional={false}
          onChoiceChange={this._onChoiceChange}
          firstItem
        />
      );
    }
    return results;
  }

  render() {
    const { id, bulletType, text } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const inputChoices = scenarioState.stringChoices(id);
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CampaignGuideTextComponent text={text} /> }
              </SetupStepWrapper>
              { this.renderChoices(inputChoices) }
              { this.renderSaveButton(inputChoices !== undefined) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
