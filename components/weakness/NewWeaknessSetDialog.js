import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WeaknessSetPackChooserComponent from './WeaknessSetPackChooserComponent';
import Button from '../core/Button';
import EditNameDialog from '../core/EditNameDialog';
import LabeledTextBox from '../core/LabeledTextBox';
import * as Actions from '../../actions';
import { getNextWeaknessId } from '../../reducers';

class NewWeaknessSetDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    nextId: PropTypes.number.isRequired,
    createWeaknessSet: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      packs: [],
      name: `Set ${props.nextId}`,
      editNameDialogVisible: false,
      viewRef: null,
    };

    this._toggleEditNameDialog = this.toggleEditNameDialog.bind(this);
    this._captureViewRef = this.captureViewRef.bind(this);
    this._onNameChange = this.onNameChange.bind(this);
    this._onSavePressed = this.onSavePressed.bind(this);
    this._onSelectedPacksChanged = this.onSelectedPacksChanged.bind(this);
  }

  toggleEditNameDialog() {
    this.setState({
      editNameDialogVisible: !this.state.editNameDialogVisible,
    });
  }

  onSelectedPacksChanged(packs) {
    this.setState({
      packs: packs,
    });
  }

  captureViewRef(ref) {
    this.setState({
      viewRef: ref,
    });
  }

  onPackCheck(pack, value) {
    this.setState({
      override: Object.assign({}, this.state.override, { [pack]: !!value }),
    });
  }

  onNameChange(value) {
    this.setState({
      name: value,
    });
  }

  onSavePressed() {
    const {
      navigator,
      createWeaknessSet,
      nextId,
    } = this.props;

    const {
      name,
      packs,
    } = this.state;
    createWeaknessSet(nextId, name, packs);
    navigator.pop();
  }

  renderFooter() {
    return (
      <View style={styles.button}>
        <Button text="Create" onPress={this._onSavePressed} />
      </View>
    );
  }

  renderEditNameDialog() {
    const {
      name,
      editNameDialogVisible,
      viewRef,
    } = this.state;
    if (!viewRef) {
      return null;
    }

    return (
      <EditNameDialog
        title="Edit Name"
        visible={editNameDialogVisible}
        name={name}
        viewRef={viewRef}
        onNameChange={this._onNameChange}
        toggleVisible={this._toggleEditNameDialog}
      />
    );
  }

  renderHeader() {
    const {
      name,
    } = this.state;
    return (
      <View >
        <View style={styles.row}>
          <LabeledTextBox
            label="Name"
            value={name}
            onPress={this._toggleEditNameDialog}
          />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.text}>Include Weaknesses From These Sets</Text>
        </View>
      </View>
    );
  }

  render() {
    const {
      navigator,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.container} ref={this._captureViewRef}>
          { this.renderHeader() }
          <WeaknessSetPackChooserComponent
            navigator={navigator}
            onSelectedPacksChanged={this._onSelectedPacksChanged}
          />
          { this.renderFooter() }
        </View>
        { this.renderEditNameDialog() }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    nextId: getNextWeaknessId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWeaknessSetDialog);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textBlock: {
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  text: {
    margin: 16,
  },
  button: {
    marginTop: 16,
  },
});
