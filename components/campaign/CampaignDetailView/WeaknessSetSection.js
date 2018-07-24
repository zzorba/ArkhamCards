import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from '../../core/Button';
import WeaknessSetView from '../../weakness/WeaknessSetView';
import withWeaknessCards from '../../weakness/withWeaknessCards';
import typography from '../../../styles/typography';

class WeaknessSetSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    weaknessSet: PropTypes.object.isRequired,
    // From realm.
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._showEditDialog = this.pushScreen.bind(this, 'Dialog.CampaignEditWeakness');
    this._showDrawDialog = this.pushScreen.bind(this, 'Dialog.CampaignDrawWeakness');
  }

  pushScreen(screen) {
    const {
      navigator,
      campaignId,
    } = this.props;
    navigator.push({
      screen,
      passProps: {
        campaignId,
      },
    });
  }

  render() {
    const {
      weaknessSet,
      cards,
    } = this.props;
    const counts = WeaknessSetView.computeCount(weaknessSet, cards);
    if (counts.total === 0) {
      return null;
    }
    return (
      <View style={styles.underline}>
        <Text style={[typography.small, styles.padding]}>
          BASIC WEAKNESSES
        </Text>
        <Text style={[typography.small, styles.padding]}>
          { `${counts.assigned} / ${counts.total} have been drawn.` }
        </Text>
        <View style={styles.marginTop}>
          <Button text="Edit Available Cards" align="left" onPress={this._showEditDialog} />
        </View>
        <View style={styles.marginTop}>
          <Button text="Draw Weaknesses" align="left" onPress={this._showDrawDialog} />
        </View>
      </View>
    );
  }
}

export default withWeaknessCards(WeaknessSetSection);

const styles = StyleSheet.create({
  padding: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  underline: {
    paddingBottom: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  marginTop: {
    marginTop: 8,
  },
});
