import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

interface Props {
  code: string;
  investigator?: Card;
  investigatorButton?: React.ReactNode;
  name: string;
  color?: string;
  selected: boolean;
  onChoiceToggle: (code: string, value: boolean) => void;
  onSecondaryChoice?: (code: string) => void;
  editable: boolean;
}

function InvesigatorCheckListItemComponent({
  code,
  investigator,
  investigatorButton,
  selected,
  toggle,
  onSecondaryChoice,
  editable,
}: {
  code: string;
  investigator: Card;
  investigatorButton?: React.ReactNode;
  selected: boolean;
  toggle: (value: boolean) => void;
  onSecondaryChoice?: (code: string) => void;
  editable: boolean;
}) {
  const { width } = useContext(StyleContext);
  const onPress = useCallback(() => toggle(!selected), [selected, toggle]);
  const onSecondaryPress = useCallback(() => onSecondaryChoice?.(code), [onSecondaryChoice, code]);

  const secondaryButton = useMemo(() => {
    if (!selected || !investigatorButton || !onSecondaryChoice) {
      return null;
    }
    return editable ? (
      <TouchableOpacity
        style={[space.paddingXs, space.paddingLeftM]}
        onPress={onSecondaryPress}
      >
        { investigatorButton }
      </TouchableOpacity>
    ) : investigatorButton;
  }, [onSecondaryChoice, onSecondaryPress, editable, selected, investigatorButton]);
  const content = useMemo(() => {
    const switchContent = (editable || selected) && (
      <View style={styles.switch}>
        <ArkhamSwitch
          onValueChange={toggle}
          value={selected}
          large
          color="light"
          circleColor="light"
        />
      </View>
    );
    return (
      <CompactInvestigatorRow
        width={width - s * (editable ? 4 : 2)}
        leftContent={onSecondaryChoice ? switchContent : undefined}
        investigator={investigator}
      >
        { onSecondaryChoice ? secondaryButton : switchContent }
      </CompactInvestigatorRow>
    );
  }, [secondaryButton, width, onSecondaryChoice, editable, toggle, selected, investigator]);
  return (
    <View style={space.paddingBottomXs}>
      { editable ? (
        <TouchableOpacity onPress={onPress}>
          { content }
        </TouchableOpacity>
      ) : content }
    </View>
  );
}

export default function CheckListItemComponent({
  code,
  investigator,
  investigatorButton,
  name,
  color,
  selected,
  onChoiceToggle,
  onSecondaryChoice,
  editable,
}: Props) {
  const { typography } = useContext(StyleContext);
  const toggle = useCallback((value: boolean) => {
    onChoiceToggle(code, value);
  }, [onChoiceToggle, code]);
  if (!editable && !selected) {
    return null;
  }
  if (investigator) {
    return (
      <InvesigatorCheckListItemComponent
        code={code}
        investigator={investigator}
        investigatorButton={investigatorButton}
        selected={selected}
        toggle={toggle}
        onSecondaryChoice={onSecondaryChoice}
        editable={editable}
      />
    );
  }
  return (
    <View style={[
      styles.row,
      space.paddingTopS,
      space.paddingBottomS,
      color ? { backgroundColor: color } : {},
    ]}>

      <Text style={[
        space.paddingLeftS,
        typography.mediumGameFont,
        styles.nameText,
        color ? { color: 'white' } : {},
      ]}>
        { name }
      </Text>
      { editable ? (
        <ArkhamSwitch
          onValueChange={toggle}
          value={selected}
          large
        />
      ) : (
        <ArkhamSwitch value large />
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
