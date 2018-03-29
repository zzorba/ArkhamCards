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
import { connectRealm } from 'react-native-realm';

class DeckListItem extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
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
      card,
    } = this.props;

    const investigator = card;

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

export default connectRealm(DeckListItem, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    return {
      realm,
      card: head(results.cards.filtered(`code == '${props.id}'`)),
    };
  },
});

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
