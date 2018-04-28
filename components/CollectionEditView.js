import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import {
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';
import PackListComponent from './PackListComponent';
import { getPacks, getPacksInCollection } from '../reducers';

class CollectionEditView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    packs: PropTypes.array,
    in_collection: PropTypes.object,
    setInCollection: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: 'Edit Collection',
    });
  }

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
      <PackListComponent
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
    packs: getPacks(state),
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionEditView);
