import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import space, { isTablet, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { find } from 'lodash';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import TraumaSummary from '@components/campaign/TraumaSummary';

interface Props {
  code: string;
  investigator?: Card;
  trauma?: boolean;
  investigatorButton?: React.ReactNode;
  name: string;
  description?: string;
  color?: string;
  selected: boolean;
  onChoiceToggle: (code: string, value: boolean) => void;
  onSecondaryChoice?: (code: string) => void;
  editable: boolean;
  last?: boolean;
}

function InvesigatorCheckListItemComponent({
  code,
  investigator,
  investigatorButton,
  trauma,
  selected,
  toggle,
  onSecondaryChoice,
  editable,
}: {
  code: string;
  investigator: Card;
  investigatorButton?: React.ReactNode;
  trauma?: boolean;
  selected: boolean;
  toggle: (value: boolean) => void;
  onSecondaryChoice?: (code: string) => void;
  editable: boolean;
}) {
  const { width } = useContext(StyleContext);
  const { campaignLog } = useContext(ScenarioStepContext);
  const onPress = useCallback(() => toggle(!selected), [selected, toggle]);
  const onSecondaryPress = useCallback(() => onSecondaryChoice?.(code), [onSecondaryChoice, code]);
  const yithian = useMemo(() => !!find(campaignLog.traumaAndCardData(code)?.storyAssets, x => x === BODY_OF_A_YITHIAN), [code, campaignLog]);
  const traumaAndCardData = useMemo(() => campaignLog.traumaAndCardData(investigator.code), [investigator.code, campaignLog]);
  const secondaryButton = useMemo(() => {
    if (!selected || !investigatorButton || !onSecondaryChoice) {
      return null;
    }
    return (editable ? (
      <TouchableOpacity
        style={[space.paddingXs, trauma ? space.paddingLeftS : space.paddingLeftM]}
        onPress={onSecondaryPress}
      >
        { investigatorButton }
      </TouchableOpacity>
    ) : investigatorButton);
  }, [onSecondaryChoice, onSecondaryPress, editable, selected, investigatorButton, trauma]);
  const content = useMemo(() => {
    const switchContent = (editable || selected) && (
      <View style={styles.switch}>
        <ArkhamSwitch
          onValueChange={toggle}
          disabled={!editable}
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
        yithian={yithian}
      >
        <View style={styles.rowRight}>
          { trauma && <View style={space.paddingRightXs}><TraumaSummary trauma={traumaAndCardData} investigator={investigator} whiteText /></View> }
          { onSecondaryChoice ? secondaryButton : switchContent }
        </View>
      </CompactInvestigatorRow>
    );
  }, [secondaryButton, width, onSecondaryChoice, editable, toggle, yithian, selected, investigator, trauma, traumaAndCardData]);
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
  trauma,
  name,
  description,
  color,
  selected,
  onChoiceToggle,
  onSecondaryChoice,
  editable,
  last,
}: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const toggle = useCallback((value: boolean) => {
    onChoiceToggle(code, value);
  }, [onChoiceToggle, code]);
  const content = useMemo(() => {
    return (
      <View style={styles.row}>
        { editable ? (
          <ArkhamSwitch
            value={selected}
            large
          />
        ) : (
          <ArkhamSwitch value large />
        ) }
        <View style={[styles.column, space.paddingLeftS]}>
          { name.startsWith('[') && name.endsWith(']') ? (
            <ArkhamIcon name={name.substr(1, name.length - 2)} color={colors.D30} size={36} />
          ) : (
            <Text style={[
              typography.mediumGameFont,
              styles.nameText,
              color ? { color: 'white' } : {},
            ]}>
              { name }
            </Text>
          ) }
          { !!description && (
            <Text style={[typography.cardTraits, color ? { color: 'white' } : {}]}>
              { description }
            </Text>
          )}
        </View>
      </View>
    );
  }, [name, typography, description, colors, color, editable, selected]);
  const onPress = useCallback(() => {
    toggle(!selected);
  }, [toggle, selected]);
  if (!editable && !selected) {
    return null;
  }
  if (investigator) {
    return (
      <InvesigatorCheckListItemComponent
        code={code}
        investigator={investigator}
        investigatorButton={investigatorButton}
        trauma={trauma}
        selected={selected}
        toggle={toggle}
        onSecondaryChoice={onSecondaryChoice}
        editable={editable}
      />
    );
  }
  const showBorder = !last && isTablet;
  return (
    <View style={[
      styles.row,
      space.paddingTopS,
      space.paddingBottomS,
      color ? { backgroundColor: color } : {},
      showBorder ? borderStyle : undefined,
      showBorder ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
    ]}>
      { editable ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content }
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
    justifyContent: 'flex-start',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  switch: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
