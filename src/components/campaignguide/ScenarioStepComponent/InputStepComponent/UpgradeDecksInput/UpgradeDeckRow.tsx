import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { keys, map, sortBy } from 'lodash';
import { t } from 'ttag';

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

export default class UpgradeDeckRow extends React.Component<Props> {
  deckUpgradeComponent: React.RefObject<DeckUpgradeComponent> = React.createRef<DeckUpgradeComponent>();

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
    if (keys(deltas).length === 0) {
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
          cards={keys(deltas)}
          render={this._renderDeltas}
          extraArg={deltas}
        />
      </>
    );
  }

  renderCampaignSection() {
    // Render the story assets changes.
    return (
      <>
        { this.renderStoryAssetDeltas() }
        <View style={styles.buttonWrapper}>
          <Button
            title={t`Save upgrade`}
            onPress={this._save}
          />
        </View>
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
      return null;
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
        campaignSection={this.renderCampaignSection()}
        startingXp={campaignLog.earnedXp(investigator.code)}
        storyCounts={campaignLog.storyAssets(investigator.code)}
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
});
