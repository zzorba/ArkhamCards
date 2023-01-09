import React, { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find, filter, map, sortBy, partition, flatMap, uniq } from 'lodash';
import { t } from 'ttag';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

import DeckList from './DeckList';
import { Campaign } from '@actions/types';
import Card from '@data/types/Card';
import CollapsibleSearchBox, { SearchOptions } from '@components/core/CollapsibleSearchBox';
import space, { s, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { ScrollView } from 'react-native-gesture-handler';
import { Toggles, useToggles } from '@components/core/hooks';
import { localizeTag, TagChicletButton } from '@components/deck/TagChiclet';
import ArkhamButton from '@components/core/ArkhamButton';
import { useDialog } from '@components/deck/dialogs';
import useTagPile from '@components/deck/useTagPile';
import { useDeckTags } from '@components/deck/hooks';
import NewDialog from '@components/core/NewDialog';
import { DeckActions } from '@data/remote/decks';
import { AppState } from '@reducers/index';
import { saveDeckChanges } from '@components/deck/actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

interface Props {
  deckIds: MiniDeckT[];
  deckToCampaign?: { [uuid: string]: Campaign };
  deckClicked: (deck: LatestDeckT, investigator: Card | undefined) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  connectionProblemBanner?: React.ReactNode;
  customFooter?: ReactNode;
  searchOptions?: SearchOptions;
  isEmpty?: boolean;
  deckActions: DeckActions;
  tagsEditable?: boolean;
}

type DeckDispatch = ThunkDispatch<AppState, unknown, Action>;
function useDeckTagPile(
  deckIds: MiniDeckT[],
  syncToggles: (toggles: Toggles) => void,
  deckActions: DeckActions
): {
  tagPile: React.ReactNode;
  clearSelectedTags: () => void;
  onEditDeckTags: (deck: LatestDeckT, investigator: Card | undefined) => void;
  editTagDialog: React.ReactNode;
} {
  const { colors, typography } = useContext(StyleContext);
  const delayedSync = useCallback((toggles: Toggles) => {
    setTimeout(() => {
      syncToggles(toggles);
    }, 100);
  }, [syncToggles]);

  const [selection, onSelectTag,, setTags] = useToggles({}, delayedSync);
  const allTags = useMemo(() => uniq(flatMap(deckIds, d => d?.tags || [])), [deckIds]);
  const [selectedTags, otherTags] = useMemo(() => {
    const [selected, other] = partition(
      sortBy(allTags, t => localizeTag(t)),
      t => !!selection[t]
    );
    return [selected, other];
  }, [allTags, selection]);
  const possibleOtherTags = useMemo(() => {
    if (selectedTags.length === 0) {
      return otherTags;
    }
    const s = new Set(selectedTags);
    const eligibleDecks = filter(deckIds, d => !!find(d?.tags, t => s.has(t)));
    const eligibleTags = new Set(flatMap(eligibleDecks, d => d?.tags || []));
    return filter(otherTags, t => eligibleTags.has(t));
  }, [selectedTags, otherTags, deckIds]);
  const clear = useCallback(() => setTags({}), [setTags]);

  // Stuff for the dialog
  const [{ editDeck, editInvestigator }, setEditDeck] = useState<{ editDeck?: LatestDeckT; editInvestigator?: Card }>({});
  const { deckTags, dirty, toggleDeckTag, setDeckTag, setInitialTags } = useDeckTags();
  const [tagPile, setAddVisible] = useTagPile({ deckTags, toggleDeckTag, setDeckTag, allTags, editable: true });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const dispatch: DeckDispatch = useDispatch();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const onSaveDeck = useCallback(async(): Promise<boolean> => {
    if (!editDeck) {
      return false;
    }
    setSaving(true);
    setError(undefined);
    const tags = flatMap(deckTags, (value, tag) => value ? [tag] : []).join(' ');
    try {
      await dispatch(saveDeckChanges(userId, deckActions, editDeck.deck, { tags }));
      return false;
    } catch (e) {
      if (e.message === 'badAccessToken') {
        setError(t`Your ArkhamDB login has expired.\n\nYou will need to login again on the Settings tab before you can save changes to this deck.`)
      } else {
        setError(e.message);
      }
      return true;
    } finally {
      setSaving(false)
    }
  }, [dispatch, editDeck, deckTags, userId, deckActions, setSaving]);
  const { dialog, showDialog } = useDialog({
    title: t`Edit deck tags`,
    backgroundColor: editInvestigator ? colors.faction[editInvestigator.factionCode() || 'neutral'].background : undefined,
    description: editDeck?.name,
    content: saving ? <NewDialog.SpinnerLine message={t`Saving`} /> : (
      <View>
        { tagPile }
        { !!error && (
          <Text style={[space.paddingM, typography.small]}>
            { error }
          </Text>
        ) }
      </View>
    ),
    allowDismiss: !dirty,
    confirm: {
      disabled: !dirty,
      title: t`Save`,
      color: dirty ? undefined : 'light_gray_outline',
      onPress: onSaveDeck,
    },
    dismiss: dirty ? {
      title: t`Cancel`,
      color: 'red',
    } : undefined,
  });
  const onEditDeckTags = useCallback((deck: LatestDeckT, investigator: Card | undefined) => {
    setInitialTags(deck.tags?.length ? deck.tags : [investigator?.factionCode() || 'neutral']);
    setEditDeck({ editDeck: deck, editInvestigator: investigator });
    setAddVisible(false);
    setError(undefined);
    showDialog();
  }, [setError, setEditDeck, setAddVisible, setInitialTags, showDialog]);
  const tagPileControls = useMemo(() => {
    return (
      <>
        { !!selectedTags.length && (
          <View style={[{ flexDirection: 'column' }, space.paddingTopS]}>
            <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[space.paddingSideXs, { flexDirection: 'row', alignItems: 'center' }]}>
              { map(selectedTags, t => <TagChicletButton key={t} selected onSelectTag={onSelectTag} tag={t} showIcon />) }
            </ScrollView>
          </View>
        ) }
        { !!possibleOtherTags.length && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[space.paddingTopS, space.paddingSideXs]}>
            { map(possibleOtherTags, t => <TagChicletButton key={t} selected={false} onSelectTag={onSelectTag} tag={t} />) }
          </ScrollView>
        ) }
      </>
    );
  }, [selectedTags, possibleOtherTags, onSelectTag])
  return {
    tagPile: tagPileControls,
    clearSelectedTags: clear,
    onEditDeckTags,
    editTagDialog: dialog,
  };
}

