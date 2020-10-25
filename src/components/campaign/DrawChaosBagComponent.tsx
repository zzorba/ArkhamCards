import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { cloneDeep, find, shuffle, sumBy } from 'lodash';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import BasicButton from '@components/core/BasicButton';
import { ChaosBag } from '@app_constants';
import { ChaosBagResults } from '@actions/types';
import CounterRow from '@components/core/CounterRow';
import ChaosToken from './ChaosToken';
import { adjustBlessCurseChaosBagResults, updateChaosBagResults } from './actions';
import { SealTokenDialogProps } from './SealTokenDialog';
import SealTokenButton from './SealTokenButton';
import { flattenChaosBag } from './campaignUtil';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { useChaosBagResults } from '@components/core/hooks';

interface Props {
  componentId: string;
  campaignId: number;
  chaosBag: ChaosBag;
}

export default function DrawChaosBagComponent({ componentId, campaignId, chaosBag }: Props) {
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const dispatch = useDispatch()
  const chaosBagResults = useChaosBagResults(campaignId);
  const [isChaosBagEmpty, setIsChaosBagEmpty] = useState(false);

  const clearTokens = useCallback((removeBlessCurse?: boolean) => {
    const blessToRemove = removeBlessCurse ? sumBy(chaosBagResults.drawnTokens, token => token === 'bless' ? 1 : 0) : 0;
    const curseToRemove = removeBlessCurse ? sumBy(chaosBagResults.drawnTokens, token => token === 'curse' ? 1 : 0) : 0;

    const newChaosBagResults: ChaosBagResults = {
      drawnTokens: [],
      blessTokens: (chaosBagResults.blessTokens || 0) - blessToRemove,
      curseTokens: (chaosBagResults.curseTokens || 0) - curseToRemove,
      sealedTokens: chaosBagResults.sealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    dispatch(updateChaosBagResults(campaignId, newChaosBagResults));
  }, [campaignId, chaosBagResults, dispatch]);

  const handleClearTokensPressed = useCallback(() => {
    clearTokens();
  }, [clearTokens]);

  const handleClearTokensRemoveBlessCursePressed = useCallback(() => {
    clearTokens(true);
  }, [clearTokens]);

  const getRandomChaosToken = useCallback((chaosBag: ChaosBag) => {
    const weightedList = flattenChaosBag(chaosBag);

    setIsChaosBagEmpty(weightedList.length <= 1);

    return shuffle(weightedList)[0];
  }, [setIsChaosBagEmpty]);

  const drawToken = useCallback(() =>{
    const currentChaosBag = cloneDeep(chaosBag);
    currentChaosBag.bless = chaosBagResults.blessTokens || 0;
    currentChaosBag.curse = chaosBagResults.curseTokens || 0;

    const drawnTokens = [...chaosBagResults.drawnTokens];
    const sealedTokens = [...chaosBagResults.sealedTokens].map(token => token.icon);
    const drawnAndSealedTokens = drawnTokens.concat(sealedTokens);

    drawnAndSealedTokens.forEach(function(token) {
      const currentCount = currentChaosBag[token];
      if (currentCount) {
        currentChaosBag[token] = currentCount - 1;
      }
    });

    const newIconKey = getRandomChaosToken(currentChaosBag);

    if (newIconKey) {
      drawnTokens.push(newIconKey);

      const newChaosBagResults = {
        ...chaosBagResults,
        drawnTokens: drawnTokens,
        sealedTokens: chaosBagResults.sealedTokens,
        totalDrawnTokens: chaosBagResults.totalDrawnTokens + 1,
      };

      dispatch(updateChaosBagResults(campaignId, newChaosBagResults));
    } else {
      clearTokens();
    }
  }, [campaignId, chaosBag, chaosBagResults, dispatch, clearTokens, getRandomChaosToken]);

  const handleDrawTokenPressed = useCallback(() => {
    if (chaosBagResults.drawnTokens.length >= 1) {
      clearTokens();
    } else {
      drawToken();
    }
  }, [chaosBagResults, clearTokens, drawToken]);

  const handleAddAndDrawAgainPressed = useCallback(() => {
    drawToken();
  }, [drawToken]);

  const handleSealTokensPressed = useCallback(() => {
    const passProps: SealTokenDialogProps = {
      campaignId: campaignId,
      chaosBag,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.SealToken',
            passProps,
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }, [campaignId, chaosBag]);

  const incBless = useCallback(() => {
    dispatch(adjustBlessCurseChaosBagResults(campaignId, 'bless', 'inc'));
  }, [campaignId, dispatch]);

  const decBless = useCallback(() => {
    dispatch(adjustBlessCurseChaosBagResults(campaignId, 'bless', 'dec'));
  }, [campaignId, dispatch]);

  const incCurse = useCallback(() => {
    dispatch(adjustBlessCurseChaosBagResults(campaignId, 'curse', 'inc'));
  }, [campaignId, dispatch]);

  const decCurse = useCallback(() => {
    dispatch(adjustBlessCurseChaosBagResults(campaignId, 'curse', 'dec'));
  }, [campaignId, dispatch]);

  const drawnTokens = useMemo(() => {
    const {
      drawnTokens,
    } = chaosBagResults;

    if (drawnTokens.length > 1) {
      return drawnTokens.slice(0, drawnTokens.length - 1).map(function(token, index) {
        return (
          <ChaosToken
            key={index}
            iconKey={token}
            small
          />
        );
      });
    }

    return (
      <Text style={[styles.drawTokenText, typography.text, space.paddingTopM]}>
        { t`Tap token to draw` }
      </Text>
    );
  }, [chaosBagResults.drawnTokens, typography]);

  const chaosToken = useMemo(() => {
    const { drawnTokens } = chaosBagResults;
    const iconKey = drawnTokens[drawnTokens.length - 1] || undefined;
    return (
      <TouchableOpacity onPress={handleDrawTokenPressed}>
        <ChaosToken iconKey={iconKey} />
      </TouchableOpacity>
    );
  }, [chaosBagResults.drawnTokens, handleDrawTokenPressed]);

  const sealedTokens = useMemo(() => {
    const { sealedTokens } = chaosBagResults;
    return sealedTokens.map(token => {
      return (
        <SealTokenButton
          key={token.id}
          campaignId={campaignId}
          sealed
          id={token.id}
          iconKey={token.icon}
        />
      );
    });
  }, [campaignId, chaosBagResults.sealedTokens]);

  const drawButton = useMemo(() => {
    const { drawnTokens } = chaosBagResults;
    if (drawnTokens.length > 0) {
      return (
        <BasicButton
          title={isChaosBagEmpty ? t`Chaos bag is empty` : t`Set aside and draw another`}
          onPress={handleAddAndDrawAgainPressed}
          disabled={isChaosBagEmpty}
        />
      );
    }
  }, [chaosBagResults.drawnTokens, handleAddAndDrawAgainPressed, isChaosBagEmpty]);

  const clearButton = useMemo(() => {
    const { drawnTokens } = chaosBagResults;
    if (drawnTokens.length > 1) {
      const hasBlessCurse = find(drawnTokens, token => token === 'bless' || token === 'curse');
      if (hasBlessCurse) {
        return (
          <>
            <BasicButton title={t`Return Non Bless / Curse Tokens`} onPress={handleClearTokensRemoveBlessCursePressed} />
            <BasicButton title={t`Return All Tokens`} onPress={handleClearTokensPressed} />
          </>
        );
      }

      return (
        <BasicButton title={t`Return Tokens`} onPress={handleClearTokensPressed} />
      );
    }
    return null;
  }, [chaosBagResults.drawnTokens, handleClearTokensPressed, handleClearTokensRemoveBlessCursePressed]);

  return (
    <ScrollView style={styles.containerBottom} contentContainerStyle={backgroundStyle}>
      <KeepAwake />
      <View style={[styles.containerTop, borderStyle]}>
        <View style={styles.chaosTokenView}>
          { chaosToken }
        </View>
        <View style={styles.drawButtonView}>
          { drawButton }
        </View>
      </View>
      <CardSectionHeader section={{ subTitle: t`Drawn`, subTitleDetail: t`Total (${chaosBagResults.totalDrawnTokens})` }} />
      <View style={styles.container}>
        <View style={styles.drawnTokenRow}>
          { drawnTokens }
        </View>
        <View>
          { clearButton }
        </View>
      </View>
      <CardSectionHeader section={{ subTitle: t`Bless / Curse Tokens` }} />
      <View style={styles.container}>
        <CounterRow
          value={chaosBagResults.blessTokens || 0}
          inc={incBless}
          dec={decBless}
          min={sumBy(chaosBagResults.sealedTokens, token => token.icon === 'bless' ? 1 : 0)}
          max={10}
          label={t`Bless`}
        />
        <CounterRow
          value={chaosBagResults.curseTokens || 0}
          inc={incCurse}
          dec={decCurse}
          min={sumBy(chaosBagResults.sealedTokens, token => token.icon === 'curse' ? 1 : 0)}
          max={10}
          label={t`Curse`}
        />
      </View>
      <CardSectionHeader section={{ subTitle: t`Sealed Tokens` }} />
      <View style={styles.container}>
        { chaosBagResults.sealedTokens.length > 0 && <View style={styles.drawnTokenRow}>
          { sealedTokens }
        </View> }
        <BasicButton
          title={t`Seal Tokens`}
          onPress={handleSealTokensPressed}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  drawButtonView: {
    flex: 1,
    minHeight: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chaosTokenView: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: s,
  },
  containerTop: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: s,
  },
  containerBottom: {
    flex: 1,
    flexDirection: 'column',
  },
  drawnTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    minHeight: 89,
  },
  drawTokenText: {
    flex: 1,
    textAlign: 'center',
  },
});
