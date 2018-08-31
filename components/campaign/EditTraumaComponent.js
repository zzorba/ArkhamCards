import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import L from '../../app/i18n';
import { traumaString, DEFAULT_TRAUMA_DATA } from './trauma';
import LabeledTextBox from '../core/LabeledTextBox';

export default class EditTraumaComponent extends React.Component {
  static propTypes = {
    investigator: PropTypes.object.isRequired,
    investigatorData: PropTypes.object,
    showTraumaDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._editTraumaPressed = this.editTraumaPressed.bind(this);
  }

  traumaData() {
    const {
      investigatorData,
      investigator,
    } = this.props;
    return investigatorData[investigator.code] || DEFAULT_TRAUMA_DATA;
  }

  editTraumaPressed() {
    const {
      investigator,
      showTraumaDialog,
    } = this.props;
    showTraumaDialog(investigator, this.traumaData());
  }

  render() {
    const {
      investigator,
    } = this.props;
    return (
      <View style={styles.traumaBlock}>
        <LabeledTextBox
          column
          label={L('Trauma')}
          onPress={this._editTraumaPressed}
          value={traumaString(this.traumaData(), investigator)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  traumaBlock: {
    marginBottom: 4,
  },
});
