import React from 'react';
import { Button, Text } from 'react-native';
import { flatMap, forEach, keys, map, sortBy } from 'lodash';
import { t } from 'ttag';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Switch from 'components/core/Switch';
import BasicButton from 'components/core/BasicButton';
import ShowDeckButton from './ShowDeckButton';
import { Deck, Slots, NumberChoices } from 'actions/types';
import BasicListRow from 'components/core/BasicListRow';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import CardListWrapper from 'components/card/CardListWrapper';
import CardSectionHeader from 'components/core/CardSectionHeader';
import CardSearchResult from 'components/cardlist/CardSearchResult';
import { showDeckModal, showCard } from 'components/nav/helper';
import InvestigatorRow from 'components/core/InvestigatorRow';
import DeckUpgradeComponent from 'components/deck/DeckUpgradeComponent';
import { DeckChanges } from 'components/deck/actions';
import { BODY_OF_A_YITHIAN } from 'app_constants';
import Card from 'data/Card';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';
import COLORS from 'styles/colors';

interface Props {
  componentId: string;
  id: string;
  fontScale: number;
  campaignState: CampaignStateHelper;
  scenarioState: ScenarioStateHelper;
  investigator: Card;
  deck?: Deck;
  campaignLog: GuidedCampaignLog;
  saveDeckChanges: (deck: Deck, changes: DeckChanges) => Promise<Deck>;
  saveDeckUpgrade: (deck: Deck, xp: number, exileCounts: Slots) => Promise<Deck>;
  setUnsavedEdits: (investigator: string, edits: boolean) => void;
  editable: boolean;
}

interface State {
  xp: number;
  physicalAdjust: number;
  mentalAdjust: number;
  killed: boolean;
  insane: boolean;
}

export default class UpgradeDeckRow extends React.Component<Props, State> {
  deckUpgradeComponent: React.RefObject<DeckUpgradeComponent> = React.createRef<DeckUpgradeComponent>();

