import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
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

    const selectedChoice: {
      [code: string]: number | undefined;
    } = {};
    if (!props.optional) {
      forEach(props.items, item => {
        selectedChoice[item.code] = 0;
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

  render() {
    const { id, items, bulletType, detailed, choices, text, optional } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const inputChoiceList = scenarioState.choiceList(id);
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              { map(items, (item, idx) => {
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
              }) }
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
});
