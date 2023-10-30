import React from 'react';
import { View } from 'react-native';

import Card from '@data/types/Card';
import DeckQuantityComponent from './DeckQuantityComponent';
import { CardCount } from './CardCount';
import CardUpgradeButton from './CardUpgradeButton';
import CardToggle from './CardToggle';
import CardQuantityComponent from './CardQuantityComponent';
import { EditSlotsActions } from '@components/core/hooks';
import { DeckId } from '@actions/types';
import ShuffleButton, { DraftButton } from './ShuffleButton';
import { DiscountComponent } from './DiscountComponent';

export type ControlType = {
  type: 'deck';
  deckId: DeckId;
  min: number | undefined;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore';
} | {
  type: 'quantity';
  count: number;
  countChanged: EditSlotsActions;
  min: number | undefined;
  limit: number;
  showZeroCount: boolean;
  reversed?: boolean;
} | {
  type: 'count';
  count: number;
  deltaCountMode?: boolean;
  showZeroCount?: boolean;
} | {
  type: 'upgrade';
  deckId: DeckId;
  min: number | undefined;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore'
  editable: boolean;
  onUpgradePress?: (card: Card, mode: 'extra' | undefined) => void;
  customizable: boolean;
} | {
  type: 'toggle';
  value: boolean;
  disabled?: boolean;
  toggleValue: (value: boolean) => void;
} | {
  type: 'count_with_toggle';
  count: number;
  value: boolean;
  toggleValue: (value: boolean) => void;
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
    case 'count':
      return <CardCount count={control.count} deltaCountMode={control.deltaCountMode} showZeroCount={control.showZeroCount} />;
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
        />
      );
    case 'toggle':
      return <CardToggle value={control.value} toggleValue={control.toggleValue} disabled={control.disabled} />;
    case 'count_with_toggle':
      return (
        <>
          <CardCount count={control.count} />
          <CardToggle value={control.value} toggleValue={control.toggleValue} />
        </>
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