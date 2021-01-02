import React, { useContext, useMemo } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import space, { isBig, m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import RoundButton from '@components/core/RoundButton';
import { useDeckEditState, useParsedDeck } from '@components/deck/hooks';
import { useAdjustXpDialog } from '@components/deck/dialogs';
import { Campaign } from '@actions/types';
import { useKeyboardHeight } from '@components/core/hooks';

const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;

export const FOOTER_HEIGHT = (56 * (isBig ? 1.2 : 1));

interface Props {
  componentId: string;
  deckId: number;
  onPress: () => void;
  controls?: React.ReactNode;
  control?: 'fab' | 'counts' ;
  campaign?: Campaign;
  forceShow?: boolean;
  yOffset?: number;
}

function fabPadding(control?: 'fab' | 'counts') {
  if (control === 'fab') {
    return m + (FOOTER_HEIGHT + m);
  }
  if (control === 'counts') {
    return m + (FOOTER_HEIGHT * 2 + m);
  }
  return s + xs;
}

export default function DeckNavFooter({
  componentId,
  deckId,
  control,
  campaign,
  onPress,
  forceShow,
  yOffset,
}: Props) {
  const { colors, shadow, typography } = useContext(StyleContext);
  const parsedDeckObj = useParsedDeck(deckId, 'NavFooter', componentId);
  const { showXpAdjustmentDialog, xpAdjustmentDialog } = useAdjustXpDialog(parsedDeckObj);
  const { deck, parsedDeck, editable } = parsedDeckObj;
  const { mode } = useDeckEditState(parsedDeckObj);
  const xpString = useMemo(() => {
    if (!parsedDeck) {
      return [undefined, undefined];
    }
    if (parsedDeck.deck.previous_deck) {
      const adjustedXp = parsedDeck.availableExperience;
      const spentXP = (parsedDeck.changes?.spentXp || 0);
      return t`${spentXP} of ${adjustedXp} XP spent`;
    }
    const adjustedXp = parsedDeck.experience;
    return t`${adjustedXp} XP`;
  }, [parsedDeck]);

  const xpLine = useMemo(() => {
    if (!editable || !deck || !deck.previous_deck) {
      return (
        <Text style={[typography.button, typography.bold, typography.inverted]} allowFontScaling={false}>
          { xpString }
        </Text>
      );
    }
    return (
      <TouchableOpacity onPress={showXpAdjustmentDialog}>
        <View style={styles.row}>
          <Text style={[typography.button, typography.bold, typography.inverted]} allowFontScaling={false}>
            { xpString }
          </Text>
          <View style={space.marginLeftS}>
            <AppIcon
              size={14}
              color={colors.M}
              name="edit"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [editable, xpString, deck, showXpAdjustmentDialog, typography, colors]);
  if (mode === 'view' && !forceShow) {
    return null;
  }
  return (
    <>
      <View style={[styles.marginWrapper, { bottom: (yOffset || NOTCH_BOTTOM_PADDING) + s, paddingRight: fabPadding(control) }]}>
        <View style={[styles.content, shadow.large, { backgroundColor: colors.D10 }]}>
          <View>
            <RoundButton
              onPress={onPress}
              size={FOOTER_HEIGHT - 16}
              margin={8}
            >
              <AppIcon
                size={24}
                color={colors.M}
                name="check"
              />
            </RoundButton>
          </View>
          <View style={styles.left}>
            <Text style={[typography.smallLabel, typography.italic, typography.inverted]} allowFontScaling={false}>
              { mode === 'upgrade' ? t`Upgrading` : t`Editing` }
            </Text>
            { xpLine }
          </View>
        </View>
      </View>
      { xpAdjustmentDialog }
    </>
  );
}

const styles = StyleSheet.create({
  marginWrapper: {
    position: 'absolute',
    height: FOOTER_HEIGHT + s * 2,
    width: '100%',
    padding: s + xs,
    left: 0,
    backgroundColor: 'transparent',
  },
  content: {
    height: FOOTER_HEIGHT,
    borderTopLeftRadius: FOOTER_HEIGHT / 2,
    borderTopRightRadius: FOOTER_HEIGHT / 2,
    borderBottomLeftRadius: FOOTER_HEIGHT / 2,
    borderBottomRightRadius: FOOTER_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  left: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});


