import React from 'react';

import DeckTabooPickerButton from './DeckTabooPickerButton';
import InvestigatorOptionsControl, { hasInvestigatorOptions } from './InvestigatorOptionsControl';
import { useParallelInvestigators } from '@components/core/hooks';
import { DeckMeta } from '@actions/types';
import useSingleCard from '@components/card/useSingleCard';

interface Props {
  investigatorCode?: string;
  tabooOpen?: boolean;
  editable: boolean;
  setTabooSet?: (tabooSet: number) => void;
  hideTabooPicker?: () => void;
  tabooSetId: number;
  hasPreviousDeck?: boolean;
  showTaboo?: boolean;

  meta: DeckMeta;
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  setParallel: (front: string, back: string) => void;

  firstElement?: (last: boolean) => React.ReactNode;
}

export default function DeckMetadataControls({
  investigatorCode,
  tabooOpen,
  editable,
  meta,
  setMeta,
  setParallel,
  setTabooSet,
  hideTabooPicker,
  tabooSetId,
  firstElement,
  hasPreviousDeck,
  showTaboo,
}: Props) {
  const [parallelInvestigators] = useParallelInvestigators(investigatorCode, tabooSetId);
  const [investigator] = useSingleCard(investigatorCode, 'player', tabooSetId);
  if (!investigator) {
    return null;
  }
  const hasOptions = hasInvestigatorOptions(investigator, parallelInvestigators);
  return (
    <>
      { !!firstElement && firstElement(!setTabooSet && !hasOptions) }
      { !!setTabooSet && (
        <DeckTabooPickerButton
          open={tabooOpen}
          show={showTaboo}
          disabled={!editable}
          tabooSetId={tabooSetId}
          setTabooSet={setTabooSet}
          hideTabooPicker={hideTabooPicker}
          first={!firstElement}
          last={!hasOptions}
        />
      ) }
      <InvestigatorOptionsControl
        investigator={investigator}
        meta={meta}
        parallelInvestigators={parallelInvestigators}
        setMeta={setMeta}
        setParallel={setParallel}
        editWarning={!!hasPreviousDeck}
        disabled={!editable}
        first={!setTabooSet && !firstElement}
      />
    </>
  );
}