import React, { useCallback, useContext, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { t } from 'ttag';

import { usePickerDialog, Item } from '@components/deck/dialogs';
import Card from '@data/types/Card';
import { map } from 'lodash';
import PickerStyleButton from '@components/core/PickerStyleButton';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import { DisplayChoice } from '@data/scenario';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChoiceIcon } from '@data/scenario/types';
import RadioButton from './RadioButton';
import InvestigatorImage from '@components/core/InvestigatorImage';
import { TraumaIconPile } from '@components/campaign/TraumaSummary';
import AppIcon from '@icons/AppIcon';

interface Props {
  title: string;
  description?: string;
  choices: DisplayChoice[];
  formatLabel?: (index: number) => string;
  onChoiceChange: (index: number | null) => void;
  investigator?: Card;
  selectedIndex?: number;
  width: number;
  editable: boolean;
  defaultLabel?: string;
  optional?: boolean;
  firstItem?: boolean;
}

function getIcon(icon?: ChoiceIcon, card?: Card): React.ReactNode {
  if (card) {
    return (
      <View style={[space.paddingRightXs, { marginLeft: -s }]}>
        <InvestigatorImage
          card={card}
          size="tiny"
          border
        />
      </View>
    );
  }
  if (!icon) {
    return null;
  }

  return (
    <RadioButton icon={icon} color="dark" selected />
  );
}

export default function SinglePickerComponent({
  onChoiceChange,
  investigator,
  selectedIndex,
  width,
  title,
  description,
  choices,
  editable,
  optional,
  firstItem,
  ...props
}: Props) {
  const defaultLabel = props.defaultLabel || t`None`;
  const { colors, typography } = useContext(StyleContext);
  const items: Item<number>[] = useMemo(() => {
    return [
      ...(optional ? [{ value: -1, title: defaultLabel }] : []),
      ...map(choices, (c, idx) => {
        return {
          title: c.text || '',
          description: c.description || c.card?.subname,
          iconNode: getIcon(c.icon, c.card),
          rightNode: c.trauma ? (
            <>
              { !!c.resolute && <AppIcon accessibilityLabel={t`Resolute`} name="check_on_check" size={40} color={colors.D10} /> }
              <View style={space.paddingRightS}>
                <TraumaIconPile physical={c.trauma.physical || 0} mental={c.trauma.mental || 0} />
              </View>
            </>
          ) : undefined,
          value: idx,
        };
      }),
    ];
  }, [optional, defaultLabel, choices, colors]);
  const onValueChange = useCallback((idx: number) => {
    onChoiceChange(idx);
  }, [onChoiceChange]);
  const [dialog, showDialog] = usePickerDialog({
    title,
    investigator,
    description,
    items,
    onValueChange,
    selectedValue: selectedIndex,
  });
  const selectedLabel = (selectedIndex === undefined || selectedIndex === -1) ? defaultLabel : (
    (!investigator?.grammarGenderMasculine() && (choices[selectedIndex].selected_feminine_text || choices[selectedIndex].feminine_text)) ||
    choices[selectedIndex].selected_text || choices[selectedIndex].text
  );

  const selectedDescription = (selectedIndex === undefined || selectedIndex === -1) ? undefined : (choices[selectedIndex].description || choices[selectedIndex].card?.subname);
  const selectedIcon = (selectedIndex === undefined || selectedIndex === -1) ? undefined : choices[selectedIndex].icon;
  const selectedTrauma = (selectedIndex === undefined || selectedIndex === -1) ? undefined : choices[selectedIndex].trauma;
  const selectedResolute = (selectedIndex === undefined || selectedIndex === -1) ? undefined : choices[selectedIndex].resolute;
  const selection = useMemo(() => {
    return (
      <View style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
        { !!selectedResolute && <AppIcon accessibilityLabel={t`Resolute`} name="check_on_check" size={40} color="#FFFFFF" /> }
        { !!(selectedTrauma?.physical || selectedTrauma?.mental) && <View style={space.paddingRightXs}><TraumaIconPile physical={selectedTrauma.physical || 0} mental={selectedTrauma.mental || 0} whiteText /></View> }
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Text numberOfLines={2} ellipsizeMode="head" style={[typography.button, investigator ? typography.white : undefined]} >
            { selectedLabel }
          </Text>
          { !!selectedDescription && (
            <Text numberOfLines={2} ellipsizeMode="head" style={[typography.cardTraits, investigator ? typography.white : undefined]} >
              { selectedDescription }
            </Text>
          ) }
        </View>
        { !!selectedIcon && <View style={space.paddingLeftS}>{ getIcon(selectedIcon) }</View> }
      </View>
    );
  }, [typography, investigator, selectedLabel, selectedIcon, selectedDescription, selectedTrauma, selectedResolute]);
  const button = useMemo(() => {
    if (investigator) {
      return (
        <View style={[
          editable && !firstItem ? space.paddingTopXs : undefined,
          editable ? undefined : space.paddingBottomXs,
        ]}>
          <TouchableOpacity
            onPress={showDialog}
            disabled={!editable}
          >
            <CompactInvestigatorRow
              investigator={investigator}
              width={width}
            >
              { selection }
            </CompactInvestigatorRow>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <PickerStyleButton
        id="0"
        onPress={showDialog}
        title={title}
        disabled={!editable}
        value={selectedLabel}
      />
    );
  }, [investigator, showDialog, firstItem, selection, title, editable, width, selectedLabel]);
  return (
    <>
      { button }
      { dialog }
    </>
  );
}
