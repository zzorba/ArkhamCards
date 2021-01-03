import React, { ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { filter } from 'lodash';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { refreshMyDecks } from '@actions';
import { NetworkStatusProps, useNetworkStatus } from '@components/core/withNetworkStatus';
import { Deck } from '@actions/types';
import Card from '@data/Card';
import DeckListComponent from '@components/decklist/DeckListComponent';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import COLORS from '@styles/colors';
import space, { m, s, xs } from '@styles/space';
import { getAllDecks, getMyDecksState, getDeckToCampaignMap } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';

interface OwnProps {
  componentId: string;
  deckClicked: (deck: Deck, investigator?: Card) => void;
  onlyDeckIds?: number[];
  onlyInvestigators?: string[];
  filterDeckIds?: number[];
  filterInvestigators?: string[];
  searchOptions?: SearchOptions;
  customFooter?: ReactNode;
}

type Props = OwnProps & LoginStateProps;

function MyDecksComponent({
  deckClicked,
  onlyDeckIds,
  onlyInvestigators,
  filterDeckIds = [],
  filterInvestigators = [],
  searchOptions,
  customFooter,
  login,
  signedIn,
}: Props) {
  const [{ networkType, isConnected }] = useNetworkStatus();
  const { colors, typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const reLogin = useCallback(() => {
    login();
  }, [login]);
  const decks = useSelector(getAllDecks);
  const deckToCampaign = useSelector(getDeckToCampaignMap);
  const {
    myDecks,
    myDecksUpdated,
    refreshing,
    error,
  } = useSelector(getMyDecksState);
  const onRefresh = useCallback(() => {
    if (!refreshing) {
      dispatch(refreshMyDecks());
    }
  }, [dispatch, refreshing]);

  useEffect(() => {
    const now = new Date();
    if ((!myDecks ||
      myDecks.length === 0 ||
      !myDecksUpdated ||
      (myDecksUpdated.getTime() / 1000 + 600) < (now.getTime() / 1000)
    ) && signedIn) {
      onRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { width } = useWindowDimensions();
  const errorLine = useMemo(() => {
    if (!error && networkType !== NetInfoStateType.none) {
      return null;
    }
    if (!isConnected || networkType === NetInfoStateType.none) {
      return (
        <View style={[styles.banner, styles.warning, { width }]}>
          <Text style={typography.small}>
            { t`Unable to update: you appear to be offline.` }
          </Text>
        </View>
      );
    }
    if (error === 'badAccessToken') {
      return (
        <TouchableOpacity onPress={reLogin} style={[styles.banner, styles.error, { width }]}>
          <Text style={[typography.small, styles.errorText, space.paddingS]}>
            { t`We're having trouble updating your decks at this time. If the problem persists tap here to reauthorize.` }
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={reLogin} style={[styles.banner, styles.error, { width }]}>
        <Text style={[typography.small, styles.errorText, space.paddingS]}>
          { t`An unexpected error occurred (${error}). If restarting the app doesn't fix the problem, tap here to reauthorize.` }
        </Text>
      </TouchableOpacity>
    );
  }, [error, networkType, isConnected, width, typography, reLogin]);

  const signInFooter = useMemo(() => {
    if (signedIn) {
      return null;
    }
    return (
      <View style={[styles.signInFooter, { backgroundColor: colors.L20, width }]}>
        <Text style={[typography.text, space.marginBottomM]}>
          { t`ArkhamDB is a popular deck building site where you can manage and share decks with others.\n\nSign in to access your decks or share decks you have created with others.` }
        </Text>
        <Button onPress={login} title={t`Connect to ArkhamDB`} />
      </View>
    );
  }, [login, signedIn, width, colors, typography]);

  const footer = useMemo(() => {
    return (
      <View style={styles.footer}>
        { !!customFooter && <View style={styles.row}>{ customFooter }</View> }
        { signInFooter }
      </View>
    );
  }, [customFooter, signInFooter]);

  const header = useMemo(() => {
    const searchPadding = !!searchOptions && Platform.OS === 'android';
    if (!errorLine && !searchPadding) {
      return null;
    }
    return (
      <>
        { !!errorLine && (
          <View style={styles.stack}>
            { errorLine }
          </View>
        ) }
        { searchPadding && <View style={styles.searchBarPlaceholder} /> }
      </>
    );
  }, [searchOptions, errorLine]);

  const deckIds = useMemo(() => {
    const onlyInvestigatorSet = onlyInvestigators ? new Set(onlyInvestigators) : undefined;
    const filterDeckIdsSet = new Set(filterDeckIds);
    const filterInvestigatorsSet = new Set(filterInvestigators);
    return filter(onlyDeckIds || myDecks, deckId => {
      const deck = decks[deckId];
      return !filterDeckIdsSet.has(deckId) && (
        !deck || !filterInvestigatorsSet.has(deck.investigator_code)
      ) && (!deck || !onlyInvestigatorSet || onlyInvestigatorSet.has(deck.investigator_code));
    });
  }, [onlyInvestigators, onlyDeckIds, filterDeckIds, filterInvestigators, myDecks, decks]);
  return (
    <DeckListComponent
      searchOptions={searchOptions}
      customHeader={header}
      customFooter={footer}
      deckIds={deckIds}
      deckClicked={deckClicked}
      deckToCampaign={deckToCampaign}
      onRefresh={signedIn ? onRefresh : undefined}
      refreshing={refreshing}
      isEmpty={myDecks.length === 0}
    />
  );
}

export default withLoginState<OwnProps & NetworkStatusProps>(MyDecksComponent);

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'column',
  },
  banner: {
    paddingTop: xs,
    paddingBottom: xs,
    paddingLeft: s,
    paddingRight: s,
  },
  error: {
    backgroundColor: COLORS.red,
  },
  warning: {
    backgroundColor: COLORS.yellow,
  },
  errorText: {
    color: COLORS.white,
  },
  signInFooter: {
    padding: m,
    marginTop: s,
  },
  footer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  searchBarPlaceholder: {
    height: SEARCH_BAR_HEIGHT,
  },
});
