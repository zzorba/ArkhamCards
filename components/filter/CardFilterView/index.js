import React from 'react';
import PropTypes from 'prop-types';
import { keys, forEach, filter, map } from 'lodash';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import FactionChooser from './FactionChooser';
import FilterChooserButton from '../FilterChooserButton';
import SkillIconChooser from './SkillIconChooser';
import SliderChooser from '../SliderChooser';
import ToggleFilter from '../ToggleFilter';
import withFilterFunctions from '../withFilterFunctions';
import NavButton from '../../core/NavButton';
import { FACTION_CODES } from '../../../constants';

const CARD_FACTION_CODES = [...FACTION_CODES, 'mythos'];

class CardFilterView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    cards: PropTypes.object,
    filters: PropTypes.object,
    pushFilterView: PropTypes.func.isRequired,
    onToggleChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      width,
    } = Dimensions.get('window');

    this.state = {
      loading: true,
      width,
      hasCost: false,
      hasXp: false,
      hasSkill: false,
      allCycleNames: [],
      allUses: [],
      allFactions: CARD_FACTION_CODES,
      allTraits: [],
      allTypes: [],
      allSubTypes: [],
      allPacks: [],
      allSlots: [],
      allEncounters: [],
      allIllustrators: [],
    };

    this._onEnemyPress = this.onEnemyPress.bind(this);

    props.navigator.setTitle({
      title: 'Filter',
    });
    props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Clear',
          id: 'clear',
        },
      ],
    });
  }

  componentDidMount() {
    const {
      cards,
    } = this.props;
    setTimeout(() => {
      const allFactions = filter(FACTION_CODES, faction_code =>
        cards.filtered(`faction_code == '${faction_code}'`).length > 0);
      let hasCost = false;
      let hasXp = false;
      let hasSkill = false;
      const typesMap = {};
      const usesMap = {};
      const subTypesMap = {};
      const cycleNamesMap = {};
      const traitsMap = {};
      const packsMap = {};
      const slotsMap = {};
      const encountersMap = {};
      const illustratorsMap = {};
      forEach(cards, card => {
        if (card.cost !== null) {
          hasCost = true;
        }
        if (card.xp !== null) {
          hasXp = true;
        }
        if (!hasSkill && (
          card.skill_willpower ||
          card.skill_intellect ||
          card.skill_combat ||
          card.skill_agility ||
          card.skill_wild
        )) {
          hasSkill = true;
        }
        if (card.traits) {
          forEach(
            filter(map(card.traits.split('.'), t => t.trim()), t => t),
            t => {
              traitsMap[t] = 1;
            });
        }
        if (card.subtype_name) {
          subTypesMap[card.subtype_name] = 1;
        }
        if (card.cycle_name) {
          cycleNamesMap[card.cycle_name] = 1;
        }
        if (card.uses) {
          usesMap[card.uses] = 1;
        }
        if (card.pack_name) {
          packsMap[card.pack_name] = 1;
        }
        if (card.slot) {
          slotsMap[card.slot] = 1;
        }
        if (card.encounter_name) {
          encountersMap[card.encounter_name] = 1;
        }
        if (card.illustrator) {
          illustratorsMap[card.illustrator] = 1;
        }
        typesMap[card.type_name] = 1;
      });

      this.setState({
        loading: false,
        allFactions,
        hasCost,
        hasXp,
        hasSkill,
        allCycleNames: keys(cycleNamesMap).sort(),
        allUses: keys(usesMap).sort(),
        allTraits: keys(traitsMap).sort(),
        allTypes: keys(typesMap).sort(),
        allSubTypes: keys(subTypesMap).sort(),
        allPacks: keys(packsMap).sort(),
        allSlots: keys(slotsMap).sort(),
        allEncounters: keys(encountersMap).sort(),
        allIllustrators: keys(illustratorsMap).sort(),
      });
    }, 0);
  }

  onEnemyPress() {
    this.props.pushFilterView('SearchFilters.Enemy');
  }

  onToggleChange(key) {
    this.props.onToggleChange(key);
  }

  onFilterChange(key, selection) {
    this.props.onFilterChange(key, selection);
  }

  enemyFilterText() {
    const {
      filters: {
        nonElite,
      },
    } = this.props;
    const parts = [];
    if (nonElite) {
      parts.push('Non-Elite');
    }

    if (parts.length === 0) {
      return 'Enemies: All';
    }
    return `Enemies: ${parts.join(', ')}`;
  }

  render() {
    const {
      navigator,
      filters: {
        uses,
        factions,
        traits,
        types,
        subTypes,
        packs,
        cycleNames,
        slots,
        encounters,
        illustrators,
        victory,
        // vengeance,
        skillIcons,
        skillEnabled,
        xp,
        xpEnabled,
        cost,
        costEnabled,
        unique,
      },
      onToggleChange,
      onFilterChange,
    } = this.props;
    const {
      loading,
      width,
      allUses,
      allFactions,
      allTraits,
      allTypes,
      allSubTypes,
      allPacks,
      allCycleNames,
      allSlots,
      allEncounters,
      allIllustrators,
      hasCost,
      hasXp,
      hasSkill,
    } = this.state;

    if (loading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }

    return (
      <ScrollView>
        <FactionChooser
          factions={allFactions}
          selection={factions}
          onFilterChange={onFilterChange}
        />
        { hasCost && (
          <SliderChooser
            label="Cost"
            width={width}
            values={cost}
            enabled={costEnabled}
            setting="cost"
            onFilterChange={onFilterChange}
            toggleName="costEnabled"
            onToggleChange={onToggleChange}
            max={6}
          />
        ) }
        { hasXp && (
          <SliderChooser
            label="Experience"
            width={width}
            values={xp}
            enabled={xpEnabled}
            setting="xp"
            onFilterChange={onFilterChange}
            toggleName="xpEnabled"
            onToggleChange={onToggleChange}
            max={5}
          />
        ) }
        { hasSkill && (
          <SkillIconChooser
            skillIcons={skillIcons}
            setting="skillIcons"
            onFilterChange={onFilterChange}
            enabled={skillEnabled}
            onToggleChange={onToggleChange}
          />
        ) }
        <View style={styles.chooserStack}>
          { (traits.length > 0 || allTraits.length > 0) && (
            <FilterChooserButton
              title="Traits"
              navigator={navigator}
              values={allTraits}
              selection={traits}
              setting="traits"
              onFilterChange={onFilterChange}
            />
          ) }
          { (types.length > 0 || allTypes.length > 0) && (
            <FilterChooserButton
              navigator={navigator}
              title="Types"
              values={allTypes}
              selection={types}
              setting="types"
              onFilterChange={onFilterChange}
            />
          ) }
          { (subTypes.length > 0 || allSubTypes.length > 0) && (
            <FilterChooserButton
              navigator={navigator}
              title="SubTypes"
              values={allSubTypes}
              selection={subTypes}
              setting="subTypes"
              onFilterChange={onFilterChange}
            />
          ) }
          { (slots.length > 0 || allSlots.length > 0) && (
            <FilterChooserButton
              navigator={navigator}
              title="Slots"
              values={allSlots}
              selection={slots}
              setting="slots"
              onFilterChange={onFilterChange}
            />
          ) }
          { (uses.length > 0 || allUses.length > 0) && (
            <FilterChooserButton
              navigator={navigator}
              title="Uses Type"
              values={allUses}
              selection={uses}
              setting="uses"
              onFilterChange={onFilterChange}
            />
          ) }
          { (cycleNames.length > 0 || allCycleNames.length > 1) && (
            <FilterChooserButton
              navigator={navigator}
              title="Cycles"
              values={allCycleNames}
              selection={cycleNames}
              setting="cycleNames"
              onFilterChange={onFilterChange}
            />
          ) }
          { (packs.length > 0 || allPacks.length > 1) && (
            <FilterChooserButton
              navigator={navigator}
              title="Packs"
              values={allPacks}
              selection={packs}
              setting="packs"
              onFilterChange={onFilterChange}
            />
          ) }
          { (encounters.length > 0 || allEncounters.length > 0) && (
            <FilterChooserButton
              navigator={navigator}
              title="Encounter Sets"
              values={allEncounters}
              selection={encounters}
              setting="encounters"
              onFilterChange={onFilterChange}
            />
          ) }
          { (illustrators.length > 0 || allIllustrators.length > 0) && (
            <FilterChooserButton
              navigator={navigator}
              title="Illustrators"
              values={allIllustrators}
              selection={illustrators}
              setting="illustrators"
              onFilterChange={onFilterChange}
            />
          ) }
          <NavButton text={this.enemyFilterText()} onPress={this._onEnemyPress} />
        </View>
        <View style={styles.toggleStack}>
          <View style={styles.toggleRow}>
            <ToggleFilter
              label="Unique"
              setting="unique"
              value={unique}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Victory"
              setting="victory"
              value={victory}
              onChange={onToggleChange}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withFilterFunctions(CardFilterView);

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chooserStack: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  toggleStack: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    paddingBottom: 8,
  },
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
