import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import EditTraumaDialog from './EditTraumaDialog';

export default function withTraumaDialog(WrappedComponent) {
  class TraumaEditDialogComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        viewRef: null,
        visible: false,
        investigator: null,
        traumaData: null,
        investigatorData: {},
      };

      this._captureViewRef = this.captureViewRef.bind(this);
      this._updateTraumaData = this.updateTraumaData.bind(this);
      this._showTraumaDialog = this.showTraumaDialog.bind(this);
      this._hideDialog = this.hideDialog.bind(this);
    }

    captureViewRef(ref) {
      this.setState({
        viewRef: ref,
      });
    }

    updateTraumaData(code, data) {
      this.setState({
        investigatorData: Object.assign(
          {},
          this.state.investigatorData,
          { [code]: Object.assign({}, data) },
        ),
      });
    }

    showTraumaDialog(investigator, traumaData) {
      this.setState({
        visible: true,
        investigator: investigator,
        traumaData,
      });
    }

    hideDialog() {
      this.setState({
        visible: false,
      });
    }

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
