import React from 'react';
import { filter, map, sum, values } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Results } from 'realm';

import L from '../../../app/i18n';
import { WeaknessSet } from '../../../actions/types';
import typography from '../../../styles/typography';
import { COLORS } from '../../../styles/colors';
import Card from '../../../data/Card';
import NavButton from '../../core/NavButton';
import withWeaknessCards, { WeaknessCardProps } from '../../weakness/withWeaknessCards';

interface OwnProps {
  componentId: string;
  campaignId: number;
  weaknessSet: WeaknessSet;

}
type Props = OwnProps &  WeaknessCardProps;

class WeaknessSetSection extends React.Component<Props> {
  static computeCount(set: WeaknessSet, allCards: Results<Card>) {
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

  _showDrawDialog = () => {
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
  };

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

export default withWeaknessCards<OwnProps>(WeaknessSetSection);

const styles = StyleSheet.create({
  padding: {
    padding: 6,
  },
});
