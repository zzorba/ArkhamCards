import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { find, forEach, keys, map, sum } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CheckListItemComponent from './CheckListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { StringChoices } from '@actions/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { m, s } from '@styles/space';

export interface ListItem {
  code: string;
  name: string;
  color?: string;
}

export interface CheckListComponentProps {
  id: string;
  choiceId: string;
  defaultState?: boolean;
  bulletType?: BulletType;
  title?: string;
  text?: string;
  checkText: string;
  fixedMin?: boolean;
  min?: number;
  max?: number;
  button?: React.ReactNode;
  loading?: boolean;
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

  componentDidUpdate(previousProps: Props) {
    if (this.props.items !== previousProps.items) {
      forEach(this.props.items, item => {
        if (!find(previousProps.items, oldItem => item.code === oldItem.code)) {
          this.setState({
            selectedChoice: {
              ...this.state.selectedChoice,
              [item.code]: 0,
            },
          });
        }
      });
    }
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
    const { id, choiceId } = this.props;
    const { selectedChoice } = this.state;
    const choices: StringChoices = {};
    forEach(selectedChoice, (idx, code) => {
      if (idx !== undefined && idx !== -1) {
        choices[code] = [choiceId];
      }
    });
    this.context.scenarioState.setStringChoices(
      id,
      choices
    );
  };

  renderSaveButton(hasDecision: boolean) {
    if (hasDecision) {
      return null;
    }
    const { items, max, fixedMin } = this.props;
    const min = (!fixedMin && this.props.min) ? Math.min(this.props.min, items.length) : this.props.min;
    if (min === undefined && max === undefined) {
      return (
        <BasicButton
          title={t`Proceed`}
          onPress={this._save}
        />
      );
    }
    const { selectedChoice } = this.state;
    const currentTotal = sum(
      map(
        selectedChoice,
        choice => (choice !== undefined && choice !== -1) ? 1 : 0
      )
    );
    const hasMin = (min === undefined || currentTotal >= min);
    const hasMax = (max === undefined || currentTotal <= max);
    const enabled = hasMin && hasMax;
    return !enabled ? (
      <BasicButton
        title={hasMin ? t`Too many` : t`Not enough`}
        onPress={this._save}
        disabled
      />
    ) : (
      <BasicButton
        title={t`Proceed`}
        onPress={this._save}
      />
    );
  }

  render() {
    const { id, items, bulletType, text, checkText, button, loading } = this.props;
    const {
      style: { borderStyle, colors, typography },
      scenarioState,
    } = this.context;
    const { selectedChoice } = this.state;
    const choiceList = scenarioState.stringChoices(id);
    const hasDecision = choiceList !== undefined;
    return (
      <>
        { !!text && (
          <SetupStepWrapper bulletType={bulletType}>
            <CampaignGuideTextComponent text={text} />
          </SetupStepWrapper>
        ) }
        <View style={[styles.prompt, borderStyle]}>
          <Text style={typography.mediumGameFont}>
            { checkText }
          </Text>
        </View>
        { loading ? (
          <View style={[styles.loadingRow, borderStyle]}>
            <ActivityIndicator size="small" animating color={colors.lightText} />
          </View>
          ): map(items, (item, idx) => {
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
        { ((items.length === 0 && !loading) || (choiceList !== undefined && keys(choiceList).length === 0)) && (
          <View style={[styles.row, borderStyle]}>
            <Text style={[typography.mediumGameFont, styles.nameText]}>
              { t`None` }
            </Text>
          </View>
        ) }
        { !hasDecision && !!button && (
          <View style={[styles.bottomBorder, borderStyle]}>
            { button }
          </View>
        ) }
        { this.renderSaveButton(hasDecision) }
      </>
    );
  }
}

const styles = StyleSheet.create({
  prompt: {
    flexDirection: 'row',
    paddingTop: m,
    paddingRight: m,
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: s,
    paddingLeft: m,
    paddingRight: m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameText: {
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    padding: m,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
