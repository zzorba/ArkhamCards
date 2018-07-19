import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import InvestigatorImage from '../core/InvestigatorImage';
import FactionGradient from '../core/FactionGradient';
import DeckTitleBarComponent from '../DeckTitleBarComponent';

export default class InvestigatorRowWrapper extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    investigator: PropTypes.object,
    onPress: PropTypes.func,
    children: PropTypes.node,
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
      investigator,
      children,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.column}>
          <DeckTitleBarComponent
            name={investigator.name}
            investigator={investigator}
            compact
          />
          <FactionGradient faction_code={investigator.faction_code} style={styles.row}>
            <View style={styles.image}>
              { !!investigator && <InvestigatorImage card={investigator} /> }
            </View>
            <View style={[styles.column, styles.titleColumn]}>
              { children }
            </View>
          </FactionGradient>
        </View>
        <FactionGradient
          faction_code={investigator.faction_code}
          style={styles.footer}
          dark
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    height: 16,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    marginLeft: 10,
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
    height: '100%',
  },
});
