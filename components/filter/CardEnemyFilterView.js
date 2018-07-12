import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import AccordionItem from './AccordionItem';
import SliderChooser from './SliderChooser';
import ToggleFilter from './ToggleFilter';
import withFilterFunctions from './withFilterFunctions';

class CardEnemyFilterView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    filters: PropTypes.object,
    width: PropTypes.number,
    onToggleChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    props.navigator.setTitle({
      title: 'Enemy Filters',
    });
  }

  renderToggles() {
    const {
      filters: {
        enemyKeywordsEnabled,
        enemyElite,
        enemyNonElite,
        enemyParley,
        enemyRetaliate,
        enemyAlert,
        enemyHunter,
        enemyNonHunter,
        enemySpawn,
        enemyPrey,
        enemyAloof,
      },
      onToggleChange,
    } = this.props;

    return (
      <AccordionItem
        label="Keywords"
        height={215}
        enabled={enemyKeywordsEnabled}
        toggleName="enemyKeywordsEnabled"
        onToggleChange={onToggleChange}
      >
        <View style={styles.toggleRow}>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label="Elite"
              setting="enemyElite"
              value={enemyElite}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Hunter"
              setting="enemyHunter"
              value={enemyHunter}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Alert"
              setting="enemyAlert"
              value={enemyAlert}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Spawn"
              setting="enemySpawn"
              value={enemySpawn}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Aloof"
              setting="enemyAloof"
              value={enemyAloof}
              onChange={onToggleChange}
            />
          </View>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label="Non-Elite"
              setting="enemyNonElite"
              value={enemyNonElite}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Non-Hunter"
              setting="enemyNonHunter"
              value={enemyNonHunter}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Retaliate"
              setting="enemyRetaliate"
              value={enemyRetaliate}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Parley"
              setting="enemyParley"
              value={enemyParley}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label="Prey"
              setting="enemyPrey"
              value={enemyPrey}
              onChange={onToggleChange}
            />
          </View>
        </View>
      </AccordionItem>
    );
  }

  render() {
    const {
      filters: {
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
      },
      width,
      onToggleChange,
      onFilterChange,
    } = this.props;
    return (
      <ScrollView>
        { this.renderToggles() }
        <SliderChooser
          label="Fight"
          width={width}
          max={5}
          values={enemyFight}
          setting="enemyFight"
          onFilterChange={onFilterChange}
          enabled={enemyFightEnabled}
          toggleName="enemyFightEnabled"
          onToggleChange={onToggleChange}
        />
        <SliderChooser
          label="Health"
          width={width}
          max={10}
          values={enemyHealth}
          setting="enemyHealth"
          onFilterChange={onFilterChange}
          enabled={enemyHealthEnabled}
          toggleName="enemyHealthEnabled"
          onToggleChange={onToggleChange}
        >
          <View style={styles.toggleRow}>
            <ToggleFilter
              label="Per Investigator"
              setting="enemyHealthPerInvestigator"
              value={enemyHealthPerInvestigator}
              onChange={onToggleChange}
            />
          </View>
        </SliderChooser>
        <SliderChooser
          label="Evade"
          width={width}
          max={5}
          values={enemyEvade}
          setting="enemyEvade"
          onFilterChange={onFilterChange}
          enabled={enemyEvadeEnabled}
          toggleName="enemyEvadeEnabled"
          onToggleChange={onToggleChange}
        />
        <SliderChooser
          label="Damage"
          width={width}
          max={5}
          values={enemyDamage}
          setting="enemyDamage"
          onFilterChange={onFilterChange}
          enabled={enemyDamageEnabled}
          toggleName="enemyDamageEnabled"
          onToggleChange={onToggleChange}
        />
        <SliderChooser
          label="Horror"
          width={width}
          max={5}
          values={enemyHorror}
          setting="enemyHorror"
          onFilterChange={onFilterChange}
          enabled={enemyHorrorEnabled}
          toggleName="enemyHorrorEnabled"
          onToggleChange={onToggleChange}
        />
      </ScrollView>
    );
  }
}

export default withFilterFunctions(CardEnemyFilterView);

const styles = StyleSheet.create({
  toggleColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
