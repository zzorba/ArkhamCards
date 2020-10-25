import React, { useCallback, useContext, useMemo } from 'react';
import { keys, forEach, map, filter, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import FactionChooser from './FactionChooser';
import XpChooser from './XpChooser';
import SkillIconChooser from './SkillIconChooser';
import FilterChooserButton from '../FilterChooserButton';
import SliderChooser from '../SliderChooser';
import ToggleFilter from '@components/core/ToggleFilter';
import NavButton from '@components/core/NavButton';
import { getAllPacks } from '@reducers';
import COLORS from '@styles/colors';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { NavigationProps } from '@components/nav/types';
import useFilterFunctions, { FilterFunctionProps } from '../useFilterFunctions';

function rangeText(name: string, values: [number, number]) {
  if (values[0] === values[1]) {
    return `${name}(${values[0]})`;
  }
  return `${name}(${values[0]}-${values[1]})`;
}

function splitTraits(value: string): string[] {
  return filter(map(value.split('.'), t => t.trim()), t => !!t);
}

export type CardFilterProps = FilterFunctionProps;

const CardFilterView = (props: FilterFunctionProps & NavigationProps) => {
  const {
    filters,
    defaultFilterState,
    cardFilterData,
    onFilterChange,
    onToggleChange,
    pushFilterView,
  } = useFilterFunctions(props, {
    title: t`Filters`,
  });
  const allPacks = useSelector(getAllPacks);
  const onPacksPress = useCallback(() => {
    pushFilterView('SearchFilters.Packs');
  }, [pushFilterView]);

  const onEnemyPress = useCallback(() => {
    pushFilterView('SearchFilters.Enemy');
  }, [pushFilterView]);

  const onLocationPress = useCallback(() => {
    pushFilterView('SearchFilters.Location');
  }, [pushFilterView]);
  const {
    packs,
    enemyElite,
    enemyNonElite,
    enemyHunter,
    enemyNonHunter,
    enemyParley,
    enemyRetaliate,
    enemyAlert,
    enemySpawn,
    enemyPrey,
    enemyAloof,
    enemyMassive,
    enemyHealthEnabled,
    enemyHealth,
    enemyHealthPerInvestigator,
    enemyDamageEnabled,
    enemyDamage,
    enemyHorrorEnabled,
    enemyHorror,
    enemyFightEnabled,
    enemyFight,
    enemyEvadeEnabled,
    enemyEvade,
    shroud,
    shroudEnabled,
    clues,
    cluesEnabled,
    cluesFixed,
    hauntedEnabled,
    uses,
    factions,
    traits,
    types,
    subTypes,
    slots,
    encounters,
    illustrators,
    victory,
    vengeance,
    skillIcons,
    skillEnabled,
    level,
    levelEnabled,
    exceptional,
    nonExceptional,
    cost,
    costEnabled,
    unique,
    permanent,
    fast,
    exile,
    bonded,
    seal,
    myriad,
    evadeAction,
    investigateAction,
    fightAction,
  } = filters;

  const selectedPacksText = useMemo(() => {
    if (!allPacks.length || !packs.length) {
      return t`Packs: All`;
    }
    const selectedPackNames = new Set(packs);
    const cyclePackCounts: { [code: string]: number } = {};
    const selectedCyclePackCounts: { [code: string]: number } = {};
    const cycleNames: { [code: string]: string } = {};
    const selectedPacks = filter(
      allPacks,
      pack => {
        if (pack.cycle_position > 1 && pack.cycle_position < 50) {
          if (pack.position === 1) {
            cycleNames[pack.cycle_position] = pack.name;
          }
          cyclePackCounts[pack.cycle_position] =
            (cyclePackCounts[pack.cycle_position] || 0) + 1;
        }
        if (selectedPackNames.has(pack.name)) {
          selectedCyclePackCounts[pack.cycle_position] =
            (selectedCyclePackCounts[pack.cycle_position] || 0) + 1;
          return true;
        }
        return false;
      }
    );
    const [completeCycles, partialCycles] = partition(
      keys(selectedCyclePackCounts),
      cycle_position => selectedCyclePackCounts[cycle_position] === cyclePackCounts[cycle_position]);

    const parts: string[] = [];
    forEach(completeCycles, cycle_position => {
      parts.push(t`${cycleNames[cycle_position]} Cycle`);
    });
    const partialCyclesSet = new Set(partialCycles);
    forEach(selectedPacks, pack => {
      if (partialCyclesSet.has(`${pack.cycle_position}`)) {
        parts.push(pack.name);
      }
    });
    const allPacksString = parts.join(', ');
    return t`Packs: ${allPacksString}`;
  }, [packs, allPacks]);

  const enemyFilterText = useMemo(() => {
    const parts = [];
    if (enemyElite) {
      parts.push(t`Elite`);
    }
    if (enemyNonElite) {
      parts.push(t`Non-Elite`);
    }
    if (enemyHunter) {
      parts.push(t`Hunter`);
    }
    if (enemyNonHunter) {
      parts.push(t`Non-Hunter`);
    }
    if (enemyParley) {
      parts.push(t`Parley`);
    }
    if (enemyRetaliate) {
      parts.push(t`Retaliate`);
    }
    if (enemyAlert) {
      parts.push(t`Alert`);
    }
    if (enemySpawn) {
      parts.push(t`Spawn`);
    }
    if (enemyPrey) {
      parts.push(t`Prey`);
    }
    if (enemyAloof) {
      parts.push(t`Aloof`);
    }
    if (enemyMassive) {
      parts.push(t`Massive`);
    }
    if (enemyHealthEnabled) {
      if (enemyHealthPerInvestigator) {
        parts.push(rangeText(t`HPI`, enemyHealth));
      } else {
        parts.push(rangeText(t`Health`, enemyHealth));
      }
    }
    if (enemyDamageEnabled) {
      parts.push(rangeText(t`Damage`, enemyDamage));
    }
    if (enemyHorrorEnabled) {
      parts.push(rangeText(t`Horror`, enemyHorror));
    }
    if (enemyFightEnabled) {
      parts.push(rangeText(t`Fight`, enemyFight));
    }
    if (enemyEvadeEnabled) {
      parts.push(rangeText(t`Evade`, enemyEvade));
    }

    if (parts.length === 0) {
      return t`Enemies: All`;
    }
    const searchParts = parts.join(', ');
    return t`Enemies: ${searchParts}`;
  }, [
    enemyElite,
    enemyNonElite,
    enemyHunter,
    enemyNonHunter,
    enemyParley,
    enemyRetaliate,
    enemyAlert,
    enemySpawn,
    enemyPrey,
    enemyAloof,
    enemyMassive,
    enemyHealthEnabled,
    enemyHealth,
    enemyHealthPerInvestigator,
    enemyDamageEnabled,
    enemyDamage,
    enemyHorrorEnabled,
    enemyHorror,
    enemyFightEnabled,
    enemyFight,
    enemyEvadeEnabled,
    enemyEvade,
  ]);
  const locationFilterText = useMemo(() => {
    const parts = [];
    if (cluesEnabled) {
      if (cluesFixed) {
        parts.push(rangeText(t`Fixed Clues`, clues));
      } else {
        parts.push(rangeText(t`Clues`, clues));
      }
    }
    if (shroudEnabled) {
      parts.push(rangeText(t`Shroud`, shroud));
    }
    if (hauntedEnabled) {
      parts.push(t`Haunted`);
    }

    if (parts.length === 0) {
      return t`Locations: All`;
    }
    const searchParts = parts.join(', ');
    return t`Locations: ${searchParts}`;
  }, [
    shroud,
    shroudEnabled,
    clues,
    cluesEnabled,
    cluesFixed,
    hauntedEnabled,
  ]);
  const { allFactions, hasXp, hasWeakness, hasCost, hasSkill, hasEnemy, hasLocation, hasSlot, hasUses } = cardFilterData;
  const { backgroundStyle, borderStyle } = useContext(StyleContext);
  const { width } = useWindowDimensions();
  const {
    componentId,
    baseQuery,
    tabooSetId,
  } = props;
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <FactionChooser
        factions={allFactions}
        selection={factions}
        onFilterChange={onFilterChange}
      />
      { hasXp && (
        <XpChooser
          maxLevel={defaultFilterState.level[1]}
          levels={level}
          enabled={levelEnabled}
          onFilterChange={onFilterChange}
          onToggleChange={onToggleChange}
          exceptional={exceptional}
          nonExceptional={nonExceptional}
        />
      ) }
      { hasXp && (
        <SliderChooser
          label={t`Level`}
          width={width}
          values={level}
          enabled={levelEnabled}
          setting="level"
          onFilterChange={onFilterChange}
          toggleName="levelEnabled"
          onToggleChange={onToggleChange}
          max={defaultFilterState.level[1]}
          height={2}
        >
          <View style={styles.xpSection}>
            <ToggleFilter
              label={t`Exceptional`}
              setting="exceptional"
              value={exceptional}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Non-Exceptional`}
              setting="nonExceptional"
              value={nonExceptional}
              onChange={onToggleChange}
            />
          </View>
        </SliderChooser>
      ) }
      <View>
        <FilterChooserButton
          componentId={componentId}
          title={t`Types`}
          field="type_name"
          selection={types}
          setting="types"
          onFilterChange={onFilterChange}
          query={baseQuery}
          tabooSetId={tabooSetId}
        />
        { (subTypes.length > 0 || hasWeakness) && (
          <FilterChooserButton
            componentId={componentId}
            title={t`SubTypes`}
            field="subtype_name"
            selection={subTypes}
            setting="subTypes"
            onFilterChange={onFilterChange}
            query={baseQuery}
            tabooSetId={tabooSetId}
          />
        ) }
      </View>
      { hasCost && (
        <SliderChooser
          label={t`Cost`}
          width={width}
          values={cost}
          enabled={costEnabled}
          setting="cost"
          onFilterChange={onFilterChange}
          toggleName="costEnabled"
          onToggleChange={onToggleChange}
          max={defaultFilterState.cost[1]}
        />
      ) }
      { hasSkill && (
        <SkillIconChooser
          skillIcons={skillIcons}
          onFilterChange={onFilterChange}
          enabled={skillEnabled}
          onToggleChange={onToggleChange}
        />
      ) }
      <View>
        <FilterChooserButton
          title={t`Traits`}
          componentId={componentId}
          field="traits"
          processValue={splitTraits}
          selection={traits}
          setting="traits"
          onFilterChange={onFilterChange}
          query={baseQuery}
          tabooSetId={tabooSetId}
        />
        { hasEnemy && (
          <NavButton
            text={enemyFilterText}
            onPress={onEnemyPress}
          />
        ) }
        { hasLocation && (
          <NavButton
            text={locationFilterText}
            onPress={onLocationPress}
          />
        ) }
      </View>
      { hasSlot && (
        <FilterChooserButton
          componentId={componentId}
          title={t`Slots`}
          processValue={splitTraits}
          field="slot"
          selection={slots}
          setting="slots"
          onFilterChange={onFilterChange}
          query={baseQuery}
          tabooSetId={tabooSetId}
        />
      ) }
      { hasUses && (
        <FilterChooserButton
          componentId={componentId}
          title={t`Uses`}
          field="uses"
          selection={uses}
          setting="uses"
          onFilterChange={onFilterChange}
          query={baseQuery}
          tabooSetId={tabooSetId}
          capitalize
        />
      ) }
      <View style={[styles.toggleStack, borderStyle, space.paddingBottomS]}>
        <View style={[styles.toggleRow, space.marginTopXs]}>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label={t`Fast`}
              setting="fast"
              value={fast}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Permanent`}
              setting="permanent"
              value={permanent}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Seal`}
              setting="seal"
              value={seal}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Fight`}
              setting="fightAction"
              value={fightAction}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Investigate`}
              setting="investigateAction"
              value={investigateAction}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Victory`}
              setting="victory"
              value={victory}
              onChange={onToggleChange}
            />
          </View>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label={t`Exile`}
              setting="exile"
              value={exile}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Unique`}
              setting="unique"
              value={unique}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Myriad`}
              setting="myriad"
              value={myriad}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Evade`}
              setting="evadeAction"
              value={evadeAction}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Bonded`}
              setting="bonded"
              value={bonded}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={t`Vengeance`}
              setting="vengeance"
              value={vengeance}
              onChange={onToggleChange}
            />
          </View>
        </View>
      </View>
      <FilterChooserButton
        componentId={componentId}
        title={t`Encounter Sets`}
        field="encounter_name"
        selection={encounters}
        setting="encounters"
        onFilterChange={onFilterChange}
        query={baseQuery}
        tabooSetId={tabooSetId}
      />
      { (packs.length > 0 || allPacks.length > 1) && (
        <NavButton
          text={selectedPacksText}
          onPress={onPacksPress}
        />
      ) }
      <FilterChooserButton
        componentId={componentId}
        title={t`Illustrators`}
        field="illustrator"
        selection={illustrators}
        setting="illustrators"
        onFilterChange={onFilterChange}
        query={baseQuery}
        tabooSetId={tabooSetId}
      />
    </ScrollView>
  );
};

CardFilterView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Filter`,
        color: COLORS.M,
      },
    },
  };
};

export default CardFilterView;

const styles = StyleSheet.create({
  toggleStack: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  toggleColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  xpSection: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
  },
});
