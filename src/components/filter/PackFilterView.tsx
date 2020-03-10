import React from 'react';
import { difference, forEach, filter, map, union } from 'lodash';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { t } from 'ttag';
import { Pack } from 'actions/types';
import PackListComponent from 'components/core/PackListComponent';
import { getAllPacks, AppState } from 'reducers';
import withFilterFunctions, { FilterProps } from './withFilterFunctions';
import { COLORS } from 'styles/colors';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  allPacks: Pack[];
}

type Props = OwnProps & ReduxProps & FilterProps;
class PackFilterView extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        backButton: {
          title: t`Back`,
          color: COLORS.navButton,
        },
        title: {
          text: t`Select Packs`,
        },
      },
    };
  }

  _setChecked = (code: string, value: boolean) => {
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
  };

  _setCycleChecked = (cycle_position: number, value: boolean) => {
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
  };

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
    const selected: { [pack_code: string]: boolean } = {};
    forEach(allPacks, pack => {
      if (selectedPackNames.has(pack.name)) {
        selected[pack.code] = true;
      }
    });
    return (
      <PackListComponent
        coreSetName={t`Core Set`}
        componentId={componentId}
        packs={allPacks}
        checkState={selected}
        setChecked={this._setChecked}
        setCycleChecked={this._setCycleChecked}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    allPacks: getAllPacks(state),
  };
}

export default connect(mapStateToProps)(
  withFilterFunctions(PackFilterView, t`Pack Filters`)
);
