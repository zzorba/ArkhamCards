import React, { useCallback, useMemo, useState } from 'react';

import EditTraumaDialog from './EditTraumaDialog';
import { InvestigatorData, Trauma } from '@actions/types';
import Card from '@data/types/Card';

export interface TraumaProps {
  showTraumaDialog: (
    investigator: Card,
    traumaData: Trauma,
    onUpdate?: (investigator: string, traumaData: Trauma) => void
  ) => void;
  investigatorDataUpdates: InvestigatorData;
  clearInvestigatorDataUpdates: () => void;
  traumaDialog: React.ReactNode;
}

interface VisibleState {
  investigator: Card,
  traumaData: Trauma
  onUpdate?: (investigator: string, traumaData: Trauma) => void;
}

export default function useTraumaDialog({ hideKilledInsane }: { hideKilledInsane?: boolean }): TraumaProps {
  const [state, setState] = useState<VisibleState | undefined>();
  const [investigatorData, setInvestigatorData] = useState<InvestigatorData>({});
  const updateTraumaData = useCallback((investigator: string, data: Trauma) => {
    if (state && state.onUpdate) {
      state.onUpdate(investigator, data);
    }
    setInvestigatorData({
      ...investigatorData,
      [investigator]: { ...data },
    });
  }, [state, setInvestigatorData, investigatorData]);

  const showTraumaDialog = useCallback((
    investigator: Card,
    traumaData: Trauma,
    onUpdate?: (investigator: string, traumaData: Trauma) => void
  ) => {
    setState({
      investigator: investigator,
      traumaData,
      onUpdate,
    });
  }, [setState]);

  const hideDialog = useCallback(() => {
    setState(undefined);
  }, [setState]);

  const clearInvestigatorDataUpdates = useCallback(() => {
    setInvestigatorData({});
  }, [setInvestigatorData]);

  const traumaDialog = useMemo(() => {
    return (
      <EditTraumaDialog
        visible={!!state}
        investigator={state?.investigator}
        trauma={state?.traumaData}
        updateTrauma={updateTraumaData}
        hideDialog={hideDialog}
        hideKilledInsane={hideKilledInsane}
      />
    );
  }, [state, updateTraumaData, hideDialog, hideKilledInsane]);
  return {
    investigatorDataUpdates: investigatorData,
    traumaDialog,
    showTraumaDialog,
    clearInvestigatorDataUpdates,
  };
}
