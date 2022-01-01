import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, Pressable, TouchableWithoutFeedback, TouchableOpacity, View, LayoutChangeEvent } from 'react-native';
import { useDispatch } from 'react-redux';
import { cloneDeep, find, filter, map, shuffle, sumBy, reverse, uniq, forEach } from 'lodash';
import { jt, t } from 'ttag';
import KeyEvent from 'react-native-keyevent';
import KeepAwake from 'react-native-keep-awake';

import { ChaosBag, ChaosTokenType } from '@app_constants';
import { CampaignDifficulty, CampaignId } from '@actions/types';
import ChaosToken, { SMALL_TOKEN_SIZE } from './ChaosToken';
import { setBlessCurseChaosBagResults, updateChaosBagClearTokens, updateChaosBagDrawToken, updateChaosBagResetBlessCurse } from './actions';
import { flattenChaosBag } from './campaignUtil';
import space, { s, xs, isTablet } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useChaosBagResults } from '@data/hooks';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';
import useSealTokenButton from './useSealTokenButton';
import DeckButton from '@components/deck/controls/DeckButton';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import { useChaosBagActions } from '@data/remote/chaosBag';
import CardTextComponent from '@components/card/CardTextComponent';
import { difficultyString } from './constants';
import useTarotCardDialog from './useTarotCardDialog';
import useNetworkStatus from '@components/core/useNetworkStatus';
import COLORS from '@styles/colors';
import { useDialog } from '@components/deck/dialogs';
import { useCounter } from '@components/core/hooks';

interface Props {
  campaignId: CampaignId;
  chaosBag: ChaosBag;
  difficulty?: CampaignDifficulty;
  scenarioCardText?: string;
  viewChaosBagOdds: () => void;
  editViewPressed: () => void;
  editable?: boolean;
}

