import React from 'react';
import { Button, Text,View, StyleSheet } from 'react-native';
import { forEach, map, sum } from 'lodash';
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
  defaultState?: boolean;
  bulletType?: BulletType;
  title?: string;
  text?: string;
  checkText: string;
  requiredTotal?: number;
}

interface Props extends CheckListComponentProps {
  items: ListItem[];
}

interface State {
  selectedChoice: {
    [code: string]: number | undefined;
  };
}

export default class CheckListComponent extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  constructor(props: Props) {
    super(props);

    const selectedChoice: {
      [code: string]: number | undefined;
    } = {};
    forEach(props.items, item => {
      selectedChoice[item.code] = props.defaultState ? 0 : undefined;
    });

    this.state = {
      selectedChoice,
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
    const { requiredTotal } = this.props;
    const { selectedChoice } = this.state;
    const currentTotal = sum(map(selectedChoice, choice => (choice !== undefined && choice !== -1) ? 1 : 0))
    const disabled = (requiredTotal !== undefined) && currentTotal !== requiredTotal;
    return disabled && requiredTotal !== undefined ? (
      <Button
        title={currentTotal > requiredTotal ? t`Too many` : `Not enough`}
        onPress={this._save}
        disabled
      />
    ) : (
      <Button
        title={t`Save`}
        onPress={this._save}
      />
    );
  }

  render() {
    const { id, items, bulletType, text, checkText } = this.props;
    const { selectedChoice } = this.state;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const choiceList = scenarioState.choiceList(id)
          const hasDecision = choiceList !== undefined;
          return (
            <>
              { !!text && (
                <SetupStepWrapper bulletType={bulletType}>
                  <CardTextComponent text={text} />
                </SetupStepWrapper>
              ) }
              <View style={styles.prompt}>
                <Text style={typography.mediumGameFont}>
                  { checkText }
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
