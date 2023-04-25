import React, { useCallback, useContext, useMemo, useReducer, useState } from 'react';
import { find, filter, map, sortBy, throttle } from 'lodash';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  View,
} from 'react-native';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import { NavigationProps } from '@components/nav/types';
import ChaosTokenRow from './ChaosTokenRow';
import {
  CHAOS_TOKENS,
  CHAOS_BAG_TOKEN_COUNTS,
  CHAOS_TOKEN_ORDER,
  ChaosBag,
  ChaosTokenType,
} from '@app_constants';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useBackButton, useComponentVisible, useNavigationButtonPressed } from '@components/core/hooks';
import { useAlertDialog, useDialog } from '@components/deck/dialogs';
import { CampaignCycleCode, CampaignDifficulty, CUSTOM, EOE } from '@actions/types';
import space, { s, xs } from '@styles/space';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import ChaosToken from '@components/chaos/ChaosToken';
import { getChaosBag } from '@components/campaign/constants';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface EditChaosBagProps {
  cycleCode: CampaignCycleCode;
  chaosBag: ChaosBag;
  updateChaosBag: (chaosBag: ChaosBag) => void;
  trackDeltas?: boolean;
}

type Props = EditChaosBagProps & NavigationProps;

function ChaosBagCounter({ count, token, limit, onInc, onDec, fullWidth, left }: {
  fullWidth: boolean;
  count: number;
  token: ChaosTokenType;
  limit: number;
  onInc: (token: ChaosTokenType, limit: number) => void;
  onDec: (token: ChaosTokenType) => void;
  left: boolean;
}) {
  const { colors, typography } = useContext(StyleContext);
  const onIncrement = useCallback(() => onInc(token, limit), [onInc, token]);
  const onDecrement = useCallback(() => onDec(token), [onDec, token]);
  return (
    <View style={[
      fullWidth ? { flexBasis: '100%' } : { flexBasis: '50%', paddingRight: left ? 0 : xs, paddingLeft: left ? xs : 0 },
      space.paddingBottomS,
    ]}>
      <View style={[
        styles.button,
        space.paddingSideS,
        space.paddingVerticalXs,
        { borderColor: colors.L15, backgroundColor: count > 0 ? colors.L15 : colors.L30 },
      ]}>
        <PlusMinusButtons
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          min={0}
          max={limit}
          count={count}
          dialogStyle
        >
          <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, space.paddingSideS]}>
            <Text style={[typography.counter, typography.center, { color: colors.D30, minWidth: 28 }, space.marginRightS]}>
              ×{ count }
            </Text>
            <ChaosToken iconKey={token} size="extraTiny" />
          </View>
        </PlusMinusButtons>
      </View>
    </View>
  );
}


interface IncAction {
  type: 'inc';
  token: ChaosTokenType;
  limit: number;
}

interface DecAction {
  type: 'dec';
  token: ChaosTokenType;
}

interface SetAction {
  type: 'set';
  chaosBag: ChaosBag;
}

function DifficultyButton({ difficulty, title, onPress, selection }: {
  difficulty: CampaignDifficulty;
  title: string;
  onPress: (difficulty: CampaignDifficulty) => void;
  selection: CampaignDifficulty;
}) {
  const { colors, typography, fontScale } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const height = ((lang === 'zh' ? 22 : 20) * fontScale) + s * 2;

  const handleOnPress = useCallback(() => onPress(difficulty), [difficulty, onPress]);
  const selected = difficulty === selection;
  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={handleOnPress}>
        <View style={[styles.presetButton, { height, borderRadius: height / 2}, selected ? { borderWidth: 1, borderColor: colors.L15 } : undefined, space.paddingSideM]}>
          <Text style={[space.paddingTopXs, typography.large, selected ? typography.bold : undefined]}>{title}</Text>
        </View>
      </Pressable>
    </View>
  );
}

