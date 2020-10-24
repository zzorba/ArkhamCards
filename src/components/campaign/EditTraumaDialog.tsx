import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import DialogComponent from '@lib/react-native-dialog';

import EditTraumaDialogContent from './EditTraumaDialogContent';
import Dialog from '@components/core/Dialog';
import { t } from 'ttag';
import { Trauma } from '@actions/types';
import Card from '@data/Card';

interface Props {
  visible: boolean;
  investigator?: Card;
  trauma?: Trauma;
  updateTrauma: (investigator_code: string, trauma: Trauma) => void;
  hideDialog: () => void;
  viewRef?: View;
  hideKilledInsane?: boolean;
}

interface State {
  trauma: Trauma;
  visible: boolean;
}

export default function EditTraumaDialog({ visible, investigator, trauma, updateTrauma, hideDialog, viewRef, hideKilledInsane}: Props) {
  const [traumaState, setTraumaState] = useState<Trauma>({});
  useEffect(() => {
    if (visible) {
      setTraumaState(trauma || {})
    }
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


  return (
    <Dialog
      title={investigator ?
        t`${investigator.firstName}’s Trauma` :
        t`Trauma`}
      visible={visible}
      viewRef={viewRef}
    >
      <EditTraumaDialogContent
        investigator={investigator}
        trauma={traumaState}
        mutateTrauma={mutateTrauma}
        hideKilledInsane={hideKilledInsane}
      />
      <DialogComponent.Button label={t`Cancel`} onPress={onCancel} />
      <DialogComponent.Button label={t`Save`} onPress={onSubmit} />
    </Dialog>
  );
}
