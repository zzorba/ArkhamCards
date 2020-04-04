import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { every, forEach, flatMap, map } from 'lodash';
import { t } from 'ttag';

import ChoiceListItemComponent from './ChoiceListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { ListChoices } from 'actions/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { BulletType } from 'data/scenario/types';
import { Choices } from 'data/scenario';

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
            selectedChoice[item.code] = personalized[0];
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
      return <View style={styles.bottomPadding} />;
    }
    return (
      <View style={styles.buttonWrapper}>
        <Button
          title={t`Proceed`}
          onPress={this._save}
          disabled={detailed && !every(
            items,
            item => selectedChoice[item.code] !== undefined)
          }
        />
      </View>
    );

  }

  getChoice(code: string, choices?: ListChoices): number | undefined {
    const { detailed } = this.props;
    if (choices === undefined) {
      const choice = this.state.selectedChoice[code];
      if (choice !== undefined) {
        return choice;
      }
    } else {
      const investigatorChoice = choices[code];
      if (investigatorChoice && investigatorChoice.length) {
        return investigatorChoice[0];
      }
    }
    return detailed ? undefined : -1;
  }

  renderChoices(inputChoiceList?: ListChoices) {
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
          choice={this.getChoice(item.code, inputChoiceList)}
          onChoiceChange={this._onChoiceChange}
          optional={!!optional}
          editable={inputChoiceList === undefined}
          detailed={detailed}
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
          const inputChoiceList = scenarioState.choiceList(id);
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CampaignGuideTextComponent text={text} /> }
              </SetupStepWrapper>
              { this.renderChoices(inputChoiceList) }
              { this.renderSaveButton(inputChoiceList !== undefined) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  bottomPadding: {
    marginBottom: 16,
  },  
  buttonWrapper: {
    padding: 8,
  },
});
