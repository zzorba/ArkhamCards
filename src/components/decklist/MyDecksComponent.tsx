import React, { ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { partition, map, uniq, flatMap } from 'lodash';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import Card from '@data/types/Card';
import DeckListComponent from '@components/decklist/DeckListComponent';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import space, { s } from '@styles/space';
import { getDeckToCampaignMap } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { searchBoxHeight } from '@components/core/SearchBox';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import { useMyDecks } from '@data/hooks';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import useConnectionProblemBanner from '@components/core/useConnectionProblemBanner';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDeckActions } from '@data/remote/decks';

interface OwnProps {
  deckClicked: (deck: LatestDeckT, investigator: Card | undefined) => void;
  onlyDecks?: MiniDeckT[];
  filterDeck?: (deck: MiniDeckT) => string | undefined;
  renderExpandButton?: (reason: string) => React.ReactNode | null;
  searchOptions?: SearchOptions;
  customFooter?: ReactNode;
}

type Props = OwnProps & LoginStateProps;

function MyDecksComponent({
  deckClicked,
  onlyDecks,
  filterDeck,
  renderExpandButton,
  searchOptions,
  customFooter,
  login,
  signedIn,
}: Props) {
  const deckActions = useDeckActions();
  const { userId, arkhamDb } = useContext(ArkhamCardsAuthContext);
  const { typography, fontScale, width } = useContext(StyleContext);
  const reLogin = useCallback(() => {
    login();
  }, [login]);
  const deckToCampaign = useSelector(getDeckToCampaignMap);
  const [{
    myDecks,
    myDecksUpdated,
    refreshing,
    error,
  }, onRefresh] = useMyDecks(deckActions);
  useEffect(() => {
    const now = new Date();
    const cacheArkhamDb = !((!myDecks || myDecks.length === 0 || !myDecksUpdated || (myDecksUpdated.getTime() / 1000 + 600) < (now.getTime() / 1000)) && signedIn);
    onRefresh(cacheArkhamDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, arkhamDb]);

  const doRefresh = useCallback(() => {
    onRefresh(false);
  }, [onRefresh]);

  const signInFooter = useMemo(() => {
    if (signedIn) {
      return null;
    }
    return (
      <View style={styles.signInFooter}>
        <RoundedFactionBlock
          header={<DeckSectionHeader title={t`ArkhamDB Account`} faction="neutral" />}
          footer={<RoundedFooterButton
            icon="world"
            title={t`Connect to ArkhamDB`}
            onPress={login}
          />}
          faction="neutral"
        >
          <View style={space.paddingS}>
            <Text style={typography.text}>
              { t`ArkhamDB is a popular deck building site where you can manage and share decks with others.\n\nSign in to access your decks or share decks you have created with others.` }
            </Text>
          </View>
        </RoundedFactionBlock>
      </View>
    );
  }, [login, signedIn, typography]);

  const [connectionProblemBanner] = useConnectionProblemBanner({ width, arkhamdbState: { error, reLogin } })
  const header = useMemo(() => {
    return connectionProblemBanner;
  }, [searchOptions, fontScale, connectionProblemBanner]);

  const [deckIds, deckReasons] = useMemo(() => {
    if (!filterDeck) {
      return [onlyDecks || myDecks || [], []];
    }
    const [dropped, keep] = partition(map(onlyDecks || myDecks, deckId => {
      return {
        deckId,
        reason: filterDeck ? filterDeck(deckId) : undefined,
      };
    }), p => !!p.reason);
    return [
      map(keep, x => x.deckId),
      uniq(flatMap(dropped, x => x.reason ? [x.reason] : [])),
    ];
  }, [filterDeck, onlyDecks, myDecks]);

  const footer = useMemo(() => {
    return (
      <View style={styles.footer}>
        { !!customFooter && <View style={styles.row}>{ customFooter }</View> }
        { !!renderExpandButton && !!deckReasons.length && (
          flatMap(deckReasons, renderExpandButton)
        ) }
        { signInFooter }
      </View>
    );
  }, [customFooter, signInFooter, renderExpandButton, deckReasons]);

  return (
    <DeckListComponent
      searchOptions={searchOptions}
      customHeader={header}
      customFooter={footer}
      deckIds={deckIds}
      deckClicked={deckClicked}
      deckToCampaign={deckToCampaign}
      onRefresh={signedIn || userId ? doRefresh : undefined}
      refreshing={refreshing}
      isEmpty={myDecks.length === 0}
    />
  );
}

export default withLoginState<OwnProps>(MyDecksComponent);

const styles = StyleSheet.create({
  signInFooter: {
    padding: s,
    paddingTop: 0,
  },
  footer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});
