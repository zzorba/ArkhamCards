import React, { useContext, useMemo } from 'react';
import { find } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import CampaignGuide from '@data/scenario/CampaignGuide';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import BulletsComponent from './BulletsComponent';

export default function TravelCostStepComponent({ campaignGuide }: { campaignGuide: CampaignGuide }) {
  const { scenarioState, processedScenario } = useContext(ScenarioGuideContext);
  const embarkData = scenarioState.arriveData();
  const sideScenario = processedScenario.scenarioGuide.sideScenario;
  const theMap = campaignGuide.campaignMap();
  const [message, sideStory] = useMemo(() => {
    const arriveCityName = find(theMap?.locations, location => location.id === embarkData?.destination)?.name;
    const departCityName = find(theMap?.locations, location => location.id === embarkData?.departure)?.name;
    if (!embarkData || !arriveCityName) {
      return [undefined, undefined];
    }
    const time = embarkData.time;
    const travelSentence = t`The cell travels from ${departCityName} to ${arriveCityName}.`;
    const costSentence = ngettext(
      msgid`Mark ${time} <b>time</b> in your Campaign Log.`,
      `Mark ${time} <b>time</b> in your Campaign Log.`,
      time
    );
    return [
      `${travelSentence} ${costSentence}`,
      sideScenario ? [{ text: t`This includes the cost of experience cost of playing the side-story.` }] : undefined,
    ];
  }, [embarkData, sideScenario, theMap]);
  if (!message) {
    return null;
  }
  return (
    <SetupStepWrapper>
      <CampaignGuideTextComponent text={message} />
      { !!sideStory && <BulletsComponent bullets={sideStory} /> }
    </SetupStepWrapper>
  );
}