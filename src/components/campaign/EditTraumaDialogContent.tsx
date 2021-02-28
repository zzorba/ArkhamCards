import React, { useCallback } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import NewDialog from '@components/core/NewDialog';
import { Trauma } from '@actions/types';
import Card from '@data/types/Card';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { s } from '@styles/space';

interface Props {
  investigator?: Card;
  trauma: Trauma;
  mutateTrauma: (updateTrauma: (trauma: Trauma) => Trauma) => void;
  hideKilledInsane?: boolean;
}

export default function EditTraumaDialogContent({
  investigator,
  trauma: {
    killed,
    insane,
    physical,
    mental,
  },
  mutateTrauma,
  hideKilledInsane,
}: Props) {
  const incPhysical = useCallback(() => {
    const health = investigator ? (investigator.health || 0) : 0;
    mutateTrauma(t => {
      return { ...t, physical: Math.min((t.physical || 0) + 1, health) };
    });
  }, [investigator, mutateTrauma]);

  const decPhysical = useCallback(() => {
    mutateTrauma(t => {
      return { ...t, physical: Math.max((t.physical || 0) - 1, 0) };
    });
  }, [mutateTrauma]);

  const incMental = useCallback(() => {
    const sanity = investigator ? (investigator.sanity || 0) : 0;
    mutateTrauma(t => {
      return { ...t, mental: Math.min((t.mental || 0) + 1, sanity) };
    });
  }, [investigator, mutateTrauma]);

  const decMental = useCallback(() => {
    mutateTrauma(t => {
      return { ...t, mental: Math.max((t.mental || 0) - 1, 0) };
    });
  }, [mutateTrauma]);

  const toggleKilled = useCallback(() => {
    mutateTrauma(t => {
      return { ...t, killed: !t.killed };
    });
  }, [mutateTrauma]);

  const toggleInsane = useCallback(() => {
    mutateTrauma(t => {
      return { ...t, insane: !t.insane };
    });
  }, [mutateTrauma]);

  const health = investigator ? (investigator.health || 0) : 0;
  const sanity = investigator ? (investigator.sanity || 0) : 0;

  const impliedKilled = (physical === health);
  const impliedInsane = (mental === sanity);
  return (
    <View>
      <NewDialog.ContentLine
        text={t`Physical Trauma`}
        paddingBottom={s}
        control={(
          <PlusMinusButtons
            onIncrement={incPhysical}
            onDecrement={decPhysical}
            count={physical || 0}
            showZeroCount
            max={health}
            dialogStyle
          />
        )}
      />
      <NewDialog.ContentLine
        text={t`Mental Trauma`}
        paddingBottom={s}
        control={(
          <PlusMinusButtons
            onIncrement={incMental}
            onDecrement={decMental}
            count={mental || 0}
            showZeroCount
            max={sanity}
            dialogStyle
          />
        )}
      />
      { !hideKilledInsane && (
        <NewDialog.ContentLine
          text={t`Killed`}
          paddingBottom={s}
          control={(
            <ArkhamSwitch
              value={killed || impliedKilled}
              disabled={impliedKilled}
              onValueChange={toggleKilled}
            />
          )}
        />
      ) }
      { !hideKilledInsane && (
        <NewDialog.ContentLine
          text={t`Insane`}
          paddingBottom={s}
          control={(
            <ArkhamSwitch
              value={insane || impliedInsane}
              disabled={impliedInsane}
              onValueChange={toggleInsane}
            />
          )}
        />
      ) }
    </View>
  );
}
