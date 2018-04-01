import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import PackRow from './PackRow';
import EncounterIcon from '../cards/CardDetailView/EncounterIcon';

class CollectionEditView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    packs: PropTypes.array,
    in_collection: PropTypes.object,
    setInCollection: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._renderItem = this.renderItem.bind(this);
    this._keyExtractor = this.keyExtractor.bind(this);
  }

  keyExtractor(item) {
    return item.code;
  }

  renderItem({ item }) {
    return (
      <PackRow
        pack={item}
        setInCollection={this.props.setInCollection}
        checked={this.props.in_collection[item.code]}
      />
    );
  }

  render() {
    const {
      packs,
      in_collection,
    } = this.props;
    if (!packs.length) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      )
    }
    return (
      <View>
        <FlatList
          data={packs}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          extraData={in_collection}
        />
      </View>
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
