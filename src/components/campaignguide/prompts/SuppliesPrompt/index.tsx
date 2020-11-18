import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { View } from 'react-native';
import { forEach, keys, map, sumBy } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import InvestigatorNameRow from '../InvestigatorNameRow';
import SupplyComponent from './SupplyComponent';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import ScenarioStepContext from '../../ScenarioStepContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { BulletType, Supply, SuppliesInput } from '@data/scenario/types';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  input: SuppliesInput;
}

interface Counts {
  [code: string]: {
    [id: string]: number ;
  };
}

interface Action {
  type: 'inc' | 'dec';
  code: string;
  supply: string;
}

export default function SuppliesPrompt({ id, bulletType, text, input }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { campaignLog, scenarioInvestigators } = useContext(ScenarioStepContext);
  const [counts, updateCounts] = useReducer((state: Counts, action: Action) => {
    const investigatorCounts = state[action.code] || {};
    const count = investigatorCounts[action.supply] || 0;
    switch (action.type) {
      case 'inc':
        return {
          ...state,
          [action.code]: {
            ...investigatorCounts,
            [action.supply]: count + 1,
          },
        };
      case 'dec':
        return {
          ...state,
          [action.code]: {
            ...investigatorCounts,
            [action.supply]: Math.max(count - 1, 0),
          },
        };
    }
  }, {});

  const incrementSupply = useCallback((code: string, supply: string) => {
    updateCounts({ type: 'inc', code, supply });
  }, [updateCounts]);
  const decrementSupply = useCallback((code: string, supply: string) => {
    updateCounts({ type: 'dec', code, supply });
  }, [updateCounts]);

  const save = useCallback(() => {
    scenarioState.setSupplies(id, counts);
  }, [id, counts, scenarioState]);

  const supplies = useMemo(() => {
    const supplies: {
      [id: string]: Supply;
    } = {};
    forEach(input.supplies, supply => {
      supplies[supply.id] = supply;
    });
    return supplies;
  }, [input.supplies]);

  const playerCount = campaignLog.playerCount();
  const baseTotal = input.points[playerCount - 1];
  const suppliesInput = useMemo(() => scenarioState.supplies(id), [scenarioState, id]);
  const supplyCounts = suppliesInput !== undefined ? suppliesInput : counts;
  return (
    <>
      <SetupStepWrapper bulletType={bulletType}>
        { !!text && <CampaignGuideTextComponent text={text} /> }
      </SetupStepWrapper>
      { map(scenarioInvestigators, (investigator, idx) => {
        const total = baseTotal + (input.special_xp ? campaignLog.specialXp(investigator.code, input.special_xp) : 0);
        const counts = supplyCounts[investigator.code] || {};
        const spent = sumBy(keys(counts), id => {
          const count = counts[id];
          const supply = supplies[id];
          return count * (supply ? supply.cost : 1);
        });
        return (
          <View key={idx}>
            <InvestigatorNameRow
              investigator={investigator}
              detail={suppliesInput !== undefined ? undefined : t`${spent} of ${total}`}
            />
            { map(input.supplies, (supply, idx2) => {
              const count = counts[supply.id] || 0;
              return (suppliesInput === undefined || count > 0) && (
                <SupplyComponent
                  key={idx2}
                  investigator={investigator}
                  supply={supply}
                  count={count}
                  inc={incrementSupply}
                  dec={decrementSupply}
                  remainingPoints={Math.max(total - spent, 0)}
                  editable={suppliesInput === undefined}
                />
              );
            }) }
          </View>
        );
      }) }
      { (suppliesInput === undefined) && (
        <BasicButton
          title={t`Proceed`}
          onPress={save}
        />
      ) }
    </>
  );
}
