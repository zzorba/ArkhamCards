import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, keys, map } from 'lodash';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import InvestigatorStatusRow from './InvestigatorStatusRow';
import * as Actions from '../../../actions';
import { iconsMap } from '../../../app/NavIcons';
import Button from '../../core/Button';
import { getCampaign, getAllDecks } from '../../../reducers';
import typography from '../../../styles/typography';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deleteCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    decks: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._delete = this.delete.bind(this);
    this._addScenarioResult = this.addScenarioResult.bind(this);
    if (props.campaign) {
      props.navigator.setSubTitle({ subtitle: props.campaign.name });
    }
    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.edit,
          id: 'edit',
        },
        {
          icon: iconsMap.delete,
          id: 'delete',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidUpdate(prevProps) {
    const {
      campaign,
      navigator,
    } = this.props;
    if (campaign && prevProps.campaign && campaign.name !== prevProps.campaign.name) {
      navigator.setSubTitle({ subtitle: campaign.name });
    }
  }

  delete() {
    const {
      id,
      deleteCampaign,
      navigator,
    } = this.props;
    deleteCampaign(id);
    navigator.pop();
  }

  addScenarioResult() {
    const {
      campaign,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Campaign.AddResult',
      backButtonTitle: 'Cancel',
      passProps: {
        campaign,
      },
    });
  }

  onNavigatorEvent(event) {
    const {
      campaign,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'delete') {
        Alert.alert(
          'Delete',
          `Are you sure you want to delete the campaign: ${campaign.title}?`,
          [
            { text: 'Delete', onPress: this._delete, style: 'destructive' },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
      }
    }
  }

  renderScenarioResults() {
    const {
      campaign: {
        investigatorStatus,
      },
    } = this.props;
    return (
      <View>
        { map(keys(investigatorStatus), code => (
          <InvestigatorStatusRow
            key={code}
            investigatorCode={code}
            status={investigatorStatus[code]}
          />
        )) }
      </View>
    );
  }

  renderCampaignNotes() {
    const {
      campaign,
    } = this.props;
    const notes = flatMap(
      campaign.scenarioResults,
      scenario => scenario.campaignNotes);
    if (!notes.length) {
      return (
        <View style={styles.column}>
          <Text style={typography.bigLabel}>
            Campaign Log:
          </Text>
          <Text>
            None
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.column}>
        <Text style={typography.bigLabel}>
          Campaign Log:
        </Text>
        { map(notes, (note, idx) => (
          <Text key={idx}>-{ note }</Text>
        )) }
      </View>
    );
  }

  render() {
    const {
      campaign,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={typography.bigLabel}>
          { campaign.name }
        </Text>
        { this.renderScenarioResults() }
        <Button onPress={this._addScenarioResult} text="Record Scenario Result" />
        { this.renderCampaignNotes() }
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    campaign: getCampaign(state, props.id),
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailView);

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  column: {
    flexDirection: 'column',
  },
});
