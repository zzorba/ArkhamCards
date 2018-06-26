import React from 'react';
import PropTypes from 'prop-types';
import { keys, forEach, filter, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import { FACTION_CODES } from '../../constants';
import { applyFilters } from '../../lib/filters';
import FactionChooser from './FactionChooser';
import XpChooser from './XpChooser';
import DefaultFilterState from './DefaultFilterState';
import ChooserButton from '../core/ChooserButton';
import ToggleFilter from './ToggleFilter';

const CARD_FACTION_CODES = [...FACTION_CODES, 'mythos'];

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

    this.state = {
      filters: props.currentFilters,
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
    this._onFactionChange = this.onFilterChange.bind(this, 'factions');
    this._onTypeChange = this.onFilterChange.bind(this, 'types');
    this._onSubTypeChange = this.onFilterChange.bind(this, 'subTypes');
    this._onTraitChange = this.onFilterChange.bind(this, 'traits');
    this._onPacksChange = this.onFilterChange.bind(this, 'packs');
    this._onSlotsChange = this.onFilterChange.bind(this, 'slots');
    this._onEncountersChange = this.onFilterChange.bind(this, 'encounters');
    this._onIllustratorsChange = this.onFilterChange.bind(this, 'illustrators');
    this._applyFilters = this.applyFilters.bind(this);

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
      const typesMap = {};
      const subTypesMap = {};
      const traitsMap = {};
      const packsMap = {};
      const slotsMap = {};
      const encountersMap = {};
      const illustratorsMap = {};
      forEach(cards, card => {
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
        allFactions,
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

  applyFilters() {
    this.props.applyFilters(this.state.filters);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'clear') {
        this.setState({
          filters: DefaultFilterState,
        }, this._applyFilters);
      }
    }
  }

  onToggleChange(key) {
    const {
      filters,
    } = this.state;
    this.setState({
      filters: Object.assign({}, filters, { [key]: !filters[key] }),
    }, this._applyFilters);
  }

  onFilterChange(key, selection) {
    this.setState({
      filters: Object.assign({}, this.state.filters, { [key]: selection }),
    }, this._applyFilters);
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
      filters: {
        factions,
        traits,
        types,
        subTypes,
        packs,
        slots,
        encounters,
        illustrators,
        nonElite,
        victory,
        // vengeance,
        willpower,
        intellect,
        combat,
        agility,
        wild,
        doubleIcons,
      },
      allFactions,
      allTraits,
      allTypes,
      allSubTypes,
      allPacks,
      allSlots,
      allEncounters,
      allIllustrators,
    } = this.state;

    return (
      <ScrollView>
        <FactionChooser
          factions={allFactions}
          selection={factions}
          onChange={this._onFactionChange}
        />
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
          { (packs.length > 0 || allPacks.length > 0) && (
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
          <Text style={styles.sectionTitle}>
            Skill Icons
          </Text>
          <View style={styles.toggleRow}>
            <ToggleFilter
              icon="willpower"
              setting="willpower"
              value={willpower}
              onChange={this._onToggleChange}
            />
            <ToggleFilter
              icon="intellect"
              setting="intellect"
              value={intellect}
              onChange={this._onToggleChange}
            />
            <ToggleFilter
              label="2+"
              setting="doubleIcons"
              value={doubleIcons}
              onChange={this._onToggleChange}
            />
          </View>
          <View style={styles.toggleRow}>
            <ToggleFilter
              icon="combat"
              setting="combat"
              value={combat}
              onChange={this._onToggleChange}
            />
            <ToggleFilter
              icon="agility"
              setting="agility"
              value={agility}
              onChange={this._onToggleChange}
            />
            <ToggleFilter
              icon="wild"
              setting="wild"
              value={wild}
              onChange={this._onToggleChange}
            />
          </View>
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
        <Text style={styles.matchText}>
          { this.cardCount() } Cards Matched
        </Text>
      </ScrollView>
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
  chooserStack: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  toggleStack: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    paddingBottom: 8,
  },
  matchText: {
    fontSize: 18,
    fontFamily: 'System',
    padding: 8,
  },
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    marginTop: 8,
    marginLeft: 8,
    fontFamily: 'System',
    fontSize: 18,
  },
});
