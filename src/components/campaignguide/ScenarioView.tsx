import React from 'react';

import withScenarioGuideContext, { ScenarioGuideInputProps } from './withScenarioGuideContext';
import { NavigationProps } from '@components/nav/types';
import ScenarioComponent, { dynamicOptions } from './ScenarioComponent';

interface OwnProps {
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}
type InputProps = NavigationProps & ScenarioGuideInputProps & OwnProps;

type Props = InputProps;

export type ScenarioProps = ScenarioGuideInputProps & OwnProps;

function ScenarioView({ componentId, showLinkedScenario }: Props) {
  return (
    <ScenarioComponent
      componentId={componentId}
      standalone={false}
      showLinkedScenario={showLinkedScenario}
    />
  );
}

ScenarioView.options = () => {
  return dynamicOptions(false);
};

export default withScenarioGuideContext<InputProps>(ScenarioView);
