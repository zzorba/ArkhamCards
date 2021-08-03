import React, { useCallback, useContext, useMemo } from 'react';
import { filter, flatMap, map, uniq, sortBy } from 'lodash';
import { Text } from 'react-native';
import { c, t } from 'ttag';

import Card from '@data/types/Card';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import { useMultiPickerDialog } from '@components/deck/dialogs';
import { useToggles } from '@components/core/hooks';
import ActionButton from '@components/campaignguide/prompts/ActionButton';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  choices?: string[];
  save: (traits: string[]) => void;
  weaknessCards: Card[];
}

export default function SelectWeaknessTraitsComponent({ choices, save, weaknessCards }: Props) {
  const { typography } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);
  const [selectedTraits, setSelectedTrait] = useToggles({});
  const allTraits = useMemo(() => {
    return sortBy(
      uniq(
        flatMap(weaknessCards, card => {
          if (!card || !card.traits) {
            return [];
          }
          return filter(
            map(
              card.traits.split('.'),
              trait => trait.trim()
            )
          );
        })
      )
    );
  }, [weaknessCards]);
  const selection = useMemo(() => {
    return filter(allTraits, t => !!selectedTraits[t]);
  }, [allTraits, selectedTraits]);

  const savePress = useCallback(() => {
    save(selection);
  }, [save, selection]);
  const selectedValues = useMemo(() => {
    return new Set(selection);
  }, [selection]);
  const items = useMemo(() => map(allTraits, trait => {
    return {
      title: trait,
      value: trait,
    };
  }), [allTraits]);
  const description = useMemo(() => {
    if (!selection.length) {
      return c('Weakness Card').t`All`;
    }
    return selection.join(listSeperator);
  }, [selection, listSeperator]);
  const { dialog, showDialog } = useMultiPickerDialog({
    title: t`Select Traits`,
    description: t`Random weaknesses will be drawn that match these traits.`,
    selectedValues,
    items,
    onValueChange: setSelectedTrait,
  });

  return (
    <InputWrapper
      title={choices === undefined ? t`Select Traits` : t`Traits`}
      onSubmit={savePress}
      editable={choices === undefined}
    >
      <Text style={[space.paddingS, typography.mediumGameFont]}>
        { description }
      </Text>
      <ActionButton color="dark" title={t`Edit selection`} onPress={showDialog} leftIcon="edit" />
      { dialog }
    </InputWrapper>
  );
}
