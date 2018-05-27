import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';
import PackListComponent from './PackListComponent';
import { getAllPacks, getPackSpoilers } from '../reducers';

class SpoilersView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    packs: PropTypes.array,
    show_spoilers: PropTypes.object,
    setPackSpoiler: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._renderHeader = this.renderHeader.bind(this);
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Mark the scenarios you've played through to make the results start
          showing up in search results.
        </Text>
      </View>
    );
  }

  render() {
    const {
      navigator,
      packs,
      show_spoilers,
      setPackSpoiler,
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
        renderHeader={this._renderHeader}
        checkState={show_spoilers}
        setChecked={setPackSpoiler}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    packs: getAllPacks(state),
    show_spoilers: getPackSpoilers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SpoilersView);

const styles = StyleSheet.create({
  header: {
    padding: 8,
  },
  headerText: {
    fontFamily: 'System',
    fontSize: 14,
  },
});
