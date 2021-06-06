import React, { useCallback, useEffect, useState, useMemo } from 'react';

import EditTraumaDialogContent from './EditTraumaDialogContent';
import NewDialog from '@components/core/NewDialog';
import { t } from 'ttag';
import { Trauma } from '@actions/types';
import Card from '@data/types/Card';
import DeckButton from '@components/deck/controls/DeckButton';

interface Props {
  visible: boolean;
  investigator?: Card;
  trauma?: Trauma;
  updateTrauma: (investigator_code: string, trauma: Trauma) => void;
  hideDialog: () => void;
  hideKilledInsane?: boolean;
}

export default function EditTraumaDialog({ visible, investigator, trauma, updateTrauma, hideDialog, hideKilledInsane }: Props) {
  const [traumaState, setTraumaState] = useState<Trauma>({});
  useEffect(() => {
    if (visible) {
      setTraumaState(trauma || {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onSubmit = useCallback(() => {
    if (investigator) {
      updateTrauma(investigator.code, traumaState);
    }
    hideDialog();
  }, [investigator, updateTrauma, hideDialog, traumaState]);

  const onCancel = useCallback(() => {
    hideDialog();
  }, [hideDialog]);

  const mutateTrauma = useCallback((mutate: (trauma: Trauma) => Trauma) => {
    setTraumaState(mutate(traumaState));
  }, [setTraumaState, traumaState]);

  const buttons = useMemo(() => {
    return [(
      <DeckButton
        key="cancel"
        icon="dismiss"
        color="red"
        title={t`Cancel`}
        thin
        onPress={onCancel}
      />
    ), (
      <DeckButton
        key="save"
        icon="check-thin"
        title={t`Save`}
        thin
        onPress={onSubmit}
      />
    )];
  }, [onCancel, onSubmit]);
  return (
    <NewDialog
      title={investigator ?
        t`${investigator.firstName}’s Trauma` :
        t`Trauma`}
      visible={visible}
      dismissable
      onDismiss={onCancel}
      buttons={buttons}
    >
      <EditTraumaDialogContent
        investigator={investigator}
        trauma={traumaState}
        mutateTrauma={mutateTrauma}
        hideKilledInsane={hideKilledInsane}
      />
    </NewDialog>
  );
}
