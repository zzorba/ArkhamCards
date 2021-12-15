import React, { useEffect, useMemo, useState, useCallback, useContext, useRef } from 'react';
import { find, forEach, map, throttle } from 'lodash';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { t } from 'ttag';

import NewDialog from '@components/core/NewDialog';
import { Deck, getDeckId, ParsedDeck, UPDATE_DECK_EDIT } from '@actions/types';
import { useDispatch } from 'react-redux';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCounter } from '@components/core/hooks';
import { SaveDeckChanges, saveDeckChanges, uploadLocalDeck } from '@components/deck/actions';
import { AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { ParsedDeckResults, DeckEditState, useDeckEditState } from './hooks';
import DeckButton, { DeckButtonIcon } from './controls/DeckButton';
import DeckBubbleHeader from './section/DeckBubbleHeader';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions, useDeckActions } from '@data/remote/decks';
import { useUploadLocalDeckRequest } from '@data/remote/campaigns';
import Card from '@data/types/Card';

interface DialogOptions {
  title: string;
  investigator?: Card;
  confirm?: {
    title: string;
    disabled?: boolean;
    onPress: () => void | Promise<boolean>;
    loading?: boolean;
  };
  dismiss?: {
    title?: string;
    onPress?: () => void;
  };
  content: React.ReactNode;
  allowDismiss?: boolean;
  alignment?: 'center' | 'bottom';
  avoidKeyboard?: boolean;
  customButtons?: React.ReactNode[];
}

export function useDialog({
  title,
  investigator,
  confirm,
  dismiss,
  content,
  allowDismiss,
  alignment,
  avoidKeyboard,
  customButtons,
}: DialogOptions): {
  dialog: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  showDialog: () => void;
} {
  const [visible, setVisible] = useState(false);
  const confirmOnPress = confirm?.onPress;
  const dismissOnPress = dismiss?.onPress;
  const onDismiss = useCallback(() => {
    setVisible(false);
    dismissOnPress && dismissOnPress();
  }, [setVisible, dismissOnPress]);
  const onConfirm = useCallback(async() => {
    if (confirmOnPress) {
      const result = confirmOnPress();
      if (typeof result === 'object') {
        const cancel = await result;
        if (cancel) {
          return;
        }
      }
    }
    setVisible(false);
  }, [setVisible, confirmOnPress]);
  const buttons = useMemo(() => {
    const result: React.ReactNode[] = [
      ...(customButtons || []),
    ];
    if (dismiss?.title) {
      result.push(
        <DeckButton
          key="cancel"
          icon="dismiss"
          color={confirm ? 'red_outline' : undefined}
          title={dismiss.title}
          thin
          onPress={onDismiss}
        />
      );
    }
    if (confirm) {
      result.push(
        <DeckButton
          key="save"
          icon="check-thin"
          title={confirm.title}
          disabled={confirm.disabled}
          thin
          loading={confirm.loading}
          onPress={onConfirm}
        />
      );
    }
    return result;
  }, [confirm, onConfirm, onDismiss, customButtons, dismiss]);
  const dialog = useMemo(() => {
    return (
      <NewDialog
        title={title}
        investigator={investigator}
        dismissable={!!dismiss || allowDismiss}
        onDismiss={onDismiss}
        visible={visible}
        buttons={buttons}
        alignment={alignment}
        avoidKeyboard={avoidKeyboard}
        forceVerticalButtons={!!customButtons}
      >
        { content }
      </NewDialog>
    );
  }, [title, dismiss, visible, alignment, customButtons, onDismiss, buttons, investigator, content, allowDismiss, avoidKeyboard]);
  const showDialog = useCallback(() => setVisible(true), [setVisible]);
  return {
    visible,
    setVisible,
    dialog,
    showDialog,
  };
}

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
  icon?: DeckButtonIcon;
}
interface AlertState {
  title: string;
  description: string;
  buttons: AlertButton[];
}

function AlertButtonComponent({ button, onClose }: { button: AlertButton; onClose: () => void }) {
  const onPress = useCallback(() => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  }, [button, onClose]);
  const icon = useMemo(() => {
    if (button.icon) {
      return button.icon;
    }
    if (button.style === 'destructive') {
      return 'delete';
    }
    if (button.style === 'cancel') {
      return 'dismiss';
    }
    return 'check-thin';
  }, [button]);
  const color = useMemo(() => {
    if (button.style === 'cancel') {
      return 'red_outline';
    }
    if (button.style === 'destructive') {
      return 'red';
    }
    return 'default';
  }, [button.style]);
  return (
    <DeckButton
      title={button.text}
      color={color}
      onPress={onPress}
      thin
      icon={icon}
    />
  );
}