export default function DeckListComponent({
  deckIds,
  deckToCampaign,
  deckClicked,
  onRefresh,
  connectionProblemBanner,
  refreshing,
  customFooter,
  searchOptions,
  isEmpty,
  deckActions,
  tagsEditable,
}: Props) {
  const { width, typography } = useContext(StyleContext);
  const [searchTerm, setSearchTerm] = useState('');
  const handleDeckClick = useCallback((deck: LatestDeckT, investigator: Card | undefined) => {
    Keyboard.dismiss();
    deckClicked(deck, investigator);
  }, [deckClicked]);

  const [selectedTags, setSelectedTags] = useState<Toggles>({});
  const { tagPile, editTagDialog, clearSelectedTags, onEditDeckTags } = useDeckTagPile(deckIds, setSelectedTags, deckActions);
  const header = useMemo(() => (
    <View style={styles.header}>
      { !!connectionProblemBanner && connectionProblemBanner }
      { tagPile }
    </View>
  ), [tagPile, connectionProblemBanner]);
  const tagButton = useMemo(() => {
    if (find(selectedTags, t => !!t)) {
      return (
        <View style={{ flex: 1, width, paddingLeft: 12 }}>
          <ArkhamButton
            icon="filter-clear"
            title={t`Clear tags`}
            onPress={clearSelectedTags}
            grow
          />
        </View>
      )
    }
    return null;
  }, [selectedTags, clearSelectedTags, width]);

  const renderFooter = useCallback((empty: boolean) => {
    if (isEmpty && !refreshing) {
      return (
        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={[typography.text, space.marginBottomM]}>
              { t`No decks yet.\n\nUse the + button to create a new one.` }
            </Text>
          </View>
          { tagButton }
          { customFooter }
        </View>
      );
    }
    if (searchTerm && empty) {
      return (
        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={[typography.text, typography.center, space.marginBottomM]}>
              { t`No matching decks for "${searchTerm}".` }
            </Text>
          </View>
          { tagButton }
          { customFooter }
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        { tagButton }
        { customFooter }
      </View>
    );
  }, [isEmpty, refreshing, customFooter, searchTerm, typography, tagButton]);
  return (
    <>
      <CollapsibleSearchBox
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        prompt={t`Search decks`}
        advancedOptions={searchOptions}
      >
        { onScroll => (
          <DeckList
            deckIds={deckIds}
            header={header}
            footer={renderFooter}
            searchTerm={searchTerm}
            selectedTags={selectedTags}
            deckToCampaign={deckToCampaign}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onScroll={onScroll}
            deckClicked={handleDeckClick}
            onEditDeckTags={tagsEditable ? onEditDeckTags : undefined}
          />
        ) }
      </CollapsibleSearchBox>
      { editTagDialog }
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'column',
  },
  footer: {
    width: '100%',
    paddingTop: s,
    paddingBottom: s,
    marginBottom: 60,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  footerText: {
    padding: m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
