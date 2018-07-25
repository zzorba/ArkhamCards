import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CampaignNotesSection from './CampaignNotesSection';
import InvestigatorNotesSection from './InvestigatorNotesSection';
import { iconsMap } from '../../../app/NavIcons';
import { getCampaign } from '../../../reducers';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    // redux
    campaign: PropTypes.object,
  };

  constructor(props) {
    super(props);

    props.navigator.setButtons({
      rightButtons: [{
        icon: iconsMap.edit,
        id: 'edit',
      }],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    const {
      navigator,
      campaign,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'edit') {
        navigator.push({
          screen: 'Dialog.EditCampaignNotes',
          title: 'Campaign Log',
          passProps: {
            campaignId: campaign.id,
          },
          backButtonTitle: 'Cancel',
        });
      }
    }
  }

  render() {
    const {
      navigator,
      campaign,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView style={styles.flex}>
        <View style={styles.section}>
          <CampaignNotesSection
            campaignNotes={campaign.campaignNotes}
          />
        </View>
        <View style={styles.section}>
          <InvestigatorNotesSection
            navigator={navigator}
            campaignId={campaign.id}
            campaign={campaign}
            deckIds={campaign.latestDeckIds || []}
          />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    campaign: getCampaign(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailView);

const styles = StyleSheet.create({
  section: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  footer: {
    height: 100,
  },
  flex: {
    flex: 1,
  },
});
