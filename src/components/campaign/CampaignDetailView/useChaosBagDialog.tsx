import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import { forEach, map, sum, values } from 'lodash';
import { t } from 'ttag';

import { ChaosBag } from '@app_constants';
import ChaosBagLine from '@components/core/ChaosBagLine';
import DeckButton from '@components/deck/controls/DeckButton';
import space, { m } from '@styles/space';
import { Navigation } from 'react-native-navigation';
import { EditChaosBagProps } from '../../chaos/EditChaosBagDialog';
import Card from '@data/types/Card';
import { CampaignCycleCode, CampaignId } from '@actions/types';
import { showChaosBagOddsCalculator, showDrawChaosBag, showGuideChaosBagOddsCalculator, showGuideDrawChaosBag } from '../nav';
import { useDialog } from '@components/deck/dialogs';
import StyleContext from '@styles/StyleContext';
import { updateCampaignChaosBag } from '../actions';
import { SetCampaignChaosBagAction } from '@data/remote/campaigns';
import { ProcessedCampaign } from '@data/scenario';
import { useAppDispatch } from '@app/store';
import { MAX_WIDTH } from '@styles/sizes';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';

interface Props {
  componentId: string;
  allInvestigators: Card[] | undefined;
  campaignId: CampaignId;
  scenarioId: string | undefined;
  chaosBag: ChaosBag;
  guided?: boolean;
  setChaosBag?: SetCampaignChaosBagAction;
  standalone?: boolean;
  cycleCode: CampaignCycleCode;
  processedCampaign?: ProcessedCampaign;

  customEditPressed?: () => void;
}

export function useSimpleChaosBagDialog(chaosBag?: ChaosBag, chaosBagResults?: ChaosBagResultsT): [React.ReactNode, () => void] {
  const { width, typography, colors } = useContext(StyleContext);
  const content = useMemo(() => {
    const sealedChaosBag: ChaosBag = {};
    forEach(chaosBagResults?.sealedTokens, (token) => {
      sealedChaosBag[token.icon] = (sealedChaosBag[token.icon] ?? 0) + 1;
    });
    if (!chaosBag) {
      return null;
    }
    return (
      <View style={space.marginS}>
        <ChaosBagLine
          chaosBag={chaosBag}
          chaosBagResults={chaosBagResults}
          width={width - m * 2}
        />
        { !!chaosBagResults?.sealedTokens?.length && (
          <View style={space.paddingTopM}>
            <Text style={[typography.smallLabel, typography.center]}>{t`Sealed (${chaosBagResults.sealedTokens.length})`}</Text>
            <View style={[{ height: 1, backgroundColor: colors.L15, width: width - m * 2 }, space.marginBottomS]} />
            <ChaosBagLine chaosBag={sealedChaosBag} width={width - m * 2} sealed />
          </View>
        )}
      </View>
    );
  }, [colors, typography, chaosBag, chaosBagResults, width]);
  const tokenCount = useMemo(() =>
    sum(values(chaosBag)) +
      (chaosBagResults?.blessTokens ?? 0) +
      (chaosBagResults?.curseTokens ?? 0) -
      (chaosBagResults?.sealedTokens?.length ?? 0),
  [chaosBag, chaosBagResults]);
  const { dialog, showDialog } = useDialog({
    title: t`Chaos Bag (${tokenCount})`,
    content,
    allowDismiss: true,
    alignment: 'bottom',
  });
  return [dialog, showDialog];
}

export default function useChaosBagDialog({
  componentId,
  allInvestigators,
  campaignId,
  chaosBag,
  guided,
  scenarioId,
  setChaosBag,
  customEditPressed,
  standalone,
  cycleCode,
  processedCampaign,
}: Props): [React.ReactNode, () => void, (visible: boolean) => void] {
  const { width } = useContext(StyleContext);
  const setVisibleRef = useRef<(visible: boolean) => void>(null);
  const oddsCalculatorPressed = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    if (guided) {
      showGuideChaosBagOddsCalculator(componentId, campaignId, chaosBag, map(allInvestigators, c => c.code), scenarioId, !!standalone, processedCampaign);
    } else {
      showChaosBagOddsCalculator(componentId, campaignId, allInvestigators);
    }
  }, [componentId, campaignId, allInvestigators, chaosBag, guided, scenarioId, standalone, processedCampaign]);
  const drawChaosBagPressed = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    if (guided) {
      showGuideDrawChaosBag(componentId, campaignId, map(allInvestigators, c => c.code), scenarioId, !!standalone);
    } else {
      showDrawChaosBag(componentId, campaignId, allInvestigators, cycleCode);
    }
  }, [campaignId, componentId, guided, allInvestigators, scenarioId, standalone, cycleCode]);
  const dispatch = useAppDispatch();
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    if (setChaosBag) {
      dispatch(updateCampaignChaosBag(setChaosBag, campaignId, chaosBag));
    }
  }, [dispatch, setChaosBag, campaignId]);

  const editChaosBagDialog = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag,
          trackDeltas: true,
          cycleCode,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    });
  }, [componentId, chaosBag, updateChaosBag, cycleCode]);
  const customButtons = useMemo(() => {
    const result: React.ReactNode[] = [];
    if (customEditPressed || (!guided && setChaosBag)) {
      result.push(
        <DeckButton
          key="edit"
          thin
          icon="edit"
          title={t`Edit chaos bag`}
          onPress={customEditPressed || editChaosBagDialog}
        />
      );
    }
    result.push(
      <DeckButton
        key="draw"
        thin
        icon="chaos_bag"
        title={t`Draw chaos tokens`}
        onPress={drawChaosBagPressed}
      />
    );
    result.push(
      <DeckButton
        key="odds"
        thin
        icon="difficulty"
        title={t`Odds calculator`}
        onPress={oddsCalculatorPressed}
      />
    );
    return result;
  }, [oddsCalculatorPressed, drawChaosBagPressed, editChaosBagDialog, setChaosBag, customEditPressed, guided]);
  const content = useMemo(() => {
    return (
      <>
        <View style={space.marginS}>
          <ChaosBagLine
            chaosBag={chaosBag}
            width={Math.min(width, MAX_WIDTH) - m * 2}
          />
        </View>

      </>
    );
  }, [chaosBag, width]);

  const tokenCount = useMemo(() => sum(values(chaosBag)), [chaosBag]);
  const { dialog, showDialog, setVisible } = useDialog({
    title: t`Chaos Bag (${tokenCount})`,
    content,
    allowDismiss: true,
    alignment: 'bottom',
    customButtons,
  });
  setVisibleRef.current = setVisible;
  return [dialog, showDialog, setVisible];
}