export type ShowAlert = (title: string, description: string, buttons?: AlertButton[]) => void;
export function useAlertDialog(forceVerticalButtons?: boolean): [React.ReactNode, ShowAlert] {
  const { typography } = useContext(StyleContext);
  const [state, setState] = useState<AlertState | undefined>();
  const onClose = useCallback(() => {
    setState(undefined);
  }, [setState]);
  const onDismiss = useCallback(() => {
    forEach(state?.buttons || [], button => {
      if (button.style === 'cancel' && button.onPress) {
        button.onPress();
      }
    });
    onClose();
  }, [onClose, state]);
  const buttons = useMemo(() => {
    if (!state) {
      return [];
    }
    return map(state.buttons, (button, idx) => {
      return <AlertButtonComponent key={idx} button={button} onClose={onClose} />;
    });
  }, [state, onClose]);
  const dialog = useMemo(() => {
    return (
      <NewDialog
        title={state?.title || ''}
        dismissable={!!state && (state.buttons.length === 0 || !!find(state.buttons, button => button.style === 'cancel'))}
        onDismiss={onDismiss}
        visible={!!state}
        buttons={buttons}
        alignment="center"
        forceVerticalButtons={forceVerticalButtons}
      >
        <View style={space.paddingS}>
          <Text style={typography.small}>{ state?.description || '' }</Text>
        </View>
      </NewDialog>
    );
  }, [state, buttons, onDismiss, typography, forceVerticalButtons]);
  const showAlert = useCallback((title: string, description: string, buttons: AlertButton[] = [{ text: t`Okay` }]) => {
    setState({
      title,
      description,
      buttons: buttons.length > 0 ? buttons : [{ text: t`Okay` }],
    });
  }, [setState]);
  return [dialog, showAlert];
}

interface SimpleTextDialogOptions {
  title: string;
  value: string;
  prompt?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onValidate?: (value: string) => Promise<string | undefined>;
}
export function useSimpleTextDialog({
  title,
  value,
  prompt,
  onValueChange,
  onValidate,
  placeholder,
}: SimpleTextDialogOptions): [React.ReactNode, () => void] {
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const [liveValue, setLiveValue] = useState(value);
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const { typography } = useContext(StyleContext);
  useEffect(() => {
    setLiveValue(value);
  }, [value, setLiveValue]);
  useEffect(() => {
    if (error) {
      setError(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveValue]);

  const doSubmit = useCallback(async(submitValue: string) => {
    if (value !== submitValue) {
      if (onValidate) {
        setSubmitting(true);
        const error = await onValidate(submitValue);
        if (error) {
          setError(error);
          setSubmitting(false);
          // Cancel the close event
          return true;
        }
        setSubmitting(false);
      } else if (onValueChange) {
        onValueChange(submitValue);
      }
    }
    if (setVisibleRef.current) {
      setVisibleRef.current(false);
    }
    return false;
  }, [value, onValidate, onValueChange, setVisibleRef]);

  const onSave = useCallback(() => {
    return doSubmit(liveValue);
  }, [doSubmit, liveValue]);
  const content = useMemo(() => {
    return (
      <>
        { !!prompt && <View style={space.marginS}><Text style={typography.text}>{prompt}</Text></View>}
        <View style={space.marginS}>
          <NewDialog.TextInput
            textInputRef={textInputRef}
            value={liveValue}
            error={error}
            placeholder={placeholder}
            onChangeText={setLiveValue}
            onSubmit={doSubmit}
          />
        </View>
      </>
    );
  }, [setLiveValue, doSubmit, placeholder, prompt, typography, liveValue, error]);
  const { setVisible, visible, dialog } = useDialog({
    title,
    allowDismiss: true,
    avoidKeyboard: true,
    content,
    alignment: 'bottom',
    confirm: {
      title: t`Done`,
      onPress: onSave,
      loading: submitting,
    },
    dismiss: {
      title: t`Cancel`,
    },
  });
  useEffect(() => {
    if (visible && Platform.OS === 'android') {
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  }, [visible]);
  useEffect(() => {
    setVisibleRef.current = setVisible;
  }, [setVisible]);
  const showDialog = useCallback(() => setVisible(true), [setVisible]);
  return [
    dialog,
    showDialog,
  ];
}

interface PickerItemHeader {
  type: 'header';
  title: string;
  value?: undefined;
}

interface PickerItem<T> {
  type?: undefined;
  title: string;
  description?: string;
  value: T;
  icon?: string;
  iconNode?: React.ReactNode;
  rightNode?: React.ReactNode;
}
export type Item<T> = PickerItemHeader | PickerItem<T>;
interface PickerDialogOptions<T> {
  title: string;
  investigator?: Card;
  description?: string;
  items: Item<T>[];
  selectedValue?: T;
  onValueChange: (value: T) => void;
}
export function usePickerDialog<T>({
  title,
  investigator,
  description,
  items,
  selectedValue,
  onValueChange,
}: PickerDialogOptions<T>): [React.ReactNode, () => void] {
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
        { map(items, (item, idx) => item.type === 'header' ? (
          <DeckBubbleHeader title={item.title} key={idx} />
        ) : (
          <NewDialog.PickerItem<T>
            key={idx}
            iconName={item.icon}
            iconNode={item.iconNode}
            text={item.title}
            description={item.description}
            value={item.value}
            rightNode={item.rightNode}
            onValueChange={onValuePress}
            // tslint:disable-next-line
            selected={selectedValue === item.value}
            last={idx === items.length - 1 || items[idx + 1].type === 'header'}
          />
        )) }
      </View>
    );
  }, [items, onValuePress, borderStyle, typography, description, selectedValue]);
  const { setVisible, dialog } = useDialog({
    title,
    investigator,
    allowDismiss: true,
    content,
    alignment: 'bottom',
  });
  useEffect(() => {
    setVisibleRef.current = setVisible;
  }, [setVisible]);
  const showDialog = useCallback(() => setVisible(true), [setVisible]);
  return [
    dialog,
    showDialog,
  ];
}

