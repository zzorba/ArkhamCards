import React, { useContext } from 'react';
import { View } from 'react-native';
import { Wand, Store, Package, Lightbulb, Stamp, FileQuestion } from 'lucide-react-native';

import RoundButton from '@components/core/RoundButton';
import { AttachableDefinition, DeckId } from '@actions/types';
import space, { xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { map, range } from 'lodash';
import { CardCount } from './CardCount';
import { useDeckAttachmentCount, useDeckSlotCount } from '@components/deck/DeckEditContext';

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

function AttachmentControl({ code, count, locked, attachment }: { code: string; count: number; locked?: boolean; attachment: AttachableDefinition }) {
  const { colors, shadow } = useContext(StyleContext);
  const { attachCount, forceLocked, onPress } = useDeckAttachmentCount(code, attachment);
  const isLocked = locked || forceLocked;
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

export function PossibleAttachmentsCounts({ code, count, locked, attachments }: { code: string; count: number; locked?: boolean; attachments: AttachableDefinition[] }) {
  if (!attachments.length) {
    return null;
  }
  return (
    <View style={{ flexDirection: 'row', marginRight: xs }}>
      {map(attachments, a => (
        <AttachmentControl key={a.code} code={code} count={count} locked={locked} attachment={a} />
      ))}
    </View>
  )
}

export function AttachmentDetailCount({ code, attachment }: { code: string; attachment: AttachableDefinition }) {
  const [count] = useDeckSlotCount(code);
  return (
    <View style={{ flexDirection: 'row' }}>
      <AttachmentControl
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