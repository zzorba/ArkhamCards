import React from 'react';
import { View } from 'react-native';

import Card from '@data/types/Card';
import DeckQuantityComponent from './DeckQuantityComponent';
import { CardCount, DeckCardCount } from './CardCount';
import CardUpgradeButton from './CardUpgradeButton';
import CardToggle from './CardToggle';
import CardChecklistToggles from './CardChecklistToggles';
import CardQuantityComponent from './CardQuantityComponent';
import { EditSlotsActions } from '@components/core/hooks';
import { AttachableDefinition, DeckId } from '@actions/types';
import ShuffleButton, { DraftButton } from './ShuffleButton';
import { DiscountComponent } from './DiscountComponent';
import { AttachmentDetailCount } from './AttachmentComponent';

export type ControlType = {
  type: 'deck';
  deckId: DeckId;
  min: number | undefined;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore';
  attachments: AttachableDefinition[];
} | {
  type: 'quantity';
  count: number;
  countChanged: EditSlotsActions;
  min: number | undefined;
  limit: number;
  showZeroCount: boolean;
  reversed?: boolean;
} | {
  type: 'deck_count';
  count: number;
  deltaCountMode?: boolean;
  showZeroCount?: boolean;
  deckId: DeckId;
  attachments: AttachableDefinition[];
} | {
  type: 'count';
  count: number;
  deltaCountMode?: boolean;
  showZeroCount?: boolean;
} | {
  type: 'attachment';
  deckId: DeckId;
  attachment: AttachableDefinition;
} | {
  type: 'upgrade';
  deckId: DeckId;
  min: number | undefined;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore'
  editable: boolean;
  onUpgradePress?: (card: Card, mode: 'extra' | undefined) => void;
  customizable: boolean;
  attachments: AttachableDefinition[];
} | {
  type: 'toggle';
  value: boolean;
  disabled?: boolean;
  toggleValue: (value: boolean) => void;
} | {
  type: 'count_with_toggle';
  count: number;
  values: number[];
  toggleValue: (value: number, toggle: boolean) => void;
} | {
  type: 'shuffle';
  count?: number;
  onShufflePress: () => void;
} | {
  type: 'draft';
  onDraft: (card: Card) => void;
} | {
  type: 'discount';
  available: number;
  used: number;
}

interface Props {
  card: Card;
  control: ControlType;
  handleCardPress?: () => void;
}
export function ControlComponent({ card, control, handleCardPress }: Props) {
  switch (control.type) {
    case 'deck':
      return (
        <DeckQuantityComponent
          deckId={control.deckId}
          min={control.min}
          limit={control.limit}
          code={card.code}
          mode={control.mode}
          editable
          attachments={control.attachments}
        />
      );
    case 'shuffle':
      return (
        <View style={{ flexDirection: 'row' }}>
          { !!control.count && control.count > 1 && <CardCount count={control.count} /> }
          <ShuffleButton onPress={control.onShufflePress} />
        </View>
      );
    case 'draft':
      return <DraftButton card={card} onPress={control.onDraft} />;
    case 'attachment': {
      return (
        <AttachmentDetailCount
          deckId={control.deckId}
          code={card.code}
          attachment={control.attachment}
        />
      );
    }
    case 'deck_count':
      return (
        <DeckCardCount
          count={control.count}
          code={card.code}
          deltaCountMode={control.deltaCountMode}
          showZeroCount={control.showZeroCount}
          deckId={control.deckId}
          attachments={control.attachments}
        />
      );
    case 'count':
      return (
        <CardCount
          count={control.count}
          deltaCountMode={control.deltaCountMode}
          showZeroCount={control.showZeroCount}
        />
      );
    case 'upgrade':
      return (
        <CardUpgradeButton
          onUpgradePress={control.customizable ? handleCardPress : control.onUpgradePress}
          card={card}
          deckId={control.deckId}
          min={control.min}
          editable={control.editable}
          limit={control.limit}
          mode={control.mode}
          attachments={control.attachments}
        />
      );
    case 'toggle':
      return (
        <CardToggle
          value={control.value}
          toggleValue={control.toggleValue}
          disabled={control.disabled}
        />
      );
    case 'count_with_toggle':
      return (
        <CardChecklistToggles
          code={card.code}
          values={control.values}
          toggleValue={control.toggleValue}
          quantity={control.count}
        />
      );
    case 'quantity':
      return (
        <CardQuantityComponent
          code={card.code}
          count={control.count}
          countChanged={control.countChanged}
          min={control.min}
          limit={control.limit}
          showZeroCount={control.showZeroCount}
          reversed={control.reversed}
        />
      );
    case 'discount':
      return (
        <DiscountComponent available={control.available} used={control.used} />
      );
  }
}