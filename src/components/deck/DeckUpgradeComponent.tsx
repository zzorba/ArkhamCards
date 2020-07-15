import React from 'react';
import { forEach, find, throttle } from 'lodash';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { t } from 'ttag';

import { Deck, Slots } from 'actions/types';
import BasicListRow from '@components/core/BasicListRow';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { NavigationProps } from '@components/nav/types';
import { showCard } from '@components/nav/helper';
import ExileCardSelectorComponent from '@components/campaign/ExileCardSelectorComponent';
import Card from '@data/Card';
import { DeckChanges } from '@components/deck/actions';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import typography from '@styles/typography';
import space, { m } from '@styles/space';

interface OwnProps {
  investigator: Card;
  deck: Deck;
  fontScale: number;
  startingXp?: number;
  campaignSection?: React.ReactNode;
  storyCounts: Slots;
  ignoreStoryCounts: Slots;
  upgradeCompleted: (deck: Deck, xp: number) => void;
  saveDeckChanges: (deck: Deck, changes: DeckChanges) => Promise<Deck>;
  saveDeckUpgrade: (deck: Deck, xp: number, exileCounts: Slots) => Promise<Deck>;
}

type Props = NavigationProps & OwnProps;

interface State {
  xp: number;
  exileCounts: Slots;
  saving: boolean;
  error?: string;
}

export default class DeckUpgradeComponent extends React.Component<Props, State> {
  _saveUpgrade!: (isRetry?: boolean) => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      xp: props.startingXp || 0,
      exileCounts: {},
      saving: false,
    };

    this._saveUpgrade = throttle(this.saveUpgrade.bind(this), 200);
  }

  save = () => {
    this._saveUpgrade();
  };

  _deckUpgradeComplete = (deck: Deck) => {
    this.setState({
      saving: false,
    });
    this.props.upgradeCompleted(deck, this.state.xp);
  };

  _handleStoryCardChanges = (upgradedDeck: Deck) => {
    const {
      saveDeckChanges,
      storyCounts,
      ignoreStoryCounts,
    } = this.props;
    const hasStoryChange = !!find(storyCounts, (count, code) =>
      (upgradedDeck.slots[code] || 0) !== count
    ) || !!find(ignoreStoryCounts, (count, code) =>
      (upgradedDeck.ignoreDeckLimitSlots[code] || 0) !== count
    );
    if (hasStoryChange) {
      const newSlots: Slots = { ...upgradedDeck.slots };
      forEach(storyCounts, (count, code) => {
        if (count > 0) {
          newSlots[code] = count;
        } else {
          delete newSlots[code];
        }
      });
      const newIgnoreSlots: Slots = { ...upgradedDeck.ignoreDeckLimitSlots };
      forEach(ignoreStoryCounts, (count, code) => {
        if (count > 0){
          newIgnoreSlots[code] = count;
        } else {
          delete newIgnoreSlots[code];
        }
      });
      saveDeckChanges(upgradedDeck, {
        slots: newSlots,
        ignoreDeckLimitSlots: newIgnoreSlots,
      }).then(
        this._deckUpgradeComplete,
        (e: Error) => {
          console.log(e);
          this.setState({
            error: e.message,
            saving: false,
          });
        }
      );
    } else {
      this._deckUpgradeComplete(upgradedDeck);
    }
  };

  saveUpgrade(isRetry?: boolean) {
    const {
      deck,
      saveDeckUpgrade,
    } = this.props;
    if (!deck) {
      return;
    }
    if (!this.state.saving || isRetry) {
      this.setState({
        saving: true,
      });
      const {
        xp,
        exileCounts,
      } = this.state;
      saveDeckUpgrade(deck, xp, exileCounts).then(
        this._handleStoryCardChanges,
        (e: Error) => {
          this.setState({
            error: e.message,
            saving: false,
          });
        }
      );
    }
  }

  _onCardPress = (card: Card) => {
    showCard(this.props.componentId, card.code, card);
  };

  _onExileCountsChange = (exileCounts: Slots) => {
    this.setState({
      exileCounts,
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

  render() {
    const {
      deck,
      investigator,
      componentId,
      campaignSection,
      fontScale,
    } = this.props;
    const {
      xp,
      exileCounts,
      saving,
      error,
    } = this.state;
    if (!deck) {
      return null;
    }
    if (saving) {
      return (
        <View style={[styles.container, styles.saving]}>
          <Text style={typography.text}>
            { t`Saving...` }
          </Text>
          <ActivityIndicator
            style={space.marginTopM}
            size="large"
            animating
          />
        </View>
      );
    }
    const xpString = xp >= 0 ? `+${xp}` : `${xp}`;
    return (
      <View style={styles.container}>
        { !!error && <Text>{ error }</Text> }
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Experience points` }}
        />
        <BasicListRow>
          <Text style={typography.text}>
            { xpString }
          </Text>
          <PlusMinusButtons
            count={xp}
            onIncrement={this._incXp}
            onDecrement={this._decXp}
          />
        </BasicListRow>
        <ExileCardSelectorComponent
          componentId={componentId}
          id={deck.id}
          label={(
            <CardSectionHeader
              section={{ superTitle: t`Exiled cards` }}
              investigator={investigator}
              fontScale={fontScale}
            />
          )}
          exileCounts={exileCounts}
          updateExileCounts={this._onExileCountsChange}
        />
        { !!campaignSection && campaignSection }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  saving: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: m,
    paddingBottom: m,
  },
});
