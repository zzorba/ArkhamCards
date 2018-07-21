import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';

import { traumaString, DEFAULT_TRAUMA_DATA } from './trauma';
import TextBox from '../core/TextBox';
import typography from '../../styles/typography';

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
    return (
      <View style={styles.traumaBlock}>
        <Text style={typography.small}>
          TRAUMA
        </Text>
        <TouchableOpacity onPress={this._editTraumaPressed}>
          <TextBox
            value={traumaString(this.traumaData())}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  traumaBlock: {
    marginBottom: 4,
  },
});
