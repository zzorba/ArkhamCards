import React from 'react';
import PropTypes from 'prop-types';
import { keys, map } from 'lodash';
import {
  ScrollView,
} from 'react-native';

import ChaosTokenRow from './ChaosTokenRow';
import { CHAOS_BAG_TOKEN_COUNTS } from '../../../constants';

export default class EditChaosBagDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    originalChaosBag: PropTypes.object,
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
          title: 'Done',
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
      originalChaosBag,
    } = this.props;
    const {
      chaosBag,
    } = this.state;
    const ogChaosBag = originalChaosBag || this.props.chaosBag;
    return (
      <ScrollView>
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
