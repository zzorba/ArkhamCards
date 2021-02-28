import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { map, sum, values } from 'lodash';
import { t } from 'ttag';

import { ChaosBag } from '@app_constants';
import ChaosBagLine from '@components/core/ChaosBagLine';
import DeckButton from '@components/deck/controls/DeckButton';
import space, { m, s } from '@styles/space';
import { Navigation } from 'react-native-navigation';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import Card from '@data/types/Card';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { CampaignId } from '@actions/types';
import { showChaosBagOddsCalculator, showDrawChaosBag, showGuideChaosBagOddsCalculator, showGuideDrawChaosBag } from '../nav';
import { useDialog } from '@components/deck/dialogs';
import StyleContext from '@styles/StyleContext';
import { updateCampaign } from '../actions';

interface Props {
  componentId: string;
  allInvestigators: Card[];
  campaignId: CampaignId;
  chaosBag: ChaosBag;
  guided?: boolean;
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
      showGuideDrawChaosBag(componentId, campaignId, chaosBag, map(allInvestigators, c => c.code));
    } else {
      showDrawChaosBag(componentId, campaignId, allInvestigators);
    }
  }, [campaignId, componentId, guided, chaosBag, allInvestigators]);
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaign(user, campaignId, { chaosBag }));
  }, [dispatch, campaignId, user]);

  const editChaosBagDialog = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag: updateChaosBag,
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
  const content = useMemo(() => {
    return (
      <>
        <View style={space.marginS}>
          <ChaosBagLine
            chaosBag={chaosBag}
            width={width - m * 2}
          />
        </View>
        { !guided && (
          <DeckButton
            thin
            icon="edit"
            title={t`Edit chaos bag`}
            onPress={editChaosBagDialog}
            topMargin={s}
            bottomMargin={s}
          />
        ) }
        <DeckButton
          thin
          icon="chaos_bag"
          title={t`Draw chaos tokens`}
          onPress={drawChaosBagPressed}
          bottomMargin={s}
        />
        <DeckButton
          thin
          icon="difficulty"
          title={t`Odds calculator`}
          onPress={oddsCalculatorPressed}
        />
      </>
    );
  }, [chaosBag, guided, width, editChaosBagDialog, drawChaosBagPressed, oddsCalculatorPressed]);

  const tokenCount = useMemo(() => sum(values(chaosBag)), [chaosBag]);
  const { dialog, showDialog, setVisible } = useDialog({
    title: t`Chaos Bag (${tokenCount})`,
    content,
    allowDismiss: true,
    alignment: 'bottom',
  });
  useEffect(() => {
    setVisibleRef.current = setVisible;
  }, [setVisible]);
  return [dialog, showDialog];
}
