import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { filter, map, range, sortBy } from 'lodash';
import { t } from 'ttag';

import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '@app_constants';
import SealTokenButton from './SealTokenButton';
import { CampaignId, SealedToken } from '@actions/types';
import { useDispatch } from 'react-redux';
import AppIcon from '@icons/AppIcon';
import { updateChaosBagReleaseAllSealed, updateChaosBagSealTokens } from './actions';
import space, { s } from '@styles/space';
import { ChaosBagActions } from '@data/remote/chaosBag';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import { flattenChaosBag } from './campaignUtil';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import StyleContext from '@styles/StyleContext';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';
import DeckButton from '@components/deck/controls/DeckButton';
import useChaosTokenPicker from './useChaosTokenPicker';

export interface SealTokenDialogProps {
  campaignId: CampaignId;
  chaosBag: ChaosBag;
}

interface Props {
  campaignId: CampaignId;
  chaosBag: ChaosBag;
  chaosBagResults: ChaosBagResultsT;
  actions: ChaosBagActions;
}

export default function useSealTokenButton({ campaignId, chaosBag, chaosBagResults, actions }: Props): [React.ReactNode, React.ReactNode] {
  const { colors, typography } = useContext(StyleContext);
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

  const dispatch = useDispatch();
  const updateSealedTokens = useCallback((newSealedTokens: SealedToken[]) => {
    dispatch(updateChaosBagSealTokens(actions, campaignId, chaosBagResults, newSealedTokens));
  }, [dispatch, campaignId, chaosBagResults, actions]);

  const sealedTokens = useMemo(() => {
    return chaosBagResults.sealedTokens || [];
  }, [chaosBagResults]);
  const { dialog, showDialog } = useChaosTokenPicker({
    chaosTokens: allTokens,
    selectedTokens: sealedTokens,
    sealed: true,
    title: t`Sealed tokens`,
    updateChaosTokens: updateSealedTokens,
  });
  const releaseAllTokens = useCallback(() => {
    dispatch(updateChaosBagReleaseAllSealed(actions, campaignId, chaosBagResults));
  }, [campaignId, actions, dispatch, chaosBagResults]);
  const releaseSealedToken = useCallback((id: string) => {
    const newSealedTokens = filter(chaosBagResults.sealedTokens || [], token => token.id !== id);
    dispatch(updateChaosBagSealTokens(actions, campaignId, chaosBagResults, newSealedTokens));
  }, [dispatch, campaignId, actions, chaosBagResults]);

  const sealedTokensContent = useMemo(() => {
    const sealedTokens = chaosBagResults.sealedTokens;
    return map(sealedTokens, token => {
      return (
        <View style={space.paddingXs} key={token.id}>
          <SealTokenButton
            sealed
            onToggle={releaseSealedToken}
            id={token.id}
            iconKey={token.icon}
          />
        </View>
      );
    });
  }, [releaseSealedToken, chaosBagResults.sealedTokens]);

  const hasSealedTokens = chaosBagResults.sealedTokens.length;
  return [
    <View style={space.paddingBottomS} key="seal-button">
      { hasSealedTokens ? (
        <RoundedFactionBlock
          faction="neutral"
          header={
            <View style={[styles.headerBlock, { backgroundColor: colors.L10 }]}>
              <View style={space.paddingRightM}>
                <AppIcon name="seal" size={32} color={colors.D10} />
              </View>
              <Text style={typography.cardName}>
                { t`Sealed Tokens` }
              </Text>
            </View>
          }
          footer={
            <RoundedFooterDoubleButton
              iconA="expand"
              titleA={t`Seal tokens`}
              onPressA={showDialog}
              iconB="dismiss"
              titleB={t`Release all`}
              onPressB={releaseAllTokens}
            />}
        >
          <View style={[space.paddingTopS, space.paddingBottomS, styles.sealedTokenRow]}>
            { sealedTokensContent }
          </View>
        </RoundedFactionBlock>
      ) : (
        <DeckButton icon="seal" title={t`Seal tokens`} onPress={showDialog} color="dark_gray" />
      ) }
    </View>,
    dialog,
  ];
}
const styles = StyleSheet.create({
  sealedTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  headerBlock: {
    padding: s,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
