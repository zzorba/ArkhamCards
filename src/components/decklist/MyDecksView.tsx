import React, { useCallback, useContext, useMemo } from 'react';
import { find, flatMap, map, throttle } from 'lodash';
import { Platform, Text, StyleSheet, View, ScrollView } from 'react-native';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import Card from '@data/types/Card';
import { iconsMap } from '@app/NavIcons';
import { showDeckModal } from '@components/nav/helper';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';
import { getMyDecksState } from '@reducers';
import COLORS from '@styles/colors';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { NavigationProps } from '@components/nav/types';
import { useNavigationButtonPressed, usePlayerCards, useSettingFlag } from '@components/core/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import space, { s } from '@styles/space';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import StylizedCard from '@components/card/StylizedCard';


function MyDecksView({ componentId }: NavigationProps) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const { myDecks } = useSelector(getMyDecksState);
  const showNewDeckDialog = useMemo(() => {
    return throttle(() => {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'Deck.New',
              options: {
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.fullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
              },
            },
          }],
        },
      });
    }, 200);
  }, []);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'add') {
      showNewDeckDialog();
    }
  }, componentId, [showNewDeckDialog]);

  const deckNavClicked = useCallback((deck: LatestDeckT, investigator: Card | undefined) => {
    showDeckModal(deck.id, deck.deck, deck.campaign?.id, colors, investigator);
  }, [colors]);
  const [localDecksOnly, toggleLocalDecksOnly] = useSettingFlag('hide_arkhamdb_decks');
  const [hideCampaignDecks, toggleHideCampaignDecks] = useSettingFlag('hide_campaign_decks');

  const [searchOptionControls, searchOptionsHeight] = useMemo(() => {
    const hasLocalDeck = !!find(myDecks, deckId => deckId.id.local);
    const hasOnlineDeck = !!find(myDecks, deckId => !deckId.id.local);
    const hasNonCampaignDeck = !!find(myDecks, deckId => !deckId.campaign_id);
    const hasCampaignDeck = !!find(myDecks, deckId => deckId.campaign_id);
    const hideLocalDeckToggle = (!localDecksOnly && !(hasLocalDeck && hasOnlineDeck));
    const hideCampaignDeckToggle = (!hideCampaignDecks && !(hasCampaignDeck && hasNonCampaignDeck));
    if (hideLocalDeckToggle && hideCampaignDeckToggle) {
      // need to have both to show the toggle.
      return [null, 0];
    }
    return [
      (
        <View style={[styles.column, space.paddingBottomS]} key="controls">
          { !hideLocalDeckToggle && (
            <View style={styles.row}>
              <Text style={[typography.small, styles.searchOption]}>
                { t`Hide ArkhamDB decks` }
              </Text>
              <ArkhamSwitch
                useGestureHandler
                value={localDecksOnly}
                onValueChange={toggleLocalDecksOnly}
              />
            </View>
          ) }
          { !hideCampaignDeckToggle && (
            <View style={styles.row}>
              <Text style={[typography.small, styles.searchOption]}>
                { t`Hide campaign decks` }
              </Text>
              <ArkhamSwitch
                useGestureHandler
                value={hideCampaignDecks}
                onValueChange={toggleHideCampaignDecks}
              />
            </View>
          ) }
        </View>
      ),
      20 + 12 + s + (fontScale * 20 + 8) * ((hideCampaignDeckToggle || hideLocalDeckToggle) ? 1 : 2),
    ];
  }, [myDecks, localDecksOnly, typography, toggleLocalDecksOnly, toggleHideCampaignDecks, hideCampaignDecks, fontScale]);

  const customFooter = useMemo(() => {
    return (
      <View style={styles.button}>
        <ArkhamButton
          icon="deck"
          title={t`New Deck`}
          onPress={showNewDeckDialog}
        />
      </View>
    );
  }, [showNewDeckDialog]);

  const filterDeck = useCallback((deck: MiniDeckT) => {
    if (localDecksOnly && !deck.id.local) {
      return 'remote';
    }
    if (hideCampaignDecks && deck.campaign_id) {
      return 'campaign';
    }
    return undefined;
  }, [localDecksOnly, hideCampaignDecks]);

/*const codes = ['05012', '03023', '02150', '60330', '05118', '03312', '08124', '05109', '60529', '01059', '60214', '01087', '02150', '02300', '01047', '02018', '60302'];
  const [sampleCards] = usePlayerCards(codes);
  const cards = useMemo(() => flatMap(codes, code => sampleCards?.[code] || []), [sampleCards, codes]);
  return (
    <ScrollView style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'black' }}>
      { flatMap(cards, (card) => card ? <StylizedCard key={card.code} card={card} width={300} /> : [])}
      { flatMap(cards, (card) => card ? <StylizedCard key={card.code} card={card} width={200} /> : [])}
      { flatMap(cards, (card) => card ? <StylizedCard key={card.code} card={card} width={250} /> : [])}
    </ScrollView>
  );*/
  return (
    <MyDecksComponent
      searchOptions={{
        controls: searchOptionControls,
        height: searchOptionsHeight,
      }}
      customFooter={customFooter}
      deckClicked={deckNavClicked}
      filterDeck={filterDeck}
    />
  );
}

MyDecksView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Decks`,
      },
      rightButtons: [{
        icon: iconsMap['plus-button'],
        id: 'add',
        color: COLORS.M,
        accessibilityLabel: t`New Deck`,
      }],
    },
  };
};

export default withFetchCardsGate(
  MyDecksView,
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flex: 1,
  },
  searchOption: {
    marginRight: 2,
  },
  button: {
    flex: 1,
  },
});
