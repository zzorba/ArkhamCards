import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import RoundButton from '@components/core/RoundButton';
import CardQuantityComponent from './CardQuantityComponent';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { PossibleAttachmentsCounts } from './AttachmentComponent';
import { ParsedDeckContext, useEligibleAttachments, useMutableDeckSlotCount } from '@components/deck/DeckEditContext';
import Card from '@data/types/Card';
import { AttachableDefinition } from '@actions/types';

interface DeckCardQuantityProps {
  card: Card;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore';
  showZeroCount?: boolean;
  forceBig?: boolean;
  editable?: boolean;
  attachmentOverride?: AttachableDefinition | undefined;
}


function DeckQuantityComponent({ editable, card, limit: propsLimit, showZeroCount, forceBig, mode, attachmentOverride }: DeckCardQuantityProps) {
  const limit = Math.min(propsLimit, mode === 'extra' ? 1 : propsLimit);
  const { colors } = useContext(StyleContext);
  const attachments = useEligibleAttachments(card, attachmentOverride);
  const { lockedPermanents } = useContext(ParsedDeckContext);
  const min = !mode ? lockedPermanents?.[card.code] : 0;
  const { count, ignoreCount, countChanged, onSidePress } = useMutableDeckSlotCount(card.code, limit, mode);
  return (
    <>
      { mode === 'side' && count > 0 && !!editable && (
        <View style={space.marginRightS}>
          <RoundButton onPress={onSidePress} accessibilityLabel={t`Move to deck`}>
            <View style={styles.icon}>
              <AppIcon
                size={32}
                color={colors.M}
                name="above_arrow"
              />
            </View>
          </RoundButton>
        </View>
      ) }
      <PossibleAttachmentsCounts code={card.code} count={count} locked={!editable} attachments={attachments} />
      <CardQuantityComponent
        code={card.code}
        min={min}
        limit={limit}
        countChanged={countChanged}
        count={count ?? 0}
        adjustment={-ignoreCount}
        showZeroCount={showZeroCount}
        forceBig={forceBig}
        locked={!editable}
      />
    </>
  );
}

export default DeckQuantityComponent;


const styles = StyleSheet.create({
  icon: {
    paddingRight: 6,
    paddingBottom: 2,
    transform: [{ scaleX: -1 }],
  },
});