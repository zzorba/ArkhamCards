import React from 'react';
import { Button, Text, View, Platform } from 'react-native';
import { find , map } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import DeckXpSection from './DeckXpSection';
import BasicListRow from '@components/core/BasicListRow';
import { showCard, showDeckModal } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { Deck, TraumaAndCardData } from '@actions/types';
import CardSectionHeader from '@components/core/CardSectionHeader';
import InvestigatorRow from '@components/core/InvestigatorRow';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import Card, { CardsMap } from '@data/Card';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import COLORS from '@styles/colors';
import PickerStyleButton from '@components/core/PickerStyleButton';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  componentId: string;
  campaignId: number;
  investigator: Card;
  spentXp: number;
  totalXp: number;
  incSpentXp: (code: string) => void;
  decSpentXp: (code: string) => void;
  traumaAndCardData: TraumaAndCardData;
  playerCards: CardsMap;
  chooseDeckForInvestigator?: (investigator: Card) => void;
  deck?: Deck;
  removeInvestigator?: (investigator: Card) => void;
  // For legacy system
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
  showTraumaDialog?: (investigator: Card, traumaData: TraumaAndCardData) => void;
}

export default class InvestigatorCampaignRow extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _onCardPress = (card: Card) => {
    const { componentId } = this.props;
    const { colors } = this.context;
    showCard(componentId, card.code, card, colors, true);
  };

  _renderStoryAsset = (card: Card) => {
    return (
      <CardSearchResult
        key={card.code}
        onPress={this._onCardPress}
        card={card}
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
      componentId,
      deck,
      playerCards,
      spentXp,
      totalXp,
      showDeckUpgrade,
    } = this.props;
    const { typography } = this.context;
    if (deck) {
      return (
        <DeckXpSection
          componentId={componentId}
          deck={deck}
          cards={playerCards}
          investigator={investigator}
          showDeckUpgrade={showDeckUpgrade}
        />
      );
    }
    if (totalXp === 0) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Experience points` }}
        />
        <BasicListRow>
          <Text style={typography.text}>
            { t`${spentXp} of ${totalXp} spent` }
          </Text>
          <PlusMinusButtons
            count={spentXp}
            max={totalXp}
            onIncrement={this._incXp}
            onDecrement={this._decXp}
          />
        </BasicListRow>
      </>
    );
  }

  _showTraumaDialog = () => {
    const { traumaAndCardData, investigator, showTraumaDialog } = this.props;
    if (showTraumaDialog) {
      showTraumaDialog(investigator, traumaAndCardData);
    }
  };

  renderTrauma() {
    const { traumaAndCardData, investigator, showTraumaDialog } = this.props;
    return (
      <PickerStyleButton
        id="trauma"
        onPress={this._showTraumaDialog}
        disabled={!showTraumaDialog}
        title={investigator.traumaString(traumaAndCardData)}
        widget="nav"
        noBorder
        settingsStyle
      />
    );
  }

  renderStoryAssets() {
    const { traumaAndCardData, investigator } = this.props;
    const storyAssets = traumaAndCardData.storyAssets || [];
    if (!storyAssets.length) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Campaign cards` }}
        />
        { map(storyAssets, asset => (
          <SingleCardWrapper
            key={asset}
            code={asset}
            type="player"
          >
            { this._renderStoryAsset }
          </SingleCardWrapper>
        )) }
      </>
    );
  }

  _removePressed = () => {
    const {
      investigator,
      removeInvestigator,
    } = this.props;
    if (removeInvestigator) {
      removeInvestigator(investigator);
    }
  };

  renderDetail() {
    const {
      investigator,
      removeInvestigator,
      deck,
    } = this.props;
    if (removeInvestigator) {
      return (
        <BasicButton
          title={deck ? t`Remove deck` : t`Remove investigator`}
          onPress={this._removePressed}
          color={COLORS.red}
        />
      );
    }
    return (
      <>
        { this.renderXp() }
        <CardSectionHeader
          investigator={investigator}
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
    const { colors } = this.context;
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        colors,
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

  renderButton(eliminated: boolean) {
    const {
      deck,
      chooseDeckForInvestigator,
      showTraumaDialog,
    } = this.props;
    const { colors } = this.context;
    const traumaNode = (!!showTraumaDialog && eliminated) && (
      <Button
        title={t`Edit Trauma`}
        color={Platform.OS === 'ios' ? colors.navButton : undefined}
        onPress={this._showTraumaDialog}
      />
    );

    if (deck) {
      return (
        <>
          <Button
            title={t`View Deck`}
            color={Platform.OS === 'ios' ? colors.navButton : undefined}
            onPress={this._viewDeck}
          />
          { traumaNode }
        </>
      );
    }
    if (!chooseDeckForInvestigator) {
      return traumaNode || <View />;
    }
    return (
      <>
        <Button
          title={t`Select Deck`}
          color={Platform.OS === 'ios' ? colors.navButton : undefined}
          onPress={this._selectDeck}
        />
        { traumaNode }
      </>
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
        button={this.renderButton(eliminated)}
        eliminated={eliminated}
        yithian={!!find(traumaAndCardData.storyAssets || [], asset => asset === BODY_OF_A_YITHIAN)}
      >
        { eliminated ? undefined : this.renderDetail() }
      </InvestigatorRow>
    );
  }
}
