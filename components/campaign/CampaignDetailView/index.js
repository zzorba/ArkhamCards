import React from 'react';
import PropTypes from 'prop-types';
import { find, keys, map } from 'lodash';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { CUSTOM } from '../constants';
import ChaosBagSection from '../ChaosBagSection';
import NotesSection from '../NotesSection';
import CountSection from '../CountSection';
import InvestigatorSection from '../InvestigatorSection';
import InvestigatorStatusRow from './InvestigatorStatusRow';
import Button from '../../core/Button';
import * as Actions from '../../../actions';
import { iconsMap } from '../../../app/NavIcons';
import { getCampaign, getAllDecks, getAllPacks } from '../../../reducers';
import typography from '../../../styles/typography';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deleteCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    decks: PropTypes.object,
    scenarioPack: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const latestDeckIds = map(props.campaign.latestDeckIds, deckId => {
      let deck = props.decks[deckId];
      if (!deck) {
        return deckId;
      }
      while (deck.next_deck) {
        const nextDeck = props.decks[deck.next_deck];
        if (nextDeck) {
          deck = nextDeck;
        } else {
          break;
        }
      }
      return deck.id;
    });

    this.state = {
      chaosBag: props.campaign.chaosBag,
      campaignNotes: props.campaign.campaignNotes,
      latestDeckIds: latestDeckIds,
    };

    this._notesChanged = this.notesChanged.bind(this);
    this._countChanged = this.countChanged.bind(this);
    this._updateChaosBag = this.updateChaosBag.bind(this);
    this._delete = this.delete.bind(this);
    this._addScenarioResult = this.addScenarioResult.bind(this);

    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.delete,
          id: 'delete',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  notesChanged(index, notes) {
    const {
      campaignNotes,
    } = this.state;
    const sections = campaignNotes.sections.slice();
    sections[index].notes = notes;
    const newCampaignNotes = Object.assign({},
      campaignNotes,
      { sections: sections },
    );

    this.setState({
      campaignNotes: newCampaignNotes,
    });
  }

  countChanged(index, count) {
    const {
      campaignNotes,
    } = this.state;
    const counts = campaignNotes.counts.slice();
    counts[index].count = count;
    const newCampaignNotes = Object.assign({},
      campaignNotes,
      { counts: counts },
    );

    this.setState({
      campaignNotes: newCampaignNotes,
    });
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

  updateChaosBag(bag) {
    this.setState({
      chaosBag: bag,
    });
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
          `Are you sure you want to delete the campaign: ${campaign.name}?`,
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

  renderLatestDecks() {
    const {
      navigator,
      campaign,
    } = this.props;
    return (
      <InvestigatorSection
        navigator={navigator}
        campaign={campaign}
      />
    );
  }

  renderCampaignNotes() {
    const {
      campaignNotes,
    } = this.state;
    return (
      <View>
        { map(campaignNotes.sections || [], (section, idx) => (
          <NotesSection
            key={idx}
            notesChanged={this._notesChanged}
            index={idx}
            notesSection={section}
          />
        )) }
        { map(campaignNotes.counts || [], (section, idx) => (
          <CountSection
            key={idx}
            countChanged={this._countChanged}
            index={idx}
            countSection={section}
          />
        )) }
      </View>
    );
  }

  render() {
    const {
      navigator,
      campaign,
      scenarioPack,
    } = this.props;
    const {
      chaosBag,
    } = this.state;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView>
        <Text style={[typography.bigLabel, styles.margin]}>
          { campaign.name }
        </Text>
        { campaign.cycleCode !== CUSTOM && (
          <Text style={[typography.text, styles.margin]}>
            { scenarioPack.name }
          </Text>
        ) }
        { this.renderScenarioResults() }
        <Button onPress={this._addScenarioResult} text="Record Scenario Result" />
        <ChaosBagSection
          navigator={navigator}
          chaosBag={chaosBag}
          originalChaosBag={campaign.chaosBag}
          updateChaosBag={this._updateChaosBag}
        />
        { this.renderCampaignNotes() }
        { this.renderLatestDecks() }
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  const packs = getAllPacks(state);
  return {
    campaign: campaign,
    decks: getAllDecks(state),
    scenarioPack: campaign && find(packs, pack => pack.code === campaign.cycleCode),
    packs: packs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailView);

const styles = StyleSheet.create({
  margin: {
    margin: 8,
  },
  footer: {
    height: 100,
  },
});
