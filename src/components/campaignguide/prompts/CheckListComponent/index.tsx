import React from 'react';
import { Button, Text,View, StyleSheet } from 'react-native';
import { forEach, map } from 'lodash';
import { t } from 'ttag';

import CheckListItemComponent from './CheckListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { ListChoices } from 'actions/types';
import CardTextComponent from 'components/card/CardTextComponent';
import { BulletType, EffectsChoice, SimpleEffectsChoice } from 'data/scenario/types';
import typography from 'styles/typography';

export interface ListItem {
  code: string;
  name: string;
}

export interface CheckListComponentProps {
  id: string;
  bulletType?: BulletType;
  title?: string;
  text?: string;
  choice: EffectsChoice | SimpleEffectsChoice;
}
interface Props extends CheckListComponentProps {
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

  _onChoiceToggle = (
    code: string
  ) => {
    this.setState(state => {
      const selected = state.selectedChoice[code] !== undefined;
      return {
        selectedChoice: {
          ...this.state.selectedChoice,
          [code]: selected ? undefined : 0,
        },
      };
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
    if (hasDecision) {
      return null;
    }
    return (
      <Button
        title={t`Save`}
        onPress={this._save}
      />
    );

  }

  render() {
    const { id, items, bulletType, text, choice } = this.props;
    const { selectedChoice } = this.state;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const choiceList = scenarioState.choiceList(id)
          const hasDecision = choiceList !== undefined;
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              <View style={styles.prompt}>
                <Text style={typography.mediumGameFont}>
                  { choice.text }
                </Text>
              </View>
              { map(items, (item, idx) => {
                const selected = choiceList !== undefined ? (
                  choiceList[item.code] !== undefined
                ) : (
                  selectedChoice[item.code] !== undefined
                );
                return (
                  <CheckListItemComponent
                    key={idx}
                    {...item}
                    selected={selected}
                    onChoiceToggle={this._onChoiceToggle}
                    editable={!hasDecision}
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

const styles = StyleSheet.create({
  prompt: {
    flexDirection: 'row',
    padding: 8,
    paddingRight: 16,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderColor: '#888',
  },
});
