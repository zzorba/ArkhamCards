import React, { useCallback, useMemo } from 'react';
import { map } from 'lodash';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import { StandaloneId } from '@actions/types';
import { getLangPreference } from '@reducers';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { getStandaloneScenarios, StandaloneScenarioInfo } from '@data/scenario';
import StandaloneItem from './StandaloneItem';

export interface SelectCampagaignProps {
  standaloneChanged: (id: StandaloneId, text: string, hasGuide: boolean) => void;
}

export default function StandaloneTab({ standaloneChanged }: SelectCampagaignProps) {
  const lang = useSelector(getLangPreference);
  const scenarios = useMemo(() => getStandaloneScenarios(lang), [lang]);
  const onPress = useCallback((id: StandaloneId, text: string) => {
    standaloneChanged(id, text, true);
  }, [standaloneChanged]);


  const renderStandalone = useCallback((scenario: StandaloneScenarioInfo) => {
    return (
      <StandaloneItem
        id={scenario.id}
        key={scenario.code}
        packCode={scenario.code}
        onPress={onPress}
        text={scenario.name}
      />
    );
  }, [onPress]);
  return (
    <>
      <CardSectionHeader section={{ title: t`Standalones` }} />
      { map(scenarios, pack_code => renderStandalone(pack_code)) }
    </>
  );
}
