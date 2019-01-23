import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../app/i18n';
import * as Actions from '../actions';
import PackListComponent from './PackListComponent';
import { getAllPacks, getPacksInCollection } from '../reducers';

class CollectionEditView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    packs: PropTypes.array,
    in_collection: PropTypes.object,
    setInCollection: PropTypes.func.isRequired,
    setCycleInCollection: PropTypes.func.isRequired,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('Edit Collection'),
        },
      },
    };
  }

  render() {
    const {
      componentId,
      packs,
      in_collection,
      setInCollection,
      setCycleInCollection,
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
        coreSetName={L('Second Core Set')}
        componentId={componentId}
        packs={packs}
        checkState={in_collection}
        setChecked={setInCollection}
        setCycleChecked={setCycleInCollection}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    packs: getAllPacks(state),
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionEditView);
