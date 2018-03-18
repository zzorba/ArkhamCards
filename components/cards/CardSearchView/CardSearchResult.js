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

import ArkhamIcon from '../../../assets/ArkhamIcon';
import EncounterIcon from '../CardDetailView/EncounterIcon';
import { CardType } from '../types';
import { createFactionIcons, FACTION_COLORS } from '../../../constants';

const FACTION_ICONS = createFactionIcons(12);

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
    this._onDeckCountPress = this.onDeckCountPress.bind(this);
    this._renderCountButton = this.renderCountButton.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card.code);
  }

  onDeckCountPress(idx) {
    this.props.onDeckCountChange(this.props.card.code, idx);
  }

  renderCountButton(count, idx) {
    return (
      <Text
        key={idx}
        style={styles.countText}
      >
        { count }
      </Text>
    );
  }

  renderIcon() {
    const {
      card,
    } = this.props;
    if (card.subtype_code &&
      (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
    ) {
      return (
        <ArkhamIcon name="weakness" size={12} color={FACTION_COLORS.neutral} />
      );
    }
    if (card.spoiler) {
      return (
        <EncounterIcon
          encounter_code={card.encounter_code}
          size={12}
          color="#000000"
        />
      );
    }

    if (card.type_code === 'scenario') {
      return (
        <EncounterIcon
          encounter_code={card.pack_code}
          size={12}
          color="#000000"
        />
      );
    }
    return FACTION_ICONS[card.faction_code];
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
              onPress={this._onDeckCountPress}
              buttons={buttons}
              selectedIndex={count || 0}
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
          <View style={styles.cardTextRow}>
            <View style={styles.cardIcon}>
              { this.renderIcon() }
            </View>
            <Text style={[
              styles.cardName,
              { color: FACTION_COLORS[card.faction_code] },
            ]}>
              { `${card.name}${xpStr}` }
            </Text>
          </View>
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
  cardIcon: {
    width: 16,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 8,
  },
  cardName: {
    marginLeft: 4,
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
    backgroundColor: 'rgb(246,246,246)',
  },
  countText: {
    color: 'rgb(41,41,41)',
  },
  selectedCountButton: {
    backgroundColor: 'rgb(221,221,221)',
  },
});
