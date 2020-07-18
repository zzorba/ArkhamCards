import React from 'react';
import { filter, forEach, keys, map, sumBy, throttle } from 'lodash';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { SettingsSwitch } from 'react-native-settings-components';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import PickerStyleButton from '@components/core/PickerStyleButton';
import EditText from '@components/core/EditText';
import {
  CORE,
  CUSTOM,
  TDE,
  TDEA,
  TDEB,
  CampaignCycleCode,
  CampaignDifficulty,
  CustomCampaignLog,
  Deck,
  Slots,
  WeaknessSet,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import CampaignSelector from './CampaignSelector';
import CampaignNoteSectionRow from './CampaignNoteSectionRow';
import {
  getCampaignLog,
  getChaosBag,
  difficultyString,
} from '../constants';
import AddCampaignNoteSectionDialog from '../AddCampaignNoteSectionDialog';
import NavButton from '@components/core/NavButton';
import ChaosBagLine from '@components/core/ChaosBagLine';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import DeckSelector from './DeckSelector';
import WeaknessSetPackChooserComponent from '@components/weakness/WeaknessSetPackChooserComponent';
import { getNextCampaignId, AppState } from '@reducers';
import { newCampaign, newLinkedCampaign } from '@components/campaign/actions';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/Card';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
import space, { m, s } from '@styles/space';

type OwnProps = NavigationProps & PlayerCardProps & InjectedDialogProps;

interface ReduxProps {
  nextId: number;
}

interface ReduxActionProps {
  newCampaign: (
    id: number,
    name: string,
    pack_code: CampaignCycleCode,
    difficulty: CampaignDifficulty | undefined,
    deckIds: number[],
    investigatorIds: string[],
    chaosBag: ChaosBag,
    campaignLog: CustomCampaignLog,
    weaknessSet: WeaknessSet,
    guided: boolean
  ) => void;
  newLinkedCampaign: (
    id: number,
    name: string,
    cycleCode: CampaignCycleCode,
    cycleCodeA: CampaignCycleCode,
    cycleCodeB: CampaignCycleCode,
    weaknessSet: WeaknessSet
  ) => void;
}

type Props = OwnProps &
  ReduxProps &
  ReduxActionProps &
  DimensionsProps;

interface State {
  hasGuide: boolean;
  guided: boolean;
  name: string;
  campaign: string;
  campaignCode: CampaignCycleCode;
  difficulty: CampaignDifficulty;
  deckIds: number[];
  investigatorIds: string[];
  investigatorToDeck: {
     [code: string]: number;
  };
  weaknessPacks: string[];
  weaknessAssignedCards: Slots;
  customChaosBag: ChaosBag;
  customCampaignLog: CustomCampaignLog;
  campaignLogDialogVisible: boolean;
}

class NewCampaignView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`New Campaign`,
        },
      },
    };
  }

  _navEventListener?: EventSubscription;
  _onSave!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      campaign: '',
      guided: true,
      hasGuide: true,
      campaignCode: CORE,
      difficulty: CampaignDifficulty.STANDARD,
      deckIds: [],
      investigatorIds: [],
      investigatorToDeck: {},
      weaknessPacks: [],
      weaknessAssignedCards: {},
      customChaosBag: Object.assign({}, getChaosBag(CORE, CampaignDifficulty.STANDARD)),
      customCampaignLog: { sections: [t`Campaign Notes`] },
      campaignLogDialogVisible: false,
    };

    this._updateNavigationButtons();
    this._navEventListener = Navigation.events().bindComponent(this);

    this._onSave = throttle(this.onSave.bind(this), 200);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _onWeaknessPackChange = (packs: string[]) => {
    this.setState({
      weaknessPacks: packs,
    });
  };

  static getKeyName(
    isCount?: boolean,
    perInvestigator?: boolean
  ): keyof CustomCampaignLog {
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

  _addCampaignNoteSection = (
    name: string,
    isCount?: boolean,
    perInvestigator?: boolean
  ) => {
    const customCampaignLog = Object.assign({}, this.state.customCampaignLog);
    const keyName: keyof CustomCampaignLog = NewCampaignView.getKeyName(isCount, perInvestigator);
    customCampaignLog[keyName] = [
      ...(customCampaignLog[keyName] || []),
      name,
    ];
    this.setState({
      customCampaignLog,
    });
  };

  _deleteCampaignNoteSection = (
    name: string,
    isCount?: boolean,
    perInvestigator?: boolean
  ) => {
    const customCampaignLog = Object.assign({}, this.state.customCampaignLog);
    const keyName = NewCampaignView.getKeyName(isCount, perInvestigator);
    customCampaignLog[keyName] = filter(
      customCampaignLog[keyName] || [],
      sectionName => name !== sectionName);

    this.setState({
      customCampaignLog,
    });
  };

  _toggleCampaignLogDialog = () => {
    this.setState({
      campaignLogDialogVisible: !this.state.campaignLogDialogVisible,
    });
  };

  _onNameChange = (name: string) => {
    this.setState({
      name: name,
    }, this._updateNavigationButtons);
  };

  maybeShowWeaknessPrompt(deck: Deck) {
    const {
      cards,
    } = this.props;
    const weaknesses = filter(keys(deck.slots), code => {
      const card = cards[code];
      return card && card.isBasicWeakness();
    });
    const count = sumBy(weaknesses, code => deck.slots[code]);
    if (weaknesses.length) {
      setTimeout(() => {
        Alert.alert(
          t`Adjust Weakness Set`,
          /* eslint-disable prefer-template */
          (count > 1 ?
            t`This deck contains several basic weaknesses` :
            t`This deck contains a basic weakness`) +
          '\n\n' +
          map(weaknesses, code => `${deck.slots[code]}x - ${cards[code].name}`).join('\n') +
          '\n\n' +
          (count > 1 ?
            t`Do you want to remove them from the campaign’s Basic Weakness set?` :
            t`Do you want to remove it from the campaign’s Basic Weakness set?`),
          [
            { text: t`Not Now`, style: 'cancel' },
            {
              text: t`Okay`,
              style: 'default',
              onPress: () => {
                const {
                  weaknessAssignedCards,
                } = this.state;
                const assignedCards = { ...weaknessAssignedCards };
                forEach(weaknesses, code => {
                  const count = deck.slots[code];
                  if (!(code in assignedCards)) {
                    assignedCards[code] = 0;
                  }
                  if ((assignedCards[code] + count) > (cards[code].quantity || 0)) {
                    assignedCards[code] = cards[code].quantity || 0;
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

  _investigatorAdded = (card: Card) => {
    this.setState({
      investigatorIds: [...this.state.investigatorIds, card.code],
    });
  };

  _investigatorRemoved = (card: Card) => {
    this.setState({
      investigatorIds: filter(this.state.investigatorIds, id => id !== card.code),
    });
  };

  _deckAdded = (deck: Deck) => {
    this.setState({
      deckIds: [...this.state.deckIds, deck.id],
      investigatorIds: [...this.state.investigatorIds, deck.investigator_code],
      investigatorToDeck: {
        ...this.state.investigatorToDeck,
        [deck.investigator_code]: deck.id,
      },
    });
    this.maybeShowWeaknessPrompt(deck);
  };

  _deckRemoved = (
    id: number,
    deck?: Deck
  ) => {
    const investigatorToDeck: { [code: string]: number } = {};
    forEach(this.state.investigatorToDeck, (deckId, code) => {
      if (deckId !== id) {
        investigatorToDeck[code] = deckId;
      }
    });
    this.setState({
      deckIds: filter([...this.state.deckIds], deckId => deckId !== id),
      investigatorIds: !deck ? this.state.investigatorIds : filter([...this.state.investigatorIds], code => deck.investigator_code !== code),
      investigatorToDeck,
    });
  };

  _updateNavigationButtons = () => {
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
          text: t`Done`,
          id: 'save',
          enabled: campaignCode !== CUSTOM || !!name,
          color: COLORS.navButton,
          testID: t`Done`,
        }],
      },
    });
  };

  navigationButtonPressed({ buttonId }: { buttonId: string}) {
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
      return t`(required)`;
    }
    return t`My ${campaign} Campaign`;
  }

  onSave() {
    const {
      nextId,
      newCampaign,
      newLinkedCampaign,
      componentId,
    } = this.props;
    const {
      name,
      campaignCode,
      difficulty,
      deckIds,
      investigatorIds,
      weaknessPacks,
      weaknessAssignedCards,
    } = this.state;
    const guided = this.isGuided();
    if (campaignCode === TDE) {
      newLinkedCampaign(
        nextId,
        name || this.placeholderName(),
        TDE,
        TDEA,
        TDEB,
        {
          packCodes: weaknessPacks,
          assignedCards: weaknessAssignedCards,
        }
      );
      Navigation.pop(componentId);
      return;
    }
    // Save to redux.
    newCampaign(
      nextId,
      name || this.placeholderName(),
      campaignCode,
      guided ? undefined : difficulty,
      deckIds,
      investigatorIds,
      this.getChaosBag(),
      this.getCampaignLog(),
      {
        packCodes: weaknessPacks,
        assignedCards: weaknessAssignedCards,
      },
      guided
    );
    Navigation.pop(componentId);
  }

  _updateChaosBag = (chaosBag: ChaosBag) => {
    this.setState({
      customChaosBag: chaosBag,
    });
  };

  _updateDifficulty = (value: CampaignDifficulty) => {
    this.setState({
      difficulty: value,
    }, this._updateNavigationButtons);
  };

  _showChaosBagDialog = () => {
    const {
      componentId,
    } = this.props;
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag: this.state.customChaosBag,
          updateChaosBag: this._updateChaosBag,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    });
  };

  _showDifficultyDialog = () => {
    Navigation.showOverlay({
      component: {
        name: 'Dialog.CampaignDifficulty',
        passProps: {
          difficulty: this.state.difficulty,
          updateDifficulty: this._updateDifficulty,
        },
      },
    });
  };

  _campaignChanged = (campaignCode: CampaignCycleCode, campaign: string, hasGuide: boolean) => {
    this.setState({
      campaign,
      campaignCode,
      hasGuide,
    }, this._updateNavigationButtons);
  };

  hasDefinedChaosBag(): boolean {
    const {
      campaignCode,
      difficulty,
    } = this.state;

    return campaignCode !== CUSTOM && !!getChaosBag(campaignCode, difficulty);
  }

  getChaosBag(): ChaosBag {
    const {
      campaignCode,
      difficulty,
      customChaosBag,
    } = this.state;
    if (this.hasDefinedChaosBag()) {
      return getChaosBag(campaignCode, difficulty);
    }

    return customChaosBag;
  }

  hasDefinedCampaignLog(): boolean {
    const {
      campaignCode,
    } = this.state;
    return (campaignCode !== CUSTOM && !!getCampaignLog(campaignCode));
  }

  getCampaignLog() {
    const {
      campaignCode,
      customCampaignLog,
    } = this.state;
    if (this.hasDefinedCampaignLog()) {
      return getCampaignLog(campaignCode);
    }
    return customCampaignLog;
  }

  renderChaosBagSection() {
    const { fontScale } = this.props;
    const chaosBag = this.getChaosBag();
    return (
      <View style={styles.block}>
        <Text style={typography.mediumGameFont}>
          { t`Chaos Bag` }
        </Text>
        <View style={space.marginTopS}>
          <ChaosBagLine fontScale={fontScale} chaosBag={chaosBag} />
        </View>
      </View>
    );
  }

  _showCampaignNameDialog = () => {
    const {
      name,
    } = this.state;
    this.props.showTextEditDialog(
      t`Campaign Name`,
      name,
      this._onNameChange
    );
  };

  renderWeaknessSetSection() {
    const {
      componentId,
      fontScale,
    } = this.props;
    return (
      <View style={[space.paddingBottomS, styles.underline]}>
        <View style={styles.block}>
          <Text style={typography.mediumGameFont}>
            { t`Weakness Set` }
          </Text>
          <Text style={typography.label}>
            { t`Include all basic weaknesses from these expansions` }
          </Text>
        </View>
        <View style={[space.paddingXs, space.paddingRightS]}>
          <WeaknessSetPackChooserComponent
            componentId={componentId}
            fontScale={fontScale}
            compact
            onSelectedPacksChanged={this._onWeaknessPackChange}
          />
        </View>
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

  renderChaosBag() {
    const { fontScale } = this.props;
    const { guided } = this.state;
    if (guided) {
      return null;
    }
    const hasDefinedChaosBag = this.hasDefinedChaosBag();
    return hasDefinedChaosBag ? (
      <View style={styles.underline}>
        { this.renderChaosBagSection() }
      </View>
    ) : (
      <NavButton fontScale={fontScale} onPress={this._showChaosBagDialog} color={COLORS.black}>
        { this.renderChaosBagSection() }
      </NavButton>
    );
  }

  renderCampaignLogSection() {
    if (this.isGuided()) {
      return null;
    }
    const campaignLog = this.getCampaignLog();
    const onPress = this.hasDefinedCampaignLog() ?
      undefined :
      this._deleteCampaignNoteSection;
    return (
      <View style={styles.underline}>
        <View style={styles.block}>
          <Text style={typography.mediumGameFont}>
            { t`Campaign Log` }
          </Text>
        </View>
        { map(campaignLog.sections || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            onPress={onPress}
          />
        )) }
        { map(campaignLog.counts || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            isCount
            onPress={onPress}
          />
        )) }
        { map(campaignLog.investigatorSections || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            perInvestigator
            onPress={onPress}
          />
        )) }
        { map(campaignLog.investigatorCounts || [], section => (
          <CampaignNoteSectionRow
            key={section}
            name={section}
            perInvestigator
            isCount
            onPress={onPress}
          />
        )) }
        { !this.hasDefinedChaosBag() && (
          <View style={space.marginTopS}>
            <BasicButton title={t`Add Log Section`} onPress={this._toggleCampaignLogDialog} />
          </View>
        ) }
      </View>
    );
  }

  _toggleGuided = () =>{
    this.setState(state => {
      return {
        guided: !state.guided,
      };
    });
  };

  isGuided() {
    const { guided, hasGuide } = this.state;
    return hasGuide && guided;
  }

  render() {
    const {
      componentId,
      captureViewRef,
      nextId,
      fontScale,
    } = this.props;

    const {
      guided,
      deckIds,
      investigatorIds,
      investigatorToDeck,
      campaignCode,
      name,
      difficulty,
      hasGuide,
    } = this.state;

    return (
      <View ref={captureViewRef}>
        <ScrollView contentContainerStyle={styles.container}>
          <CampaignSelector
            componentId={componentId}
            campaignChanged={this._campaignChanged}
          />
          <EditText
            title={t`Name`}
            placeholder={this.placeholderName()}
            onValueChange={this._onNameChange}
            value={name}
          />
          { hasGuide && (
            <SettingsSwitch
              title={t`Guided Campaign`}
              titleStyle={typography.mediumGameFont}
              containerStyle={styles.switch}
              descriptionStyle={typography.label}
              description={guided ? t`Use app for scenario setup & resolutions` : t`Track campaign log and resolutions manually`}
              onValueChange={this._toggleGuided}
              value={guided}
            />
          ) }
          { !this.isGuided() && (
            <PickerStyleButton
              title={t`Difficulty`}
              id="difficulty"
              onPress={this._showDifficultyDialog}
              value={difficultyString(difficulty)}
              widget="nav"
            />
          ) }
          { this.renderChaosBag() }
          { this.renderCampaignLogSection() }
          { campaignCode !== TDE && (
            <View style={styles.underline}>
              <View style={styles.block}>
                <Text style={typography.mediumGameFont}>
                  { t`Investigators` }
                </Text>
              </View>
              <DeckSelector
                componentId={componentId}
                fontScale={fontScale}
                campaignId={nextId}
                deckIds={deckIds}
                investigatorIds={filter(investigatorIds, code => !investigatorToDeck[code])}
                deckAdded={this._deckAdded}
                deckRemoved={this._deckRemoved}
                investigatorAdded={guided ? this._investigatorAdded : undefined}
                investigatorRemoved={guided ? this._investigatorRemoved : undefined}
              />
            </View>
          ) }
          { this.renderWeaknessSetSection() }
          <BasicButton
            disabled={campaignCode === CUSTOM && !name}
            title={t`Create Campaign`}
            onPress={this._onSave}
          />
          <View style={styles.footer}>
            { this.isGuided() && (
              <View style={styles.block}>
                <Text style={typography.label}>
                  { t`If you encounter any problems with the campaign guide system, please let me know at arkhamcards@gmail.com.` }
                </Text>
              </View>
            ) }
          </View>
        </ScrollView>
        { this.renderCampaignSectionDialog() }
      </View>
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  return {
    nextId: getNextCampaignId(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    newCampaign,
    newLinkedCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withPlayerCards(
    withDialogs(
      withDimensions(NewCampaignView)
    )
  )
);

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  footer: {
    minHeight: 100,
  },
  switch: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.background,
    paddingTop: s,
    paddingBottom: s,
  },
  block: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
  },
  container: {
    backgroundColor: COLORS.background,
  },
});
