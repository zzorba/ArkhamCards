import React, { useCallback, useContext, useMemo } from 'react';
import { find, filter, throttle } from 'lodash';
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
import { useFlag, useNavigationButtonPressed } from '@components/core/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';

function searchOptionsHeight(fontScale: number) {
  return 20 + (fontScale * 20 + 8) + 12;
}

function MyDecksView({ componentId }: NavigationProps) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const { myDecks } = useSelector(getMyDecksState);
  const [localDecksOnly, toggleLocalDecksOnly] = useFlag(false);
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

  const searchOptionControls = useMemo(() => {
    const hasLocalDeck = !!find(myDecks, deckId => deckId.id.local);
    const hasOnlineDeck = !!find(myDecks, deckId => !deckId.id.local);
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
          useGestureHandler
          value={localDecksOnly}
          onValueChange={toggleLocalDecksOnly}
        />
      </View>
    );
  }, [myDecks, localDecksOnly, typography, toggleLocalDecksOnly]);

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

  const onlyDecks = useMemo(() => {
    if (localDecksOnly) {
      return filter(myDecks, deckId => deckId.id.local);
    }
    return undefined;
  }, [myDecks, localDecksOnly]);

  return (
    <MyDecksComponent
      searchOptions={{
        controls: searchOptionControls,
        height: searchOptionsHeight(fontScale),
      }}
      customFooter={customFooter}
      deckClicked={deckNavClicked}
      onlyDecks={onlyDecks}
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
        icon: iconsMap.add,
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
  searchOption: {
    marginRight: 2,
  },
  button: {
    flex: 1,
  },
});
