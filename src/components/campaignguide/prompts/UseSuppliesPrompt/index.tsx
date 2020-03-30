import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { find, forEach, map, upperFirst, sum } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import InvestigatorCheckListComponent from '../InvestigatorCheckListComponent';
import InvestigatorCounterComponent from '../InvestigatorCounterComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import { BulletType, UseSuppliesInput } from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { InvestigatorDeck } from 'data/scenario';
import typography from 'styles/typography';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  input: UseSuppliesInput;
  campaignLog: GuidedCampaignLog;
}

interface State {
  counts: {
    [code: string]: {
      [id: string]: number ;
    };
  };
}

export default class UseSuppliesPrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  constructor(props: Props) {
    super(props);

    this.state = {
      counts: {},
    };
  }

  _save = () => {
    const { id } = this.props;
    const { counts } = this.state;
    this.context.scenarioState.setSupplies(id, counts);
  };

  renderFirstAllPrompt() {
    const { id, input, campaignLog } = this.props;

    const investigagorSupplies = campaignLog.investigatorSections[input.section] || {};
    const limits: { [code: string]: number } = {};
    forEach(investigagorSupplies, (supplies, code) => {
      const entry = find(supplies.entries,
        entry => entry.id === input.id &&
          !supplies.crossedOut[entry.id] &&
          entry.type === 'count'
      );
      limits[code] = (entry && entry.type === 'count') ? entry.count : 0;
    });

    // Basically 2 sequential choices.
    // 1) How many "supply" to consume
    // 2) If count != players, who doesn't get any?
    const supplyName = upperFirst(input.id);
    const desiredCount = campaignLog.playerCount();
    const totalProvisionCount = sum(map(limits, count => count));
    return (
      <>
        <View style={styles.rightPadding}>
          <Text style={[typography.mediumGameFont, typography.right]}>
            { t`${supplyName} to use (${desiredCount})` }
          </Text>
        </View>
        <InvestigatorCounterComponent
          id={`${id}_used`}
          limits={limits}
          requiredTotal={Math.min(totalProvisionCount, desiredCount)}
        />
      </>
    );
  }

  renderSecondAllPrompt(scenarioState: ScenarioStateHelper) {
    const { id, input, campaignLog } = this.props;
    const choiceList = scenarioState.choiceList(`${id}_used`);
    if (choiceList === undefined) {
      return null;
    }

    const usedCount = sum(map(choiceList, choices => choices[0]));
    console.log(usedCount);
    const desiredCount = campaignLog.playerCount();
    if (usedCount >= desiredCount) {
      // No secondary prompt is needed/
      return null;
    }
    // Choose people who are left behind.
    const target = desiredCount - usedCount;
    const badThing = find(input.choices, choice => choice.boolCondition === false);
    return (
      <InvestigatorCheckListComponent
        id={id}
        checkText={badThing ? t`Reads "${badThing.condition}"` : `Doesn't get any`}
        requiredTotal={target}
      />
    );
  }

  render() {
    const { input, text } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          switch (input.investigator) {
            case 'all':
              return (
                <>
                  <SetupStepWrapper>
                    { !!text && <CardTextComponent text={text} /> }
                  </SetupStepWrapper>
                  { this.renderFirstAllPrompt() }
                  { this.renderSecondAllPrompt(scenarioState) }
                </>
              );
            case 'any':
              // Basically 2 sequential choices.
              // 1) Players who have supply can choose to use it.
              // 2) If so, they resolve the effect (which is an investigator choice).
              return (
                <>
                  <SetupStepWrapper>
                    { !!text && <CardTextComponent text={text} /> }
                  </SetupStepWrapper>
                </>
              );
            case 'choice':
              // Single choice, of players with Gasoline, must choose one.
              return (
                <>
                  <SetupStepWrapper>
                    { !!text && <CardTextComponent text={text} /> }
                  </SetupStepWrapper>
                </>
              );
          }
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  investigatorText: {
    color: '#FFF',
    fontWeight: '700',
  },
  investigatorRow: {
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightPadding: {
    paddingRight: 16,
  },
});
