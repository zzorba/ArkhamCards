import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { sum, values } from 'lodash';
import { t } from 'ttag';

import { ChaosBag } from '@app_constants';
import ChaosBagLine from '@components/core/ChaosBagLine';
import DeckButton from '@components/deck/controls/DeckButton';
import space, { m, s } from '@styles/space';
import { Navigation } from 'react-native-navigation';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import Card from '@data/Card';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { updateCampaign } from '../actions';
import { CampaignId } from '@actions/types';
import { showChaosBagOddsCalculator, showDrawChaosBag, showGuideChaosBagOddsCalculator, showGuideDrawChaosBag } from '../nav';
import { useDialog } from '@components/deck/dialogs';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  allInvestigators: Card[];
  campaignId: CampaignId;
  chaosBag: ChaosBag;
  guided?: boolean;
}

export default function useChaosBagDialog({
  componentId,
  allInvestigators,
  campaignId,
  chaosBag,
  guided,
}: Props): [React.ReactNode, () => void] {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { width } = useContext(StyleContext);
  const dispatch = useDispatch();
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaign(user, campaignId, { chaosBag }));
  }, [dispatch, campaignId, user]);
  const oddsCalculatorPressed = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    if (guided) {
      showGuideChaosBagOddsCalculator(componentId, campaignId, chaosBag, allInvestigators);
    } else {
      showChaosBagOddsCalculator(componentId, campaignId, allInvestigators);
    }
  }, [componentId, campaignId, allInvestigators, chaosBag, guided]);
  const drawChaosBagPressed = useCallback(() => {
    setVisibleRef.current && setVisibleRef.current(false);
    if (guided) {
      showGuideDrawChaosBag(componentId, campaignId, chaosBag);
    } else {
      showDrawChaosBag(componentId, campaignId, updateChaosBag);
    }
  }, [campaignId, componentId, guided, chaosBag, updateChaosBag]);

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
  }, [chaosBag, guided, editChaosBagDialog, drawChaosBagPressed, oddsCalculatorPressed]);

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
