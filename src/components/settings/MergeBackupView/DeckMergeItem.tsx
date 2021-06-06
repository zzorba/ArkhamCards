import React, { useCallback, useMemo } from 'react';
import { msgid, ngettext } from 'ttag';
import SettingsSwitch from '@components/core/SettingsSwitch';
import { Deck } from '@actions/types';
import { CardsMap } from '@data/types/Card';

interface Props {
  deck: Deck;
  value: boolean;
  inverted: boolean;
  onValueChange: (deck: Deck, value: boolean) => void;
  investigators?: CardsMap;
  scenarioCount: number;
}

export default function DeckMergeItem({ deck, value, inverted, onValueChange, investigators, scenarioCount }: Props) {
  const handleOnValueChange = useCallback((value: boolean) => {
    onValueChange(deck, inverted ? !value : value);
  }, [deck, inverted, onValueChange]);

  const description = useMemo(() => {
    const investigator = investigators && investigators[deck.investigator_code];
    if (!investigator) {
      return undefined;
    }
    if (scenarioCount <= 1) {
      return investigator.name;
    }
    return ngettext(
      msgid`(${investigator.name} - ${scenarioCount} scenario`,
      `${investigator.name} - ${scenarioCount} scenarios`,
      scenarioCount
    );
  }, [deck, investigators, scenarioCount]);

  return (
    <SettingsSwitch
      title={deck.name}
      description={description}
      value={inverted ? !value : value}
      onValueChange={handleOnValueChange}
    />
  );
}