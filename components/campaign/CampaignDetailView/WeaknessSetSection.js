import React from 'react';
import PropTypes from 'prop-types';
import { filter, map, sum, values } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import NavButton from '../../core/NavButton';
import withWeaknessCards from '../../weakness/withWeaknessCards';
import typography from '../../../styles/typography';
import { COLORS } from '../../../styles/colors';

class WeaknessSetSection extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    campaignId: PropTypes.number.isRequired,
    weaknessSet: PropTypes.object.isRequired,
    // From realm.
    cards: PropTypes.object.isRequired,
  };

  static computeCount(set, allCards) {
    if (!set) {
      return {
        assigned: 0,
        total: 0,
      };
    }
    const packCodes = new Set(set.packCodes);
    const cards = filter(allCards, card => packCodes.has(card.pack_code));
    return {
      assigned: sum(values(set.assignedCards)),
      total: sum(map(cards, card => card.quantity)),
    };
  }

  constructor(props) {
    super(props);

    this._showDrawDialog = this.showDrawDialog.bind(this);
  }

  showDrawDialog() {
    const {
      componentId,
      campaignId,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Dialog.CampaignDrawWeakness',
        passProps: {
          campaignId,
        },
        options: {
          topBar: {
            title: {
              text: L('Draw Weaknesses'),
              color: COLORS.black,
            },
            backButton: {
              title: L('Back'),
            },
          },
        },
      },
    });
  }

  render() {
    const {
      weaknessSet,
      cards,
    } = this.props;
    const counts = WeaknessSetSection.computeCount(weaknessSet, cards);
    if (counts.total === 0) {
      return null;
    }
    return (
      <NavButton onPress={this._showDrawDialog}>
        <View style={styles.padding}>
          <Text style={typography.text}>
            { L('Basic Weakness Set') }
          </Text>
          <Text style={typography.small}>
            { L('{{assignedCount}} / {{totalCount}} have been drawn.', {
              assignedCount: counts.assigned,
              totalCount: counts.total,
            }) }
          </Text>
        </View>
      </NavButton>
    );
  }
}

export default withWeaknessCards(WeaknessSetSection);

const styles = StyleSheet.create({
  padding: {
    padding: 6,
  },
});
