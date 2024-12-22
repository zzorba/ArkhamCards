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
import DeckButton, { DeckButtonColor, DeckButtonIcon } from './controls/DeckButton';
import DeckBubbleHeader from './section/DeckBubbleHeader';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions, useDeckActions } from '@data/remote/decks';
import { useUploadLocalDeckRequest } from '@data/remote/campaigns';
import Card from '@data/types/Card';
import AppModal from '@components/core/AppModal';
import CardTextComponent from '@components/card/CardTextComponent';
import { parseDeck } from '@lib/parseDeck';
import LanguageContext from '@lib/i18n/LanguageContext';


interface ModalOptions {
  content: React.ReactNode;
  allowDismiss?: boolean;
  alignment?: 'center' | 'bottom';
  avoidKeyboard?: boolean;
}


export function useModal({
  content,
  allowDismiss,
  alignment,
  avoidKeyboard,
}: ModalOptions): {
  dialog: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  showDialog: () => void;
} {
  const [visible, setVisible] = useState(false);
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const dialog = useMemo(() => {
    return (
      <AppModal
        dismissable={allowDismiss}
        onDismiss={onDismiss}
        visible={visible}
        alignment={alignment}
        avoidKeyboard={avoidKeyboard}
      >
        { content }
      </AppModal>
    );
  }, [visible, alignment, onDismiss, content, allowDismiss, avoidKeyboard]);
  const showDialog = useCallback(() => setVisible(true), [setVisible]);
  return {
    visible,
    setVisible,
    dialog,
    showDialog,
  };
}


interface DialogOptions {
  title: string;
  description?: string;
  investigator?: Card;
  backgroundColor?: string;
  confirm?: {
    title: string;
    icon?: DeckButtonIcon;
    color?: DeckButtonColor;
    disabled?: boolean;
    onPress: () => void | Promise<boolean>;
    loading?: boolean;
  };
  dismiss?: {
    title?: string;
    color?: DeckButtonColor;
    onPress?: () => void;
  };
  content: React.ReactNode;
  allowDismiss?: boolean;
  alignment?: 'center' | 'bottom';
  avoidKeyboard?: boolean;
  customButtons?: React.ReactNode[];
  maxHeightPercent?: number;
  noPadding?: boolean;
  forceVerticalButtons?: boolean;
  noScroll?: boolean;
}

export function useDialog({
  title,
  description,
  investigator,
  backgroundColor,
  confirm,
  dismiss,
  content,
  allowDismiss,
  alignment,
  avoidKeyboard,
  customButtons,
  maxHeightPercent,
  noPadding,
  forceVerticalButtons,
  noScroll,
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
          color={dismiss.color || (confirm ? 'red_outline' : undefined)}
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
          icon={confirm.icon || 'check-thin'}
          title={confirm.title}
          color={confirm.color}
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
        backgroundColor={backgroundColor}
        description={description}
        investigator={investigator}
        dismissable={!!dismiss || allowDismiss}
        onDismiss={onDismiss}
        visible={visible}
        buttons={buttons}
        alignment={alignment}
        avoidKeyboard={avoidKeyboard}
        forceVerticalButtons={!!customButtons || forceVerticalButtons}
        maxHeightPercent={maxHeightPercent}
        noPadding={noPadding}
        noScroll={noScroll}
      >
        { content }
      </NewDialog>
    );
  }, [noScroll, backgroundColor, forceVerticalButtons, maxHeightPercent, noPadding, title, dismiss, description, visible, alignment, customButtons, onDismiss, buttons, investigator, content, allowDismiss, avoidKeyboard]);
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
  description?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
  icon?: DeckButtonIcon;
  loading?: boolean;
}
interface AlertState {
  title: string;
  description: string;
  buttons: AlertButton[];
  formatText: boolean;
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
      return 'trash';
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
      detail={button.description}
      color={color}
      loading={button.loading}
      onPress={onPress}
      thin={!button.description}
      icon={icon}
    />
  );
}

