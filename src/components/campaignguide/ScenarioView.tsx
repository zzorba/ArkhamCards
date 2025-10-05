import React from 'react';

import withScenarioGuideContext, { ScenarioGuideInputProps } from './withScenarioGuideContext';
import ScenarioComponent from './ScenarioComponent';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';

interface OwnProps {
  title: string;
  subtitle: string | undefined;
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}
type InputProps = ScenarioGuideInputProps & OwnProps;

type Props = InputProps;

export type ScenarioProps = ScenarioGuideInputProps & OwnProps;

function ScenarioView({ showLinkedScenario }: Props) {
  return (
    <ScenarioComponent
      standalone={false}
      showLinkedScenario={showLinkedScenario}
    />
  );
}

const WrappedComponent = withScenarioGuideContext<InputProps>(ScenarioView);
export default function ScenarioViewWrapper() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.Scenario'>>();
  return (
    <WrappedComponent
      {...route.params}
    />
  );
}
