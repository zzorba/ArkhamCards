import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { throttle } from 'lodash';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import { Slots } from 'actions/types';
import ExileCardSelectorComponent from './ExileCardSelectorComponent';
import { COLORS } from 'styles/colors';

interface Props {
  componentId: string;
  id: number;
  updateExiles: (exiles: Slots) => void;
  exiles: Slots;
}

interface State {
  exileCounts: Slots;
}

export default class ExileCardDialog extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        rightButtons: [{
          text: t`Save`,
          id: 'save',
          showAsAction: 'ifRoom',
          color: COLORS.navButton,
          testID: t`Save`,
        }],
      },
    };
  }

  _navEventListener: EventSubscription;
  _doSave!: () => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      exileCounts: props.exiles,
    };

    this._doSave = throttle(this.doSave.bind(this), 200);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  doSave() {
    const {
      updateExiles,
      componentId,
    } = this.props;
    updateExiles(this.state.exileCounts);
    Navigation.pop(componentId);
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'save') {
      this._doSave();
    }
  }

  _onExileCountsChange = (exileCounts: Slots) => {
    this.setState({
      exileCounts,
    });
  };

  backPressed() {
    this.props.updateExiles(this.state.exileCounts);
  }

  render() {
    const {
      id,
      componentId,
    } = this.props;

    const {
      exileCounts,
    } = this.state;

    return (
      <ScrollView style={styles.wrapper}>
        <ExileCardSelectorComponent
          componentId={componentId}
          id={id}
          exileCounts={exileCounts}
          updateExileCounts={this._onExileCountsChange}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
