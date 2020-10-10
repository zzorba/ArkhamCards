import React from 'react';
import { find, filter, throttle } from 'lodash';
import { Platform, Text, StyleSheet, View } from 'react-native';
import { Navigation, EventSubscription, OptionsModalPresentationStyle } from 'react-native-navigation';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import Card from '@data/Card';
import CardTextComponent from '@components/card/CardTextComponent';
import { iconsMap } from '@app/NavIcons';
import { showDeckModal } from '@components/nav/helper';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';
import { getMyDecksState, AppState } from '@reducers';
import COLORS from '@styles/colors';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  myDecks: number[];
}

type Props = OwnProps & ReduxProps;

interface State {
  localDecksOnly: boolean;
}

function searchOptionsHeight(fontScale: number) {
  return 20 + (fontScale * 20 + 8) + 12;
}

class MyDecksView extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static options() {
    return {
      topBar: {
        title: {
          text: t`Decks`,
        },
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.M,
          accessibilityLabel: t`New Deck`,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;

  _showNewDeckDialog!: () => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      localDecksOnly: false,
    };
    this._showNewDeckDialog = throttle(this.showNewDeckDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  showNewDeckDialog() {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Deck.New',
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'add') {
      this._showNewDeckDialog();
    }
  }

  _deckNavClicked = (deck: Deck, investigator?: Card) => {
    showDeckModal(this.props.componentId, deck, this.context.colors, investigator);
  };

  _toggleLocalDecksOnly = () => {
    this.setState({
      localDecksOnly: !this.state.localDecksOnly,
    });
  };

  renderCustomHeader() {
    const {
      myDecks,
    } = this.props;
    const {
      localDecksOnly,
    } = this.state;
    const { typography } = this.context;
    const hasLocalDeck = find(myDecks, deckId => deckId < 0) !== null;
    const hasOnlineDeck = find(myDecks, deckId => deckId > 0) !== null;
    if (!localDecksOnly && !(hasLocalDeck && hasOnlineDeck)) {
      // need to have both to show the toggle.
      return null;
    }
    return (
      <View style={styles.row}>
        <Text style={[typography.small, styles.searchOption]}>
          { t`Hide ArkhamDB Decks` }
        </Text>
        <ArkhamSwitch
          value={localDecksOnly}
          onValueChange={this._toggleLocalDecksOnly}
        />
      </View>
    );
  }

  renderCustomFooter() {
    return (
      <View style={styles.button}>
        <ArkhamButton
          icon="deck"
          title={t`New Deck`}
          onPress={this._showNewDeckDialog}
        />
      </View>
    );
  }

  onlyDeckIds() {
    const {
      myDecks,
    } = this.props;
    if (this.state.localDecksOnly) {
      // @ts-ignore
      return filter(myDecks, deckId => parseInt(deckId, 10) < 0);
    }
    return undefined;
  }

  render() {
    const { fontScale } = this.context;
    return (
      <CardTextComponent
        text={"When playing a standalone game (i.e., playing a single scenario as a one-off adventure, removed from its campaign), the following rules apply:\n- When building a deck for a standalone game, an investigator may use higher level cards in his or her deck (so long as they observe the deckbuilding restrictions of the investigator) by counting the total experience of all the higher level cards used in the deck, and taking additional random basic weaknesses based on the following table:\n\n| Experience | Weaknesses |\n| --- | --- |\n| 0-9 experience | 0 additional random basic weaknesses |\n| 10-19 experience | 1 additional random basic weakness |\n| 20-29 experience | 2 additional random basic weaknesses |\n| 30-39 experience | 3 additional random basic weaknesses |\n| 40-49 experience | 4 additional random basic weaknesses |\nA player cannot include 50 or more experience worth of cards in a standalone deck.\n- After choosing a scenario to play, refer to the Campaign Guide for the campaign that scenario is a part of, starting at the setup for that campaign, and continuing on to the first scenario for that campaign. Read through that scenario's introduction, then skip directly to that scenario's resolution and choose a resolution that is amenable to you. You may choose any resolution you wish. (For an added challenge, choose resolutions that put the investigators in an unfavorable state). If the players are unsure which resolution to choose, or are indifferent, choose <b>Resolution 1</b>. Record the results of the chosen resolution in a Campaign Log as if you were playing through in campaign mode, <b>except do not count experience points</b>.\n- Repeat this process for each scenario up to the scenario you wish to play. Then, setup and play that scenario as normal.\n- If a story decision would occur during gameplay, choose the outcome and record it in your campaign log.\n- Do not apply trauma for having been defeated during gameplay, but if trauma is inflicted during a scenario resolution, apply it.\n- If a scenario weakness or asset is earned that is in an expansion you do not own, simply continue without that card."}
      />
    )
    return (
      <MyDecksComponent
        componentId={this.props.componentId}
        searchOptions={{
          controls: this.renderCustomHeader(),
          height: searchOptionsHeight(fontScale),
        }}
        customFooter={this.renderCustomFooter()}
        deckClicked={this._deckNavClicked}
        onlyDeckIds={this.onlyDeckIds()}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return getMyDecksState(state);
}

export default withFetchCardsGate(
  connect<ReduxProps, unknown, OwnProps, AppState>(mapStateToProps)(MyDecksView),
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  searchOption: {
    marginRight: 2,
  },
  button: {
    flex: 1,
  },
});
