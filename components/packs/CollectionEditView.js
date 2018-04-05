import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import {
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import PackListView from './PackListView';

class CollectionEditView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    packs: PropTypes.array,
    in_collection: PropTypes.object,
    setInCollection: PropTypes.func.isRequired,
  };

  render() {
    const {
      navigator,
      packs,
      in_collection,
      setInCollection,
    } = this.props;
    if (!packs.length) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <PackListView
        navigator={navigator}
        packs={packs}
        checkState={in_collection}
        setChecked={setInCollection}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    packs: sortBy(
      sortBy(state.packs.all, pack => pack.position),
      pack => pack.cycle_position),
    in_collection: state.packs.in_collection || {},
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionEditView);
