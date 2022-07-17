import React, { useCallback, useContext, useMemo } from 'react';
import { find, throttle } from 'lodash';
import { Platform, Text, StyleSheet, View } from 'react-native';
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
import { useNavigationButtonPressed, useSettingFlag } from '@components/core/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import space, { s } from '@styles/space';
import MiniDeckT from '@data/interfaces/MiniDeckT';


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
  { promptForUpdate: true },
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
