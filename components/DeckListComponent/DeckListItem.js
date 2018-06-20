import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import InvestigatorImage from '../core/InvestigatorImage';
import { toRelativeDateString } from '../../lib/datetime';
import { FACTION_BACKGROUND_COLORS } from '../../constants';
import ArkhamIcon from '../../assets/ArkhamIcon';

const ROW_HEIGHT = 100;

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

  renderTitleBar() {
    const {
      deck,
      investigator,
    } = this.props;
    const factionColor = investigator &&
      investigator.faction_code &&
      FACTION_BACKGROUND_COLORS[investigator.faction_code];
    const iconName = investigator &&
      (investigator.faction_code === 'neutral' ? 'elder_sign' : investigator.faction_code);
    return (
      <View style={[styles.titleBar, { backgroundColor: factionColor || '#FFFFFF' }]}>
        <Text
          style={[styles.title, { color: factionColor ? '#FFFFFF' : '#000000' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          { deck.name }
        </Text>
        { !!iconName && <ArkhamIcon name={iconName} size={28} color="#FFFFFF" /> }
      </View>
    );
  }

  render() {
    const {
      deck,
      investigator,
    } = this.props;
    if (!deck) {
      return (
        <View style={styles.row}>
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#000000"
          />
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.column}>
          { this.renderTitleBar() }
          <View style={styles.row}>
            <View style={styles.image}>
              { !!investigator && <InvestigatorImage card={investigator} /> }
            </View>
            <View style={[styles.column, styles.titleColumn]}>
              { !!deck.date_update && (
                <Text style={styles.text} >
                  Updated: { toRelativeDateString(Date.parse(deck.date_update)) }
                </Text>
              ) }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: ROW_HEIGHT,
  },
  titleBar: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
    flex: 1,
  },
  text: {
    fontFamily: 'System',
    fontSize: 14,
    lineHeight: 18,
  },
  loading: {
    marginLeft: 10,
  },
  image: {
    marginLeft: 10,
    marginRight: 8,
  },
  titleColumn: {
    paddingTop: 8,
    flex: 1,
    height: '100%',
  },
});
