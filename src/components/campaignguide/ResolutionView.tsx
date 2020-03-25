import React from 'react';
import {
  ScrollView,
} from 'react-native';
import { t } from 'ttag';

import InvestigatorChoicePrompt from './prompts/InvestigatorChoicePrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import ResolutionComponent from './ResolutionComponent';
import withCampaignDataContext, { CampaignDataInputProps } from './withCampaignDataContext';
import { EffectsChoice, Resolution } from 'data/scenario/types';

interface Props {
  resolutionId: string;
}

export type ResolutionProps = Props & CampaignDataInputProps;

const INVESTIGATOR_STATUS_ID = 'investigator_status';
const INVESTIGATOR_STATUS_CHOICES: EffectsChoice[] = [
  {
    text: t`Alive`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: 'alive',
      },
    ],
  },
  {
    text: t`Resigned`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: 'resigned',
      },
    ],
  },
  {
    text: t`Eliminated by Damage`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: 'physical',
      },
      {
        type: 'trauma',
        investigator: '$input_value',
        physical: 1,
      },
    ],
  },
  {
    text: t`Eliminated by Horror`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: 'mental',
      },
      {
        type: 'trauma',
        investigator: '$input_value',
        mental: 1,
      },
    ],
  },
  {
    text: t`Eliminated by Scenario`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: 'eliminated',
      },
    ],
  },
];

class ResolutionView extends React.Component<Props> {
  renderResolution(resolution: Resolution) {
    return (
      <ResolutionComponent
        resolution={resolution}
      />
    );
  }

  render() {
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => {
          const { resolutionId } = this.props;
          const resolution = scenarioGuide.resolution(resolutionId);
          if (!resolution) {
            return null;
          }
          return (
            <ScrollView>
              <InvestigatorChoicePrompt
                id={INVESTIGATOR_STATUS_ID}
                text={t`Investigator status at end of scenario:`}
                choices={INVESTIGATOR_STATUS_CHOICES}
                bulletType="none"
              />
              { scenarioState.choiceList(INVESTIGATOR_STATUS_ID) !== undefined && (
                this.renderResolution(resolution)
              ) }
            </ScrollView>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

export default withCampaignDataContext<Props>(
  ResolutionView
);
