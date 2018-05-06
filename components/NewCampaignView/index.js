import React from 'react';
import PropTypes from 'prop-types';
import { capitalize, filter, keys, map, range, sortBy } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { getPacksInCollection } from '../../reducers';
import CampaignSelector from './CampaignSelector';
import { CUSTOM } from './constants';
import LabeledTextBox from '../core/LabeledTextBox';
import ChaosTokenIcon from '../core/ChaosTokenIcon';
import SelectedDeckListComponent from '../SelectedDeckListComponent';
import { CAMPAIGN_CHAOS_BAGS, CHAOS_TOKEN_ORDER, DIFFICULTY } from '../../constants';
import typography from '../../styles/typography';

class NewCampaignView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    newCampaign: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    props.navigator.setTitle({
      title: 'New Campaign',
    });

    this.state = {
      campaign: null,
      campaignCode: null,
      difficulty: 'standard',
      deckIds: [],
      customChaosBag: Object.assign({}, CAMPAIGN_CHAOS_BAGS.core[1]),
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._updateChaosBag = this.updateChaosBag.bind(this);
    this._updateDifficulty = this.updateDifficulty.bind(this);
    this._showChaosBagDialog = this.showChaosBagDialog.bind(this);
    this._showDifficultyDialog = this.showDifficultyDialog.bind(this);
    this._campaignChanged = this.campaignChanged.bind(this);
    this._updateNavigatorButtons = this.updateNavigatorButtons.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
    this._deckRemoved = this.deckRemoved.bind(this);
  }

  deckAdded(id) {
    this.setState({
      deckIds: [...this.state.deckIds, id],
    });
  }

  deckRemoved(id) {
    this.setState({
      deckIds: filter([...this.state.deckIds], deckId => deckId !== id),
    });
  }

  updateNavigatorButtons() {
    const {
      navigator,
    } = this.props;
    const {
      campaign,
      campaignCode,
    } = this.state;
    console.log(`campaign(${campaign}), campaignCode(${campaignCode})`);
    navigator.setButtons({
      rightButtons: [
        {
          title: 'Done',
          id: 'save',
          showAsAction: 'ifRoom',
          disabled: campaignCode === CUSTOM && !campaign,
        },
      ],
    });
  }

  onNavigatorEvent(event) {
    const {
      campaign,
      campaignCode,
      difficulty,
    } = this.state;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.props.newCampaign(campaignCode, campaign, difficulty);
        this.props.navigator.pop();
      }
    }
  }

  updateChaosBag(chaosBag) {
    this.setState({
      customChaosBag: chaosBag,
    });
  }

  updateDifficulty(value) {
    this.setState({
      difficulty: value,
    }, this._updateNavigatorButtons);
  }

  showChaosBagDialog() {
    const {
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Dialog.EditChaosBag',
      passProps: {
        chaosBag: this.state.customChaosBag,
        updateChaosBag: this._updateChaosBag,
      },
      backButtonTitle: 'Cancel',
    });
  }

  showDifficultyDialog() {
    const {
      navigator,
    } = this.props;
    navigator.showLightBox({
      screen: 'Dialog.CampaignDifficulty',
      passProps: {
        difficulty: this.state.difficulty,
        updateDifficulty: this._updateDifficulty,
      },
      style: {
        backgroundColor: 'rgba(128,128,128,.75)',
      },
    });
  }

  campaignChanged(campaignCode, campaign) {
    this.setState({
      campaign,
      campaignCode,
    }, this._updateNavigatorButtons);
  }

  hasDefinedChaosBag() {
    const {
      campaignCode,
      difficulty,
    } = this.state;

    return (
      campaignCode !== CUSTOM &&
      CAMPAIGN_CHAOS_BAGS[campaignCode] &&
      CAMPAIGN_CHAOS_BAGS[campaignCode][DIFFICULTY[difficulty]]);
  }

  getChaosBag() {
    const {
      campaignCode,
      difficulty,
      customChaosBag,
    } = this.state;
    if (this.hasDefinedChaosBag()) {
      return CAMPAIGN_CHAOS_BAGS[campaignCode][DIFFICULTY[difficulty]];
    }

    return customChaosBag;
  }

  renderChaosBag() {
    const chaosBag = this.getChaosBag();
    const bagKeys = sortBy(keys(chaosBag), token => CHAOS_TOKEN_ORDER[token]);
    return (
      <View style={styles.margin}>
        <View style={styles.chaosBagLabelRow}>
          <Text style={typography.bigLabel}>Chaos Bag</Text>
        </View>
        <View style={styles.chaosBag}>
          { map(bagKeys, (token, tokenIdx) =>
            map(range(0, chaosBag[token]), idx => {
              const isLast = (idx === (chaosBag[token] - 1)) &&
                (tokenIdx === (bagKeys.length - 1));
              return (
                <View key={`${token}-${idx}`} style={styles.commaView}>
                  <ChaosTokenIcon id={token} size={18} />
                  { !isLast && <Text style={styles.comma}>,</Text> }
                </View>
              );
            }))
          }
        </View>
      </View>
    );
  }

  renderChaosBagSection() {
    if (this.hasDefinedChaosBag()) {
      return this.renderChaosBag();
    }
    return (
      <TouchableOpacity onPress={this._showChaosBagDialog}>
        { this.renderChaosBag() }
      </TouchableOpacity>
    );
  }

  render() {
    const {
      navigator,
    } = this.props;

    const {
      difficulty,
      deckIds,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.topPadding}>
        <View style={styles.underline}>
          <CampaignSelector
            navigator={navigator}
            campaignChanged={this._campaignChanged}
          />
          <View style={[styles.margin, styles.topPadding]}>
            <LabeledTextBox
              label="Difficulty"
              onPress={this._showDifficultyDialog}
              value={capitalize(difficulty)}
            />
          </View>
        </View>
        <View style={styles.underline}>
          { this.renderChaosBagSection() }
        </View>
        <SelectedDeckListComponent
          navigator={navigator}
          deckIds={deckIds}
          deckAdded={this._deckAdded}
          deckRemoved={this._deckRemoved}
        />
      </ScrollView>
    );
  }
}


function mapStateToProps(state) {
  return {
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCampaignView);

const styles = StyleSheet.create({
  topPadding: {
    marginTop: 8,
  },
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
  chaosBag: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chaosBagLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commaView: {
    flexDirection: 'row',
  },
  comma: {
    fontSize: 18,
  },
  underline: {
    paddingBottom: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
});
