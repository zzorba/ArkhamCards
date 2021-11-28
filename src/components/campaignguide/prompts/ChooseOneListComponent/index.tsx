import React from 'react';
import { flatMap } from 'lodash';

import ChoiceComponent from './ChoiceComponent';
import { DisplayChoice } from '@data/scenario';

interface Props {
  choices: DisplayChoice[];
  selectedIndex?: number;
  editable: boolean;
  onSelect: (index: number) => void;
}

export default function ChooseOneListComponent({
  choices,
  selectedIndex,
  editable,
  onSelect,
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
            last={!editable || choices.length <= 2 || idx === choices.length - 1}
          />
        );
      }) }
    </>
  );
}