function BlessCurseButton({ type, value, onPress }: { type: 'bless' | 'curse'; value: number; onPress?: () => void }) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <TouchableOpacity onPress={onPress} style={[{ flex: 1 }, space.marginSideXs]}>
      <View style={[{ backgroundColor: colors.L15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }, space.paddingS]}>
        <Text style={typography.cardName}>×{value}</Text>
        <View style={[
          { borderRadius: 16, width: 32, height: 32, backgroundColor: colors.tokenFill[type], flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
          space.marginLeftS,
          type === 'curse' ? space.paddingBottomXs : undefined,
        ]}>
          <ArkhamIcon name={type} size={26} color={type === 'bless' ? COLORS.D20 : COLORS.L20} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function BlessCurseCounter({ type, value, min, inc, dec }: { type: 'bless' | 'curse'; min: number; value: number; inc: () => void; dec: () => void; }) {
  const { colors, typography } = useContext(StyleContext);
  const element = useMemo(() => {
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center' }, space.paddingVerticalXs, space.marginSideM]}>
        <Text style={[typography.counter, { color: colors.D20, minWidth: 32 }, typography.center, space.paddingRightXs]}>
          { value === 0 ? '0' : `${value}×`}
        </Text>
        <ChaosToken size="tiny" iconKey={type} />
      </View>
    );
  }, [value, colors, type, typography]);
  return (
    <View style={[space.paddingVerticalXs, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
      <PlusMinusButtons
        dialogStyle
        large
        countRender={element}
        count={value}
        max={10}
        min={min}
        onIncrement={inc}
        onDecrement={dec}
      />
    </View>
  );
}

function ReturnBlessCurseButton({ onPress }: { onPress: () => void }) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const doNotRemove = <Text key="do_not_remove" style={{ color: colors.warn }}>{t`do not remove`}</Text>;
  const [height, setHeight] = useState(fontScale * 18 * 2 + s * 2);
  const updateSize = useCallback((event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  }, [setHeight]);
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={onPress}>
        <View
          onLayout={updateSize}
          style={[
            space.paddingS,
            { paddingLeft: height / 2, paddingRight: height / 2 - s * 2 },
            styles.removeBlessCurseButton,
            { borderRadius: height / 2, borderColor: colors.M },
          ]}>
          <Text style={[typography.cardTraits]} numberOfLines={2} ellipsizeMode="tail">{jt`Return, but ${doNotRemove} Bless/Curse`}</Text>
          <View style={{ width: 48, flexDirection: 'row' }}>
            <ArkhamIcon size={24} color={colors.token.bless} name="bless" />
            <ArkhamIcon size={24} color={colors.token.curse} name="curse" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function DrawnChaosTokenButton({ onPress, token, small, index }: { token: ChaosTokenType; onPress: (index: number) => void; small?: boolean; index: number }) {
  const handlePress = useCallback(() => {
    onPress(index);
  }, [onPress, index]);
  return (
    <Pressable onPress={handlePress}>
      <ChaosToken iconKey={token} size={small ? 'small' : undefined} />
    </Pressable>
  );
}


const CARD_TOKEN = new Set(['skull', 'cultist', 'tablet', 'elder_thing']);

export default function DrawChaosBagComponent(props: Props) {
  const [{ isConnected }, refreshNetworkStatus] = useNetworkStatus();
  const { campaignId, chaosBag, viewChaosBagOdds, editViewPressed, difficulty, editable, scenarioCardText } = props;
  const { backgroundStyle, fontScale, colors, typography, width } = useContext(StyleContext);
  const dispatch = useDispatch();
  const chaosBagResults = useChaosBagResults(campaignId);
  const [isChaosBagEmpty, setIsChaosBagEmpty] = useState(false);
  const actions = useChaosBagActions();
  const [sealButton, sealDialog] = useSealTokenButton({ campaignId, chaosBag, chaosBagResults, actions });
  const clearTokens = useCallback((removeBlessCurse?: boolean) => {
    const blessToRemove = removeBlessCurse ? sumBy(chaosBagResults.drawnTokens, token => token === 'bless' ? 1 : 0) : 0;
    const curseToRemove = removeBlessCurse ? sumBy(chaosBagResults.drawnTokens, token => token === 'curse' ? 1 : 0) : 0;
    dispatch(updateChaosBagClearTokens(
      actions,
      campaignId,
      Math.max(chaosBagResults.blessTokens - blessToRemove, 0),
      Math.max(chaosBagResults.curseTokens - curseToRemove, 0),
      chaosBagResults
    ));
  }, [campaignId, chaosBagResults, actions, dispatch]);

  const handleClearTokensKeepBlessAndCursedPressed = useCallback(() => {
    clearTokens();
  }, [clearTokens]);

  const handleClearTokensPressed = useCallback(() => {
    clearTokens(true);
  }, [clearTokens]);

  const getRandomChaosTokens = useCallback((chaosBag: ChaosBag, drawTokens: number): ChaosTokenType[] => {
    const weightedList = flattenChaosBag(chaosBag, chaosBagResults.tarot);
    setIsChaosBagEmpty(weightedList.length <= 1);
    return shuffle(weightedList).slice(0, drawTokens);
  }, [setIsChaosBagEmpty, chaosBagResults.tarot]);

  const [tarotButton, tarotDialog] = useTarotCardDialog({ actions, chaosBagResults, campaignId });
  const drawToken = useCallback((count: number = 1) => {
    const currentChaosBag = cloneDeep(chaosBag);
    currentChaosBag.bless = chaosBagResults.blessTokens || 0;
    currentChaosBag.curse = chaosBagResults.curseTokens || 0;

    const drawnTokens = [...chaosBagResults.drawnTokens];
    const sealedTokens = map(chaosBagResults.sealedTokens, token => token.icon);
    const drawnAndSealedTokens = drawnTokens.concat(sealedTokens);

    drawnAndSealedTokens.forEach(function(token) {
      const currentCount = currentChaosBag[token];
      if (currentCount) {
        currentChaosBag[token] = currentCount - 1;
      }
    });

    const newIconKeys = getRandomChaosTokens(currentChaosBag, count);
    if (newIconKeys.length) {
      forEach(newIconKeys, newIconKey => {
        drawnTokens.push(newIconKey);
      });
      dispatch(updateChaosBagDrawToken(actions, campaignId, drawnTokens, chaosBagResults));
    } else {
      clearTokens();
    }
  }, [campaignId, chaosBag, chaosBagResults, actions, dispatch, clearTokens, getRandomChaosTokens]);

  const handleDrawTokenPressed = useCallback(() => {
    if (chaosBagResults.drawnTokens.length >= 1) {
      clearTokens(true);
    } else {
      drawToken();
    }
  }, [chaosBagResults, clearTokens, drawToken]);

  const handleAddAndDrawAgainPressed = useCallback(() => {
    drawToken();
  }, [drawToken]);

  useEffect(() => {
    KeyEvent.onKeyUpListener((keyEvent: { keyCode: string; pressedKey: string; action: string }) => {
      switch(keyEvent.pressedKey) {
        case '1': drawToken(1); break;
        case '2': drawToken(2); break;
        case '3': drawToken(3); break;
        case '4': drawToken(4); break;
        case '5': drawToken(5); break;
        case '6': drawToken(6); break;
        case '7': drawToken(7); break;
        case '8': drawToken(8); break;
        case '9': drawToken(9); break;
        case ' ':
          handleDrawTokenPressed();
          break;
        case '\r':
        case '\n':
        case '0':
          clearTokens(true);
          break;
      }
    });
    return () => {
      KeyEvent.removeKeyUpListener();
    };
  }, [drawToken, handleDrawTokenPressed, clearTokens]);

  const handleResetBlessCursePressed = useCallback(() => {
    dispatch(updateChaosBagResetBlessCurse(actions, campaignId, chaosBagResults));
  }, [campaignId, dispatch, actions, chaosBagResults]);

  const [bless, incBless, decBless, setBless] = useCounter(chaosBagResults.blessTokens || 0, { max: 10 });
  const [curse, incCurse, decCurse, setCurse] = useCounter(chaosBagResults.curseTokens || 0, { max: 10 })

  const returnToken = useCallback((index: number) => {
    const drawnTokens = [...chaosBagResults.drawnTokens];
    dispatch(updateChaosBagDrawToken(actions, campaignId, filter(drawnTokens, (token, idx) => idx !== index), chaosBagResults));
  }, [dispatch, actions, campaignId, chaosBagResults])

  const drawnTokensContent = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    if (drawnTokens.length > 1) {
      return reverse(map(drawnTokens.slice(0, drawnTokens.length - 1), (token, index) => {
        return (
          <View style={space.paddingSideXs} key={`${token}-${index}`}>
            <DrawnChaosTokenButton onPress={returnToken} index={index} token={token} small />
          </View>
        );
      }));
    }
    return null;
  }, [chaosBagResults.drawnTokens, returnToken]);

  const chaosToken = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    const iconKey = drawnTokens[drawnTokens.length - 1] || undefined;
    if (drawnTokens.length <= 1) {
      return (
        <Pressable onPress={handleDrawTokenPressed}>
          <ChaosToken iconKey={iconKey || 'tap'} shadow />
        </Pressable>
      );
    }
    return (
      <DrawnChaosTokenButton
        onPress={returnToken}
        token={drawnTokens[drawnTokens.length - 1]}
        index={drawnTokens.length - 1}
      />
    )
  }, [chaosBagResults.drawnTokens, returnToken, handleDrawTokenPressed]);
  const drawAnotherButton = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    if (drawnTokens.length === 0) {
      return null;
    }
    if (isChaosBagEmpty) {
      return (
        <View style={{ flex: 1 }}>
          <View style={[space.paddingSideS, styles.advancedButtonStacked]}>
            <Text style={[typography.cardTraits, typography.right, typography.center, { minHeight: fontScale * 18 * 2 }, space.marginTopXs]}>
              { t`Chaos bag is empty` }
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={handleAddAndDrawAgainPressed}>
          <View style={[space.paddingSideS, styles.advancedButtonStacked]}>
            <ChaosToken iconKey="another" size="tiny" shadow />
            <Text style={[typography.cardTraits, typography.right, typography.center, { minHeight: fontScale * 18 * 2 }, space.marginTopXs]} numberOfLines={2}>
              { t`Draw another` }
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [chaosBagResults.drawnTokens, fontScale, handleAddAndDrawAgainPressed, typography, isChaosBagEmpty]);
  const viewButton = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    return (
      <View style={[styles.advancedButton, styles.advancedButtonLeft, { paddingTop: fontScale * 18 * 2 + xs }]}>
        <TouchableWithoutFeedback onPress={editViewPressed}>
          <View style={[space.paddingSideS, styles.advancedButton, styles.advancedButtonLeft]}>
            { drawnTokens.length === 0 && (
              <Text style={[typography.cardTraits, typography.right, space.paddingRightS, { flex: 1 }]} numberOfLines={2}>
                { editable ? t`Edit chaos bag` : t`View chaos bag` }
              </Text>
            ) }
            <ChaosToken iconKey="bag" size="tiny" shadow />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [chaosBagResults.drawnTokens, fontScale, editable, editViewPressed, typography]);
  const returnButton = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    if (drawnTokens.length === 0) {
      return null;
    }
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={handleClearTokensPressed}>
          <View style={[space.paddingSideS, styles.advancedButtonStacked]}>
            <ChaosToken iconKey="return" size="tiny" />
            <Text style={[typography.cardTraits, space.marginTopXs, typography.center, { minHeight: fontScale * 18 * 2 }]} numberOfLines={2}>
              { t`Return tokens` }
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [chaosBagResults.drawnTokens, typography, handleClearTokensPressed, fontScale])
  const oddsButton = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    return (
      <View style={[styles.advancedButton, styles.advancedButtonRight, { paddingTop: fontScale * 18 * 2 + xs }]}>
        <TouchableWithoutFeedback onPress={viewChaosBagOdds}>
          <View style={[space.paddingSideS, styles.advancedButton, styles.advancedButtonRight]}>
            <ChaosToken iconKey="odds" size="tiny" />
            { drawnTokens.length === 0 && (
              <Text style={[typography.cardTraits, space.paddingLeftS, { flex: 1 }]} numberOfLines={2}>
                { t`Odds calculator` }
              </Text>
            ) }
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [chaosBagResults.drawnTokens, fontScale, typography, viewChaosBagOdds]);

  const returnBlessCurse = useMemo(() => {
    const drawnTokens = chaosBagResults.drawnTokens;
    const hasBlessCurse = find(drawnTokens, token => token === 'bless' || token === 'curse');
    if (!hasBlessCurse) {
      return null;
    }
    return (
      <ReturnBlessCurseButton key="return" onPress={handleClearTokensKeepBlessAndCursedPressed} />
    );
  }, [chaosBagResults.drawnTokens, handleClearTokensKeepBlessAndCursedPressed]);
  const maybeSyncBlurse = useCallback(() => {
    if (bless !== (chaosBagResults.blessTokens || 0) || curse !== (chaosBagResults.curseTokens || 0)) {
      dispatch(setBlessCurseChaosBagResults(actions, campaignId, bless, curse));
    }
  }, [dispatch, actions, campaignId, bless, curse, chaosBagResults.blessTokens, chaosBagResults.curseTokens]);
  const { dialog: blurseDialog, showDialog: showBlurseDialog } = useDialog({
    title: t`Bless / Curse`,
    content: (
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <BlessCurseCounter
          value={bless}
          inc={incBless}
          dec={decBless}
          min={sumBy(chaosBagResults.sealedTokens, token => token.icon === 'bless' ? 1 : 0)}
          type="bless"
        />
        <BlessCurseCounter
          value={curse}
          inc={incCurse}
          dec={decCurse}
          min={sumBy(chaosBagResults.sealedTokens, token => token.icon === 'curse' ? 1 : 0)}
          type="curse"
        />
      </View>
    ),
    dismiss: {
      onPress: maybeSyncBlurse,
    },
  });
  const showBlurseDialogWrapper = useCallback(() => {
    setBless(chaosBagResults.blessTokens || 0);
    setCurse(chaosBagResults.curseTokens || 0);
    showBlurseDialog();
  }, [setBless, setCurse, chaosBagResults.blessTokens, chaosBagResults.curseTokens, showBlurseDialog]);
  const blurseSection = useMemo(() => {
    return (
      <View style={[styles.blessCurseBlock, space.paddingTopM, space.paddingBottomM, space.paddingSideXs, { borderColor: colors.L20 }]}>
        <BlessCurseButton
          onPress={showBlurseDialogWrapper}
          value={chaosBagResults.blessTokens || 0}
          type="bless"
        />
        <BlessCurseButton
          onPress={showBlurseDialogWrapper}
          value={chaosBagResults.curseTokens || 0}
          type="curse"
        />
      </View>
    );
  }, [showBlurseDialogWrapper, chaosBagResults.blessTokens, chaosBagResults.curseTokens, colors]);
  const hasBlessCurse = !((chaosBagResults.blessTokens || 0) === 0 && (chaosBagResults.curseTokens || 0) === 0);
  const advancedSection = useMemo(() => {
    return (
      <View style={[space.paddingS]}>
        { sealButton }
        { tarotButton }
        <View style={[space.paddingBottomM]}>
          { hasBlessCurse ? (
            <DeckButton icon="dismiss" title={t`Remove all bless & curse tokens`} onPress={handleResetBlessCursePressed} color="dark_gray" noShadow />
          ) : (
            <View style={{ height: 20 * fontScale + s * 2 + xs * 2 - 2 }} />
          ) }
        </View>
      </View>
    );
  }, [sealButton, handleResetBlessCursePressed, tarotButton, fontScale, hasBlessCurse]);
  const specialTokenSection = useMemo(() => {
    if (!scenarioCardText) {
      return null;
    }
    const difficultyStr = difficulty && difficultyString(difficulty);
    return (
      <View style={space.paddingSideS}>
        <RoundedFactionBlock
          faction="neutral"
          header={
            <View style={[styles.headerBlock, { backgroundColor: colors.L10 }]}>
              <View style={space.paddingRightM}>
                <AppIcon name="card-outline" size={32} color={colors.D10} />
              </View>
              <Text style={typography.cardName}>
                { difficultyStr ? t`Scenario Card - ${difficultyStr}` : t`Scenario Card` }
              </Text>
            </View>
          }>
          <View style={space.paddingTopS}>
            <CardTextComponent key="special_effects" text={scenarioCardText} sizeScale={1.2} />
          </View>
        </RoundedFactionBlock>
      </View>
    );
  }, [scenarioCardText, colors, typography, difficulty]);

  const drawnSpecialTokens = useMemo(() => {
    return uniq(filter(chaosBagResults.drawnTokens, token => CARD_TOKEN.has(token))).length > 0;
  }, [chaosBagResults.drawnTokens]);
  const lowerContent = useMemo(() => {
    const hasSpecial = !!(drawnSpecialTokens && specialTokenSection);
    return (
      <View>
        { (!hasSpecial || isTablet) && blurseSection }
        { hasSpecial && specialTokenSection }
        { (!hasSpecial || isTablet) && advancedSection }
      </View>
    );
  }, [drawnSpecialTokens, specialTokenSection, blurseSection, advancedSection]);
  return (
    <SafeAreaView style={styles.container}>
      <KeepAwake />
      <ScrollView bounces={false} style={[styles.containerBottom, { flexGrow: 1 }]} contentContainerStyle={[backgroundStyle, { flexGrow: 1 }]}>
        { !isConnected && !!campaignId.serverId && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <View style={[space.paddingS, styles.warning, { width }]} key="banner">
              <AppIcon size={32} color={colors.D30} name="warning" />
              <Text style={[space.paddingLeftS, typography.small, typography.black, { flex: 1 }]} numberOfLines={2}>
                { t`You appear to be offline. Tap to check for network.` }
              </Text>
            </View>
          </TouchableOpacity>
        ) }
        <View style={styles.expandingContainer}>
          <View style={[styles.containerTop, space.paddingBottomS, { borderColor: colors.L20 }]}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.drawnTokenRow}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              overScrollMode="never"
            >
              { drawnTokensContent }
            </ScrollView>
            <View style={[styles.chaosTokenView, space.paddingSideS]}>
              { chaosToken }
            </View>
            <View style={[space.paddingSideS, styles.drawButtonRow, space.marginTopS, space.marginBottomS]}>
              { returnButton }
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 2 }}>
                { returnBlessCurse || (
                  <>
                    { viewButton }
                    { oddsButton }
                  </>
                ) }
              </View>
              { drawAnotherButton }
            </View>
          </View>
          { lowerContent }
        </View>
      </ScrollView>
      { sealDialog }
      { blurseDialog }
      { tarotDialog }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  expandingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  drawButtonRow: {
    minHeight: SMALL_TOKEN_SIZE,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerBottom: {
    flexDirection: 'column',
  },
  drawnTokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SMALL_TOKEN_SIZE + s * 2,
  },
  advancedButtonStacked: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  removeBlessCurseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  warning: {
    backgroundColor: COLORS.yellow,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
