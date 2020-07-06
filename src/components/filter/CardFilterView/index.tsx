import React from 'react';
import { keys, forEach, filter, indexOf, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Pack } from 'actions/types';
import FactionChooser from './FactionChooser';
import XpChooser from './XpChooser';
import SkillIconChooser from './SkillIconChooser';
import FilterChooserButton from '../FilterChooserButton';
import SliderChooser from '../SliderChooser';
import { CardFilterData } from 'lib/filters';
import ToggleFilter from 'components/core/ToggleFilter';
import withFilterFunctions, { FilterFunctionProps, FilterProps } from '../withFilterFunctions';
import NavButton from 'components/core/NavButton';
import { CARD_FACTION_CODES } from 'app_constants';
import { getAllPacks, AppState } from 'reducers';
import COLORS from 'styles/colors';
import space from 'styles/space';

interface ReduxProps {
  allPacks: Pack[];
}

interface OwnProps {
  cardData: CardFilterData;
}

export type CardFilterProps = FilterFunctionProps & OwnProps;

type Props = OwnProps & ReduxProps & FilterProps;

class CardFilterView extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Filter`,
          color: COLORS.navButton,
        },
      },
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      hasCost: false,
      hasXp: false,
      hasSkill: false,
      allUses: [],
      allFactions: CARD_FACTION_CODES,
      allTraits: [],
      allTypes: [],
      allTypeCodes: [],
      allSubTypes: [],
      allPacks: [],
      allSlots: [],
      allEncounters: [],
      allIllustrators: [],
      levels: [],
    };
  }

  _onPacksPress = () => {
    this.props.pushFilterView('SearchFilters.Packs');
  };

  _onEnemyPress = () => {
    this.props.pushFilterView('SearchFilters.Enemy');
  };

  _onLocationPress = () => {
    this.props.pushFilterView('SearchFilters.Location');
  };

  static rangeText(name: string, values: [number, number]) {
    if (values[0] === values[1]) {
      return `${name}(${values[0]})`;
    }
    return `${name}(${values[0]}-${values[1]})`;
  }

  selectedPacksText() {
    const {
      filters: {
        packs,
      },
      allPacks,
    } = this.props;
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
  }

  enemyFilterText() {
    const {
      filters: {
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
      },
    } = this.props;
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
        parts.push(CardFilterView.rangeText(t`HPI`, enemyHealth));
      } else {
        parts.push(CardFilterView.rangeText(t`Health`, enemyHealth));
      }
    }
    if (enemyDamageEnabled) {
      parts.push(CardFilterView.rangeText(t`Damage`, enemyDamage));
    }
    if (enemyHorrorEnabled) {
      parts.push(CardFilterView.rangeText(t`Horror`, enemyHorror));
    }
    if (enemyFightEnabled) {
      parts.push(CardFilterView.rangeText(t`Fight`, enemyFight));
    }
    if (enemyEvadeEnabled) {
      parts.push(CardFilterView.rangeText(t`Evade`, enemyEvade));
    }

    if (parts.length === 0) {
      return t`Enemies: All`;
    }
    const searchParts = parts.join(', ');
    return t`Enemies: ${searchParts}`;
  }

  locationFilterText() {
    const {
      filters: {
        shroud,
        shroudEnabled,
        clues,
        cluesEnabled,
        cluesFixed,
        hauntedEnabled,
      },
    } = this.props;
    const parts = [];
    if (cluesEnabled) {
      if (cluesFixed) {
        parts.push(CardFilterView.rangeText(t`Fixed Clues`, clues));
      } else {
        parts.push(CardFilterView.rangeText(t`Clues`, clues));
      }
    }
    if (shroudEnabled) {
      parts.push(CardFilterView.rangeText(t`Shroud`, shroud));
    }
    if (hauntedEnabled) {
      parts.push(t`Haunted`);
    }

    if (parts.length === 0) {
      return t`Locations: All`;
    }
    const searchParts = parts.join(', ');
    return t`Locations: ${searchParts}`;
  }

  render() {
    const {
      componentId,
      width,
      defaultFilterState,
      filters: {
        uses,
        factions,
        traits,
        types,
        subTypes,
        packs,
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
      },
      onToggleChange,
      onFilterChange,
      fontScale,
      cardData: {
        allUses,
        allFactions,
        allTraits,
        allTypes,
        allTypeCodes,
        allSubTypes,
        allPacks,
        allSlots,
        allEncounters,
        allIllustrators,
        hasCost,
        hasXp,
        hasSkill,
      },
    } = this.props;

    return (
      <ScrollView>
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
            fontScale={fontScale}
          >
            <View>
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
          { (types.length > 0 || allTypes.length > 0) && (
            <FilterChooserButton
              componentId={componentId}
              title={t`Types`}
              values={allTypes}
              selection={types}
              setting="types"
              onFilterChange={onFilterChange}
              fontScale={fontScale}
            />
          ) }
          { (subTypes.length > 0 || allSubTypes.length > 0) && (
            <FilterChooserButton
              componentId={componentId}
              title={t`SubTypes`}
              values={allSubTypes}
              selection={subTypes}
              setting="subTypes"
              onFilterChange={onFilterChange}
              fontScale={fontScale}
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
            fontScale={fontScale}
          />
        ) }
        { hasSkill && (
          <SkillIconChooser
            skillIcons={skillIcons}
            onFilterChange={onFilterChange}
            enabled={skillEnabled}
            onToggleChange={onToggleChange}
            fontScale={fontScale}
          />
        ) }
        <View>
          { (traits.length > 0 || allTraits.length > 0) && (
            <FilterChooserButton
              title={t`Traits`}
              componentId={componentId}
              values={allTraits}
              selection={traits}
              setting="traits"
              onFilterChange={onFilterChange}
              fontScale={fontScale}
            />
          ) }
          { indexOf(allTypeCodes, 'enemy') !== -1 && (
            <NavButton
              text={this.enemyFilterText()}
              onPress={this._onEnemyPress}
              fontScale={fontScale}
            />
          ) }
          { indexOf(allTypeCodes, 'location') !== -1 && (
            <NavButton
              text={this.locationFilterText()}
              onPress={this._onLocationPress}
              fontScale={fontScale}
            />
          ) }
        </View>
        { (slots.length > 0 || allSlots.length > 0) && (
          <FilterChooserButton
            componentId={componentId}
            title={t`Slots`}
            values={allSlots}
            selection={slots}
            setting="slots"
            onFilterChange={onFilterChange}
            fontScale={fontScale}
          />
        ) }
        { (uses.length > 0 || allUses.length > 0) && (
          <FilterChooserButton
            componentId={componentId}
            title={t`Uses`}
            values={allUses}
            selection={uses}
            setting="uses"
            onFilterChange={onFilterChange}
            fontScale={fontScale}
          />
        ) }
        <View style={[styles.toggleStack, space.paddingBottomS]}>
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
        { (encounters.length > 0 || allEncounters.length > 0) && (
          <FilterChooserButton
            componentId={componentId}
            title={t`Encounter Sets`}
            values={allEncounters}
            selection={encounters}
            setting="encounters"
            onFilterChange={onFilterChange}
            fontScale={fontScale}
          />
        ) }
        { (packs.length > 0 || allPacks.length > 1) && (
          <NavButton
            text={this.selectedPacksText()}
            onPress={this._onPacksPress}
            fontScale={fontScale}
          />
        ) }
        { (illustrators.length > 0 || allIllustrators.length > 0) && (
          <FilterChooserButton
            componentId={componentId}
            title={t`Illustrators`}
            values={allIllustrators}
            selection={illustrators}
            setting="illustrators"
            onFilterChange={onFilterChange}
            fontScale={fontScale}
          />
        ) }
      </ScrollView>
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  return {
    allPacks: getAllPacks(state),
  };
}

export default connect(mapStateToProps)(
  withFilterFunctions(
    CardFilterView,
    { title: t`Filters` }
  )
);

const styles = StyleSheet.create({
  toggleStack: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.background,
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
});
