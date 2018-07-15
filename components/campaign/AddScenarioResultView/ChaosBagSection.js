import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ChaosBagLine from '../../core/ChaosBagLine';
import typography from '../../../styles/typography';

export default class ChaosBagSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    chaosBag: PropTypes.object.isRequired,
    originalChaosBag: PropTypes.object,
    updateChaosBag: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._showChaosBagDialog = this.showChaosBagDialog.bind(this);
  }

  showChaosBagDialog() {
    const {
      navigator,
      updateChaosBag,
      chaosBag,
      originalChaosBag,
    } = this.props;
    navigator.push({
      screen: 'Dialog.EditChaosBag',
      passProps: {
        chaosBag,
        originalChaosBag,
        updateChaosBag: updateChaosBag,
        trackDeltas: true,
      },
      backButtonTitle: 'Cancel',
    });
  }

  render() {
    return (
      <View style={styles.underline}>
        <Text style={[typography.bigLabel, styles.margin]}>
          Chaos Bag
        </Text>
        <TouchableOpacity onPress={this._showChaosBagDialog}>
          <ChaosBagLine chaosBag={this.props.chaosBag} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
  underline: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    marginBottom: 4,
  },
});
