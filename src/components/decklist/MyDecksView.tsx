import React, { useCallback, useContext, useMemo, useEffect } from 'react';
import { throttle } from 'lodash';
import { Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { t } from 'ttag';

import Card from '@data/types/Card';
import { showDeckModal } from '@components/nav/helper';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';
import HeaderButton from '@components/core/HeaderButton';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { useSettingFlag } from '@components/core/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import space, { s } from '@styles/space';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import withApolloGate from '@components/core/withApolloGate';


function MyDecksView() {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const { arkhamDb } = useContext(ArkhamCardsAuthContext);
  const navigation = useNavigation();
  const showNewDeckDialog = useMemo(() => {
    return throttle(() => {
      navigation.navigate('Deck.New', {});
    }, 200);
  }, [navigation]);
  useEffect(() => {
    navigation.setOptions({
      title: t`Decks`,
      headerRight: () => (
        <HeaderButton
          iconName="plus-button"
          onPress={showNewDeckDialog}
          color={colors.M}
          accessibilityLabel={t`New Deck`}
        />
      ),
    });
  }, [navigation, colors.M, showNewDeckDialog]);

  const deckNavClicked = useCallback((deck: LatestDeckT, investigator: Card | undefined) => {
    showDeckModal(navigation, colors, deck.id, deck.deck, deck.campaign?.id, investigator);
  }, [navigation, colors]);
  const [localDecksOnly, toggleLocalDecksOnly] = useSettingFlag('hide_arkhamdb_decks');
  const [hideCampaignDecks, toggleHideCampaignDecks] = useSettingFlag('hide_campaign_decks');

  const [searchOptionControls, searchOptionsHeight] = useMemo(() => {
    return [
      (
        <View style={[styles.column, space.paddingBottomS]} key="controls">
          { !!arkhamDb && (
            <View style={styles.row}>
              <Text style={[typography.small, styles.searchOption]}>
                { t`Hide ArkhamDB decks` }
              </Text>
              <ArkhamSwitch
                value={localDecksOnly}
                onValueChange={toggleLocalDecksOnly}
              />
            </View>
          ) }
          <View style={styles.row}>
            <Text style={[typography.small, styles.searchOption]}>
              { t`Hide campaign decks` }
            </Text>
            <ArkhamSwitch
              value={hideCampaignDecks}
              onValueChange={toggleHideCampaignDecks}
            />
          </View>
        </View>
      ),
      20 + 12 + s + (fontScale * 20 + 8) * (arkhamDb ? 2 : 1),
    ];
  }, [arkhamDb, localDecksOnly, typography, toggleLocalDecksOnly, toggleHideCampaignDecks, hideCampaignDecks, fontScale]);

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

  return (
    <MyDecksComponent
      searchOptions={{
        controls: searchOptionControls,
        height: searchOptionsHeight,
      }}
      customFooter={customFooter}
      deckClicked={deckNavClicked}
      filterDeck={filterDeck}
      live
    />
  );
}

export default withApolloGate(
  withFetchCardsGate(
    MyDecksView,
    { promptForUpdate: false },
  )
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
