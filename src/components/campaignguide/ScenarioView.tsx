import React, { useContext } from 'react';

import withScenarioGuideContext, { ScenarioGuideInputProps } from './withScenarioGuideContext';
import ScenarioComponent from './ScenarioComponent';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HeaderTitle from '@components/core/HeaderTitle';
import { useDismissOnCampaignDeleted } from '@data/remote/campaigns';
import CampaignGuideContext from './CampaignGuideContext';

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
  const navigation = useNavigation();
  const { campaign } = useContext(CampaignGuideContext);
  useDismissOnCampaignDeleted(navigation, campaign);

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
  const { campaignId, scenarioId, title, subtitle, showLinkedScenario } = route.params;
  return (
    <WrappedComponent
      campaignId={campaignId}
      scenarioId={scenarioId}
      title={title}
      subtitle={subtitle}
      showLinkedScenario={showLinkedScenario}
    />
  );
}

function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Guide.Scenario'> }): NativeStackNavigationOptions {
  return {
    headerTitle: () => <HeaderTitle title={route.params?.title || ''} subtitle={route.params?.subtitle} />,
  };
};
ScenarioViewWrapper.options = options;
