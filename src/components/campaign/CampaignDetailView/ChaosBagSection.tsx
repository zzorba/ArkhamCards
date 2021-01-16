import React, { useCallback } from 'react';
import { View } from 'react-native';
import { sum, values } from 'lodash';
import { t } from 'ttag';

import { ChaosBag } from '@app_constants';
import NavButton from '@components/core/NavButton';
import ChaosBagLine from '@components/core/ChaosBagLine';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import DeckButton from '@components/deck/controls/DeckButton';
import space, { s, m } from '@styles/space';
import { Navigation } from 'react-native-navigation';
import { EditChaosBagProps } from '../EditChaosBagDialog';

interface Props {
  componentId: string;
  chaosBag: ChaosBag;
  showChaosBag: () => void;
  showOddsCalculator: () => void;
  updateChaosBag: (chaosBag: ChaosBag) => void;
}

export default function ChaosBagSection({
  showChaosBag,
  chaosBag,
  showOddsCalculator,
  updateChaosBag,
  componentId,
}: Props) {
  const tokenCount = sum(values(chaosBag));

  const editChaosBagDialog = useCallback(() => {
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
  return (
    <View style={[space.paddingSideS, space.paddingBottomS]}>
      <RoundedFactionBlock
        faction="neutral"
        header={<DeckSectionHeader faction="neutral" title={t`Chaos Bag (${tokenCount})`} />}
      >
        <NavButton
          onPress={editChaosBagDialog}
          noBorder
        >
          <View style={space.marginTopS}>
            <ChaosBagLine
              chaosBag={chaosBag}
            />
          </View>
        </NavButton>
        <DeckButton
          thin
          icon="chaos_bag"
          title={t`Draw chaos tokens`}
          onPress={showChaosBag}
          topMargin={s}
          bottomMargin={m}
        />
        <DeckButton
          thin
          icon="difficulty"
          title={t`Odds calculator`}
          onPress={showOddsCalculator}
        />
      </RoundedFactionBlock>
    </View>
  );
}
