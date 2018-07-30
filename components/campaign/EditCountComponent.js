import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PlusMinusButtons from '../core/PlusMinusButtons';
import typography from '../../styles/typography';

export default class EditCountComponent extends React.Component {
  static propTypes = {
    countChanged: PropTypes.func.isRequired,
    index: PropTypes.number,
    title: PropTypes.string.isRequired,
    count: PropTypes.number,
    isInvestigator: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._updateCount = this.updateCount.bind(this);
  }

  updateCount(count) {
    const {
      countChanged,
      index,
    } = this.props;
    countChanged(index, count);
  }

  render() {
    const {
      title,
      isInvestigator,
      count,
    } = this.props;
    return (
      <View style={isInvestigator ? {} : styles.container}>
        <View style={styles.row}>
          <View style={styles.textColumn}>
            <Text style={typography.small} ellipsizeMode="tail">
              { title.toUpperCase() }
            </Text>
            <Text style={[styles.margin, typography.text]}>
              { count }
            </Text>
          </View>
          <PlusMinusButtons
            count={count}
            onChange={this._updateCount}
            size={36}
            dark={isInvestigator}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  margin: {
    marginBottom: 4,
  },
  textColumn: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
