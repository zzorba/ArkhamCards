import React from 'react';
import PropTypes from 'prop-types';
import { map, range } from 'lodash';
const {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

import { CardType } from '../types';
import { FACTION_COLORS } from '../../../constants';

const BUTTON_WIDTH = 20;
export default class CardSearchResult extends React.PureComponent {
  static propTypes = {
    card: CardType,
    count: PropTypes.number,
    onPress: PropTypes.func.isRequired,
    onDeckCountChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._renderCountButton = this.renderCountButton.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card.code);
  }

  renderCountButton(count, idx) {
    const selected = (count === this.props.count);
    return (
      <Text
        key={idx}
        style={selected ? styles.selectedCountText : styles.countText}
      >
        { count }
      </Text>
    );
  }

  render() {
    const {
      card,
      count,
      onDeckCountChange,
    } = this.props;
    if (!card.name) {
      return <Text>No Text</Text>;
    }
    const xpStr = (card.xp && range(0, card.xp).map(() => '•').join('')) || '';
    const buttons = map(range(0, card.deck_limit + 1), this._renderCountButton);
    return (
      <View style={styles.row}>
        { onDeckCountChange &&
          <View style={styles.buttonContainer}>
            <ButtonGroup
              buttons={buttons}
              selectedIndex={count}
              buttonStyle={styles.countButton}
              selectedButtonStyle={styles.selectedCountButton}
              containerStyle={[
                styles.buttonGroup,
                { width: BUTTON_WIDTH * (card.deck_limit + 1) },
              ]}
            />
          </View>
        }
        <TouchableOpacity onPress={this._onPress}>
          <Text style={[
            styles.cardName,
            { color: FACTION_COLORS[card.faction_code] },
          ]}>
            { `${card.name}${xpStr}` }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 22,
  },
  cardName: {
    marginLeft: 8,
    fontSize: 16,
    height: 22,
  },
  buttonContainer: {
    width: (3 * BUTTON_WIDTH),
    padding: 0,
    marginRight: 8,
  },
  buttonGroup: {
    height: 22,
  },
  countButton: {
    width: BUTTON_WIDTH,
    padding: 0,
    backgroundColor: '#eeeeee',
  },
  countText: {
    color: '#bdbdbd',
  },
  selectedCountButton: {
    backgroundColor: '#666666',
  },
  selectedCountText: {
    color: '#dedede',
  },
});
