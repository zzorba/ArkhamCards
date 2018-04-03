import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
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
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row} >
          <View style={styles.image}>
            { investigator && (
              <InvestigatorImage
                source={investigator.imagesrc}
                code={investigator.code}
              />
            ) }
          </View>
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
    height: 100,
  },
  image: {
    marginLeft: 10,
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  title: {
    fontFamily: 'System',
    fontSize: 22,
  },
});
