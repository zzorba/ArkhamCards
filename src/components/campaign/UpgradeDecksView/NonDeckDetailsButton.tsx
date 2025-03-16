import React, { useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import BasicListRow from '@components/core/BasicListRow';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext from '@styles/StyleContext';
import { useCounter } from '@components/core/hooks';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props {
  investigator: CampaignInvestigator;
  saved: boolean;
  saveXp: (investigator: CampaignInvestigator, xp: number) => void;
}

export default function NonDeckDetailsButton({ investigator, saved, saveXp }: Props) {
  const { typography } = useContext(StyleContext);
  const [xp, incXp, decXp] = useCounter(0, { min: 0 });

  const save = useCallback(() => {
    saveXp(investigator, xp);
  }, [investigator, saveXp, xp]);

  const xpString = xp >= 0 ? `+${xp}` : `${xp}`;
  return (
    <View>
      <CardSectionHeader
        investigator={investigator.card}
        section={{ superTitle: t`Experience points` }}
      />
      <BasicListRow>
        <Text style={typography.text}>
          { xpString }
        </Text>
        { !saved && (
          <PlusMinusButtons
            count={xp}
            onIncrement={incXp}
            onDecrement={decXp}
          />
        ) }
      </BasicListRow>
      { !saved && <BasicButton title={t`Save XP`} onPress={save} /> }
    </View>
  );
}