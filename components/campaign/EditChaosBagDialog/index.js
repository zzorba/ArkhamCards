import React from 'react';
import PropTypes from 'prop-types';
import { keys, map, sortBy, throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import ChaosTokenRow from './ChaosTokenRow';
import { CHAOS_BAG_TOKEN_COUNTS, CHAOS_TOKEN_ORDER } from '../../../constants';
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

    this._mutateCount = this.mutateCount.bind(this);
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

  mutateCount(id, mutate) {
    this.setState(state => {
      return {
        chaosBag: Object.assign(
          {},
          state.chaosBag,
          { [id]: mutate(state.chaosBag[id]) }),
      };
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
        { map(sortBy(keys(CHAOS_BAG_TOKEN_COUNTS), x => CHAOS_TOKEN_ORDER[x]),
          id => {
            const originalCount = trackDeltas ? ogChaosBag[id] : chaosBag[id];
            return (
              <ChaosTokenRow
                key={id}
                id={id}
                originalCount={originalCount || 0}
                count={chaosBag[id] || 0}
                limit={CHAOS_BAG_TOKEN_COUNTS[id]}
                mutateCount={this._mutateCount}
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
