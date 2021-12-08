import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, forEach, map, range, sortBy } from 'lodash';
import { t } from 'ttag';

import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '@app_constants';
import SealTokenButton from './SealTokenButton';
import { Toggles, useEffectUpdate, useToggles } from '@components/core/hooks';
import { CampaignId, ChaosBagResults, SealedToken } from '@actions/types';
import { useDialog } from '@components/deck/dialogs';
import { useDispatch } from 'react-redux';
import { updateChaosBagSealTokens } from './actions';
import space from '@styles/space';
import { ChaosBagActions } from '@data/remote/chaosBag';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import { flattenChaosBag } from './campaignUtil';

export interface SealTokenDialogProps {
  campaignId: CampaignId;
  chaosBag: ChaosBag;
}

function getSealedToggles(chaosBagResults: ChaosBagResults): Toggles {
  const toggles: Toggles = {};
  forEach(chaosBagResults.sealedTokens || [], token => {
    toggles[token.id] = true;
  });
  return toggles;
}

export default function useSealTokenDialog(campaignId: CampaignId, chaosBag: ChaosBag, chaosBagResults: ChaosBagResultsT, actions: ChaosBagActions): [React.ReactNode, () => void] {
  const [sealed, toggleSealToken,,syncToggles] = useToggles(getSealedToggles(chaosBagResults));
  const allTokens: SealedToken[] = useMemo(() => {
    const tokens: ChaosTokenType[] = sortBy<ChaosTokenType>(
      flattenChaosBag(chaosBag, chaosBagResults.tarot),
      token => CHAOS_TOKEN_ORDER[token]
    );
    const blessTokens: ChaosTokenType[] = map(range(0, chaosBagResults.blessTokens || 0), () => 'bless');
    const curseTokens: ChaosTokenType[] = map(range(0, chaosBagResults.curseTokens || 0), () => 'curse');
    const tokenParts: ChaosTokenType[] = [
      ...tokens,
      ...blessTokens,
      ...curseTokens,
    ];

    let currentToken: ChaosTokenType;
    let tokenCount = 1;

    return tokenParts.map(token => {
      if (currentToken !== token) {
        currentToken = token;
        tokenCount = 1;
      } else {
        tokenCount += 1;
      }

      const id = `${token}_${tokenCount}`;
      return {
        id,
        icon: token,
      };
    });
  }, [chaosBag, chaosBagResults.blessTokens, chaosBagResults.curseTokens, chaosBagResults.tarot]);

  useEffectUpdate(() => {
    syncToggles(getSealedToggles(chaosBagResults));
  }, [chaosBagResults]);

  const dispatch = useDispatch();
  const onConfirm = useCallback(() => {
    const newSealedTokens = filter(allTokens, t => {
      return !!sealed[t.id];
    });


    dispatch(updateChaosBagSealTokens(actions, campaignId, chaosBagResults, newSealedTokens));
  }, [dispatch, campaignId, chaosBagResults, actions, allTokens, sealed]);

  const content = useMemo(() => {
    return (
      <View style={[styles.drawnTokenRow, space.paddingBottomS]}>
        { map(allTokens, ({ id, icon }) => {
          return (
            <View style={space.paddingXs} key={id}>
              <SealTokenButton
                id={id}
                sealed={!!sealed[id]}
                onToggle={toggleSealToken}
                iconKey={icon}
              />
            </View>
          );
        }) }
      </View>
    );
  }, [allTokens, sealed, toggleSealToken]);
  const onCancel = useCallback(() => {
    syncToggles(getSealedToggles(chaosBagResults));
  }, [syncToggles, chaosBagResults]);
  const { dialog, showDialog } = useDialog({
    title: t`Seal tokens`,
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
  return [dialog, showDialog];
}
const styles = StyleSheet.create({
  drawnTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
