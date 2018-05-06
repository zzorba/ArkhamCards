import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { getPacksInCollection } from '../../reducers';
import CampaignSelector from './CampaignSelector';
import LabeledTextBox from '../core/LabeledTextBox';
import SelectedDeckListComponent from '../SelectedDeckListComponent';

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
      difficulty: 'Standard',
      deckIds: [],
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._updateDifficulty = this.updateDifficulty.bind(this);
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
    navigator.setButtons({
      rightButtons: [
        {
          title: 'Done',
          id: 'save',
          showAsAction: 'ifRoom',
          disabled: campaignCode === 'custom' && !campaign,
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

  updateDifficulty(value) {
    this.setState({
      difficulty: value,
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

  campaignChanged({ campaign, campaignCode }) {
    this.setState({
      campaign,
      campaignCode,
    }, this._updateNavigatorButtons);
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
      <View style={styles.topPadding}>
        <CampaignSelector
          navigator={navigator}
          campaignChanged={this._campaignChanged}
        />
        <View style={[styles.margin, styles.topPadding]}>
          <LabeledTextBox
            label="Difficulty"
            onPress={this._showDifficultyDialog}
            value={difficulty}
          />
        </View>
        <SelectedDeckListComponent
          navigator={navigator}
          deckIds={deckIds}
          deckAdded={this._deckAdded}
          deckRemoved={this._deckRemoved}
        />
      </View>
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
});
