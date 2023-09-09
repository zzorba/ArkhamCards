import React, { useContext, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { t } from 'ttag';

import SliderChooser from './SliderChooser';
import ToggleFilter from '@components/core/ToggleFilter';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import useFilterFunctions, { FilterFunctionProps } from './useFilterFunctions';
import { NavigationProps } from '@components/nav/types';
import LanguageContext from '@lib/i18n/LanguageContext';
import TwoColumnSort, { ToggleItem } from './TwoColumnSort';

const CardEnemyFilterView = (props: FilterFunctionProps & NavigationProps) => {
  const {
    defaultFilterState,
    filters,
    onToggleChange,
    onFilterChange,
  } = useFilterFunctions(props, {
    title: t`Enemy Filters`,
    clearTraits: [
      'enemyHealth',
      'enemyHealthEnabled',
      'enemyHealthPerInvestigator',
      'enemyDamage',
      'enemyDamageEnabled',
      'enemyHorror',
      'enemyHorrorEnabled',
      'enemyFight',
      'enemyFightEnabled',
      'enemyEvade',
      'enemyEvadeEnabled',
      'enemyElite',
      'enemyNonElite',
      'enemyParley',
      'enemyRetaliate',
      'enemyAlert',
      'enemyHunter',
      'enemyNonHunter',
      'enemySpawn',
      'enemyPrey',
      'enemyAloof',
      'enemyMassive',
      'enemySwarm',
      'enemyPatrol',
      'enemyVictory',
      'enemyVengeance',
      'enemyConcealed',
    ],
  });
  const {
    enemyHealth,
    enemyHealthEnabled,
    enemyHealthPerInvestigator,
    enemyDamage,
    enemyDamageEnabled,
    enemyHorror,
    enemyHorrorEnabled,
    enemyFight,
    enemyFightEnabled,
    enemyEvade,
    enemyEvadeEnabled,
  } = filters;
  const { backgroundStyle, width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const toggleItems: ToggleItem[] = useMemo(() => {
    return [
      { label: t`Elite`, setting: 'enemyElite', sort: '0' },
      { label: t`Non-Elite`, setting: 'enemyNonElite', sort: '01' },
      { label: t`Hunter`, setting: 'enemyHunter', sort: '1' },
      { label: t`Non-Hunter`, setting: 'enemyNonHunter', sort: '11' },
      { label: t`Alert`, setting: 'enemyAlert' },
      { label: t`Massive`, setting: 'enemyMassive' },
      { label: t`Spawn`, setting: 'enemySpawn' },
      { label: t`Patrol`, setting: 'enemyPatrol' },
      { label: t`Swarm`, setting: 'enemySwarm' },
      { label: t`Aloof`, setting: 'enemyAloof' },
      { label: t`Retaliate`, setting: 'enemyRetaliate' },
      { label: t`Prey`, setting: 'enemyPrey' },
      { label: t`Parley`, setting: 'enemyParley' },
      { label: t`Victory`, setting: 'enemyVictory' },
      { label: t`Vengeance`, setting: 'enemyVengeance' },
      { label: t`Concealed`, setting: 'enemyConcealed' },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <SliderChooser
        label={t`Fight`}
        width={width}
        max={defaultFilterState.enemyFight[1]}
        values={enemyFight}
        setting="enemyFight"
        onFilterChange={onFilterChange}
        enabled={enemyFightEnabled}
        toggleName="enemyFightEnabled"
        onToggleChange={onToggleChange}
      />
      <SliderChooser
        label={t`Health`}
        width={width}
        max={defaultFilterState.enemyHealth[1]}
        values={enemyHealth}
        setting="enemyHealth"
        onFilterChange={onFilterChange}
        enabled={enemyHealthEnabled}
        toggleName="enemyHealthEnabled"
        onToggleChange={onToggleChange}
        height={1}
      >
        <View>
          <ToggleFilter
            label={t`Per Investigator`}
            setting="enemyHealthPerInvestigator"
            value={enemyHealthPerInvestigator}
            onChange={onToggleChange}
          />
        </View>
      </SliderChooser>
      <SliderChooser
        label={t`Evade`}
        width={width}
        max={defaultFilterState.enemyEvade[1]}
        values={enemyEvade}
        setting="enemyEvade"
        onFilterChange={onFilterChange}
        enabled={enemyEvadeEnabled}
        toggleName="enemyEvadeEnabled"
        onToggleChange={onToggleChange}
      />
      <SliderChooser
        label={t`Damage`}
        width={width}
        max={defaultFilterState.enemyDamage[1]}
        values={enemyDamage}
        setting="enemyDamage"
        onFilterChange={onFilterChange}
        enabled={enemyDamageEnabled}
        toggleName="enemyDamageEnabled"
        onToggleChange={onToggleChange}
      />
      <SliderChooser
        label={t`Horror`}
        width={width}
        max={defaultFilterState.enemyHorror[1]}
        values={enemyHorror}
        setting="enemyHorror"
        onFilterChange={onFilterChange}
        enabled={enemyHorrorEnabled}
        toggleName="enemyHorrorEnabled"
        onToggleChange={onToggleChange}
      />
      <TwoColumnSort
        noBorder
        onToggleChange={onToggleChange}
        filters={filters}
        items={toggleItems}
      />
    </ScrollView>
  );
};
CardEnemyFilterView.options = () => {
  return {
    topBar: {
      backButton: {
        title: t`Back`,
        color: COLORS.M,
      },
      title: {
        text: t`Enemy Filters`,
      },
    },
  };
};
export default CardEnemyFilterView;
