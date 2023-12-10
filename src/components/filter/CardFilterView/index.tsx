import React, { useCallback, useContext, useMemo } from 'react';
import { keys, flatMap, forEach, map, filter, partition, uniq } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { c, t } from 'ttag';

import getLocalizedTraits from './getLocalizedTraits';
import FactionChooser from './FactionChooser';
import XpChooser from './XpChooser';
import SkillIconChooser from './SkillIconChooser';
import FilterChooserButton from '../FilterChooserButton';
import SliderChooser from '../SliderChooser';
import ToggleFilter from '@components/core/ToggleFilter';
import NavButton from '@components/core/NavButton';
import { getAllRealPacks } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { NavigationProps } from '@components/nav/types';
import useFilterFunctions, { FilterFunctionProps } from '../useFilterFunctions';
import FixedSetChooserButton from '../FixedSetChooserButton';
import { slotsTranslations } from '../CardAssetFilterView';
import LanguageContext from '@lib/i18n/LanguageContext';
import TwoColumnSort, { ToggleItem } from '../TwoColumnSort';
import useTabooChooser from './useTabooChooser';
import { getSpecialPackNames, reprintPackToPack, specialPacks } from '@app_constants';

function rangeText(name: string, values: [number, number]) {
  if (values[0] === values[1]) {
    return `${name} (${values[0]})`;
  }
  return `${name} (${values[0]}-${values[1]})`;
}
function listText(name: string, values: string[], listSeperator: string, translations?: { [key: string]: string }) {
  if (translations) {
    return `${name} (${map(values, item => translations[item]).join(listSeperator)})`;
  }
  return `${name} (${values.join(listSeperator)})`;
}

function splitTraits(value: string): string[] {
  return filter(map(value.split('.'), t => t.trim()), t => !!t);
}

export type CardFilterProps = FilterFunctionProps;

