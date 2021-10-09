import React, { useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { keys, map, filter, findIndex, find } from 'lodash';
import { t } from 'ttag';

import CheckListComponent, { ListItem } from './CheckListComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import ActionButton from './ActionButton';
import RadioButton from './RadioButton';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { LEAD_INVESTIGATOR_STEP_ID } from '@data/scenario/fixedSteps';
import { Toggles } from '@components/core/hooks';
import ArkhamIcon from '@icons/ArkhamIcon';
import space from '@styles/space';

interface Props {
  id: string;
  choiceId: string;
  checkText: string;
  confirmText?: string;
  defaultState?: boolean;
  min: number;
  max: number;
  allowNewDecks?: boolean;
  includeLeadInvestigator?: boolean;
  investigators?: string[];
  filter?: (investigator: Card) => boolean;
}

export default function InvestigatorCheckListComponent({
  id,
  choiceId,
  checkText,
  confirmText,
  defaultState,
  min,
  max,
  allowNewDecks,
  includeLeadInvestigator,
  investigators: investigatorCodes,
  filter: filterCard,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const { campaignState, campaignInvestigators } = useContext(CampaignGuideContext);
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const { scenarioState } = useContext(ScenarioGuideContext);

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
  const investigators = useMemo(() => {
    return filter(
      allowNewDecks ?
        filter(campaignInvestigators, investigator => !campaignLog.isEliminated(investigator)) :
        scenarioInvestigators,
      filterInvestigator);
  }, [allowNewDecks, campaignInvestigators, campaignLog, scenarioInvestigators, filterInvestigator]);
  const [leadInvestigatorState, setLeadInvestigator] = useState<string | undefined>();
  const syncSelection = useCallback((selection: Toggles) => {
    const selectedInvestigators = filter(keys(selection), code => !!selection[code]);
    if (leadInvestigatorState === undefined) {
      if (selectedInvestigators.length) {
        setLeadInvestigator(selectedInvestigators[0]);
      }
    } else if (!find(selectedInvestigators, code => code === leadInvestigatorState)) {
      setLeadInvestigator(selectedInvestigators.length ? selectedInvestigators[0] : undefined);
    }
  }, [leadInvestigatorState, setLeadInvestigator]);
  const choice = scenarioState.stringChoices(LEAD_INVESTIGATOR_STEP_ID);
  const hasDecision = !!choice;
  const leadInvestigator = useMemo(() => {
    if (choice !== undefined) {
      const investigators = keys(choice);
      if (!investigators.length) {
        return -1;
      }
      const code = investigators[0];
      return code;
    }
    return leadInvestigatorState;
  }, [leadInvestigatorState, choice]);
  const saveLeadInvestigator = useCallback(() => {
    if (leadInvestigatorState) {
      scenarioState.setStringChoices(
        LEAD_INVESTIGATOR_STEP_ID,
        leadInvestigatorState === undefined ? {} : { [leadInvestigatorState]: ['lead'] }
      );
    }
  }, [leadInvestigatorState, scenarioState]);
  const selectedRadioButton = useMemo(() => <RadioButton color="light" icon="per_investigator" selected />, []);
  const defaultRadioButton = useMemo(() => !hasDecision && <RadioButton color="light" icon="per_investigator" />, [hasDecision]);
  const items: ListItem[] = useMemo(() => {
    return map(
      investigators,
      investigator => {
        return {
          investigator: investigator,
          investigatorButton: investigator.code === leadInvestigator ? selectedRadioButton : defaultRadioButton,
          trauma: includeLeadInvestigator,
          code: investigator.code,
          name: investigator.name,
          color: colors.faction[investigator.factionCode()].background,
        };
      });
  }, [investigators, includeLeadInvestigator, colors, selectedRadioButton, defaultRadioButton, leadInvestigator]);
  const leadInvestigatorPrompt = useMemo(() => {
    if (!includeLeadInvestigator) {
      return null;
    }
    return (
      <View style={styles.row}>
        <ArkhamIcon name="per_investigator" size={16} color={colors.D10} />
        <Text style={[typography.gameFont, space.paddingLeftXs, space.paddingTopXs]}>{t`Lead`}</Text>
      </View>
    )
  }, [includeLeadInvestigator, typography, colors]);
  return (
    <CheckListComponent
      id={id}
      choiceId={choiceId}
      checkText={checkText}
      confirmText={confirmText}
      defaultState={defaultState}
      items={items}
      button={addDeckButton}
      fixedMin={allowNewDecks}
      min={min}
      max={max}
      titleNode={leadInvestigatorPrompt}
      onSecondaryChoice={includeLeadInvestigator ? setLeadInvestigator : undefined}
      extraSave={includeLeadInvestigator ? saveLeadInvestigator : undefined}
      syncSelection={syncSelection}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
