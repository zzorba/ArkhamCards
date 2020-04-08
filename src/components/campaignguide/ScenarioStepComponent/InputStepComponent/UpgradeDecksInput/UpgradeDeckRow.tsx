import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { flatMap, map, sortBy } from 'lodash';
import { t } from 'ttag';

import PlusMinusButtons from 'components/core/PlusMinusButtons';
import CardListWrapper from 'components/campaignguide/CardListWrapper';
import CardSectionHeader from 'components/core/CardSectionHeader';
import CardSearchResult from 'components/cardlist/CardSearchResult';
import { showDeckModal, showCard } from 'components/nav/helper';
import InvestigatorRow from 'components/core/InvestigatorRow';
import { Deck, Slots } from 'actions/types';
import DeckUpgradeComponent from 'components/deck/DeckUpgradeComponent';
import { DeckChanges } from 'components/deck/actions';
import Card from 'data/Card';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

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
  editable: boolean;
}

interface State {
  xp: number;
  physicalAdjust: number;
  mentalAdjust: number;
}

export default class UpgradeDeckRow extends React.Component<Props, State> {
  deckUpgradeComponent: React.RefObject<DeckUpgradeComponent> = React.createRef<DeckUpgradeComponent>();
  constructor(props: Props) {
    super(props);

    this.state = {
      xp: props.campaignLog.earnedXp(props.investigator.code),
      physicalAdjust: 0,
      mentalAdjust: 0,
    };
  }

  choiceId() {
    const {
      id,
      investigator,
    } = this.props;
    return `${id}#${investigator.code}`;
  }

  _onUpgrade = (deck: Deck) => {
    const {
      scenarioState,
    } = this.props;
    scenarioState.setChoice(
      this.choiceId(),
      deck.id
    );
  };

  _save = () => {
    if (this.deckUpgradeComponent.current) {
      this.deckUpgradeComponent.current.save();
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
          section={{ superTitle: t`Story cards` }}
          fontScale={fontScale}
        />
        <CardListWrapper
          cards={cards}
          render={this._renderDeltas}
          extraArg={deltas}
        />
      </>
    );
  }


  _incPhysical = () => {
    this.setState(state => {
      return { physicalAdjust: (state.physicalAdjust || 0) + 1 };
    });
  };

  _decPhysical = () => {
    this.setState(state => {
      return { physicalAdjust: Math.max((state.physicalAdjust || 0) - 1, 0) };
    });
  };

  _incMental = () => {
    this.setState(state => {
      return { mentalAdjust: (state.mentalAdjust || 0) + 1 };
    });
  };

  _decMental = () => {
    this.setState(state => {
      return { mentalAdjust: Math.max((state.mentalAdjust || 0) - 1, 0) };
    });
  };

  _incXp = () => {
    this.setState(state => {
      return { xp: (state.xp || 0) + 1 };
    });
  };

  _decXp = () => {
    this.setState(state => {
      return { xp: Math.max((state.xp || 0) - 1, 0) };
    });
  };

  renderXpSection() {
    const { investigator, fontScale } = this.props;
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Experience points` }}
        />
        <View style={[styles.labeledRow, styles.border]}>
          <View style={styles.row}>
            <Text style={typography.text}>
              { this.state.xp }
            </Text>
            <PlusMinusButtons
              count={this.state.xp}
              onIncrement={this._incXp}
              onDecrement={this._decXp}
            />
          </View>
        </View>
      </>
    );
  }

  renderTraumaDetails() {
    const { investigator, campaignLog, fontScale } = this.props;
    const { physicalAdjust, mentalAdjust } = this.state;
    const traumaDelta = campaignLog.traumaChanges(investigator.code);
    const physical = (traumaDelta.physical || 0) + physicalAdjust;
    const mental = (traumaDelta.mental || 0) + mentalAdjust;
    const physicalString = physical >= 0 ? `+${physical}` : `${physical}`;
    const mentalString = mental >= 0 ? `+${mental}` : `${mental}`;
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Trauma` }}
        />
        <View style={[styles.labeledRow, styles.border]}>
          <View style={styles.row}>
            <Text style={typography.text}>
              { t`Physical: ${physicalString}` }
            </Text>
            <PlusMinusButtons
              count={this.state.physicalAdjust + (traumaDelta.physical || 0)}
              onIncrement={this._incPhysical}
              onDecrement={this._decPhysical}
              allowNegative
            />
          </View>
        </View>
        <View style={[styles.labeledRow, styles.border]}>
          <View style={styles.row}>
            <Text style={typography.text}>
              { t`Mental: ${mentalString}` }
            </Text>
            <PlusMinusButtons
              count={this.state.mentalAdjust + (traumaDelta.mental || 0)}
              onIncrement={this._incMental}
              onDecrement={this._decMental}
              allowNegative
            />
          </View>
        </View>
      </>
    );
  }

  renderCampaignSection(hasDeck: boolean) {
    return (
      <>
        { !hasDeck && this.renderXpSection() }
        { this.renderTraumaDetails() }
        { this.renderStoryAssetDeltas() }
        { hasDeck && (
          <View style={styles.buttonWrapper}>
            <Button
              title={t`Save upgrade`}
              onPress={this._save}
            />
          </View>
        ) }
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

  saved() {
    const { scenarioState } = this.props;
    return scenarioState.choice(this.choiceId()) !== undefined;
  }

  deckButton(saved: boolean) {
    const {
      deck,
      editable,
    } = this.props;
    if (saved || !editable) {
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

  renderDetails(saved: boolean) {
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
      return (this.renderCampaignSection(false));
    }
    if (saved) {
      return (
        <View style={styles.message}>
          <Text style={[typography.text, typography.center]}>
            { t`Deck upgrade saved` }
          </Text>
        </View>
      );
    }
    if (!editable) {
      return (
        <View style={styles.message}>
          <Text style={[typography.text, typography.center]}>
            { t`Deck upgrade skipped` }
          </Text>
        </View>
      );
    }
    return (
      <DeckUpgradeComponent
        componentId={componentId}
        ref={this.deckUpgradeComponent}
        deck={deck}
        fontScale={fontScale}
        investigator={investigator}
        campaignSection={this.renderCampaignSection(true)}
        startingXp={campaignLog.earnedXp(investigator.code)}
        storyCounts={campaignLog.storyAssets(investigator.code)}
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
    } = this.props;
    const saved = this.saved();
    return (
      <InvestigatorRow
        investigator={investigator}
        button={this.deckButton(saved)}
        detail={this.renderDetails(saved)}
      />
    );
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    padding: 8,
  },
  message: {
    padding: 16,
  },
  labeledRow: {
    flexDirection: 'column',
    padding: 8,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#bdbdbd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
