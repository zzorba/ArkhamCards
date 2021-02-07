import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { cloneDeep, find, filter, shuffle, sumBy, reverse } from 'lodash';
import { t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import { ChaosBag } from '@app_constants';
import { CampaignId, ChaosBagResults } from '@actions/types';
import ChaosToken, { SMALL_TOKEN_SIZE } from './ChaosToken';
import { adjustBlessCurseChaosBagResults, updateChaosBagResults } from './actions';
import SealTokenButton from './SealTokenButton';
import { flattenChaosBag } from './campaignUtil';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useChaosBagResults } from '@components/core/hooks';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';
import useSealTokenDialog from './useSealTokenDialog';
import DeckButton from '@components/deck/controls/DeckButton';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';
import { TINY_PHONE } from '@styles/sizes';

interface Props {
  campaignId: CampaignId;
  chaosBag: ChaosBag;
}

function BlessCurseCounter({ type, value, min, inc, dec }: { type: 'bless' | 'curse'; min: number; value: number; inc: () => void; dec: () => void; }) {
  const { typography } = useContext(StyleContext);
  const element = useMemo(() => {
    const textColor = type === 'bless' ? '#394852' : '#F5F0E1';
    return (
      <View style={[{ borderRadius: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: type === 'bless' ? '#cfb13a' : '#7B5373' },
        TINY_PHONE ? space.paddingSideS : space.paddingSideM, space.paddingTopXs, space.marginRightXs, space.marginLeftXs]}>
        <Text style={[typography.cardName, { color: textColor, minWidth: 32 }, typography.center, space.paddingRightXs]}>
          { value === 0 ? '0' : `×${value}`}
        </Text>
        <View style={space.paddingBottomS}>
          <ArkhamIcon name={type} size={28} color={textColor} />
        </View>
      </View>
    );
  }, [type, value, typography]);
  return (
    <PlusMinusButtons
      dialogStyle
      countRender={element}
      count={value}
      max={10}
      min={min}
      onIncrement={inc}
      onDecrement={dec}
    />
  );
}

