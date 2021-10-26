import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import { filter, map } from 'lodash';
import { t, c } from 'ttag';

import SliderChooser from '../SliderChooser';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import useFilterFunctions, { FilterFunctionProps } from '../useFilterFunctions';
import { NavigationProps } from '@components/nav/types';
import FilterChooserButton from '../FilterChooserButton';
import SkillModifierChooser from './SkillModifierChooser';


function splitSlot(value: string): string[] {
  return filter(map(value.split('.'), t => t.trim().toLowerCase()), t => !!t);
}

export function slotsTranslations() {
  return {
    none: c('slots').t`None`,
    hand: t`Hand`,
    arcane: t`Arcane`,
    accessory: t`Accessory`,
    body: t`Body`,
    ally: t`Ally`,
    tarot: t`Tarot`,
    'hand x2': t`Hand x2`,
    'arcane x2': t`Arcane x2`,
  };
}


export function usesTranslations() {
  return {
    ammo: t`Ammo`,
    bounties: t`Bounties`,
    charges: t`Charges`,
    keys: t`Keys`,
    locks: t`Locks`,
    resources: t`Resources`,
    secrets: t`Secrets`,
    supplies: t`Supplies`,
    tickets: t`Tickets`,
    tries: t`Tries`,
    whistles: t`Whistles`,
  };
}

const CardAssetFilterView = (props: FilterFunctionProps & NavigationProps) => {
  const { componentId, baseQuery, tabooSetId } = props;
  const {
    defaultFilterState,
    cardFilterData,
    filters,
    onToggleChange,
    onFilterChange,
  } = useFilterFunctions(props, {
    title: t`Asset Filters`,
    clearTraits: [
      'slots',
      'uses',
      'skillModifiers',
      'skillModifiersEnabled',
      'assetHealthEnabled',
      'assetHealth',
      'assetSanityEnabled',
      'assetSanity',
    ],
  });
  const {
    slots,
    uses,
    assetHealth,
    assetHealthEnabled,
    assetSanity,
    assetSanityEnabled,
    skillModifiers,
    skillModifiersEnabled,
  } = filters;
  const { hasSlot, hasUses } = cardFilterData;

  const { backgroundStyle, width } = useContext(StyleContext);
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      { hasSlot && (
        <FilterChooserButton
          componentId={componentId}
          title={t`Slots`}
          processValue={splitSlot}
          field="real_slot"
          selection={slots}
          setting="slots"
          onFilterChange={onFilterChange}
          query={baseQuery}
          tabooSetId={tabooSetId}
          fixedTranslations={slotsTranslations()}
          includeNone
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
          fixedTranslations={usesTranslations()}
          capitalize
        />
      ) }
      <SkillModifierChooser
        enabled={skillModifiersEnabled}
        onFilterChange={onFilterChange}
        onToggleChange={onToggleChange}
        skillModifiers={skillModifiers}
      />
      <SliderChooser
        label={t`Health`}
        width={width}
        max={defaultFilterState.assetHealth[1]}
        values={assetHealth}
        setting="assetHealth"
        onFilterChange={onFilterChange}
        enabled={assetHealthEnabled}
        toggleName="assetHealthEnabled"
        onToggleChange={onToggleChange}
      />
      <SliderChooser
        label={t`Sanity`}
        width={width}
        max={defaultFilterState.assetSanity[1]}
        values={assetSanity}
        setting="assetSanity"
        onFilterChange={onFilterChange}
        enabled={assetSanityEnabled}
        toggleName="assetSanityEnabled"
        onToggleChange={onToggleChange}
      />
    </ScrollView>
  );
};
CardAssetFilterView.options = () => {
  return {
    topBar: {
      backButton: {
        title: t`Back`,
        color: COLORS.M,
      },
      title: {
        text: t`Asset Filters`,
      },
    },
  };
};
export default CardAssetFilterView;
