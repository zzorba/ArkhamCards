import React from 'react';
import PropTypes from 'prop-types';
import { difference, forEach, filter, map, union } from 'lodash';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import L from '../../app/i18n';
import PackListComponent from '../PackListComponent';
import { getAllPacks } from '../../reducers';
import withFilterFunctions from './withFilterFunctions';

class PackFilterView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    filters: PropTypes.object,
    allPacks: PropTypes.array,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('Packs Filter'),
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this._setChecked = this.setChecked.bind(this);
    this._setCycleChecked = this.setCycleChecked.bind(this);
  }

  setChecked(code, value) {
    const {
      onFilterChange,
      filters: {
        packs,
      },
      allPacks,
    } = this.props;
    const deltaPacks = map(
      filter(allPacks, pack => pack.code === code),
      pack => pack.name
    );
    onFilterChange(
      'packs',
      value ? union(packs, deltaPacks) : difference(packs, deltaPacks)
    );
  }

  setCycleChecked(cycle_position, value) {
    const {
      onFilterChange,
      filters: {
        packs,
      },
      allPacks,
    } = this.props;
    const deltaPacks = map(
      filter(allPacks, pack => pack.cycle_position === cycle_position),
      pack => pack.name
    );

    onFilterChange(
      'packs',
      value ? union(packs, deltaPacks) : difference(packs, deltaPacks)
    );
  }

  render() {
    const {
      componentId,
      allPacks,
      filters: {
        packs,
      },
    } = this.props;
    if (!allPacks.length) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    const selectedPackNames = new Set(packs || []);
    const selected = {};
    forEach(allPacks, pack => {
      if (selectedPackNames.has(pack.name)) {
        selected[pack.code] = true;
      }
    });
    return (
      <PackListComponent
        coreSetName={L('Core Set')}
        componentId={componentId}
        packs={allPacks}
        checkState={selected}
        setChecked={this._setChecked}
        setCycleChecked={this._setCycleChecked}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    allPacks: getAllPacks(state),
  };
}

export default connect(mapStateToProps, {})(withFilterFunctions(PackFilterView));
