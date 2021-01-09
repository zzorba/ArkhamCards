import React, { useCallback, useEffect, useState } from 'react';
import DialogComponent from '@lib/react-native-dialog';

import EditTraumaDialogContent from './EditTraumaDialogContent';
import Dialog from '@components/core/NewDialog';
import { t } from 'ttag';
import { Trauma } from '@actions/types';
import Card from '@data/Card';

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


  return (
    <Dialog
      title={investigator ?
        t`${investigator.firstName}’s Trauma` :
        t`Trauma`}
      visible={visible}
      dismiss={{
        title: t`Cancel`,
        onPress: onCancel,
      }}
      confirm={{
        title: t`Save`,
        onPress: onSubmit,
      }}
    >
      <EditTraumaDialogContent
        investigator={investigator}
        trauma={traumaState}
        mutateTrauma={mutateTrauma}
        hideKilledInsane={hideKilledInsane}
      />
    </Dialog>
  );
}
