import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { Text, View } from 'react-native';
import { forEach, keys, map, filter, sumBy } from 'lodash';
import { jt } from 'ttag';

import AppIcon from '@icons/AppIcon';
import SupplyComponent from './SupplyComponent';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import ScenarioStepContext from '../../ScenarioStepContext';
import { BulletType, Supply, SuppliesInput } from '@data/scenario/types';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import InputWrapper from '../InputWrapper';

interface Props {
  id: string;
  width: number;
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
  const { colors, typography, width } = useContext(StyleContext);
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
  const supplyIcon = <AppIcon key="resource" name="resource" size={16} color={colors.L30} />;
  return (
    <InputWrapper
      bulletType={bulletType || 'default'}
      title={text}
      titleStyle="setup"
      editable={suppliesInput === undefined}
      onSubmit={save}
    >
      { map(scenarioInvestigators, (investigator, idx) => {
        const total = baseTotal + (input.special_xp ? campaignLog.specialXp(investigator.code, input.special_xp) : 0);
        const counts = supplyCounts[investigator.code] || {};
        const spent = sumBy(keys(counts), id => {
          const count = counts[id];
          const supply = supplies[id];
          return count * (supply ? supply.cost : 1);
        });
        return (
          <View style={space.paddingBottomXs} key={idx}>
            <RoundedFactionBlock
              faction={investigator.factionCode()}
              header={
                <CompactInvestigatorRow
                  investigator={investigator}
                  width={width - s * (suppliesInput === undefined ? 4 : 2)}
                  open
                >
                  { <Text style={[typography.button, typography.white]}>{jt`${spent} of ${supplyIcon} ${total}`}</Text> }
                </CompactInvestigatorRow>
              }
              noSpace
              noShadow
            >
              <View style={[space.paddingBottomS, { backgroundColor: colors.L20, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                { map(filter(input.supplies, (supply) => {
                  const count = counts[supply.id] || 0;
                  return (suppliesInput === undefined || count > 0);
                }), (supply, idx2) => {
                  const count = counts[supply.id] || 0;
                  return (
                    <SupplyComponent
                      key={`${supply.id}-${idx2}`}
                      sectionId={input.section}
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
            </RoundedFactionBlock>
          </View>
        );
      }) }
    </InputWrapper>
  );
}
