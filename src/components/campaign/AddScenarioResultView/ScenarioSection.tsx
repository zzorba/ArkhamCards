import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { concat, filter, find, findIndex, forEach, head, map } from 'lodash';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { Campaign, SingleCampaign, ScenarioResult, CUSTOM } from '@actions/types';
import SettingsSwitch from '@components/core/SettingsSwitch';
import EditText from '@components/core/EditText';
import { updateCampaign } from '../actions';
import { completedScenario, scenarioFromCard, Scenario } from '../constants';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { ShowTextEditDialog } from '@components/core/withDialogs';
import { makeAllCyclePacksSelector, getAllStandalonePacks, makePackSelector, AppState } from '@reducers';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { where } from '@data/query';
import { useCycleScenarios } from '@components/core/hooks';

interface OwnProps {
  componentId: string;
  campaign: SingleCampaign;
  scenarioChanged: (result: ScenarioResult) => void;
  showTextEditDialog: ShowTextEditDialog;
}

export default function ScenarioSection({ campaign, scenarioChanged }: OwnProps) {
  const [allScenarioCards, loading] = useCardsFromQuery({
    query: where('c.type_code = "scenario"'),
    sort: [{ s: 'c.position', direction: 'ASC' }],
  });
  const getPack = useMemo(makePackSelector, []);
  const cyclePack = useSelector((state: AppState) => getPack(state, campaign.cycleCode));
  const getAllCyclePacks = useMemo(makeAllCyclePacksSelector, []);
  const cyclePacks = useSelector((state: AppState) => getAllCyclePacks(state, cyclePack));
  const standalonePacks = useSelector(getAllStandalonePacks);
  const fixedCycleScenarios = useCycleScenarios(campaign);
  const showInterludes = !!campaign.showInterludes;
  const allScenarios = useMemo(() => {
    const hasCompletedScenario = completedScenario(campaign.scenarioResults);
    const finishedScenarios = new Set(campaign.finishedScenarios);
    const cyclePackCodes = new Set(map(cyclePacks, pack => pack.code));
    const standalonePackCodes = new Set(map(standalonePacks, pack => pack.code));
    const cycleScenarios: Scenario[] = [];
    const standaloneScenarios: Scenario[] = [];
    forEach(allScenarioCards, card => {
      if (cyclePackCodes.has(card.pack_code)) {
        const scenario = scenarioFromCard(card);
        if (scenario) {
          cycleScenarios.push(scenario);
        }
      }
      if (standalonePackCodes.has(card.pack_code) && !finishedScenarios.has(card.name)) {
        const scenario = scenarioFromCard(card);
        if (scenario) {
          standaloneScenarios.push(scenario);
        }
      }
    });
    return concat(
      filter(
        fixedCycleScenarios || cycleScenarios,
        scenario => !finishedScenarios.has(scenario.name) && !hasCompletedScenario(scenario)),
      standaloneScenarios
    );
  }, [allScenarioCards, fixedCycleScenarios, campaign.scenarioResults, campaign.finishedScenarios, cyclePacks, standalonePacks]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | typeof CUSTOM>(head(allScenarios) || CUSTOM);
  const [customScenario, setCustomScenario] = useState('');
  const [resolution, setResolution] = useState('');
  const dispatch = useDispatch();

  const toggleShowInterludes = useCallback(() => {
    const campaignUpdate: Campaign = { showInterludes: !showInterludes } as any;
    dispatch(updateCampaign(campaign.id, campaignUpdate));
  }, [campaign, showInterludes, dispatch]);

  useEffect(() => {
    scenarioChanged({
      scenario: selectedScenario !== CUSTOM ? selectedScenario.name : customScenario,
      scenarioCode: selectedScenario !== CUSTOM ? selectedScenario.code : CUSTOM,
      scenarioPack: selectedScenario !== CUSTOM ? selectedScenario.pack_code : CUSTOM,
      interlude: selectedScenario !== CUSTOM && !!selectedScenario.interlude,
      resolution: resolution,
    });
  }, [selectedScenario, customScenario, resolution, scenarioChanged]);

  useEffect(() => {
    if (!loading && allScenarios.length) {
      setSelectedScenario(allScenarios[0]);
    }
  }, [allScenarios, setSelectedScenario, loading]);


  const possibleScenarios = useMemo(() => {
    const scenarios = map(
      filter(allScenarios, scenario => showInterludes || !scenario.interlude),
      card => card.name);
    scenarios.push(CUSTOM);
    return scenarios;
  }, [allScenarios, showInterludes]);

  const handleScenarioChange = useCallback((index: number | null) => {
    if (index === null) {
      return;
    }
    const scenarioName = possibleScenarios[index];
    setSelectedScenario(find(allScenarios, scenario => scenario.name === scenarioName) || CUSTOM,);
  }, [allScenarios, possibleScenarios]);

  const customScenarioTextChanged = useCallback((value?: string) => {
    setCustomScenario(value || '');
  }, [setCustomScenario]);

  const resolutionChanged = useCallback((value?: string) => {
    setResolution(value || '');
  }, [setResolution]);

  return (
    <View>
      <SettingsSwitch
        title={t`Show Interludes`}
        value={showInterludes}
        onValueChange={toggleShowInterludes}
        settingsStyle
      />
      <SinglePickerComponent
        title={selectedScenario !== CUSTOM && selectedScenario.interlude ? t`Interlude` : t`Scenario`}
        modalTitle={showInterludes ? t`Scenario or Interlude` : t`Scenario`}
        choices={map(possibleScenarios, name => {
          return {
            text: name,
          };
        })}
        onChoiceChange={handleScenarioChange}
        selectedIndex={findIndex(possibleScenarios, name => name === (selectedScenario === CUSTOM ? CUSTOM : selectedScenario.name))}
        editable
      />
      { selectedScenario === CUSTOM && (
        <EditText
          title={t`Name`}
          placeholder={t`(required)`}
          onValueChange={customScenarioTextChanged}
          value={customScenario}
        />
      ) }
      { (selectedScenario === CUSTOM || !selectedScenario.interlude) && (
        <EditText
          title={t`Resolution`}
          placeholder={t`(required)`}
          onValueChange={resolutionChanged}
          value={resolution}
        />
      ) }
    </View>
  );
}