export function useEditChaosBagDialog({ chaosBag: originalChaosBag, cycleCode, difficulty: originalDifficulty }: EditChaosBagProps & { difficulty: CampaignDifficulty }) {
  const { colors, fontScale } = useContext(StyleContext);
  const [difficulty, setDifficulty] = useState<CampaignDifficulty>(originalDifficulty);
  const [chaosBag, mutateChaosBag] = useReducer((state: ChaosBag, action: IncAction | DecAction | SetAction) => {
    switch (action.type) {
      case 'inc':
        return {
          ...state,
          [action.token]:  Math.min((state[action.token] || 0) + 1, action.limit),
        };
      case 'dec':
        return {
          ...state,
          [action.token]:  Math.max((state[action.token] || 0) -1, 0),
        };
      case 'set':
        return {
          ...action.chaosBag,
        };
    }
  }, originalChaosBag);

  const onInc = useCallback((token: ChaosTokenType, limit: number) => {
    mutateChaosBag({ type: 'inc', token, limit });
  }, [mutateChaosBag]);
  const onDec = useCallback((token: ChaosTokenType) => {
    mutateChaosBag({ type: 'dec', token });
  }, [mutateChaosBag]);
  const onSetDefault = useCallback((difficulty: CampaignDifficulty) => {
    mutateChaosBag({ type: 'set', chaosBag: getChaosBag(cycleCode, difficulty) });
    setDifficulty(difficulty);
  }, [mutateChaosBag, setDifficulty]);
  const allTokens = useMemo(() => sortBy(CHAOS_TOKENS, x => CHAOS_TOKEN_ORDER[x]), []);
  return useDialog({
    title: t`Edit chaos bag`,
    allowDismiss: true,
    maxHeightPercent: 0.8,
    alignment: 'bottom',
    content: <View style={[{ flexDirection: 'column', alignItems: 'center' }, space.paddingSideXs]}>
      <View style={[space.marginBottomS, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <DifficultyButton difficulty={CampaignDifficulty.EASY} title={t`EASY`} onPress={onSetDefault} selection={difficulty} />
        <DifficultyButton difficulty={CampaignDifficulty.STANDARD} title={t`STND`} onPress={onSetDefault} selection={difficulty} />
        <DifficultyButton difficulty={CampaignDifficulty.HARD} title={t`HARD`} onPress={onSetDefault} selection={difficulty} />
        <DifficultyButton difficulty={CampaignDifficulty.EXPERT} title={t`EXPT`} onPress={onSetDefault} selection={difficulty} />
      </View>
      <View style={[space.marginSideXs, space.marginBottomS, { height: 1, backgroundColor: colors.L15, width: '100%' }]} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        { map(allTokens, (token, idx) => <ChaosBagCounter
          key={token}
          token={token}
          count={chaosBag[token] || 0}
          onInc={onInc}
          onDec={onDec}
          limit={CHAOS_BAG_TOKEN_COUNTS[token] || 0}
          fullWidth={idx == allTokens.length - 1 && !!(allTokens.length % 2)}
          left={!!(idx % 2)}
        />)}
      </View>
    </View>
  });
}

function EditChaosBagDialog({ chaosBag: originalChaosBag, updateChaosBag, trackDeltas, componentId, cycleCode }: Props) {
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const [chaosBag, mutateChaosBag] = useReducer((state: ChaosBag, action: { id: ChaosTokenType, mutate: (count: number) => number }) => {
    return {
      ...state,
      [action.id]: action.mutate(state[action.id] || 0),
    };
  }, originalChaosBag);
  const visible = useComponentVisible(componentId);
  const hasPendingEdits = useMemo(() => {
    return !!find(
      CHAOS_TOKENS,
      key => (chaosBag[key] || 0) !== (originalChaosBag[key] || 0));
  }, [chaosBag, originalChaosBag]);

  const saveChanges = useMemo(() => throttle(() => {
    updateChaosBag(chaosBag);
    Navigation.pop(componentId);
  }, 200), [updateChaosBag, chaosBag, componentId]);

  const [alertDialog, showAlert] = useAlertDialog();
  const handleBackPress = useCallback(() => {
    if (!visible) {
      return false;
    }
    if (hasPendingEdits) {
      showAlert(
        t`Save changes?`,
        t`Looks like you have made some changes that have not been saved.`,
        [{
          text: t`Cancel`,
          style: 'cancel',
        },
        {
          text: t`Discard Changes`,
          style: 'destructive',
          onPress: () => {
            Navigation.pop(componentId);
          },
        }, {
          text: t`Save Changes`,
          onPress: () => {
            saveChanges();
          },
        }],
      );
    } else {
      Navigation.pop(componentId);
    }
    return true;
  }, [componentId, visible, hasPendingEdits, saveChanges, showAlert]);


  useBackButton(handleBackPress);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'save') {
      saveChanges();
    } else if (buttonId === 'back' || buttonId === 'androidBack') {
      handleBackPress();
    }
  }, componentId, [saveChanges, handleBackPress]);
  const mutateCount = useCallback((id: ChaosTokenType, mutate: (count: number) => number) => {
    mutateChaosBag({ id, mutate });
  }, [mutateChaosBag]);
  const chaosTokens: ChaosTokenType[] = useMemo(() => {
    if (cycleCode === EOE || cycleCode === CUSTOM) {
      return CHAOS_TOKENS;
    }
    return filter(CHAOS_TOKENS, x => x !== 'frost');
  }, [cycleCode]);
  return (
    <>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <View style={[styles.divideRow, borderStyle, space.paddingS]}>
          <Text style={[typography.large, typography.bold]}>{t`In Bag`}</Text>
        </View>
        { map(sortBy(chaosTokens, x => CHAOS_TOKEN_ORDER[x]),
          id => {
            const originalCount = trackDeltas ? originalChaosBag[id] : chaosBag[id];
            return (
              <ChaosTokenRow
                key={id}
                id={id}
                originalCount={originalCount || 0}
                count={chaosBag[id] || 0}
                limit={CHAOS_BAG_TOKEN_COUNTS[id] || 0}
                mutateCount={mutateCount}
              />
            );
          }) }
      </ScrollView>
      { alertDialog }
    </>
  );
}

EditChaosBagDialog.options = (): Options => {
  return {
    topBar: {
      leftButtons: [
        Platform.OS === 'ios' ? {
          systemItem: 'cancel',
          text: t`Cancel`,
          id: 'back',
          color: COLORS.M,
          accessibilityLabel: t`Cancel`,
        } : {
          icon: iconsMap['arrow-back'],
          id: 'androidBack',
          color: COLORS.M,
          accessibilityLabel: t`Back`,
        },
      ],
      rightButtons: [{
        systemItem: 'save',
        text: t`Save`,
        id: 'save',
        showAsAction: 'ifRoom',
        color: COLORS.M,
        accessibilityLabel: t`Save`,
      }],
    },
  };
};
export default EditChaosBagDialog;

const styles = StyleSheet.create({
  divideRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  count: {
    minWidth: 32,
    paddingRight: xs,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
