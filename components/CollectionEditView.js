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
    navigator: PropTypes.object,
    packs: PropTypes.array,
    in_collection: PropTypes.object,
    setInCollection: PropTypes.func.isRequired,
    setCycleInCollection: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: L('Edit Collection'),
    });
  }

  render() {
    const {
      navigator,
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
        navigator={navigator}
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
