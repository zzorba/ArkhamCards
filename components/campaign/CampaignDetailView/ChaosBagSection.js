import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NavButton from '../../core/NavButton';
import ChaosBagLine from '../../core/ChaosBagLine';
import typography from '../../../styles/typography';

export default class ChaosBagSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    chaosBag: PropTypes.object.isRequired,
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
    } = this.props;
    navigator.push({
      screen: 'Dialog.EditChaosBag',
      title: 'Chaos Bag',
      passProps: {
        chaosBag,
        updateChaosBag: updateChaosBag,
        trackDeltas: true,
      },
      backButtonTitle: 'Cancel',
    });
  }

  render() {
    return (
      <NavButton onPress={this._showChaosBagDialog}>
        <View style={styles.padding}>
          <Text style={typography.text}>
            Chaos Bag
          </Text>
          <View style={styles.marginTop}>
            <ChaosBagLine chaosBag={this.props.chaosBag} />
          </View>
        </View>
      </NavButton>
    );
  }
}

const styles = StyleSheet.create({
  padding: {
    padding: 8,
  },
  marginTop: {
    marginTop: 8,
  },
});
