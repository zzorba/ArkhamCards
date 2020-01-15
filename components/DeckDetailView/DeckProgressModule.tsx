import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import CardSectionHeader from './CardSectionHeader';
import ChangesFromPreviousDeck from './ChangesFromPreviousDeck';
import DeckDelta from './DeckDelta';
import EditTraumaComponent from '../campaign/EditTraumaComponent';
import CampaignSummaryComponent from '../campaign/CampaignSummaryComponent';
import { fetchPublicDeck, fetchPrivateDeck } from '../decks/actions';
import { Campaign, Deck, ParsedDeck, Trauma } from '../../actions/types';
import Card, { CardsMap } from '../../data/Card';
import { getDeck, AppState } from '../../reducers';
import typography from '../../styles/typography';
import space, { l, m, s } from '../../styles/space';

interface OwnProps {
  componentId: string;
  fontScale: number;
  deck: Deck;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  isPrivate: boolean;
  editable: boolean;
  campaign?: Campaign;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  investigatorDataUpdates: any;
  xpAdjustment: number;
  showDeckUpgrade: () => void;
}

interface ReduxProps {
  previousDeck?: Deck;
}

interface ReduxActionProps {
  fetchPrivateDeck: (deckId: number) => void;
  fetchPublicDeck: (deckId: number, useDeckEndpoint: boolean) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class DeckProgressModule extends React.PureComponent<Props> {
  componentDidMount() {
    const {
      deck,
      previousDeck,
      fetchPublicDeck,
      fetchPrivateDeck,
      isPrivate,
    } = this.props;
    if (deck.previous_deck && !previousDeck) {
      if (isPrivate) {
        fetchPrivateDeck(deck.previous_deck);
      } else {
        fetchPublicDeck(deck.previous_deck, true);
      }
    }
  }

  investigatorData() {
    const {
      campaign,
      investigatorDataUpdates,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return Object.assign(
      {},
      campaign.investigatorData || {},
      investigatorDataUpdates
    );
  }


  renderCampaignSection() {
    const {
      campaign,
      parsedDeck: {
        investigator,
      },
      showTraumaDialog,
      showDeckUpgrade,
      editable,
      fontScale,
    } = this.props;
    return (
      <React.Fragment>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Campaign` }}
          fontScale={fontScale}
        />
        { !!campaign && (
          <View style={styles.campaign}>
            <Text style={[typography.text, space.marginBottomS]}>
              { campaign.name }
            </Text>
            <View style={space.marginBottomM}>
              <CampaignSummaryComponent campaign={campaign} hideScenario />
            </View>
            <EditTraumaComponent
              investigator={investigator}
              investigatorData={this.investigatorData()}
              showTraumaDialog={showTraumaDialog}
            />
          </View>
        ) }
        { editable && (
          <View style={styles.buttonWrapper}>
            <Button
              title={t`Upgrade Deck with XP`}
              onPress={showDeckUpgrade}
            />
          </View>
        ) }
      </React.Fragment>
    );
  }

  render() {
    const {
      campaign,
      componentId,
      deck,
      cards,
      parsedDeck,
      xpAdjustment,
      fontScale,
      editable,
    } = this.props;

    if (!deck.previous_deck && !deck.next_deck && !campaign && !editable) {
      return null;
    }

    // Actually compute the diffs.
    return (
      <View style={styles.container}>
        { this.renderCampaignSection() }
        <ChangesFromPreviousDeck
          componentId={componentId}
          fontScale={fontScale}
          cards={cards}
          parsedDeck={parsedDeck}
          xpAdjustment={xpAdjustment}
        />
        { (!!deck.previous_deck || !!deck.next_deck) && (
          <DeckDelta
            componentId={componentId}
            parsedDeck={parsedDeck}
            xpAdjustment={xpAdjustment}
          />
        ) }
      </View>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  if (props.deck && props.deck.previous_deck) {
    return {
      previousDeck: getDeck(state, props.deck.previous_deck) || undefined,
    };
  }
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    fetchPublicDeck,
    fetchPrivateDeck,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckProgressModule);


const styles = StyleSheet.create({
  container: {
    marginTop: m,
    marginBottom: l,
  },
  campaign: {
    marginTop: s,
    marginLeft: s,
    marginRight: s,
  },
  buttonWrapper: {
    margin: s,
  },
});
