import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, forEach, map } from 'lodash';
import { t } from 'ttag';

import { SealedToken } from '@actions/types';
import { Toggles, useEffectUpdate, useToggles } from '@components/core/hooks';
import SealTokenButton from './SealTokenButton';
import space from '@styles/space';
import { useDialog } from '@components/deck/dialogs';

interface Props {
  chaosTokens: SealedToken[];
  selectedTokens: SealedToken[];
  sealed: boolean;
  title: string;
  updateChaosTokens: (chaosTokens: SealedToken[]) => void;
}

function tokensToToggles(chaosTokens: SealedToken[]): Toggles {
  const result: Toggles = {};
  forEach(chaosTokens, t => {
    result[t.id] = true;
  });
  return result;
}

export default function useChaosTokenPicker({ chaosTokens, selectedTokens, sealed, title, updateChaosTokens }: Props) {
  const [selected, toggleSelected,,syncToggles] = useToggles(tokensToToggles(selectedTokens));
  useEffectUpdate(() => {
    syncToggles(tokensToToggles(selectedTokens));
  }, [selectedTokens]);

  const content = useMemo(() => {
    return (
      <View style={[styles.drawnTokenRow, space.paddingBottomS]}>
        { map(chaosTokens, ({ id, icon }) => {
          return (
            <View style={space.paddingXs} key={id}>
              <SealTokenButton
                id={id}
                sealed={sealed ? !!selected[id] : !selected[id]}
                onToggle={toggleSelected}
                iconKey={icon}
              />
            </View>
          );
        }) }
      </View>
    );
  }, [chaosTokens, sealed, selected, toggleSelected]);
  const onCancel = useCallback(() => {
    syncToggles(tokensToToggles(selectedTokens));
  }, [syncToggles, selectedTokens]);
  const onConfirm = useCallback(() => {
    const newSealedTokens = filter(chaosTokens, t => {
      return !!selected[t.id];
    });
    updateChaosTokens(newSealedTokens);
  }, [updateChaosTokens, chaosTokens, selected]);

  return useDialog({
    title,
    dismiss: {
      title: t`Cancel`,
      onPress: onCancel,
    },
    confirm: {
      title: t`Done`,
      onPress: onConfirm,
    },
    content,
    alignment: 'bottom',
  });
}

const styles = StyleSheet.create({
  drawnTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
