import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import L from '../../app/i18n';
import AccordionItem from './AccordionItem';
import SliderChooser from './SliderChooser';
import ToggleFilter from '../core/ToggleFilter';
import withFilterFunctions from './withFilterFunctions';

class CardEnemyFilterView extends React.Component {
  static propTypes = {
    filters: PropTypes.object,
    defaultFilterState: PropTypes.object.isRequired,
    width: PropTypes.number,
    onToggleChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('Enemy Filters'),
        },
      },
    };
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
        enemyMassive,
      },
      onToggleChange,
    } = this.props;

    return (
      <AccordionItem
        label={L('Keywords')}
        height={256}
        enabled={enemyKeywordsEnabled}
        toggleName="enemyKeywordsEnabled"
        onToggleChange={onToggleChange}
      >
        <View style={styles.toggleRow}>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label={L('Elite')}
              setting="enemyElite"
              value={enemyElite}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Hunter')}
              setting="enemyHunter"
              value={enemyHunter}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Alert')}
              setting="enemyAlert"
              value={enemyAlert}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Spawn')}
              setting="enemySpawn"
              value={enemySpawn}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Aloof')}
              setting="enemyAloof"
              value={enemyAloof}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Massive')}
              setting="enemyMassive"
              value={enemyMassive}
              onChange={onToggleChange}
            />
          </View>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label={L('Non-Elite')}
              setting="enemyNonElite"
              value={enemyNonElite}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Non-Hunter')}
              setting="enemyNonHunter"
              value={enemyNonHunter}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Retaliate')}
              setting="enemyRetaliate"
              value={enemyRetaliate}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Parley')}
              setting="enemyParley"
              value={enemyParley}
              onChange={onToggleChange}
            />
            <ToggleFilter
              label={L('Prey')}
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
      defaultFilterState,
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
          label={L('Fight')}
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
          label={L('Health')}
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
              label={L('Per Investigator')}
              setting="enemyHealthPerInvestigator"
              value={enemyHealthPerInvestigator}
              onChange={onToggleChange}
            />
          </View>
        </SliderChooser>
        <SliderChooser
          label={L('Evade')}
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
          label={L('Damage')}
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
          label={L('Horror')}
          width={width}
          max={defaultFilterState.enemyHorror[1]}
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
