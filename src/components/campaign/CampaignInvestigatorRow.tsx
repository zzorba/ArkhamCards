import React, { useCallback, useMemo } from 'react';
import { filter, find, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Campaign, Deck } from '@actions/types';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import InvestigatorImage from '@components/core/InvestigatorImage';
import { makeLatestCampaignDeckIdsSelector, AppState, makeGetDecksSelector } from '@reducers';
import { s } from '@styles/space';
import { useInvestigatorCards } from '@components/core/hooks';

interface Props {
  campaigns: Campaign[];
}

function SingleCampaignInvestigatorRow({ campaign }: { campaign: Campaign }) {
  const getLatestCampaignDeckIds = useMemo(makeLatestCampaignDeckIdsSelector, []);
  const getDecks = useMemo(makeGetDecksSelector, []);
  const deckIds = useSelector((state: AppState) => getLatestCampaignDeckIds(state, campaign));
  const decks = useSelector((state: AppState) => getDecks(state, deckIds));
  const investigators = useInvestigatorCards();
  const renderInvestigator = useCallback((
    code: string,
    campaign: Campaign,
    deck?: Deck
  ) => {
    const { investigatorData } = campaign;
    const card = investigators?.[code];
    const killedOrInsane = card && card.eliminated(investigatorData[code]);
    const yithian = !!find(investigatorData[code]?.storyAssets || [], asset => asset === BODY_OF_A_YITHIAN) ||
      (deck && deck.slots && (deck.slots[BODY_OF_A_YITHIAN] || 0) > 0);
    return (
      <View key={code} style={styles.investigator}>
        <InvestigatorImage
          card={card}
          killedOrInsane={killedOrInsane}
          yithian={yithian}
          border
          small
        />
      </View>
    );
  }, [investigators]);

  const renderDeck = useCallback((deck: Deck, campaign: Campaign) => {
    if (deck && deck.investigator_code) {
      return renderInvestigator(deck.investigator_code, campaign, deck);
    }
    return null;
  }, [renderInvestigator]);


  const deckInvestigators = new Set(map(decks, deck => deck.investigator_code));
  return (
    <View key={campaign.uuid} style={styles.row}>
      { map(decks, deck => renderDeck(deck, campaign)) }
      { map(
        filter(
          campaign.nonDeckInvestigators || [],
          code => !deckInvestigators.has(code)
        ),
        code => renderInvestigator(code, campaign)
      ) }
    </View>
  );
}

export default function CampaignInvestigatorRow({ campaigns }: Props) {
  return (
    <>
      { map(campaigns, campaign => <SingleCampaignInvestigatorRow campaign={campaign} key={campaign.uuid} />) }
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: s,
    minHeight: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  investigator: {
    marginRight: s,
    marginBottom: s,
  },
});
