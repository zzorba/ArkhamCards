import React from 'react';
import PropTypes from 'prop-types';
const {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

class DeckListItem extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    cards: PropTypes.object,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      id,
      onPress,
    } = this.props;
    onPress && onPress(id);
  }

  render() {
    const {
      deck,
      cards,
    } = this.props;

    const investigator = cards[deck.investigator_code];

    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row} >
          <Image
            style={styles.investigatorImage}
            source={{ uri: `https://arkhamdb.com${investigator.imagesrc}` }} />
          <View style={styles.titleColumn}>
            <Text style={styles.title}>
              { deck.name }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state, props) {
  if (props.id in state.decks.all) {
    return {
      deck: state.decks.all[props.id],
      cards: state.cards.all,
    };
  }
  return {
    deck: null,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckListItem);


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    margin: 5,
  },
  titleColumn: {
    flexDirection: 'column',
    marginLeft: 5,
  },
  investigatorImage: {
    height: 90,
    width: 126,
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
  },
});
