import React from 'react';
import { filter, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { Campaign, Deck } from 'actions/types';
import { CardsMap } from 'data/Card';
import InvestigatorImage from 'components/core/InvestigatorImage';
import { getDecks, getLatestCampaignDeckIds, AppState } from 'reducers';
import { s } from 'styles/space';

interface OwnProps {
  campaign: Campaign;
  investigators: CardsMap;
}

interface ReduxProps {
  decks: Deck[];
}

type Props = OwnProps & ReduxProps;

class CampaignInvestigatorRow extends React.Component<Props> {
  _renderInvestigator = (code: string) => {
    const {
      investigators,
      campaign: {
        investigatorData = {},
      },
    } = this.props;
    const card = investigators[code];
    if (card) {
      const killedOrInsane = card.eliminated(investigatorData[code]);
      if (killedOrInsane) {
        return null;
      }
      return (
        <View key={card.code} style={styles.investigator}>
          <InvestigatorImage
            card={card}
            killedOrInsane={killedOrInsane}
            small
          />
        </View>
      );
    }
    return null;
  };

  _renderDeck = (deck: Deck) => {
    if (deck && deck.investigator_code) {
      return this._renderInvestigator(deck.investigator_code);
    }
    return null;
  };

  render() {
    const {
      decks,
      campaign,
    } = this.props;
    const deckInvestigators = new Set(map(decks, deck => deck.investigator_code));
    return (
      <View style={styles.row}>
        { map(decks, this._renderDeck) }
        { map(
            filter(
              campaign.nonDeckInvestigators || [],
              code => !deckInvestigators.has(code)
            ),
            this._renderInvestigator
          ) }
      </View>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const latestDeckIds = getLatestCampaignDeckIds(state, props.campaign);
  return {
    decks: getDecks(state, latestDeckIds),
  };
}

export default connect(mapStateToProps)(CampaignInvestigatorRow);

const styles = StyleSheet.create({
  row: {
    marginTop: s,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  investigator: {
    marginRight: s,
    marginBottom: s,
  },
});