export default function DrawChaosBagComponent({ campaignId, chaosBag }: Props) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const chaosBagResults = useChaosBagResults(campaignId);
  const [isChaosBagEmpty, setIsChaosBagEmpty] = useState(false);
  const [sealDialog, showSealDialog] = useSealTokenDialog(campaignId, chaosBag, chaosBagResults);
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

  const releaseAllTokens = useCallback(() => {
    dispatch(updateChaosBagResults(campaignId, {
      ...chaosBagResults,
      sealedTokens: [],
    }));
  }, [campaignId, dispatch, chaosBagResults]);

  const handleResetBlessCursePressed = useCallback(() => {
    dispatch(updateChaosBagResults(campaignId, {
      ...chaosBagResults,
      blessTokens: 0,
      curseTokens: 0,
      drawnTokens: filter(chaosBagResults.drawnTokens, t => t !== 'bless' && t !== 'curse'),
      sealedTokens: filter(chaosBagResults.sealedTokens, t => t.icon !== 'bless' && t.icon !== 'curse'),
    }));
  }, [campaignId, dispatch, chaosBagResults]);

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
    const drawnTokens = chaosBagResults.drawnTokens;
    if (drawnTokens.length > 1) {
      return reverse(drawnTokens.slice(0, drawnTokens.length - 1).map(function(token, index) {
        return (
          <View style={space.paddingSideXs} key={index}>
            <ChaosToken
              iconKey={token}
              small
            />
          </View>
        );
      }));
    }
    return null;
  }, [chaosBagResults.drawnTokens]);

  const chaosToken = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    const iconKey = drawnTokens[drawnTokens.length - 1] || undefined;
    return (
      <Pressable onPress={handleDrawTokenPressed}>
        <ChaosToken iconKey={iconKey || 'tap'} shadow />
      </Pressable>
    );
  }, [chaosBagResults.drawnTokens, handleDrawTokenPressed]);

  const releaseSealedToken = useCallback((id: string) => {
    let newSealedTokens = [...chaosBagResults.sealedTokens];
    newSealedTokens = newSealedTokens.filter(token => token.id !== id);
    const newChaosBagResults = {
      ...chaosBagResults,
      drawnTokens: chaosBagResults.drawnTokens,
      sealedTokens: newSealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    dispatch(updateChaosBagResults(campaignId, newChaosBagResults));
  }, [dispatch, campaignId, chaosBagResults]);
  const sealedTokens = useMemo(() => {
    const sealedTokens = chaosBagResults.sealedTokens;
    return sealedTokens.map(token => {
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

  const drawButton = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    if (drawnTokens.length > 0) {
      if (isChaosBagEmpty) {
        return (
          <View style={[styles.advancedButton, styles.advancedButtonLeft]}>
            <View style={[space.paddingSideS, styles.advancedButton, styles.advancedButtonLeft]}>
              <Text style={[typography.cardTraits, typography.right]}>
                { t`Chaos bag is empty` }
              </Text>
              <ChaosToken tiny />
            </View>
          </View>
        );
      }
      return (
        <View style={[styles.advancedButton, styles.advancedButtonLeft]}>
          <TouchableWithoutFeedback onPress={handleAddAndDrawAgainPressed}>
            <View style={[space.paddingSideS, styles.advancedButton]}>
              <Text style={[typography.cardTraits, typography.right, space.paddingRightS]}>
                { t`Draw another` }
              </Text>
              <ChaosToken iconKey="another" tiny shadow />
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
  }, [chaosBagResults.drawnTokens, handleAddAndDrawAgainPressed, typography, isChaosBagEmpty]);

  const clearButton = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    if (drawnTokens.length >= 1) {
      return (
        <View style={[styles.advancedButton, styles.advancedButtonRight]}>
          <TouchableWithoutFeedback onPress={handleClearTokensRemoveBlessCursePressed}>
            <View style={[space.paddingSideS, styles.advancedButton, styles.advancedButtonRight]}>
              <ChaosToken iconKey="return" tiny />
              <Text style={[typography.cardTraits, space.paddingLeftS]} numberOfLines={2}>
                { t`Return tokens` }
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return null;
  }, [chaosBagResults.drawnTokens, typography, handleClearTokensRemoveBlessCursePressed]);

  const returnBlessCurse = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    const hasBlessCurse = find(drawnTokens, token => token === 'bless' || token === 'curse');
    if (!hasBlessCurse) {
      return null;
    }
    return (
      <View style={[styles.advancedButton, styles.advancedButtonRight]}>
        <TouchableWithoutFeedback onPress={handleClearTokensPressed}>
          <View style={[space.paddingSideS, styles.advancedButton, styles.advancedButtonRight]}>
            <ChaosToken iconKey="return" tiny />
            <Text style={[typography.cardTraits, space.paddingLeftS]} numberOfLines={2}>
              { t`Return all tokens\n(including Bless/Curse)` }
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [chaosBagResults, typography, handleClearTokensPressed]);
  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerBottom} contentContainerStyle={backgroundStyle}>
        <KeepAwake />
        <View style={[styles.containerTop, space.paddingBottomS, { borderColor: colors.L20 }]}>
          <ScrollView horizontal contentContainerStyle={styles.drawnTokenRow} overScrollMode="never">
            { drawnTokens }
          </ScrollView>
          <View style={[styles.chaosTokenView, space.paddingSideS]}>
            { chaosToken }
          </View>
          <View style={[space.paddingSideS, styles.drawButtonRow, space.marginTopM]}>
            { drawButton }
            { clearButton }
          </View>
          { (!TINY_PHONE || !!returnBlessCurse) && (
            <View style={[space.paddingSideS, styles.drawButtonRow]}>
              <View style={styles.advancedButton} />
              { returnBlessCurse }
            </View>
          ) }
        </View>
        <View style={[styles.blessCurseBlock, space.paddingTopM, space.paddingBottomM, space.paddingSideS, { borderColor: colors.L20 }]}>
          <BlessCurseCounter
            value={chaosBagResults.blessTokens || 0}
            inc={incBless}
            dec={decBless}
            min={sumBy(chaosBagResults.sealedTokens, token => token.icon === 'bless' ? 1 : 0)}
            type="bless"
          />
          <BlessCurseCounter
            value={chaosBagResults.curseTokens || 0}
            inc={incCurse}
            dec={decCurse}
            min={sumBy(chaosBagResults.sealedTokens, token => token.icon === 'curse' ? 1 : 0)}
            type="curse"
          />
        </View>
        <View style={space.paddingS}>
          { chaosBagResults.sealedTokens.length > 0 ? (
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
                  onPressA={showSealDialog}
                  iconB="dismiss"
                  titleB={t`Release all`}
                  onPressB={releaseAllTokens}
                />}
            >
              <View style={styles.drawnTokenRow}>
                { sealedTokens }
              </View>
            </RoundedFactionBlock>
          ) : (
            <View style={space.paddingBottomS}>
              <DeckButton icon="seal" title={t`Seal tokens`} onPress={showSealDialog} color="dark_gray" />
            </View>
          ) }
          { !((chaosBagResults.blessTokens || 0) === 0 && (chaosBagResults.curseTokens || 0) === 0) && (
            <View style={space.paddingTopM}>
              <DeckButton icon="dismiss" title={t`Remove all bless & curse tokens`} onPress={handleResetBlessCursePressed} color="dark_gray" />
            </View>
          )}
        </View>
      </ScrollView>
      { sealDialog }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  drawButtonRow: {
    minHeight: SMALL_TOKEN_SIZE,
    flexDirection: 'row',
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blessCurseBlock: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerBottom: {
    flex: 1,
    flexDirection: 'column',
  },
  drawnTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: SMALL_TOKEN_SIZE + s * 2,
  },
  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advancedButtonLeft: {
    justifyContent: 'flex-end',
  },
  advancedButtonRight: {
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