export type ShowAlert = (title: string, description: string, buttons?: AlertButton[], options?: { formatText?: boolean }) => void;
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
          { state?.formatText ? <CardTextComponent text={state?.description || ''} /> : (
            <Text style={typography.small}>{ state?.description || '' }</Text>
          ) }
        </View>
      </NewDialog>
    );
  }, [state, buttons, onDismiss, typography, forceVerticalButtons]);
  const showAlert = useCallback((title: string, description: string, buttons: AlertButton[] = [{ text: t`Okay` }], options: { formatText?: boolean } = {}) => {
    setState({
      title,
      description,
      buttons: buttons.length > 0 ? buttons : [{ text: t`Okay` }],
      formatText: options.formatText || false,
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
  disabled?: boolean;
  value: T;
  icon?: string;
  iconNode?: React.ReactNode;
  rightNode?: React.ReactNode;
}
export type Item<T> = PickerItemHeader | PickerItem<T>;
interface PickerDialogOptions<T> {
  title: string;
  investigator?: Card;
  description?: string | React.ReactNode;
  items: Item<T>[];
  selectedValue?: T;
  onValueChange: (value: T) => void;
  noIcons?: boolean;
}
export function usePickerDialog<T>({
  title,
  investigator,
  description,
  items,
  selectedValue,
  onValueChange,
  noIcons,
}: PickerDialogOptions<T>): [React.ReactNode, () => void] {
  const { borderStyle, typography } = useContext(StyleContext);
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const onValuePress = useCallback((value: T) => {
    onValueChange(value);
    if (setVisibleRef.current) {
      setVisibleRef.current(false);
    }
  }, [onValueChange, setVisibleRef]);
  const descriptionSection = useMemo(() => {
    if (!description) {
      return null;
    }
    if (typeof description === 'string') {
      return (
        <View style={[space.marginS, space.paddingBottomS, { borderBottomWidth: StyleSheet.hairlineWidth }, borderStyle]}>
          <Text style={typography.text}>{ description } </Text>
        </View>
      );
    }
    return <>{description}</>;
  }, [description, borderStyle, typography]);
  const content = useMemo(() => {
    return (
      <View>
        { descriptionSection }
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
            disabled={item.disabled}
            rightNode={item.rightNode}
            indicator={noIcons ? 'none' : undefined}
            onValueChange={onValuePress}
            // tslint:disable-next-line
            selected={selectedValue === item.value}
            last={idx === items.length - 1 || items[idx + 1].type === 'header'}
          />
        )) }
      </View>
    );
  }, [items, onValuePress, descriptionSection, noIcons, selectedValue]);
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
            showZeroCount
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

export function useSaveAlert(
  parsedDeckResults: ParsedDeckResults,
  saveEditsAndDismiss: () => void,
): [React.ReactNode, () => void] {
  const { typography } = useContext(StyleContext);
  const [visible, setVisible] = useState<boolean>(false);
  const onClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const currentButtons: AlertButton[] = useMemo(() => {
    return [{
      text: t`Cancel`,
      style: 'cancel',
    }, {
      text: t`Discard Changes`,
      style: 'destructive',
      onPress: () => {
        Navigation.dismissAllModals();
      },
    }, {
      text: t`Save Changes`,
      loading: parsedDeckResults.dirty.current,
      description: parsedDeckResults.dirty.current ? t`Recomputing deck changes...` : undefined,
      onPress: () => {
        saveEditsAndDismiss();
      },
    }];
  }, [parsedDeckResults, saveEditsAndDismiss]);
  const buttons = useMemo(() => {
    return map(currentButtons, (button, idx) => {
      return (
        <AlertButtonComponent
          key={idx}
          button={button}
          onClose={onClose}
        />
      );
    });
  }, [currentButtons, onClose]);
  const dialog = useMemo(() => {
    return (
      <NewDialog
        title={t`Save deck changes?`}
        dismissable
        onDismiss={onClose}
        visible={!!visible}
        buttons={buttons}
        alignment="center"
      >
        <View style={space.paddingS}>
          <Text style={typography.small}>
            { t`Looks like you have made some changes that have not been saved.` }
          </Text>
        </View>
      </NewDialog>
    );
  }, [visible, buttons, onClose, typography]);
  const showAlert = useCallback(() => {
    setVisible(true);
  }, [setVisible]);
  return [dialog, showAlert];
}

export function useSaveDialog(parsedDeckResults: ParsedDeckResults): DeckEditState & {
  saving: boolean;
  saveError: string | undefined;
  saveEdits: () => void;
  handleBackPress: () => boolean;
  savingDialog: React.ReactNode;
} {
  const { slotDeltas, hasPendingEdits, addedBasicWeaknesses, mode } = useDeckEditState(parsedDeckResults);
  const {
    deck,
    visible,
    previousDeck,
    cards,
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
  const { listSeperator } = useContext(LanguageContext);
  const actuallySaveEdits = useCallback(async(dismissAfterSave: boolean, isRetry?: boolean) => {
    if (saving && !isRetry) {
      return;
    }
    if (!deck || !cards || !parsedDeckRef.current || !deckEditsRef.current) {
      return;
    }
    setSaving(true);
    try {
      if (hasPendingEdits) {
        const newParsedDeck = parseDeck(
          deck.investigator_code,
          deckEditsRef.current.meta,
          deckEditsRef.current.slots,
          deckEditsRef.current.ignoreDeckLimitSlots,
          deckEditsRef.current.side,
          cards,
          listSeperator,
          previousDeck,
          deckEditsRef.current.xpAdjustment,
          deck
        );
        const problem = newParsedDeck ? newParsedDeck.problem : parsedDeckRef.current.problem;
        const problemField = problem ? problem.reason : '';
        const deckChanges: SaveDeckChanges = {
          name: deckEditsRef.current.nameChange,
          description: deckEditsRef.current.descriptionChange,
          tags: deckEditsRef.current.tagsChange,
          slots: deckEditsRef.current.slots,
          ignoreDeckLimitSlots: deckEditsRef.current.ignoreDeckLimitSlots,
          side: deckEditsRef.current.side,
          problem: problemField,
          spentXp: newParsedDeck?.changes ? newParsedDeck.changes.spentXp : (parsedDeckRef.current.changes?.spentXp || 0),
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
  }, [deck, saving, cards, previousDeck, hasPendingEdits, parsedDeckRef, deckEditsRef, tabooSetId, userId, deckActions,
    listSeperator, dispatch, deckDispatch, handleSaveError, setSaving]);

  const saveEdits = useMemo(() => throttle((isRetry?: boolean) => actuallySaveEdits(false, isRetry), 500), [actuallySaveEdits]);
  const saveEditsAndDismiss = useMemo((isRetry?: boolean) => throttle(() => actuallySaveEdits(true, isRetry), 500), [actuallySaveEdits]);
  const [dialog, showAlert] = useSaveAlert(parsedDeckResults, saveEditsAndDismiss);
  const handleBackPress = useCallback(() => {
    if (!visible) {
      return false;
    }
    if (hasPendingEdits) {
      showAlert();
    } else {
      Navigation.dismissAllModals();
    }
    return true;
  }, [visible, hasPendingEdits, showAlert]);
  return {
    saving,
    saveEdits,
    saveError,
    handleBackPress,
    savingDialog: <>{savingDialog}{dialog}</>,
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