  static choiceId(stepId: string, investigator: Card) {
    return `${stepId}#${investigator.code}`;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      xp: props.campaignLog.earnedXp(props.investigator.code),
      physicalAdjust: 0,
      mentalAdjust: 0,
      killed: false,
      insane: false,
    };
  }

  unsavedEdits() {
    const { investigator, campaignLog } = this.props;
    const { xp, physicalAdjust, mentalAdjust, killed, insane } = this.state;
    return physicalAdjust !== 0 ||
      mentalAdjust !== 0 ||
      xp !== campaignLog.earnedXp(investigator.code) ||
      killed ||
      insane;
  }

  _syncUnsavedEdits = () => {
    const { setUnsavedEdits, investigator } = this.props;
    setUnsavedEdits(investigator.code, this.unsavedEdits());
  };

  choiceId() {
    const {
      id,
      investigator,
    } = this.props;
    return UpgradeDeckRow.choiceId(id, investigator);
  }

  _saveCampaignLog = (xp: number, deck?: Deck) => {
    const {
      scenarioState,
      campaignLog,
      investigator,
    } = this.props;
    const {
      physicalAdjust,
      mentalAdjust,
      killed,
      insane,
    } = this.state;
    const choices: NumberChoices = {
      xp: [xp - campaignLog.earnedXp(investigator.code)],
      physical: [physicalAdjust],
      mental: [mentalAdjust],
      killed: [killed ? 1 : 0],
      insane: [insane ? 1 : 0],
    };
    if (deck) {
      choices.deckId = [deck.id];
    }
    scenarioState.setNumberChoices(this.choiceId(), choices);
  };

  xp(choices?: NumberChoices): number {
    const { campaignLog, investigator } = this.props;
    if (choices === undefined) {
      return this.state.xp;
    }
    return campaignLog.earnedXp(investigator.code) +
      ((choices.xp && choices.xp[0]) || 0);
  }

  physicalAdjust(choices?: NumberChoices): number {
    if (choices === undefined) {
      return this.state.physicalAdjust;
    }
    return (choices.physical && choices.physical[0]) || 0;
  }

  mentalAdjust(choices?: NumberChoices): number {
    if (choices === undefined) {
      return this.state.mentalAdjust;
    }
    return (choices.mental && choices.mental[0]) || 0;
  }

  killedAdjust(choices?: NumberChoices): boolean {
    if (choices === undefined) {
      return this.state.killed;
    }
    return !!(choices.killed && choices.killed[0]);
  }

  insaneAdjust(choices?: NumberChoices): boolean {
    if (choices === undefined) {
      return this.state.insane;
    }
    return !!(choices.insane && choices.insane[0]);
  }

  _onUpgrade = (deck: Deck, xp: number) => {
    this._saveCampaignLog(xp, deck);
  };

  _save = () => {
    const { deck } = this.props;
    if (deck) {
      if (this.deckUpgradeComponent.current) {
        this.deckUpgradeComponent.current.save();
      }
    } else {
      this._saveCampaignLog(this.state.xp);
    }
  };

  _showCard = (card: Card) => {
    const { componentId } = this.props;
    showCard(
      componentId,
      card.code,
      card,
      true
    );
  };

  _renderDeltas = (cards: Card[], deltas: Slots) => {
    const { fontScale } = this.props;
    return map(
      sortBy(cards, card => card.name),
      card => (
        <CardSearchResult
          key={card.code}
          onPress={this._showCard}
          card={card}
          count={deltas[card.code]}
          fontScale={fontScale}
          deltaCountMode
          backgroundColor="transparent"
        />
      )
    );
  };

  renderStoryAssetDeltas() {
    const {
      campaignLog,
      investigator,
      fontScale,
    } = this.props;
    const deltas = campaignLog.storyAssetChanges(investigator.code);
    const cards: string[] = flatMap(deltas, (count, code) => count !== 0 ? code : []);
    if (!cards.length) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Campaign cards` }}
          fontScale={fontScale}
        />
        <CardListWrapper codes={cards} type="player">
          { (cards: Card[]) => this._renderDeltas(cards, deltas) }
        </CardListWrapper>
      </>
    );
  }


  _incPhysical = () => {
    this.setState(state => {
      return { physicalAdjust: (state.physicalAdjust || 0) + 1 };
    }, this._syncUnsavedEdits);
  };

  _decPhysical = () => {
    this.setState(state => {
      return {
        physicalAdjust: (state.physicalAdjust || 0) - 1,
      };
    }, this._syncUnsavedEdits);
  };

  _incMental = () => {
    this.setState(state => {
      return { mentalAdjust: (state.mentalAdjust || 0) + 1 };
    }, this._syncUnsavedEdits);
  };

  _decMental = () => {
    this.setState(state => {
      return {
        mentalAdjust: (state.mentalAdjust || 0) - 1,
      };
    }, this._syncUnsavedEdits);
  };

  _incXp = () => {
    this.setState(state => {
      return { xp: (state.xp || 0) + 1 };
    }, this._syncUnsavedEdits);
  };

  _decXp = () => {
    this.setState(state => {
      return { xp: Math.max((state.xp || 0) - 1, 0) };
    }, this._syncUnsavedEdits);
  };

  renderXpSection(choices?: NumberChoices) {
    const { investigator, fontScale, editable } = this.props;
    const xp = this.xp(choices);
    const xpString = xp >= 0 ? `+${xp}` : `${xp}`;
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Experience points` }}
        />
        <BasicListRow>
          <Text style={typography.text}>
            { xpString }
          </Text>
          { choices === undefined && editable && (
            <PlusMinusButtons
              count={this.state.xp}
              onIncrement={this._incXp}
              onDecrement={this._decXp}
            />
          ) }
        </BasicListRow>
      </>
    );
  }

  _toggleKilled = () => {
    this.setState(state => {
      return {
        killed: !state.killed,
      };
    });
  };

  _toggleInsane = () => {
    this.setState(state => {
      return {
        insane: !state.insane,
      };
    });
  };

  renderTraumaDetails(choices?: NumberChoices) {
    const {
      investigator,
      campaignLog,
      editable,
      fontScale,
    } = this.props;
    const physicalAdjust = this.physicalAdjust(choices);
    const mentalAdjust = this.mentalAdjust(choices);
    const killedAdjust = this.killedAdjust(choices);
    const insaneAdjust = this.insaneAdjust(choices);

    const baseTrauma = campaignLog.baseTrauma(investigator.code);
    const traumaDelta = campaignLog.traumaChanges(investigator.code);
    const physical = (traumaDelta.physical || 0) + physicalAdjust;
    const mental = (traumaDelta.mental || 0) + mentalAdjust;
    const totalPhysical = (baseTrauma.physical || 0) + physical;
    const totalMental = (baseTrauma.mental || 0) + mental;

    const physicalDeltaString = physical >= 0 ? `+${physical}` : `${physical}`;
    const mentalDeltaString = mental >= 0 ? `+${mental}` : `${mental}`;
    const locked = (choices !== undefined) || !editable;
    return (
      <>
        { (!locked || physical !== 0 || mental !== 0 || killedAdjust || insaneAdjust) && (
          <CardSectionHeader
            investigator={investigator}
            fontScale={fontScale}
            section={{ superTitle: t`Trauma` }}
          />
        ) }
        { (!locked || physical !== 0) && (
          <>
            <CardSectionHeader
              investigator={investigator}
              fontScale={fontScale}
              section={{ subTitle: t`Physical` }}
            />
            <BasicListRow>
              <Text style={[typography.text]}>
                { physicalDeltaString }
                { !locked && (
                  <Text style={[typography.text, { color: COLORS.lightText }]}>
                    { t` (New Total: ${totalPhysical})` }
                  </Text>
                ) }
              </Text>
              { !locked && (
                <PlusMinusButtons
                  count={totalPhysical}
                  onIncrement={this._incPhysical}
                  onDecrement={this._decPhysical}
                  max={investigator.health || 0}
                  disabled={this.state.killed || this.state.insane}
                />
              ) }
            </BasicListRow>
          </>
        ) }
        { (!locked || killedAdjust) && (
          <BasicListRow>
            <Text style={[typography.text]}>
              { t`Killed` }
            </Text>
            { !locked ? (
              <Switch
                value={this.state.killed}
                onValueChange={this._toggleKilled}
                disabled={this.state.insane}
              />
            ) : (
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={'#222'}
              />
            ) }
          </BasicListRow>
        ) }
        { (!locked || mental !== 0) && (
          <>
            <CardSectionHeader
              investigator={investigator}
              fontScale={fontScale}
              section={{ subTitle: t`Mental` }}
            />
            <BasicListRow>
              <Text style={typography.text}>
                { mentalDeltaString }
                { !locked && (
                  <Text style={[typography.text, { color: COLORS.lightText }]}>
                    { t` (New Total: ${totalMental})` }
                  </Text>
                ) }
              </Text>
              { !locked && (
                <PlusMinusButtons
                  count={totalMental}
                  onIncrement={this._incMental}
                  onDecrement={this._decMental}
                  max={(investigator.sanity || 0)}
                  disabled={this.state.killed || this.state.insane}
                />
              ) }
            </BasicListRow>
          </>
        ) }
        { (!locked || insaneAdjust) && (
          <BasicListRow>
            <Text style={[typography.text]}>
              { t`Insane` }
            </Text>
            { !locked ? (
              <Switch
                value={this.state.insane}
                onValueChange={this._toggleInsane}
                disabled={this.state.killed}
              />
            ) : (
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={'#222'}
              />
            ) }
          </BasicListRow>
        ) }
      </>
    );
  }

  renderSaveButton(choices?: NumberChoices, deck?: Deck) {
    const { editable } = this.props;
    if (choices !== undefined || !editable) {
      return null;
    }
    if (deck) {
      return (
        <BasicButton
          title={t`Save deck upgrade`}
          onPress={this._save}
        />
      );
    }
    if (!this.unsavedEdits()) {
      return null;
    }
    return (
      <BasicButton
        title={t`Save adjustments`}
        onPress={this._save}
      />
    );
  }

  renderCampaignSection(choices?: NumberChoices, deck?: Deck) {
    return (
      <>
        { (choices !== undefined || !deck) && this.renderXpSection(choices) }
        { this.renderTraumaDetails(choices) }
        { this.renderStoryAssetDeltas() }
        { this.renderSaveButton(choices, deck) }
      </>
    );
  }

  _selectDeck = () => {
    const {
      campaignState,
      investigator,
    } = this.props;
    campaignState.showChooseDeck(investigator);
  };

  _viewDeck = () => {
    const {
      componentId,
      investigator,
      deck,
    } = this.props;
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        investigator,
        undefined,
        true
      );
    }
  };

  deckButton(choices?: NumberChoices) {
    const {
      componentId,
      deck,
      editable,
      investigator,
    } = this.props;
    if (deck && choices !== undefined && choices.deckId) {
      return (
        <ShowDeckButton
          componentId={componentId}
          deckId={choices.deckId[0]}
          investigator={investigator}
        />
      );
    }
    if (!editable) {
      return null;
    }
    if (!deck) {
      return (
        <Button title={t`Select deck`} onPress={this._selectDeck} />
      );
    }
    return (
      <Button title={t`View deck`} onPress={this._viewDeck} />
    );
  }

  computeStoryCountsForDeck(
    deck: Deck,
    storyAssets: Slots,
    storyDeltas: Slots
  ) {
    const newSlots: Slots = {};
    forEach(keys(storyAssets), code => {
      const delta = storyDeltas[code];
      if (delta) {
        newSlots[code] = (deck.slots[code] || 0) + delta;
      } else {
        newSlots[code] = (deck.slots[code] || 0);
      }
      if (newSlots[code] < 0) {
        newSlots[code] = 0;
      }
    });
    forEach(storyDeltas, (delta, code) => {
      if (storyAssets[code] === undefined) {
        if (delta) {
          newSlots[code] = (deck.slots[code] || 0) + delta;
        }
      }
    });
    return newSlots;
  }

  renderDetails(choices?: NumberChoices) {
    const {
      componentId,
      deck,
      investigator,
      campaignLog,
      saveDeckChanges,
      saveDeckUpgrade,
      editable,
      fontScale,
    } = this.props;
    if (!deck) {
      return (this.renderCampaignSection(choices));
    }
    if (choices !== undefined || !editable) {
      return this.renderCampaignSection(choices, deck);
    }
    return (
      <DeckUpgradeComponent
        componentId={componentId}
        ref={this.deckUpgradeComponent}
        deck={deck}
        fontScale={fontScale}
        investigator={investigator}
        campaignSection={this.renderCampaignSection(choices, deck)}
        startingXp={campaignLog.earnedXp(investigator.code)}
        storyCounts={this.computeStoryCountsForDeck(
          deck,
          campaignLog.storyAssets(investigator.code),
          campaignLog.storyAssetChanges(investigator.code)
        )}
        ignoreStoryCounts={campaignLog.ignoreStoryAssets(investigator.code)}
        upgradeCompleted={this._onUpgrade}
        saveDeckChanges={saveDeckChanges}
        saveDeckUpgrade={saveDeckUpgrade}
      />
    );
  }

  render() {
    const {
      investigator,
      campaignLog,
    } = this.props;
    const choices = this.props.scenarioState.numberChoices(this.choiceId());
    const isYithian = (campaignLog.storyAssets(investigator.code)[BODY_OF_A_YITHIAN] || 0) > 0;
    return (
      <InvestigatorRow
        investigator={investigator}
        yithian={isYithian}
        button={this.deckButton(choices)}
      >
        { this.renderDetails(choices) }
      </InvestigatorRow>
    );
  }
}
