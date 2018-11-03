import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, keys, map, sumBy, throttle } from 'lodash';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import CampaignSelector from './CampaignSelector';
import CampaignNoteSectionRow from './CampaignNoteSectionRow';
import {
  CUSTOM,
  DIFFICULTY,
  campaignLogs,
  CAMPAIGN_CHAOS_BAGS,
  difficultyStrings,
} from '../constants';
import AddCampaignNoteSectionDialog from '../AddCampaignNoteSectionDialog';
import NavButton from '../../core/NavButton';
import ChaosBagLine from '../../core/ChaosBagLine';
import withTextEditDialog from '../../core/withTextEditDialog';
import LabeledTextBox from '../../core/LabeledTextBox';
import DeckSelector from './DeckSelector';
import WeaknessSetPackChooserComponent from '../../weakness/WeaknessSetPackChooserComponent';
import withWeaknessCards from '../../weakness/withWeaknessCards';
import { getNextCampaignId } from '../../../reducers';
import typography from '../../../styles/typography';
import { newCampaign } from '../actions';

class NewCampaignView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    newCampaign: PropTypes.func.isRequired,
    nextId: PropTypes.number.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    captureViewRef: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
    cardsMap: PropTypes.object,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('New Campaign'),
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      campaign: '',
      campaignCode: '',
      difficulty: 'standard',
      deckIds: [],
      weaknessPacks: [],
      weaknessAssignedCards: {},
      customChaosBag: Object.assign({}, CAMPAIGN_CHAOS_BAGS.core[1]),
      customCampaignLog: { sections: ['Campaign Notes'] },
      campaignLogDialogVisible: false,
    };

    this.updateNavigationButtons();
    this._navEventListener = Navigation.events().bindComponent(this);

    this._onSave = throttle(this.onSave.bind(this), 200);
    this._onWeaknessPackChange = this.onWeaknessPackChange.bind(this);
    this._addCampaignNoteSection = this.addCampaignNoteSection.bind(this);
    this._deleteCampaignNoteSection = this.deleteCampaignNoteSection.bind(this);
    this._toggleCampaignLogDialog = this.toggleCampaignLogDialog.bind(this);
    this._showCampaignNameDialog = this.showCampaignNameDialog.bind(this);
    this._onNameChange = this.onNameChange.bind(this);
    this._updateChaosBag = this.updateChaosBag.bind(this);
    this._updateDifficulty = this.updateDifficulty.bind(this);
    this._showChaosBagDialog = this.showChaosBagDialog.bind(this);
    this._showDifficultyDialog = this.showDifficultyDialog.bind(this);
    this._campaignChanged = this.campaignChanged.bind(this);
    this._updateNavigationButtons = this.updateNavigationButtons.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
    this._deckRemoved = this.deckRemoved.bind(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  onWeaknessPackChange(packs) {
    this.setState({
      weaknessPacks: packs,
    });
  }

  static getKeyName(isCount, perInvestigator) {
    if (perInvestigator) {
      if (isCount) {
        return 'investigatorCounts';
      }
      return 'investigatorSections';
    }
    if (isCount) {
      return 'counts';
    }
    return 'sections';
  }

  addCampaignNoteSection(name, isCount, perInvestigator) {
    const customCampaignLog = Object.assign({}, this.state.customCampaignLog);
    const keyName = NewCampaignView.getKeyName(isCount, perInvestigator);
    customCampaignLog[keyName] = (customCampaignLog[keyName] || []).slice();
    customCampaignLog[keyName].push(name);
    this.setState({
      customCampaignLog,
    });
  }

  deleteCampaignNoteSection(name, isCount, perInvestigator) {
    const customCampaignLog = Object.assign({}, this.state.customCampaignLog);
    const keyName = NewCampaignView.getKeyName(isCount, perInvestigator);
    customCampaignLog[keyName] = filter(
      customCampaignLog[keyName] || [],
      sectionName => name !== sectionName);

    this.setState({
      customCampaignLog,
    });
  }

  toggleCampaignLogDialog() {
    this.setState({
      campaignLogDialogVisible: !this.state.campaignLogDialogVisible,
    });
  }

  onNameChange(name) {
    this.setState({
      name: name,
    }, this._updateNavigationButtons);
  }

  maybeShowWeaknessPrompt(deck) {
    const {
      cardsMap,
    } = this.props;
    const weaknesses = filter(keys(deck.slots), code => (code in cardsMap));
    const count = sumBy(weaknesses, code => deck.slots[code]);
    if (weaknesses.length) {
      setTimeout(() => {
        Alert.alert(
          L('Adjust Weakness Set'),
          /* eslint-disable prefer-template */
          (count > 1 ?
            L('This deck contains several basic weaknesses') :
            L('This deck contains a basic weakness')) +
          '\n\n' +
          map(weaknesses, code => `${deck.slots[code]}x - ${cardsMap[code].name}`).join('\n') +
          '\n\n' +
          (count > 1 ?
            L('Do you want to remove them from the campaign’s Basic Weakness set?') :
            L('Do you want to remove it from the campaign’s Basic Weakness set?')),
          [
            { text: L('Not Now'), style: 'cancel' },
            {
              text: L('Okay'),
              style: 'default',
              onPress: () => {
                const {
                  weaknessAssignedCards,
                } = this.state;
                const assignedCards = Object.assign({}, weaknessAssignedCards);
                forEach(weaknesses, code => {
                  const count = deck.slots[code];
                  if (!(code in assignedCards)) {
                    assignedCards[code] = 0;
                  }
                  if ((assignedCards[code] + count) > cardsMap[code].quantity) {
                    assignedCards[code] = cardsMap[code].quantity;
                  } else {
                    assignedCards[code] += count;
                  }
                });
                this.setState({
                  weaknessAssignedCards: assignedCards,
                });
              },
            },
          ],
        );
      }, 50);
    }
  }

  deckAdded(deck) {
    this.setState({
      deckIds: [...this.state.deckIds, deck.id],
    });
    this.maybeShowWeaknessPrompt(deck);
  }

  deckRemoved(id) {
    this.setState({
      deckIds: filter([...this.state.deckIds], deckId => deckId !== id),
    });
  }

  updateNavigationButtons() {
    const {
      componentId,
    } = this.props;
    const {
      name,
      campaignCode,
    } = this.state;
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [{
          text: L('Done'),
          id: 'save',
          showAsAction: 'ifRoom',
          enabled: campaignCode !== CUSTOM || !!name,
        }],
      },
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'save') {
      this._onSave();
    }
  }

  placeholderName() {
    const {
      campaign,
      campaignCode,
    } = this.state;
    if (campaignCode === CUSTOM) {
      return L('(required)');
    }
    return L('My {{cycleName}} Campaign', { cycleName: campaign });
  }

  onSave() {
    const {
      nextId,
      newCampaign,
      componentId,
    } = this.props;
    const {
      name,
      campaignCode,
      difficulty,
      deckIds,
      weaknessPacks,
      weaknessAssignedCards,
    } = this.state;
    // Save to redux.
    newCampaign(
      nextId,
      name || this.placeholderName(),
      campaignCode,
      difficulty,
      deckIds,
      this.getChaosBag(),
      this.getCampaignLog(),
      {
        packCodes: weaknessPacks,
        assignedCards: weaknessAssignedCards,
      }
    );
    Navigation.pop(componentId);
  }

  updateChaosBag(chaosBag) {
    this.setState({
      customChaosBag: chaosBag,
    });
  }

  updateDifficulty(value) {
    this.setState({
      difficulty: value,
    }, this._updateNavigationButtons);
  }

  showChaosBagDialog() {
    const {
      componentId,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag: this.state.customChaosBag,
          updateChaosBag: this._updateChaosBag,
        },
        options: {
          topBar: {
            title: {
              text: L('Chaos Bag'),
            },
            backButton: {
              title: L('Cancel'),
            },
          },
        },
      },
    });
  }

  showDifficultyDialog() {
    Navigation.showOverlay({
      component: {
        name: 'Dialog.CampaignDifficulty',
        passProps: {
          difficulty: this.state.difficulty,
          updateDifficulty: this._updateDifficulty,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  }

  campaignChanged(campaignCode, campaign) {
    this.setState({
      campaign,
      campaignCode,
    }, this._updateNavigationButtons);
  }

  hasDefinedChaosBag() {
    const {
      campaignCode,
      difficulty,
    } = this.state;

    return (
      campaignCode !== CUSTOM &&
      CAMPAIGN_CHAOS_BAGS[campaignCode] &&
      CAMPAIGN_CHAOS_BAGS[campaignCode][DIFFICULTY[difficulty]]
    );
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

  hasDefinedCampaignLog() {
    const {
      campaignCode,
    } = this.state;
    return (campaignCode !== CUSTOM && campaignLogs()[campaignCode]);
  }

  getCampaignLog() {
    const {
      campaignCode,
      customCampaignLog,
    } = this.state;
    if (this.hasDefinedCampaignLog()) {
      return campaignLogs()[campaignCode];
    }
    return customCampaignLog;
  }

  captureViewRef(ref) {
    this.setState({
      viewRef: ref,
    });
  }

  renderChaosBagSection() {
    const chaosBag = this.getChaosBag();
    return (
      <View>
        <Text style={[typography.small, styles.margin]}>
          { L('CHAOS BAG') }
        </Text>
        <View style={[styles.topPadding, styles.margin]}>
          <ChaosBagLine chaosBag={chaosBag} />
        </View>
      </View>
    );
  }

  showCampaignNameDialog() {
    const {
      name,
    } = this.state;
    this.props.showTextEditDialog(
      L('Campaign Name'),
      name,
      this._onNameChange
    );
  }

  renderWeaknessSetSection() {
    const {
      componentId,
    } = this.props;
    return (
      <View style={styles.margin}>
        <Text style={typography.small}>{ L('WEAKNESS SET') }</Text>
        <Text style={typography.small}>
          { L('Include all basic weaknesses from these expansions') }
        </Text>
        <WeaknessSetPackChooserComponent
          componentId={componentId}
          compact
          onSelectedPacksChanged={this._onWeaknessPackChange}
        />
      </View>
    );
  }

  renderCampaignLogSection() {
    const campaignLog = this.getCampaignLog();
    const onPress = this.hasDefinedCampaignLog() ?
      null :
      this._deleteCampaignNoteSection;

    return (
      <View>
        <Text style={[typography.small, styles.margin]}>
          { L('CAMPAIGN LOG') }
        </Text>
        <View style={styles.margin}>
          { map(campaignLog.sections || [], section => (
            <CampaignNoteSectionRow key={section} name={section} onPress={onPress} />
          )) }
          { map(campaignLog.counts || [], section => (
            <CampaignNoteSectionRow key={section} name={section} isCount onPress={onPress} />
          )) }
          { map(campaignLog.investigatorSections || [], section => (
            <CampaignNoteSectionRow key={section} name={section} perInvestigator onPress={onPress} />
          )) }
          { map(campaignLog.investigatorCounts || [], section => (
            <CampaignNoteSectionRow key={section} name={section} perInvestigator isCount onPress={onPress} />
          )) }
        </View>
        { !this.hasDefinedChaosBag() && (
          <View style={[styles.topPadding, styles.button]}>
            <Button title={L('Add Log Section')} onPress={this._toggleCampaignLogDialog} />
          </View>
        ) }
      </View>
    );
  }

  renderCampaignSectionDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      campaignLogDialogVisible,
    } = this.state;
    return (
      <AddCampaignNoteSectionDialog
        viewRef={viewRef}
        visible={campaignLogDialogVisible}
        addSection={this._addCampaignNoteSection}
        toggleVisible={this._toggleCampaignLogDialog}
      />
    );
  }

  render() {
    const {
      componentId,
      captureViewRef,
      nextId,
    } = this.props;

    const {
      deckIds,
      campaignCode,
      name,
      difficulty,
    } = this.state;
    const hasDefinedChaosBag = this.hasDefinedChaosBag();

    return (
      <View>
        <ScrollView
          contentContainerStyle={styles.topPadding}
          ref={captureViewRef}
        >
          <View style={styles.underline}>
            <View style={styles.topPadding}>
              <CampaignSelector
                componentId={componentId}
                campaignChanged={this._campaignChanged}
              />
            </View>
            <View style={[styles.margin, styles.topPadding]}>
              <LabeledTextBox
                column
                label={L('Campaign Name')}
                onPress={this._showCampaignNameDialog}
                placeholder={this.placeholderName()}
                required
                value={name}
              />
            </View>
            <View style={[styles.topPadding, styles.margin]}>
              <LabeledTextBox
                column
                label={L('Difficulty')}
                onPress={this._showDifficultyDialog}
                value={difficultyStrings()[difficulty]}
              />
            </View>
          </View>
          { hasDefinedChaosBag ? (
            <View style={styles.underline}>
              { this.renderChaosBagSection() }
            </View>
          ) : (
            <NavButton onPress={this._showChaosBagDialog}>
              { this.renderChaosBagSection() }
            </NavButton>
          ) }
          <View style={styles.underline}>
            { this.renderWeaknessSetSection() }
          </View>
          <View style={styles.underline}>
            { this.renderCampaignLogSection() }
          </View>
          <View style={styles.underline}>
            <DeckSelector
              label={L('Decks')}
              componentId={componentId}
              campaignId={nextId}
              deckIds={deckIds}
              deckAdded={this._deckAdded}
              deckRemoved={this._deckRemoved}
            />
          </View>
          <View style={styles.button}>
            <Button
              disabled={campaignCode === CUSTOM && !name}
              style={styles.topPadding}
              title={L('Create Campaign')}
              onPress={this._onSave}
            />
          </View>
          <View style={styles.footer} />
        </ScrollView>
        { this.renderCampaignSectionDialog() }
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    nextId: getNextCampaignId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    newCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withWeaknessCards(
    withTextEditDialog(NewCampaignView)
  )
);

const styles = StyleSheet.create({
  topPadding: {
    marginTop: 8,
  },
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
  underline: {
    paddingBottom: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  footer: {
    height: 100,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
