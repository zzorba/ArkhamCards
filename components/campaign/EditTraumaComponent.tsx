import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import { traumaString, DEFAULT_TRAUMA_DATA } from './trauma';
import LabeledTextBox from '../core/LabeledTextBox';
import L from '../../app/i18n';
import { InvestigatorData, Trauma } from '../../actions/types';
import Card from '../../data/Card';

interface Props {
  investigator: Card;
  investigatorData: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
}

export default class EditTraumaComponent extends React.Component<Props> {
  traumaData() {
    const {
      investigatorData,
      investigator,
    } = this.props;
    return investigatorData[investigator.code] || DEFAULT_TRAUMA_DATA;
  }

  _editTraumaPressed = () => {
    const {
      investigator,
      showTraumaDialog,
    } = this.props;
    showTraumaDialog(investigator, this.traumaData());
  };

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
