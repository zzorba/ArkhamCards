import React, { useContext, useMemo } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { t } from 'ttag';

import { TouchableOpacity } from '@components/core/Touchables';
import AppIcon from '@icons/AppIcon';
import space, { isBig, m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import RoundButton from '@components/core/RoundButton';
import { ParsedDeckResults, useDeckEditState, useParsedDeck, xpString } from '@components/deck/hooks';
import { useAdjustXpDialog } from '@components/deck/dialogs';
import { DeckId } from '@actions/types';
import { TINY_PHONE } from '@styles/sizes';

const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;

export const FOOTER_HEIGHT = (56 * (isBig ? 1.2 : 1));

interface Props {
  componentId: string;
  deckId: DeckId;
  onPress: () => void;
  control?: 'fab' | 'counts' ;
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


interface PreloadedProps {
  componentId: string;
  parsedDeckObj: ParsedDeckResults;
  onPress: () => void;
  control?: 'fab' | 'counts' ;
  forceShow?: boolean;
  yOffset?: number;
}
export function PreLoadedDeckNavFooter({ parsedDeckObj, control, onPress, forceShow, yOffset }: PreloadedProps) {
  const { colors, shadow, typography } = useContext(StyleContext);
  const [xpAdjustmentDialog, showXpAdjustmentDialog] = useAdjustXpDialog(parsedDeckObj);
  const { deck, parsedDeck, deckEdits } = parsedDeckObj;
  const { mode } = useDeckEditState(parsedDeckObj);
  const theXpString = useMemo(() => {
    if (!parsedDeck) {
      return [undefined, undefined];
    }
    if (parsedDeck.deck?.previousDeckId) {
      const adjustedXp = parsedDeck.availableExperience;
      const spentXP = (parsedDeck.changes?.spentXp || 0);
      return t`${spentXP} of ${adjustedXp} XP spent`;
    }
    const adjustedXp = parsedDeck.experience;
    return xpString(adjustedXp);
  }, [parsedDeck]);

  const cardString = useMemo(() => {
    if (!parsedDeck) {
      return undefined;
    }
    const { normalCardCount, deckSize } = parsedDeck;
    return t`${normalCardCount} / ${deckSize} cards`;
  }, [parsedDeck]);

  const xpLine = useMemo(() => {
    if (!deckEdits?.editable || !deck || !deck.previousDeckId) {
      return (
        <Text style={[typography.button, typography.bold, typography.inverted]} allowFontScaling={false}>
          { theXpString }
        </Text>
      );
    }
    return (
      <TouchableOpacity onPress={showXpAdjustmentDialog}>
        <View style={styles.row}>
          <Text style={[typography.button, typography.bold, typography.inverted]} allowFontScaling={false}>
            { theXpString }
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
  }, [deckEdits, theXpString, deck, showXpAdjustmentDialog, typography, colors]);
  if (mode === 'view' && !forceShow) {
    return null;
  }
  const modeText = mode === 'upgrade' ? t`Upgrading` : t`Editing`;
  return (
    <>
      <View style={[styles.marginWrapper, { bottom: (yOffset || NOTCH_BOTTOM_PADDING) + s, paddingRight: fabPadding(control) }]}>
        <View style={[styles.content, shadow.large, { backgroundColor: colors.D10 }]}>
          { (control !== 'counts' || !TINY_PHONE) ? (
            <View>
              <RoundButton
                onPress={onPress}
                size={FOOTER_HEIGHT - 16}
                margin={8}
                accessibilityLabel={t`Done`}
              >
                <AppIcon
                  size={24}
                  color={colors.M}
                  name="check"
                />
              </RoundButton>
            </View>
          ) : <View style={{ width: m }} /> }
          <View style={styles.left}>
            <Text style={[typography.smallLabel, typography.italic, typography.inverted]} allowFontScaling={false}>
              { cardString ? `${modeText} · ${cardString}` : modeText }
            </Text>
            { xpLine }
          </View>
        </View>
      </View>
      { xpAdjustmentDialog }
    </>
  );
}

function DeckNavFooter({
  componentId,
  deckId,
  ...props
}: Props) {
  const parsedDeckObj = useParsedDeck(deckId, componentId);
  return (
    <PreLoadedDeckNavFooter
      componentId={componentId}
      parsedDeckObj={parsedDeckObj}
      {...props}
    />
  );
}

PreLoadedDeckNavFooter.height = FOOTER_HEIGHT + s * 2;
DeckNavFooter.height = FOOTER_HEIGHT + s * 2;
export default DeckNavFooter;

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


