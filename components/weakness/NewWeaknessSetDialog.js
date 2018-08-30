import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../../app/i18n';
import WeaknessSetPackChooserComponent from './WeaknessSetPackChooserComponent';
import Button from '../core/Button';
import withTextEditDialog from '../core/withTextEditDialog';
import LabeledTextBox from '../core/LabeledTextBox';
import * as Actions from '../../actions';
import { getNextWeaknessId } from '../../reducers';

class NewWeaknessSetDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    nextId: PropTypes.number.isRequired,
    createWeaknessSet: PropTypes.func.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      packs: [],
      name: `Set ${props.nextId}`,
    };

    this._showEditNameDialog = this.showEditNameDialog.bind(this);
    this._onNameChange = this.onNameChange.bind(this);
    this._onSavePressed = this.onSavePressed.bind(this);
    this._onSelectedPacksChanged = this.onSelectedPacksChanged.bind(this);
  }

  onSelectedPacksChanged(packs) {
    this.setState({
      packs: packs,
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
        <Button text={L('Create')} onPress={this._onSavePressed} />
      </View>
    );
  }

  showEditNameDialog() {
    const {
      showTextEditDialog,
    } = this.props;
    const {
      name,
    } = this.state;
    showTextEditDialog(L('Edit Name'), name, this._onNameChange);
  }

  renderHeader() {
    const {
      name,
    } = this.state;
    return (
      <View >
        <View style={styles.row}>
          <LabeledTextBox
            label={L('Name')}
            value={name}
            onPress={this._showEditNameDialog}
          />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.text}>{ L('Include Weaknesses From These Sets') }</Text>
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
        { this.renderHeader() }
        <WeaknessSetPackChooserComponent
          navigator={navigator}
          onSelectedPacksChanged={this._onSelectedPacksChanged}
        />
        { this.renderFooter() }
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

export default connect(mapStateToProps, mapDispatchToProps)(
  withTextEditDialog(NewWeaknessSetDialog));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    marginBottom: 16,
  },
});
