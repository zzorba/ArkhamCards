import React from 'react';
import { Button, Text, View } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import PlusMinusButtons from 'components/core/PlusMinusButtons';
import DeckXpSection from './DeckXpSection';
import BasicListRow from 'components/core/BasicListRow';
import { showCard, showDeckModal } from 'components/nav/helper';
import CardSearchResult from 'components/cardlist/CardSearchResult';
import { Deck, TraumaAndCardData } from 'actions/types';
import CardSectionHeader from 'components/core/CardSectionHeader';
import InvestigatorRow from 'components/core/InvestigatorRow';
import Card, { CardsMap } from 'data/Card';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import SingleCardWrapper from '../../SingleCardWrapper';
import typography from 'styles/typography';
import space from 'styles/space';

interface Props {
  componentId: string;
  campaignId: number;
  campaignLog: GuidedCampaignLog;
  investigator: Card;
  spentXp: number;
  incSpentXp: (code: string) => void;
  decSpentXp: (code: string) => void;
  traumaAndCardData: TraumaAndCardData;
  fontScale: number;
  playerCards: CardsMap;
  chooseDeckForInvestigator?: (investigator: Card) => void;
  deck?: Deck;
}

export default class InvestigatorCampaignRow extends React.Component<Props> {
  _onCardPress = (card: Card) => {
    const { componentId } = this.props;
    showCard(componentId, card.code, card, true);
  };

  _renderStoryAsset = (card: Card) => {
    const {
      fontScale,
    } = this.props;
    return (
      <CardSearchResult
        key={card.code}
        onPress={this._onCardPress}
        card={card}
        fontScale={fontScale}
      />
    );
  };

  _incXp = () => {
    const { investigator, incSpentXp } = this.props;
    incSpentXp(investigator.code);
  };

  _decXp = () => {
    const { investigator, decSpentXp } = this.props;
    decSpentXp(investigator.code);
  };

  renderXp() {
    const {
      investigator,
      fontScale,
      componentId,
      deck,
      playerCards,
      campaignLog,
      spentXp,
    } = this.props;
    if (deck) {
      return (
        <DeckXpSection
          componentId={componentId}
          deck={deck}
          cards={playerCards}
          investigator={investigator}
          fontScale={fontScale}
        />
      );
    }
    const xp = campaignLog.totalXp(investigator.code);
    if (xp === 0) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          fontScale={fontScale}
          investigator={investigator}
          section={{ superTitle: t`Experience points` }}
        />
        <BasicListRow>
          <Text style={typography.text}>
            { t`${spentXp} of ${xp} spent` }
          </Text>
          <PlusMinusButtons
            count={spentXp}
            max={xp}
            onIncrement={this._incXp}
            onDecrement={this._decXp}
          />
        </BasicListRow>
      </>
    );
  }

  renderTrauma() {
    const { traumaAndCardData, investigator } = this.props;
    return (
      <View style={[
        space.paddingS,
        space.paddingLeftM,
      ]}>
        <Text style={typography.text}>
          { investigator.traumaString(traumaAndCardData) }
        </Text>
      </View>
    );
  }

  renderStoryAssets() {
    const { traumaAndCardData, investigator, fontScale } = this.props;
    const storyAssets = traumaAndCardData.storyAssets || [];
    if (!storyAssets.length) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Campaign cards` }}
        />
        { map(storyAssets, asset => (
          <SingleCardWrapper
            key={asset}
            code={asset}
            render={this._renderStoryAsset}
            extraArg={undefined}
          />
        )) }
      </>
    );
  }

  renderDetail() {
    const {
      investigator,
      fontScale,
    } = this.props;
    return (
      <>
        { this.renderXp() }
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Trauma` }}
        />
        { this.renderTrauma() }
        { this.renderStoryAssets() }
      </>
    );
  }

  _viewDeck = () => {
    const {
      campaignId,
      componentId,
      investigator,
      deck,
    } = this.props;
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        investigator,
        campaignId,
        true
      );
    }
  };

  _selectDeck = () => {
    const {
      investigator,
      chooseDeckForInvestigator,
    } = this.props;
    chooseDeckForInvestigator && chooseDeckForInvestigator(investigator);
  };

  renderButton() {
    const {
      deck,
      chooseDeckForInvestigator,
    } = this.props;
    if (deck) {
      return (
        <Button
          title={t`View Deck`}
          onPress={this._viewDeck}
        />
      );
    }
    if (!chooseDeckForInvestigator) {
      return <View />;
    }
    return (
      <Button
        title={t`Select Deck`}
        onPress={this._selectDeck}
      />
    );
  }

  render() {
    const {
      investigator,
      traumaAndCardData,
    } = this.props;
    const eliminated = investigator.eliminated(traumaAndCardData);
    return (
      <InvestigatorRow
        investigator={investigator}
        description={eliminated ? investigator.traumaString(traumaAndCardData) : undefined}
        button={this.renderButton()}
        eliminated={eliminated}
        detail={eliminated ? undefined : this.renderDetail()}
      />
    );
  }
}
