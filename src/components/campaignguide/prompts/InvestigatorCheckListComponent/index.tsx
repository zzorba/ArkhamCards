import React, { useCallback, useContext, useMemo } from 'react';
import { map, filter, findIndex } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CheckListComponent from '../CheckListComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import InputWrapper from '../InputWrapper';
import ActionButton from '../ActionButton';

interface Props {
  id: string;
  choiceId: string;
  checkText: string;
  defaultState?: boolean;
  min: number;
  max: number;
  allowNewDecks?: boolean;
  investigators?: string[];
  filter?: (investigator: Card) => boolean;
}

export default function InvestigatorCheckListComponent({
  id,
  choiceId,
  checkText,
  defaultState,
  min,
  max,
  allowNewDecks,
  investigators: investigatorCodes,
  filter: filterCard,
}: Props) {
  const { campaignState, campaignInvestigators } = useContext(CampaignGuideContext);
  const showAddDeckDialog = useCallback(() => {
    campaignState.showChooseDeck();
  }, [campaignState]);

  const filterInvestigator = useCallback((investigator: Card): boolean => {
    if (investigatorCodes) {
      return findIndex(
        investigatorCodes,
        code => code === investigator.code
      ) !== -1;
    }
    if (filterCard) {
      return filterCard(investigator);
    }
    return true;
  }, [investigatorCodes, filterCard]);

  const addDeckButton = useMemo(() => {
    if (!allowNewDecks) {
      return null;
    }
    return (
      <ActionButton
        color="light"
        leftIcon="plus-thin"
        onPress={showAddDeckDialog}
        title={t`Add new`}
      />
    );
  }, [allowNewDecks, showAddDeckDialog]);
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const investigators = useMemo(() => {
    return filter(
      allowNewDecks ?
        filter(campaignInvestigators, investigator => !campaignLog.isEliminated(investigator)) :
        scenarioInvestigators,
      filterInvestigator);
  }, [allowNewDecks, campaignInvestigators, campaignLog, scenarioInvestigators, filterInvestigator]);

  const { colors } = useContext(StyleContext);
  return (
    <CheckListComponent
      id={id}
      choiceId={choiceId}
      checkText={checkText}
      defaultState={defaultState}
      items={map(
        investigators,
        investigator => {
          return {
            investigator: investigator,
            code: investigator.code,
            name: investigator.name,
            color: colors.faction[investigator.factionCode()].background,
          };
        })
      }
      button={addDeckButton}
      fixedMin={allowNewDecks}
      min={min}
      max={max}
    />
  );
}
