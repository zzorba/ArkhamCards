import React from 'react';
import PropTypes from 'prop-types';
import head from 'lodash';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} from 'react-native';
import InvestigatorImage from '../cards/InvestigatorImage';

export default class DeckListItem extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    investigator: PropTypes.object,
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
      investigator,
    } = this.props;
    console.log(investigator);
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row} >
          <InvestigatorImage source={investigator.imagesrc} />
          <View style={styles.titleColumn}>
            <Text style={styles.title} numLines={2}>
              { deck.name }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    margin: 5,
    height: 100,
  },
  titleColumn: {
    paddingLeft: 5,
    flex: 1,
    flexDirection: 'column',
    marginLeft: 5,
  },
  title: {
    fontFamily: 'System',
    fontSize: 22,
  },
});
