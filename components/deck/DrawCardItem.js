import React from 'react';
import PropTypes from 'prop-types';
const {
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} = require('react-native');
import ArkhamIcon from '../../assets/ArkhamIcon';

export default class DrawCardItem extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onPressItem: PropTypes.func.isRequired,
    card: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPressItem(this.props.id);
  }

  render() {
    const {
      selected,
      card,
    } = this.props;
    return (
      <TouchableHighlight
        onPress={this._onPress}
        style={selected ? styles.selectedCardWrapper : styles.cardWrapper}
      >
        { card.code === '01000' ?
          <View style={styles.randomBasicWeakness}>
            <ArkhamIcon name="weakness" size={100} color="#000000" />
          </View>
          :
          <Image
            style={styles.drawnCard}
            source={{
              uri: `https://arkhamdb.com${card.imagesrc}`,
            }}
          />
        }
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  cardWrapper: {
    margin: 1,
  },
  randomBasicWeakness: {
    width: 98,
    height: 136,
    backgroundColor: '#D6D6D6',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  selectedCardWrapper: {
    backgroundColor: 'red',
    margin: 1,
  },
  drawnCard: {
    width: 98,
    height: 136,
    margin: 3,
  },
});