const CardFilterView = (props: FilterFunctionProps & NavigationProps) => {
  const { useCardTraits, listSeperator, lang } = useContext(LanguageContext);
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
  const allPacks = useSelector(getAllRealPacks);
  const onPacksPress = useCallback(() => {
    pushFilterView('SearchFilters.Packs');
  }, [pushFilterView]);

  const onAssetPress = useCallback(() => {
    pushFilterView('SearchFilters.Asset');
  }, [pushFilterView]);

  const onEnemyPress = useCallback(() => {
    pushFilterView('SearchFilters.Enemy');
  }, [pushFilterView]);

  const onLocationPress = useCallback(() => {
    pushFilterView('SearchFilters.Location');
  }, [pushFilterView]);
  const {
    packNames,
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
    enemySwarm,
    enemyPatrol,
    enemyVengeance,
    enemyVictory,
    shroud,
    shroudEnabled,
    clues,
    multiClass,
    cluesEnabled,
    cluesFixed,
    hauntedEnabled,
    locationVengeanceEnabled,
    locationVictoryEnabled,
    factions,
    actions,
    traits,
    types,
    subTypes,
    encounters,
    illustrators,
    skillIcons,
    skillEnabled,
    level,
    levelEnabled,
    exceptional,
    nonExceptional,
    cost,
    costEnabled,
    costEven,
    costOdd,
    uses,
    slots,
    assetSanityEnabled,
    assetHealthEnabled,
    assetHealth,
    assetSanity,
    skillModifiers,
    skillModifiersEnabled,
  } = filters;
  const [tabooDialog, tabooButton] = useTabooChooser({ tabooSetId: filters.taboo_set, onFilterChange });
  const selectedPacksText = useMemo(() => {
    if (!allPacks || !packNames || !allPacks.length || !packNames.length) {
      return t`Packs: All`;
    }
    const selectedPackNames = new Set(packNames);
    const oldCyclePackCounts: { [code: string]: number } = {};
    const oldSelectedCyclePackCounts: { [code: string]: number } = {};

    const newCyclePackCounts: { [code: string]: number } = {};
    const newSelectedCyclePackCounts: { [code: string]: number } = {};
    const cycleNames: { [code: string]: string } = {};
    const specialPackNames = getSpecialPackNames();
    const selectedPacks = [
      ...filter(
        allPacks,
        pack => {
          if (pack.cycle_position > 1 && pack.cycle_position < 50) {
            if (pack.position === 1) {
              cycleNames[pack.cycle_position] = pack.name;
            }
            oldCyclePackCounts[pack.cycle_position] =
              (oldCyclePackCounts[pack.cycle_position] || 0) + 1;
          }
          if (selectedPackNames.has(pack.name)) {
            oldSelectedCyclePackCounts[pack.cycle_position] =
              (oldSelectedCyclePackCounts[pack.cycle_position] || 0) + 1;
            return true;
          }
          return false;
        }
      ),
      ...flatMap(specialPacks, pack => {
        if (pack.cyclePosition > 1 && pack.cyclePosition < 50) {
          newCyclePackCounts[pack.cyclePosition] =
          (newCyclePackCounts[pack.cyclePosition] || 0) + 1;
        }
        const name = specialPackNames[pack.code];
        if (selectedPackNames.has(name)) {
          newSelectedCyclePackCounts[pack.cyclePosition] =
            (newSelectedCyclePackCounts[pack.cyclePosition] || 0) + 1;
          return [reprintPackToPack(pack)];
        }
        return [];
      }),
    ];
    const [completeCycles, partialCycles] = partition(
      uniq([...keys(oldSelectedCyclePackCounts), ...keys(newSelectedCyclePackCounts)]),
      cycle_position =>
        oldSelectedCyclePackCounts[cycle_position] === oldCyclePackCounts[cycle_position] ||
        newSelectedCyclePackCounts[cycle_position] === newCyclePackCounts[cycle_position]);

    const parts: string[] = [];
    forEach(completeCycles, cycle_position => {
      parts.push(c('filter').t`${cycleNames[cycle_position]} Cycle`);
    });
    const partialCyclesSet = new Set(partialCycles);
    forEach(selectedPacks, pack => {
      if (partialCyclesSet.has(`${pack.cycle_position}`)) {
        parts.push(pack.name);
      }
    });
    const allPacksString = parts.join(listSeperator);
    return t`Packs: ${allPacksString}`;
  }, [packNames, allPacks, listSeperator]);

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
    if (enemySwarm) {
      parts.push(t`Swarm`);
    }
    if (enemyPatrol) {
      parts.push(t`Patrol`);
    }
    if (enemyVictory) {
      parts.push(t`Victory`);
    }
    if (enemyVengeance) {
      parts.push(t`Vengeance`);
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
    const searchParts = parts.join(listSeperator);
    return t`Enemies: ${searchParts}`;
  }, [
    listSeperator,
    enemyElite,
    enemyNonElite,
    enemyHunter,
    enemyNonHunter,
    enemyRetaliate,
    enemyAlert,
    enemySpawn,
    enemyPrey,
    enemyAloof,
    enemyPatrol,
    enemySwarm,
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
    enemyParley,
    enemyVengeance,
    enemyVictory,
  ]);


  const assetFilterText = useMemo(() => {
    const parts = [];
    if (assetHealthEnabled) {
      parts.push(rangeText(t`Health`, assetHealth));
    }
    if (assetSanityEnabled) {
      parts.push(rangeText(t`Sanity`, assetSanity));
    }
    if (uses.length) {
      parts.push(listText(t`Uses`, uses, listSeperator));
    }
    if (slots.length) {
      parts.push(listText(t`Slots`, slots, listSeperator, slotsTranslations()));
    }
    if (skillModifiersEnabled) {
      const modifiers: string[] = [];
      if (skillModifiers.agility) {
        modifiers.push(t`Agility`);
      }
      if (skillModifiers.combat) {
        modifiers.push(t`Combat`);
      }
      if (skillModifiers.intellect) {
        modifiers.push(t`Intellect`);
      }
      if (skillModifiers.willpower) {
        modifiers.push(t`Willpower`);
      }
      parts.push(listText(t`Boost`, modifiers, listSeperator));
    }
    if (parts.length === 0) {
      return t`Assets: All`;
    }
    const searchParts = parts.join(listSeperator);
    return t`Assets: ${searchParts}`;
  }, [assetHealthEnabled, assetHealth, assetSanityEnabled, assetSanity, uses, slots, skillModifiersEnabled, skillModifiers, listSeperator]);
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
    if (locationVictoryEnabled) {
      parts.push(t`Victory`);
    }
    if (locationVengeanceEnabled) {
      parts.push(t`Vengeance`);
    }

    if (parts.length === 0) {
      return t`Locations: All`;
    }
    const searchParts = parts.join(listSeperator);
    return t`Locations: ${searchParts}`;
  }, [listSeperator, shroud, shroudEnabled, clues, cluesEnabled, cluesFixed, hauntedEnabled, locationVictoryEnabled, locationVengeanceEnabled]);
  const { allFactions, hasXp, hasWeakness, hasCost, hasSkill, hasEnemy, hasLocation } = cardFilterData;
  const { backgroundStyle, width } = useContext(StyleContext);
  const {
    componentId,
    baseQuery,
    tabooSetId,
  } = props;
  const localizedTraits = useMemo(() => {
    if (!useCardTraits) {
      return getLocalizedTraits();
    }
    return undefined;
  }, [useCardTraits]);
  const toggleItems: ToggleItem[] = useMemo(() => {
    const nonUniqueStr = t`Non-Unique`;
    const uniqueStr = t`Unique`;
    return [
      { label: t`Fast`, setting: 'fast' },
      { label: `${nonUniqueStr}`, setting: 'nonUnique' },
      { label: `${uniqueStr} (✷)`, setting: 'unique' },
      { label: t`Seal`, setting: 'seal' },
      { label: t`Victory`, setting: 'victory' },
      { label: t`Exile`, setting: 'exile' },
      { label: t`Permanent`, setting: 'permanent' },
      { label: t`Myriad`, setting: 'myriad' },
      { label: t`Bonded`, setting: 'bonded' },
      { label: t`Customizable`, setting: 'customizable' },
      { label: t`Exceptional`, setting: 'exceptional' },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <FactionChooser
          factions={allFactions}
          selection={factions}
          multiClass={multiClass}
          onFilterChange={onFilterChange}
          componentId={componentId}
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
            componentId={componentId}
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
            all={c('Types').t`All`}
            field="type_code"
            selection={types}
            setting="types"
            onFilterChange={onFilterChange}
            query={baseQuery}
            tabooSetId={tabooSetId}
            fixedTranslations={{
              asset: t`Asset`,
              event: t`Event`,
              skill: t`Skill`,
              key: t`Key`,
              act: t`Act`,
              agenda: t`Agenda`,
              story: t`Story`,
              enemy: t`Enemy`,
              treachery: t`Treachery`,
              location: t`Location`,
              investigator: c('card-type').t`Investigator`,
              scenario: t`Scenario`,
            }}
          />
          { (subTypes.length > 0 || hasWeakness) && (
            <FilterChooserButton
              componentId={componentId}
              title={t`SubTypes`}
              all={c('SubTypes').t`All`}
              field="subtype_code"
              selection={subTypes}
              setting="subTypes"
              onFilterChange={onFilterChange}
              query={baseQuery}
              tabooSetId={tabooSetId}
              fixedTranslations={{
                weakness: t`Weakness`,
                basicweakness: t`Basic Weakness`,
              }}
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
            height={2}
          >
            <View style={styles.xpSection}>
              <ToggleFilter
                label={c('cost').t`Even`}
                setting="costEven"
                value={costEven}
                onChange={onToggleChange}
              />
              <ToggleFilter
                label={c('cost').t`Odd`}
                setting="costOdd"
                value={costOdd}
                onChange={onToggleChange}
              />
            </View>
          </SliderChooser>
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
          <FixedSetChooserButton
            title={t`Actions`}
            all={c('Actions').t`All`}
            componentId={componentId}
            selection={actions}
            setting="actions"
            onFilterChange={onFilterChange}
            allValues={{
              'fight': c('action').t`Fight`,
              'engage': c('action').t`Engage`,
              'investigate': c('action').t`Investigate`,
              'play': c('action').t`Play`,
              'draw': c('action').t`Draw`,
              'move': c('action').t`Move`,
              'evade': c('action').t`Evade`,
              'resource': c('action').t`Resource`,
              'parley': c('parley').t`Parley`,
            }}
          />
          <FilterChooserButton
            title={t`Traits`}
            all={c('Traits').t`All`}
            componentId={componentId}
            field={useCardTraits ? 'traits' : 'real_traits'}
            fixedTranslations={localizedTraits}
            processValue={splitTraits}
            selection={traits}
            setting="traits"
            onFilterChange={onFilterChange}
            query={baseQuery}
            tabooSetId={tabooSetId}
          />
          <NavButton
            text={assetFilterText}
            onPress={onAssetPress}
          />
        </View>
        <TwoColumnSort items={toggleItems} onToggleChange={onToggleChange} filters={filters} />
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
        <FilterChooserButton
          componentId={componentId}
          title={t`Encounter Sets`}
          all={c('Encounter Sets').t`All`}
          field="encounter_name"
          selection={encounters}
          setting="encounters"
          onFilterChange={onFilterChange}
          query={baseQuery}
          tabooSetId={tabooSetId}
        />
        { (packNames.length > 0 || allPacks.length > 1) && (
          <NavButton
            text={selectedPacksText}
            onPress={onPacksPress}
          />
        ) }
        { tabooButton }
        <FilterChooserButton
          componentId={componentId}
          title={t`Illustrators`}
          all={c('Illustrators').t`All`}
          field="illustrator"
          selection={illustrators}
          setting="illustrators"
          onFilterChange={onFilterChange}
          query={baseQuery}
          tabooSetId={tabooSetId}
        />
      </ScrollView>
      { tabooDialog }
    </>
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
  xpSection: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
  },
});
