import React from 'react';
import PropTypes from 'prop-types';
import { keys, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import L from '../../../app/i18n';
import ChaosTokenRow from './ChaosTokenRow';
import { CHAOS_BAG_TOKEN_COUNTS } from '../../../constants';
import typography from '../../../styles/typography';

export default class EditChaosBagDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    chaosBag: PropTypes.object.isRequired,
    updateChaosBag: PropTypes.func.isRequired,
    trackDeltas: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      chaosBag: Object.assign({}, props.chaosBag),
    };

    props.navigator.setButtons({
      rightButtons: [
        {
          title: L('Save'),
          id: 'save',
          showAsAction: 'ifRoom',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._onCountChange = this.onCountChange.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.props.updateChaosBag(this.state.chaosBag);
        this.props.navigator.pop();
      }
    }
  }

  onCountChange(id, count) {
    this.setState({
      chaosBag: Object.assign({}, this.state.chaosBag, { [id]: count }),
    });
  }

  render() {
    const {
      trackDeltas,
    } = this.props;
    const {
      chaosBag,
    } = this.state;
    const ogChaosBag = this.props.chaosBag;
    return (
      <ScrollView>
        <View style={styles.row}>
          <Text style={[typography.bigLabel, typography.bold]}>In Bag</Text>
        </View>
        { map(keys(CHAOS_BAG_TOKEN_COUNTS), id => {
          const originalCount = trackDeltas ? ogChaosBag[id] : chaosBag[id];
          return (
            <ChaosTokenRow
              key={id}
              id={id}
              originalCount={originalCount || 0}
              count={chaosBag[id] || 0}
              limit={CHAOS_BAG_TOKEN_COUNTS[id]}
              onCountChange={this._onCountChange}
            />
          );
        }) }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
