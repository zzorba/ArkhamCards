import React from 'react';
import PropTypes from 'prop-types';
import { keys, map, throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import ChaosTokenRow from './ChaosTokenRow';
import { CHAOS_BAG_TOKEN_COUNTS } from '../../../constants';
import typography from '../../../styles/typography';

export default class EditChaosBagDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    chaosBag: PropTypes.object.isRequired,
    updateChaosBag: PropTypes.func.isRequired,
    trackDeltas: PropTypes.bool,
  };

  static get options() {
    return {
      topBar: {
        rightButtons: [{
          text: L('Save'),
          id: 'save',
          showAsAction: 'ifRoom',
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      chaosBag: Object.assign({}, props.chaosBag),
    };

    this._onCountChange = this.onCountChange.bind(this);
    this._saveChanges = throttle(this.saveChanges.bind(this), 200);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'save') {
      this._saveChanges();
    }
  }

  saveChanges() {
    this.props.updateChaosBag(this.state.chaosBag);
    Navigation.pop(this.props.componentId);
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
