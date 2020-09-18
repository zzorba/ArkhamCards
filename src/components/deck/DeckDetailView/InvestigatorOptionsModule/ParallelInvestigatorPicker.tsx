import React, { useContext } from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props {
  investigator: Card;
  parallelInvestigators: Card[];
  selection?: Card;
  type: 'alternate_back' | 'alternate_front';
  onChange: (type: 'alternate_back' | 'alternate_front', code?: string) => void;
  disabled?: boolean;
  editWarning: boolean;
}

export default function ParallelInvestigatorPicker({
  investigator,
  parallelInvestigators,
  type,
  disabled,
  editWarning,
  selection,
  onChange,
}: Props) {
  const { colors } = useContext(StyleContext);
  const onChoiceChange = (index: number) => {
    onChange(
      type,
      index === 0 ? undefined : parallelInvestigators[index - 1].code
    );
  };

  // Not found: -1 + 1 = 0
  const selectedIndex = selection ? (1 + findIndex(parallelInvestigators, card => card.code === selection.code)) : 0;
  const investigatorFaction = investigator.factionCode();
  return (
    <SinglePickerComponent
      settingsStyle
      title={type === 'alternate_front' ? t`Card Front` : t`Card Back`}
      editable={!disabled}
      description={editWarning ? t`Parallel investigator options should only be selected at deck creation time, not between scenarios.` : undefined}
      colors={{
        modalColor: investigatorFaction ?
          colors.faction[investigatorFaction].background :
          COLORS.lightBlue,
        modalTextColor: 'white',
        backgroundColor: 'transparent',
        textColor: colors.darkText,
      }}
      choices={[
        { text: t`Original` },
        ...map(parallelInvestigators, (card) => {
          return { text: card.pack_name };
        }),
      ]}
      selectedIndex={selectedIndex}
      onChoiceChange={onChoiceChange}
      noBorder
    />
  );
}
