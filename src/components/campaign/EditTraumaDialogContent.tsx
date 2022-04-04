import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import NewDialog from '@components/core/NewDialog';
import { Trauma, TraumaAndCardData } from '@actions/types';
import Card from '@data/types/Card';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { s } from '@styles/space';

interface Props {
  investigator?: Card;
  trauma: TraumaAndCardData;
  mutateTrauma: (updateTrauma: (trauma: Trauma) => Trauma) => void;
  hideKilledInsane?: boolean;
}

export default function EditTraumaDialogContent({
  investigator,
  trauma,
  mutateTrauma,
  hideKilledInsane,
}: Props) {
  const {
    killed,
    insane,
    physical,
    mental,
  } = trauma;

  const health = useMemo(() => investigator ? (investigator.getHealth(trauma) || 0) : 0, [investigator, trauma]);
  const sanity = useMemo(() => investigator ? (investigator.getSanity(trauma) || 0) : 0, [investigator, trauma]);

  const incPhysical = useCallback(() => {
    mutateTrauma(t => {
      return { ...t, physical: Math.min((t.physical || 0) + 1, health) };
    });
  }, [health, mutateTrauma]);

  const decPhysical = useCallback(() => {
    mutateTrauma(t => {
      return { ...t, physical: Math.max((t.physical || 0) - 1, 0) };
    });
  }, [mutateTrauma]);

  const incMental = useCallback(() => {
    mutateTrauma(t => {
      return { ...t, mental: Math.min((t.mental || 0) + 1, sanity) };
    });
  }, [sanity, mutateTrauma]);

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

  const impliedKilled = (physical === health);
  const impliedInsane = (mental === sanity);
  return (
    <View>
      <NewDialog.ContentLine
        icon='physical'
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
        icon="mental"
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
