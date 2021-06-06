import React, { useCallback, useMemo, useState } from 'react';

import EditTraumaDialog from './EditTraumaDialog';
import { Trauma } from '@actions/types';
import Card from '@data/types/Card';

export interface TraumaProps {
  showTraumaDialog: (
    investigator: Card,
    traumaData: Trauma,
  ) => void;

  traumaDialog: React.ReactNode;
}

interface VisibleState {
  investigator: Card,
  traumaData: Trauma
}

export default function useTraumaDialog(updateTrauma: (investigator: string, traumaData: Trauma) => void, hideKilledInsane?: boolean): TraumaProps {
  const [state, setState] = useState<VisibleState | undefined>();

  const showTraumaDialog = useCallback((investigator: Card, traumaData: Trauma) => {
    setState({
      investigator: investigator,
      traumaData,
    });
  }, [setState]);

  const hideDialog = useCallback(() => {
    setState(undefined);
  }, [setState]);

  const traumaDialog = useMemo(() => {
    return (
      <EditTraumaDialog
        visible={!!state}
        investigator={state?.investigator}
        trauma={state?.traumaData}
        updateTrauma={updateTrauma}
        hideDialog={hideDialog}
        hideKilledInsane={hideKilledInsane}
      />
    );
  }, [state, updateTrauma, hideDialog, hideKilledInsane]);
  return {
    traumaDialog,
    showTraumaDialog,
  };
}
