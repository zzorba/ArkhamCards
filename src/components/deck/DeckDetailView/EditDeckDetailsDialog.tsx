import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { t } from 'ttag';
import DialogComponent from '@lib/react-native-dialog';

import Dialog from '@components/core/Dialog';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import COLORS from '@styles/colors';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter } from '@components/core/hooks';

interface Props {
  name: string;
  xp: number;
  spentXp: number;
  xpAdjustment: number;
  xpAdjustmentEnabled: boolean;
  visible: boolean;
  viewRef?: View;
  toggleVisible: () => void;
  updateDetails: (name: string, xpAdjustment: number) => void;
}

export default function EditDeckDetailsDialog(props: Props) {
  const {
    visible,
    updateDetails,
    xp,
    spentXp,
    toggleVisible,
    viewRef,
    xpAdjustmentEnabled,
  } = props;
  const { typography } = useContext(StyleContext);
  const [name, setName] = useState(props.name);
  const [xpAdjustment, incXp, decXp, setXpAdjustment] = useCounter(props.xpAdjustment, {});
  useEffect(() => {
    if (visible) {
      setName(props.name);
      setXpAdjustment(props.xpAdjustment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const textInputRef = useRef<TextInput>(null);

  const onOkayPress = useCallback(() => {
    updateDetails(name, xpAdjustment);
  }, [name, xpAdjustment, updateDetails]);

  const xpString = useMemo(() => {
    const adjustedExperience = xp + xpAdjustment;
    if (xpAdjustment !== 0) {
      const adjustment = xpAdjustment > 0 ? `+${xpAdjustment}` : xpAdjustment;
      return t`XP: ${spentXp} of ${adjustedExperience} (${adjustment})`;
    }
    return t`XP: ${spentXp} of ${adjustedExperience} (+0)`;
  }, [xp, spentXp, xpAdjustment]);

  const okDisabled = !name.length;
  return (
    <Dialog
      title={t`Deck Details`}
      visible={visible}
      viewRef={viewRef}
    >
      <View style={styles.column}>
        <DialogComponent.Description style={[typography.smallLabel, space.marginTopM]}>
          { t`NAME` }
        </DialogComponent.Description>
        <DialogComponent.Input
          textInputRef={textInputRef}
          value={name}
          onChangeText={setName}
          returnKeyType="done"
        />
      </View>
      { !!xpAdjustmentEnabled && (
        <View style={styles.column}>
          <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
            { t`EXPERIENCE` }
          </DialogComponent.Description>
          <View style={styles.buttonsRow}>
            <View style={styles.buttonLabel}>
              <Text style={typography.dialogLabel}>
                { xpString }
              </Text>
            </View>
            <PlusMinusButtons
              count={xpAdjustment}
              onIncrement={incXp}
              onDecrement={decXp}
              size={36}
              color="dark"
              allowNegative
            />
          </View>
        </View>
      ) }
      <DialogComponent.Button
        label={t`Cancel`}
        onPress={toggleVisible}
      />
      <DialogComponent.Button
        label={t`Okay`}
        color={okDisabled ? COLORS.darkGray : COLORS.lightBlue}
        disabled={okDisabled}
        onPress={onOkayPress}
      />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: Platform.OS === 'ios' ? 28 : 8,
    paddingLeft: Platform.OS === 'ios' ? 28 : 8,
    marginBottom: m,
  },
  buttonLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
