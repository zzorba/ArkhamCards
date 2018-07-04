import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import typography from '../../../styles/typography';
import WeaknessSetView from '../WeaknessSetView';

export default class WeaknessSetRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    set: PropTypes.object.isRequired,
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      navigator,
      set,
    } = this.props;
    navigator.push({
      screen: 'Weakness.Detail',
      passProps: {
        id: set.id,
      },
    });
  }

  render() {
    const {
      set,
      cards,
    } = this.props;
    const counts = WeaknessSetView.computeCount(set, cards);
    return (
      <TouchableOpacity style={styles.row} onPress={this._onPress}>
        <Text style={typography.text}>{ set.name }</Text>
        <Text style={typography.small}>{ `${counts.assigned} / ${counts.total}` }</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
});
