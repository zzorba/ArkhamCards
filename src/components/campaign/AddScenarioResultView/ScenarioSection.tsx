import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { concat, filter, forEach, head, map } from 'lodash';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { Campaign, SingleCampaign, ScenarioResult, CUSTOM, getCampaignId } from '@actions/types';
import SettingsSwitch from '@components/core/SettingsSwitch';
import EditText from '@components/core/EditText';
import { updateCampaign } from '../actions';
import { completedScenario, scenarioFromCard, Scenario } from '../constants';
import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import { makeAllCyclePacksSelector, getAllStandalonePacks, makePackSelector, AppState } from '@reducers';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { where } from '@data/query';
import space from '@styles/space';
import { useCycleScenarios } from '@components/core/hooks';
import { usePickerDialog } from '@components/deck/dialogs';
import { QuerySort } from '@data/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';

interface OwnProps {
  componentId: string;
  campaign: SingleCampaign;
  scenarioChanged: (result: ScenarioResult) => void;
  showTextEditDialog: ShowTextEditDialog;
}

const SCENARIO_QUERY = where('c.type_code = "scenario"');
const SCENARIO_SORT: QuerySort[] = [{ s: 'c.position', direction: 'ASC' }];

export default function ScenarioSection({ campaign, scenarioChanged, showTextEditDialog }: OwnProps) {
  const [allScenarioCards, loading] = useCardsFromQuery({
    query: SCENARIO_QUERY,
    sort: SCENARIO_SORT,
  });
  const { user } = useContext(ArkhamCardsAuthContext);
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
    const campaignUpdate: Partial<Campaign> = { showInterludes: !showInterludes };
    dispatch(updateCampaign(user, getCampaignId(campaign), campaignUpdate));
  }, [campaign, showInterludes, user, dispatch]);

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
    if (!loading && allScenarios.length && allScenarios[0] !== selectedScenario) {
      setSelectedScenario(allScenarios[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allScenarioCards]);
  const possibleScenarios = useMemo(() => {
    const scenarios: { title: string, value: Scenario | typeof CUSTOM }[] = map(
      filter(allScenarios, scenario => showInterludes || !scenario.interlude),
      scenario => {
        return {
          title: scenario.name,
          value: scenario,
        };
      });
    scenarios.push({
      title: t`Custom`,
      value: CUSTOM,
    });
    return scenarios;
  }, [allScenarios, showInterludes]);
  const { dialog, showDialog } = usePickerDialog({
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
        valueLabel={selectedScenario === CUSTOM ? t`Custom` : selectedScenario.name}
        editable
        first
        onPress={showDialog}
      />
      { selectedScenario === CUSTOM && (
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
          icon="check-thin"
          title={t`Resolution`}
          valueLabel={resolution || t`(required)`}
          onPress={showResolutionDialog}
          editable
        />
      ) }
    </View>
  );
}
