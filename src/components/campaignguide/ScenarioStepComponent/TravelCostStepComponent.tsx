import React, { useContext, useMemo } from 'react';
import { find } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import CampaignGuide from '@data/scenario/CampaignGuide';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import BulletsComponent from './BulletsComponent';
import LanguageContext from '@lib/i18n/LanguageContext';
import { RUSSIAN_LOCATIONS } from '@components/campaign/constants';

export default function TravelCostStepComponent({ campaignGuide }: { campaignGuide: CampaignGuide }) {
  const { scenarioState, processedScenario } = useContext(ScenarioGuideContext);
  const { lang } = useContext(LanguageContext);
  const embarkData = scenarioState.arriveData();
  const sideScenario = processedScenario.scenarioGuide.sideScenario;
  const theMap = campaignGuide.campaignMap();
  const [message, sideStory] = useMemo(() => {
    const arriveCityName = (lang === 'ru' && embarkData?.destination && RUSSIAN_LOCATIONS[embarkData.destination]?.dative) ||
      find(theMap?.locations, location => location.id === embarkData?.destination)?.name;
    const departCityName = (lang === 'ru' && embarkData?.departure &&
      RUSSIAN_LOCATIONS[embarkData.departure]?.genitive) ||
      find(theMap?.locations, location => location.id === embarkData?.departure)?.name;
    if (!embarkData || !arriveCityName) {
      return [undefined, undefined];
    }
    const time = embarkData.time;
    if (embarkData.transit) {
      return [
        ngettext(
          msgid`Mark ${time} <b>time</b> as the cell travels from ${departCityName} to ${arriveCityName} on the way to somewhere else.`,
          `Mark ${time} <b>time</b> as the cell travels from ${departCityName} to ${arriveCityName} on the way to somewhere else.`,
          time
        ),
        undefined,
      ];
    }
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