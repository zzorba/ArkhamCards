import React from 'react';
import PropTypes from 'prop-types';
import { keys, forEach, filter, map } from 'lodash';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import { FACTION_CODES } from '../../constants';
import { applyFilters } from '../../lib/filters';
import FactionChooser from './FactionChooser';
import SkillIconChooser from './SkillIconChooser';
import DefaultFilterState from './DefaultFilterState';
import ChooserButton from '../core/ChooserButton';
import ToggleFilter from './ToggleFilter';
import SliderChooser from './SliderChooser';
import typography from '../../styles/typography';
import space from '../../styles/space';

const CARD_FACTION_CODES = [...FACTION_CODES, 'mythos'];
const FOOTER_HEIGHT = 56;

class CardFilterView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    applyFilters: PropTypes.func.isRequired,
    currentFilters: PropTypes.object.isRequired,
    /* eslint-disable  react/no-unused-prop-types */
    baseQuery: PropTypes.string,
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const {
      width,
    } = Dimensions.get('window');

    this.state = {
      loading: true,
      width,
      filters: props.currentFilters,
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

    this._onToggleChange = this.onToggleChange.bind(this);
    this._onXpToggle = this.onToggleChange.bind(this, 'xpEnabled');
    this._onXpChange = this.onFilterChange.bind(this, 'xp');
    this._onCostToggle = this.onToggleChange.bind(this, 'costEnabled');
    this._onCostChange = this.onFilterChange.bind(this, 'cost');
    this._onCycleNamesChange = this.onFilterChange.bind(this, 'cycleNames');
    this._onSkillToggle = this.onToggleChange.bind(this, 'skillEnabled');
    this._onSkillIconsChange = this.onFilterChange.bind(this, 'skillIcons');
    this._onUsesChange = this.onFilterChange.bind(this, 'uses');
    this._onFactionChange = this.onFilterChange.bind(this, 'factions');
    this._onTypeChange = this.onFilterChange.bind(this, 'types');
    this._onSubTypeChange = this.onFilterChange.bind(this, 'subTypes');
    this._onTraitChange = this.onFilterChange.bind(this, 'traits');
    this._onPacksChange = this.onFilterChange.bind(this, 'packs');
    this._onSlotsChange = this.onFilterChange.bind(this, 'slots');
    this._onEncountersChange = this.onFilterChange.bind(this, 'encounters');
    this._onIllustratorsChange = this.onFilterChange.bind(this, 'illustrators');

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
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'clear') {
        this.setState({
          filters: DefaultFilterState,
        });
      }
    }
    if (event.id === 'willDisappear') {
      this.props.applyFilters(this.state.filters);
    }
  }

  onToggleChange(key) {
    const {
      filters,
    } = this.state;
    this.setState({
      filters: Object.assign({}, filters, { [key]: !filters[key] }),
    });
  }

  onFilterChange(key, selection) {
    this.setState({
      filters: Object.assign({}, this.state.filters, { [key]: selection }),
    });
  }

  cardCount() {
    const {
      cards,
    } = this.props;
    const query = applyFilters(this.state.filters).join(' and ');
    if (query) {
      return cards.filtered(query).length;
    }
    return cards.length;
  }

  render() {
    const {
      navigator,
    } = this.props;
    const {
      loading,
      width,
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
        nonElite,
        victory,
        // vengeance,
        skillIcons,
        skillEnabled,
        xp,
        xpEnabled,
        cost,
        costEnabled,
      },
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
      <View style={styles.wrapper}>
        <ScrollView>
          <FactionChooser
            factions={allFactions}
            selection={factions}
            onChange={this._onFactionChange}
          />
          { hasCost && (
            <SliderChooser
              label="Cost"
              width={width}
              values={cost}
              enabled={costEnabled}
              onChange={this._onCostChange}
              toggleEnabled={this._onCostToggle}
              max={6}
            />
          ) }
          { hasXp && (
            <SliderChooser
              label="Experience"
              width={width}
              values={xp}
              enabled={xpEnabled}
              onChange={this._onXpChange}
              toggleEnabled={this._onXpToggle}
              max={5}
            />
          ) }
          { hasSkill && (
            <SkillIconChooser
              skillIcons={skillIcons}
              onChange={this._onSkillIconsChange}
              enabled={skillEnabled}
              toggleEnabled={this._onSkillToggle}
            />
          ) }
          <View style={styles.chooserStack}>
            { (traits.length > 0 || allTraits.length > 0) && (
              <ChooserButton
                title="Traits"
                navigator={navigator}
                values={allTraits}
                selection={traits}
                onChange={this._onTraitChange}
              />
            ) }
            { (types.length > 0 || allTypes.length > 0) && (
              <ChooserButton
                navigator={navigator}
                title="Types"
                values={allTypes}
                selection={types}
                onChange={this._onTypeChange}
              />
            ) }
            { (subTypes.length > 0 || allSubTypes.length > 0) && (
              <ChooserButton
                navigator={navigator}
                title="SubTypes"
                values={allSubTypes}
                selection={subTypes}
                onChange={this._onSubTypeChange}
              />
            ) }
            { (slots.length > 0 || allSlots.length > 0) && (
              <ChooserButton
                navigator={navigator}
                title="Slots"
                values={allSlots}
                selection={slots}
                onChange={this._onSlotsChange}
              />
            ) }
            { (uses.length > 0 || allUses.length > 0) && (
              <ChooserButton
                navigator={navigator}
                title="Uses Type"
                values={allUses}
                selection={uses}
                onChange={this._onUsesChange}
              />
            ) }
            { (cycleNames.length > 0 || allCycleNames.length > 1) && (
              <ChooserButton
                navigator={navigator}
                title="Cycles"
                values={allCycleNames}
                selection={cycleNames}
                onChange={this._onCycleNamesChange}
              />
            ) }
            { (packs.length > 0 || allPacks.length > 1) && (
              <ChooserButton
                navigator={navigator}
                title="Packs"
                values={allPacks}
                selection={packs}
                onChange={this._onPacksChange}
              />
            ) }
            { (encounters.length > 0 || allEncounters.length > 0) && (
              <ChooserButton
                navigator={navigator}
                title="Encounter Sets"
                values={allEncounters}
                selection={encounters}
                onChange={this._onEncountersChange}
              />
            ) }
            { (illustrators.length > 0 || allIllustrators.length > 0) && (
              <ChooserButton
                navigator={navigator}
                title="Illustrators"
                values={allIllustrators}
                selection={illustrators}
                onChange={this._onIllustratorsChange}
              />
            ) }
          </View>
          <View style={styles.toggleStack}>
            <View style={styles.toggleRow}>
              <ToggleFilter
                label="Non-Elite"
                setting="nonElite"
                value={nonElite}
                onChange={this._onToggleChange}
              />
              <ToggleFilter
                label="Victory"
                setting="victory"
                value={victory}
                onChange={this._onToggleChange}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerBar}>
          <Text style={[typography.text, space.marginLeftS]}>
            { this.cardCount() } Cards Matched
          </Text>
        </View>
      </View>
    );
  }
}

export default connectRealm(CardFilterView, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    return {
      cards: props.baseQuery ? results.cards.filtered(props.baseQuery) : results.cards,
    };
  },
});

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
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
  footerBar: {
    height: FOOTER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#000000',
  },
});
