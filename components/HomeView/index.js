import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import MenuItem from './MenuItem';
import * as Actions from '../../actions';
import { syncCards } from '../../lib/api';

class HomeView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    getPacks: PropTypes.func.isRequired,
    cardCount: PropTypes.number,
    packs: PropTypes.array,
    realm: PropTypes.object,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      loadingCards: props.cardCount === 0,
      error: null,
    };
  }

  componentDidMount() {
    const {
      packs,
      getPacks,
      cardCount,
      realm,
    } = this.props;
    if (cardCount === 0) {
      syncCards(realm).then(() => {
        this.setState({
          loadingCards: false,
        });
      }).catch(err => {
        this.setState({
          loadingCards: false,
          error: err.message || err,
        });
      });
    }
    if (packs.length === 0) {
      getPacks();
    }
  }

  render() {
    const {
      navigator,
      loading,
    } = this.props;
    if (loading || this.state.loadingCards) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }
    return (
      <ScrollView>
        <MenuItem navigator={navigator} text="Popular Decks" screen="Browse.Decks" />
        <MenuItem navigator={navigator} text="All Cards" screen="Browse.Cards" />
        <MenuItem navigator={navigator} text="Campaigns" screen="Campaigns" />
        <MenuItem navigator={navigator} text="Settings" screen="Settings" />
      </ScrollView>
    );
  }
}


function mapStateToProps(state) {
  return {
    loading: state.packs.loading,
    packs: state.packs.all,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(HomeView),
  {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
        cardCount: results.cards.length,
      };
    },
  },
);

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
