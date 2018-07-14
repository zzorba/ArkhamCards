import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import InvestigatorImage from '../../core/InvestigatorImage';
import typography from '../../../styles/typography';

class InvestigatorStatusRow extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    investigatorCode: PropTypes.string.isRequired,
    investigator: PropTypes.object,
    status: PropTypes.object,
  };

  traumaText() {
    const {
      status: {
        trauma: {
          physical = 0,
          mental = 0,
          killed = false,
          insane = false,
        },
      },
    } = this.props;
    if (killed) {
      return 'Killed';
    }
    if (insane) {
      return 'Insane';
    }
    if (physical === 0 && mental === 0) {
      return 'None';
    }
    if (physical === 0) {
      return `Mental(${mental})`;
    }
    if (mental === 0) {
      return `Physical(${physical})`;
    }
    return `Physical(${physical}), Mental(${mental})`;
  }

  render() {
    const {
      investigator,
      status: {
        xp,
      },
    } = this.props;
    return (
      <View style={styles.row}>
        <InvestigatorImage card={investigator} />
        <View style={styles.column}>
          <Text style={typography.label}>
            { `XP: ${xp}` }
          </Text>
          <Text style={typography.label}>
            { `Trauma: ${this.traumaText()}` }
          </Text>
        </View>
      </View>
    );
  }
}

export default connectRealm(InvestigatorStatusRow, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const investigator =
      head(results.cards.filtered(`code == "${props.investigatorCode}"`));
    return {
      investigator,
    };
  },
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  column: {
    flexDirection: 'column',
    marginLeft: 8,
  },
});
