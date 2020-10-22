import React from 'react';
import { flatMap } from 'lodash';

import ChoiceComponent from './ChoiceComponent';
import { DisplayChoice } from '@data/scenario';

interface Props {
  choices: DisplayChoice[];
  selectedIndex?: number;
  editable: boolean;
  onSelect: (index: number) => void;
  noBullet?: boolean;
  color?: string | string[];
}

function getColor(
  idx: number,
  color?: string | string[]
): string | undefined {
  if (Array.isArray(color)) {
    return color.length >= idx ? color[idx] : undefined;
  }
  return color;
}

export default function ChooseOneListComponent({
  choices,
  selectedIndex,
  editable,
  onSelect,
  noBullet,
  color,
}: Props) {
  return (
    <>
      { flatMap(choices, (choice, idx) => {
        if (!editable && idx !== selectedIndex) {
          return null;
        }
        return (
          <ChoiceComponent
            key={idx}
            index={idx}
            onSelect={onSelect}
            choice={choice}
            selected={selectedIndex === idx}
            editable={editable}
            color={getColor(idx, color)}
            noBullet={noBullet}
          />
        );
      }) }
    </>
  );
}
