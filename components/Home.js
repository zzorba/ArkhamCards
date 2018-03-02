import React from 'react';
import PropTypes from 'prop-types';
const {
  Button,
  StyleSheet,
  ListView,
  View,
  Text,
  ActivityIndicator
} = require('react-native');

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';

class Home extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      ds,
    };

    this._deckNavClicked = this.deckNavClicked.bind(this);
  }

  componentDidMount() {
    if (Object.keys(this.props.cards).length === 0) {
      this.props.getCards(); //call our action
    }
    this.props.getPacks();
  }

  deckNavClicked() {
    this.props.navigator.push({
      screen: 'Deck',
      passProps: {
        id: 4737,
      },
    });
  }

  render() {
    if (this.props.loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            animating={true}
            style={[{height: 80}]}
            size="small"
          />
        </View>
        );
    } else {
      return (
        <View style={{flex:1, backgroundColor: '#F5F5F5', paddingTop:20}}>
        <Button onPress={this._deckNavClicked} title="View deck" />
          <ListView enableEmptySections={true}
            dataSource={this.state.ds.cloneWithRows(this.props.packs)}
            renderRow={this.renderCard.bind(this)} />
        </View>
      );
    }
  }

  renderCard(rowData, sectionID, rowID) {
    return (
      <View style={styles.row}>
        <Text style={styles.title}>
          { (parseInt(rowID) + 1)}{". "}{rowData.name }
        </Text>
        <Text style={styles.description}>
          { rowData.description }
        </Text>
      </View>
    );
  }
};



// The function takes data from the app current state,
// // and insert/links it into the props of our component.
// // This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
  return {
    loading: state.cards.loading || state.packs.loading,
    cards: state.cards.all,
    packs: state.packs.all,
  };
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Home);

var styles = StyleSheet.create({
  activityIndicatorContainer:{
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },

  row:{
    borderBottomWidth: 1,
    borderColor: "#ccc",
    // height: 50,
    padding: 10
  },

  title:{
    fontSize: 15,
    fontWeight: "600"
  },

  description:{
    marginTop: 5,
    fontSize: 14,
  }
});
