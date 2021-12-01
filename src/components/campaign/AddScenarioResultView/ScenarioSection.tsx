import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { concat, filter, find, forEach, head, map } from 'lodash';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { ScenarioResult, CUSTOM } from '@actions/types';
import SettingsSwitch from '@components/core/SettingsSwitch';
import { updateCampaignShowInterludes } from '../actions';
import { completedScenario, scenarioFromCard, Scenario } from '../constants';
import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import { makeAllCyclePacksSelector, getAllStandalonePacks, makePackSelector, AppState } from '@reducers';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { where } from '@data/sqlite/query';
import space from '@styles/space';
import { useCycleScenarios } from '@components/core/hooks';
import { usePickerDialog } from '@components/deck/dialogs';
import { QuerySort } from '@data/sqlite/types';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import EncounterIcon from '@icons/EncounterIcon';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import { useSetCampaignShowInterludes } from '@data/remote/campaigns';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';

interface OwnProps {
  campaign: SingleCampaignT;
  scenarioChanged: (result: ScenarioResult) => void;
  showTextEditDialog: ShowTextEditDialog;
  initialScenarioCode?: string;
}

const SCENARIO_QUERY = where('c.type_code = "scenario"');
const SCENARIO_SORT: QuerySort[] = [{ s: 'c.position', direction: 'ASC' }];

export default function ScenarioSection({ campaign, initialScenarioCode, scenarioChanged, showTextEditDialog }: OwnProps) {
  const [allScenarioCards, loading] = useCardsFromQuery({
    query: SCENARIO_QUERY,
    sort: SCENARIO_SORT,
  });
  const { colors } = useContext(StyleContext);
  const getPack = useMemo(makePackSelector, []);
  const cyclePack = useSelector((state: AppState) => getPack(state, campaign.cycleCode));
  const getAllCyclePacks = useMemo(makeAllCyclePacksSelector, []);
  const cyclePacks = useSelector((state: AppState) => getAllCyclePacks(state, cyclePack));
  const standalonePacks = useSelector(getAllStandalonePacks);
  const fixedCycleScenarios = useCycleScenarios(campaign.cycleCode);
  const showInterludes = !!campaign.showInterludes;
  const allScenarios = useMemo(() => {
    const hasCompletedScenario = completedScenario(campaign.scenarioResults);
    const finishedScenarios = new Set(map(campaign.scenarioResults, r => r.scenarioCode));
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
  }, [allScenarioCards, fixedCycleScenarios, campaign.scenarioResults, cyclePacks, standalonePacks]);

  const [selectedScenario, setSelectedScenario] = useState<Scenario | typeof CUSTOM>(head(allScenarios) || CUSTOM);
  const [customScenario, setCustomScenario] = useState('');
  const [resolution, setResolution] = useState('');
  const dispatch = useDispatch();

  const setShowInterludes = useSetCampaignShowInterludes();
  const toggleShowInterludes = useCallback(() => {
    dispatch(updateCampaignShowInterludes(setShowInterludes, campaign.id, !showInterludes));
  }, [campaign, showInterludes, setShowInterludes, dispatch]);

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
    // tslint:disable-next-line
    if (!loading && allScenarios.length) {
      if (initialScenarioCode) {
        const initialScenario = find(allScenarios, s => s.code === initialScenarioCode);
        if (initialScenario) {
          setSelectedScenario(initialScenario);
          return;
        }
      }
      if (selectedScenario !== 'custom' && allScenarios[0].code !== selectedScenario.code) {
        setSelectedScenario(allScenarios[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allScenarioCards]);
  const possibleScenarios = useMemo(() => {
    const scenarios: { title: string, value: Scenario | typeof CUSTOM }[] = map(
      filter(allScenarios, scenario => showInterludes || !scenario.interlude),
      scenario => {
        return {
          iconNode: scenario.interlude ? <AppIcon name="log" size={24} color={colors.M} /> : <EncounterIcon encounter_code={scenario.code} size={24} color={colors.M} />,
          title: scenario.name,
          value: scenario,
        };
      });
    scenarios.push({
      title: t`Custom`,
      value: CUSTOM,
    });
    return scenarios;
  }, [allScenarios, showInterludes, colors]);
  const [dialog, showDialog] = usePickerDialog({
    title: showInterludes ? t`Scenario or Interlude` : t`Scenario`,
    items: possibleScenarios,
    selectedValue: selectedScenario,
    onValueChange: setSelectedScenario,
  });
  const customScenarioTextChanged = useCallback((value?: string) => {
    setCustomScenario(value || '');
  }, [setCustomScenario]);
  const showCustomScenarioDialog = useCallback(() => {
    showTextEditDialog(t`Scenario name`, customScenario || '', customScenarioTextChanged);
  }, [showTextEditDialog, customScenario, customScenarioTextChanged]);
  const resolutionChanged = useCallback((value?: string) => {
    setResolution(value || '');
  }, [setResolution]);
  const showResolutionDialog = useCallback(() => {
    showTextEditDialog(t`Resolution`, resolution || '', resolutionChanged);
  }, [showTextEditDialog, resolution, resolutionChanged]);

  const scenarioName = useMemo(() => {
    if (loading) {
      return '   ';
    }
    return selectedScenario === CUSTOM ? t`Custom` : selectedScenario.name;
  }, [loading, selectedScenario]);
  return (
    <View style={space.paddingSideS}>
      { dialog }
      <SettingsSwitch
        title={t`Show Interludes`}
        value={showInterludes}
        onValueChange={toggleShowInterludes}
        settingsStyle
        last
      />
      <DeckPickerStyleButton
        icon="book"
        title={selectedScenario !== CUSTOM && selectedScenario.interlude ? t`Interlude` : t`Scenario`}
        valueLabel={scenarioName}
        editable
        first
        onPress={showDialog}
      />
      { !loading && selectedScenario === CUSTOM && (
        <DeckPickerStyleButton
          icon="name"
          title={t`Name`}
          valueLabel={customScenario || t`(required)`}
          onPress={showCustomScenarioDialog}
          editable
        />
      ) }
      { (selectedScenario === CUSTOM || !selectedScenario.interlude) && (
        <DeckPickerStyleButton
          icon="finish"
          title={t`Resolution`}
          valueLabel={resolution || t`(required)`}
          onPress={showResolutionDialog}
          editable
        />
      ) }
    </View>
  );
}
