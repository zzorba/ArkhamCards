import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from '../core/Button';
import ChaosBagLine from '../core/ChaosBagLine';
import typography from '../../styles/typography';

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
        <View style={[styles.margin, styles.marginTop]}>
          <ChaosBagLine chaosBag={this.props.chaosBag} />
        </View>
        <View style={styles.marginTop}>
          <Button text="Edit" align="left" onPress={this._showChaosBagDialog} />
        </View>
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
    paddingBottom: 8,
    marginBottom: 4,
  },
  marginTop: {
    marginTop: 8,
  },
});
