import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import EditTraumaDialog from './EditTraumaDialog';
import { InvestigatorData, Trauma } from 'actions/types';
import Card from 'data/Card';

export interface TraumaProps {
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  investigatorDataUpdates: InvestigatorData;
}

export default function withTraumaDialog<Props>(
  WrappedComponent: React.ComponentType<Props & TraumaProps>
) {
  interface State {
    viewRef?: View;
    visible: boolean;
    investigator?: Card;
    traumaData?: Trauma;
    investigatorData: InvestigatorData;
  }

  class TraumaEditDialogComponent extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);

      this.state = {
        visible: false,
        investigatorData: {},
      };
    }

    _captureViewRef = (ref: View) => {
      this.setState({
        viewRef: ref,
      });
    };

    _updateTraumaData = (code: string, data: Trauma) => {
      this.setState({
        investigatorData: Object.assign(
          {},
          this.state.investigatorData,
          { [code]: Object.assign({}, data) },
        ),
      });
    };

    _showTraumaDialog = (investigator: Card, traumaData: Trauma) => {
      this.setState({
        visible: true,
        investigator: investigator,
        traumaData,
      });
    };

    _hideDialog = () => {
      this.setState({
        visible: false,
      });
    };

    renderDialog() {
      const {
        viewRef,
        visible,
        investigator,
        traumaData,
      } = this.state;

      return (
        <EditTraumaDialog
          visible={visible}
          investigator={investigator}
          trauma={traumaData}
          updateTrauma={this._updateTraumaData}
          hideDialog={this._hideDialog}
          viewRef={viewRef}
        />
      );
    }

    render() {
      return (
        <View style={styles.wrapper}>
          <View style={styles.wrapper} ref={this._captureViewRef}>
            <WrappedComponent
              showTraumaDialog={this._showTraumaDialog}
              investigatorDataUpdates={this.state.investigatorData}
              {...this.props}
            />
          </View>
          { this.renderDialog() }
        </View>
      );
    }
  }

  hoistNonReactStatic(TraumaEditDialogComponent, WrappedComponent);

  return TraumaEditDialogComponent;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
