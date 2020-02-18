import React from 'react';
import { flatMap, keys, map, range } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { ngettext, msgid, t } from 'ttag';

import AppIcon from '../../../assets/AppIcon';
import { Deck, InvestigatorData, ParsedDeck, Trauma } from '../../../actions/types';
import DeckValidation from '../../../lib/DeckValidation';
import { parseDeck } from '../../../lib/parseDeck';
import Card, { CardsMap } from '../../../data/Card';
import withDimensions, { DimensionsProps } from '../../core/withDimensions';
import { showDeckModal } from '../../navHelper';
import DeckProblemRow from '../../DeckProblemRow';
import DeckRowButton from '../../DeckRowButton';
import EditTraumaComponent from '../EditTraumaComponent';
import { DEFAULT_TRAUMA_DATA, isEliminated } from '../trauma';
import DeckRow from '../DeckRow';
import DeckList, { DeckListProps } from '../DeckList';
import typography from '../../../styles/typography';
import { iconSizeScale, s, xs } from '../../../styles/space';

interface OwnProps extends DeckListProps {
  deckRemoved?: (id: number, deck?: Deck, investigator?: Card) => void;
  showDeckUpgradeDialog: (deck: Deck, investigator?: Card) => void;
  investigatorData: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
}
type Props = OwnProps & DimensionsProps;

class CampaignDeckList extends React.Component<Props> {
  _viewDeck = (deck: Deck, investigator: Card) => {
    const {
      componentId,
    } = this.props;
    showDeckModal(componentId, deck, investigator);
  };

  _upgradeDeckPressed = (deck: Deck, investigator: Card) => {
    const {
      showDeckUpgradeDialog,
    } = this.props;
    showDeckUpgradeDialog(deck, investigator);
  };

  experienceLine(deck: Deck, parsedDeck: ParsedDeck) {
    const xp = (deck.xp || 0) + (deck.xp_adjustment || 0);
    if (xp > 0) {
      if (parsedDeck.changes && parsedDeck.changes.spentXp > 0) {
        return t`${xp} available (${parsedDeck.changes.spentXp} spent)`;
      }
      return t`${xp} available`;
    }
    const totalXp = parsedDeck.experience || 0;
    return t`${totalXp} total`;
  }

  _renderSubDetails = (
    deck: Deck,
    cards: CardsMap,
    investigator: Card,
    previousDeck?: Deck
  ) => {
    const {
      investigatorData = {},
      showTraumaDialog,
      fontScale,
    } = this.props;
    if (!deck) {
      return null;
    }
    const eliminated = isEliminated(
      investigatorData[investigator.code] || DEFAULT_TRAUMA_DATA,
      investigator);
    const parsedDeck = parseDeck(deck, deck.slots, deck.ignoreDeckLimitSlots || {}, cards, previousDeck);
    return (
      <View style={styles.investigatorSubNotes}>
        <View style={styles.section}>
          <EditTraumaComponent
            investigator={investigator}
            investigatorData={investigatorData}
            showTraumaDialog={showTraumaDialog}
          />
        </View>
        { !eliminated && (
          <View style={styles.section}>
            <View style={styles.column}>
              <Text style={typography.smallLabel}>
                { t`EXPERIENCE` }
              </Text>
              <Text style={typography.text}>
                { this.experienceLine(parsedDeck.deck, parsedDeck) }
              </Text>
            </View>
          </View>
        ) }
        { !eliminated && (
          <View style={styles.section}>
            <DeckRowButton
              icon={(
                <MaterialCommunityIcons
                  size={18 * iconSizeScale * fontScale}
                  color="#222"
                  name="arrow-up-bold"
                />
              )}
              text={t`Upgrade Deck`}
              deck={deck}
              investigator={investigator}
              onPress={this._upgradeDeckPressed}
            />
          </View>
        ) }
      </View>
    );
  };

  _renderDetails = (
    deck: Deck,
    cards: CardsMap,
    investigator: Card,
    previousDeck?: Deck
  ) => {
    const { fontScale } = this.props;
    if (!deck) {
      return null;
    }
    const parsedDeck = parseDeck(
      deck,
      deck.slots,
      deck.ignoreDeckLimitSlots || {},
      cards,
      previousDeck);
    const {
      slots,
      ignoreDeckLimitSlots,
    } = parsedDeck;

    const problemObj = new DeckValidation(investigator, deck.slots, deck.meta).getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      if (!card) {
        return [];
      }
      return map(
        range(0, slots[code] - (ignoreDeckLimitSlots[code] || 0)),
        () => card
      );
    }));
    return (
      <View style={styles.investigatorNotes}>
        { !!problemObj && (
          <View style={styles.section}>
            <DeckProblemRow problem={problemObj} color="#222" fontScale={fontScale} />
          </View>
        ) }
        <View style={styles.section}>
          <DeckRowButton
            icon={<AppIcon name="deck" size={18 * iconSizeScale * fontScale} color="#222222" />}
            text={
              fontScale > 1.5 ?
                ngettext(msgid`${parsedDeck.normalCardCount} Card\n(${parsedDeck.totalCardCount} Total`,
                  `${parsedDeck.normalCardCount} Cards\n(${parsedDeck.totalCardCount} Total`,
                  parsedDeck.normalCardCount) :
                ngettext(msgid`${parsedDeck.normalCardCount} Card (${parsedDeck.totalCardCount} Total)`,
                  `${parsedDeck.normalCardCount} Cards (${parsedDeck.totalCardCount} Total)`,
                  parsedDeck.normalCardCount)
            }
            deck={deck}
            investigator={investigator}
            onPress={this._viewDeck}
          />
        </View>
      </View>
    );
  }

  _renderDeck = (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => {
    const {
      componentId,
      deckRemoved,
      fontScale,
    } = this.props;
    return (
      <DeckRow
        key={deckId}
        fontScale={fontScale}
        componentId={componentId}
        id={deckId}
        deckRemoved={deckRemoved}
        cards={cards}
        investigators={investigators}
        renderDetails={this._renderDetails}
        renderSubDetails={this._renderSubDetails}
        otherProps={this.props}
        compact
        viewDeckButton
      />
    );
  };

  render() {
    const {
      componentId,
      deckIds,
      deckAdded,
      campaignId,
      fontScale,
    } = this.props;
    return (
      <DeckList
        fontScale={fontScale}
        renderDeck={this._renderDeck}
        componentId={componentId}
        campaignId={campaignId}
        deckIds={deckIds}
        deckAdded={deckAdded}
        otherProps={this.props}
      />
    );
  }
}

export default withDimensions<OwnProps>(CampaignDeckList);

const styles = StyleSheet.create({
  section: {
    marginBottom: s,
    marginRight: s,
    flexDirection: 'row',
  },
  investigatorNotes: {
    flex: 1,
    marginTop: xs,
  },
  investigatorSubNotes: {
    flex: 1,
    marginTop: xs,
    marginLeft: s,
  },
  column: {
    flexDirection: 'column',
  },
});
