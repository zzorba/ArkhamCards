import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PlusMinusButtons from '../../core/PlusMinusButtons';
import typography from '../../../styles/typography';

export default class CountSection extends React.Component {
  static propTypes = {
    countChanged: PropTypes.func.isRequired,
    index: PropTypes.number,
    title: PropTypes.string.isRequired,
    count: PropTypes.number,
    isInvestigator: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      count: props.count,
    };

    this._syncCount = this.syncCount.bind(this);
    this._updateCount = this.updateCount.bind(this);
  }

  syncCount() {
    const {
      countChanged,
      index,
    } = this.props;
    const {
      count,
    } = this.state;
    countChanged(index, count);
  }

  updateCount(count) {
    this.setState({
      count,
    }, this._syncCount);
  }

  render() {
    const {
      title,
      isInvestigator,
    } = this.props;
    const {
      count,
    } = this.state;
    return (
      <View style={[styles.container, isInvestigator ? {} : styles.underline]}>
        <Text style={[typography.bigLabel, styles.margin]}>
          { title }
        </Text>
        <View style={[styles.row, styles.margin]}>
          <PlusMinusButtons
            count={count}
            onChange={this._updateCount}
            size={28}
            dark={isInvestigator}
          />
          <Text style={[styles.margin, typography.text]}>
            { count }
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
  container: {
    marginBottom: 4,
  },
  underline: {
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