interface MultiPickerDialogOptions<T> {
  title: string;
  investigator?: Card;
  description?: string;
  items: Item<T>[];
  selectedValues?: Set<T>;
  onValueChange: (value: T, selected: boolean) => void;
}
export function useMultiPickerDialog<T>({
  title,
  investigator,
  description,
  items,
  selectedValues,
  onValueChange,
}: MultiPickerDialogOptions<T>): [React.ReactNode, () => void] {
  const { borderStyle, typography } = useContext(StyleContext);
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const onValuePress = useCallback((value: T) => {
    onValueChange(value, !selectedValues?.has(value));
  }, [onValueChange, selectedValues]);
  const content = useMemo(() => {
    return (
      <View>
        { !!description && (
          <View style={[space.marginS, space.paddingBottomS, { borderBottomWidth: StyleSheet.hairlineWidth }, borderStyle]}>
            <Text style={typography.text}>{ description } </Text>
          </View>
        )}
        { map(items, (item, idx) => item.type === 'header' ? (
          <DeckBubbleHeader title={item.title} key={idx} />
        ) : (
          <NewDialog.PickerItem<T>
            key={idx}
            iconName={item.icon}
            iconNode={item.iconNode}
            text={item.title}
            value={item.value}
            indicator="check"
            onValueChange={onValuePress}
            // tslint:disable-next-line
            selected={!!selectedValues?.has(item.value)}
            last={idx === items.length - 1 || items[idx + 1].type === 'header'}
          />
        )) }
      </View>
    );
  }, [items, onValuePress, borderStyle, typography, description, selectedValues]);
  const { setVisible, dialog } = useDialog({
    title,
    investigator,
    allowDismiss: true,
    content,
    alignment: 'bottom',
  });
  useEffect(() => {
    setVisibleRef.current = setVisible;
  }, [setVisible]);
  const showDialog = useCallback(() => setVisible(true), [setVisible]);
  return [
    dialog,
    showDialog,
  ];
}

export function useBasicDialog(title: string): [
  React.ReactNode,
  boolean,
  (value: boolean) => void,
  string | undefined,
  (error: string | undefined) => void,
] {
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
    <View style={[space.paddingBottomL, space.paddingTopL]}>
      <LoadingSpinner inline />
    </View>
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
  return [
    dialog,
    visible,
    setVisible,
    saveError,
    setSaveError,
  ];
}


type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;
export function useUploadLocalDeckDialog(
  actions: DeckActions,
  deck?: Deck,
  parsedDeck?: ParsedDeck,
): [React.ReactNode, () => void] {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const replaceLocalDeckRequest = useUploadLocalDeckRequest();
  const [savingDialog, saving, setSaving] = useBasicDialog(t`Uploading deck`);
  const deckDispatch: DeckDispatch = useDispatch();
  const doUploadLocalDeck = useMemo(() => throttle((isRetry?: boolean) => {
    if (!parsedDeck || !deck || !deck.local) {
      return;
    }
    if (!saving || isRetry) {
      setSaving(true);
      deckDispatch(uploadLocalDeck(userId, actions, replaceLocalDeckRequest, deck)).then(() => {
        setSaving(false);
      }, () => {
        setSaving(false);
      });
    }
  }, 200), [deckDispatch, replaceLocalDeckRequest, setSaving, saving, userId, deck, parsedDeck, actions]);
  return [savingDialog, doUploadLocalDeck];
}

export function useAdjustXpDialog({
  deck,
  deckEdits,
}: ParsedDeckResults): [React.ReactNode, () => void] {
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
        id: getDeckId(deck),
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
  return [
    dialog,
    showXpAdjustmentDialog,
  ];
}

