import React, { useCallback, useContext } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Wand, Store, Package, Lightbulb, Stamp, FileQuestion } from 'lucide-react-native';

import RoundButton from '@components/core/RoundButton';
import { setDeckAttachmentSlot } from '@components/deck/actions';
import { useDeckAttachmentCount, useDeckSlotCount } from '@components/deck/hooks';
import { AttachableDefinition, DeckId } from '@actions/types';
import space, { xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { map, range } from 'lodash';
import { CardCount } from './CardCount';

function AttachmentIcon({ attachment, size, color }: { attachment: AttachableDefinition; size: number; color: string; }) {
  switch (attachment.icon) {
    case 'wand': return <Wand size={size} color={color} />;
    case 'store': return <Store size={size} color={color} />;
    case 'package': return <Package size={size} color={color} />;
    case 'lightbulb': return <Lightbulb size={size} color={color} />;
    case 'stamp': return <Stamp size={size} color={color} />;
    default: return <FileQuestion size={size} color={color} />;
  }
}

function AttachmentControl({ deckId, code, count, locked, attachment }: { deckId: DeckId; code: string; count: number; locked?: boolean; attachment: AttachableDefinition }) {
  const { colors, shadow } = useContext(StyleContext);
  const [attachCount, forceLocked] = useDeckAttachmentCount(deckId, code, attachment);
  const isLocked = locked || forceLocked;
  const dispatch = useDispatch();
  const onPress = useCallback(() => {
    const newCount = attachCount + 1 > (attachment.limit ?? count) || (attachCount + 1) > (count) ?
      0 : attachCount + 1;
    dispatch(setDeckAttachmentSlot(deckId, code, newCount, attachment.code));
  }, [attachment, count, attachCount, deckId, code, dispatch]);
  if (isLocked && !attachCount) {
    return null;
  }
  const active = attachCount > 0;
  return (
    <View style={{ position: 'relative' }}>
      { attachCount > 1 && (
        map(range(1, attachCount), idx => (
          <View key={idx} style={{ position: 'absolute', top: idx * 3, right: idx * 5 }}>
            <RoundButton shadowStyle={shadow.small} disabled onPress={onPress}>
              <AttachmentIcon attachment={attachment} size={24} color={!active || !attachment.limit ? colors.L10 : colors.M} />
            </RoundButton>
          </View>
        ))
      ) }
      <RoundButton
        hollow={!active}
        shadowStyle={!active ? undefined : shadow.small}
        noShadow={!active || isLocked}
        onPress={onPress}
        disabled={isLocked}
        accessibilityLabel={`${attachment.buttonLabel} - ${count}`}
      >
        <View style={{ position: 'relative' }}>
          <AttachmentIcon attachment={attachment} size={24} color={!active ? colors.L10 : colors.M} />
        </View>
      </RoundButton>

    </View>
  );
}

export function PossibleAttachmentsCounts({ deckId, code, count, locked, attachments }: { deckId: DeckId; code: string; count: number; locked?: boolean; attachments: AttachableDefinition[] }) {
  if (!attachments.length) {
    return null;
  }
  return (
    <View style={{ flexDirection: 'row', marginRight: xs }}>
      {map(attachments, a => (
        <AttachmentControl key={a.code} deckId={deckId} code={code} count={count} locked={locked} attachment={a} />
      ))}
    </View>
  )
}

export function AttachmentDetailCount({ deckId, code, attachment }: { deckId: DeckId; code: string; attachment: AttachableDefinition }) {
  const [count] = useDeckSlotCount(deckId, code);
  return (
    <View style={{ flexDirection: 'row' }}>
      <AttachmentControl
        deckId={deckId}
        code={code}
        count={count}
        attachment={attachment}
      />
      <View style={space.marginLeftS}>
        <CardCount count={count} />
      </View>
    </View>
  )
}