import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';

import { COLORS } from '../../styles/colors';
import ArkhamIcon from '../../assets/ArkhamIcon';

const CARD_WIDTH = 98;
const CARD_HEIGHT = 136;

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
          <CachedImage
            style={styles.drawnCard}
            source={{
              uri: `https://arkhamdb.com${card.imagesrc}`,
              cache: 'force-cache',
            }}
          />
        }
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  cardWrapper: {
    padding: 3,
    marginRight: 3,
    marginBottom: 3,
  },
  randomBasicWeakness: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#D6D6D6',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCardWrapper: {
    backgroundColor: COLORS.lightBlue,
    padding: 3,
    marginRight: 3,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawnCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});
