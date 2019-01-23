import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map, max, uniqBy, values } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import PackListComponent from '../PackListComponent';
import { BASIC_WEAKNESS_QUERY } from '../../data/query';
import * as Actions from '../../actions';

class WeaknessSetPackChooserComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    in_collection: PropTypes.object.isRequired,
    weaknessCards: PropTypes.object,
    packs: PropTypes.array,
    onSelectedPacksChanged: PropTypes.func.isRequired,
    compact: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      override: { core: true },
    };

    this._onPackCheck = this.onPackCheck.bind(this);
    this._syncSelectedPacks = this.syncSelectedPacks.bind(this);
  }

  componentDidMount() {
    this.syncSelectedPacks();
  }

  onPackCheck(pack, value) {
    this.setState({
      override: Object.assign({}, this.state.override, { [pack]: !!value }),
    }, this._syncSelectedPacks);
  }

  syncSelectedPacks() {
    const {
      in_collection,
      onSelectedPacksChanged,
    } = this.props;

    const {
      override,
    } = this.state;
    const includePack = Object.assign({}, in_collection, override);
    const packs = [];
    forEach(this.weaknessPacks(), pack => {
      if (includePack[pack.code]) {
        packs.push(pack.code);
      }
    });
    onSelectedPacksChanged(packs);
  }

  weaknessPacks() {
    const {
      weaknessCards,
      packs,
    } = this.props;
    const weaknessPackSet = new Set(uniqBy(map(values(weaknessCards), card => card.pack_code)));
    return filter(packs, pack => weaknessPackSet.has(pack.code));
  }

  render() {
    const {
      componentId,
      in_collection,
      compact,
    } = this.props;
    const {
      override,
    } = this.state;
    const weaknessPacks = this.weaknessPacks();
    return (
      <PackListComponent
        componentId={componentId}
        packs={weaknessPacks}
        checkState={Object.assign({}, in_collection, override)}
        setChecked={this._onPackCheck}
        baseQuery={'(subtype_code == "basicweakness" and code != "01000")'}
        compact={compact}
        whiteBackground
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    packs: state.packs.all,
    in_collection: state.packs.in_collection || {},
    nextId: 1 + (max(map(values(state.weaknesses.all), set => set.id)) || 0),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(WeaknessSetPackChooserComponent, {
    schemas: ['Card'],
    mapToProps(results) {
      return {
        weaknessCards: results.cards.filtered(BASIC_WEAKNESS_QUERY),
      };
    },
  })
);
