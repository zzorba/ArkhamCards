import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { map, sum, values } from 'lodash';
import { t } from 'ttag';

import { ChaosBag } from '@app_constants';
import ChaosBagLine from '@components/core/ChaosBagLine';
import DeckButton from '@components/deck/controls/DeckButton';
import space, { m } from '@styles/space';
import { Navigation } from 'react-native-navigation';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import Card from '@data/types/Card';
import { useDispatch } from 'react-redux';
import { CampaignId } from '@actions/types';
import { showChaosBagOddsCalculator, showDrawChaosBag, showGuideChaosBagOddsCalculator, showGuideDrawChaosBag } from '../nav';
import { useDialog } from '@components/deck/dialogs';
import StyleContext from '@styles/StyleContext';
import { updateCampaignChaosBag } from '../actions';
import { SetCampaignChaosBagAction } from '@data/remote/campaigns';

interface Props {
  componentId: string;
  allInvestigators: Card[];
  campaignId: CampaignId;
  scenarioId: string | undefined;
  chaosBag: ChaosBag;
  guided?: boolean;
  setChaosBag?: SetCampaignChaosBagAction;
}

export function useSimpleChaosBagDialog(chaosBag: ChaosBag): [React.ReactNode, () => void] {
  const { width } = useContext(StyleContext);
  const content = useMemo(() => {
    return (
      <View style={space.marginS}>
        <ChaosBagLine
          chaosBag={chaosBag}
          width={width - m * 2}
        />
      </View>
    );
  }, [chaosBag, width]);
  const tokenCount = useMemo(() => sum(values(chaosBag)), [chaosBag]);
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
}: Props): [React.ReactNode, () => void] {
  const { width } = useContext(StyleContext);
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const oddsCalculatorPressed = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    if (guided) {
      showGuideChaosBagOddsCalculator(componentId, campaignId, chaosBag, map(allInvestigators, c => c.code));
    } else {
      showChaosBagOddsCalculator(componentId, campaignId, allInvestigators);
    }
  }, [componentId, campaignId, allInvestigators, chaosBag, guided]);
  const drawChaosBagPressed = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    if (guided) {
      showGuideDrawChaosBag(componentId, campaignId, chaosBag, map(allInvestigators, c => c.code), scenarioId, false);
    } else {
      showDrawChaosBag(componentId, campaignId, allInvestigators);
    }
  }, [campaignId, componentId, guided, chaosBag, allInvestigators, scenarioId]);
  const dispatch = useDispatch();
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
  }, [componentId, chaosBag, updateChaosBag]);
  const customButtons = useMemo(() => {
    const result: React.ReactNode[] = [];
    if (!guided && setChaosBag) {
      result.push(
        <DeckButton
          key="edit"
          thin
          icon="edit"
          title={t`Edit chaos bag`}
          onPress={editChaosBagDialog}
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
  }, [oddsCalculatorPressed, drawChaosBagPressed, editChaosBagDialog, setChaosBag, guided]);
  const content = useMemo(() => {
    return (
      <>
        <View style={space.marginS}>
          <ChaosBagLine
            chaosBag={chaosBag}
            width={width - m * 2}
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
  return [dialog, showDialog];
}
