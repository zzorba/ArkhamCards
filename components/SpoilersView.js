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
    setAllPackSpoilers: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      spoilers: Object.assign({}, props.show_spoilers),
    };

    this._renderHeader = this.renderHeader.bind(this);
    this._setPackSpoiler = this.setPackSpoiler.bind(this);
  }

  setPackSpoiler(pack, value) {
    const newSpoilers = Object.assign({}, this.state.spoilers);
    if (value) {
      newSpoilers[pack] = true;
    } else {
      delete newSpoilers[pack];
    }
    this.setState({
      spoilers: newSpoilers,
    });
  }

  componentWillUnmount() {
    this.props.setAllPackSpoilers(this.state.spoilers);
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
        checkState={this.state.spoilers}
        setChecked={this._setPackSpoiler}
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
