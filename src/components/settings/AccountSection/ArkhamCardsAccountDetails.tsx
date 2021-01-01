import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import database from '@react-native-firebase/database';
import functions from '@react-native-firebase/functions';
import { useTextDialog } from '@components/deck/dialogs';

export default function ArkhamCardsAccountDetails() {
  const { user, loading } = useContext(ArkhamCardsAuthContext);
  const { typography } = useContext(StyleContext);
  const handle = 'zzorba';
  const updateHandle = useCallback((handle: string) => {
    functions().httpsCallable('social-updateHandle')({ handle });
  }, []);
  const { dialog, showDialog } = useTextDialog({
    title: t`Account Handle`,
    value: handle,
    onValueChange: updateHandle,
    placeholder: t`Choose a handle for your account`,
  });
  if (!user) {
    return (
      <View style={[space.paddingBottomS, space.paddingTopS]}>
        <Text>{t`An Arkham Cards account will let you sync campaigns between devices.`}</Text>
      </View>
    );
  }
  return (
    <View style={[space.paddingTopS]}>
      <DeckPickerStyleButton
        icon="name"
        editable
        title={t`Handle`}
        valueLabel={handle}
        onPress={showDialog}
        first
        last
      />
      { dialog }
    </View>
  );
}

const styles = StyleSheet.create({

});