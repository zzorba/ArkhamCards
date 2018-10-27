import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import NavButton from '../../core/NavButton';
import ChaosBagLine from '../../core/ChaosBagLine';
import typography from '../../../styles/typography';

export default class ChaosBagSection extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    chaosBag: PropTypes.object.isRequired,
    updateChaosBag: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._showChaosBagDialog = this.showChaosBagDialog.bind(this);
  }

  showChaosBagDialog() {
    const {
      componentId,
      updateChaosBag,
      chaosBag,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag: updateChaosBag,
          trackDeltas: true,
        },
        options: {
          topBar: {
            title: {
              text: L('Chaos Bag'),
            },
            backButton: {
              title: L('Cancel'),
            },
          },
        },
      },
    });
  }

  render() {
    return (
      <NavButton onPress={this._showChaosBagDialog}>
        <View style={styles.padding}>
          <Text style={typography.text}>
            { L('Chaos Bag') }
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
