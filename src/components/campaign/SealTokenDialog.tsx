import React, { useCallback, useMemo } from 'react';
import { ScrollView,StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { flatMap, keys, map, range, sortBy } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { NavigationProps } from '@components/nav/types';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { AppState, getChaosBagResults } from '@reducers';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '@app_constants';
import { ChaosBagResults } from '@actions/types';
import SealTokenButton from './SealTokenButton';
import { useNavigationButtonPressed } from '@components/core/hooks';

export interface SealTokenDialogProps {
  campaignId: number;
  chaosBag: ChaosBag;
}

function SealTokenDialog({ componentId, campaignId, chaosBag }: SealTokenDialogProps & NavigationProps) {
  const chaosBagResultsSelector = useCallback((state: AppState) => getChaosBagResults(state, campaignId), [campaignId]);
  const chaosBagResults = useSelector(chaosBagResultsSelector);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    }
  }, componentId, []);

  const close = useCallback(() => {
    Navigation.dismissModal(componentId);
  }, [componentId]);

  const allChaosTokens = useMemo(() => {
    const unsortedTokens: ChaosTokenType[] = keys(chaosBag) as ChaosTokenType[];
    const tokens: ChaosTokenType[] = sortBy<ChaosTokenType>(
      unsortedTokens,
      token => CHAOS_TOKEN_ORDER[token]
    );
    const blessTokens: ChaosTokenType[] = map(range(0, chaosBagResults.blessTokens || 0), () => 'bless');
    const curseTokens: ChaosTokenType[] = map(range(0, chaosBagResults.curseTokens || 0), () => 'curse');
    const tokenParts: ChaosTokenType[] = [
      ...flatMap(tokens, token => map(range(0, chaosBag[token]), () => token)),
      ...blessTokens,
      ...curseTokens,
    ];

    const sealedTokens = chaosBagResults.sealedTokens;

    let currentToken: ChaosTokenType;
    let tokenCount = 1;

    return tokenParts.map((token, index) => {
      if (currentToken !== token) {
        currentToken = token;
        tokenCount = 1;
      } else {
        tokenCount += 1;
      }

      const id = `${token}_${tokenCount}`;
      let sealed = false;
      const sealedToken = sealedTokens.find(sealedToken => sealedToken.id === id);
      if (sealedToken) {
        sealed = true;
      }

      return (
        <SealTokenButton
          key={index}
          id={id}
          sealed={sealed}
          campaignId={campaignId}
          canDisable
          iconKey={token}
        />
      );
    });
  }, [campaignId, chaosBag, chaosBagResults]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.drawnTokenRow}>{ allChaosTokens }</View>
      <BasicButton title={t`Done`} onPress={close} />
    </ScrollView>
  );
}

SealTokenDialog.options = () => {
  return {
    topBar: {
      title: {
        text: t`Choose Tokens to Seal`,
      },
      leftButtons: [{
        icon: iconsMap.close,
        id: 'close',
        color: COLORS.M,
        accessibilityLabel: t`Cancel`,
      }],
    },
  };
};
export default SealTokenDialog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 15,
  },
  drawnTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    minHeight: 89,
  },
});
