import React, { useCallback, useContext, useMemo } from 'react';
import { filter, flatMap, map, uniq, sortBy, forEach } from 'lodash';
import { Text } from 'react-native';
import { c, t } from 'ttag';

import Card from '@data/types/Card';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import { useMultiPickerDialog } from '@components/deck/dialogs';
import { Toggles, useToggles } from '@components/core/hooks';
import ActionButton from '@components/campaignguide/prompts/ActionButton';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import LanguageContext from '@lib/i18n/LanguageContext';
import getLocalizedTraits from '@components/filter/CardFilterView/getLocalizedTraits';

interface Props {
  choices?: string[];
  save: (traits: string[]) => void;
  weaknessCards: Card[];
  useCardTraits: boolean;
}

export default function SelectWeaknessTraitsComponent({ choices, save, weaknessCards, useCardTraits }: Props) {
  const { typography } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);
  const [selectedTraits, setSelectedTrait] = useToggles(() => {
    const toggles: Toggles = {};
    if (choices) {
      forEach(choices, x => {
        toggles[x] = true;
      });
    }
    return toggles;
  });
  const allTraits = useMemo(() => {
    return sortBy(
      uniq(
        flatMap(weaknessCards, card => {
          if (!card) {
            return [];
          }
          if (useCardTraits) {
            if (!card.traits) {
              return [];
            }
            return filter(
              map(
                card.traits.split('.'),
                trait => trait.trim()
              )
            );
          }
          if (!card.real_traits) {
            return [];
          }
          return filter(
            map(
              card.real_traits.split('.'),
              trait => trait.trim()
            )
          );
        })
      )
    );
  }, [weaknessCards, useCardTraits]);
  const selection = useMemo(() => {
    return filter(allTraits, t => !!selectedTraits[t]);
  }, [allTraits, selectedTraits]);

  const savePress = useCallback(() => {
    save(selection);
  }, [save, selection]);
  const selectedValues = useMemo(() => {
    return new Set(selection);
  }, [selection]);
  const localizedTraits = useMemo(() => {
    if (!useCardTraits) {
      return getLocalizedTraits();
    }
    return undefined;
  }, [useCardTraits]);
  const items = useMemo(() => sortBy(map(allTraits, trait => {
    return {
      title: (localizedTraits && localizedTraits[trait]) || trait,
      value: trait,
    };
  }), x => x.title), [allTraits, localizedTraits]);
  const description = useMemo(() => {
    if (!selection.length) {
      return c('Weakness Card').t`All`;
    }
    return map(selection, x => (localizedTraits && localizedTraits[x]) || x).join(listSeperator);
  }, [selection, listSeperator, localizedTraits]);
  const [dialog, showDialog] = useMultiPickerDialog({
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
      { choices === undefined && <ActionButton color="dark" title={t`Edit selection`} onPress={showDialog} leftIcon="edit" /> }
      { dialog }
    </InputWrapper>
  );
}