export function useSaveDialog(parsedDeckResults: ParsedDeckResults): DeckEditState & {
  saving: boolean;
  saveError: string | undefined;
  saveEdits: () => void;
  saveEditsAndDismiss: () => void;
  savingDialog: React.ReactNode;
} {
  const { slotDeltas, hasPendingEdits, addedBasicWeaknesses, mode } = useDeckEditState(parsedDeckResults);
  const {
    deck,
    parsedDeckRef,
    deckEditsRef,
    tabooSetId,
  } = parsedDeckResults;
  const dispatch = useDispatch();
  const deckDispatch: DeckDispatch = useDispatch();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [
    savingDialog,
    saving,
    setSaving,
    saveError,
    setSaveError,
  ] = useBasicDialog(t`Saving`);
  const handleSaveError = useCallback((err: Error) => {
    setSaving(false);
    setSaveError(err.message || 'Unknown Error');
  }, [setSaveError, setSaving]);
  const deckActions = useDeckActions();

  const actuallySaveEdits = useCallback(async(dismissAfterSave: boolean, isRetry?: boolean) => {
    if (saving && !isRetry) {
      return;
    }
    if (!deck || !parsedDeckRef.current || !deckEditsRef.current) {
      return;
    }
    setSaving(true);
    try {
      if (hasPendingEdits) {
        const problem = parsedDeckRef.current.problem;
        const problemField = problem ? problem.reason : '';
        const deckChanges: SaveDeckChanges = {
          name: deckEditsRef.current.nameChange,
          description: deckEditsRef.current.descriptionChange,
          slots: deckEditsRef.current.slots,
          ignoreDeckLimitSlots: deckEditsRef.current.ignoreDeckLimitSlots,
          side: deckEditsRef.current.side,
          problem: problemField,
          spentXp: parsedDeckRef.current.changes?.spentXp || 0,
          xpAdjustment: deckEditsRef.current.xpAdjustment,
          tabooSetId,
          meta: deckEditsRef.current.meta,
        };
        await deckDispatch(saveDeckChanges(
          userId,
          deckActions,
          deck,
          deckChanges,
        ));
      }

      if (dismissAfterSave) {
        Navigation.dismissAllModals();
      } else {
        dispatch({
          type: UPDATE_DECK_EDIT,
          id: getDeckId(deck),
          updates: {
            mode: 'view',
          },
        });
        setSaving(false);
      }
    } catch(e) {
      handleSaveError(e);
    }
  }, [deck, saving, hasPendingEdits, parsedDeckRef, deckEditsRef, tabooSetId, userId, deckActions,
    dispatch, deckDispatch, handleSaveError, setSaving]);

  const saveEdits = useMemo(() => throttle((isRetry?: boolean) => actuallySaveEdits(false, isRetry), 500), [actuallySaveEdits]);
  const saveEditsAndDismiss = useMemo((isRetry?: boolean) => throttle(() => actuallySaveEdits(true, isRetry), 500), [actuallySaveEdits]);
  return {
    saving,
    saveEdits,
    saveError,
    saveEditsAndDismiss,
    savingDialog,
    slotDeltas,
    hasPendingEdits,
    addedBasicWeaknesses,
    mode,
  };
}

interface CountDialogOptions {
  title: string;
  label: string;
  value: number;
  update: (value: number) => void;
  min?: number;
  max?: number;
}

export type ShowCountDialog = (options: CountDialogOptions) => void;

export function useCountDialog(): [React.ReactNode, ShowCountDialog] {
  const [state, setState] = useState<CountDialogOptions | undefined>();
  const [value, inc, dec, setValue] = useCounter(state?.value || 0, { min: state?.min, max: state?.max });
  const saveChanges = useCallback(() => {
    if (state) {
      state.update(value);
    }
  }, [state, value]);
  const label = state?.label;
  const content = useMemo(() => {
    return (
      <NewDialog.ContentLine
        text={label || ''}
        control={(
          <PlusMinusButtons
            onIncrement={inc}
            onDecrement={dec}
            count={value}
            dialogStyle
            allowNegative={(state?.min || 0) < 0}
            showZeroCount
          />
        )}
      />
    );
  }, [inc, dec, value, label, state]);

  const { setVisible, dialog } = useDialog({
    title: state?.title || '',
    content,
    confirm: {
      title: t`Done`,
      onPress: saveChanges,
    },
    dismiss: {
      title: t`Cancel`,
    },
  });
  const show = useCallback((options: CountDialogOptions) => {
    setState(options);
    setValue(options.value);
    setVisible(true);
  }, [setState, setVisible, setValue]);
  return [dialog, show];
}


const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});
