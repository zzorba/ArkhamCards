import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { find } from 'lodash';

import AppIcon from '@icons/AppIcon';
import Card from '@data/types/Card';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { Supply } from '@data/scenario/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import SupplyInputItem from './SupplyInputItem';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';

interface Props {
  investigator: Card;
  sectionId: string;
  supply: Supply;
  count: number;
  remainingPoints: number;
  inc: (code: string, id: string) => void;
  dec: (code: string, id: string) => void;
  editable: boolean;
}

export default function SupplyComponent({
  investigator,
  sectionId,
  supply,
  count,
  remainingPoints,
  editable,
  inc,
  dec,
}: Props) {
  const { processedScenario } = useContext(ScenarioGuideContext);
  const { typography, colors } = useContext(StyleContext);
  const existingCount = useMemo(() => {
    if (!editable) {
      return 0;
    }
    const section = (processedScenario.latestCampaignLog.investigatorSections[sectionId] || {})[investigator.code] || {};
    const crossed_out = !!(section.crossedOut || {})[supply.id];
    if (crossed_out) {
      return 0;
    }
    const entry = find(section.entries || [],
      e => e.id === supply.id && e.type === 'count'
    );
    if (!entry || entry.type !== 'count') {
      return 0;
    }
    return entry.count;
  }, [supply.id, processedScenario.latestCampaignLog, editable, sectionId, investigator.code]);

  const onIncrement = useCallback(() => {
    inc(investigator.code, supply.id);
  }, [investigator, inc, supply]);

  const onDecrement = useCallback(() => {
    dec(investigator.code, supply.id);
  }, [investigator, dec, supply]);

  const onToggleChange = useCallback((value: boolean) => {
    if (value) {
      inc(investigator.code, supply.id);
    } else {
      dec(investigator.code, supply.id);
    }
  }, [investigator.code, supply.id, inc, dec]);

  const input = useMemo(() => {
    if (!supply.multiple) {
      return editable ? (
        <View style={[space.paddingLeftS, space.paddingRightXs]}>
          <ArkhamSwitch
            value={(count + existingCount) > 0}
            onValueChange={onToggleChange}
            color="dark"
            disabledColor={!editable ? colors.D10 : colors.L10}
            disabled={!editable || (count === 0 && remainingPoints < supply.cost) || existingCount > 0}
          />
        </View>
      ) : (
        <View style={[space.paddingLeftM, space.paddingRightS]}>
          <AppIcon
            size={20}
            name="check"
            color={colors.D20}
          />
        </View>
      );
    }
    return editable ? (
      <PlusMinusButtons
        count={count}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        max={supply.multiple ? undefined : 1}
        disablePlus={remainingPoints < supply.cost}
        hideDisabledMinus
        dialogStyle
        rounded
        countRender={(
          <View style={space.paddingSideXs}>
            <Text style={[typography.counter, typography.center, { minWidth: 26 }]}>
              { existingCount > 0 ? `(${existingCount}) + ` : ''}{ count }
            </Text>
          </View>
        )}
      />
    ) : (
      <Text style={[space.paddingSideM, typography.text, typography.bold, typography.center]}>
        +{ count }
      </Text>
    );
  }, [onIncrement, onDecrement, onToggleChange, existingCount, supply.multiple, remainingPoints, supply.cost, count, editable, colors, typography]);
  return (
    <View style={[space.paddingSideS, space.paddingTopS, { backgroundColor: colors.L20 }]}>
      <SupplyInputItem
        supply={supply.id}
        name={supply.name}
        cost={supply.cost}
        description={supply.description}
      >
        { input }
      </SupplyInputItem>
    </View>
  );
}