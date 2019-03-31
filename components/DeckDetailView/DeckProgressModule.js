import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DeckDelta from './DeckDelta';
import EditTraumaComponent from '../campaign/EditTraumaComponent';
import CampaignSummaryComponent from '../campaign/CampaignSummaryComponent';
import L from '../../app/i18n';
import * as Actions from '../../actions';
import { getDeck } from '../../reducers';
import typography from '../../styles/typography';
import space from '../../styles/space';

class DeckProgressModule extends React.PureComponent {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    deck: PropTypes.object.isRequired,
    cards: PropTypes.object.isRequired,
    parsedDeck: PropTypes.object.isRequired,
    previousDeck: PropTypes.object,
    fetchPrivateDeck: PropTypes.func.isRequired,
    fetchPublicDeck: PropTypes.func.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    campaign: PropTypes.object,
    showTraumaDialog: PropTypes.func.isRequired,
    investigatorDataUpdates: PropTypes.object,
  };

  componentDidMount() {
    const {
      deck,
      previousDeck,
      fetchPublicDeck,
      fetchPrivateDeck,
      isPrivate,
    } = this.props;
    if (deck.previous_deck && !previousDeck) {
      if (isPrivate) {
        fetchPrivateDeck(deck.previous_deck);
      } else {
        fetchPublicDeck(deck.previous_deck, true);
      }
    }
  }

  investigatorData() {
    const {
      campaign,
      investigatorDataUpdates,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return Object.assign(
      {},
      campaign.investigatorData || {},
      investigatorDataUpdates
    );
  }


  renderCampaignSection() {
    const {
      campaign,
      parsedDeck: {
        investigator,
      },
      showTraumaDialog,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <View style={styles.campaign}>
        <Text style={[typography.text, space.marginBottomS]}>
          { campaign.name }
        </Text>
        <View style={space.marginBottomM}>
          <CampaignSummaryComponent campaign={campaign} hideScenario />
        </View>
        <EditTraumaComponent
          investigator={investigator}
          investigatorData={this.investigatorData()}
          showTraumaDialog={showTraumaDialog}
        />
      </View>
    );
  }

  render() {
    const {
      campaign,
      componentId,
      deck,
      cards,
      parsedDeck,
    } = this.props;

    if (!deck.previous_deck && !deck.next_deck && !campaign) {
      return null;
    }

    // Actually compute the diffs.
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={typography.smallLabel}>
            { L('CAMPAIGN PROGRESS') }
          </Text>
        </View>
        { this.renderCampaignSection() }
        { (!!deck.previous_deck || !!deck.next_deck) && (
          <DeckDelta
            componentId={componentId}
            cards={cards}
            parsedDeck={parsedDeck}
          />
        ) }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  if (props.deck && props.deck.previous_deck) {
    return {
      previousDeck: getDeck(state, props.deck.previous_deck),
    };
  }
  return {
    previousDeck: null,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckProgressModule);


const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  campaign: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  title: {
    marginTop: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
