import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import { filter, map } from 'lodash';
import { t, c } from 'ttag';
import { RouteProp, useRoute } from '@react-navigation/native';

import SliderChooser from '../SliderChooser';
import StyleContext from '@styles/StyleContext';
import useFilterFunctions from '../useFilterFunctions';
import FilterChooserButton from '../FilterChooserButton';
import SkillModifierChooser from './SkillModifierChooser';
import { BasicStackParamList } from '@navigation/types';


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
    aether: t`Aether`,
    ammo: t`Ammo`,
    blame: c('fan-made-uses').t`Blame`,
    bounties: t`Bounties`,
    charges: t`Charges`,
    durability: t`Durability`,
    evidence: c('uses').t`Evidence`,
    keys: t`Keys`,
    leylines: t`Leylines`,
    locks: t`Locks`,
    offerings: t`Offerings`,
    poems: c('fan-made-uses').t`Poems`,
    portents: t`Portents`,
    portions: c('fan-made-uses').t`Portions`,
    resources: t`Resources`,
    secrets: t`Secrets`,
    supplies: c('uses').t`Supplies`,
    tickets: t`Tickets`,
    time: c('uses').t`Time`,
    treats: c('uses').t`Treats`,
    tries: t`Tries`,
    truths: t`Truths`,
    whistles: t`Whistles`,
  };
}

const CardAssetFilterView = () => {
  const route = useRoute<RouteProp<BasicStackParamList, 'SearchFilters.Asset'>>();
  const { baseQuery, tabooSetId } = route.params;
  const {
    defaultFilterState,
    cardFilterData,
    filters,
    onToggleChange,
    onFilterChange,
  } = useFilterFunctions(route.params, {
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
          title={t`Slots`}
          all={c('Slots').t`All`}
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
          title={t`Uses`}
          all={c('Uses').t`All`}
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
export default CardAssetFilterView;
