import React, { useCallback, useMemo } from 'react';
import { map, partition } from 'lodash';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import { StandaloneId } from '@actions/types';
import { getLangPreference, getPacksInCollection } from '@reducers';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { getStandaloneScenarios, StandaloneScenarioInfo } from '@data/scenario';
import StandaloneItem from './StandaloneItem';

export interface SelectCampagaignProps {
  standaloneChanged: (id: StandaloneId, text: string, hasGuide: boolean) => void;
}

export default function StandaloneTab({ standaloneChanged }: SelectCampagaignProps) {
  const lang = useSelector(getLangPreference);
  const in_collection = useSelector(getPacksInCollection);
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

  const [myStandalones, otherStandalones] = partition(
    scenarios,
    scenario => in_collection[scenario.code]
  );
  return (
    <>
      { myStandalones.length > 0 && (
        <CardSectionHeader section={{ title: t`My Standalones` }} />
      ) }
      { map(myStandalones, pack_code => renderStandalone(pack_code)) }
      { otherStandalones.length > 0 && (
        <CardSectionHeader section={{ title: t`Other Standalones` }} />
      ) }
      { map(otherStandalones, pack_code => renderStandalone(pack_code)) }
    </>
  );
}
