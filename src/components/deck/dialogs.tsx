import React, { useEffect, useMemo, useState, useCallback, useContext, useRef } from 'react';
import { forEach, keys, map, range, throttle } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import deepDiff from 'deep-diff';
import { Navigation } from 'react-native-navigation';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { t } from 'ttag';

import NewDialog from '@components/core/NewDialog';
import { Campaign, Deck, ParsedDeck, Slots, UPDATE_DECK_EDIT } from '@actions/types';
import { useDispatch } from 'react-redux';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCounter } from '@components/core/hooks';
import { saveDeckChanges, uploadLocalDeck } from '@components/deck/actions';
import { updateCampaign } from '@components/campaign/actions';
import { AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { ParsedDeckResults } from './hooks';

interface DialogOptions {
  title: string;
  confirm?: {
    title: string;
    onPress: () => void;
  };
  dismiss?: {
    title: string;
    onPress?: () => void;
  };
  content: React.ReactNode;
  allowDismiss?: boolean;
  alignment?: 'center' | 'bottom';
}

export function useDialog({
  title,
  confirm,
  dismiss,
  content,
  allowDismiss,
  alignment,
}: DialogOptions): {
  dialog: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
} {
  const [visible, setVisible] = useState(false);
  const confirmOnPress = confirm?.onPress;
  const dismissOnPress = dismiss?.onPress;
  const onDismiss = useCallback(() => {
    setVisible(false);
    dismissOnPress && dismissOnPress();
  }, [setVisible, dismissOnPress]);
  const onConfirm = useCallback(() => {
    setVisible(false);
    confirmOnPress && confirmOnPress();
  }, [setVisible, confirmOnPress]);
  const dialog = useMemo(() => {
    return (
      <NewDialog
        title={title}
        dismiss={dismiss || allowDismiss ? {
          title: dismiss?.title,
          onPress: onDismiss,
        } : undefined}
        confirm={confirm ? {
          title: confirm.title,
          onPress: onConfirm,
        } : undefined}
        visible={visible}
        alignment={alignment}
      >
        { content }
      </NewDialog>
    );
  }, [title, confirm, dismiss, visible, alignment, onDismiss, onConfirm, content, allowDismiss]);
  return {
    visible,
    setVisible,
    dialog,
  };
}


interface PickerItem<T> {
  icon?: string;
  title: string;
  value: T;
}
interface PickerDialogOptions<T> {
  title: string;
  description?: string;
  items: PickerItem<T>[];
  selectedValue?: T;
  onValueChange: (value: T) => void;
}
export function usePickerDialog<T>({
  title,
  description,
  items,
  selectedValue,
  onValueChange,
}: PickerDialogOptions<T>): {
  dialog: React.ReactNode;
  showDialog: () => void;
} {
  const { borderStyle, typography } = useContext(StyleContext);
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const onValuePress = useCallback((value: T) => {
    onValueChange(value);
    if (setVisibleRef.current) {
      setVisibleRef.current(false);
    }
  }, [onValueChange, setVisibleRef]);
  const content = useMemo(() => {
    return (
      <View>
        { !!description && (
          <View style={[space.marginS, space.paddingBottomS, { borderBottomWidth: StyleSheet.hairlineWidth }, borderStyle]}>
            <Text style={typography.text}>{ description } </Text>
          </View>
        )}
        { map(items, (item, idx) => (
          <NewDialog.PickerItem<T>
            key={idx}
            icon={item.icon}
            text={item.title}
            value={item.value}
            onValueChange={onValuePress}
            selected={selectedValue === item.value}
            last={idx === items.length - 1}
          />
        )) }
      </View>
    );
  }, [items, onValuePress, borderStyle, typography, description, selectedValue]);
  const { setVisible, dialog } = useDialog({
    title,
    allowDismiss: true,
    content,
    alignment: 'bottom',
  });
  useEffect(() => {
    setVisibleRef.current = setVisible;
  }, [setVisible]);
  const showDialog = useCallback(() => setVisible(true), [setVisible]);
  return {
    dialog,
    showDialog,
  };
}


interface BasicDialogResult {
  savingDialog: React.ReactNode;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  saveError: string | undefined;
  setSaveError: (saveError: string | undefined) => void;
}


export function useBasicDialog(title: string): BasicDialogResult {
  const { typography } = useContext(StyleContext);
  const [saveError, setSaveError] = useState<string | undefined>();
  const dismissSaveError = useCallback(() => {
    setSaveError(undefined);
  }, [setSaveError]);
  const content = useMemo(() => saveError ? (
    <Text style={[space.paddingM, typography.small]}>
      { saveError }
    </Text>
  ) : (
    <LoadingSpinner large inline />
  ), [saveError, typography.small]);
  const {
    visible,
    setVisible,
    dialog,
  } = useDialog({
    title: saveError ? t`Error` : title,
    dismiss: saveError ? { onPress: dismissSaveError, title: t`Okay` } : undefined,
    content,
  });
  return {
    savingDialog: dialog,
    saving: visible,
    setSaving: setVisible,
    saveError,
    setSaveError,
  };
}


type DeckDispatch = ThunkDispatch<AppState, any, Action>;
export function useUploadLocalDeckDialog(
  deck?: Deck,
  parsedDeck?: ParsedDeck,
): {
  uploadLocalDeckDialog: React.ReactNode;
  uploadLocalDeck: () => void;
} {
  const { saving, setSaving, savingDialog } = useBasicDialog(t`Uplodaing deck`);
  const deckDispatch: DeckDispatch = useDispatch();
  const doUploadLocalDeck = useMemo(() => throttle((isRetry?: boolean) => {
    if (!parsedDeck || !deck) {
      return;
    }
    if (!saving || isRetry) {
      setSaving(true);
      deckDispatch(uploadLocalDeck(deck)).then(() => {
        setSaving(false);
      }, () => {
        setSaving(false);
      });
    }
  }, 200), [deckDispatch, parsedDeck, saving, deck, setSaving]);
  return {
    uploadLocalDeckDialog: savingDialog,
    uploadLocalDeck: doUploadLocalDeck,
  };
}

export function useAdjustXpDialog({
  deck,
  deckEdits,
}: ParsedDeckResults) {
  const { borderStyle, typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const [xpAdjustment, incXp, decXp, setXpAdjustment] = useCounter(deckEdits?.xpAdjustment || 0, {});
  const content = useMemo(() => {
    return (
      <View style={styles.column}>
        <View style={[space.marginS, space.paddingBottomS, { borderBottomWidth: StyleSheet.hairlineWidth }, borderStyle]}>
          <Text style={typography.text}>
            { t`If you have just completed a scenario, use the 'Upgrade' button which will track changes.` }
          </Text>
        </View>
        <NewDialog.ContentLine icon="xp" text={t`XP earned`}
          control={(
            <PlusMinusButtons
              count={deck?.xp || 0}
              dialogStyle
            />
          )}
        />
        <NewDialog.ContentLine text={t`Adjustment:`} control={(
          <PlusMinusButtons
            onIncrement={incXp}
            onDecrement={decXp}
            count={xpAdjustment}
            dialogStyle
            allowNegative
          />
        )} />
      </View>
    );
  }, [xpAdjustment, typography, borderStyle, deck, incXp, decXp]);
  const saveChanges = useCallback(() => {
    if (deck) {
      dispatch({
        type: UPDATE_DECK_EDIT,
        id: deck.id,
        updates: {
          xpAdjustment,
        },
      });
    }
  }, [dispatch, deck, xpAdjustment]);
  const { visible, setVisible, dialog } = useDialog({
    title: t`Adjust XP`,
    content,
    confirm: {
      title: t`Done`,
      onPress: saveChanges,
    },
    dismiss: {
      title: t`Cancel`,
    },
  });

  useEffect(() => {
    if (visible) {
      setXpAdjustment(deckEdits?.xpAdjustment || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const showXpAdjustmentDialog = useMemo(() => throttle(() => setVisible(true), 500), [setVisible]);
  return {
    showXpAdjustmentDialog,
    xpAdjustmentDialog: dialog,
  };
}

export function useSaveDialog(
  {
    deck,
    visible,
    deckEdits,
    parsedDeck,
    deckEditsRef,
    cards,
    tabooSetId,
    mode,
  }: ParsedDeckResults,
  campaign?: Campaign,
): {
  saving: boolean;
  saveEdits: () => void;
  saveEditsAndDismiss: () => void;
  savingDialog: React.ReactNode;
  slotDeltas: {
    removals: Slots;
    additions: Slots;
    ignoreDeckLimitChanged: boolean;
  };
  hasPendingEdits: boolean;
  addedBasicWeaknesses: string[];
  mode: 'edit' | 'upgrade' | 'view';
} {
  const dispatch = useDispatch();
  const deckDispatch: DeckDispatch = useDispatch();
  const {
    saving,
    setSaving,
    setSaveError,
    savingDialog,
  } = useBasicDialog(t`Saving`);
  const handleSaveError = useCallback((err: Error) => {
    setSaving(false);
    setSaveError(err.message || 'Unknown Error');
  }, [setSaveError, setSaving]);

  const updateCampaignWeaknessSet = useCallback((newAssignedCards: string[]) => {
    if (campaign) {
      const assignedCards = {
        ...(campaign.weaknessSet && campaign.weaknessSet.assignedCards) || {},
      };
      forEach(newAssignedCards, code => {
        assignedCards[code] = (assignedCards[code] || 0) + 1;
      });
      dispatch(updateCampaign(
        campaign.id,
        {
          weaknessSet: {
            ...(campaign.weaknessSet || {}),
            assignedCards,
          },
        },
      ));
    }
  }, [campaign, dispatch]);

  const [hasPendingEdits, setHasPendingEdits] = useState(false);
  const [slotDeltas, setSlotDeltas] = useState<{
    removals: Slots;
    additions: Slots;
    ignoreDeckLimitChanged: boolean
  }>({ removals: {}, additions: {}, ignoreDeckLimitChanged: false });

  useEffect(() => {
    if (!visible || !deck || !deckEdits) {
      return;
    }
    const slotDeltas: {
      removals: Slots;
      additions: Slots;
      ignoreDeckLimitChanged: boolean;
    } = {
      removals: {},
      additions: {},
      ignoreDeckLimitChanged: false,
    };
    forEach(deck.slots, (deckCount, code) => {
      const currentDeckCount = deckEdits.slots[code] || 0;
      if (deckCount > currentDeckCount) {
        slotDeltas.removals[code] = deckCount - currentDeckCount;
      }
    });
    forEach(deckEdits.slots, (currentCount, code) => {
      const ogDeckCount = deck.slots[code] || 0;
      if (ogDeckCount < currentCount) {
        slotDeltas.additions[code] = currentCount - ogDeckCount;
      }
      const ogIgnoreCount = ((deck.ignoreDeckLimitSlots || {})[code] || 0);
      if (ogIgnoreCount !== (deckEdits.ignoreDeckLimitSlots[code] || 0)) {
        slotDeltas.ignoreDeckLimitChanged = true;
      }
    });

    const originalTabooSet: number = (deck.taboo_id || 0);
    const metaChanges = deepDiff(deckEdits.meta, deck.meta || {});
    setHasPendingEdits(
      (deckEdits.nameChange && deck.name !== deckEdits.nameChange) ||
      (deckEdits.tabooSetChange !== undefined && originalTabooSet !== deckEdits.tabooSetChange) ||
      (deck.previous_deck && (deck.xp_adjustment || 0) !== deckEdits.xpAdjustment) ||
      keys(slotDeltas.removals).length > 0 ||
      keys(slotDeltas.additions).length > 0 ||
      slotDeltas.ignoreDeckLimitChanged ||
      (!!metaChanges && metaChanges.length > 0)
    );
    setSlotDeltas(slotDeltas);
  }, [deck, deckEdits, visible]);

  const addedBasicWeaknesses = useMemo(() => {
    if (!cards || !deck) {
      return [];
    }
    const addedWeaknesses: string[] = [];
    forEach(slotDeltas.additions, (addition, code) => {
      const card = cards[code];
      if (card && card.subtype_code === 'basicweakness') {
        forEach(range(0, addition), () => addedWeaknesses.push(code));
      }
    });
    return addedWeaknesses;
  }, [deck, cards, slotDeltas]);

  const actuallySaveEdits = useCallback(async(dismissAfterSave: boolean, isRetry?: boolean) => {
    if (saving && !isRetry) {
      return;
    }
    if (!deck || !parsedDeck || !deckEditsRef.current) {
      return;
    }
    setSaving(true);
    try {
      if (hasPendingEdits) {
        const problem = parsedDeck.problem;
        const problemField = problem ? problem.reason : '';
        await deckDispatch(saveDeckChanges(
          deck,
          {
            name: deckEditsRef.current.nameChange,
            slots: deckEditsRef.current.slots,
            ignoreDeckLimitSlots: deckEditsRef.current.ignoreDeckLimitSlots,
            problem: problemField,
            spentXp: parsedDeck.changes ? parsedDeck.changes.spentXp : 0,
            xpAdjustment: deckEditsRef.current.xpAdjustment,
            tabooSetId,
            meta: deckEditsRef.current.meta,
          }
        ));
        if (addedBasicWeaknesses.length) {
          updateCampaignWeaknessSet(addedBasicWeaknesses);
        }
      }

      if (dismissAfterSave) {
        Navigation.dismissAllModals();
      } else {
        dispatch({
          type: UPDATE_DECK_EDIT,
          id: deck.id,
          updates: {
            mode: 'view',
          },
        });
        setSaving(false);
      }
    } catch(e) {
      await handleSaveError(e);
    }
  }, [deck, saving, addedBasicWeaknesses, hasPendingEdits, parsedDeck, deckEditsRef, tabooSetId, dispatch, deckDispatch, handleSaveError, setSaving, updateCampaignWeaknessSet]);

  const saveEdits = useMemo(() => throttle((isRetry?: boolean) => actuallySaveEdits(false, isRetry), 500), [actuallySaveEdits]);
  const saveEditsAndDismiss = useMemo((isRetry?: boolean) => throttle(() => actuallySaveEdits(true, isRetry), 500), [actuallySaveEdits]);
  return {
    saving,
    saveEdits,
    saveEditsAndDismiss,
    savingDialog,
    slotDeltas,
    hasPendingEdits,
    addedBasicWeaknesses,
    mode: hasPendingEdits && mode === 'view' ? 'edit' : mode,
  };
}


const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});
