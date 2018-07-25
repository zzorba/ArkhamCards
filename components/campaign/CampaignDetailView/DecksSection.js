import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import NavButton from '../../core/NavButton';
import withPlayerCards from '../../withPlayerCards';
import typography from '../../../styles/typography';

class DecksSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    // From realm.
    investigators: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._showDecksView = this.showDecksView.bind(this);
  }

  showDecksView() {
    const {
      navigator,
      campaign,
    } = this.props;
    navigator.push({
      screen: 'Campaign.Decks',
      title: 'Decks',
      passProps: {
        id: campaign.id,
      },
    });
  }

  render() {
    const {
      campaign,
      investigators,
    } = this.props;
    return (
      <NavButton onPress={this._showDecksView}>
        <View style={styles.padding}>
          <Text style={typography.text}>
            Decks
          </Text>
          <CampaignInvestigatorRow
            campaign={campaign}
            investigators={investigators}
          />
        </View>
      </NavButton>
    );
  }
}

export default withPlayerCards(DecksSection);

const styles = StyleSheet.create({
  padding: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
});
